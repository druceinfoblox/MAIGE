import { X, Shield, Globe, Clock, AlertTriangle, CheckCircle, ExternalLink, Lock, Unlock } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { type ExternalExposure } from '@/data/mock';

type Props = {
  exposure: ExternalExposure;
  onClose: () => void;
};

const DetailRow = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="flex items-start justify-between py-2.5 border-b border-border/50 last:border-0">
    <span className="text-xs text-muted-foreground min-w-[140px]">{label}</span>
    <span className="text-sm text-card-foreground text-right flex items-center gap-2">{icon}{value}</span>
  </div>
);

const riskDescriptions: Record<string, string> = {
  critical: 'This endpoint is publicly accessible without authentication and poses an immediate security risk. Attackers can discover and exploit it to access AI capabilities or exfiltrate data.',
  high: 'This endpoint is exposed to the internet and may allow unauthorized access. While some controls may be in place, the exposure surface is significant.',
  medium: 'This endpoint has partial protections but remains externally discoverable. Access controls should be reviewed and hardened.',
  low: 'This endpoint has adequate protections in place. Continued monitoring is recommended.',
};

const remediationSteps: Record<string, string[]> = {
  critical: [
    'Immediately restrict public access — add authentication or IP allowlisting',
    'Move endpoint behind a VPN or zero-trust proxy',
    'Audit access logs for any unauthorized usage in the last 30 days',
    'Rotate any API keys or tokens associated with this endpoint',
    'Notify the security team and create an incident ticket',
  ],
  high: [
    'Enforce authentication on all exposed routes',
    'Review and tighten CORS and rate-limiting policies',
    'Add WAF rules to filter malicious requests',
    'Schedule a penetration test for this endpoint',
  ],
  medium: [
    'Verify TLS configuration and certificate validity',
    'Review access control policies and ensure least-privilege',
    'Enable detailed request logging for anomaly detection',
    'Consider moving to an internal-only network segment',
  ],
  low: [
    'Continue periodic security scans',
    'Ensure TLS certificates are auto-renewed',
    'Review access logs quarterly',
  ],
};

const probeHistory = (exposure: ExternalExposure) => [
  { date: exposure.lastProbed, status: exposure.responseCode, latency: '142ms' },
  { date: '2025-03-19', status: exposure.responseCode, latency: '156ms' },
  { date: '2025-03-17', status: exposure.responseCode === 200 ? 200 : 403, latency: '189ms' },
];

export const ExposureDetailPanel = ({ exposure, onClose }: Props) => {
  const riskVariant = exposure.riskLevel === 'critical' ? 'critical' as const : exposure.riskLevel === 'high' ? 'warning' as const : 'neutral' as const;
  const history = probeHistory(exposure);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full max-w-[540px] bg-background border-l border-border z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground font-mono">{exposure.domain}{exposure.endpoint}</h2>
              <div className="flex items-center gap-2">
                <StatusBadge status={exposure.riskLevel} variant={riskVariant} />
                <StatusBadge status={exposure.type} variant={exposure.type === 'mcp' ? 'critical' : exposure.type === 'llm-proxy' ? 'warning' : 'neutral'} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors active:scale-95"
            >
              <X size={18} />
            </button>
          </div>
          <div className="mt-4 flex gap-0">
            <button className="px-4 py-1.5 text-sm font-medium text-primary border-b-2 border-primary">Overview</button>
            <button className="px-4 py-1.5 text-sm font-medium text-muted-foreground border-b-2 border-transparent cursor-default">History</button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Risk Assessment */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-1 flex items-center gap-2">
              <Shield size={14} className="text-muted-foreground" />
              Risk Assessment
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              {riskDescriptions[exposure.riskLevel]}
            </p>
            <div>
              <DetailRow label="Domain" value={<span className="font-mono text-xs">{exposure.domain}</span>} icon={<Globe size={13} className="text-muted-foreground" />} />
              <DetailRow label="Endpoint" value={<span className="font-mono text-xs">{exposure.endpoint}</span>} />
              <DetailRow label="Service Type" value={exposure.type.toUpperCase()} />
              <DetailRow label="Risk Level" value={<StatusBadge status={exposure.riskLevel} variant={riskVariant} />} />
              <DetailRow label="Response Code" value={
                <span className={`metric-text ${exposure.responseCode === 200 ? 'text-success' : 'text-muted-foreground'}`}>{exposure.responseCode}</span>
              } />
              <DetailRow label="TLS Certificate" value={
                <span className={`flex items-center gap-1.5 text-xs font-medium ${exposure.tlsValid ? 'text-success' : 'text-destructive'}`}>
                  {exposure.tlsValid ? <Lock size={12} /> : <Unlock size={12} />}
                  {exposure.tlsValid ? 'Valid' : 'Invalid / Expired'}
                </span>
              } />
              <DetailRow label="Last Probed" value={exposure.lastProbed} icon={<Clock size={13} className="text-muted-foreground" />} />
            </div>
          </div>

          {/* Remediation Steps */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-1 flex items-center gap-2">
              <AlertTriangle size={14} className={exposure.riskLevel === 'critical' ? 'text-destructive' : 'text-warning'} />
              Remediation Steps
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {exposure.riskLevel === 'critical' ? 'Immediate action required' : exposure.riskLevel === 'high' ? 'Action recommended within 48 hours' : 'Review at next scheduled assessment'}
            </p>
            <ol className="space-y-2.5">
              {(remediationSteps[exposure.riskLevel] ?? remediationSteps.low).map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-card-foreground leading-relaxed">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Probe History */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-1 flex items-center gap-2">
              <Clock size={14} className="text-muted-foreground" />
              Probe History
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Recent external probe results</p>
            <div className="space-y-0">
              {history.map((entry, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                  <span className="text-xs text-muted-foreground font-mono">{entry.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{entry.latency}</span>
                    <span className={`text-xs metric-text ${entry.status === 200 ? 'text-success' : 'text-muted-foreground'}`}>
                      {entry.status}
                    </span>
                    <CheckCircle size={12} className={entry.status === 200 ? 'text-success' : 'text-muted-foreground'} />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-xs text-primary hover:underline flex items-center gap-1">
              View full probe history <ExternalLink size={11} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
