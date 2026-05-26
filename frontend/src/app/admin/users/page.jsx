'use client';
import { useEffect, useState } from 'react';
import { useForm }             from 'react-hook-form';
import { userService }        from '@/services/userService';
import { destinationService } from '@/services/destinationService';
import { useToast }           from '@/context/ToastContext';
import AppLayout    from '@/components/layout/AppLayout';
import PageHeader   from '@/components/shared/PageHeader';
import Modal        from '@/components/ui/Modal';
import FormInput    from '@/components/ui/FormInput';
import SelectInput  from '@/components/ui/SelectInput';
import Button       from '@/components/ui/Button';
import EmptyState   from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';

export default function AdminUsersPage() {
  const toast = useToast();
  const [users,        setUsers]        = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [open,         setOpen]         = useState(false);
  const [editing,      setEditing]      = useState(null);
  const [submitting,   setSubmitting]   = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  async function loadData() {
    try {
      const [u, d] = await Promise.all([userService.getAll(), destinationService.getAll()]);
      setUsers(u); setDestinations(d);
    } catch { toast.error('Erro ao carregar dados.'); }
    finally  { setLoading(false); }
  }

  useEffect(() => { loadData(); }, []);

  function openCreate() {
    setEditing(null);
    reset({ name: '', password: '', role: 'USER', destination_id: '' });
    setOpen(true);
  }

  function openEdit(u) {
    setEditing(u);
    reset({ name: u.name, password: '', role: u.role, destination_id: u.destination_id ?? '' });
    setOpen(true);
  }

  async function onSubmit(data) {
    setSubmitting(true);
    try {
      const payload = { ...data };
      if (!payload.password) delete payload.password;
      if (editing) {
        await userService.update(editing.id, payload);
        toast.success('Usuário atualizado!');
      } else {
        await userService.create(payload);
        toast.success('Usuário criado!');
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
    if (!confirm('Remover este usuário?')) return;
    try {
      await userService.remove(id);
      toast.success('Usuário removido.');
      loadData();
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Erro ao remover.');
    }
  }

  return (
    <AppLayout title="Usuários" subtitle="Gerencie os acessos ao sistema">
      <div className="space-y-4">
        <PageHeader
          title="Usuários cadastrados"
          description={`${users.length} usuário(s) no sistema`}
          action={<Button size="sm" onClick={openCreate}>✚ Novo usuário</Button>}
        />

        <div className="rounded-2xl border border-white/[0.06] overflow-hidden
          bg-gradient-to-b from-white/[0.04] to-transparent
          shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_24px_rgba(0,0,0,0.4)]">
          {loading ? <LoadingState /> : users.length === 0 ? (
            <EmptyState
              icon="👥"
              title="Nenhum usuário cadastrado"
              action={{ label: 'Criar usuário', onClick: openCreate }}
            />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['#', 'Nome', 'Perfil', 'Destino', ''].map((col, i) => (
                    <th key={i} className={`px-4 py-3 text-[10px] font-semibold text-fg-muted/60
                      uppercase tracking-[0.10em] bg-white/[0.02]
                      ${i === 4 ? 'w-24' : 'text-left'}`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.03] transition-colors duration-150">
                    <td className="px-4 py-3.5 text-fg-muted font-mono text-xs">{u.id}</td>
                    <td className="px-4 py-3.5 font-medium text-fg">{u.name}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border
                        ${u.role === 'ADMIN'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/25'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        }`}>
                        {u.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-fg-muted text-sm">{u.destination_name ?? '—'}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(u)}
                          className="text-xs text-accent hover:text-accent-bright
                            font-medium transition-colors duration-150">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(u.id)}
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
        title={editing ? 'Editar usuário' : 'Novo usuário'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            id="name" label="Nome" required
            placeholder="nome.sobrenome"
            {...register('name', { required: 'Nome é obrigatório.' })}
            error={errors.name?.message}
          />
          <FormInput
            id="password"
            label={editing ? 'Nova senha (deixe vazio para manter)' : 'Senha'}
            type="password"
            required={!editing}
            placeholder={editing ? '••••••••' : 'Mínimo 4 caracteres'}
            {...register('password', {
              required: editing ? false : 'Senha obrigatória.',
              minLength: editing ? undefined : { value: 4, message: 'Mínimo 4 caracteres.' },
            })}
            error={errors.password?.message}
          />
          <SelectInput
            id="role" label="Perfil" required
            options={[
              { value: 'USER',  label: 'Usuário'       },
              { value: 'ADMIN', label: 'Administrador' },
            ]}
            {...register('role', { required: true })}
            error={errors.role?.message}
          />
          <SelectInput
            id="destination_id" label="Destino / Setor"
            placeholder="Sem destino"
            options={destinations.map((d) => ({ value: d.id, label: d.name }))}
            {...register('destination_id')}
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
