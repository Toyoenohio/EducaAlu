import { useMiPerfil } from '../hooks/useMiPerfil'
import PerfilCard from '../components/Perfil/PerfilCard'

export default function MiPerfil() {
  const { perfil, loading, error } = useMiPerfil()

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="animate-fade-in">
        <h1 className="page-title">Mi Perfil</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Tu información personal registrada en el sistema
        </p>
      </div>

      {error && (
        <div className="p-4 bg-error-container/50 border border-error/20 rounded-xl animate-fade-in">
          <p className="text-sm text-on-error-container">{error}</p>
        </div>
      )}

      <PerfilCard perfil={perfil} loading={loading} />
    </div>
  )
}
