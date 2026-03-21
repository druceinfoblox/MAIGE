import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { aiTools } from '@/data/mock';

export const ToolsView = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-semibold text-foreground">AI Tool Inventory</h2>
      <p className="text-sm text-muted-foreground mt-1">All AI tools detected via DNS log analysis</p>
    </div>

    <ScrollReveal>
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tool</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Domain</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Users</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Requests</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">First Seen</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {aiTools.map((tool) => (
                <tr key={tool.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-card-foreground">{tool.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{tool.domain}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{tool.category}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={tool.status} variant={tool.status === 'approved' ? 'success' : tool.status === 'unsanctioned' ? 'critical' : 'warning'} />
                  </td>
                  <td className="px-5 py-3.5 text-right metric-text">{tool.users}</td>
                  <td className="px-5 py-3.5 text-right metric-text">{tool.requests.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{tool.firstSeen}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{tool.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ScrollReveal>
  </div>
);
