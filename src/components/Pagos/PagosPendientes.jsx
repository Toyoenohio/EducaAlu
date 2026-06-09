import { CreditCard, AlertTriangle, Clock, Calendar } from 'lucide-react'

const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function PagosPendientes({ pagos = [] }) {
  if (pagos.length === 0) {
    return (
      <div className="text-center py-12 text-on-surface-variant/50">
        <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm font-medium">¡Estás al día!</p>
        <p className="text-xs mt-1">No tienes pagos pendientes</p>
      </div>
    )
  }

  const totalPendiente = pagos.reduce((sum, p) => sum + (p.monto || 0), 0)

  return (
    <div className="space-y-4">
      {/* Total header */}
      <div className="bg-gradient-to-r from-tertiary to-tertiary-container rounded-2xl p-5">
        <p className="text-on-tertiary/70 text-sm font-medium">Total Pendiente</p>
        <p className="text-on-tertiary text-3xl font-montserrat font-bold mt-1">${totalPendiente.toFixed(2)}</p>
        <p className="text-on-tertiary/50 text-xs mt-1">{pagos.length} pago{pagos.length > 1 ? 's' : ''} pendiente{pagos.length > 1 ? 's' : ''}</p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {pagos.map((pago, idx) => {
          const cursoNombre = pago.inscripcion?.seccion?.curso_sede?.curso?.nombre || 'Curso'
          const isVencido = pago.fecha_vencimiento && new Date(pago.fecha_vencimiento) < new Date()

          return (
            <div
              key={pago.id || idx}
              className={`
                card p-4 flex items-center gap-4 opacity-0 animate-fade-in
                ${isVencido ? '!border-error/30 !bg-error-container/10' : ''}
              `}
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                ${isVencido ? 'bg-error/10' : 'bg-tertiary-fixed/30'}
              `}>
                {isVencido
                  ? <AlertTriangle className="w-5 h-5 text-error" />
                  : <Clock className="w-5 h-5 text-tertiary" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-on-surface">{cursoNombre}</p>
                <p className="text-sm text-on-surface-variant">
                  {meses[pago.mes]} {pago.anio}
                  {pago.concepto && ` · ${pago.concepto === 'cuota_mensual' ? 'Cuota Mensual' : pago.concepto}`}
                </p>
                {pago.fecha_vencimiento && (
                  <p className={`text-xs mt-1 flex items-center gap-1 ${isVencido ? 'text-error' : 'text-on-surface-variant/50'}`}>
                    <Calendar className="w-3 h-3" />
                    Vence: {new Date(pago.fecha_vencimiento).toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-lg text-on-surface">${pago.monto?.toFixed(2)}</p>
                {isVencido && <span className="badge-error text-[10px]">Vencido</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
