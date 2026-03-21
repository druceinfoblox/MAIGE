import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { internalAgents } from '@/data/mock';

export const AgentsView = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-semibold text-foreground">Internal Agent Services</h2>
      <p className="text-sm text-muted-foreground mt-1">Agent and API services discovered in internal DNS zones</p>
    </div>

    <ScrollReveal>
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hostname</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Protocol</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clients</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Queries/Day</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confidence</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">First Seen</th>
              </tr>
            </thead>
            <tbody>
              {internalAgents.map((agent) => (
                <tr key={agent.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-card-foreground">{agent.hostname}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge
                      status={agent.serviceType}
                      variant={agent.serviceType === 'agent' ? 'warning' : agent.serviceType === 'api' ? 'success' : 'neutral'}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{agent.protocol}</td>
                  <td className="px-5 py-3.5 text-right metric-text">{agent.clients}</td>
                  <td className="px-5 py-3.5 text-right metric-text">{agent.queriesPerDay.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge
                      status={agent.confidence}
                      variant={agent.confidence === 'confirmed' ? 'success' : 'neutral'}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{agent.firstSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ScrollReveal>
  </div>
);
