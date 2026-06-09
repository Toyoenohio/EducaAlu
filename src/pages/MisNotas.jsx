import { useMisNotas } from '../hooks/useMisNotas'
import { ClipboardCheck, CheckCircle, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react'

const estadoConfig = {
  presente: { icon: CheckCircle, label: 'Presente', colorClass: 'text-secondary', bgClass: 'bg-secondary-fixed/20' },
  ausente: { icon: XCircle, label: 'Ausente', colorClass: 'text-error', bgClass: 'bg-error-container/30' },
  tardanza: { icon: Clock, label: 'Tardanza', colorClass: 'text-tertiary', bgClass: 'bg-tertiary-fixed/30' },
  justificada: { icon: AlertTriangle, label: 'Justificada', colorClass: 'text-primary', bgClass: 'bg-primary-fixed/30' },
}

export default function MisNotas() {
  const { asistencia, resumenPorCurso, loading, error } = useMisNotas()

  const cursos = Object.entries(resumenPorCurso)

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="w-7 h-7 text-primary" />
          <div>
            <h1 className="page-title">Asistencia</h1>
            <p className="text-on-surface-variant text-sm mt-0.5">
              Revisa tu registro y porcentaje de asistencia por curso
            </p>
          </div>
        </div>
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
        <>
          {/* Resumen por curso */}
          {cursos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cursos.map(([nombre, data], idx) => {
                const porcentaje = data.total > 0
                  ? Math.round(((data.presente + data.tardanza) / data.total) * 100)
                  : 0
                const porcentajeColor = porcentaje >= 80
                  ? 'text-secondary'
                  : porcentaje >= 60
                    ? 'text-tertiary'
                    : 'text-error'
                const barColor = porcentaje >= 80
                  ? 'bg-secondary'
                  : porcentaje >= 60
                    ? 'bg-tertiary'
                    : 'bg-error'

                return (
                  <div
                    key={nombre}
                    className="card p-5 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-montserrat font-bold text-on-surface">{nombre}</h3>
                      <span className={`text-2xl font-montserrat font-bold ${porcentajeColor}`}>
                        {porcentaje}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden mb-4">
                      <div
                        className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-secondary">{data.presente}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">Presente</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-tertiary">{data.tardanza}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">Tardanza</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-error">{data.ausente}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">Ausente</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">{data.justificada}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">Justificada</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-on-surface-variant/50 card">
              <ClipboardCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay registros de asistencia</p>
            </div>
          )}

          {/* Detailed records */}
          {asistencia.length > 0 && (
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-outline-variant/20">
                <h3 className="section-title">Registro Detallado</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-outline-variant/20 bg-surface-container-low/50">
                      <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider">Fecha</th>
                      <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider">Curso</th>
                      <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Entrada</th>
                      <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Salida</th>
                      <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistencia.slice(0, 20).map((reg, idx) => {
                      const cursoNombre = reg.inscripcion?.seccion?.curso_sede?.curso?.nombre || 'Curso'
                      const config = estadoConfig[reg.estado] || estadoConfig.ausente
                      const EstadoIcon = config.icon

                      return (
                        <tr
                          key={reg.id || idx}
                          className="border-b border-outline-variant/10 hover:bg-surface-container-low/50
                            transition-colors opacity-0 animate-fade-in"
                          style={{ animationDelay: `${idx * 0.03}s` }}
                        >
                          <td className="py-3 px-4 text-sm text-on-surface font-medium">
                            {new Date(reg.fecha).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-3 px-4 text-sm text-on-surface-variant">{cursoNombre}</td>
                          <td className="py-3 px-4 text-sm text-on-surface-variant hidden sm:table-cell">
                            {reg.hora_entrada?.slice(0, 5) || '—'}
                          </td>
                          <td className="py-3 px-4 text-sm text-on-surface-variant hidden sm:table-cell">
                            {reg.hora_salida?.slice(0, 5) || '—'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${config.bgClass} ${config.colorClass}`}>
                              <EstadoIcon className="w-3 h-3" />
                              {config.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {asistencia.length > 20 && (
                <div className="p-4 text-center border-t border-outline-variant/20">
                  <p className="text-xs text-on-surface-variant/50">
                    Mostrando los últimos 20 registros de {asistencia.length} totales
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
