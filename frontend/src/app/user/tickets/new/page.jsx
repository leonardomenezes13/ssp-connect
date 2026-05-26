'use client';
import { useEffect, useState } from 'react';
import { useForm }              from 'react-hook-form';
import { useRouter }            from 'next/navigation';
import { ticketService }        from '@/services/ticketService';
import { categoryService }      from '@/services/categoryService';
import { destinationService }   from '@/services/destinationService';
import { useToast }             from '@/context/ToastContext';
import AppLayout    from '@/components/layout/AppLayout';
import FormInput    from '@/components/ui/FormInput';
import SelectInput  from '@/components/ui/SelectInput';
import Button       from '@/components/ui/Button';

export default function NewTicketPage() {
  const router  = useRouter();
  const toast   = useToast();
  const [categories,   setCategories]   = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    Promise.all([categoryService.getAll(), destinationService.getAll()])
      .then(([cats, dests]) => { setCategories(cats); setDestinations(dests); })
      .catch(() => toast.error('Erro ao carregar dados do formulário.'));
  }, [toast]);

  async function onSubmit(data) {
    setLoading(true);
    try {
      await ticketService.create(data);
      toast.success('Chamado aberto com sucesso!');
      router.push('/user/tickets');
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao abrir chamado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout title="Abrir Chamado" subtitle="Nova solicitação de suporte">
      <div className="max-w-2xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden
          bg-gradient-to-b from-white/[0.06] to-white/[0.02]
          border border-white/[0.07]
          shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_40px_rgba(0,0,0,0.5)]">

          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-px
            bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

          <div className="p-7">
            {/* Hint */}
            <p className="text-sm text-fg-muted mb-6 flex items-start gap-2.5
              bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
              <span className="shrink-0 mt-0.5 opacity-60">📝</span>
              <span>
                Preencha os campos abaixo para registrar sua solicitação. Você
                acompanhará o progresso pela sua fila de atendimento.
              </span>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormInput
                id="title"
                label="Título"
                placeholder="Descreva brevemente o problema (ex: Impressora não funciona)"
                required
                {...register('title', {
                  required: 'Título é obrigatório.',
                  maxLength: { value: 150, message: 'Máximo 150 caracteres.' },
                })}
                error={errors.title?.message}
              />

              <div className="grid grid-cols-2 gap-4">
                <SelectInput
                  id="category_id"
                  label="Categoria"
                  placeholder="Selecione..."
                  required
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  {...register('category_id', { required: 'Categoria é obrigatória.' })}
                  error={errors.category_id?.message}
                />

                <SelectInput
                  id="destination_id"
                  label="Destino / Setor"
                  placeholder="Selecione..."
                  required
                  options={destinations.map((d) => ({ value: d.id, label: d.name }))}
                  {...register('destination_id', { required: 'Destino é obrigatório.' })}
                  error={errors.destination_id?.message}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="description" className="text-sm font-medium text-fg-muted">
                  Descrição{' '}
                  <span className="text-fg-muted/50 font-normal">(opcional)</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Detalhes adicionais, número de patrimônio, localização..."
                  className="w-full px-3 py-2.5 rounded-lg border text-sm text-fg bg-[#0F0F12]
                    placeholder:text-fg-muted/50 outline-none resize-none
                    border-white/[0.10] hover:border-white/[0.18]
                    focus:ring-2 focus:ring-accent/40 focus:border-accent/60
                    transition-all duration-200"
                  {...register('description')}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button type="submit" loading={loading} className="flex-1">
                  {loading ? 'Abrindo...' : '✚ Abrir Chamado'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
