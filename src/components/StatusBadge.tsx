type Props = {
  status: string;
  variant?: 'success' | 'warning' | 'critical' | 'neutral';
};

const styles = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  critical: 'bg-destructive/15 text-destructive',
  neutral: 'bg-muted/50 text-muted-foreground',
};

export const StatusBadge = ({ status, variant = 'neutral' }: Props) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[variant]}`}>
    {status}
  </span>
);
