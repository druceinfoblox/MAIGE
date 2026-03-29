import { ReactNode } from 'react';
import { ScrollReveal } from './ScrollReveal';

type Props = {
  label: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  variant?: 'default' | 'warning' | 'critical';
  delay?: number;
  onClick?: () => void;
};

const changeColor = {
  default: 'text-primary',
  warning: 'text-warning',
  critical: 'text-destructive',
};

export const MetricCard = ({ label, value, icon, change, variant = 'default', delay = 0, onClick }: Props) => (
  <ScrollReveal delay={delay}>
    <div
      onClick={onClick}
      className={`bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-primary/40 active:scale-[0.98]' : ''}`}
    >
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em]">{label}</p>
      <p className="metric-text text-3xl font-semibold text-card-foreground mt-2">{value}</p>
      {change && (
        <p className={`text-xs mt-1.5 font-medium ${changeColor[variant]}`}>{change}</p>
      )}
    </div>
  </ScrollReveal>
);
