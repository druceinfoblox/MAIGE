import { X, ExternalLink, TriangleAlert } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { type AttackSurfaceItem } from '@/data/mock';

type Props = {
  item: AttackSurfaceItem | null;
  onClose: () => void;
};

const riskVariant = (r: string) => {
  const l = r.toLowerCase();
  if (l === 'critical') return 'critical' as const;
  if (l === 'high') return 'warning' as const;
  return 'neutral' as const;
};

const typeBadgeVariant = (t: string) => {
  if (t === 'Impersonation') return 'critical' as const;
  if (t === 'Exact Match') return 'warning' as const;
  return 'neutral' as const;
};

const statusVariant = (s: string) => {
  if (s === 'ACTIVE') return 'critical' as const;
  if (s === 'REPORTED') return 'success' as const;
  return 'neutral' as const;
};

export const AttackSurfaceDetailPanel = ({ item, onClose }: Props) => {
  if (!item) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full max-w-[540px] bg-background border-l border-border z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground font-mono">{item.asset}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-muted text-muted-foreground tracking-wide">{item.assetType}</span>
                <StatusBadge status={item.type} variant={typeBadgeVariant(item.type)} />
                <StatusBadge status={item.severity} variant={riskVariant(item.severity)} />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Publisher: <span className="font-medium text-card-foreground">{item.publisher}</span></span>
                <span>·</span>
                <span>{item.registry}</span>
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
                  <ExternalLink size={10} /> Registry
                </p>
                <p className="text-sm text-card-foreground font-medium">{item.registry}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">First / Last Seen</p>
                <p className="text-sm text-card-foreground">{item.firstSeen} — {item.lastSeen}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Publisher</p>
                <p className="text-sm text-card-foreground font-mono text-xs">{item.publisher}</p>
              </div>
            </div>
          </div>

          {/* Risk Indicators */}
          {item.riskIndicators.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <TriangleAlert size={14} className="text-amber-500" />
                Risk Indicators
              </h3>
              <ul className="space-y-2.5">
                {item.riskIndicators.map((indicator, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-card-foreground leading-relaxed">
                    <TriangleAlert size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
