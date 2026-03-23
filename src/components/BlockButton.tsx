import { ShieldOff, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePolicyStore, policyKey, type EntityType } from '@/hooks/usePolicyStore';

type Props = {
  entityId: string;
  entityType: EntityType;
  entityName: string;
  entityDetail: string;
  /** compact = icon-only (table rows); default = icon + label (detail panels) */
  compact?: boolean;
  className?: string;
};

export const BlockButton = ({
  entityId,
  entityType,
  entityName,
  entityDetail,
  compact = false,
  className,
}: Props) => {
  const { isBlocked, toggle } = usePolicyStore();
  // Use namespaced key so tool "1" ≠ user "1"
  const key = policyKey(entityType, entityId);
  const blocked = isBlocked(entityType, entityId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle({ entityId: key, entityType, entityName, entityDetail });
  };

  if (compact) {
    return (
      <button
        title={blocked ? 'Remove block' : `Block this ${entityType}`}
        onClick={handleClick}
        className={cn(
          'p-1.5 rounded transition-colors',
          blocked
            ? 'text-destructive hover:bg-destructive/10'
            : 'text-muted-foreground/40 hover:text-destructive/70 hover:bg-destructive/5',
          className
        )}
      >
        {blocked
          ? <ShieldOff size={15} />
          : <ShieldCheck size={15} />
        }
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border',
        blocked
          ? 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20'
          : 'bg-card text-muted-foreground border-border hover:border-destructive/50 hover:text-destructive hover:bg-destructive/5',
        className
      )}
    >
      {blocked
        ? <><ShieldOff size={14} /> Remove Block</>
        : <><ShieldCheck size={14} /> Block</>
      }
    </button>
  );
};

/** Inline "BLOCKED" badge shown in table rows when entity is blocked */
export const BlockedBadge = ({ entityId, entityType }: { entityId: string; entityType: EntityType }) => {
  const { isBlocked } = usePolicyStore();
  if (!isBlocked(entityType, entityId)) return null;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-destructive/15 text-destructive uppercase tracking-wide">
      <ShieldOff size={9} /> Blocked
    </span>
  );
};
