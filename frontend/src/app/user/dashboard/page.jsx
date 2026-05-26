'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth }         from '@/context/AuthContext';
import { ticketService }   from '@/services/ticketService';
import AppLayout           from '@/components/layout/AppLayout';
import DashboardCard       from '@/components/shared/DashboardCard';
import StatusBadge         from '@/components/ui/StatusBadge';
import Button              from '@/components/ui/Button';
import LoadingState        from '@/components/ui/LoadingState';

export default function UserDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService.getAll()
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const abertos       = tickets.filter((t) => t.status === 'ABERTO').length;
  const emAtendimento = tickets.filter((t) => t.status === 'EM_ATENDIMENTO').length;
  const concluidos    = tickets.filter((t) => t.status === 'CONCLUIDO').length;
  const recent        = tickets.slice(0, 5);

  return (
    <AppLayout title="Meu Painel" subtitle={`Bem-vindo, ${user?.name}`}>
      <div className="space-y-6">

        {/* Welcome banner */}
        <div className="relative rounded-2xl p-6 overflow-hidden
          bg-gradient-to-br from-accent/15 via-accent/5 to-transparent
          border border-accent/20
          shadow-[0_0_0_1px_rgba(94,106,210,0.15),0_4px_24px_rgba(94,106,210,0.08)]">

          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none
            bg-[radial-gradient(ellipse_at_top_right,rgba(94,106,210,0.25)_0%,transparent_60%)]" />

          {/* Top line */}
          <div className="absolute inset-x-0 top-0 h-px
            bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <h2 className="text-fg font-bold text-lg tracking-tight">
                Olá, {user?.name}! 👋
              </h2>
              <p className="text-fg-muted text-sm mt-1">
                Acompanhe seus chamados e abra novas solicitações.
              </p>
            </div>
            <Link href="/user/tickets/new">
              <Button variant="primary" size="md">✚ Abrir chamado</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <LoadingState rows={3} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DashboardCard label="Abertos"        value={abertos}       icon="📂" color="green"  href="/user/tickets?status=ABERTO" />
            <DashboardCard label="Em Atendimento" value={emAtendimento}  icon="⚙️" color="blue"   href="/user/tickets?status=EM_ATENDIMENTO" />
            <DashboardCard label="Concluídos"     value={concluidos}     icon="✅" color="slate"  href="/user/tickets?status=CONCLUIDO" />
          </div>
        )}

        {/* Recent tickets */}
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden
          bg-gradient-to-b from-white/[0.04] to-transparent
          shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_24px_rgba(0,0,0,0.4)]">

          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="font-semibold text-fg text-sm">Chamados recentes</h3>
            <Link href="/user/tickets"
              className="text-sm font-medium text-accent hover:text-accent-bright
                transition-colors duration-150">
              Ver todos →
            </Link>
          </div>

          {loading ? (
            <LoadingState rows={5} />
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-fg-muted">
              <span className="text-4xl opacity-20">📭</span>
              <p className="text-sm">Nenhum chamado ainda.</p>
              <Link href="/user/tickets/new">
                <Button variant="primary" size="sm" className="mt-1">
                  Abrir primeiro chamado
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {recent.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/user/tickets/${t.id}`}
                    className="flex items-center gap-4 px-5 py-3.5
                      hover:bg-white/[0.03] transition-colors duration-150"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-fg truncate">{t.title}</p>
                      <p className="text-xs text-fg-muted mt-0.5 font-mono">
                        #{t.id} · {t.category_name} · {t.destination_name}
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
