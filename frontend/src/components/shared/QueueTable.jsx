import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';

export default function QueueTable({ queue = [] }) {
  if (!queue.length) {
    return (
      <EmptyState
        icon="✅"
        title="Fila vazia"
        description="Nenhum chamado aberto ou em atendimento no momento."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[740px]">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {['Pos.', '#', 'Título', 'Usuário', 'Destino', 'Categoria', 'Status', ''].map((col, i) => (
              <th key={i} className={`px-4 py-3 text-[10px] font-semibold text-fg-muted/60
                uppercase tracking-[0.10em] bg-white/[0.02]
                ${i === 0 ? 'text-center w-16' : i === 7 ? 'w-20' : 'text-left'}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {queue.map((t) => (
            <tr key={t.id} className="hover:bg-white/[0.03] transition-colors duration-150">
              <td className="px-4 py-3.5 text-center">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full
                  text-xs font-bold transition-all duration-200
                  ${t.position === 1
                    ? 'bg-accent text-white shadow-[0_0_12px_rgba(94,106,210,0.5)]'
                    : 'bg-white/[0.06] text-fg-muted'
                  }`}>
                  {t.position}
                </span>
              </td>
              <td className="px-4 py-3.5 text-fg-muted font-mono text-xs">#{t.id}</td>
              <td className="px-4 py-3.5 font-medium text-fg max-w-[160px] truncate">{t.title}</td>
              <td className="px-4 py-3.5 text-fg-muted text-xs">{t.user_name}</td>
              <td className="px-4 py-3.5 text-fg-muted text-xs">{t.destination_name}</td>
              <td className="px-4 py-3.5 text-fg-muted text-xs">{t.category_name}</td>
              <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
              <td className="px-4 py-3.5">
                <Link
                  href={`/admin/tickets/${t.id}`}
                  className="text-xs font-semibold text-accent hover:text-accent-bright
                    whitespace-nowrap transition-colors duration-150"
                >
                  Atender →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
