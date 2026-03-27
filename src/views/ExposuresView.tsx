import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { SortableHeader, toggleSort, type SortState } from '@/components/SortableHeader';
import { ExposureDetailPanel } from '@/components/ExposureDetailPanel';
import { BlockButton, BlockedBadge } from '@/components/BlockButton';
import {
  externalExposures, attackSurfaceItems, digitalRiskItems,
  type ExternalExposure,
} from '@/data/mock';

type ExposureTab = 'endpoints' | 'attack-surface' | 'digital-risk';

// ── Helpers ──

const riskVariant = (r: string) => {
  const l = r.toLowerCase();
  if (l === 'critical') return 'critical' as const;
  if (l === 'high') return 'warning' as const;
  return 'neutral' as const;
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

// ── Attack surface metrics ──
const asTotal = attackSurfaceItems.length;
const asCritHigh = attackSurfaceItems.filter(i => i.severity === 'Critical' || i.severity === 'High').length;
const asActive = attackSurfaceItems.filter(i => i.status === 'ACTIVE').length;
const asImpersonations = attackSurfaceItems.filter(i => i.type === 'Impersonation').length;

// ── Digital risk metrics ──
const drTotal = digitalRiskItems.length;
const drOpen = digitalRiskItems.filter(i => i.status === 'OPEN').length;
const drInvestigating = digitalRiskItems.filter(i => i.status === 'INVESTIGATING').length;
const drCritical = digitalRiskItems.filter(i => i.risk === 'Critical').length;

const typeBadgeVariant = (t: string) => {
  if (t === 'Impersonation') return 'critical' as const;
  if (t === 'Exact Match') return 'warning' as const;
  return 'neutral' as const;
};

const statusBadgeVariant = (s: string) => {
  if (s === 'ACTIVE' || s === 'OPEN') return 'critical' as const;
  if (s === 'INVESTIGATING') return 'warning' as const;
  if (s === 'REPORTED' || s === 'RESOLVED') return 'success' as const;
  return 'neutral' as const;
};

export const ExposuresView = () => {
  const [activeTab, setActiveTab] = useState<ExposureTab>('endpoints');
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

  const tabBtn = (tab: ExposureTab, label: string, count: number) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-lg text-sm font-medium ${
        activeTab === tab
          ? 'bg-primary text-white'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
      }`}
    >
      {label}
      <span className={`ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
        activeTab === tab ? 'bg-white/20 text-white' : 'bg-muted-foreground/15 text-muted-foreground'
      }`}>{count}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-xl w-fit">
        {tabBtn('endpoints', 'Exposed Endpoints', externalExposures.length)}
        {tabBtn('attack-surface', 'Attack Surface', attackSurfaceItems.length)}
        {tabBtn('digital-risk', 'Digital Risk', digitalRiskItems.length)}
      </div>

      {/* ── Tab 1: Exposed Endpoints ── */}
      {activeTab === 'endpoints' && (
        <>
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
                        <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground text-sm">
                          No exposures match your filters. <button onClick={() => { setSearch(''); setRiskFilter('all'); setTypeFilter('all'); }} className="text-primary hover:underline">Clear all</button>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((exp) => (
                        <tr key={exp.id} onClick={() => setSelected(exp)} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer">
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
        </>
      )}

      {/* ── Tab 2: Attack Surface ── */}
      {activeTab === 'attack-surface' && (
        <>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Attack Surface Monitoring</h2>
            <p className="text-sm text-muted-foreground mt-1">Brand impersonation and unauthorized AI agent listings detected across public registries</p>
          </div>

          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Total Findings</p>
                <p className="text-2xl font-bold text-foreground">{asTotal}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Critical + High</p>
                <p className="text-2xl font-bold text-destructive">{asCritHigh}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Still Active</p>
                <p className="text-2xl font-bold text-foreground">{asActive}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Registries Scanned</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Impersonations</p>
                <p className="text-2xl font-bold text-foreground">{asImpersonations}</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-accent/50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registry</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Severity</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detected</th>
                      <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {attackSurfaceItems.map((item) => (
                      <tr key={item.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-card-foreground">{item.asset}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{item.registry}</td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={item.type} variant={typeBadgeVariant(item.type)} />
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={item.severity} variant={riskVariant(item.severity)} />
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={item.status} variant={statusBadgeVariant(item.status)} />
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">{item.detected}</td>
                        <td className="px-2 py-3.5 text-right">
                          <BlockButton
                            compact
                            entityId={item.id}
                            entityType="exposure"
                            entityName={item.asset}
                            entityDetail={`${item.registry} — ${item.type}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-2.5 border-t border-border text-xs text-muted-foreground">
                Showing {attackSurfaceItems.length} attack surface findings
              </div>
            </div>
          </ScrollReveal>
        </>
      )}

      {/* ── Tab 3: Digital Risk ── */}
      {activeTab === 'digital-risk' && (
        <>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Digital Risk Protection</h2>
            <p className="text-sm text-muted-foreground mt-1">Leaked credentials, rogue agents, and sensitive data exposures detected across public sources</p>
          </div>

          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Total Risks</p>
                <p className="text-2xl font-bold text-foreground">{drTotal}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Open</p>
                <p className="text-2xl font-bold text-destructive">{drOpen}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Investigating</p>
                <p className="text-2xl font-bold text-amber-600">{drInvestigating}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Critical</p>
                <p className="text-2xl font-bold text-destructive">{drCritical}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Sources Monitored</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-accent/50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Finding</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detected</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {digitalRiskItems.map((item) => (
                      <tr key={item.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-card-foreground max-w-[300px]">{item.finding}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{item.source}</td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={item.risk} variant={riskVariant(item.risk)} />
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">{item.detected}</td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={item.status} variant={statusBadgeVariant(item.status)} />
                        </td>
                        <td className="px-2 py-3.5 text-right">
                          <BlockButton
                            compact
                            entityId={item.id}
                            entityType="exposure"
                            entityName={item.finding}
                            entityDetail={`${item.source} — ${item.risk}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-2.5 border-t border-border text-xs text-muted-foreground">
                Showing {digitalRiskItems.length} digital risk findings
              </div>
            </div>
          </ScrollReveal>
        </>
      )}
    </div>
  );
};
