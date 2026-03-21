type Props = {
  status: string;
  variant?: 'success' | 'warning' | 'critical' | 'neutral';
};

const styles = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  critical: 'bg-destructive/10 text-destructive',
  neutral: 'bg-muted text-muted-foreground',
};

export const StatusBadge = ({ status, variant = 'neutral' }: Props) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[variant]}`}>
    {status}
  </span>
);
