import { X, Shield, Terminal, CheckCircle, ExternalLink } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { type RuntimeAlert, hl01Tactics } from '@/data/mock';

type Props = {
  alert: RuntimeAlert | null;
  onClose: () => void;
};

const severityVariant = (s: string) => {
  const l = s.toLowerCase();
  if (l === 'critical') return 'critical' as const;
  if (l === 'high') return 'warning' as const;
  return 'neutral' as const;
};

const statusVariant = (s: string) => {
  if (s === 'ACTIVE') return 'critical' as const;
  if (s === 'REVIEWING') return 'warning' as const;
  if (s === 'RESOLVED') return 'success' as const;
  return 'neutral' as const;
};

const formatTimestamp = (ts: string) => {
  try {
    const d = new Date(ts);
    return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return ts;
  }
};

const recommendedActions: Record<string, string> = {
  Critical: 'Block user session immediately. Escalate to Security team. Review all recent interactions from this user.',
  High: "Flag for Security review. Notify user's manager. Monitor subsequent requests.",
  Medium: 'Log for audit trail. Send user awareness notification. Monitor for repeat behavior.',
  Low: 'Log for audit trail. No immediate action required.',
};

export const RuntimeAlertDetailPanel = ({ alert, onClose }: Props) => {
  if (!alert) return null;

  const tactic = hl01Tactics.find(t => t.id === alert.tacticId);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full max-w-[540px] bg-background border-l border-border z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-muted-foreground">{alert.id}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-muted text-muted-foreground tracking-wide">{alert.tacticId}</span>
                <StatusBadge status={alert.severity} variant={severityVariant(alert.severity)} />
              </div>
              <h2 className="text-lg font-semibold text-foreground">{alert.tacticName}</h2>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span className="font-mono">{alert.userName}</span>
                <span>·</span>
                <span>{alert.department}</span>
                <span>·</span>
                <span>{alert.tool}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{formatTimestamp(alert.timestamp)}</span>
                <StatusBadge status={alert.status} variant={statusVariant(alert.status)} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors active:scale-95"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Detected Prompt */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
              <Terminal size={14} className="text-muted-foreground" />
              Detected Prompt Snippet
            </h3>
            <pre className="bg-accent/50 rounded-lg p-3 text-xs font-mono text-card-foreground whitespace-pre-wrap break-all leading-relaxed border border-border/50">
              {alert.promptSnippet}
            </pre>
          </div>

          {/* Tactic Details */}
          {tactic && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-card-foreground mb-1 flex items-center gap-2">
                <Shield size={14} className="text-muted-foreground" />
                Tactic: {tactic.id} — {tactic.name}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground mb-3">{tactic.category}</span>
              <p className="text-sm text-card-foreground leading-relaxed mb-4">{tactic.description}</p>

              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Example Pattern:</h4>
              <pre className="bg-accent/50 rounded-lg p-3 text-xs font-mono text-card-foreground whitespace-pre-wrap break-all leading-relaxed border border-border/50">
                {tactic.examplePrompt}
              </pre>

              {tactic.reference && (
                <a href={tactic.reference} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-xs text-primary hover:underline">
                  <ExternalLink size={11} /> Reference
                </a>
              )}
            </div>
          )}

          {/* Recommended Action */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
              <CheckCircle size={14} className="text-muted-foreground" />
              Recommended Action
            </h3>
            <p className="text-sm text-card-foreground leading-relaxed">
              {recommendedActions[alert.severity] ?? recommendedActions.Low}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
