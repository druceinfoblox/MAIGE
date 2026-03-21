import { Radar, Users, Server, Globe, AlertTriangle, Eye } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { summaryMetrics, aiTools, externalExposures } from '@/data/mock';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const trendData = [
  { week: 'W1', requests: 12400 },
  { week: 'W2', requests: 18200 },
  { week: 'W3', requests: 21800 },
  { week: 'W4', requests: 19600 },
  { week: 'W5', requests: 28100 },
  { week: 'W6', requests: 34200 },
  { week: 'W7', requests: 31800 },
  { week: 'W8', requests: 42300 },
  { week: 'W9', requests: 48100 },
  { week: 'W10', requests: 52400 },
  { week: 'W11', requests: 61200 },
  { week: 'W12', requests: 68900 },
];

export const DashboardView = () => {
  const unsanctioned = aiTools.filter(t => t.status === 'unsanctioned');
  const criticalExposures = externalExposures.filter(e => e.riskLevel === 'critical');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">AI Visibility Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Enterprise-wide AI and agent activity summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard label="AI Tools Detected" value={summaryMetrics.totalTools} icon={<Radar size={20} />} change="+3 this month" delay={0} />
        <MetricCard label="Active Users" value={summaryMetrics.totalUsers} icon={<Users size={20} />} change="+63 from last month" delay={0.07} />
        <MetricCard label="Internal Agents" value={summaryMetrics.internalAgents} icon={<Server size={20} />} change="2 newly discovered" delay={0.14} />
        <MetricCard label="External Exposures" value={summaryMetrics.externalExposures} icon={<Globe size={20} />} change="1 critical" variant="critical" delay={0.21} />
      </div>

      {/* Insights */}
      <ScrollReveal delay={0.1}>
        <div className="bg-card rounded-xl border border-border shadow-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
            <Eye size={16} className="text-primary" />
            Key Insights
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/15">
              <AlertTriangle size={16} className="text-warning mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <span className="font-medium text-card-foreground">{summaryMetrics.shadowAIUsers} users</span>
                <span className="text-muted-foreground"> are accessing unsanctioned AI tools including </span>
                <span className="font-medium text-card-foreground">{unsanctioned.map(t => t.name).join(', ')}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/15">
              <Globe size={16} className="text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <span className="font-medium text-card-foreground">{criticalExposures.length} critical exposure</span>
                <span className="text-muted-foreground"> detected: publicly accessible MCP endpoint at </span>
                <span className="font-mono text-xs text-card-foreground">{criticalExposures[0]?.domain}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/15">
              <Server size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <span className="font-medium text-card-foreground">{summaryMetrics.unknownTools} unknown AI tools</span>
                <span className="text-muted-foreground"> awaiting classification as approved or unsanctioned</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Trend chart */}
        <ScrollReveal delay={0.1} className="xl:col-span-2">
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">AI Request Volume (12 weeks)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(172, 100%, 39%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(220, 13%, 88%)', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value: number) => [value.toLocaleString(), 'Requests']}
                  />
                  <Area type="monotone" dataKey="requests" stroke="hsl(173, 58%, 39%)" strokeWidth={2} fill="url(#areaGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ScrollReveal>

        {/* Top tools */}
        <ScrollReveal delay={0.15}>
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Top AI Tools by Usage</h3>
            <div className="space-y-3">
              {aiTools.slice(0, 5).sort((a, b) => b.requests - a.requests).map((tool) => (
                <div key={tool.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                      {tool.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.users} users</p>
                    </div>
                  </div>
                  <StatusBadge
                    status={tool.status}
                    variant={tool.status === 'approved' ? 'success' : tool.status === 'unsanctioned' ? 'critical' : 'warning'}
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
