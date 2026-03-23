import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { SortableHeader, toggleSort, type SortState } from '@/components/SortableHeader';
import { ToolDetailPanel } from '@/components/ToolDetailPanel';
import { BlockButton, BlockedBadge } from '@/components/BlockButton';
import { aiTools, type AITool } from '@/data/mock';

const statusOptions = ['all', 'approved', 'unknown', 'unsanctioned'] as const;
const categoryOptions = ['all', ...Array.from(new Set(aiTools.map(t => t.category)))] as const;

type SortKey = 'name' | 'domain' | 'category' | 'status' | 'users' | 'requests' | 'firstSeen' | 'lastSeen';

const compareFn = (a: AITool, b: AITool, key: SortKey): number => {
  switch (key) {
    case 'users': return a.users - b.users;
    case 'requests': return a.requests - b.requests;
    default: return String(a[key]).localeCompare(String(b[key]));
  }
};

export const ToolsView = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sort, setSort] = useState<SortState<SortKey>>(null);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);

  const filtered = useMemo(() => {
    let data = aiTools.filter(t => {
      const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.domain.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
    if (sort) {
      data = [...data].sort((a, b) => {
        const c = compareFn(a, b, sort.key);
        return sort.dir === 'asc' ? c : -c;
      });
    }
    return data;
  }, [search, statusFilter, categoryFilter, sort]);

  const hasFilters = search || statusFilter !== 'all' || categoryFilter !== 'all';
  const handleSort = (key: SortKey) => setSort(prev => toggleSort(prev, key));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">AI Tool Inventory</h2>
        <p className="text-sm text-muted-foreground mt-1">All AI tools detected via DNS log analysis</p>
      </div>

      <ScrollReveal>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools or domains…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer">
            {statusOptions.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer">
            {categoryOptions.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
            ))}
          </select>
          {hasFilters && (
            <button onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); }} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
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
                  <SortableHeader label="Tool" sortKey="name" current={sort} onSort={handleSort} />
                  <SortableHeader label="Domain" sortKey="domain" current={sort} onSort={handleSort} />
                  <SortableHeader label="Category" sortKey="category" current={sort} onSort={handleSort} />
                  <SortableHeader label="Status" sortKey="status" current={sort} onSort={handleSort} />
                  <SortableHeader label="Users" sortKey="users" current={sort} onSort={handleSort} align="right" />
                  <SortableHeader label="Requests" sortKey="requests" current={sort} onSort={handleSort} align="right" />
                  <SortableHeader label="First Seen" sortKey="firstSeen" current={sort} onSort={handleSort} />
                  <SortableHeader label="Last Seen" sortKey="lastSeen" current={sort} onSort={handleSort} />
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground text-sm">
                      No tools match your filters. <button onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); }} className="text-primary hover:underline">Clear all</button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((tool) => (
                    <tr key={tool.id} onClick={() => setSelectedTool(tool)} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer">
                      <td className="px-5 py-3.5 font-medium text-card-foreground">
                        <div className="flex items-center gap-2">
                          {tool.name}
                          <BlockedBadge entityId={tool.id} entityType="tool" />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{tool.domain}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{tool.category}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={tool.status} variant={tool.status === 'approved' ? 'success' : tool.status === 'unsanctioned' ? 'critical' : 'warning'} />
                      </td>
                      <td className="px-5 py-3.5 text-right metric-text">{tool.users}</td>
                      <td className="px-5 py-3.5 text-right metric-text">{tool.requests.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{tool.firstSeen}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{tool.lastSeen}</td>
                      <td className="px-2 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                        <BlockButton
                          compact
                          entityId={tool.id}
                          entityType="tool"
                          entityName={tool.name}
                          entityDetail={tool.domain}
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
              Showing {filtered.length} of {aiTools.length} tools
            </div>
          )}
        </div>
      </ScrollReveal>

      {selectedTool && (
        <ToolDetailPanel tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </div>
  );
};
