import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useMiPerfil() {
  const { user } = useAuth()

  const { data: perfil = null, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['mi-perfil', user?.alumno_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alumnos')
        .select('*')
        .eq('id', user.alumno_id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!user?.alumno_id,
  })

  return { perfil, loading, error: error?.message || null, refetch }
}
