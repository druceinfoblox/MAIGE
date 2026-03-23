import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardView } from '@/views/DashboardView';
import { ToolsView } from '@/views/ToolsView';
import { UsersView } from '@/views/UsersView';
import { AgentsView } from '@/views/AgentsView';
import { ExposuresView } from '@/views/ExposuresView';
import { GraphView } from '@/views/GraphView';

type View = 'dashboard' | 'tools' | 'users' | 'agents' | 'exposures' | 'graph';

const viewTitles: Record<View, string> = {
  dashboard: 'Findings',
  graph: 'Asset Graph',
  tools: 'AI Tool Inventory',
  users: 'User Mapping',
  agents: 'Internal Agents',
  exposures: 'External Exposures',
};

export type { View };

const Index = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar activeView={activeView} onNavigate={setActiveView} />
      {/* Top nav bar — spans content area to the right of sidebar */}
      <header className="fixed top-0 left-64 right-0 h-14 bg-[#172628] z-40 flex items-center px-6 justify-between border-b border-[#0d1a1c]">
        <span className="text-white/70 text-sm font-medium">{viewTitles[activeView]}</span>
        <span className="text-[#00BD4D] text-xs font-semibold uppercase tracking-widest">Managed AI Governance Engine</span>
      </header>
      <main className="ml-64 pt-14 p-8">
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
        ) : (
          <ExposuresView />
        )}
      </main>
    </div>
  );
};

export default Index;
