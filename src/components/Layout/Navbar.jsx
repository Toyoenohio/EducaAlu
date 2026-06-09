import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Menu, Bell } from 'lucide-react'

const pageTitles = {
  '/': 'Dashboard',
  '/perfil': 'Mi Perfil',
  '/cursos': 'Mis Cursos',
  '/pagos': 'Mis Pagos',
  '/notas': 'Asistencia',
}

export default function Navbar({ onMenuClick }) {
  const location = useLocation()
  const { user } = useAuth()

  const title = pageTitles[location.pathname] || 'EDUCA'

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-montserrat font-bold text-lg text-on-surface">{title}</h2>
            <p className="text-xs text-on-surface-variant/60 hidden sm:block">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>

          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-outline-variant/20">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <span className="text-on-primary font-jakarta text-sm font-bold">
                {user?.user_metadata?.nombre?.[0] || user?.email?.[0]?.toUpperCase() || 'E'}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">
                {user?.user_metadata?.nombre || 'Estudiante'}
              </p>
              <p className="text-xs text-on-surface-variant/60">Estudiante</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
