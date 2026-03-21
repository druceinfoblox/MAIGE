import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

export type SortDir = 'asc' | 'desc';
export type SortState<K extends string> = { key: K; dir: SortDir } | null;

type Props<K extends string> = {
  label: string;
  sortKey: K;
  current: SortState<K>;
  onSort: (key: K) => void;
  align?: 'left' | 'right';
};

export function SortableHeader<K extends string>({ label, sortKey, current, onSort, align = 'left' }: Props<K>) {
  const active = current?.key === sortKey;
  const Icon = active ? (current.dir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <th
      onClick={() => onSort(sortKey)}
      className={`${align === 'right' ? 'text-right' : 'text-left'} px-5 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-foreground ${active ? 'text-foreground' : 'text-muted-foreground'}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <Icon size={12} className={active ? 'text-primary' : 'text-muted-foreground/50'} />
      </span>
    </th>
  );
}

export function toggleSort<K extends string>(current: SortState<K>, key: K): SortState<K> {
  if (current?.key === key) {
    return current.dir === 'asc' ? { key, dir: 'desc' } : null;
  }
  return { key, dir: 'asc' };
}
