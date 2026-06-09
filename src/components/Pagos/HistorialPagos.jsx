import { CheckCircle, Receipt } from 'lucide-react'

const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const metodoLabels = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  tarjeta: 'Tarjeta',
  deposito: 'Depósito',
}

export default function HistorialPagos({ pagos = [] }) {
  if (pagos.length === 0) {
    return (
      <div className="text-center py-12 text-on-surface-variant/50">
        <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No hay pagos registrados</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-outline-variant/20">
            <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider">Curso</th>
            <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider">Período</th>
            <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Concepto</th>
            <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Método</th>
            <th className="text-right py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider">Monto</th>
            <th className="text-left py-3 px-4 text-xs font-jakarta font-bold text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago, idx) => {
            const cursoNombre = pago.inscripcion?.seccion?.curso_sede?.curso?.nombre || 'Curso'
            return (
              <tr
                key={pago.id || idx}
                className="border-b border-outline-variant/10 hover:bg-surface-container-low/50
                  transition-colors opacity-0 animate-fade-in"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="text-sm font-semibold text-on-surface">{cursoNombre}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-on-surface-variant">
                  {meses[pago.mes]} {pago.anio}
                </td>
                <td className="py-3 px-4 text-sm text-on-surface-variant hidden sm:table-cell">
                  {pago.concepto === 'cuota_mensual' ? 'Cuota Mensual' : pago.concepto || '—'}
                </td>
                <td className="py-3 px-4 text-sm text-on-surface-variant hidden md:table-cell">
                  {metodoLabels[pago.metodo_pago] || pago.metodo_pago || '—'}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-bold text-on-surface">${pago.monto?.toFixed(2)}</span>
                </td>
                <td className="py-3 px-4 text-sm text-on-surface-variant hidden lg:table-cell">
                  {pago.fecha_pago ? new Date(pago.fecha_pago).toLocaleDateString('es-ES') : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
