import { Calendar, Clock, MapPin } from 'lucide-react'

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function HorarioHoy({ cursos = [] }) {
  const hoy = diasSemana[new Date().getDay()]

  const cursosHoy = cursos.filter(inscripcion => {
    const dias = inscripcion.seccion?.dias || []
    return dias.some(d => d.toLowerCase() === hoy.toLowerCase())
  })

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="section-title">Horario de Hoy</h3>
        <span className="badge-info ml-auto">{hoy}</span>
      </div>

      {cursosHoy.length === 0 ? (
        <div className="text-center py-8 text-on-surface-variant/50">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tienes clases hoy</p>
          <p className="text-xs mt-1">Disfruta tu día libre 😊</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cursosHoy.map((inscripcion, idx) => {
            const seccion = inscripcion.seccion
            const cursoNombre = seccion?.curso_sede?.curso?.nombre || 'Curso'
            const sedeNombre = seccion?.curso_sede?.sede?.nombre || ''
            return (
              <div
                key={inscripcion.id || idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low
                  opacity-0 animate-fade-in"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary-fixed/40 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">{cursoNombre}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <span className="text-xs text-on-surface-variant flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {seccion?.horario_inicio?.slice(0, 5)} - {seccion?.horario_fin?.slice(0, 5)}
                    </span>
                    {sedeNombre && (
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {sedeNombre}
                      </span>
                    )}
                    {seccion?.profesor && (
                      <span className="text-xs text-on-surface-variant">
                        Prof. {seccion.profesor}
                      </span>
                    )}
                  </div>
                </div>
                <span className="badge-info flex-shrink-0">Sección {seccion?.codigo}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
