import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorCard({ message, onRetry }) {
  return (
    <div className="card p-6 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-error-container/30 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-7 h-7 text-error" />
      </div>
      <h3 className="font-montserrat font-bold text-on-surface mb-1">Algo salió mal</h3>
      <p className="text-sm text-on-surface-variant mb-4">
        {message || 'No pudimos cargar la información. Intenta de nuevo.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-outline !py-2 !px-4 !text-sm inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </button>
      )}
    </div>
  )
}
