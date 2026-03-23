import { X, Shield, Mail, Clock, BarChart3, Radar, AlertTriangle, ExternalLink } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { BlockButton } from '@/components/BlockButton';
import { type UserActivity, aiTools } from '@/data/mock';

type Props = {
  user: UserActivity;
  onClose: () => void;
};

const DetailRow = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="flex items-start justify-between py-2.5 border-b border-border/50 last:border-0">
    <span className="text-xs text-muted-foreground min-w-[140px]">{label}</span>
    <span className="text-sm text-card-foreground text-right flex items-center gap-2">{icon}{value}</span>
  </div>
);

const riskDescriptions: Record<string, string> = {
  high: 'This user has extensive AI tool usage including unsanctioned services. Activity volume and tool diversity indicate elevated risk requiring review.',
  medium: 'This user accesses a mix of approved and unclassified AI tools. Usage patterns should be monitored for policy compliance.',
  low: 'This user primarily uses approved AI tools within normal usage patterns. No immediate action required.',
};

const riskVariant = (r: string) => r === 'high' ? 'critical' as const : r === 'medium' ? 'warning' as const : 'success' as const;

// Simulated daily activity for sparkline
const generateActivity = (user: UserActivity) => [
  { date: '2025-03-15', requests: Math.round(user.totalRequests * 0.12) },
  { date: '2025-03-16', requests: Math.round(user.totalRequests * 0.08) },
  { date: '2025-03-17', requests: Math.round(user.totalRequests * 0.15) },
  { date: '2025-03-18', requests: Math.round(user.totalRequests * 0.18) },
  { date: '2025-03-19', requests: Math.round(user.totalRequests * 0.11) },
  { date: '2025-03-20', requests: Math.round(user.totalRequests * 0.21) },
  { date: '2025-03-21', requests: Math.round(user.totalRequests * 0.15) },
];

export const UserDetailPanel = ({ user, onClose }: Props) => {
  const activity = generateActivity(user);
  const toolDetails = user.toolsUsed.map(name => {
    const tool = aiTools.find(t => t.name === name);
    return { name, status: tool?.status ?? 'unknown', domain: tool?.domain ?? '', category: tool?.category ?? '' };
  });
  const unsanctionedCount = toolDetails.filter(t => t.status === 'unsanctioned').length;
  const unknownCount = toolDetails.filter(t => t.status === 'unknown').length;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full max-w-[540px] bg-background border-l border-border z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
                  {user.email.split('.').map(p => p[0].toUpperCase()).slice(0, 2).join('')}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{user.email}</h2>
                  <p className="text-xs text-muted-foreground">{user.department}</p>
                </div>
              </div>
              <StatusBadge status={user.riskLevel} variant={riskVariant(user.riskLevel)} />
            </div>
            <div className="flex items-center gap-2">
              <BlockButton
                entityId={user.id}
                entityType="user"
                entityName={user.email}
                entityDetail={user.department}
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
            <button className="px-4 py-1.5 text-sm font-medium text-muted-foreground border-b-2 border-transparent cursor-default">Activity</button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Risk Assessment */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-1 flex items-center gap-2">
              <Shield size={14} className="text-muted-foreground" />
              Risk Assessment
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              {riskDescriptions[user.riskLevel]}
            </p>
            <div>
              <DetailRow label="Email" value={<span className="font-mono text-xs">{user.email}</span>} icon={<Mail size={13} className="text-muted-foreground" />} />
              <DetailRow label="Department" value={user.department} />
              <DetailRow label="Risk Level" value={<StatusBadge status={user.riskLevel} variant={riskVariant(user.riskLevel)} />} />
              <DetailRow label="Total Requests" value={user.totalRequests.toLocaleString()} icon={<BarChart3 size={13} className="text-muted-foreground" />} />
              <DetailRow label="Tools Used" value={`${user.toolsUsed.length} tools`} icon={<Radar size={13} className="text-muted-foreground" />} />
              <DetailRow label="Last Active" value={user.lastActive} icon={<Clock size={13} className="text-muted-foreground" />} />
            </div>
          </div>

          {/* Tools Breakdown */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-1 flex items-center gap-2">
              <Radar size={14} className="text-muted-foreground" />
              AI Tools Used
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {user.toolsUsed.length} tool{user.toolsUsed.length !== 1 ? 's' : ''} detected
              {unsanctionedCount > 0 && ` · ${unsanctionedCount} unsanctioned`}
              {unknownCount > 0 && ` · ${unknownCount} unknown`}
            </p>
            <div className="space-y-0">
              {toolDetails.map(tool => (
                <div key={tool.name} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm text-card-foreground font-medium">{tool.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{tool.domain}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">{tool.category}</span>
                    <StatusBadge status={tool.status} variant={tool.status === 'approved' ? 'success' : tool.status === 'unsanctioned' ? 'critical' : 'warning'} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-1 flex items-center gap-2">
              <Clock size={14} className="text-muted-foreground" />
              Recent Activity
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Daily request volume — last 7 days</p>
            <div className="space-y-0">
              {activity.map((entry, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                  <span className="text-xs text-muted-foreground font-mono">{entry.date}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(entry.requests / Math.max(...activity.map(a => a.requests))) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs metric-text text-card-foreground w-12 text-right">{entry.requests.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-xs text-primary hover:underline flex items-center gap-1">
              View full activity log <ExternalLink size={11} />
            </button>
          </div>

          {/* Risk Indicators */}
          {(unsanctionedCount > 0 || unknownCount > 0) && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-card-foreground mb-1 flex items-center gap-2">
                <AlertTriangle size={14} className={user.riskLevel === 'high' ? 'text-destructive' : 'text-warning'} />
                Risk Indicators
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {user.riskLevel === 'high' ? 'Immediate review recommended' : 'Monitor for policy changes'}
              </p>
              <ul className="space-y-2">
                {unsanctionedCount > 0 && (
                  <li className="flex items-start gap-3 text-sm text-card-foreground leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-destructive/15 flex items-center justify-center">
                      <AlertTriangle size={10} className="text-destructive" />
                    </span>
                    Using {unsanctionedCount} unsanctioned AI tool{unsanctionedCount > 1 ? 's' : ''}
                  </li>
                )}
                {unknownCount > 0 && (
                  <li className="flex items-start gap-3 text-sm text-card-foreground leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-warning/15 flex items-center justify-center">
                      <AlertTriangle size={10} className="text-warning" />
                    </span>
                    Accessing {unknownCount} unclassified AI tool{unknownCount > 1 ? 's' : ''}
                  </li>
                )}
                {user.totalRequests > 5000 && (
                  <li className="flex items-start gap-3 text-sm text-card-foreground leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-warning/15 flex items-center justify-center">
                      <BarChart3 size={10} className="text-warning" />
                    </span>
                    High request volume ({user.totalRequests.toLocaleString()} total)
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
