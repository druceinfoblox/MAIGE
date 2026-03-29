import { useState, useRef, useCallback } from 'react';
import {
  LayoutDashboard, Search, Shield, Radar,
  Users, GitBranch, ShieldOff, MessageSquare,
  Eye, TriangleAlert, Globe, LifeBuoy,
  Database, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type View = 'dashboard' | 'tools' | 'users' | 'graph' | 'ai-traffic-policy' | 'ai-prompt-policies' | 'content-inspection' | 'easm' | 'drp' | 'agent-registry' | 'agent-trust-policy';

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

type NavGroup = {
  id: string;
  label: string;
  icon: React.ElementType;
  items: { view: View; icon: React.ElementType; label: string }[];
};

const navGroups: NavGroup[] = [
  {
    id: 'discover',
    label: 'DISCOVER',
    icon: Search,
    items: [
      { view: 'tools', icon: Radar, label: 'AI Tools' },
      { view: 'users', icon: Users, label: 'Users' },
      { view: 'graph', icon: GitBranch, label: 'AI Asset Graph' },
    ],
  },
  {
    id: 'govern',
    label: 'GOVERN',
    icon: Shield,
    items: [
      { view: 'ai-traffic-policy', icon: ShieldOff, label: 'AI Traffic Policy' },
      { view: 'ai-prompt-policies', icon: MessageSquare, label: 'AI Prompt Policies' },
      { view: 'content-inspection', icon: Eye, label: 'Content Inspection' },
    ],
  },
  {
    id: 'preempt',
    label: 'PREEMPT',
    icon: Radar,
    items: [
      { view: 'easm', icon: TriangleAlert, label: 'EASM' },
      { view: 'drp', icon: Globe, label: 'DRP — Digital Risk' },
    ],
  },
];

const CLOSE_DELAY = 150;

export const AppSidebar = ({ activeView, onNavigate }: Props) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [dnsAidEnabled, setDnsAidEnabled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const railItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpenGroup(null);
    }, CLOSE_DELAY);
  }, [cancelClose]);

  const handleRailEnter = useCallback((groupId: string) => {
    cancelClose();
    setOpenGroup(groupId);
  }, [cancelClose]);

  const handleFlyoutEnter = useCallback(() => {
    cancelClose();
  }, [cancelClose]);

  const handleFlyoutLeave = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  const handleRailLeave = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  const handleSubItemClick = useCallback((view: View) => {
    onNavigate(view);
    setOpenGroup(null);
    cancelClose();
  }, [onNavigate, cancelClose]);

  const isGroupActive = (group: NavGroup) =>
    group.items.some(item => item.view === activeView);

  // Compute flyout top position based on rail button offset
  const getFlyoutTop = (groupId: string): number => {
    const el = railItemRefs.current[groupId];
    if (el) {
      return el.getBoundingClientRect().top;
    }
    return 120; // fallback
  };

  return (
    <>
      {/* Icon rail — 64px, full height */}
      <aside
        className="flex flex-col h-full shrink-0 select-none"
        style={{ backgroundColor: '#e9ecec', width: 64 }}
      >
        <nav className="flex-1 flex flex-col pt-2">

          {/* Dashboard — direct navigate, no flyout */}
          <button
            className={cn(
              'flex flex-col items-center justify-center cursor-pointer transition-colors',
              'w-full border-l-4',
              activeView === 'dashboard'
                ? 'border-[#2c3436] bg-[#d0d6d6]'
                : 'border-transparent hover:bg-[#dde3e3]',
            )}
            style={{ height: 56 }}
            onClick={() => onNavigate('dashboard')}
          >
            <LayoutDashboard className="w-5 h-5 text-[#263238]" />
            <span className="text-[10px] mt-0.5 text-[#263238] leading-tight">Dashboard</span>
          </button>

          {/* Group rail items */}
          {navGroups.map(group => {
            const Icon = group.icon;
            const groupIsActive = isGroupActive(group);

            return (
              <button
                key={group.id}
                ref={el => { railItemRefs.current[group.id] = el; }}
                className={cn(
                  'flex flex-col items-center justify-center cursor-pointer transition-colors',
                  'w-full border-l-4',
                  groupIsActive
                    ? 'border-[#2c3436] bg-[#d0d6d6]'
                    : 'border-transparent hover:bg-[#dde3e3]',
                )}
                style={{ height: 56 }}
                onMouseEnter={() => handleRailEnter(group.id)}
                onMouseLeave={handleRailLeave}
                onClick={() => handleRailEnter(group.id)}
              >
                <Icon className="w-5 h-5 text-[#263238]" />
                <span className="text-[10px] mt-0.5 text-[#263238] leading-tight">{group.label}</span>
              </button>
            );
          })}
        </nav>

        {/* DNS AID toggle */}
        <button
          className="flex flex-col items-center justify-center w-full border-l-4 border-transparent transition-colors"
          style={{
            height: 56,
            backgroundColor: dnsAidEnabled ? 'rgba(22,163,74,0.10)' : 'transparent',
            color: dnsAidEnabled ? '#16a34a' : '#7e8588',
          }}
          onClick={() => setDnsAidEnabled(prev => !prev)}
        >
          <LifeBuoy className="w-5 h-5" style={{ color: 'inherit' }} />
          <span className="text-[8px] leading-tight text-center mt-0.5" style={{ color: 'inherit' }}>
            {dnsAidEnabled ? 'DNS AID ON' : 'DNS AID OFF'}
          </span>
        </button>

        {/* DNS live indicator at bottom of rail */}
        <div className="flex flex-col items-center pb-4 pt-2 border-t border-black/10">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse mb-1" />
          <span className="text-[8px] text-foreground/40 font-medium text-center leading-tight px-1">DNS live</span>
        </div>
      </aside>

      {/* Flyout panels — fixed positioned, overlay on content */}
      {navGroups.map(group => {
        if (openGroup !== group.id) return null;

        // Inject DNS AID items into GOVERN flyout when enabled
        const flyoutItems = group.id === 'govern' && dnsAidEnabled
          ? [
              ...group.items,
              { view: 'agent-registry' as View, icon: Database, label: 'Agent Registry' },
              { view: 'agent-trust-policy' as View, icon: ShieldCheck, label: 'Agent Trust Policy' },
            ]
          : group.items;

        return (
          <div
            key={`flyout-${group.id}`}
            className="fixed"
            style={{
              left: 64,
              top: getFlyoutTop(group.id),
              width: 220,
              zIndex: 50,
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            }}
            onMouseEnter={handleFlyoutEnter}
            onMouseLeave={handleFlyoutLeave}
          >
            {/* Flyout header */}
            <div
              className="flex items-center px-5 font-bold uppercase text-[13px] tracking-wide"
              style={{
                height: 48,
                backgroundColor: '#c9d7da',
                color: '#1b3337',
              }}
            >
              {group.label}
            </div>

            {/* Sub-items */}
            <div style={{ backgroundColor: '#d7e3e6' }}>
              {flyoutItems.map((item, idx) => {
                const SubIcon = item.icon;
                const active = activeView === item.view;

                return (
                  <button
                    key={item.view}
                    className={cn(
                      'w-full flex items-center gap-2.5 cursor-pointer transition-colors',
                      'border-l-4',
                      active
                        ? 'bg-[#d0d6d6] border-[#2c3436] font-semibold'
                        : 'border-transparent hover:bg-[rgba(24,44,52,0.06)]',
                    )}
                    style={{
                      height: 44,
                      paddingLeft: 16,
                      paddingRight: 16,
                      fontSize: 13,
                      color: '#263238',
                      borderBottom: idx < flyoutItems.length - 1 ? '1px solid #d0d6d6' : undefined,
                    }}
                    onClick={() => handleSubItemClick(item.view)}
                  >
                    <SubIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};
