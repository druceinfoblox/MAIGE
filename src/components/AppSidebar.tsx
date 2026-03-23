import { useState } from 'react';
import {
  LayoutDashboard, Laptop, Server, Globe, GitBranch,
  Radar, Users, ChevronDown, ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type View = 'dashboard' | 'tools' | 'users' | 'agents' | 'exposures' | 'graph';

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
};

const clientViews: View[] = ['tools', 'users'];

export const AppSidebar = ({ activeView, onNavigate }: Props) => {
  const [clientsOpen, setClientsOpen] = useState(clientViews.includes(activeView));

  const isActive = (view: View) => activeView === view;
  const isClientActive = clientViews.includes(activeView);

  const itemClass = (active: boolean) => cn(
    'w-full flex flex-col items-center justify-center py-2.5 px-1 transition-colors cursor-pointer',
    active
      ? 'bg-primary text-white'
      : 'text-foreground/50 hover:bg-black/5 hover:text-foreground/80'
  );

  const subItemClass = (active: boolean) => cn(
    'w-full flex flex-col items-center justify-center py-2 px-1 transition-colors cursor-pointer',
    active
      ? 'bg-primary text-white'
      : 'text-foreground/60 hover:bg-black/5 hover:text-foreground/80'
  );

  return (
    <aside
      className="flex flex-col h-full border-r border-border/50 shrink-0"
      style={{ backgroundColor: '#E9EFE6', width: '5.5rem' }}
    >
      <nav className="flex-1 flex flex-col items-center py-3 space-y-0.5">

        {/* Dashboard */}
        <button className={itemClass(isActive('dashboard'))} onClick={() => onNavigate('dashboard')}>
          <LayoutDashboard className="w-5 h-5 mb-1" />
          <span className="text-[10px] leading-tight font-medium">Dashboard</span>
        </button>

        {/* Clients — collapsible group */}
        <div className="w-full">
          <button
            className={cn(itemClass(isClientActive && !clientsOpen), 'relative')}
            onClick={() => setClientsOpen(!clientsOpen)}
          >
            <Laptop className="w-5 h-5 mb-1" />
            <span className="text-[10px] leading-tight font-medium">Clients</span>
            {clientsOpen
              ? <ChevronUp className="w-3 h-3 absolute bottom-1 right-2 opacity-40" />
              : <ChevronDown className="w-3 h-3 absolute bottom-1 right-2 opacity-40" />
            }
          </button>

          {clientsOpen && (
            <div className="w-full border-t border-black/10">
              <button className={subItemClass(isActive('tools'))} onClick={() => onNavigate('tools')}>
                <Radar className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] leading-tight font-medium text-center px-1">AI Tools</span>
              </button>
              <button className={subItemClass(isActive('users'))} onClick={() => onNavigate('users')}>
                <Users className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] leading-tight font-medium text-center px-1">Users</span>
                {!isActive('users') && (
                  <span className="mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-warning text-white text-[8px] font-bold">12</span>
                )}
              </button>
              <div className="border-t border-black/10" />
            </div>
          )}
        </div>

        {/* Servers */}
        <button className={itemClass(isActive('agents'))} onClick={() => onNavigate('agents')}>
          <Server className="w-5 h-5 mb-1" />
          <span className="text-[10px] leading-tight font-medium">Servers</span>
        </button>

        {/* External */}
        <button className={cn(itemClass(isActive('exposures')), 'relative')} onClick={() => onNavigate('exposures')}>
          <Globe className="w-5 h-5 mb-1" />
          <span className="text-[10px] leading-tight font-medium">External</span>
          {!isActive('exposures') && (
            <span className="absolute top-1.5 right-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-destructive text-white text-[8px] font-bold">3</span>
          )}
        </button>

        {/* Visualization */}
        <button className={itemClass(isActive('graph'))} onClick={() => onNavigate('graph')}>
          <GitBranch className="w-5 h-5 mb-1" />
          <span className="text-[10px] leading-tight font-medium">Visualization</span>
        </button>

      </nav>

      {/* Status indicator at bottom */}
      <div className="flex flex-col items-center pb-4 pt-2 border-t border-black/10">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse mb-1" />
        <span className="text-[8px] text-foreground/40 font-medium text-center leading-tight px-1">DNS live</span>
      </div>
    </aside>
  );
};
