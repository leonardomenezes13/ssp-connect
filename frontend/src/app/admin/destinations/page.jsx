'use client';
import { useEffect, useState } from 'react';
import { useForm }             from 'react-hook-form';
import { destinationService } from '@/services/destinationService';
import { useToast }           from '@/context/ToastContext';
import AppLayout    from '@/components/layout/AppLayout';
import PageHeader   from '@/components/shared/PageHeader';
import Modal        from '@/components/ui/Modal';
import FormInput    from '@/components/ui/FormInput';
import Button       from '@/components/ui/Button';
import EmptyState   from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';

export default function AdminDestinationsPage() {
  const toast = useToast();
  const [destinations, setDestinations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [open,         setOpen]         = useState(false);
  const [editing,      setEditing]      = useState(null);
  const [submitting,   setSubmitting]   = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  async function loadData() {
    try {
      setDestinations(await destinationService.getAll());
    } catch {
      toast.error('Erro ao carregar destinos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function openCreate() {
    setEditing(null);
    reset({ name: '' });
    setOpen(true);
  }

  function openEdit(d) {
    setEditing(d);
    reset({ name: d.name });
    setOpen(true);
  }

  async function onSubmit(data) {
    setSubmitting(true);
    try {
      if (editing) {
        await destinationService.update(editing.id, data);
        toast.success('Destino atualizado!');
      } else {
        await destinationService.create(data);
        toast.success('Destino criado!');
      }
      setOpen(false);
      loadData();
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao salvar.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover este destino? Usuários vinculados perderão o destino.')) return;
    try {
      await destinationService.remove(id);
      toast.success('Destino removido.');
      loadData();
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao remover.');
    }
  }

  return (
    <AppLayout title="Destinos" subtitle="Setores e guichês de atendimento">
      <div className="space-y-4">
        <PageHeader
          title="Destinos cadastrados"
          description={`${destinations.length} destino(s) no sistema`}
          action={<Button size="sm" onClick={openCreate}>✚ Novo destino</Button>}
        />

        <div className="rounded-2xl border border-white/[0.06] overflow-hidden
          bg-gradient-to-b from-white/[0.04] to-transparent
          shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_24px_rgba(0,0,0,0.4)]">
          {loading ? <LoadingState /> : destinations.length === 0 ? (
            <EmptyState
              icon="🏢"
              title="Nenhum destino cadastrado"
              description="Crie destinos para organizar o atendimento por setor."
              action={{ label: 'Criar destino', onClick: openCreate }}
            />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['#', 'Nome', ''].map((col, i) => (
                    <th key={i} className={`px-4 py-3 text-[10px] font-semibold text-fg-muted/60
                      uppercase tracking-[0.10em] bg-white/[0.02]
                      ${i === 2 ? 'w-24' : 'text-left'}`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {destinations.map((d) => (
                  <tr key={d.id} className="hover:bg-white/[0.03] transition-colors duration-150">
                    <td className="px-4 py-3.5 text-fg-muted font-mono text-xs">{d.id}</td>
                    <td className="px-4 py-3.5 font-medium text-fg">{d.name}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(d)}
                          className="text-xs text-accent hover:text-accent-bright
                            font-medium transition-colors duration-150">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(d.id)}
                          className="text-xs text-red-400/70 hover:text-red-400
                            font-medium transition-colors duration-150">
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Editar destino' : 'Novo destino'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            id="name"
            label="Nome do destino"
            required
            placeholder="Ex: Setor de Documentação"
            {...register('name', { required: 'Nome é obrigatório.' })}
            error={errors.name?.message}
          />
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              {submitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
