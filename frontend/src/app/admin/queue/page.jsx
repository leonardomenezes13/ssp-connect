'use client';
import { useEffect, useState, useCallback } from 'react';
import { queueService } from '@/services/queueService';
import { useToast }     from '@/context/ToastContext';
import AppLayout    from '@/components/layout/AppLayout';
import QueueTable   from '@/components/shared/QueueTable';
import Button       from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';

export default function AdminQueuePage() {
  const toast = useToast();
  const [queue,      setQueue]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      setQueue(await queueService.getQueue());
    } catch {
      toast.error('Erro ao carregar a fila.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  return (
    <AppLayout
      title="Fila de Atendimento"
      subtitle="Chamados abertos e em atendimento — por ordem de chegada"
    >
      <div className="space-y-4">

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-fg tracking-tight">
              {loading ? '—' : queue.length}
            </span>
            <span className="text-sm text-fg-muted">chamado(s) na fila</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            loading={refreshing}
            onClick={() => load(true)}
          >
            ↻ Atualizar
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden
          bg-gradient-to-b from-white/[0.04] to-transparent
          shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_24px_rgba(0,0,0,0.4)]">
          {loading ? <LoadingState /> : <QueueTable queue={queue} />}
        </div>
      </div>
    </AppLayout>
  );
}
