import { Award, Download, Lock } from 'lucide-react'

export default function CertificadoSection({ inscripciones = [] }) {
  const completadas = inscripciones.filter(i => i.estado === 'completada')
  const activas = inscripciones.filter(i => i.estado === 'activa')

  return (
    <div className="space-y-4">
      {/* Certificados disponibles */}
      {completadas.length > 0 && (
        <>
          <p className="text-sm text-on-surface-variant mb-2">
            Certificados disponibles para cursos completados:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completadas.map((inscripcion, idx) => {
              const cursoNombre = inscripcion.seccion?.curso_sede?.curso?.nombre || 'Curso'
              return (
                <div
                  key={inscripcion.id || idx}
                  className="card-elevated p-5 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-tertiary-fixed to-tertiary-fixed-dim
                      flex items-center justify-center flex-shrink-0">
                      <Award className="w-7 h-7 text-on-tertiary-fixed" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-montserrat font-bold text-on-surface">{cursoNombre}</h4>
                      <p className="text-xs text-on-surface-variant mt-1">Curso completado exitosamente</p>
                      <button className="btn-secondary mt-3 !py-2 !px-4 !text-xs flex items-center gap-2">
                        <Download className="w-3.5 h-3.5" />
                        Descargar Certificado
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Cursos en progreso (bloqueado) */}
      {activas.length > 0 && (
        <>
          <p className="text-sm text-on-surface-variant mt-6 mb-2">
            Cursos en progreso — completa el curso para obtener tu certificado:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activas.map((inscripcion, idx) => {
              const cursoNombre = inscripcion.seccion?.curso_sede?.curso?.nombre || 'Curso'
              return (
                <div
                  key={inscripcion.id || idx}
                  className="card p-5 opacity-60"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-surface-container-high
                      flex items-center justify-center flex-shrink-0">
                      <Lock className="w-7 h-7 text-on-surface-variant/40" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-montserrat font-bold text-on-surface/60">{cursoNombre}</h4>
                      <p className="text-xs text-on-surface-variant/50 mt-1">Curso en progreso</p>
                      <span className="badge-warning mt-3 inline-flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Bloqueado
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {completadas.length === 0 && activas.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant/50">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tienes certificados disponibles</p>
          <p className="text-xs mt-1">Completa un curso para obtener tu certificado</p>
        </div>
      )}
    </div>
  )
}
