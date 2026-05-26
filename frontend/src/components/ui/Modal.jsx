'use client';
import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-bg-deep/80 backdrop-blur-sm" />

      {/* Panel */}
      <div className={`relative w-full ${sizes[size]} rounded-2xl animate-scale-in overflow-hidden
        bg-gradient-to-b from-white/[0.08] to-bg-elevated
        border border-white/[0.08]
        shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_16px_56px_rgba(0,0,0,0.7),0_0_80px_rgba(94,106,210,0.06)]`}
      >
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="font-semibold text-fg text-base">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-fg-muted
              hover:bg-white/[0.08] hover:text-fg transition-all duration-150 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
