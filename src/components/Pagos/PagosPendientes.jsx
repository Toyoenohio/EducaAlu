import { useState, useMemo } from 'react'
import { CreditCard, AlertTriangle, Clock, Calendar, DollarSign, X, Check } from 'lucide-react'

const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const CONCEPTO_LABELS = {
  inscripcion: 'Inscripción',
  cuota_semanal: 'Cuota Semanal',
  certificado_carnet: 'Certificado/Carnet',
}

export default function PagosPendientes({
  obligaciones = [],
  pendientes = [],
  vencidas = [],
  totalPendiente = 0,
  totalVencido = 0,
  registrarPago,
  isRegistering,
}) {
  const all = [...vencidas, ...pendientes]
  const [view, setView] = useState('list') // 'list' | 'pay'
  const [selectedIds, setSelectedIds] = useState([])
  const [form, setForm] = useState({ monto: '', metodo_pago: 'efectivo', referencia: '' })
  const [error, setError] = useState(null)

  // Calcular monto automáticamente al seleccionar
  const toggleObligacion = (id) => {
    setSelectedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      const total = next.reduce((sum, i) => {
        const o = all.find(x => x.id === i)
        return sum + (o ? Number(o.saldo_pendiente) : 0)
      }, 0)
      setForm(f => ({ ...f, monto: total.toFixed(2) }))
      return next
    })
  }

  const selectAll = () => {
    const ids = all.map(o => o.id)
    setSelectedIds(ids)
    const total = all.reduce((s, o) => s + Number(o.saldo_pendiente), 0)
    setForm(f => ({ ...f, monto: total.toFixed(2) }))
  }

  const deselectAll = () => {
    setSelectedIds([])
    setForm(f => ({ ...f, monto: '' }))
  }

  // Agrupar por curso
  const grouped = useMemo(() => {
    const map = {}
    for (const o of all) {
      const key = o.inscripcion_id
      if (!map[key]) {
        const sec = o.inscripcion?.seccion
        map[key] = {
          inscripcion_id: key,
          curso: sec?.curso_sede?.curso?.nombre || 'Curso',
          seccion: sec?.codigo || '',
          obligaciones: [],
        }
      }
      map[key].obligaciones.push(o)
    }
    return Object.values(map)
  }, [all])

  // ── Enviar pago ──
  const handlePago = async () => {
    if (selectedIds.length === 0 || !form.monto || parseFloat(form.monto) <= 0) return
    setError(null)
    try {
      // Todas las obligaciones seleccionadas son de la misma inscripción?
      // La Edge Function espera un solo inscripcion_id
      const firstId = all.find(o => o.id === selectedIds[0])?.inscripcion_id
      await registrarPago({
        inscripcion_id: firstId,
        monto: parseFloat(form.monto),
        metodo_pago: form.metodo_pago,
        referencia: form.referencia || null,
        obligacion_ids: selectedIds,
      })
      // Reset
      setSelectedIds([])
      setForm({ monto: '', metodo_pago: 'efectivo', referencia: '' })
      setView('list')
    } catch (err) {
      setError(err?.message || 'Error al registrar el pago')
    }
  }

  // ── LISTA ──
  if (view === 'list') {
    if (all.length === 0) {
      return (
        <div className="text-center py-12 text-on-surface-variant/50">
          <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">¡Estás al día!</p>
          <p className="text-xs mt-1">No tienes pagos pendientes</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {/* Resumen */}
        <div className="bg-gradient-to-r from-tertiary to-tertiary-container rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-tertiary/70 text-sm font-medium">Total Pendiente</p>
              <p className="text-on-tertiary text-3xl font-montserrat font-bold mt-1">
                ${(totalPendiente + totalVencido).toFixed(2)}
              </p>
            </div>
            <button onClick={() => setView('pay')}
              className="bg-white/20 hover:bg-white/30 text-on-tertiary px-5 py-3 rounded-xl
                font-bold text-sm flex items-center gap-2 transition-colors">
              <DollarSign className="w-4 h-4" />
              Pagar
            </button>
          </div>
          {vencidas.length > 0 && (
            <p className="text-on-tertiary/70 text-xs mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {vencidas.length} pago{vencidas.length > 1 ? 's' : ''} vencido{vencidas.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Obligaciones por curso */}
        {grouped.map((grupo, gi) => (
          <div key={grupo.inscripcion_id} className="card overflow-hidden">
            <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant/10">
              <p className="font-bold text-on-surface text-sm">{grupo.curso}</p>
              {grupo.seccion && (
                <p className="text-xs text-on-surface-variant">Sección {grupo.seccion}</p>
              )}
            </div>
            <div className="divide-y divide-outline-variant/5">
              {grupo.obligaciones.map((o, idx) => {
                const isVencido = o.estado === 'vencido'
                return (
                  <div key={o.id}
                    className="flex items-center gap-3 p-3 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${(gi * 3 + idx) * 0.04}s` }}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      ${isVencido ? 'bg-error/10' : 'bg-tertiary-fixed/30'}`}>
                      {isVencido
                        ? <AlertTriangle className="w-4 h-4 text-error" />
                        : <Clock className="w-4 h-4 text-tertiary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface">
                        {CONCEPTO_LABELS[o.concepto] || o.concepto}
                        {o.numero_semana && (
                          <span className="text-xs text-on-surface-variant ml-1">Sem. {o.numero_semana}</span>
                        )}
                      </p>
                      {o.fecha_vencimiento && (
                        <p className={`text-xs flex items-center gap-1 ${isVencido ? 'text-error' : 'text-on-surface-variant/50'}`}>
                          <Calendar className="w-3 h-3" />
                          Vence: {new Date(o.fecha_vencimiento).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-on-surface">${Number(o.saldo_pendiente).toFixed(2)}</p>
                      {Number(o.total_abonado) > 0 && (
                        <p className="text-[10px] text-on-surface-variant">
                          Abonado: ${Number(o.total_abonado).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── VIEW: PAGAR ──
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => { setView('list'); setSelectedIds([]); setError(null) }}
          className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant">
          <X className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-on-surface">Registrar Pago</h2>
          <p className="text-sm text-on-surface-variant">
            Selecciona las obligaciones que deseas pagar
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-container/50 border border-error/20 rounded-xl">
          <p className="text-sm text-on-error-container flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />{error}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de obligaciones */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button onClick={selectAll}
              className="text-xs text-primary font-bold hover:underline">Seleccionar todas</button>
            {selectedIds.length > 0 && (
              <button onClick={deselectAll}
                className="text-xs text-on-surface-variant hover:underline">Deseleccionar</button>
            )}
          </div>

          {grouped.map((grupo, gi) => (
            <div key={grupo.inscripcion_id} className="card overflow-hidden">
              <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant/10">
                <p className="font-bold text-on-surface text-sm">{grupo.curso}</p>
              </div>
              <div className="divide-y divide-outline-variant/5">
                {grupo.obligaciones.map(o => {
                  const isSelected = selectedIds.includes(o.id)
                  const isVencido = o.estado === 'vencido'
                  return (
                    <label key={o.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors
                        ${isSelected ? 'bg-primary/5' : 'hover:bg-surface-container-low/50'}`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                        ${isSelected ? 'bg-primary border-primary' : 'border-outline-variant'}`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-on-surface">
                          {CONCEPTO_LABELS[o.concepto] || o.concepto}
                          {o.numero_semana && (
                            <span className="text-xs text-on-surface-variant ml-1">Sem. {o.numero_semana}</span>
                          )}
                        </p>
                        <p className={`text-xs ${isVencido ? 'text-error' : 'text-on-surface-variant/50'}`}>
                          {isVencido && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                          {o.fecha_vencimiento
                            ? `Vence: ${new Date(o.fecha_vencimiento).toLocaleDateString('es-ES')}`
                            : 'Sin vencimiento'}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-on-surface">${Number(o.saldo_pendiente).toFixed(2)}</p>
                        {Number(o.total_abonado) > 0 && (
                          <p className="text-[10px] text-on-surface-variant">
                            Abonado: ${Number(o.total_abonado).toFixed(2)}
                          </p>
                        )}
                      </div>
                      <input type="checkbox" checked={isSelected}
                        onChange={() => toggleObligacion(o.id)}
                        className="sr-only" />
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Formulario de pago */}
        <div className="card p-6 h-fit sticky top-4 space-y-4">
          <h2 className="font-bold text-on-surface">Detalles del Pago</h2>

          <div className="bg-surface-container-lowest rounded-xl p-4 border border-surface-variant/20">
            <p className="text-xs text-on-surface-variant">Obligaciones seleccionadas</p>
            <p className="text-2xl font-bold text-primary">{selectedIds.length}</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-1">
              Monto a Pagar ($)
            </label>
            <input type="number" step="0.01"
              className="input-field text-lg font-bold"
              value={form.monto}
              onChange={e => setForm({ ...form, monto: e.target.value })}
              placeholder="0.00" />
            <p className="text-[10px] text-on-surface-variant mt-1">
              Puedes ajustarlo para pagos parciales
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-1">
              Método de Pago
            </label>
            <select className="input-field"
              value={form.metodo_pago}
              onChange={e => setForm({ ...form, metodo_pago: e.target.value })}>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="zelle">Zelle</option>
              <option value="pago_movil">Pago Móvil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-1">
              Referencia (opcional)
            </label>
            <input className="input-field"
              value={form.referencia}
              onChange={e => setForm({ ...form, referencia: e.target.value })}
              placeholder="REF-123456" />
          </div>

          <div className="flex gap-3 pt-4 border-t border-surface-variant/20">
            <button onClick={() => { setView('list'); setSelectedIds([]); setError(null) }}
              className="btn-ghost flex-1">
              Cancelar
            </button>
            <button onClick={handlePago}
              disabled={isRegistering || selectedIds.length === 0 || !form.monto || parseFloat(form.monto) <= 0}
              className="btn-primary flex-1 disabled:opacity-50">
              {isRegistering ? 'Procesando...' : 'Confirmar Pago'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
