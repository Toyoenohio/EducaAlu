import { BookOpen, Clock, MapPin, Users, Calendar } from 'lucide-react'

export default function CursoActual({ inscripciones = [] }) {
  if (inscripciones.length === 0) {
    return (
      <div className="text-center py-12 text-on-surface-variant/50">
        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No tienes cursos activos actualmente</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {inscripciones.map((inscripcion, idx) => {
        const seccion = inscripcion.seccion
        const cursoNombre = seccion?.curso_sede?.curso?.nombre || 'Curso'
        const cursoDesc = seccion?.curso_sede?.curso?.descripcion || ''
        const sedeNombre = seccion?.curso_sede?.sede?.nombre || ''
        const dias = seccion?.dias || []

        return (
          <div
            key={inscripcion.id || idx}
            className="card-elevated p-5 opacity-0 animate-fade-in"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container
                  flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-on-primary" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-on-surface">{cursoNombre}</h3>
                  <p className="text-xs text-on-surface-variant">Sección {seccion?.codigo}</p>
                </div>
              </div>
              <span className="badge-success">Activo</span>
            </div>

            {cursoDesc && (
              <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{cursoDesc}</p>
            )}

            {/* Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Clock className="w-4 h-4 text-primary/60" />
                <span>{seccion?.horario_inicio?.slice(0, 5)} - {seccion?.horario_fin?.slice(0, 5)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Calendar className="w-4 h-4 text-primary/60" />
                <span>{dias.join(', ')}</span>
              </div>
              {seccion?.profesor && (
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Users className="w-4 h-4 text-primary/60" />
                  <span>Prof. {seccion.profesor}</span>
                </div>
              )}
              {sedeNombre && (
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <MapPin className="w-4 h-4 text-primary/60" />
                  <span>{sedeNombre}</span>
                </div>
              )}
            </div>

            {/* Tipo badge */}
            {seccion?.tipo && (
              <div className="mt-4 pt-3 border-t border-outline-variant/20">
                <span className="badge-info">{seccion.tipo}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
