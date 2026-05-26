'use client';
import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /* Store timer IDs so we can cancel them on unmount, preventing
     setState calls after the provider has been removed from the tree. */
  const timers = useRef(new Map());

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);

    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    const exitTimer = setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      280
    );
    timers.current.set(`exit-${id}`, exitTimer);
  }, []);

  const push = useCallback(
    (message, type = 'info') => {
      /* crypto.randomUUID() is available in all modern browsers and avoids
         the shared mutable counter that could double-increment under
         React 18 Strict Mode double-invocation. */
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type, leaving: false }]);
      const timer = setTimeout(() => dismiss(id), 4000);
      timers.current.set(id, timer);
      return id;
    },
    [dismiss]
  );

  /* Memoize the toast API so consumers only re-render when push/dismiss
     change identity (i.e. essentially never), not on every toast state update. */
  const toast = useMemo(() => ({
    success: (msg) => push(msg, 'success'),
    error:   (msg) => push(msg, 'error'),
    warning: (msg) => push(msg, 'warning'),
    info:    (msg) => push(msg, 'info'),
  }), [push]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return ctx;
}

/* ── Visual constants ─────────────────────────────────────── */

const ACCENT = {
  success: 'bg-emerald-400',
  error:   'bg-red-400',
  warning: 'bg-amber-400',
  info:    'bg-blue-400',
};

const ICONS = {
  success: '✓',
  error:   '✕',
  warning: '!',
  info:    'i',
};

const ICON_CLS = {
  success: 'bg-emerald-500/20 text-emerald-400',
  error:   'bg-red-500/20    text-red-400',
  warning: 'bg-amber-500/20  text-amber-400',
  info:    'bg-blue-500/20   text-blue-400',
};

function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`relative flex items-start gap-3 rounded-xl overflow-hidden
            bg-bg-elevated/95 backdrop-blur-xl
            border border-white/[0.08]
            shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.6)]
            ${t.leaving ? 'animate-toast-out' : 'animate-toast-in'}`}
        >
          {/* Left accent stripe */}
          <div className={`absolute left-0 inset-y-0 w-[3px] ${ACCENT[t.type]}`} />

          <div className="flex items-start gap-3 px-4 py-3 pl-5 w-full">
            {/* Icon badge */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center
              text-[11px] font-bold shrink-0 mt-0.5 ${ICON_CLS[t.type]}`}>
              {ICONS[t.type]}
            </div>

            {/* Message */}
            <p className="flex-1 text-sm text-fg leading-snug">{t.message}</p>

            {/* Dismiss */}
            <button
              onClick={() => onDismiss(t.id)}
              aria-label="Dispensar notificação"
              className="text-fg-muted/50 hover:text-fg-muted text-lg leading-none
                transition-colors duration-150 -mt-0.5 ml-1 shrink-0"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
