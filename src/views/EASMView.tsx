import { useState } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { AttackSurfaceDetailPanel } from '@/components/AttackSurfaceDetailPanel';
import { BlockButton } from '@/components/BlockButton';
import {
  attackSurfaceItems,
  type AttackSurfaceItem,
} from '@/data/mock';

// ── Helpers ──

const riskVariant = (r: string) => {
  const l = r.toLowerCase();
  if (l === 'critical') return 'critical' as const;
  if (l === 'high') return 'warning' as const;
  return 'neutral' as const;
};

const typeBadgeVariant = (t: string) => {
  if (t === 'Impersonation') return 'critical' as const;
  if (t === 'Exact Match') return 'warning' as const;
  return 'neutral' as const;
};

const statusBadgeVariant = (s: string) => {
  if (s === 'ACTIVE' || s === 'OPEN') return 'critical' as const;
  if (s === 'INVESTIGATING') return 'warning' as const;
  if (s === 'REPORTED' || s === 'RESOLVED') return 'success' as const;
  return 'neutral' as const;
};

// ── Metrics ──
const asTotal = attackSurfaceItems.length;
const asCritHigh = attackSurfaceItems.filter(i => i.severity === 'Critical' || i.severity === 'High').length;
const asActive = attackSurfaceItems.filter(i => i.status === 'ACTIVE').length;
const asImpersonations = attackSurfaceItems.filter(i => i.type === 'Impersonation').length;

export const EASMView = () => {
  const [selectedAS, setSelectedAS] = useState<AttackSurfaceItem | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">EASM — AI Attack Surface</h2>
        <p className="text-sm text-muted-foreground mt-1">Brand impersonation and unauthorized AI agent listings detected across public registries</p>
      </div>

      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Total Findings</p>
            <p className="text-2xl font-bold text-foreground">{asTotal}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Critical + High</p>
            <p className="text-2xl font-bold text-destructive">{asCritHigh}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Still Active</p>
            <p className="text-2xl font-bold text-foreground">{asActive}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Registries Scanned</p>
            <p className="text-2xl font-bold text-foreground">12</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Impersonations</p>
            <p className="text-2xl font-bold text-foreground">{asImpersonations}</p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-accent/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registry</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Severity</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detected</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10" />
                </tr>
              </thead>
              <tbody>
                {attackSurfaceItems.map((item) => (
                  <tr key={item.id} onClick={() => setSelectedAS(item)} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5 font-medium text-card-foreground">{item.asset}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{item.registry}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={item.type} variant={typeBadgeVariant(item.type)} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={item.severity} variant={riskVariant(item.severity)} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={item.status} variant={statusBadgeVariant(item.status)} />
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{item.detected}</td>
                    <td className="px-2 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                      <BlockButton
                        compact
                        entityId={item.id}
                        entityType="exposure"
                        entityName={item.asset}
                        entityDetail={`${item.registry} — ${item.type}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-2.5 border-t border-border text-xs text-muted-foreground">
            Showing {attackSurfaceItems.length} attack surface findings
          </div>
        </div>
      </ScrollReveal>

      <AttackSurfaceDetailPanel item={selectedAS} onClose={() => setSelectedAS(null)} />
    </div>
  );
};
