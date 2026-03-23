import { useState, useCallback, useEffect } from 'react';

export type EntityType = 'tool' | 'user' | 'agent' | 'exposure';

export type PolicyRule = {
  id: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;   // primary display name (tool name, email, hostname, domain)
  entityDetail: string; // secondary detail (domain, dept, protocol, endpoint)
  action: 'block';
  createdAt: string;    // ISO timestamp
};

const STORAGE_KEY = 'maige_policy_rules';

function loadRules(): PolicyRule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRules(rules: PolicyRule[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
}

// ─── Singleton state so all views share the same in-memory list ──────────────
let _rules: PolicyRule[] = loadRules();
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach(fn => fn());
}

export function usePolicyStore() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const fn = () => forceUpdate(n => n + 1);
    _listeners.add(fn);
    return () => { _listeners.delete(fn); };
  }, []);

  const isBlocked = useCallback((entityId: string) => {
    return _rules.some(r => r.entityId === entityId);
  }, []);

  const toggle = useCallback((rule: Omit<PolicyRule, 'id' | 'action' | 'createdAt'>) => {
    const existing = _rules.find(r => r.entityId === rule.entityId);
    if (existing) {
      _rules = _rules.filter(r => r.entityId !== rule.entityId);
    } else {
      _rules = [
        ..._rules,
        {
          ...rule,
          id: `${rule.entityId}-${Date.now()}`,
          action: 'block',
          createdAt: new Date().toISOString(),
        },
      ];
    }
    saveRules(_rules);
    notify();
  }, []);

  const remove = useCallback((entityId: string) => {
    _rules = _rules.filter(r => r.entityId !== entityId);
    saveRules(_rules);
    notify();
  }, []);

  const rules = _rules;
  const count = rules.length;

  return { rules, count, isBlocked, toggle, remove };
}
