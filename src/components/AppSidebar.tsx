import { LayoutDashboard, Radar, Users, Server, Globe, Shield } from 'lucide-react';

type View = 'dashboard' | 'tools' | 'users' | 'agents' | 'exposures';

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'tools', label: 'AI Tools', icon: Radar },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'agents', label: 'Internal Agents', icon: Server },
  { id: 'exposures', label: 'Exposures', icon: Globe },
];

export const AppSidebar = ({ activeView, onNavigate }: Props) => {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar flex flex-col z-50">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Shield className="w-4.5 h-4.5 text-sidebar-primary-foreground" size={18} />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-sidebar-accent-foreground tracking-tight">AgentSight</h1>
          <p className="text-[11px] text-sidebar-muted">AI Visibility Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                ${isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                }
              `}
            >
              <item.icon size={18} className={isActive ? 'text-sidebar-primary' : ''} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-accent-foreground">
            AC
          </div>
          <div className="text-xs">
            <p className="text-sidebar-accent-foreground font-medium">Acme Corp</p>
            <p className="text-sidebar-muted">Enterprise</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
