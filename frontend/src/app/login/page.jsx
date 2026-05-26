'use client';
import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';

/* ── Mouse-tracking spotlight hook ──────────────────────────
   Uses refs + direct DOM style mutation instead of useState so
   that 60fps mousemove events never trigger React re-renders.
   The spotlight div's background and opacity are written directly
   to its style property, bypassing the React reconciler entirely. */
function useSpotlight() {
  const cardRef   = useRef(null);
  const layerRef  = useRef(null);

  const onMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect || !layerRef.current) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    layerRef.current.style.opacity = '1';
    layerRef.current.style.background =
      `radial-gradient(280px circle at ${x}px ${y}px, rgba(94,106,210,0.12), transparent 70%)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (layerRef.current) layerRef.current.style.opacity = '0';
  }, []);

  return { cardRef, layerRef, onMouseMove, onMouseLeave };
}

export default function LoginPage() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { cardRef, layerRef, onMouseMove, onMouseLeave } = useSpotlight();

  const { register, handleSubmit, formState: { errors } } = useForm();

  async function onSubmit({ name, password }) {
    setServerError('');
    setLoading(true);
    try {
      const data = await authService.login(name, password);
      login(data.user, data.token);
    } catch (err) {
      setServerError(err.response?.data?.message ?? 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-bg-base">

      {/* ── Ambient gradient blobs ────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Primary blob — top center */}
        <div className="animate-float absolute -top-48 left-1/2 -translate-x-1/2
          w-[900px] h-[700px] rounded-full opacity-25
          bg-[radial-gradient(ellipse,#5E6AD2_0%,transparent_70%)]
          blur-[120px]" />
        {/* Secondary blob — bottom left */}
        <div className="animate-float-slow absolute -bottom-32 -left-32
          w-[600px] h-[500px] rounded-full opacity-[0.15]
          bg-[radial-gradient(ellipse,#7c3aed_0%,transparent_70%)]
          blur-[100px]" />
        {/* Tertiary blob — right side */}
        <div className="animate-float absolute top-1/4 -right-40
          w-[500px] h-[600px] rounded-full opacity-[0.12]
          bg-[radial-gradient(ellipse,#3b82f6_0%,transparent_70%)]
          blur-[90px]" />
        {/* Bottom pulse */}
        <div className="animate-pulse-glow absolute bottom-0 left-1/2 -translate-x-1/2
          w-[800px] h-[200px] rounded-full
          bg-[radial-gradient(ellipse,#5E6AD2_0%,transparent_70%)]
          blur-[80px]" />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-100" />

      {/* ── Left panel ───────────────────────────────────── */}
      <div className="hidden lg:flex relative w-[48%] flex-col justify-between p-12 z-10">

        {/* Logo */}
        <div className="flex items-center gap-3 animate-fade-up">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base text-white
            bg-gradient-to-br from-accent to-accent-bright
            shadow-[0_0_24px_rgba(94,106,210,0.6)]">
            S
          </div>
          <span className="text-fg font-bold text-lg tracking-tight">SSP Connect</span>
        </div>

        {/* Hero text */}
        <div className="space-y-6">
          <div className="animate-fade-up delay-100">
            <p className="text-xs font-mono tracking-[0.18em] uppercase text-fg-muted mb-4">
              Sistema de Chamados
            </p>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight">
              <span className="bg-gradient-to-b from-white via-white/95 to-white/60
                bg-clip-text text-transparent">
                Solicitações
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent via-indigo-400 to-accent
                bg-clip-text text-transparent animate-gradient-x">
                resolvidas
              </span>
              <br />
              <span className="bg-gradient-to-b from-white via-white/95 to-white/60
                bg-clip-text text-transparent">
                com agilidade.
              </span>
            </h1>
          </div>

          <p className="text-fg-muted text-base leading-relaxed max-w-sm animate-fade-up delay-200">
            Abra solicitações, acompanhe sua posição na fila e resolva
            problemas com total visibilidade do processo.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 animate-fade-up delay-300">
            {[
              { icon: '≡', label: 'Chamados' },
              { icon: '◎', label: 'Fila em tempo real' },
              { icon: '⊙', label: 'Gestão de usuários' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-white/[0.05] border border-white/[0.08] text-sm text-fg-muted">
                <span className="text-accent font-mono">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-fg-muted/40 text-xs animate-fade-up delay-400">
          SSP Connect © {new Date().getFullYear()} — Acesso restrito
        </p>
      </div>

      {/* ── Divider ──────────────────────────────────────── */}
      <div className="hidden lg:block absolute left-[48%] inset-y-0 w-px
        bg-gradient-to-b from-transparent via-white/[0.08] to-transparent z-10" />

      {/* ── Right panel (form) ───────────────────────────── */}
      <div className="relative flex-1 flex items-center justify-center p-8 z-10">
        <div className="w-full max-w-[380px] space-y-6">

          {/* Mobile logo */}
          <div className="lg:hidden text-center animate-fade-up">
            <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center
              font-bold text-xl text-white
              bg-gradient-to-br from-accent to-accent-bright
              shadow-[0_0_24px_rgba(94,106,210,0.5)]">
              S
            </div>
            <h1 className="font-bold text-fg text-xl tracking-tight">SSP Connect</h1>
          </div>

          {/* Card */}
          <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="relative overflow-hidden rounded-2xl
              bg-gradient-to-b from-white/[0.07] to-white/[0.02]
              border border-white/[0.08]
              shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_16px_56px_rgba(0,0,0,0.6),0_0_80px_rgba(94,106,210,0.06)]
              animate-fade-up"
          >
            {/* Mouse spotlight — opacity/background written directly via ref,
                no React re-renders on mousemove */}
            <div
              ref={layerRef}
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
            />

            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-px
              bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

            <div className="relative p-8">
              {/* Header */}
              <div className="mb-7">
                <h2 className="text-lg font-semibold text-fg tracking-tight">
                  Entrar na conta
                </h2>
                <p className="text-sm text-fg-muted mt-1">
                  Informe suas credenciais para continuar
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                  id="name"
                  label="Nome de usuário"
                  placeholder="Ex: joao.silva"
                  required
                  autoComplete="username"
                  {...register('name', { required: 'Nome é obrigatório.' })}
                  error={errors.name?.message}
                />

                <FormInput
                  id="password"
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  {...register('password', { required: 'Senha é obrigatória.' })}
                  error={errors.password?.message}
                />

                {serverError && (
                  <div className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm
                    bg-red-500/10 border border-red-500/25 text-red-400">
                    <span className="shrink-0 text-base">⚠</span>
                    {serverError}
                  </div>
                )}

                <div className="pt-1">
                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? 'Entrando...' : 'Entrar →'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <p className="text-center text-fg-muted/40 text-xs animate-fade-up delay-200">
            SSP Connect © {new Date().getFullYear()} — Acesso restrito
          </p>
        </div>
      </div>
    </div>
  );
}
