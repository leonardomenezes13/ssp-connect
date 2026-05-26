import Button from './Button';

export default function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-3">
      <span className="text-4xl mb-1 opacity-30 grayscale">{icon}</span>
      <p className="font-semibold text-fg text-base">{title}</p>
      {description && (
        <p className="text-sm text-fg-muted max-w-xs leading-relaxed">{description}</p>
      )}
      {action && (
        <Button variant="primary" size="sm" className="mt-2" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
