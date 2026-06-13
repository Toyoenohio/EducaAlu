import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useMisPagos() {
  const { user } = useAuth()

  const { data: pagos = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['mis-pagos', user?.alumno_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pagos')
        .select(`
          *,
          inscripcion:inscripcion_id(
            alumno_id,
            seccion:seccion_id(
              codigo,
              curso_sede:curso_sede_id(
                curso:curso_id(nombre)
              )
            )
          )
        `)
        .order('anio', { ascending: false })
        .order('mes', { ascending: false })
      if (error) throw error
      return (data || []).filter(p => p.inscripcion?.alumno_id === user.alumno_id)
    },
    enabled: !!user?.alumno_id,
  })

  const pendientes = useMemo(() => pagos.filter(p => !p.pagado), [pagos])
  const completados = useMemo(() => pagos.filter(p => p.pagado), [pagos])

  return { pagos, pendientes, completados, loading, error: error?.message || null, refetch }
}
