import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useMiPerfil() {
  const { user } = useAuth()
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPerfil = async () => {
    if (!user?.alumno_id) return
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('alumnos')
      .select('*')
      .eq('id', user.alumno_id)
      .single()
    if (err) setError(err.message)
    else setPerfil(data)
    setLoading(false)
  }

  useEffect(() => { fetchPerfil() }, [user])

  return { perfil, loading, error, refetch: fetchPerfil }
}
