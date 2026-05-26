import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';

function fmtDate(d) {
  return new Date(d).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  });
}

export default function TicketTable({ tickets = [], basePath, showUser = true, emptyAction }) {
  if (!tickets.length) {
    return (
      <EmptyState
        icon="📭"
        title="Nenhum chamado encontrado"
        description="Quando houver chamados eles aparecerão aqui."
        action={emptyAction}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-fg-muted/60
              uppercase tracking-[0.10em] w-14 bg-white/[0.02]">#</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-fg-muted/60
              uppercase tracking-[0.10em] bg-white/[0.02]">Título</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-fg-muted/60
              uppercase tracking-[0.10em] bg-white/[0.02]">Categoria</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-fg-muted/60
              uppercase tracking-[0.10em] bg-white/[0.02]">Destino</th>
            {showUser && (
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-fg-muted/60
                uppercase tracking-[0.10em] bg-white/[0.02]">Usuário</th>
            )}
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-fg-muted/60
              uppercase tracking-[0.10em] bg-white/[0.02]">Status</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold text-fg-muted/60
              uppercase tracking-[0.10em] bg-white/[0.02]">Data</th>
            <th className="px-4 py-3 w-10 bg-white/[0.02]" />
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {tickets.map((t) => (
            <tr key={t.id} className="hover:bg-white/[0.03] transition-colors duration-150">
              <td className="px-4 py-3.5 text-fg-muted font-mono text-xs">#{t.id}</td>
              <td className="px-4 py-3.5 font-medium text-fg max-w-[180px] truncate">{t.title}</td>
              <td className="px-4 py-3.5 text-fg-muted text-xs">{t.category_name}</td>
              <td className="px-4 py-3.5 text-fg-muted text-xs">{t.destination_name}</td>
              {showUser && (
                <td className="px-4 py-3.5 text-fg-muted text-xs">{t.user_name}</td>
              )}
              <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
              <td className="px-4 py-3.5 text-fg-muted/60 text-xs font-mono">{fmtDate(t.created_at)}</td>
              <td className="px-4 py-3.5">
                <Link
                  href={`${basePath}/${t.id}`}
                  className="text-accent hover:text-accent-bright font-medium text-xs
                    whitespace-nowrap transition-colors duration-150"
                >
                  Ver →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
