import { X, ExternalLink, Link, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { type DigitalRiskItem } from '@/data/mock';

type Props = {
  item: DigitalRiskItem | null;
  onClose: () => void;
};

const riskVariant = (r: string) => {
  const l = r.toLowerCase();
  if (l === 'critical') return 'critical' as const;
  if (l === 'high') return 'warning' as const;
  return 'neutral' as const;
};

const statusVariant = (s: string) => {
  if (s === 'OPEN') return 'critical' as const;
  if (s === 'INVESTIGATING') return 'warning' as const;
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

export const DigitalRiskDetailPanel = ({ item, onClose }: Props) => {
  if (!item) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full max-w-[540px] bg-background border-l border-border z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{item.finding}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={item.risk} variant={riskVariant(item.risk)} />
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground">{item.type}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{item.source}</span>
                <span>·</span>
                <span>{item.detected}</span>
              </div>
              <StatusBadge status={item.status} variant={statusVariant(item.status)} />
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
          {/* Description */}
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-card-foreground leading-relaxed">{item.description}</p>
          </div>

          {/* Metadata */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1 flex items-center gap-1">
                  <ExternalLink size={10} /> Source
                </p>
                <p className="text-sm text-card-foreground font-medium">{item.source}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Affected Asset</p>
                <p className="text-sm text-card-foreground font-mono">{item.affectedAsset}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1 flex items-center gap-1">
                  <Clock size={10} /> Detected At
                </p>
                <p className="text-sm text-card-foreground">{formatTimestamp(item.detectedAt)}</p>
              </div>
            </div>
          </div>

          {/* References */}
          {item.references.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <Link size={14} className="text-muted-foreground" />
                References
              </h3>
              <div className="space-y-2">
                {item.references.map((ref, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {ref.startsWith('http') ? (
                      <a href={ref} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-primary hover:underline break-all">
                        {ref}
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-card-foreground">{ref}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
