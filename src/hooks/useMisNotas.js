import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useMisNotas() {
  const { user } = useAuth()

  const { data: asistencia = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['mis-asistencia', user?.alumno_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('asistencia')
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
        .order('fecha', { ascending: false })
      if (error) throw error
      return (data || []).filter(a => a.inscripcion?.alumno_id === user.alumno_id)
    },
    enabled: !!user?.alumno_id,
  })

  const resumenPorCurso = useMemo(() => {
    return asistencia.reduce((acc, reg) => {
      const cursoNombre = reg.inscripcion?.seccion?.curso_sede?.curso?.nombre || 'Sin curso'
      if (!acc[cursoNombre]) {
        acc[cursoNombre] = { total: 0, presente: 0, ausente: 0, tardanza: 0, justificada: 0 }
      }
      acc[cursoNombre].total++
      if (reg.estado === 'presente') acc[cursoNombre].presente++
      else if (reg.estado === 'ausente') acc[cursoNombre].ausente++
      else if (reg.estado === 'tardanza') acc[cursoNombre].tardanza++
      else if (reg.estado === 'justificada') acc[cursoNombre].justificada++
      return acc
    }, {})
  }, [asistencia])

  return { asistencia, resumenPorCurso, loading, error: error?.message || null, refetch }
}
