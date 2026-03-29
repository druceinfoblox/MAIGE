import { useState } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { DigitalRiskDetailPanel } from '@/components/DigitalRiskDetailPanel';
import { BlockButton } from '@/components/BlockButton';
import {
  digitalRiskItems,
  type DigitalRiskItem,
} from '@/data/mock';

// ── Helpers ──

const riskVariant = (r: string) => {
  const l = r.toLowerCase();
  if (l === 'critical') return 'critical' as const;
  if (l === 'high') return 'warning' as const;
  return 'neutral' as const;
};

const statusBadgeVariant = (s: string) => {
  if (s === 'ACTIVE' || s === 'OPEN') return 'critical' as const;
  if (s === 'INVESTIGATING') return 'warning' as const;
  if (s === 'REPORTED' || s === 'RESOLVED') return 'success' as const;
  return 'neutral' as const;
};

// ── Metrics ──
const drTotal = digitalRiskItems.length;
const drOpen = digitalRiskItems.filter(i => i.status === 'OPEN').length;
const drInvestigating = digitalRiskItems.filter(i => i.status === 'INVESTIGATING').length;
const drCritical = digitalRiskItems.filter(i => i.risk === 'Critical').length;

export const DRPView = () => {
  const [selectedDR, setSelectedDR] = useState<DigitalRiskItem | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">DRP — Digital Risk</h2>
        <p className="text-sm text-muted-foreground mt-1">Leaked credentials, rogue agents, and sensitive data exposures detected across public sources</p>
      </div>

      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Total Risks</p>
            <p className="text-2xl font-bold text-foreground">{drTotal}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Open</p>
            <p className="text-2xl font-bold text-destructive">{drOpen}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Investigating</p>
            <p className="text-2xl font-bold text-amber-600">{drInvestigating}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Critical</p>
            <p className="text-2xl font-bold text-destructive">{drCritical}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Sources Monitored</p>
            <p className="text-2xl font-bold text-foreground">8</p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-accent/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Finding</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detected</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10" />
                </tr>
              </thead>
              <tbody>
                {digitalRiskItems.map((item) => (
                  <tr key={item.id} onClick={() => setSelectedDR(item)} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5 font-medium text-card-foreground max-w-[300px]">{item.finding}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{item.source}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={item.risk} variant={riskVariant(item.risk)} />
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{item.detected}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={item.status} variant={statusBadgeVariant(item.status)} />
                    </td>
                    <td className="px-2 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                      <BlockButton
                        compact
                        entityId={item.id}
                        entityType="exposure"
                        entityName={item.finding}
                        entityDetail={`${item.source} — ${item.risk}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-2.5 border-t border-border text-xs text-muted-foreground">
            Showing {digitalRiskItems.length} digital risk findings
          </div>
        </div>
      </ScrollReveal>

      <DigitalRiskDetailPanel item={selectedDR} onClose={() => setSelectedDR(null)} />
    </div>
  );
};
