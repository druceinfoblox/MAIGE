import { useState } from 'react';
import { LayoutDashboard, Laptop, ChevronDown, ChevronRight, Server, Globe, GitBranch, Radar, Users } from 'lucide-react';
import InfobloxLogo from './InfobloxLogo';

type View = 'dashboard' | 'tools' | 'users' | 'agents' | 'exposures' | 'graph';

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

export const AppSidebar = ({ activeView, onNavigate }: Props) => {
  // Clients submenu open if either sub-view is active, or user has toggled it
  const clientViews: View[] = ['tools', 'users'];
  const [clientsOpen, setClientsOpen] = useState(clientViews.includes(activeView));

  const isActive = (view: View) => activeView === view;
  const isClientActive = clientViews.includes(activeView);

  const navItemClass = (active: boolean) =>
    `w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150 rounded-lg
     ${active
       ? 'bg-sidebar-accent text-[#172628] font-semibold'
       : 'text-[#3d4f41] hover:bg-sidebar-accent/60 hover:text-[#172628]'
     }`;

  const subItemClass = (active: boolean) =>
    `w-full flex items-center gap-3 pl-11 pr-4 py-2 text-sm transition-colors duration-150 rounded-lg
     ${active
       ? 'bg-sidebar-accent text-[#172628] font-semibold'
       : 'text-[#5a6e5e] hover:bg-sidebar-accent/60 hover:text-[#172628]'
     }`;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar flex flex-col z-50">

      {/* Logo — dark header matching Infoblox top nav */}
      <div className="flex items-center gap-3 px-5 py-4 bg-[#172628] border-b border-[#0d1a1c]">
        <InfobloxLogo className="h-5 w-auto text-white" />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#00BD4D] font-heading leading-none">MAIGE</p>
          <p className="text-[9px] text-white/50 uppercase tracking-wider leading-none mt-0.5">AI Governance</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">

        {/* Dashboard */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={navItemClass(isActive('dashboard'))}
        >
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          <span>Dashboard</span>
          {isActive('dashboard') && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
        </button>

        {/* Clients — collapsible group */}
        <div>
          <button
            onClick={() => setClientsOpen(!clientsOpen)}
            className={navItemClass(isClientActive && !clientsOpen)}
          >
            <Laptop className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Clients</span>
            {clientsOpen
              ? <ChevronDown className="w-3.5 h-3.5 opacity-50" />
              : <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            }
          </button>

          {clientsOpen && (
            <div className="mt-0.5 space-y-0.5">
              <button
                onClick={() => onNavigate('tools')}
                className={subItemClass(isActive('tools'))}
              >
                <Radar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>AI Tool Inventory</span>
              </button>
              <button
                onClick={() => onNavigate('users')}
                className={subItemClass(isActive('users'))}
              >
                <Users className="w-3.5 h-3.5 flex-shrink-0" />
                <span>User Mapping</span>
                <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-warning text-white text-[10px] font-bold">
                  12
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Servers */}
        <button
          onClick={() => onNavigate('agents')}
          className={navItemClass(isActive('agents'))}
        >
          <Server className="w-4 h-4 flex-shrink-0" />
          <span>Servers</span>
          {isActive('agents') && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
        </button>

        {/* External */}
        <button
          onClick={() => onNavigate('exposures')}
          className={navItemClass(isActive('exposures'))}
        >
          <Globe className="w-4 h-4 flex-shrink-0" />
          <span>External</span>
          <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-white text-[10px] font-bold">
            3
          </span>
        </button>

        {/* Visualization */}
        <button
          onClick={() => onNavigate('graph')}
          className={navItemClass(isActive('graph'))}
        >
          <GitBranch className="w-4 h-4 flex-shrink-0" />
          <span>Visualization</span>
          {isActive('graph') && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
        </button>

      </nav>

      {/* Status bar */}
      <div className="px-5 py-4 border-t border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
          <div className="text-xs">
            <p className="text-sidebar-foreground font-medium">DNS ingestion live</p>
            <p className="text-sidebar-muted">Last scan: 4 min ago</p>
          </div>
        </div>
      </div>

    </aside>
  );
};
