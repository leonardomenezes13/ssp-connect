export default function LoadingState({ text = 'Carregando...', rows = 5 }) {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-white/[0.06] shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-white/[0.06] rounded-full w-1/3" />
            <div className="h-3 bg-white/[0.04] rounded-full w-2/3" />
          </div>
          <div className="h-6 w-20 bg-white/[0.06] rounded-full" />
        </div>
      ))}
      <p className="text-center text-xs text-fg-muted/60 pt-2">{text}</p>
    </div>
  );
}

export function Spinner({ size = 'md', className = '' }) {
  const s = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };
  return (
    <div className={`${s[size]} border-white/[0.12] border-t-accent rounded-full animate-spin ${className}`} />
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-bg-base z-40 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-white/[0.06]" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-t-accent border-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-accent/60 animate-pulse-glow" />
        </div>
      </div>
      <p className="text-sm text-fg-muted font-medium tracking-wide">Carregando...</p>
    </div>
  );
}
