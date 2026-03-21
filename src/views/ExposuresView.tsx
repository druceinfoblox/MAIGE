import { useState } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { ExposureDetailPanel } from '@/components/ExposureDetailPanel';
import { externalExposures, type ExternalExposure } from '@/data/mock';

const riskVariant = (r: string) => {
  if (r === 'critical') return 'critical';
  if (r === 'high') return 'warning';
  return 'neutral';
};

export const ExposuresView = () => {
  const [selected, setSelected] = useState<ExternalExposure | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">External Exposures</h2>
        <p className="text-sm text-muted-foreground mt-1">Externally discoverable AI and agent endpoints</p>
      </div>

      <ScrollReveal>
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-accent/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Domain</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Endpoint</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Response</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">TLS</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Probed</th>
                </tr>
              </thead>
              <tbody>
                {externalExposures.map((exp) => (
                  <tr key={exp.id} onClick={() => setSelected(exp)} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5 font-mono text-xs text-card-foreground">{exp.domain}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{exp.endpoint}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={exp.type} variant={exp.type === 'mcp' ? 'critical' : exp.type === 'llm-proxy' ? 'warning' : 'neutral'} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={exp.riskLevel} variant={riskVariant(exp.riskLevel)} />
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`metric-text text-xs ${exp.responseCode === 200 ? 'text-success' : 'text-muted-foreground'}`}>{exp.responseCode}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`text-xs font-medium ${exp.tlsValid ? 'text-success' : 'text-destructive'}`}>{exp.tlsValid ? '✓ Valid' : '✗ Invalid'}</span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{exp.lastProbed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>

      {selected && (
        <ExposureDetailPanel exposure={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};
