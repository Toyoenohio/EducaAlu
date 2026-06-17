import { useState } from 'react'
import { useMisPagos } from '../hooks/useMisPagos'
import PagosPendientes from '../components/Pagos/PagosPendientes'
import HistorialPagos from '../components/Pagos/HistorialPagos'
import { CreditCard, Clock, CheckCircle, Loader2 } from 'lucide-react'

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
  } = useMisPagos()

  const [activeTab, setActiveTab] = useState('pendientes')

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
