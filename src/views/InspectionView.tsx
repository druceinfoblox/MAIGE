import { useState } from 'react';
import { Eye, ChevronDown, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { inspectionPolicies } from '@/data/mock';

export const InspectionView = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalFindings = inspectionPolicies.reduce((s, p) => s + p.findings, 0);
  const criticalHigh = 7; // static per spec
  const blocked = 6;      // static per spec

  const toggle = (id: string) => setExpandedId(prev => (prev === id ? null : id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Content Inspection</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Inspect AI traffic for sensitive data, credentials, source code, and customer information
        </p>
      </div>

      {/* Metric cards */}
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Active Policies</p>
            <p className="text-2xl font-bold text-foreground">3</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Total Findings</p>
            <p className="text-2xl font-bold text-foreground">{totalFindings}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Critical / High</p>
            <p className="text-2xl font-bold text-destructive">{criticalHigh}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Blocked</p>
            <p className="text-2xl font-bold text-foreground">{blocked}</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Active Inspection Policies */}
      <ScrollReveal delay={0.05}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-foreground">Active Inspection Policies</h3>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm divide-y divide-border overflow-hidden">
            {inspectionPolicies.map((policy) => {
              const isOpen = expandedId === policy.id;
              return (
                <div key={policy.id}>
                  {/* Row */}
                  <button
                    onClick={() => toggle(policy.id)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-accent/30 transition-colors"
                  >
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                      : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    }
                    <span className="font-semibold text-sm text-foreground flex-1">{policy.name}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                        policy.type === 'TOOL'
                          ? 'bg-blue-500/15 text-blue-600'
                          : 'bg-purple-500/15 text-purple-700'
                      }`}
                    >
                      {policy.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{policy.findings} findings</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                  </button>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="px-5 pb-4 pl-12 flex items-center gap-6 text-xs text-muted-foreground">
                      <span>Created: {policy.created}</span>
                      <span>Last Finding: {policy.lastFinding}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-success/15 text-success uppercase tracking-wide">
                        enabled
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
