import { useCallback, useEffect, useRef, useState } from 'react';
import { Users, Radar, Server, Globe, AlertTriangle } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { userActivities, aiTools, internalAgents, externalExposures } from '@/data/mock';

// --- Graph relationship data ---
// Tools → Internal Agents (which tools route through which agents)
const toolToAgent: Record<string, string[]> = {
  'ChatGPT': ['llm-gateway.corp.company.com', 'ai-proxy.staging.company.com'],
  'Claude': ['llm-gateway.corp.company.com'],
  'GitHub Copilot': ['ai-proxy.staging.company.com'],
  'Gemini': ['llm-gateway.corp.company.com'],
  'Cursor AI': ['ai-proxy.staging.company.com'],
  'Midjourney': [],
  'Perplexity': [],
  'Hugging Face': ['embeddings.ml.company.com', 'rag-service.internal.company.com'],
  'Replicate': ['embeddings.ml.company.com'],
  'Mistral': ['llm-gateway.corp.company.com'],
};

// Internal Agents → External Exposures
const agentToExposure: Record<string, string[]> = {
  'mcp.internal.company.com': ['mcp.company.com'],
  'llm-gateway.corp.company.com': ['api.company.com'],
  'ai-proxy.staging.company.com': ['agent.company.com', 'dev-ai.company.com'],
  'agent-orchestrator.k8s.company.com': ['agent.company.com'],
  'embeddings.ml.company.com': ['ml-staging.company.com'],
  'rag-service.internal.company.com': ['mcp.company.com'],
};

// Agent → Agent MCP interactions (internal service-to-service communication)
const agentToAgent: Record<string, { target: string; protocol: string }[]> = {
  'agent-orchestrator.k8s.company.com': [
    { target: 'llm-gateway.corp.company.com', protocol: 'MCP/gRPC' },
    { target: 'rag-service.internal.company.com', protocol: 'MCP/HTTP' },
  ],
  'mcp.internal.company.com': [
    { target: 'embeddings.ml.company.com', protocol: 'MCP/gRPC' },
    { target: 'agent-orchestrator.k8s.company.com', protocol: 'MCP/HTTP' },
  ],
  'rag-service.internal.company.com': [
    { target: 'embeddings.ml.company.com', protocol: 'MCP/HTTP' },
  ],
};

type NodeId = string;
type Column = 'users' | 'tools' | 'agents' | 'exposures';

interface GraphNode {
  id: NodeId;
  column: Column;
  label: string;
  sublabel: string;
  badge?: { text: string; variant: 'success' | 'warning' | 'critical' | 'neutral' };
  riskBorder?: boolean;
}

interface GraphEdge {
  from: NodeId;
  to: NodeId;
  type?: 'default' | 'agent-to-agent';
  protocol?: string;
}

// Build nodes
const userNodes: GraphNode[] = userActivities.slice(0, 6).map(u => ({
  id: `user-${u.id}`,
  column: 'users' as Column,
  label: u.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()),
  sublabel: u.department,
  badge: { text: u.riskLevel, variant: u.riskLevel === 'high' ? 'critical' as const : u.riskLevel === 'medium' ? 'warning' as const : 'success' as const },
  riskBorder: u.riskLevel === 'high',
}));

const toolNodes: GraphNode[] = aiTools.map(t => ({
  id: `tool-${t.id}`,
  column: 'tools' as Column,
  label: t.name,
  sublabel: t.domain,
  badge: { text: t.status, variant: t.status === 'approved' ? 'success' as const : t.status === 'unsanctioned' ? 'critical' as const : 'warning' as const },
  riskBorder: t.status === 'unsanctioned',
}));

const agentNodes: GraphNode[] = internalAgents.map(a => ({
  id: `agent-${a.id}`,
  column: 'agents' as Column,
  label: a.hostname.split('.')[0],
  sublabel: a.hostname,
  badge: { text: a.serviceType, variant: a.serviceType === 'agent' ? 'warning' as const : 'success' as const },
}));

const exposureNodes: GraphNode[] = externalExposures.map(e => ({
  id: `exposure-${e.id}`,
  column: 'exposures' as Column,
  label: e.domain,
  sublabel: e.endpoint,
  badge: { text: e.riskLevel, variant: e.riskLevel === 'critical' ? 'critical' as const : e.riskLevel === 'high' ? 'warning' as const : 'neutral' as const },
  riskBorder: e.riskLevel === 'critical',
}));

// Build edges
const edges: GraphEdge[] = [];

// User → Tool edges
userActivities.slice(0, 6).forEach(u => {
  u.toolsUsed.forEach(toolName => {
    const tool = aiTools.find(t => t.name === toolName);
    if (tool) edges.push({ from: `user-${u.id}`, to: `tool-${tool.id}` });
  });
});

// Tool → Agent edges
aiTools.forEach(t => {
  const agents = toolToAgent[t.name] || [];
  agents.forEach(hostname => {
    const agent = internalAgents.find(a => a.hostname === hostname);
    if (agent) edges.push({ from: `tool-${t.id}`, to: `agent-${agent.id}` });
  });
});

// Agent → Exposure edges
internalAgents.forEach(a => {
  const exposures = agentToExposure[a.hostname] || [];
  exposures.forEach(domain => {
    const exp = externalExposures.find(e => e.domain === domain);
    if (exp) edges.push({ from: `agent-${a.id}`, to: `exposure-${exp.id}` });
  });
});

// Agent → Agent MCP edges (self-referencing within agents column)
internalAgents.forEach(a => {
  const targets = agentToAgent[a.hostname] || [];
  targets.forEach(({ target, protocol }) => {
    const targetAgent = internalAgents.find(ag => ag.hostname === target);
    if (targetAgent) edges.push({ from: `agent-${a.id}`, to: `agent-${targetAgent.id}`, type: 'agent-to-agent', protocol });
  });
});

const allNodes = [...userNodes, ...toolNodes, ...agentNodes, ...exposureNodes];

const columnConfig: { key: Column; label: string; icon: typeof Users; color: string }[] = [
  { key: 'users', label: 'Users', icon: Users, color: 'hsl(200, 80%, 55%)' },
  { key: 'tools', label: 'AI Tools', icon: Radar, color: 'hsl(144, 100%, 37%)' },
  { key: 'agents', label: 'Internal Agents', icon: Server, color: 'hsl(38, 92%, 50%)' },
  { key: 'exposures', label: 'Exposures', icon: Globe, color: 'hsl(0, 72%, 51%)' },
];

const badgeStyles = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  critical: 'bg-destructive/15 text-destructive',
  neutral: 'bg-muted text-muted-foreground',
};

export const GraphView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  const measurePositions = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setContainerRect(rect);
    const newPos: Record<string, { x: number; y: number }> = {};
    for (const [id, el] of Object.entries(nodeRefs.current)) {
      if (el) {
        const r = el.getBoundingClientRect();
        newPos[id] = {
          x: r.left - rect.left + r.width / 2,
          y: r.top - rect.top + r.height / 2,
        };
      }
    }
    setPositions(newPos);
  }, []);

  useEffect(() => {
    const timer = setTimeout(measurePositions, 100);
    window.addEventListener('resize', measurePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measurePositions);
    };
  }, [measurePositions]);

  // Get edges connected to hovered node
  const connectedEdges = hoveredNode
    ? edges.filter(e => e.from === hoveredNode || e.to === hoveredNode)
    : [];
  const connectedNodeIds = new Set<string>();
  if (hoveredNode) {
    connectedNodeIds.add(hoveredNode);
    connectedEdges.forEach(e => {
      connectedNodeIds.add(e.from);
      connectedNodeIds.add(e.to);
    });
  }

  const MCP_COLOR = 'hsl(270, 70%, 60%)';

  const getEdgeColor = (edge: GraphEdge) => {
    if (edge.type === 'agent-to-agent') return MCP_COLOR;
    const fromNode = allNodes.find(n => n.id === edge.from);
    if (!fromNode) return 'hsl(200, 16%, 70%)';
    const col = columnConfig.find(c => c.key === fromNode.column);
    return col?.color || 'hsl(200, 16%, 70%)';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">AI Asset Graph</h2>
          <p className="text-sm text-muted-foreground mt-1">Relationship map: Users → AI Tools → Internal Agents → External Exposures</p>
        </div>
      </div>

      <ScrollReveal>
        <div ref={containerRef} className="relative bg-card rounded-xl border border-border shadow-card overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-4 gap-0 border-b border-border bg-accent/30">
            {columnConfig.map(col => (
              <div key={col.key} className="flex items-center justify-center gap-2 py-3 px-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: col.color + '20', color: col.color }}
                >
                  <col.icon size={13} />
                  {col.label}
                </span>
              </div>
            ))}
          </div>

          {/* Graph area */}
          <div className="relative min-h-[700px] p-6">
            {/* SVG connections layer */}
            {containerRect && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                {edges.map((edge, i) => {
                  const from = positions[edge.from];
                  const to = positions[edge.to];
                  if (!from || !to) return null;

                  const isHighlighted = hoveredNode && connectedEdges.includes(edge);
                  const isDimmed = hoveredNode && !isHighlighted;
                  const color = getEdgeColor(edge);
                  const isAgentEdge = edge.type === 'agent-to-agent';

                  let path: string;
                  if (isAgentEdge) {
                    // Arc curve for same-column agent-to-agent links
                    const midY = (from.y + to.y) / 2;
                    const dist = Math.abs(to.y - from.y);
                    const arcX = from.x + Math.max(60, dist * 0.4);
                    path = `M ${from.x} ${from.y} C ${arcX} ${from.y}, ${arcX} ${to.y}, ${to.x} ${to.y}`;
                  } else {
                    const dx = (to.x - from.x) * 0.45;
                    path = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
                  }

                  return (
                    <g key={i}>
                      <path
                        d={path}
                        fill="none"
                        stroke={isHighlighted ? color : isDimmed ? 'hsl(200, 10%, 85%)' : color}
                        strokeWidth={isHighlighted ? 2.5 : isAgentEdge ? 1.8 : 1.2}
                        strokeOpacity={isDimmed ? 0.15 : isHighlighted ? 0.9 : isAgentEdge ? 0.5 : 0.3}
                        strokeDasharray={isAgentEdge ? '6 3' : undefined}
                        className="transition-all duration-300"
                      />
                      {/* Protocol label on agent-to-agent edges */}
                      {isAgentEdge && !isDimmed && (
                        <text
                          x={from.x + Math.max(60, Math.abs(to.y - from.y) * 0.4) + 4}
                          y={(from.y + to.y) / 2}
                          fill={color}
                          fontSize="8"
                          fontFamily="var(--font-mono, monospace)"
                          opacity={isHighlighted ? 1 : 0.6}
                          dominantBaseline="middle"
                        >
                          {edge.protocol}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Node columns */}
            <div className="relative grid grid-cols-4 gap-0" style={{ zIndex: 1 }}>
              {columnConfig.map(col => {
                const colNodes = allNodes.filter(n => n.column === col.key);
                return (
                  <div key={col.key} className="flex flex-col items-center gap-3 px-3">
                    {colNodes.map(node => {
                      const isDimmed = hoveredNode && !connectedNodeIds.has(node.id);
                      return (
                        <div
                          key={node.id}
                          ref={el => { nodeRefs.current[node.id] = el; }}
                          onMouseEnter={() => setHoveredNode(node.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                          className={`
                            w-full max-w-[200px] rounded-lg border px-3.5 py-2.5 cursor-pointer
                            transition-all duration-200 bg-card
                            ${node.riskBorder ? 'border-destructive/40' : 'border-border'}
                            ${isDimmed ? 'opacity-25 scale-[0.97]' : 'opacity-100'}
                            ${hoveredNode === node.id ? 'shadow-card-hover ring-1 ring-primary/30 scale-[1.02]' : 'shadow-card hover:shadow-card-hover'}
                          `}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-card-foreground truncate">{node.label}</p>
                              <p className="text-[10px] text-muted-foreground truncate font-mono mt-0.5">{node.sublabel}</p>
                            </div>
                            {node.badge && (
                              <span className={`flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold ${badgeStyles[node.badge.variant]}`}>
                                {node.badge.text}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 py-3 px-4 border-t border-border bg-accent/20">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Legend:</span>
            {columnConfig.map(col => (
              <div key={col.key} className="flex items-center gap-1.5">
                <span className="w-3 h-[2px] rounded" style={{ backgroundColor: col.color }} />
                <span className="text-[10px] text-muted-foreground">{col.label} connections</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={10} className="text-destructive" />
              <span className="text-[10px] text-muted-foreground">Risk indicator</span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
