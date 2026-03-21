import { ReactNode } from 'react';
import { ScrollReveal } from './ScrollReveal';

type Props = {
  label: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  variant?: 'default' | 'warning' | 'critical';
  delay?: number;
};

const variantStyles = {
  default: 'border-border',
  warning: 'border-warning/30',
  critical: 'border-destructive/30',
};

const iconBgStyles = {
  default: 'bg-primary/10 text-primary',
  warning: 'bg-warning/10 text-warning',
  critical: 'bg-destructive/10 text-destructive',
};

export const MetricCard = ({ label, value, icon, change, variant = 'default', delay = 0 }: Props) => (
  <ScrollReveal delay={delay}>
    <div className={`bg-card rounded-xl border ${variantStyles[variant]} p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="metric-text text-3xl font-semibold text-card-foreground mt-1.5">{value}</p>
          {change && (
            <p className="text-xs text-muted-foreground mt-1">{change}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg ${iconBgStyles[variant]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  </ScrollReveal>
);
