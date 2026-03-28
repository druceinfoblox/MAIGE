import { useState } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { RuntimeAlertDetailPanel } from '@/components/RuntimeAlertDetailPanel';
import { runtimeAlerts, type RuntimeAlert } from '@/data/mock';

const riskVariant = (r: string) => {
  const l = r.toLowerCase();
  if (l === 'critical') return 'critical' as const;
  if (l === 'high') return 'warning' as const;
  return 'neutral' as const;
};

const statusBadgeVariant = (s: string) => {
  if (s === 'ACTIVE') return 'critical' as const;
  if (s === 'REVIEWING') return 'warning' as const;
  if (s === 'RESOLVED') return 'success' as const;
  return 'neutral' as const;
};

const totalAlerts = runtimeAlerts.length;
const activeAlerts = runtimeAlerts.filter(a => a.status === 'ACTIVE').length;
const usersFlagged = new Set(runtimeAlerts.map(a => a.userId)).size;
const tacticsDetected = new Set(runtimeAlerts.map(a => a.tacticId)).size;

export const InspectionView = () => {
  const [selectedRA, setSelectedRA] = useState<RuntimeAlert | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Content Inspection</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Active alerts from internal users attempting prompt injection and obfuscation tactics
        </p>
      </div>

      {/* Metric cards */}
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Total Alerts</p>
            <p className="text-2xl font-bold text-foreground">{totalAlerts}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Active</p>
            <p className="text-2xl font-bold text-destructive">{activeAlerts}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Users Flagged</p>
            <p className="text-2xl font-bold text-amber-600">{usersFlagged}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Tactics Detected</p>
            <p className="text-2xl font-bold text-foreground">{tacticsDetected}</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Runtime alerts table */}
      <ScrollReveal delay={0.05}>
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-accent/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tactic</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tool</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Severity</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {runtimeAlerts.map((alert) => (
                  <tr key={alert.id} onClick={() => setSelectedRA(alert)} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5 font-mono text-xs text-card-foreground">{alert.userName}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{alert.department}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-mono text-muted-foreground">{alert.tacticId}</span>
                        <span className="text-xs text-card-foreground font-medium">{alert.tacticName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{alert.tool}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={alert.severity} variant={riskVariant(alert.severity)} />
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{new Date(alert.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={alert.status} variant={statusBadgeVariant(alert.status)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-2.5 border-t border-border text-xs text-muted-foreground">
            Showing {runtimeAlerts.length} runtime security alerts
          </div>
        </div>
      </ScrollReveal>

      <RuntimeAlertDetailPanel alert={selectedRA} onClose={() => setSelectedRA(null)} />
    </div>
  );
};
