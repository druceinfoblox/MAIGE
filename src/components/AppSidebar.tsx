import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

const baseNavGroups: NavGroup[] = [
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

const dnsAidGroup: NavGroup = {
  id: 'dnsaid',
  label: 'DNS AID',
  icon: LifeBuoy,
  items: [
    { view: 'agent-registry', icon: Database, label: 'Agent Registry' },
    { view: 'agent-trust-policy', icon: ShieldCheck, label: 'Agent Trust Policy' },
  ],
};

const CLOSE_DELAY = 300;

export const AppSidebar = ({ activeView, onNavigate }: Props) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [dnsAidEnabled, setDnsAidEnabled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const railItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const navGroups = dnsAidEnabled ? [...baseNavGroups, dnsAidGroup] : baseNavGroups;

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

        {/* DNS AID toggle — pinned to bottom, separated by border */}
        <div className="shrink-0 border-t border-black/10">
          <button
            className="flex flex-col items-center justify-center w-full border-l-4 border-transparent cursor-pointer transition-colors"
            style={{
              height: 56,
              backgroundColor: dnsAidEnabled ? 'rgba(22,163,74,0.12)' : 'transparent',
              color: dnsAidEnabled ? '#16a34a' : '#7e8588',
            }}
            title={dnsAidEnabled ? 'DNS AID ON — click to disable' : 'DNS AID OFF — click to enable'}
            onClick={() => {
              setDnsAidEnabled(prev => !prev);
              // if turning off and currently on a DNS AID view, go back to dashboard
              if (dnsAidEnabled && (activeView === 'agent-registry' || activeView === 'agent-trust-policy')) {
                onNavigate('dashboard');
              }
            }}
          >
            <LifeBuoy className="w-5 h-5" style={{ color: 'inherit' }} />
            <span className="text-[8px] leading-tight text-center mt-0.5 font-medium" style={{ color: 'inherit' }}>
              {dnsAidEnabled ? 'DNS AID ON' : 'DNS AID OFF'}
            </span>
          </button>
        </div>
      </aside>

      {/* Flyout panels — rendered via portal to escape overflow:hidden parents */}
      {navGroups.map(group => {
        if (openGroup !== group.id) return null;

        const flyoutTop = getFlyoutTop(group.id);
        const flyoutItems = group.items;

        return createPortal(
          <div
            key={`flyout-${group.id}`}
            style={{
              position: 'fixed',
              left: 60,
              top: flyoutTop,
              width: 224,
              zIndex: 9999,
              boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
              borderRadius: '0 4px 4px 0',
            }}
            onMouseEnter={handleFlyoutEnter}
            onMouseLeave={handleFlyoutLeave}
          >
            {/* Flyout header */}
            <div
              style={{
                height: 48,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 20,
                fontWeight: 700,
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                backgroundColor: '#c9d7da',
                color: '#1b3337',
                borderRadius: '0 4px 0 0',
              }}
            >
              {group.label}
            </div>

            {/* Sub-items */}
            <div style={{ backgroundColor: '#d7e3e6', borderRadius: '0 0 4px 0' }}>
              {flyoutItems.map((item, idx) => {
                const SubIcon = item.icon;
                const active = activeView === item.view;

                return (
                  <button
                    key={item.view}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      height: 44,
                      paddingLeft: active ? 12 : 16,
                      paddingRight: 16,
                      fontSize: 13,
                      color: '#263238',
                      fontWeight: active ? 600 : 400,
                      backgroundColor: active ? '#d0d6d6' : 'transparent',
                      borderLeft: active ? '4px solid #2c3436' : '4px solid transparent',
                      borderBottom: idx < flyoutItems.length - 1 ? '1px solid #d0d6d6' : 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(24,44,52,0.06)'; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                    onClick={() => handleSubItemClick(item.view)}
                  >
                    <SubIcon style={{ width: 16, height: 16, flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        );
      })}
    </>
  );
};
