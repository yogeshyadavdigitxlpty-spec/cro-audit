import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FormMessage({ type = 'error', children }) {
  if (!children) return null;
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`form-message form-message--${type}`} role="alert">
      <Icon size={16} />
      <span>{children}</span>
    </div>
  );
}
