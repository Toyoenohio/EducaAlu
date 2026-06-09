import { User, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react'

export default function PerfilCard({ perfil, loading }) {
  if (loading) {
    return (
      <div className="card p-8 animate-pulse-soft">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-surface-container-high mb-4" />
          <div className="w-48 h-6 bg-surface-container-high rounded-lg mb-2" />
          <div className="w-32 h-4 bg-surface-container-high rounded-lg" />
        </div>
      </div>
    )
  }

  if (!perfil) {
    return (
      <div className="card p-8 text-center">
        <User className="w-12 h-12 mx-auto mb-3 text-on-surface-variant/30" />
        <p className="text-on-surface-variant">No se encontró información del perfil</p>
      </div>
    )
  }

  const initials = `${perfil.nombre?.[0] || ''}${perfil.apellido?.[0] || ''}`.toUpperCase()

  const fields = [
    { icon: CreditCard, label: 'Cédula', value: perfil.cedula },
    { icon: Mail, label: 'Email', value: perfil.email },
    { icon: Phone, label: 'Teléfono', value: perfil.telefono },
    { icon: MapPin, label: 'Dirección', value: perfil.direccion },
    { icon: Calendar, label: 'Fecha de Nacimiento', value: perfil.fecha_nacimiento ? new Date(perfil.fecha_nacimiento).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : null },
  ]

  return (
    <div className="card overflow-hidden animate-fade-in">
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-br from-primary to-primary-container p-8 pb-16">
        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-white/5" />
      </div>

      {/* Avatar overlapping */}
      <div className="flex flex-col items-center -mt-12 px-6 pb-2">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-fixed to-primary-fixed-dim
          flex items-center justify-center border-4 border-surface-container-lowest shadow-xl">
          <span className="text-2xl font-montserrat font-bold text-on-primary-fixed">{initials}</span>
        </div>
        <h2 className="mt-4 font-montserrat font-bold text-xl text-on-surface">
          {perfil.nombre} {perfil.apellido}
        </h2>
        <span className="badge-info mt-2">Estudiante</span>
      </div>

      {/* Info fields */}
      <div className="p-6 pt-4 space-y-4">
        {fields.map((field, idx) => {
          if (!field.value) return null
          const Icon = field.icon
          return (
            <div
              key={field.label}
              className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low
                opacity-0 animate-fade-in"
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary-fixed/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">{field.label}</p>
                <p className="text-sm text-on-surface font-semibold">{field.value}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
