import { useState } from 'react'
import { useMisPagos } from '../hooks/useMisPagos'
import PagosPendientes from '../components/Pagos/PagosPendientes'
import HistorialPagos from '../components/Pagos/HistorialPagos'
import { CreditCard, Clock, CheckCircle, Loader2, Award, AlertCircle, X } from 'lucide-react'

const tabs = [
  { key: 'pendientes', label: 'Pendientes', icon: Clock },
  { key: 'historial', label: 'Historial', icon: CheckCircle },
]

export default function MisPagos() {
  const {
    obligaciones,
    pendientes,
    vencidas,
    completados,
    totalPendiente,
    totalVencido,
    loading,
    error,
    registrarPago,
    isRegistering,
    solicitarCarnet,
    isRequestingCarnet,
    tieneCarnetPendiente,
  } = useMisPagos()

  const [activeTab, setActiveTab] = useState('pendientes')
  const [toastMsg, setToastMsg] = useState(null) // { type: 'success'|'error', text }

  const countPendientes = pendientes.length + vencidas.length

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-primary" />
          <div>
            <h1 className="page-title">Mis Pagos</h1>
            <p className="text-on-surface-variant text-sm mt-0.5">
              Revisa y paga tus obligaciones pendientes
            </p>
          </div>
        </div>
      </div>

      {/* Carnet Section */}
      {!loading && (
        <div className={`card p-5 animate-fade-in ${tieneCarnetPendiente ? 'bg-primary-fixed/10 border-primary/20' : ''}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                tieneCarnetPendiente ? 'bg-primary/10' : 'bg-surface-container-high'
              }`}>
                <Award className={`w-5 h-5 ${tieneCarnetPendiente ? 'text-primary' : 'text-on-surface-variant'}`} />
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-sm">Carnet Estudiantil</h3>
                {tieneCarnetPendiente ? (
                  <p className="text-xs text-primary">Ya tienes un carnet solicitado — pendiente de pago</p>
                ) : (
                  <p className="text-xs text-on-surface-variant">Solicita tu carnet físico. Se genera una obligación de $15 USD</p>
                )}
              </div>
            </div>
            {tieneCarnetPendiente ? (
              <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Pendiente
              </span>
            ) : (
              <button
                onClick={async () => {
                  try {
                    await solicitarCarnet()
                    setToastMsg({ type: 'success', text: '✅ Carnet solicitado — se ha creado la obligación de pago' })
                  } catch (err) {
                    setToastMsg({ type: 'error', text: '❌ ' + (err?.message || 'Error al solicitar el carnet') })
                  }
                }}
                disabled={isRequestingCarnet}
                className="btn-secondary !py-2 !px-4 !text-xs flex items-center gap-1.5"
              >
                {isRequestingCarnet ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Solicitando...</>
                ) : (
                  <>Solicitar Carnet</>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container-high rounded-xl p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          const count = tab.key === 'pendientes' ? countPendientes : completados.length

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg
                font-montserrat text-sm font-semibold whitespace-nowrap
                transition-all duration-200 flex-1 justify-center
                ${isActive
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {!loading && count > 0 && (
                <span className={`
                  min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center
                  ${isActive
                    ? tab.key === 'pendientes' ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
                    : 'bg-outline-variant/20 text-on-surface-variant'
                  }
                `}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {error && (
        <div className="p-4 bg-error-container/50 border border-error/20 rounded-xl animate-fade-in">
          <p className="text-sm text-on-error-container">{error}</p>
        </div>
      )}

      {toastMsg && (
        <div className={`p-4 rounded-xl animate-fade-in flex items-center justify-between ${
          toastMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-error-container/50 border border-error/20'
        }`}>
          <p className="text-sm font-medium">{toastMsg.text}</p>
          <button onClick={() => setToastMsg(null)} className="text-on-surface-variant hover:text-on-surface"><X className="w-4 h-4" /></button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : (
        <div className="animate-fade-in">
          {activeTab === 'pendientes' && (
            <PagosPendientes
              obligaciones={obligaciones}
              pendientes={pendientes}
              vencidas={vencidas}
              totalPendiente={totalPendiente}
              totalVencido={totalVencido}
              registrarPago={registrarPago}
              isRegistering={isRegistering}
            />
          )}
          {activeTab === 'historial' && (
            <div className="card overflow-hidden">
              <HistorialPagos pagos={completados} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
