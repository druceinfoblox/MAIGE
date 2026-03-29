import { ScrollReveal } from '@/components/ScrollReveal';
import { MetricCard } from '@/components/MetricCard';
import { StatusBadge } from '@/components/StatusBadge';
import { Database, ShieldCheck, Server, Cloud } from 'lucide-react';

// ── Mock data ──

type Agent = {
  name: string;
  provider: string;
  region: string;
  dns: string;
  trust: number;
  dnssec: string;
  protocol: string;
  status: string;
};

const agents: Agent[] = [
  { name: 'procurement-agent', provider: 'AWS', region: 'us-east-1', dns: 'procurement-agent.agents.infoblox.com', trust: 9, dnssec: 'Validated', protocol: 'A2A', status: 'Active' },
  { name: 'threat-intel-agent', provider: 'AWS', region: 'us-west-2', dns: 'threat-intel-agent.agents.infoblox.com', trust: 9, dnssec: 'Validated', protocol: 'REST', status: 'Active' },
  { name: 'compliance-checker', provider: 'AWS', region: 'eu-west-1', dns: 'compliance-checker.agents.infoblox.com', trust: 8, dnssec: 'Validated', protocol: 'A2A', status: 'Active' },
  { name: 'data-pipeline-agent', provider: 'AWS', region: 'us-east-1', dns: 'data-pipeline-agent.agents.infoblox.com', trust: 8, dnssec: 'Not Validated', protocol: 'REST', status: 'Active' },
  { name: 'hr-screening-agent', provider: 'Azure', region: 'eastus', dns: 'hr-screening-agent.agents.infoblox.com', trust: 9, dnssec: 'Validated', protocol: 'MCP', status: 'Active' },
  { name: 'doc-classifier', provider: 'Azure', region: 'westus', dns: 'doc-classifier.agents.infoblox.com', trust: 8, dnssec: 'Validated', protocol: 'REST', status: 'Active' },
  { name: 'support-bot', provider: 'Azure', region: 'northeurope', dns: 'support-bot.agents.infoblox.com', trust: 7, dnssec: 'Not Validated', protocol: 'A2A', status: 'Active' },
  { name: 'analytics-agent', provider: 'GCP', region: 'us-central1', dns: 'analytics-agent.agents.infoblox.com', trust: 9, dnssec: 'Validated', protocol: 'REST', status: 'Active' },
  { name: 'code-review-agent', provider: 'GCP', region: 'europe-west1', dns: 'code-review-agent.agents.infoblox.com', trust: 8, dnssec: 'Validated', protocol: 'A2A', status: 'Active' },
  { name: 'security-scanner', provider: 'GCP', region: 'asia-northeast1', dns: 'security-scanner.agents.infoblox.com', trust: 9, dnssec: 'Validated', protocol: 'REST', status: 'Active' },
  { name: 'legacy-data-agent', provider: 'On-Prem', region: 'US-DC', dns: 'legacy-data-agent.agents.infoblox.com', trust: 7, dnssec: 'Validated', protocol: 'A2A', status: 'Active' },
  { name: 'network-monitor', provider: 'On-Prem', region: 'US-DC', dns: 'network-monitor.agents.infoblox.com', trust: 8, dnssec: 'Validated', protocol: 'REST', status: 'Active' },
];

// ── Helpers ──

const trustColor = (t: number) => {
  if (t >= 8) return 'text-primary';       // green
  if (t >= 6) return 'text-warning';       // amber
  return 'text-destructive';               // red
};

const providerBadge: Record<string, string> = {
  AWS: 'bg-amber-500/15 text-amber-700',
  Azure: 'bg-blue-500/15 text-blue-600',
  GCP: 'bg-rose-500/15 text-rose-600',
  'On-Prem': 'bg-emerald-500/15 text-emerald-700',
};

const cloudDistribution = [
  { label: 'AWS', count: 4 },
  { label: 'Azure', count: 3 },
  { label: 'GCP', count: 3 },
  { label: 'On-Prem', count: 2 },
];

export const AgentRegistryView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Agent Registry</h2>
        <p className="text-sm text-muted-foreground mt-1">DNS-registered AI agents across cloud and on-premise environments</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Total Registered"
          value={12}
          icon={<Database className="w-5 h-5" />}
          delay={0}
        />
        <MetricCard
          label="DNSSEC Validated"
          value={10}
          icon={<ShieldCheck className="w-5 h-5" />}
          change="83% coverage"
          delay={0.05}
        />
        <MetricCard
          label="Avg Trust Level"
          value="8.3"
          icon={<Server className="w-5 h-5" />}
          change="↑ 0.2 from last week"
          delay={0.1}
        />
      </div>

      {/* Cloud distribution */}
      <ScrollReveal delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cloudDistribution.map((c) => (
            <div key={c.label} className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-4 h-4 text-muted-foreground" />
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${providerBadge[c.label] || 'bg-muted text-muted-foreground'}`}>
                  {c.label}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{c.count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">agents</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Agent table */}
      <ScrollReveal delay={0.1}>
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-accent/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agent Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Provider</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Region</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">DNS Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trust Level</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">DNSSEC</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Protocol</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.name} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-card-foreground font-mono text-xs">{agent.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${providerBadge[agent.provider] || 'bg-muted text-muted-foreground'}`}>
                        {agent.provider}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{agent.region}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{agent.dns}</td>
                    <td className="px-5 py-3.5">
                      <span className={`font-semibold ${trustColor(agent.trust)}`}>{agent.trust}/10</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge
                        status={agent.dnssec}
                        variant={agent.dnssec === 'Validated' ? 'success' : 'warning'}
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={agent.protocol} variant="neutral" />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={agent.status} variant="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-2.5 border-t border-border text-xs text-muted-foreground">
            Showing {agents.length} registered agents
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
