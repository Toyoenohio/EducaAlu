import { useAuth } from '../contexts/AuthContext'
import { useMisCursos } from '../hooks/useMisCursos'
import { useMisPagos } from '../hooks/useMisPagos'
import { useMisNotas } from '../hooks/useMisNotas'
import { useMiPerfil } from '../hooks/useMiPerfil'
import StatsCards from '../components/Dashboard/StatsCards'
import ProximosPagos from '../components/Dashboard/ProximosPagos'
import HorarioHoy from '../components/Dashboard/HorarioHoy'
import { SkeletonStats, SkeletonCard } from '../components/ui/Skeleton'
import ErrorCard from '../components/ui/ErrorCard'
import { Sparkles } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const { perfil } = useMiPerfil()
  const { activos, historial, loading: cursosLoading, error: cursosError, refetch: refetchCursos } = useMisCursos()
  const { pendientes, loading: pagosLoading, error: pagosError, refetch: refetchPagos } = useMisPagos()
  const { resumenPorCurso, loading: notasLoading } = useMisNotas()

  const isLoading = cursosLoading || pagosLoading || notasLoading
  const hasError = cursosError || pagosError

  const totalAsistencia = Object.values(resumenPorCurso).reduce(
    (acc, r) => ({ total: acc.total + r.total, presente: acc.presente + r.presente + r.tardanza }),
    { total: 0, presente: 0 }
  )
  const porcentajeAsistencia = totalAsistencia.total > 0
    ? Math.round((totalAsistencia.presente / totalAsistencia.total) * 100)
    : 0

  const stats = {
    cursos: activos.length,
    pendientes: pendientes.length,
    asistencia: porcentajeAsistencia,
    completados: historial.filter(h => h.estado === 'completada').length,
  }

  const nombre = perfil?.nombre || user?.user_metadata?.nombre || 'Estudiante'

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-tertiary" />
          <span className="text-sm text-on-surface-variant font-medium">{getGreeting()}</span>
        </div>
        <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-on-surface">
          ¡Hola, {nombre}! 👋
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Aquí tienes un resumen de tu actividad académica
        </p>
      </div>

      {hasError ? (
        <ErrorCard
          message={cursosError || pagosError}
          onRetry={() => { refetchCursos(); refetchPagos(); }}
        />
      ) : isLoading ? (
        <>
          <SkeletonStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </>
      ) : (
        <>
          <StatsCards stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <HorarioHoy cursos={activos} />
            <ProximosPagos pagos={pendientes} />
          </div>
        </>
      )}
    </div>
  )
}
