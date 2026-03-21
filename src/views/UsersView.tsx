import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { userActivities } from '@/data/mock';

const riskVariant = (r: string) => r === 'high' ? 'critical' : r === 'medium' ? 'warning' : 'success';

export const UsersView = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-semibold text-foreground">User Activity</h2>
      <p className="text-sm text-muted-foreground mt-1">AI tool usage mapped to users and devices</p>
    </div>

    <ScrollReveal>
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tools Used</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Requests</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {userActivities.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[11px] font-semibold text-accent-foreground">
                        {user.email.split('.').map(p => p[0].toUpperCase()).slice(0, 2).join('')}
                      </div>
                      <span className="font-medium text-card-foreground">{user.email}</span>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ScrollReveal>
  </div>
);
