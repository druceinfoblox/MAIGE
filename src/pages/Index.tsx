import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardView } from '@/views/DashboardView';
import { ToolsView } from '@/views/ToolsView';
import { UsersView } from '@/views/UsersView';
import { GraphView } from '@/views/GraphView';
import { AITrafficPolicyView } from '@/views/AITrafficPolicyView';
import { AIPromptPoliciesView } from '@/views/AIPromptPoliciesView';
import { InspectionView } from '@/views/InspectionView';
import { EASMView } from '@/views/EASMView';
import { DRPView } from '@/views/DRPView';
import InfobloxLogo from '@/components/InfobloxLogo';

type View = 'dashboard' | 'tools' | 'users' | 'graph' | 'ai-traffic-policy' | 'ai-prompt-policies' | 'content-inspection' | 'easm' | 'drp';

const viewTitles: Record<View, string> = {
  dashboard: 'Dashboard',
  tools: 'AI Tool Inventory',
  users: 'User Mapping',
  graph: 'AI Asset Graph',
  'ai-traffic-policy': 'AI Traffic Policy',
  'ai-prompt-policies': 'AI Prompt Policies',
  'content-inspection': 'Content Inspection',
  easm: 'EASM — AI Attack Surface',
  drp: 'DRP — Digital Risk',
};

export type { View };

const Index = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">

      {/* Top nav */}
      <nav className="h-14 flex items-center px-4 justify-between sticky top-0 z-50 shrink-0" style={{ backgroundColor: '#15202a' }}>
        <div className="flex items-center space-x-3">
          <InfobloxLogo className="h-[22px] w-auto text-white" />
          <div className="h-5 w-px bg-white/20" />
          <span className="text-white font-semibold text-sm tracking-wide">
            MAIGE <span className="font-normal opacity-60">(AI Governance)</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs">{viewTitles[activeView]}</span>
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border border-[#9fc2e8] text-[#2b86c6] bg-transparent hover:border-[#3a8ecf] hover:bg-[#e8f5fb] transition-colors"
          >
            <Sparkles size={14} />
            Ask Infoblox IQ
          </button>
        </div>
      </nav>

      {/* Mint accent strip */}
      <div className="h-[3px] shrink-0" style={{ backgroundColor: '#98D7BF' }} />

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar activeView={activeView} onNavigate={setActiveView} />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {activeView === 'dashboard' ? (
            <DashboardView onNavigate={setActiveView} />
          ) : activeView === 'tools' ? (
            <ToolsView />
          ) : activeView === 'users' ? (
            <UsersView />
          ) : activeView === 'graph' ? (
            <GraphView />
          ) : activeView === 'ai-traffic-policy' ? (
            <AITrafficPolicyView />
          ) : activeView === 'ai-prompt-policies' ? (
            <AIPromptPoliciesView />
          ) : activeView === 'content-inspection' ? (
            <InspectionView />
          ) : activeView === 'easm' ? (
            <EASMView />
          ) : activeView === 'drp' ? (
            <DRPView />
          ) : null}
        </main>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground py-1 border-t border-border bg-card shrink-0">
        Infoblox MAIGE &nbsp;·&nbsp; Managed AI Governance Engine
      </div>

    </div>
  );
};

export default Index;
