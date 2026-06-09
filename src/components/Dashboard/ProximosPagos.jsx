import { CreditCard, AlertTriangle, Clock } from 'lucide-react'

const meses = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export default function ProximosPagos({ pagos = [] }) {
  const proximosPagos = pagos.slice(0, 4)

  if (proximosPagos.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="section-title">Próximos Pagos</h3>
        </div>
        <div className="text-center py-8 text-on-surface-variant/50">
          <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tienes pagos pendientes</p>
          <p className="text-xs mt-1">¡Estás al día! 🎉</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-primary" />
        <h3 className="section-title">Próximos Pagos</h3>
      </div>
      <div className="space-y-3">
        {proximosPagos.map((pago, idx) => {
          const cursoNombre = pago.inscripcion?.seccion?.curso_sede?.curso?.nombre || 'Curso'
          const isVencido = pago.fecha_vencimiento && new Date(pago.fecha_vencimiento) < new Date()
          return (
            <div
              key={pago.id || idx}
              className={`
                flex items-center justify-between p-3 rounded-xl
                ${isVencido ? 'bg-error-container/30 border border-error/20' : 'bg-surface-container-low'}
                opacity-0 animate-fade-in
              `}
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${isVencido ? 'bg-error/10' : 'bg-tertiary-fixed/30'}
                `}>
                  {isVencido
                    ? <AlertTriangle className="w-4 h-4 text-error" />
                    : <Clock className="w-4 h-4 text-tertiary" />
                  }
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{cursoNombre}</p>
                  <p className="text-xs text-on-surface-variant">
                    {meses[pago.mes]} {pago.anio} · {pago.concepto === 'cuota_mensual' ? 'Cuota Mensual' : pago.concepto}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-on-surface">${pago.monto?.toFixed(2)}</p>
                {isVencido && <p className="text-xs text-error font-semibold">Vencido</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
