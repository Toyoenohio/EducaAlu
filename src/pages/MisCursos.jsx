import { useState } from 'react'
import { useMisCursos } from '../hooks/useMisCursos'
import CursoActual from '../components/Cursos/CursoActual'
import HistorialCursos from '../components/Cursos/HistorialCursos'
import CertificadoSection from '../components/Cursos/CertificadoSection'
import { BookOpen, Clock, Award, Loader2 } from 'lucide-react'

const tabs = [
  { key: 'activos', label: 'Cursos Activos', icon: BookOpen },
  { key: 'historial', label: 'Historial', icon: Clock },
  { key: 'certificados', label: 'Certificados', icon: Award },
]

export default function MisCursos() {
  const { cursos, activos, historial, loading, error } = useMisCursos()
  const [activeTab, setActiveTab] = useState('activos')

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="page-title">Mis Cursos</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Gestiona tus cursos activos, historial y certificados
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container-high rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          // Disable certificados tab if no completed courses
          const hasCompleted = cursos.some(c => c.estado === 'completada')
          const isDisabled = tab.key === 'certificados' && !hasCompleted && activos.length === 0

          return (
            <button
              key={tab.key}
              onClick={() => !isDisabled && setActiveTab(tab.key)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg
                font-montserrat text-sm font-semibold whitespace-nowrap
                transition-all duration-200 flex-1 justify-center
                ${isActive
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : isDisabled
                    ? 'text-on-surface-variant/30 cursor-not-allowed'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {error && (
        <div className="p-4 bg-error-container/50 border border-error/20 rounded-xl animate-fade-in">
          <p className="text-sm text-on-error-container">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : (
        <div className="animate-fade-in">
          {activeTab === 'activos' && <CursoActual inscripciones={activos} />}
          {activeTab === 'historial' && <HistorialCursos inscripciones={historial} />}
          {activeTab === 'certificados' && <CertificadoSection inscripciones={cursos} />}
        </div>
      )}
    </div>
  )
}
