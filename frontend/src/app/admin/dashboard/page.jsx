'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ticketService }   from '@/services/ticketService';
import { userService }     from '@/services/userService';
import { queueService }    from '@/services/queueService';
import AppLayout           from '@/components/layout/AppLayout';
import DashboardCard       from '@/components/shared/DashboardCard';
import StatusBadge         from '@/components/ui/StatusBadge';
import LoadingState        from '@/components/ui/LoadingState';

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [users,   setUsers]   = useState([]);
  const [queue,   setQueue]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([ticketService.getAll(), userService.getAll(), queueService.getQueue()])
      .then(([t, u, q]) => { setTickets(t); setUsers(u); setQueue(q); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const abertos       = tickets.filter((t) => t.status === 'ABERTO').length;
  const emAtendimento = tickets.filter((t) => t.status === 'EM_ATENDIMENTO').length;
  const concluidos    = tickets.filter((t) => t.status === 'CONCLUIDO').length;

  return (
    <AppLayout title="Painel Administrativo" subtitle="Visão geral do sistema">
      <div className="space-y-6">

        {/* Stats */}
        {loading ? <LoadingState rows={4} /> : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard label="Abertos"        value={abertos}      icon="📂" color="green"  href="/admin/tickets?status=ABERTO" />
            <DashboardCard label="Em Atendimento" value={emAtendimento} icon="⚙️" color="blue"   href="/admin/tickets?status=EM_ATENDIMENTO" />
            <DashboardCard label="Concluídos"     value={concluidos}    icon="✅" color="slate"  href="/admin/tickets?status=CONCLUIDO" />
            <DashboardCard label="Usuários"       value={users.length}  icon="👥" color="purple" href="/admin/users" />
          </div>
        )}

        {/* Queue preview */}
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden
          bg-gradient-to-b from-white/[0.04] to-transparent
          shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_24px_rgba(0,0,0,0.4)]">

          {/* Header */}
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h3 className="font-semibold text-fg text-sm">Fila de Atendimento</h3>
              {!loading && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold
                  bg-accent text-white
                  shadow-[0_0_8px_rgba(94,106,210,0.4)]">
                  {queue.length}
                </span>
              )}
            </div>
            <Link href="/admin/queue"
              className="text-sm font-medium text-accent hover:text-accent-bright
                transition-colors duration-150">
              Ver fila completa →
            </Link>
          </div>

          {loading ? <LoadingState rows={5} /> : queue.length === 0 ? (
            <div className="flex items-center gap-3 py-8 px-5 text-fg-muted">
              <span className="text-2xl opacity-40">✅</span>
              <p className="text-sm">Fila vazia — nenhum chamado pendente.</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {queue.slice(0, 6).map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/admin/tickets/${t.id}`}
                    className="flex items-center gap-4 px-5 py-3.5
                      hover:bg-white/[0.03] transition-colors duration-150"
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center
                      text-xs font-bold shrink-0 transition-all duration-200
                      ${t.position === 1
                        ? 'bg-accent text-white shadow-[0_0_10px_rgba(94,106,210,0.5)]'
                        : 'bg-white/[0.06] text-fg-muted'
                      }`}>
                      {t.position}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-fg truncate">{t.title}</p>
                      <p className="text-xs text-fg-muted mt-0.5">
                        {t.user_name} · {t.destination_name}
                      </p>
                    </div>
                    <StatusBadge status={t.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
