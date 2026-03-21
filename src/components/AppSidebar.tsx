import { LayoutDashboard, Radar, Users, Server, Globe, GitBranch } from 'lucide-react';
import InfobloxLogo from './InfobloxLogo';

type View = 'dashboard' | 'tools' | 'users' | 'agents' | 'exposures' | 'graph';

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

type NavSection = {
  label: string;
  items: { id: View; label: string; icon: typeof LayoutDashboard; badge?: number; dotColor: string }[];
};

const navSections: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Findings', icon: LayoutDashboard, dotColor: 'bg-primary' },
    ],
  },
  {
    label: 'Client-Side',
    items: [
      { id: 'tools', label: 'AI Tool Inventory', icon: Radar, dotColor: 'bg-[hsl(200,80%,55%)]' },
      { id: 'users', label: 'User Mapping', icon: Users, badge: 12, dotColor: 'bg-warning' },
    ],
  },
  {
    label: 'Server-Side',
    items: [
      { id: 'agents', label: 'Internal Agents', icon: Server, dotColor: 'bg-[hsl(200,80%,55%)]' },
    ],
  },
  {
    label: 'External',
    items: [
      { id: 'exposures', label: 'External Exposure', icon: Globe, badge: 3, dotColor: 'bg-destructive' },
    ],
  },
  {
    label: 'Visualization',
    items: [
      { id: 'graph', label: 'Asset Graph', icon: GitBranch, dotColor: 'bg-[hsl(280,60%,55%)]' },
    ],
  },
];

export const AppSidebar = ({ activeView, onNavigate }: Props) => {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
        <InfobloxLogo className="h-5 w-auto text-white" />
      </div>
      <div className="px-6 -mt-1 pb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary font-heading">AgentView</p>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-3 py-1 space-y-4 overflow-y-auto scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-muted font-heading px-3 mb-1.5">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                      ${isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                      }
                    `}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dotColor}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Status bar */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <div className="text-xs">
            <p className="text-sidebar-accent-foreground font-medium">DNS ingestion live</p>
            <p className="text-sidebar-muted">Last scan: 4 min ago</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
