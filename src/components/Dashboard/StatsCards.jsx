import { BookOpen, CreditCard, ClipboardCheck, TrendingUp } from 'lucide-react'

const cards = [
  {
    key: 'cursos',
    label: 'Cursos Activos',
    icon: BookOpen,
    gradient: 'from-primary to-primary-container',
    textColor: 'text-on-primary',
  },
  {
    key: 'pendientes',
    label: 'Pagos Pendientes',
    icon: CreditCard,
    gradient: 'from-tertiary to-tertiary-container',
    textColor: 'text-on-tertiary',
  },
  {
    key: 'asistencia',
    label: '% Asistencia',
    icon: ClipboardCheck,
    gradient: 'from-secondary to-[#00a003]',
    textColor: 'text-on-secondary',
  },
  {
    key: 'completados',
    label: 'Cursos Completados',
    icon: TrendingUp,
    gradient: 'from-[#4a3f9f] to-primary',
    textColor: 'text-on-primary',
  },
]

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon
        const value = stats?.[card.key] ?? '—'
        return (
          <div
            key={card.key}
            className={`
              relative overflow-hidden rounded-2xl p-5 sm:p-6
              bg-gradient-to-br ${card.gradient}
              opacity-0 animate-fade-in
            `}
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

            <div className="relative z-10">
              <div className={`w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
              <p className={`${card.textColor}/70 text-sm font-montserrat font-medium`}>{card.label}</p>
              <p className={`${card.textColor} text-3xl font-montserrat font-bold mt-1`}>
                {card.key === 'asistencia' && typeof value === 'number' ? `${value}%` : value}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
