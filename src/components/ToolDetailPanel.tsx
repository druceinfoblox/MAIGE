import { X, ExternalLink, Copy, Globe, Clock, Users, BarChart3, Shield } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { BlockButton } from '@/components/BlockButton';
import { type AITool, userActivities } from '@/data/mock';

type Props = {
  tool: AITool;
  onClose: () => void;
};

const DetailRow = ({ label, value, icon, copyable }: { label: string; value: string | number; icon?: React.ReactNode; copyable?: boolean }) => (
  <div className="flex items-start justify-between py-2.5 border-b border-border/50 last:border-0">
    <span className="text-xs text-muted-foreground min-w-[140px]">{label}</span>
    <span className="text-sm text-card-foreground text-right flex items-center gap-2">
      {icon}
      {typeof value === 'number' ? value.toLocaleString() : value}
      {copyable && (
        <button
          onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(String(value)); }}
          className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          <Copy size={12} />
        </button>
      )}
    </span>
  </div>
);

// Simulated DNS query log entries for the detail view
const generateDnsEntries = (tool: AITool) => [
  { timestamp: `${tool.lastSeen} 14:23:11`, queryType: 'A', response: '104.18.32.47', ttl: 300 },
  { timestamp: `${tool.lastSeen} 14:18:05`, queryType: 'AAAA', response: '2606:4700::6812:202f', ttl: 300 },
  { timestamp: `${tool.lastSeen} 12:41:33`, queryType: 'A', response: '104.18.33.47', ttl: 300 },
];

export const ToolDetailPanel = ({ tool, onClose }: Props) => {
  const relatedUsers = userActivities.filter(u => u.toolsUsed.includes(tool.name));
  const statusVariant = tool.status === 'approved' ? 'success' as const : tool.status === 'unsanctioned' ? 'critical' as const : 'warning' as const;
  const dnsEntries = generateDnsEntries(tool);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[540px] bg-background border-l border-border z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{tool.name}</h2>
              <StatusBadge status={tool.status} variant={statusVariant} />
            </div>
            <div className="flex items-center gap-2">
              <BlockButton
                entityId={tool.id}
                entityType="tool"
                entityName={tool.name}
                entityDetail={tool.domain}
              />
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors active:scale-95"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          {/* Tab bar */}
          <div className="mt-4 flex gap-0">
            <button className="px-4 py-1.5 text-sm font-medium text-primary border-b-2 border-primary">Overview</button>
            <button className="px-4 py-1.5 text-sm font-medium text-muted-foreground border-b-2 border-transparent cursor-default">Activity</button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Summary */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-1">Summary</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              {tool.status === 'unsanctioned'
                ? `${tool.name} is flagged as unsanctioned. ${tool.users} users have generated ${tool.requests.toLocaleString()} DNS queries to this service.`
                : tool.status === 'unknown'
                  ? `${tool.name} has been detected but not yet classified. Review recommended.`
                  : `${tool.name} is an approved AI tool with ${tool.users} active users.`
              }
            </p>
            <div>
              <DetailRow label="Domain" value={tool.domain} icon={<Globe size={13} className="text-muted-foreground" />} copyable />
              <DetailRow label="Category" value={tool.category} />
              <DetailRow label="Classification" value={tool.status.charAt(0).toUpperCase() + tool.status.slice(1)} icon={<Shield size={13} className="text-muted-foreground" />} />
              <DetailRow label="Total DNS Queries" value={tool.requests} icon={<BarChart3 size={13} className="text-muted-foreground" />} />
              <DetailRow label="Unique Users" value={tool.users} icon={<Users size={13} className="text-muted-foreground" />} />
              <DetailRow label="First Seen" value={tool.firstSeen} icon={<Clock size={13} className="text-muted-foreground" />} />
              <DetailRow label="Last Seen" value={tool.lastSeen} icon={<Clock size={13} className="text-muted-foreground" />} />
            </div>
          </div>

          {/* User Activity */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-1">User Activity</h3>
            <p className="text-xs text-muted-foreground mb-4">
              {relatedUsers.length} user{relatedUsers.length !== 1 ? 's' : ''} detected using this tool
            </p>
            {relatedUsers.length > 0 ? (
              <div className="space-y-3">
                {relatedUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[11px] font-semibold text-accent-foreground">
                        {user.email.split('.').map(p => p[0].toUpperCase()).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="text-sm text-card-foreground font-medium">{user.email}</p>
                        <p className="text-[10px] text-muted-foreground">{user.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs metric-text text-card-foreground">{user.totalRequests.toLocaleString()} req</p>
                      <StatusBadge status={user.riskLevel} variant={user.riskLevel === 'high' ? 'critical' : user.riskLevel === 'medium' ? 'warning' : 'success'} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No mapped users for this tool.</p>
            )}
          </div>

          {/* Recent DNS Queries */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-1">Recent DNS Queries</h3>
            <p className="text-xs text-muted-foreground mb-4">Latest resolved queries for {tool.domain}</p>
            <div className="space-y-0">
              {dnsEntries.map((entry, i) => (
                <div key={i} className="py-2.5 border-b border-border/50 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground font-mono">{entry.timestamp}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-accent-foreground font-mono">{entry.queryType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-card-foreground font-mono">{entry.response}</span>
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
