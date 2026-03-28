import { useState, useEffect, useCallback } from 'react';

export type PromptPolicy = {
  id: string;
  name: string;
  redactList: string[];   // selected data type IDs
  createdAt: string;      // ISO timestamp
  updatedAt: string;
};

export const REDACT_DATA_TYPES = [
  'EMAIL_ADDRESS',
  'PHONE_NUMBER',
  'IP_ADDRESS',
  'IBAN_CODE',
  'US_BANK_NUMBER',
  'UK_NINO',
  'URL',
  'US_DRIVER_LICENSE',
  'SSN',
  'CREDIT_CARD',
  'DATE_OF_BIRTH',
  'PASSPORT_NUMBER',
  'AWS_ACCESS_KEY',
  'API_KEY',
  'PASSWORD',
  'PERSON_NAME',
  'ADDRESS',
  'MEDICAL_RECORD',
  'CRYPTO_WALLET',
  'NPI_NUMBER',
];

const STORAGE_KEY = 'maige_prompt_policies';

function loadPolicies(): PromptPolicy[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePolicies(policies: PromptPolicy[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(policies));
}

// ─── Singleton state so all consumers share the same in-memory list ──────────
let _policies: PromptPolicy[] = loadPolicies();
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach(fn => fn());
}

export function usePromptPolicyStore() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const fn = () => forceUpdate(n => n + 1);
    _listeners.add(fn);
    return () => { _listeners.delete(fn); };
  }, []);

  const add = useCallback((name: string, redactList: string[]) => {
    const now = new Date().toISOString();
    _policies = [
      ..._policies,
      {
        id: `pp-${Date.now()}`,
        name,
        redactList,
        createdAt: now,
        updatedAt: now,
      },
    ];
    savePolicies(_policies);
    notify();
  }, []);

  const update = useCallback((id: string, name: string, redactList: string[]) => {
    _policies = _policies.map(p =>
      p.id === id
        ? { ...p, name, redactList, updatedAt: new Date().toISOString() }
        : p
    );
    savePolicies(_policies);
    notify();
  }, []);

  const remove = useCallback((id: string) => {
    _policies = _policies.filter(p => p.id !== id);
    savePolicies(_policies);
    notify();
  }, []);

  return { policies: _policies, add, update, remove };
}
