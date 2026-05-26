'use client';
import { useAuth } from '@/context/AuthContext';

export default function Navbar({ title, subtitle }) {
  const { user } = useAuth();
  const initials = user?.name?.slice(0, 2).toUpperCase();

  return (
    <header className="h-14 sticky top-0 z-10 flex items-center justify-between px-6
      bg-bg-base/90 backdrop-blur-xl border-b border-white/[0.06]
      shadow-[0_1px_0_rgba(255,255,255,0.03)]">

      {/* Page title */}
      <div>
        <h2 className="font-semibold text-fg text-[15px] leading-tight tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-fg-muted leading-tight mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* User pill */}
      <div className="flex items-center gap-2.5">
        <span className="text-sm text-fg-muted hidden sm:block">
          Olá,{' '}
          <span className="text-fg font-medium">{user?.name}</span>
        </span>
        <div className="w-8 h-8 rounded-full flex items-center justify-center
          text-white text-xs font-bold
          bg-gradient-to-br from-accent/80 to-accent-bright/80
          ring-1 ring-accent/30
          shadow-[0_0_10px_rgba(94,106,210,0.25)]">
          {initials}
        </div>
      </div>
    </header>
  );
}
