import { useMiPerfil } from '../hooks/useMiPerfil'
import PerfilCard from '../components/Perfil/PerfilCard'
import ErrorCard from '../components/ui/ErrorCard'
import { SkeletonProfile } from '../components/ui/Skeleton'

export default function MiPerfil() {
  const { perfil, loading, error, refetch } = useMiPerfil()

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="animate-fade-in">
        <h1 className="page-title">Mi Perfil</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Tu información personal registrada en el sistema
        </p>
      </div>

      {error ? (
        <ErrorCard message={error} onRetry={refetch} />
      ) : loading ? (
        <SkeletonProfile />
      ) : (
        <PerfilCard perfil={perfil} loading={false} />
      )}
    </div>
  )
}
