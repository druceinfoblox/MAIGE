import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { SortableHeader, toggleSort, type SortState } from '@/components/SortableHeader';
import { AgentDetailPanel } from '@/components/AgentDetailPanel';
import { BlockButton, BlockedBadge } from '@/components/BlockButton';
import { internalAgents, type InternalAgent } from '@/data/mock';

const typeOptions = ['all', 'agent', 'api', 'unknown'] as const;
const confidenceOptions = ['all', 'confirmed', 'inferred'] as const;

type SortKey = 'hostname' | 'serviceType' | 'protocol' | 'clients' | 'queriesPerDay' | 'confidence' | 'firstSeen';

const compareFn = (a: InternalAgent, b: InternalAgent, key: SortKey): number => {
  if (key === 'clients') return a.clients - b.clients;
  if (key === 'queriesPerDay') return a.queriesPerDay - b.queriesPerDay;
  return String(a[key]).localeCompare(String(b[key]));
};

export const AgentsView = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [confFilter, setConfFilter] = useState<string>('all');
  const [sort, setSort] = useState<SortState<SortKey>>(null);
  const [selectedAgent, setSelectedAgent] = useState<InternalAgent | null>(null);

  const filtered = useMemo(() => {
    let data = internalAgents.filter(a => {
      const matchesSearch = !search || a.hostname.toLowerCase().includes(search.toLowerCase()) || a.protocol.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || a.serviceType === typeFilter;
      const matchesConf = confFilter === 'all' || a.confidence === confFilter;
      return matchesSearch && matchesType && matchesConf;
    });
    if (sort) {
      data = [...data].sort((a, b) => {
        const c = compareFn(a, b, sort.key);
        return sort.dir === 'asc' ? c : -c;
      });
    }
    return data;
  }, [search, typeFilter, confFilter, sort]);

  const hasFilters = search || typeFilter !== 'all' || confFilter !== 'all';
  const handleSort = (key: SortKey) => setSort(prev => toggleSort(prev, key));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Internal Agent Services</h2>
        <p className="text-sm text-muted-foreground mt-1">Agent and API services discovered in internal DNS zones</p>
      </div>

      <ScrollReveal>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search hostnames or protocols…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer">
            {typeOptions.map(t => (
              <option key={t} value={t}>{t === 'all' ? 'All types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
          <select value={confFilter} onChange={e => setConfFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer">
            {confidenceOptions.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All confidence' : c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          {hasFilters && (
            <button onClick={() => { setSearch(''); setTypeFilter('all'); setConfFilter('all'); }} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
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
                  <SortableHeader label="Hostname" sortKey="hostname" current={sort} onSort={handleSort} />
                  <SortableHeader label="Type" sortKey="serviceType" current={sort} onSort={handleSort} />
                  <SortableHeader label="Protocol" sortKey="protocol" current={sort} onSort={handleSort} />
                  <SortableHeader label="Clients" sortKey="clients" current={sort} onSort={handleSort} align="right" />
                  <SortableHeader label="Queries/Day" sortKey="queriesPerDay" current={sort} onSort={handleSort} align="right" />
                  <SortableHeader label="Confidence" sortKey="confidence" current={sort} onSort={handleSort} />
                  <SortableHeader label="First Seen" sortKey="firstSeen" current={sort} onSort={handleSort} />
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">
                      No agents match your filters. <button onClick={() => { setSearch(''); setTypeFilter('all'); setConfFilter('all'); }} className="text-primary hover:underline">Clear all</button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((agent) => (
                    <tr key={agent.id} onClick={() => setSelectedAgent(agent)} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer">
                      <td className="px-5 py-3.5 font-mono text-xs text-card-foreground">
                        <div className="flex items-center gap-2">
                          {agent.hostname}
                          <BlockedBadge entityId={agent.id} />
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge
                          status={agent.serviceType}
                          variant={agent.serviceType === 'agent' ? 'warning' : agent.serviceType === 'api' ? 'success' : 'neutral'}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{agent.protocol}</td>
                      <td className="px-5 py-3.5 text-right metric-text">{agent.clients}</td>
                      <td className="px-5 py-3.5 text-right metric-text">{agent.queriesPerDay.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge
                          status={agent.confidence}
                          variant={agent.confidence === 'confirmed' ? 'success' : 'neutral'}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{agent.firstSeen}</td>
                      <td className="px-2 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                        <BlockButton
                          compact
                          entityId={agent.id}
                          entityType="agent"
                          entityName={agent.hostname}
                          entityDetail={agent.protocol}
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
              Showing {filtered.length} of {internalAgents.length} agents
            </div>
          )}
        </div>
      </ScrollReveal>

      {selectedAgent && (
        <AgentDetailPanel agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
};
