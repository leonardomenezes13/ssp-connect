'use client';
import { useEffect, useState } from 'react';
import { useParams }           from 'next/navigation';
import Link                    from 'next/link';
import { ticketService }       from '@/services/ticketService';
import { useToast }            from '@/context/ToastContext';
import AppLayout               from '@/components/layout/AppLayout';
import StatusBadge             from '@/components/ui/StatusBadge';
import Button                  from '@/components/ui/Button';
import { FullPageLoader }      from '@/components/ui/LoadingState';

const ACTIONS = [
  { to: 'EM_ATENDIMENTO', label: 'Iniciar Atendimento', icon: '⚙️', variant: 'secondary' },
  { to: 'CONCLUIDO',      label: 'Concluir Chamado',    icon: '✅', variant: 'primary'   },
  { to: 'CANCELADO',      label: 'Cancelar Chamado',    icon: '✕',  variant: 'danger'    },
];

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-fg-muted/60 uppercase tracking-[0.12em] mb-1.5">
        {label}
      </p>
      <p className="text-sm font-medium text-fg">{value || '—'}</p>
    </div>
  );
}

export default function AdminTicketDetailPage() {
  const { id }    = useParams();
  const toast     = useToast();
  const [ticket,   setTicket]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState('');
  const [error,    setError]    = useState('');

  useEffect(() => {
    ticketService.getById(id)
      .then(setTicket)
      .catch((e) => setError(e.response?.data?.message ?? 'Chamado não encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function changeStatus(newStatus) {
    setUpdating(newStatus);
    try {
      await ticketService.updateStatus(id, newStatus);
      setTicket((prev) => ({ ...prev, status: newStatus }));
      toast.success('Status atualizado com sucesso!');
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao atualizar status.');
    } finally {
      setUpdating('');
    }
  }

  if (loading) return <FullPageLoader />;

  if (error) {
    return (
      <AppLayout title="Chamado">
        <div className="flex flex-col items-center gap-3 py-20 text-fg-muted">
          <span className="text-4xl opacity-30">🚫</span>
          <p className="text-sm">{error}</p>
          <Link href="/admin/tickets"
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

  const availableActions = ACTIONS.filter((a) => a.to !== ticket.status);
  const isClosed = ticket.status === 'CONCLUIDO' || ticket.status === 'CANCELADO';

  return (
    <AppLayout title={`Chamado #${ticket.id}`} subtitle={ticket.title}>
      <div className="max-w-2xl mx-auto space-y-4">

        <Link href="/admin/tickets"
          className="inline-flex items-center gap-1.5 text-sm
            text-fg-muted hover:text-accent transition-colors duration-150">
          ← Voltar para Chamados
        </Link>

        {/* Main card */}
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden
          bg-gradient-to-b from-white/[0.05] to-transparent
          shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_24px_rgba(0,0,0,0.4)]">

          {/* Top accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-fg-muted mb-1 font-mono">Chamado #{ticket.id}</p>
              <h2 className="text-lg font-bold text-fg leading-snug">{ticket.title}</h2>
            </div>
            <StatusBadge status={ticket.status} size="md" />
          </div>

          {/* Fields */}
          <div className="px-6 py-5 grid grid-cols-2 gap-5">
            <Field label="Usuário"   value={ticket.user_name} />
            <Field label="Categoria" value={ticket.category_name} />
            <Field label="Destino"   value={ticket.destination_name} />
            <Field label="Abertura"  value={fmtDate(ticket.created_at)} />
            {ticket.position && (
              <Field label="Posição na Fila" value={`${ticket.position}º`} />
            )}
          </div>

          {/* Description */}
          {ticket.description && (
            <div className="px-6 pb-6">
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

        {/* Actions */}
        {!isClosed && (
          <div className="rounded-2xl border border-white/[0.06] p-5
            bg-gradient-to-b from-white/[0.04] to-transparent">
            <p className="text-sm font-semibold text-fg mb-3">Ações disponíveis</p>
            <div className="flex flex-col gap-2">
              {availableActions.map((action) => (
                <Button
                  key={action.to}
                  variant={action.variant}
                  loading={updating === action.to}
                  disabled={!!updating}
                  className="w-full justify-center"
                  icon={action.icon}
                  onClick={() => changeStatus(action.to)}
                >
                  {updating === action.to ? 'Atualizando...' : action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Closed state */}
        {isClosed && (
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
                ? 'Este chamado foi concluído.'
                : 'Este chamado foi cancelado.'}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
