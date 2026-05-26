'use client';
import { useEffect, useState } from 'react';
import { useForm }             from 'react-hook-form';
import { categoryService }    from '@/services/categoryService';
import { useToast }           from '@/context/ToastContext';
import AppLayout    from '@/components/layout/AppLayout';
import PageHeader   from '@/components/shared/PageHeader';
import Modal        from '@/components/ui/Modal';
import FormInput    from '@/components/ui/FormInput';
import Button       from '@/components/ui/Button';
import EmptyState   from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [open,       setOpen]       = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  async function loadData() {
    try {
      setCategories(await categoryService.getAll());
    } catch {
      toast.error('Erro ao carregar categorias.');
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

  function openEdit(c) {
    setEditing(c);
    reset({ name: c.name });
    setOpen(true);
  }

  async function onSubmit(data) {
    setSubmitting(true);
    try {
      if (editing) {
        await categoryService.update(editing.id, data);
        toast.success('Categoria atualizada!');
      } else {
        await categoryService.create(data);
        toast.success('Categoria criada!');
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
    if (!confirm('Remover esta categoria? Chamados vinculados serão afetados.')) return;
    try {
      await categoryService.remove(id);
      toast.success('Categoria removida.');
      loadData();
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao remover.');
    }
  }

  return (
    <AppLayout title="Categorias" subtitle="Tipos de chamado disponíveis no sistema">
      <div className="space-y-4">
        <PageHeader
          title="Categorias cadastradas"
          description={`${categories.length} categoria(s) no sistema`}
          action={<Button size="sm" onClick={openCreate}>✚ Nova categoria</Button>}
        />

        <div className="rounded-2xl border border-white/[0.06] overflow-hidden
          bg-gradient-to-b from-white/[0.04] to-transparent
          shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_24px_rgba(0,0,0,0.4)]">
          {loading ? <LoadingState /> : categories.length === 0 ? (
            <EmptyState
              icon="🗂️"
              title="Nenhuma categoria cadastrada"
              description="Crie categorias para classificar os chamados dos usuários."
              action={{ label: 'Criar categoria', onClick: openCreate }}
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
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.03] transition-colors duration-150">
                    <td className="px-4 py-3.5 text-fg-muted font-mono text-xs">{c.id}</td>
                    <td className="px-4 py-3.5 font-medium text-fg">{c.name}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(c)}
                          className="text-xs text-accent hover:text-accent-bright
                            font-medium transition-colors duration-150">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(c.id)}
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
        title={editing ? 'Editar categoria' : 'Nova categoria'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            id="name"
            label="Nome da categoria"
            required
            placeholder="Ex: Suporte de TI, Manutenção..."
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
