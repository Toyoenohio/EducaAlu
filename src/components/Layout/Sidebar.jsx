import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard,
  User,
  BookOpen,
  CreditCard,
  ClipboardCheck,
  LogOut,
  X,
  GraduationCap
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/perfil', icon: User, label: 'Mi Perfil' },
  { to: '/cursos', icon: BookOpen, label: 'Mis Cursos' },
  { to: '/pagos', icon: CreditCard, label: 'Mis Pagos' },
  { to: '/notas', icon: ClipboardCheck, label: 'Asistencia' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth()
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[280px]
          bg-primary flex flex-col
          transform transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-on-primary/10 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-on-primary" />
            </div>
            <div>
              <h1 className="text-on-primary font-montserrat font-bold text-lg tracking-tight">EDUCA</h1>
              <p className="text-on-primary/50 text-xs font-jakarta">Portal Estudiantil</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-on-primary/60 hover:text-on-primary transition-colors p-1 rounded-lg hover:bg-on-primary/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.to === '/' 
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to)

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  font-montserrat text-sm font-semibold
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-on-primary/15 text-on-primary shadow-lg shadow-black/10'
                    : 'text-on-primary/60 hover:text-on-primary hover:bg-on-primary/8'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-on-primary' : ''
                }`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-secondary-fixed rounded-full animate-pulse-soft" />
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-on-primary/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-on-primary/15 flex items-center justify-center">
              <span className="text-on-primary font-jakarta text-sm font-bold">
                {user?.user_metadata?.nombre?.[0] || user?.email?.[0]?.toUpperCase() || 'E'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-on-primary text-sm font-semibold truncate">
                {user?.user_metadata?.nombre || 'Estudiante'}
              </p>
              <p className="text-on-primary/40 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
              text-on-primary/50 hover:text-on-primary hover:bg-on-primary/8
              font-montserrat text-sm font-semibold transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
