import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardView } from '@/views/DashboardView';
import { ToolsView } from '@/views/ToolsView';
import { UsersView } from '@/views/UsersView';
import { AgentsView } from '@/views/AgentsView';
import { ExposuresView } from '@/views/ExposuresView';
import { GraphView } from '@/views/GraphView';

type View = 'dashboard' | 'tools' | 'users' | 'agents' | 'exposures' | 'graph';

const views: Record<View, React.ComponentType> = {
  dashboard: DashboardView,
  graph: GraphView,
  tools: ToolsView,
  users: UsersView,
  agents: AgentsView,
  exposures: ExposuresView,
};

const Index = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const ActiveComponent = views[activeView];

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="ml-64 p-8">
        <ActiveComponent />
      </main>
    </div>
  );
};

export default Index;
