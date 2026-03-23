import { ShieldOff, Shield, Trash2 } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { usePolicyStore, type EntityType } from '@/hooks/usePolicyStore';

const entityTypeLabels: Record<EntityType, string> = {
  tool: 'AI Tool',
  user: 'User',
  agent: 'Server',
  exposure: 'Exposure',
};

const entityTypeBadgeClass: Record<EntityType, string> = {
  tool: 'bg-blue-500/15 text-blue-600',
  user: 'bg-purple-500/15 text-purple-700',
  agent: 'bg-amber-500/15 text-amber-700',
  exposure: 'bg-destructive/15 text-destructive',
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export const PolicyView = () => {
  const { rules, remove } = usePolicyStore();

  // Most recently blocked first
  const sorted = [...rules].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Policy</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Blocked entities — enforced across AI Tools, Users, Internal Servers, and External Exposures
        </p>
      </div>

      <ScrollReveal>
        {sorted.length === 0 ? (
          /* ── Empty state ── */
          <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">No policy rules yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Block elements from the <strong>AI Tools</strong>, <strong>Users</strong>,{' '}
              <strong>Servers</strong>, or <strong>External</strong> views using the{' '}
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <ShieldOff size={12} /> Block
              </span>{' '}
              button. Blocked items will appear here.
            </p>
          </div>
        ) : (
          /* ── Policy table ── */
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            {/* Summary bar */}
            <div className="px-5 py-3 border-b border-border bg-destructive/5 flex items-center gap-2">
              <ShieldOff size={14} className="text-destructive" />
              <span className="text-sm font-medium text-destructive">
                {sorted.length} blocked {sorted.length === 1 ? 'entity' : 'entities'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-accent/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detail</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Blocked Since</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((rule) => (
                    <tr
                      key={rule.id}
                      className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors"
                    >
                      {/* Type badge */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${entityTypeBadgeClass[rule.entityType]}`}>
                          <ShieldOff size={10} />
                          {entityTypeLabels[rule.entityType]}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="px-5 py-3.5 font-medium text-card-foreground">
                        {rule.entityName}
                      </td>

                      {/* Detail (domain / email / hostname / endpoint) */}
                      <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground max-w-[220px] truncate">
                        {rule.entityDetail}
                      </td>

                      {/* Blocked since */}
                      <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                        {formatDate(rule.createdAt)}
                      </td>

                      {/* Remove */}
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => remove(rule.entityId)}
                          title="Remove block"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors border border-transparent hover:border-destructive/20"
                        >
                          <Trash2 size={12} />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-2.5 border-t border-border text-xs text-muted-foreground">
              Policy rules persist across sessions
            </div>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
};
