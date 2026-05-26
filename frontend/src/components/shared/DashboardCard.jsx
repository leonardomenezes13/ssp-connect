import Link from 'next/link';

/* Per-color tints for the icon container */
const ICON_TINTS = {
  green:  'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_16px_rgba(52,211,153,0.12)]',
  blue:   'bg-blue-500/10    border-blue-500/20    shadow-[0_0_16px_rgba(96,165,250,0.12)]',
  purple: 'bg-purple-500/10  border-purple-500/20  shadow-[0_0_16px_rgba(167,139,250,0.12)]',
  amber:  'bg-amber-500/10   border-amber-500/20   shadow-[0_0_16px_rgba(251,191,36,0.12)]',
  slate:  'bg-white/[0.06]   border-white/[0.10]',
};

const VALUE_COLORS = {
  green:  'text-emerald-300',
  blue:   'text-blue-300',
  purple: 'text-purple-300',
  amber:  'text-amber-300',
  slate:  'text-fg-muted',
};

export default function DashboardCard({ label, value, icon, color = 'green', href }) {
  const iconTint  = ICON_TINTS[color]  ?? ICON_TINTS.slate;
  const valColor  = VALUE_COLORS[color] ?? VALUE_COLORS.slate;

  const card = (
    <div className={`group relative rounded-2xl p-5 overflow-hidden
      bg-gradient-to-b from-white/[0.06] to-white/[0.02]
      border border-white/[0.06]
      shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_24px_rgba(0,0,0,0.4)]
      flex items-center gap-4
      transition-all duration-300
      ${href ? 'cursor-pointer hover:border-white/[0.10] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_8px_40px_rgba(0,0,0,0.5),0_0_40px_rgba(94,106,210,0.06)]' : ''}`}
    >
      {/* Subtle top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px
        bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0
        border ${iconTint} transition-all duration-300
        ${href ? 'group-hover:scale-105' : ''}`}>
        {icon}
      </div>

      {/* Content */}
      <div>
        <p className={`text-3xl font-bold leading-none tracking-tight ${valColor}`}>
          {value ?? '—'}
        </p>
        <p className="text-sm text-fg-muted mt-1">{label}</p>
      </div>
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}
