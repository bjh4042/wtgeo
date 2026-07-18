import { RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const EmptyState = ({ icon = '🔍', title, description, onRetry, retryLabel = '다시 시도' }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="text-4xl mb-3" aria-hidden="true">{icon}</div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{description}</p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 cursor-pointer"
        >
          <RefreshCw size={13} />
          {retryLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
