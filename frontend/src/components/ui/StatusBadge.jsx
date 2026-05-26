const CONFIG = {
  ABERTO:          { label: 'Aberto',         cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25', dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' },
  EM_ATENDIMENTO:  { label: 'Em Atendimento', cls: 'bg-blue-500/10    text-blue-400    border-blue-500/25',    dot: 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]'    },
  CONCLUIDO:       { label: 'Concluído',       cls: 'bg-white/[0.05]  text-fg-muted    border-white/[0.10]',   dot: 'bg-fg-muted'                                            },
  CANCELADO:       { label: 'Cancelado',       cls: 'bg-red-500/10    text-red-400     border-red-500/25',     dot: 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]'      },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = CONFIG[status] ?? {
    label: status,
    cls: 'bg-white/[0.05] text-fg-muted border-white/[0.10]',
    dot: 'bg-fg-muted',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium
      ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
      ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
