'use client';
import { useEffect, useState } from 'react';
import { useParams }           from 'next/navigation';
import Link                    from 'next/link';
import { ticketService }       from '@/services/ticketService';
import AppLayout               from '@/components/layout/AppLayout';
import StatusBadge             from '@/components/ui/StatusBadge';
import { FullPageLoader }      from '@/components/ui/LoadingState';

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold text-fg-muted/60 uppercase tracking-[0.12em]">
        {label}
      </span>
      <span className="text-sm font-medium text-fg">{value || '—'}</span>
    </div>
  );
}

export default function UserTicketDetailPage() {
  const { id }     = useParams();
  const [ticket,   setTicket]  = useState(null);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState('');

  useEffect(() => {
    ticketService.getById(id)
      .then(setTicket)
      .catch((e) => setError(e.response?.data?.message ?? 'Chamado não encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <FullPageLoader />;

  if (error) {
    return (
      <AppLayout title="Chamado">
        <div className="flex flex-col items-center gap-3 py-20 text-fg-muted">
          <span className="text-4xl opacity-30">🚫</span>
          <p className="text-sm">{error}</p>
          <Link href="/user/tickets"
            className="text-sm text-accent hover:text-accent-bright transition-colors">
            ← Voltar
          </Link>
        </div>
      </AppLayout>
    );
  }

  const fmtDate = (d) =>
    new Date(d).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <AppLayout title={`Chamado #${ticket.id}`} subtitle={ticket.title}>
      <div className="max-w-2xl mx-auto space-y-4">

        <Link href="/user/tickets"
          className="inline-flex items-center gap-1.5 text-sm
            text-fg-muted hover:text-accent transition-colors duration-150">
          ← Voltar para Meus Chamados
        </Link>

        {/* Main card */}
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden
          bg-gradient-to-b from-white/[0.05] to-transparent
          shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_24px_rgba(0,0,0,0.4)]">

          {/* Top accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.06]
            flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-fg-muted mb-1 font-mono">Chamado #{ticket.id}</p>
              <h2 className="text-lg font-bold text-fg leading-snug">{ticket.title}</h2>
            </div>
            <StatusBadge status={ticket.status} size="md" />
          </div>

          {/* Fields */}
          <div className="px-6 py-5 grid grid-cols-2 gap-5">
            <Field label="Categoria" value={ticket.category_name} />
            <Field label="Destino"   value={ticket.destination_name} />
            <Field label="Abertura"  value={fmtDate(ticket.created_at)} />
          </div>

          {/* Description */}
          {ticket.description && (
            <div className="px-6 pb-6 pt-0">
              <p className="text-[10px] font-semibold text-fg-muted/60 uppercase tracking-[0.12em] mb-2">
                Descrição
              </p>
              <p className="text-sm text-fg-muted whitespace-pre-wrap leading-relaxed
                bg-white/[0.03] rounded-xl border border-white/[0.06] px-4 py-3">
                {ticket.description}
              </p>
            </div>
          )}
        </div>

        {/* Queue position */}
        {ticket.position != null && (
          <div className={`relative rounded-2xl p-5 flex items-center gap-4 border overflow-hidden
            ${ticket.position === 1
              ? 'bg-emerald-500/10 border-emerald-500/20'
              : 'bg-accent/10 border-accent/20'}`}>

            {/* Background glow */}
            <div className={`absolute inset-0 pointer-events-none
              ${ticket.position === 1
                ? 'bg-[radial-gradient(ellipse_at_left,rgba(52,211,153,0.15)_0%,transparent_60%)]'
                : 'bg-[radial-gradient(ellipse_at_left,rgba(94,106,210,0.15)_0%,transparent_60%)]'}`} />

            <div className={`relative w-14 h-14 rounded-full flex items-center justify-center
              font-bold text-xl shrink-0 text-white
              ${ticket.position === 1
                ? 'bg-emerald-500 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                : 'bg-accent shadow-[0_0_20px_rgba(94,106,210,0.4)]'}`}>
              {ticket.position}
            </div>

            <div className="relative">
              <p className={`font-semibold text-sm
                ${ticket.position === 1 ? 'text-emerald-300' : 'text-fg'}`}>
                {ticket.position === 1
                  ? '🎉 Você é o próximo a ser atendido!'
                  : `${ticket.position}ª posição na fila`}
              </p>
              <p className="text-xs text-fg-muted mt-1">
                Aguarde, sua solicitação será atendida em breve.
              </p>
            </div>
          </div>
        )}

        {/* Closed */}
        {(ticket.status === 'CONCLUIDO' || ticket.status === 'CANCELADO') && (
          <div className={`rounded-2xl px-5 py-4 border flex items-center gap-3
            ${ticket.status === 'CONCLUIDO'
              ? 'bg-emerald-500/10 border-emerald-500/20'
              : 'bg-red-500/10 border-red-500/20'}`}>
            <span className="text-xl">
              {ticket.status === 'CONCLUIDO' ? '✅' : '❌'}
            </span>
            <p className={`text-sm font-medium
              ${ticket.status === 'CONCLUIDO' ? 'text-emerald-400' : 'text-red-400'}`}>
              {ticket.status === 'CONCLUIDO'
                ? 'Este chamado foi concluído com sucesso.'
                : 'Este chamado foi cancelado.'}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
