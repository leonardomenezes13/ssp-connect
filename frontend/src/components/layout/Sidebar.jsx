'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const USER_NAV = [
  { href: '/user/dashboard',   label: 'Início',        icon: '⊞' },
  { href: '/user/tickets',     label: 'Meus Chamados', icon: '≡' },
  { href: '/user/tickets/new', label: 'Abrir Chamado', icon: '+' },
];

const ADMIN_NAV = [
  {
    group: 'Principal',
    items: [
      { href: '/admin/dashboard', label: 'Início',   icon: '⊞' },
      { href: '/admin/queue',     label: 'Fila',     icon: '◎' },
      { href: '/admin/tickets',   label: 'Chamados', icon: '≡' },
    ],
  },
  {
    group: 'Gestão',
    items: [
      { href: '/admin/users',        label: 'Usuários',   icon: '⊙' },
      { href: '/admin/destinations', label: 'Destinos',   icon: '◈' },
      { href: '/admin/categories',   label: 'Categorias', icon: '⊟' },
    ],
  },
];

/* NavLink is defined at module scope so React keeps a stable component
   reference across Sidebar re-renders. Defining it inside Sidebar would
   create a new type every render, causing every nav item to unmount and
   remount instead of updating — killing transitions and focus state. */
function NavLink({ href, label, icon, pathname }) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 group overflow-hidden
        ${active
          ? 'bg-white/[0.08] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
          : 'text-fg-muted hover:bg-white/[0.04] hover:text-fg'
        }`}
    >
      {/* Active left indicator */}
      {active && (
        <span className="absolute left-0 inset-y-2 w-[3px] rounded-r-full
          bg-accent shadow-[0_0_8px_rgba(94,106,210,0.8)]" />
      )}

      <span className={`text-[15px] w-5 text-center font-mono transition-colors duration-200
        ${active ? 'text-accent' : 'text-fg-muted group-hover:text-fg'}`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isAdmin = user?.role === 'ADMIN';
  const initials = user?.name?.slice(0, 2).toUpperCase() ?? '?';

  return (
    <aside className="w-64 fixed inset-y-0 left-0 z-20 flex flex-col
      bg-bg-base border-r border-white/[0.06]
      shadow-[1px_0_0_rgba(255,255,255,0.03)]">

      {/* Subtle ambient glow at top */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none
        bg-[radial-gradient(ellipse_at_top,rgba(94,106,210,0.08)_0%,transparent_70%)]" />

      {/* Logo */}
      <div className="relative px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm
            bg-gradient-to-br from-accent to-accent-bright
            shadow-[0_0_16px_rgba(94,106,210,0.5)]">
            S
          </div>
          <div>
            <h1 className="text-fg font-bold text-[15px] leading-tight tracking-tight">SSP Connect</h1>
            <p className="text-fg-muted text-[10px] leading-tight tracking-wider uppercase">
              Sistema de Chamados
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {isAdmin ? (
          ADMIN_NAV.map((section) => (
            <div key={section.group} className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] px-3 mb-1.5
                text-fg-muted/40">
                {section.group}
              </p>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <NavLink key={item.href} pathname={pathname} {...item} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-0.5">
            {USER_NAV.map((item) => (
              <NavLink key={item.href} pathname={pathname} {...item} />
            ))}
          </div>
        )}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/[0.06] p-3 space-y-0.5">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-full flex items-center justify-center
            text-white text-xs font-bold shrink-0
            bg-gradient-to-br from-accent/80 to-accent-bright/80
            shadow-[0_0_10px_rgba(94,106,210,0.3)]
            ring-1 ring-accent/30">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-fg text-sm font-medium truncate leading-tight">{user?.name}</p>
            <p className="text-fg-muted text-[11px] leading-tight">
              {isAdmin ? 'Administrador' : 'Usuário'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
            font-medium text-fg-muted hover:bg-red-500/10 hover:text-red-400
            transition-all duration-200"
        >
          <span className="text-[15px] w-5 text-center font-mono">←</span>
          Sair
        </button>
      </div>
    </aside>
  );
}
