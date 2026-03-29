import { useState } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { MetricCard } from '@/components/MetricCard';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ShieldCheck, ShieldOff, AlertTriangle, FileWarning } from 'lucide-react';

// ── Mock data ──

type Registry = {
  name: string;
  url: string;
  trustScore: number;
  enabled: boolean;
};

const initialRegistries: Registry[] = [
  { name: 'AWS Agent Registry', url: 'registry.agents.aws.amazon.com', trustScore: 9, enabled: true },
  { name: 'Azure Agent Registry', url: 'agents.azure.microsoft.com', trustScore: 9, enabled: true },
  { name: 'GCP Agent Registry', url: 'agents.cloud.google.com', trustScore: 8, enabled: true },
  { name: 'GoDaddy ANS', url: 'ans.godaddy.com', trustScore: 5, enabled: false },
  { name: 'Claude Registry', url: 'registry.claude.ai', trustScore: 8, enabled: true },
  { name: 'OpenAI Agent Registry', url: 'agents.openai.com', trustScore: 7, enabled: true },
  { name: 'HuggingFace Registry', url: 'agents.huggingface.co', trustScore: 6, enabled: false },
];

// ── Helpers ──

const trustColor = (t: number) => {
  if (t >= 8) return 'text-primary';       // green
  if (t >= 6) return 'text-warning';       // amber
  return 'text-destructive';               // red
};

export const AgentTrustPolicyView = () => {
  const [registries, setRegistries] = useState<Registry[]>(initialRegistries);
  const [threshold, setThreshold] = useState(7);

  const toggleRegistry = (idx: number) => {
    setRegistries(prev =>
      prev.map((r, i) => i === idx ? { ...r, enabled: !r.enabled } : r)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Agent Trust Policy</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure trust thresholds and authorized registries for AI agent connections</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Connections Allowed"
          value="2,847"
          icon={<ShieldCheck className="w-5 h-5" />}
          delay={0}
        />
        <MetricCard
          label="Connections Blocked"
          value={423}
          icon={<ShieldOff className="w-5 h-5" />}
          variant="warning"
          delay={0.05}
        />
        <MetricCard
          label="Trust Violations"
          value={18}
          icon={<AlertTriangle className="w-5 h-5" />}
          variant="critical"
          delay={0.1}
        />
        <MetricCard
          label="Policy Exceptions"
          value={3}
          icon={<FileWarning className="w-5 h-5" />}
          delay={0.15}
        />
      </div>

      {/* Authorized Agent Registries */}
      <ScrollReveal delay={0.05}>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Authorized Agent Registries</h3>
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-accent/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registry Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trust Score</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enabled</th>
                  </tr>
                </thead>
                <tbody>
                  {registries.map((reg, idx) => (
                    <tr key={reg.name} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-card-foreground">{reg.name}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{reg.url}</td>
                      <td className="px-5 py-3.5">
                        <span className={`font-semibold ${trustColor(reg.trustScore)}`}>{reg.trustScore}/10</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <Switch
                          checked={reg.enabled}
                          onCheckedChange={() => toggleRegistry(idx)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-2.5 border-t border-border text-xs text-muted-foreground">
              {registries.filter(r => r.enabled).length} of {registries.length} registries enabled
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Default Policy for Unknown Registries */}
      <ScrollReveal delay={0.1}>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Default Policy for Unknown Registries</h3>
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <p className="text-sm text-card-foreground mb-4">
              Allow connections to agents with Trust Level above:
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Slider
                  value={[threshold]}
                  onValueChange={(vals) => setThreshold(vals[0])}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
              <span className={`text-2xl font-bold min-w-[3ch] text-right ${trustColor(threshold)}`}>
                {threshold}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              ✓ Agents with trust level &gt; {threshold} will be allowed automatically
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
