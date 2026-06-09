import { BookOpen, CheckCircle, XCircle, Clock } from 'lucide-react'

const estadoConfig = {
  completada: { icon: CheckCircle, label: 'Completado', class: 'badge-success' },
  retirada: { icon: XCircle, label: 'Retirado', class: 'badge-error' },
  suspendida: { icon: Clock, label: 'Suspendido', class: 'badge-warning' },
}

export default function HistorialCursos({ inscripciones = [] }) {
  if (inscripciones.length === 0) {
    return (
      <div className="text-center py-12 text-on-surface-variant/50">
        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No tienes cursos en tu historial</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-outline-variant/20">
            <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider">Curso</th>
            <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Sección</th>
            <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Horario</th>
            <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider">Estado</th>
          </tr>
        </thead>
        <tbody>
          {inscripciones.map((inscripcion, idx) => {
            const seccion = inscripcion.seccion
            const cursoNombre = seccion?.curso_sede?.curso?.nombre || 'Curso'
            const config = estadoConfig[inscripcion.estado] || estadoConfig.suspendida
            const EstadoIcon = config.icon

            return (
              <tr
                key={inscripcion.id || idx}
                className="border-b border-outline-variant/10 hover:bg-surface-container-low/50
                  transition-colors opacity-0 animate-fade-in"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-fixed/30 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-on-surface">{cursoNombre}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-on-surface-variant hidden sm:table-cell">
                  {seccion?.codigo || '—'}
                </td>
                <td className="py-3 px-4 text-sm text-on-surface-variant hidden md:table-cell">
                  {seccion?.horario_inicio?.slice(0, 5)} - {seccion?.horario_fin?.slice(0, 5)}
                </td>
                <td className="py-3 px-4">
                  <span className={config.class}>
                    <EstadoIcon className="w-3 h-3 mr-1" />
                    {config.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
