const VARIANTS = {
  primary:
    'bg-accent text-white ' +
    'shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_16px_rgba(94,106,210,0.3),inset_0_1px_0_rgba(255,255,255,0.18)] ' +
    'hover:bg-accent-bright ' +
    'hover:shadow-[0_0_0_1px_rgba(94,106,210,0.7),0_6px_24px_rgba(94,106,210,0.45),inset_0_1px_0_rgba(255,255,255,0.18)] ' +
    'active:scale-[0.98] active:shadow-[0_0_0_1px_rgba(94,106,210,0.4),0_2px_8px_rgba(94,106,210,0.25)] ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',

  secondary:
    'bg-white/[0.06] text-fg border border-white/[0.08] ' +
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ' +
    'hover:bg-white/[0.10] hover:border-white/[0.14] hover:text-fg ' +
    'active:scale-[0.98] ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',

  ghost:
    'bg-transparent text-fg-muted ' +
    'hover:bg-white/[0.06] hover:text-fg ' +
    'active:scale-[0.98] ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',

  danger:
    'bg-red-500/80 text-white border border-red-500/30 ' +
    'shadow-[0_0_0_1px_rgba(239,68,68,0.3),0_4px_16px_rgba(239,68,68,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] ' +
    'hover:bg-red-500 hover:border-red-400/50 ' +
    'hover:shadow-[0_0_0_1px_rgba(239,68,68,0.5),0_6px_24px_rgba(239,68,68,0.3)] ' +
    'active:scale-[0.98] ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',

  outline:
    'bg-transparent text-fg-muted border border-white/[0.10] ' +
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ' +
    'hover:bg-white/[0.05] hover:text-fg hover:border-white/[0.18] ' +
    'active:scale-[0.98] ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
};

const SIZES = {
  sm: 'h-8  px-3   text-xs  gap-1.5',
  md: 'h-10 px-4   text-sm  gap-2',
  lg: 'h-11 px-5   text-sm  gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold rounded-lg
        transition-all duration-200 cursor-pointer select-none
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
