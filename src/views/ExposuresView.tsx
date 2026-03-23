import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { SortableHeader, toggleSort, type SortState } from '@/components/SortableHeader';
import { ExposureDetailPanel } from '@/components/ExposureDetailPanel';
import { BlockButton, BlockedBadge } from '@/components/BlockButton';
import { externalExposures, type ExternalExposure } from '@/data/mock';

const riskVariant = (r: string) => {
  if (r === 'critical') return 'critical' as const;
  if (r === 'high') return 'warning' as const;
  return 'neutral' as const;
};

const riskSummary: Record<string, string> = {
  critical: 'Publicly accessible, no auth — immediate risk',
  high: 'Internet-exposed, significant attack surface',
  medium: 'Partially protected, access controls need review',
  low: 'Adequate protections, continue monitoring',
};

const riskOptions = ['all', 'critical', 'high', 'medium', 'low'] as const;
const typeOptions = ['all', 'mcp', 'api', 'llm-proxy', 'unknown'] as const;

type SortKey = 'domain' | 'endpoint' | 'type' | 'riskLevel' | 'responseCode' | 'tlsValid' | 'lastProbed';

const riskOrder: Record<string, number> = { low: 0, medium: 1, high: 2, critical: 3 };

const compareFn = (a: ExternalExposure, b: ExternalExposure, key: SortKey): number => {
  if (key === 'responseCode') return a.responseCode - b.responseCode;
  if (key === 'riskLevel') return (riskOrder[a.riskLevel] ?? 0) - (riskOrder[b.riskLevel] ?? 0);
  if (key === 'tlsValid') return (a.tlsValid ? 1 : 0) - (b.tlsValid ? 1 : 0);
  return String(a[key]).localeCompare(String(b[key]));
};

export const ExposuresView = () => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sort, setSort] = useState<SortState<SortKey>>(null);
  const [selected, setSelected] = useState<ExternalExposure | null>(null);

  const filtered = useMemo(() => {
    let data = externalExposures.filter(exp => {
      const matchesSearch = !search || exp.domain.toLowerCase().includes(search.toLowerCase()) || exp.endpoint.toLowerCase().includes(search.toLowerCase());
      const matchesRisk = riskFilter === 'all' || exp.riskLevel === riskFilter;
      const matchesType = typeFilter === 'all' || exp.type === typeFilter;
      return matchesSearch && matchesRisk && matchesType;
    });
    if (sort) {
      data = [...data].sort((a, b) => {
        const c = compareFn(a, b, sort.key);
        return sort.dir === 'asc' ? c : -c;
      });
    }
    return data;
  }, [search, riskFilter, typeFilter, sort]);

  const hasFilters = search || riskFilter !== 'all' || typeFilter !== 'all';
  const handleSort = (key: SortKey) => setSort(prev => toggleSort(prev, key));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">External Exposures</h2>
        <p className="text-sm text-muted-foreground mt-1">Externally discoverable AI and agent endpoints</p>
      </div>

      <ScrollReveal>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search domains or endpoints…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
            />
          </div>
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer">
            {riskOptions.map(r => (
              <option key={r} value={r}>{r === 'all' ? 'All risk levels' : r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer">
            {typeOptions.map(t => (
              <option key={t} value={t}>{t === 'all' ? 'All types' : t.toUpperCase()}</option>
            ))}
          </select>
          {hasFilters && (
            <button onClick={() => { setSearch(''); setRiskFilter('all'); setTypeFilter('all'); }} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-accent/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Summary</th>
                  <SortableHeader label="Domain" sortKey="domain" current={sort} onSort={handleSort} />
                  <SortableHeader label="Endpoint" sortKey="endpoint" current={sort} onSort={handleSort} />
                  <SortableHeader label="Type" sortKey="type" current={sort} onSort={handleSort} />
                  <SortableHeader label="Risk" sortKey="riskLevel" current={sort} onSort={handleSort} />
                  <SortableHeader label="Response" sortKey="responseCode" current={sort} onSort={handleSort} align="center" />
                  <SortableHeader label="TLS" sortKey="tlsValid" current={sort} onSort={handleSort} align="center" />
                  <SortableHeader label="Last Probed" sortKey="lastProbed" current={sort} onSort={handleSort} />
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">
                      No exposures match your filters. <button onClick={() => { setSearch(''); setRiskFilter('all'); setTypeFilter('all'); }} className="text-primary hover:underline">Clear all</button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((exp) => (
                    <tr key={exp.id} onClick={() => setSelected(exp)} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer">
                      <td className="px-5 py-3.5 text-xs text-muted-foreground max-w-[200px]">
                        {riskSummary[exp.riskLevel] ?? '—'}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-card-foreground">
                        <div className="flex items-center gap-2">
                          {exp.domain}
                          <BlockedBadge entityId={exp.id} entityType="exposure" />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{exp.endpoint}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={exp.type} variant={exp.type === 'mcp' ? 'critical' : exp.type === 'llm-proxy' ? 'warning' : 'neutral'} />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={exp.riskLevel} variant={riskVariant(exp.riskLevel)} />
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`metric-text text-xs ${exp.responseCode === 200 ? 'text-success' : 'text-muted-foreground'}`}>{exp.responseCode}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-xs font-medium ${exp.tlsValid ? 'text-success' : 'text-destructive'}`}>{exp.tlsValid ? '✓ Valid' : '✗ Invalid'}</span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{exp.lastProbed}</td>
                      <td className="px-2 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                        <BlockButton
                          compact
                          entityId={exp.id}
                          entityType="exposure"
                          entityName={exp.domain}
                          entityDetail={`${exp.endpoint} (${exp.type})`}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-5 py-2.5 border-t border-border text-xs text-muted-foreground">
              Showing {filtered.length} of {externalExposures.length} exposures
            </div>
          )}
        </div>
      </ScrollReveal>

      {selected && (
        <ExposureDetailPanel exposure={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};
