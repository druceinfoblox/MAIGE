import { useState } from 'react';
import { ShieldOff, Shield, Trash2, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { StatusBadge } from '@/components/StatusBadge';
import { usePolicyStore, type EntityType } from '@/hooks/usePolicyStore';
import { ToolDetailPanel } from '@/components/ToolDetailPanel';
import { UserDetailPanel } from '@/components/UserDetailPanel';
import { AgentDetailPanel } from '@/components/AgentDetailPanel';
import { ExposureDetailPanel } from '@/components/ExposureDetailPanel';
import {
  aiTools, userActivities, internalAgents, externalExposures,
  governanceRules, complianceFrameworks, aiUsagePolicies,
  type AITool, type UserActivity, type InternalAgent, type ExternalExposure,
} from '@/data/mock';

type PolicyTab = 'governance' | 'compliance' | 'usage';

const entityTypeLabels: Record<EntityType, string> = {
  tool: 'AI Tool',
  user: 'User',
  agent: 'Server',
  exposure: 'Exposure',
};

const entityTypeBadgeClass: Record<EntityType, string> = {
  tool: 'bg-blue-500/15 text-blue-600',
  user: 'bg-purple-500/15 text-purple-700',
  agent: 'bg-amber-500/15 text-amber-700',
  exposure: 'bg-destructive/15 text-destructive',
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function rawId(namespacedId: string): string {
  const idx = namespacedId.indexOf(':');
  return idx !== -1 ? namespacedId.slice(idx + 1) : namespacedId;
}

type PanelState =
  | { kind: 'tool'; entity: AITool }
  | { kind: 'user'; entity: UserActivity }
  | { kind: 'agent'; entity: InternalAgent }
  | { kind: 'exposure'; entity: ExternalExposure }
  | null;

function resolveEntity(entityType: EntityType, namespacedId: string): PanelState {
  const id = rawId(namespacedId);
  switch (entityType) {
    case 'tool': {
      const e = aiTools.find(t => t.id === id);
      return e ? { kind: 'tool', entity: e } : null;
    }
    case 'user': {
      const e = userActivities.find(u => u.id === id);
      return e ? { kind: 'user', entity: e } : null;
    }
    case 'agent': {
      const e = internalAgents.find(a => a.id === id);
      return e ? { kind: 'agent', entity: e } : null;
    }
    case 'exposure': {
      const e = externalExposures.find(x => x.id === id);
      return e ? { kind: 'exposure', entity: e } : null;
    }
  }
}

// ── Badge helpers ──

const severityVariant = (s: string) => {
  if (s === 'Critical') return 'critical' as const;
  if (s === 'High') return 'warning' as const;
  return 'neutral' as const;
};

const ruleStatusVariant = (s: string) => {
  if (s === 'Active') return 'success' as const;
  return 'neutral' as const;
};

const actionBadgeClass: Record<string, string> = {
  Allow: 'bg-success/15 text-success',
  Block: 'bg-destructive/15 text-destructive',
  Monitor: 'bg-amber-500/15 text-amber-700',
  Review: 'bg-blue-500/15 text-blue-600',
};

const complianceStatusClass: Record<string, string> = {
  Compliant: 'bg-success/15 text-success',
  Partial: 'bg-amber-500/15 text-amber-700',
  'Non-Compliant': 'bg-destructive/15 text-destructive',
};

const complianceBarColor: Record<string, string> = {
  Compliant: 'bg-success',
  Partial: 'bg-amber-500',
  'Non-Compliant': 'bg-destructive',
};

export const PolicyView = () => {
  const [activeTab, setActiveTab] = useState<PolicyTab>('governance');
  const { rules, remove } = usePolicyStore();
  const [panel, setPanel] = useState<PanelState>(null);

  const sorted = [...rules].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleRowClick = (entityType: EntityType, namespacedId: string) => {
    const resolved = resolveEntity(entityType, namespacedId);
    setPanel(resolved);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">AI Governance Policy</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage governance rules, compliance frameworks, and AI usage policies</p>
      </div>

      {/* Metric summary cards */}
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Active Rules</p>
            <p className="text-2xl font-bold text-foreground">7</p>
            <p className="text-xs text-muted-foreground mt-0.5">1 draft</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Violations 7D</p>
            <p className="text-2xl font-bold text-foreground">54</p>
            <p className="text-xs text-destructive mt-0.5">12 critical</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Tool Classification</p>
            <p className="text-2xl font-bold text-foreground">4 · 4 · 2</p>
            <p className="text-xs text-muted-foreground mt-0.5">Approved · Unknown · Blocked</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Compliance Score</p>
            <p className="text-2xl font-bold text-foreground">72%</p>
            <p className="text-xs text-amber-600 mt-0.5">2 frameworks partial</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('governance')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === 'governance' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
          }`}
        >
          Governance Rules
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === 'compliance' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
          }`}
        >
          Compliance
        </button>
        <button
          onClick={() => setActiveTab('usage')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === 'usage' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
          }`}
        >
          AI Usage Policies
        </button>
      </div>

      {/* ── Tab 1: Governance Rules ── */}
      {activeTab === 'governance' && (
        <ScrollReveal>
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-accent/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rule</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Severity</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Violations</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {governanceRules.map((rule) => (
                    <tr key={rule.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-card-foreground">{rule.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{rule.description}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={rule.category} variant="neutral" />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={rule.severity} variant={severityVariant(rule.severity)} />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={rule.status} variant={ruleStatusVariant(rule.status)} />
                      </td>
                      <td className="px-5 py-3.5 text-right metric-text">
                        {rule.violations > 0 ? (
                          <span className="text-destructive">{rule.violations}</span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{rule.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* ── Tab 2: Compliance ── */}
      {activeTab === 'compliance' && (
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complianceFrameworks.map((fw) => (
              <div key={fw.id} className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-muted-foreground" />
                    <h4 className="font-semibold text-foreground">{fw.name}</h4>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${complianceStatusClass[fw.status]}`}>
                    {fw.status}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full ${complianceBarColor[fw.status]}`}
                    style={{ width: `${fw.coverage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{fw.coverage}% coverage</span>
                  <span>{fw.passing} passing · {fw.failing} failing · {fw.controls} controls</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* ── Tab 3: AI Usage Policies ── */}
      {activeTab === 'usage' && (
        <ScrollReveal>
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-accent/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tool Pattern</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scope</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enforced</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created By</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {aiUsagePolicies.map((pol) => (
                    <tr key={pol.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-card-foreground">{pol.toolPattern}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${actionBadgeClass[pol.action] ?? ''}`}>
                          {pol.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{pol.scope}</td>
                      <td className="px-5 py-3.5 text-center">
                        <div className={`inline-block w-8 h-4 rounded-full relative ${pol.enforced ? 'bg-success' : 'bg-muted-foreground/30'}`}>
                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${pol.enforced ? 'right-0.5' : 'left-0.5'}`} />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground text-xs">{pol.createdBy}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{pol.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* ── Blocked Entities section (always visible below tabs) ── */}
      <ScrollReveal delay={0.1}>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ShieldOff size={18} className="text-destructive" />
            Blocked Entities
          </h3>

          {sorted.length === 0 ? (
            <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">No blocked entities</h3>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Block elements from the <strong>AI Tools</strong>, <strong>Users</strong>,{' '}
                <strong>Servers</strong>, or <strong>Exposures</strong> views using the{' '}
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <ShieldOff size={12} /> Block
                </span>{' '}
                button. Blocked items will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-destructive/5 flex items-center gap-2">
                <ShieldOff size={14} className="text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  {sorted.length} blocked {sorted.length === 1 ? 'entity' : 'entities'}
                </span>
                <span className="text-xs text-muted-foreground ml-1">— click a row to view details</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-accent/50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detail</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Blocked Since</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((rule) => (
                      <tr
                        key={rule.id}
                        onClick={() => handleRowClick(rule.entityType, rule.entityId)}
                        className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${entityTypeBadgeClass[rule.entityType]}`}>
                            <ShieldOff size={10} />
                            {entityTypeLabels[rule.entityType]}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-card-foreground">{rule.entityName}</td>
                        <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground max-w-[220px] truncate">{rule.entityDetail}</td>
                        <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap">{formatDate(rule.createdAt)}</td>
                        <td className="px-5 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => remove(rule.entityId)}
                            title="Remove block"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors border border-transparent hover:border-destructive/20"
                          >
                            <Trash2 size={12} />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-2.5 border-t border-border text-xs text-muted-foreground">
                Policy rules persist across sessions
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Detail panels */}
      {panel?.kind === 'tool' && (
        <ToolDetailPanel tool={panel.entity} onClose={() => setPanel(null)} />
      )}
      {panel?.kind === 'user' && (
        <UserDetailPanel user={panel.entity} onClose={() => setPanel(null)} />
      )}
      {panel?.kind === 'agent' && (
        <AgentDetailPanel agent={panel.entity} onClose={() => setPanel(null)} />
      )}
      {panel?.kind === 'exposure' && (
        <ExposureDetailPanel exposure={panel.entity} onClose={() => setPanel(null)} />
      )}
    </div>
  );
};
