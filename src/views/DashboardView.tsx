import { useState } from 'react';
import { Radar, Users, Server, Globe, AlertTriangle, Info, AlertOctagon, ChevronRight, TrendingUp } from 'lucide-react';
import type { View } from '@/pages/Index';
import { MetricCard } from '@/components/MetricCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { summaryMetrics, aiTools } from '@/data/mock';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, LineChart, Line } from 'recharts';

const timeRanges = ['Last 7d', '30d', '90d', 'All'];

const trendData = [
  { day: 'Mon', queries: 18400 },
  { day: 'Tue', queries: 22100 },
  { day: 'Wed', queries: 19800 },
  { day: 'Thu', queries: 28700 },
  { day: 'Fri', queries: 34200 },
  { day: 'Sat', queries: 12100 },
  { day: 'Sun', queries: 9800 },
];

const topToolsData = aiTools
  .sort((a, b) => b.requests - a.requests)
  .slice(0, 6)
  .map(t => ({
    name: t.name,
    queries: t.requests,
    status: t.status,
  }));

const toolBarColors: Record<string, string> = {
  approved: 'hsl(144, 100%, 37%)',
  unknown: 'hsl(200, 80%, 55%)',
  unsanctioned: 'hsl(0, 72%, 51%)',
};

const classificationData = [
  { name: 'Approved', value: aiTools.filter(t => t.status === 'approved').length, color: 'hsl(144, 100%, 37%)' },
  { name: 'Unknown', value: aiTools.filter(t => t.status === 'unknown').length, color: 'hsl(200, 80%, 55%)' },
  { name: 'Unsanctioned', value: aiTools.filter(t => t.status === 'unsanctioned').length, color: 'hsl(0, 72%, 51%)' },
];

const insights: { icon: typeof AlertOctagon; iconColor: string; borderColor: string; bgColor: string; text: string; navigateTo: View }[] = [
  {
    icon: AlertOctagon,
    iconColor: 'text-destructive',
    borderColor: 'border-destructive/40',
    bgColor: 'bg-destructive/8',
    text: '1 public MCP endpoint exposed — mcp.acme.com is unauthenticated and internet-facing.',
    navigateTo: 'exposures',
  },
  {
    icon: AlertTriangle,
    iconColor: 'text-warning',
    borderColor: 'border-warning/40',
    bgColor: 'bg-warning/8',
    text: `${summaryMetrics.shadowAIUsers} users accessing unsanctioned tools — Perplexity AI, Mistral, and 3 others.`,
    navigateTo: 'users',
  },
  {
    icon: AlertTriangle,
    iconColor: 'text-warning',
    borderColor: 'border-warning/30',
    bgColor: 'bg-warning/5',
    text: '2 internal agent services unclassified — agent-gw.corp and llm-proxy.internal.',
    navigateTo: 'agents',
  },
  {
    icon: Info,
    iconColor: 'text-[hsl(var(--info))]',
    borderColor: 'border-[hsl(var(--info))]/30',
    bgColor: 'bg-[hsl(var(--info))]/5',
    text: '6 new AI tools discovered in DNS this week — Mistral, Groq, Cohere, and 3 others.',
    navigateTo: 'tools',
  },
];

export const DashboardView = ({ onNavigate }: { onNavigate: (view: View) => void }) => {
  const [activeRange, setActiveRange] = useState('Last 7d');

  return (
    <div className="space-y-6">
      {/* Header with time range */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Findings</h2>
          <p className="text-sm text-muted-foreground mt-0.5">AI footprint across your environment</p>
        </div>
        <div className="flex items-center gap-1.5">
          {timeRanges.map(range => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150
                ${activeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border'
                }
              `}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard label="AI Tools Detected" value={34} icon={<Radar size={20} />} change="+6 new this week" delay={0} onClick={() => onNavigate('tools')} />
        <MetricCard label="Users with AI Activity" value={218} icon={<Users size={20} />} change="67% of org" delay={0.07} onClick={() => onNavigate('users')} />
        <MetricCard label="Internal Agents" value={11} icon={<Server size={20} />} change="+2 unclassified" variant="warning" delay={0.14} onClick={() => onNavigate('agents')} />
        <MetricCard label="External Exposures" value={summaryMetrics.externalExposures} icon={<Globe size={20} />} change="1 critical" variant="critical" delay={0.21} onClick={() => onNavigate('exposures')} />
      </div>

      {/* Insights + Top Tools side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Insights & alerts */}
        <ScrollReveal delay={0.08} className="xl:col-span-3">
          <div className="bg-card rounded-xl border border-border shadow-card p-5 space-y-3 h-full">
            <h3 className="text-sm font-semibold text-card-foreground">Insights & alerts</h3>
            <div className="space-y-2.5">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  onClick={() => onNavigate(insight.navigateTo)}
                  className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all duration-150 hover:brightness-125 active:scale-[0.99] ${insight.borderColor} ${insight.bgColor}`}
                >
                  <insight.icon size={16} className={`${insight.iconColor} mt-0.5 flex-shrink-0`} />
                  <p className="text-sm text-card-foreground leading-relaxed flex-1">{insight.text}</p>
                  <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Top tools by DNS query volume */}
        <ScrollReveal delay={0.12} className="xl:col-span-2">
          <div className="bg-card rounded-xl border border-border shadow-card p-5 h-full">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Top tools by DNS query volume</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topToolsData} layout="vertical" margin={{ left: 0, right: 12, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tick={{ fontSize: 11, fill: 'hsl(210, 20%, 70%)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="queries" radius={[0, 4, 4, 0]} barSize={18}>
                    {topToolsData.map((entry, index) => (
                      <Cell key={index} fill={toolBarColors[entry.status]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'hsl(144, 100%, 37%)' }} />
                <span className="text-[10px] text-muted-foreground">Approved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'hsl(200, 80%, 55%)' }} />
                <span className="text-[10px] text-muted-foreground">Unknown</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'hsl(0, 72%, 51%)' }} />
                <span className="text-[10px] text-muted-foreground">Unsanctioned</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* DNS trend + Classification */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ScrollReveal delay={0.1} className="xl:col-span-2">
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">DNS query trend — 7 days</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(144, 100%, 37%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(144, 100%, 37%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 20%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(210, 12%, 55%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(210, 12%, 55%)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(210, 32%, 14%)', border: '1px solid hsl(210, 20%, 20%)', borderRadius: '8px', fontSize: '12px', color: 'hsl(210, 20%, 90%)' }}
                    formatter={(value: number) => [value.toLocaleString(), 'Queries']}
                  />
                  <Area type="monotone" dataKey="queries" stroke="hsl(144, 100%, 37%)" strokeWidth={2} fill="url(#areaGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.14}>
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Classification breakdown</h3>
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classificationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {classificationData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'hsl(210, 32%, 14%)', border: '1px solid hsl(210, 20%, 20%)', borderRadius: '8px', fontSize: '12px', color: 'hsl(210, 20%, 90%)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2">
              {classificationData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] text-muted-foreground">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
