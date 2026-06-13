import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useMisCursos() {
  const { user } = useAuth()

  const { data: cursos = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['mis-cursos', user?.alumno_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inscripciones')
        .select(`
          *,
          seccion:seccion_id(
            id, codigo, dias, horario_inicio, horario_fin, profesor, tipo,
            curso_sede:curso_sede_id(
              curso:curso_id(nombre, descripcion),
              sede:sede_id(nombre)
            )
          )
        `)
        .eq('alumno_id', user.alumno_id)
      if (error) throw error
      return data || []
    },
    enabled: !!user?.alumno_id,
  })

  const activos = useMemo(() => cursos.filter(c => c.estado === 'activa'), [cursos])
  const historial = useMemo(() => cursos.filter(c => c.estado !== 'activa'), [cursos])

  return { cursos, activos, historial, loading, error: error?.message || null, refetch }
}
