'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ticketService } from '@/services/ticketService';
import AppLayout    from '@/components/layout/AppLayout';
import TicketTable  from '@/components/shared/TicketTable';
import Button       from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';

const STATUS_TABS = [
  { value: '',               label: 'Todos'          },
  { value: 'ABERTO',         label: 'Abertos'        },
  { value: 'EM_ATENDIMENTO', label: 'Em Atendimento' },
  { value: 'CONCLUIDO',      label: 'Concluídos'     },
  { value: 'CANCELADO',      label: 'Cancelados'     },
];

function TicketsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status,  setStatus]  = useState(searchParams.get('status') ?? '');

  useEffect(() => {
    setLoading(true);
    const params = status ? { status } : {};
    ticketService.getAll(params)
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <AppLayout title="Meus Chamados" subtitle={`${tickets.length} chamado(s)`}>
      <div className="space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Status tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl
            bg-white/[0.04] border border-white/[0.07]">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatus(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium
                  transition-all duration-200 whitespace-nowrap
                  ${status === tab.value
                    ? 'bg-accent text-white shadow-[0_0_0_1px_rgba(94,106,210,0.4),0_2px_8px_rgba(94,106,210,0.25)]'
                    : 'text-fg-muted hover:bg-white/[0.06] hover:text-fg'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link href="/user/tickets/new">
            <Button size="sm">✚ Novo chamado</Button>
          </Link>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden
          bg-gradient-to-b from-white/[0.04] to-transparent
          shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_24px_rgba(0,0,0,0.4)]">
          {loading ? (
            <LoadingState />
          ) : (
            <TicketTable
              tickets={tickets}
              basePath="/user/tickets"
              showUser={false}
              emptyAction={{
                label: 'Abrir chamado',
                onClick: () => router.push('/user/tickets/new'),
              }}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default function UserTicketsPage() {
  return (
    <Suspense fallback={null}>
      <TicketsContent />
    </Suspense>
  );
}
