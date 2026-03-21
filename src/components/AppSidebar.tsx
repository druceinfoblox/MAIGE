import { LayoutDashboard, Radar, Users, Server, Globe } from 'lucide-react';
import InfobloxLogo from './InfobloxLogo';

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
      <div className="flex items-center px-6 py-5 border-b border-sidebar-border">
        <InfobloxLogo className="h-5 w-auto text-white" />
      </div>

      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-muted font-heading">AI Visibility</p>
      </div>

      <nav className="flex-1 px-3 py-1 space-y-0.5">
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
              <item.icon size={18} className={isActive ? 'text-primary' : ''} />
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
