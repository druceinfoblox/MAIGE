import { useState } from 'react';
import { cn } from '@/lib/utils';

type View =
  | 'dashboard'
  | 'tools'
  | 'users'
  | 'graph'
  | 'ai-traffic-policy'
  | 'ai-prompt-policies'
  | 'content-inspection'
  | 'easm'
  | 'drp'
  | 'agent-registry'
  | 'agent-trust-policy';

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

type NavItem = { view: View; label: string };

const sections: { label: string; items: NavItem[] }[] = [
  {
    label: 'DISCOVER',
    items: [
      { view: 'tools',  label: 'AI Tools' },
      { view: 'users',  label: 'Users' },
      { view: 'graph',  label: 'AI Asset Graph' },
    ],
  },
  {
    label: 'GOVERN',
    items: [
      { view: 'ai-traffic-policy',   label: 'AI Traffic Policy' },
      { view: 'ai-prompt-policies',  label: 'AI Prompt Policies' },
      { view: 'content-inspection',  label: 'Content Inspection' },
    ],
  },
  {
    label: 'PREEMPT',
    items: [
      { view: 'easm', label: 'EASM — AI Attack Surface' },
      { view: 'drp',  label: 'DRP — Digital Risk' },
    ],
  },
];

const dnsAidItems: NavItem[] = [
  { view: 'agent-registry',     label: 'Agent Registry' },
  { view: 'agent-trust-policy', label: 'Agent Trust Policy' },
];

export const AppSidebar = ({ activeView, onNavigate }: Props) => {
  const [dnsAidEnabled, setDnsAidEnabled] = useState(false);

  const handleToggle = () => {
    const next = !dnsAidEnabled;
    setDnsAidEnabled(next);
    // If DNS AID is being turned off and we're on an AID-only view, go to dashboard
    if (!next && (activeView === 'agent-registry' || activeView === 'agent-trust-policy')) {
      onNavigate('dashboard');
    }
  };

  const navItem = (item: NavItem) => {
    const active = activeView === item.view;
    return (
      <button
        key={item.view}
        onClick={() => onNavigate(item.view)}
        className={cn(
          'w-full text-left px-5 py-2.5 text-sm transition-colors border-l-4 cursor-pointer',
          active
            ? 'border-[#1b5e20] bg-[#e8f5e9] text-[#1b5e20] font-semibold'
            : 'border-transparent text-[#333] hover:bg-[#f0f0f0]',
        )}
      >
        {item.label}
      </button>
    );
  };

  return (
    <aside
      className="flex flex-col h-full shrink-0 select-none border-r border-[#e0e0e0]"
      style={{ backgroundColor: '#ffffff', width: 220 }}
    >
      {/* Dashboard — top standalone item */}
      <button
        onClick={() => onNavigate('dashboard')}
        className={cn(
          'w-full text-left px-5 py-3 text-sm font-medium transition-colors border-l-4 cursor-pointer',
          activeView === 'dashboard'
            ? 'border-[#1b5e20] bg-[#e8f5e9] text-[#1b5e20] font-semibold'
            : 'border-transparent text-[#333] hover:bg-[#f0f0f0]',
        )}
      >
        Dashboard
      </button>

      <div className="border-t border-[#e0e0e0] my-1" />

      {/* Main nav sections */}
      <nav className="flex-1 overflow-y-auto py-2">
        {sections.map(section => (
          <div key={section.label} className="mb-4">
            {/* Section heading */}
            <div className="px-5 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-[#888]">
              {section.label}
            </div>
            {section.items.map(navItem)}
          </div>
        ))}

        {/* DNS AID divider + toggle */}
        <div className="border-t border-[#e0e0e0] mx-4 mt-2 mb-3" />

        <div className="px-5 py-2 flex items-center justify-between">
          {/* Toggle switch */}
          <button
            role="switch"
            aria-checked={dnsAidEnabled}
            onClick={handleToggle}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Pill track */}
            <span
              className="relative inline-flex shrink-0 rounded-full transition-colors duration-200"
              style={{
                width: 40,
                height: 22,
                backgroundColor: dnsAidEnabled ? '#2e7d32' : '#ccc',
              }}
            >
              {/* Thumb */}
              <span
                className="absolute top-[3px] rounded-full bg-white shadow transition-transform duration-200"
                style={{
                  width: 16,
                  height: 16,
                  left: 3,
                  transform: dnsAidEnabled ? 'translateX(18px)' : 'translateX(0)',
                }}
              />
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: dnsAidEnabled ? '#2e7d32' : '#555' }}
            >
              DNS AID
            </span>
          </button>

          <span
            className="text-[10px] font-medium"
            style={{ color: dnsAidEnabled ? '#2e7d32' : '#aaa' }}
          >
            {dnsAidEnabled ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* DNS AID sub-items — only when enabled */}
        {dnsAidEnabled && (
          <div className="mt-1">
            {dnsAidItems.map(navItem)}
          </div>
        )}
      </nav>
    </aside>
  );
};
