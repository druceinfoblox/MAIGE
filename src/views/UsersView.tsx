import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { SortableHeader, toggleSort, type SortState } from '@/components/SortableHeader';
import { UserDetailPanel } from '@/components/UserDetailPanel';
import { BlockButton, BlockedBadge } from '@/components/BlockButton';
import { userActivities, type UserActivity } from '@/data/mock';

const riskVariant = (r: string) => r === 'high' ? 'critical' as const : r === 'medium' ? 'warning' as const : 'success' as const;
const riskOptions = ['all', 'low', 'medium', 'high'] as const;
const deptOptions = ['all', ...Array.from(new Set(userActivities.map(u => u.department)))] as const;

type SortKey = 'email' | 'department' | 'totalRequests' | 'riskLevel' | 'lastActive';

const riskOrder: Record<string, number> = { low: 0, medium: 1, high: 2 };

const compareFn = (a: UserActivity, b: UserActivity, key: SortKey): number => {
  if (key === 'totalRequests') return a.totalRequests - b.totalRequests;
  if (key === 'riskLevel') return (riskOrder[a.riskLevel] ?? 0) - (riskOrder[b.riskLevel] ?? 0);
  return String(a[key]).localeCompare(String(b[key]));
};

export const UsersView = () => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [sort, setSort] = useState<SortState<SortKey>>(null);
  const [selectedUser, setSelectedUser] = useState<UserActivity | null>(null);

  const filtered = useMemo(() => {
    let data = userActivities.filter(u => {
      const matchesSearch = !search || u.email.toLowerCase().includes(search.toLowerCase()) || u.toolsUsed.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesRisk = riskFilter === 'all' || u.riskLevel === riskFilter;
      const matchesDept = deptFilter === 'all' || u.department === deptFilter;
      return matchesSearch && matchesRisk && matchesDept;
    });
    if (sort) {
      data = [...data].sort((a, b) => {
        const c = compareFn(a, b, sort.key);
        return sort.dir === 'asc' ? c : -c;
      });
    }
    return data;
  }, [search, riskFilter, deptFilter, sort]);

  const hasFilters = search || riskFilter !== 'all' || deptFilter !== 'all';
  const handleSort = (key: SortKey) => setSort(prev => toggleSort(prev, key));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">User Mapping</h2>
        <p className="text-sm text-muted-foreground mt-1">AI tool usage mapped to users and devices</p>
      </div>

      <ScrollReveal>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users or tools…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
            />
          </div>
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer">
            {riskOptions.map(r => (
              <option key={r} value={r}>{r === 'all' ? 'All risk levels' : r.charAt(0).toUpperCase() + r.slice(1) + ' risk'}</option>
            ))}
          </select>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer">
            {deptOptions.map(d => (
              <option key={d} value={d}>{d === 'all' ? 'All departments' : d}</option>
            ))}
          </select>
          {hasFilters && (
            <button onClick={() => { setSearch(''); setRiskFilter('all'); setDeptFilter('all'); }} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
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
                  <SortableHeader label="User" sortKey="email" current={sort} onSort={handleSort} />
                  <SortableHeader label="Department" sortKey="department" current={sort} onSort={handleSort} />
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tools Used</th>
                  <SortableHeader label="Requests" sortKey="totalRequests" current={sort} onSort={handleSort} align="right" />
                  <SortableHeader label="Risk" sortKey="riskLevel" current={sort} onSort={handleSort} />
                  <SortableHeader label="Last Active" sortKey="lastActive" current={sort} onSort={handleSort} />
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">
                      No users match your filters. <button onClick={() => { setSearch(''); setRiskFilter('all'); setDeptFilter('all'); }} className="text-primary hover:underline">Clear all</button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id} onClick={() => setSelectedUser(user)} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[11px] font-semibold text-accent-foreground">
                            {user.email.split('.').map(p => p[0].toUpperCase()).slice(0, 2).join('')}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-card-foreground">{user.email}</span>
                            <BlockedBadge entityId={user.id} entityType="user" />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{user.department}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {user.toolsUsed.map(t => (
                            <span key={t} className="inline-block px-1.5 py-0.5 bg-accent text-accent-foreground text-xs rounded">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right metric-text">{user.totalRequests.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={user.riskLevel} variant={riskVariant(user.riskLevel)} />
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{user.lastActive}</td>
                      <td className="px-2 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                        <BlockButton
                          compact
                          entityId={user.id}
                          entityType="user"
                          entityName={user.email}
                          entityDetail={user.department}
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
              Showing {filtered.length} of {userActivities.length} users
            </div>
          )}
        </div>
      </ScrollReveal>

      {selectedUser && (
        <UserDetailPanel user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};
