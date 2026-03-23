import { X, Server, Globe, Clock, Users, BarChart3, Shield, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { BlockButton } from '@/components/BlockButton';
import { type InternalAgent, externalExposures, userActivities } from '@/data/mock';

type Props = {
  agent: InternalAgent;
  onClose: () => void;
};

const DetailRow = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="flex items-start justify-between py-2.5 border-b border-border/50 last:border-0">
    <span className="text-xs text-muted-foreground min-w-[140px]">{label}</span>
    <span className="text-sm text-card-foreground text-right flex items-center gap-2">{icon}{value}</span>
  </div>
);

// Simulated internal clients for the agent
const generateClients = (agent: InternalAgent) => {
  const clientPools: Record<string, { host: string; ip: string }[]> = {
    'mcp.internal.company.com': [
      { host: 'app-server-01.corp', ip: '10.0.1.12' },
      { host: 'workflow-engine.k8s', ip: '10.0.3.44' },
      { host: 'automation-svc.corp', ip: '10.0.2.18' },
    ],
    'llm-gateway.corp.company.com': [
      { host: 'api-gateway.corp', ip: '10.0.1.5' },
      { host: 'chat-service.k8s', ip: '10.0.3.22' },
      { host: 'support-bot.corp', ip: '10.0.1.87' },
      { host: 'code-review-svc.k8s', ip: '10.0.3.55' },
    ],
    'ai-proxy.staging.company.com': [
      { host: 'staging-app.corp', ip: '10.0.5.10' },
      { host: 'test-runner.ci', ip: '10.0.5.33' },
    ],
  };
  return clientPools[agent.hostname] || [
    { host: 'client-1.corp', ip: '10.0.1.100' },
    { host: 'client-2.corp', ip: '10.0.1.101' },
  ];
};

// Agent → exposure mapping
const agentToExposure: Record<string, string[]> = {
  'mcp.internal.company.com': ['mcp.company.com'],
  'llm-gateway.corp.company.com': ['api.company.com'],
  'ai-proxy.staging.company.com': ['agent.company.com', 'dev-ai.company.com'],
  'agent-orchestrator.k8s.company.com': ['agent.company.com'],
  'embeddings.ml.company.com': ['ml-staging.company.com'],
  'rag-service.internal.company.com': ['mcp.company.com'],
};

const generateDnsEntries = (agent: InternalAgent) => [
  { timestamp: `${agent.firstSeen} 09:14:22`, queryType: 'A', source: '10.0.1.12', ttl: 60 },
  { timestamp: `${agent.firstSeen} 09:12:05`, queryType: 'AAAA', source: '10.0.3.44', ttl: 60 },
  { timestamp: `${agent.firstSeen} 08:55:11`, queryType: 'A', source: '10.0.2.18', ttl: 60 },
];

export const AgentDetailPanel = ({ agent, onClose }: Props) => {
  const clients = generateClients(agent);
  const linkedExposures = (agentToExposure[agent.hostname] || [])
    .map(domain => externalExposures.find(e => e.domain === domain))
    .filter(Boolean);
  const dnsEntries = generateDnsEntries(agent);
  const typeVariant = agent.serviceType === 'agent' ? 'warning' as const : agent.serviceType === 'api' ? 'success' as const : 'neutral' as const;
  const confVariant = agent.confidence === 'confirmed' ? 'success' as const : 'neutral' as const;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full max-w-[540px] bg-background border-l border-border z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground font-mono">{agent.hostname}</h2>
              <div className="flex items-center gap-2">
                <StatusBadge status={agent.serviceType} variant={typeVariant} />
                <StatusBadge status={agent.confidence} variant={confVariant} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BlockButton
                entityId={agent.id}
                entityType="agent"
                entityName={agent.hostname}
                entityDetail={agent.protocol}
              />
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors active:scale-95"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="mt-4 flex gap-0">
            <button className="px-4 py-1.5 text-sm font-medium text-primary border-b-2 border-primary">Overview</button>
            <button className="px-4 py-1.5 text-sm font-medium text-muted-foreground border-b-2 border-transparent cursor-default">Traffic</button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Summary */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-1 flex items-center gap-2">
              <Server size={14} className="text-muted-foreground" />
              Service Summary
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              {agent.confidence === 'confirmed'
                ? `${agent.hostname} is a confirmed ${agent.serviceType} service handling ${agent.queriesPerDay.toLocaleString()} queries/day from ${agent.clients} internal clients.`
                : `${agent.hostname} has been inferred as a ${agent.serviceType} service via DNS heuristics. Manual classification recommended.`
              }
            </p>
            <div>
              <DetailRow label="Hostname" value={<span className="font-mono text-xs">{agent.hostname}</span>} icon={<Globe size={13} className="text-muted-foreground" />} />
              <DetailRow label="Service Type" value={agent.serviceType.charAt(0).toUpperCase() + agent.serviceType.slice(1)} icon={<Shield size={13} className="text-muted-foreground" />} />
              <DetailRow label="Protocol" value={agent.protocol} />
              <DetailRow label="Confidence" value={<StatusBadge status={agent.confidence} variant={confVariant} />} />
              <DetailRow label="Internal Clients" value={agent.clients} icon={<Users size={13} className="text-muted-foreground" />} />
              <DetailRow label="Queries/Day" value={agent.queriesPerDay.toLocaleString()} icon={<BarChart3 size={13} className="text-muted-foreground" />} />
              <DetailRow label="First Seen" value={agent.firstSeen} icon={<Clock size={13} className="text-muted-foreground" />} />
            </div>
          </div>

          {/* Internal Clients */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-1 flex items-center gap-2">
              <Users size={14} className="text-muted-foreground" />
              Internal Clients
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Services and hosts querying this agent endpoint</p>
            <div className="space-y-0">
              {clients.map((client, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                  <span className="text-sm text-card-foreground font-mono">{client.host}</span>
                  <span className="text-xs text-muted-foreground font-mono">{client.ip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Linked External Exposures */}
          {linkedExposures.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-card-foreground mb-1 flex items-center gap-2">
                <AlertTriangle size={14} className="text-warning" />
                Linked External Exposures
              </h3>
              <p className="text-xs text-muted-foreground mb-4">External endpoints associated with this internal service</p>
              <div className="space-y-0">
                {linkedExposures.map((exp) => exp && (
                  <div key={exp.id} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm text-card-foreground font-mono">{exp.domain}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{exp.endpoint}</p>
                    </div>
                    <StatusBadge status={exp.riskLevel} variant={exp.riskLevel === 'critical' ? 'critical' : exp.riskLevel === 'high' ? 'warning' : 'neutral'} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent DNS Queries */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-1 flex items-center gap-2">
              <Clock size={14} className="text-muted-foreground" />
              Recent Internal DNS Queries
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Latest resolved queries for {agent.hostname}</p>
            <div className="space-y-0">
              {dnsEntries.map((entry, i) => (
                <div key={i} className="py-2.5 border-b border-border/50 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground font-mono">{entry.timestamp}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-accent-foreground font-mono">{entry.queryType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-card-foreground font-mono">from {entry.source}</span>
                    <span className="text-[10px] text-muted-foreground">TTL {entry.ttl}s</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-xs text-primary hover:underline flex items-center gap-1">
              View full query log <ExternalLink size={11} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
