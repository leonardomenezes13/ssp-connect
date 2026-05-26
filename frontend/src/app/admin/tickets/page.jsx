'use client';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ticketService }      from '@/services/ticketService';
import { categoryService }    from '@/services/categoryService';
import { destinationService } from '@/services/destinationService';
import { userService }        from '@/services/userService';
import AppLayout    from '@/components/layout/AppLayout';
import TicketTable  from '@/components/shared/TicketTable';
import SelectInput  from '@/components/ui/SelectInput';
import LoadingState from '@/components/ui/LoadingState';

function AdminTicketsContent() {
  const searchParams = useSearchParams();

  const [tickets,      setTickets]      = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [users,        setUsers]        = useState([]);
  const [loading,      setLoading]      = useState(true);

  const [filters, setFilters] = useState({
    status:         searchParams.get('status') ?? '',
    category_id:    '',
    destination_id: '',
    user_id:        '',
  });

  useEffect(() => {
    Promise.all([
      categoryService.getAll(),
      destinationService.getAll(),
      userService.getAll(),
    ]).then(([c, d, u]) => {
      setCategories(c);
      setDestinations(d);
      setUsers(u);
    }).catch(console.error);
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    ticketService.getAll(params)
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () =>
    setFilters({ status: '', category_id: '', destination_id: '', user_id: '' });

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <AppLayout title="Chamados" subtitle={`${tickets.length} resultado(s)`}>
      <div className="space-y-4">

        {/* Filters */}
        <div className="rounded-2xl border border-white/[0.06] p-4
          bg-gradient-to-b from-white/[0.04] to-transparent">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <SelectInput
              placeholder="Todos os status"
              value={filters.status}
              options={[
                { value: 'ABERTO',         label: 'Aberto'         },
                { value: 'EM_ATENDIMENTO', label: 'Em Atendimento' },
                { value: 'CONCLUIDO',      label: 'Concluído'      },
                { value: 'CANCELADO',      label: 'Cancelado'      },
              ]}
              onChange={(e) => setFilter('status', e.target.value)}
            />
            <SelectInput
              placeholder="Todas as categorias"
              value={filters.category_id}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              onChange={(e) => setFilter('category_id', e.target.value)}
            />
            <SelectInput
              placeholder="Todos os destinos"
              value={filters.destination_id}
              options={destinations.map((d) => ({ value: d.id, label: d.name }))}
              onChange={(e) => setFilter('destination_id', e.target.value)}
            />
            <SelectInput
              placeholder="Todos os usuários"
              value={filters.user_id}
              options={users.map((u) => ({ value: u.id, label: u.name }))}
              onChange={(e) => setFilter('user_id', e.target.value)}
            />
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-2.5 text-xs text-fg-muted/60 hover:text-red-400
                transition-colors duration-150"
            >
              ✕ Limpar filtros
            </button>
          )}
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden
          bg-gradient-to-b from-white/[0.04] to-transparent
          shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_24px_rgba(0,0,0,0.4)]">
          {loading ? <LoadingState /> : (
            <TicketTable tickets={tickets} basePath="/admin/tickets" showUser />
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default function AdminTicketsPage() {
  return (
    <Suspense fallback={null}>
      <AdminTicketsContent />
    </Suspense>
  );
}
