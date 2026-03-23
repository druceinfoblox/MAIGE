import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardView } from '@/views/DashboardView';
import { ToolsView } from '@/views/ToolsView';
import { UsersView } from '@/views/UsersView';
import { AgentsView } from '@/views/AgentsView';
import { ExposuresView } from '@/views/ExposuresView';
import { GraphView } from '@/views/GraphView';
import { PolicyView } from '@/views/PolicyView';
import InfobloxLogo from '@/components/InfobloxLogo';

type View = 'dashboard' | 'tools' | 'users' | 'agents' | 'exposures' | 'graph' | 'policy';

const viewTitles: Record<View, string> = {
  dashboard: 'Dashboard',
  graph: 'Asset Graph',
  tools: 'AI Tool Inventory',
  users: 'User Mapping',
  agents: 'Internal Agents',
  exposures: 'Exposures',
  policy: 'Policy',
};

export type { View };

const Index = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">

      {/* Top nav — identical structure to Lighthouse */}
      <nav className="h-14 flex items-center px-4 justify-between sticky top-0 z-50 shrink-0" style={{ backgroundColor: '#172628' }}>
        <div className="flex items-center space-x-3">
          <InfobloxLogo className="h-[22px] w-auto text-white" />
          <div className="h-5 w-px bg-white/20" />
          <span className="text-white font-semibold text-sm tracking-wide">
            MAIGE <span className="font-normal opacity-60">(AI Governance)</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs">{viewTitles[activeView]}</span>
        </div>
      </nav>

      {/* Mint accent strip — identical to Lighthouse */}
      <div className="h-[3px] shrink-0" style={{ backgroundColor: '#98D7BF' }} />

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar activeView={activeView} onNavigate={setActiveView} />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {activeView === 'dashboard' ? (
            <DashboardView onNavigate={setActiveView} />
          ) : activeView === 'graph' ? (
            <GraphView />
          ) : activeView === 'tools' ? (
            <ToolsView />
          ) : activeView === 'users' ? (
            <UsersView />
          ) : activeView === 'agents' ? (
            <AgentsView />
          ) : activeView === 'policy' ? (
            <PolicyView />
          ) : (
            <ExposuresView />
          )}
        </main>
      </div>

      {/* Footer — identical to Lighthouse */}
      <div className="text-center text-xs text-muted-foreground py-1 border-t border-border bg-card shrink-0">
        Infoblox MAIGE &nbsp;·&nbsp; Managed AI Governance Engine
      </div>

    </div>
  );
};

export default Index;
