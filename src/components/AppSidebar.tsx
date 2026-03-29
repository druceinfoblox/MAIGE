import { useState } from 'react';
import {
  LayoutDashboard, Radar, Users, GitBranch,
  ShieldAlert, FileText, Eye, Globe, ShieldOff,
  ChevronDown, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type View = 'dashboard' | 'tools' | 'users' | 'graph' | 'ai-traffic-policy' | 'ai-prompt-policies' | 'content-inspection' | 'easm' | 'drp';

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

type NavGroup = {
  label: string;
  items: { view: View; icon: React.ElementType; label: string }[];
};

const navGroups: NavGroup[] = [
  {
    label: 'DISCOVER',
    items: [
      { view: 'tools', icon: Radar, label: 'AI Tools' },
      { view: 'users', icon: Users, label: 'Users' },
      { view: 'graph', icon: GitBranch, label: 'AI Asset Graph' },
    ],
  },
  {
    label: 'GOVERN',
    items: [
      { view: 'ai-traffic-policy', icon: ShieldAlert, label: 'AI Traffic Policy' },
      { view: 'ai-prompt-policies', icon: FileText, label: 'AI Prompt Policies' },
      { view: 'content-inspection', icon: Eye, label: 'Content Inspection' },
    ],
  },
  {
    label: 'PREEMPT',
    items: [
      { view: 'easm', icon: Globe, label: 'EASM' },
      { view: 'drp', icon: ShieldOff, label: 'DRP — Digital Risk' },
    ],
  },
];

export const AppSidebar = ({ activeView, onNavigate }: Props) => {
  // All groups start expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navGroups.map(g => [g.label, true]))
  );

  const toggle = (label: string) =>
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));

  const isActive = (view: View) => activeView === view;

  return (
    <aside
      className="flex flex-col h-full border-r border-border/50 shrink-0 select-none"
      style={{ backgroundColor: '#e9ecec', width: '13rem' }}
    >
      <nav className="flex-1 flex flex-col py-3 overflow-y-auto">

        {/* Dashboard — standalone */}
        <button
          className={cn(
            'flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors cursor-pointer',
            isActive('dashboard')
              ? 'bg-[#d0d6d6] border-l-[3px] border-[#2c3436] text-[#2b2f31] font-semibold'
              : 'border-l-[3px] border-transparent text-[#7e8588] hover:bg-[#dde3e3]',
          )}
          onClick={() => onNavigate('dashboard')}
        >
          <LayoutDashboard className="w-[18px] h-[18px] shrink-0" />
          <span>Dashboard</span>
        </button>

        {/* Collapsible groups */}
        {navGroups.map(group => {
          const open = expanded[group.label];
          const groupActive = group.items.some(i => isActive(i.view));

          return (
            <div key={group.label} className="mt-3">
              {/* Group header */}
              <button
                onClick={() => toggle(group.label)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-1.5 cursor-pointer',
                  'text-[10px] font-bold uppercase tracking-[0.08em] transition-colors',
                  groupActive ? 'text-[#2b2f31]' : 'text-[#7e8588] hover:text-[#4a5053]',
                )}
              >
                <span>{group.label}</span>
                {open
                  ? <ChevronDown className="w-3 h-3 opacity-50" />
                  : <ChevronRight className="w-3 h-3 opacity-50" />
                }
              </button>

              {/* Sub-items */}
              {open && (
                <div className="mt-0.5">
                  {group.items.map(item => {
                    const active = isActive(item.view);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.view}
                        className={cn(
                          'w-full flex items-center gap-2.5 pl-6 pr-4 py-2 text-[13px] transition-colors cursor-pointer',
                          active
                            ? 'bg-[#d0d6d6] border-l-[3px] border-[#2c3436] text-[#2b2f31] font-semibold'
                            : 'border-l-[3px] border-transparent text-[#7e8588] hover:bg-[#dde3e3]',
                        )}
                        onClick={() => onNavigate(item.view)}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Status indicator at bottom */}
      <div className="flex flex-col items-center pb-4 pt-2 border-t border-black/10">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse mb-1" />
        <span className="text-[8px] text-foreground/40 font-medium text-center leading-tight px-1">DNS live</span>
      </div>
    </aside>
  );
};
