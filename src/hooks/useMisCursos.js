import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useMisCursos() {
  const { user } = useAuth()
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCursos = async () => {
    if (!user?.alumno_id) return
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
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
    if (err) setError(err.message)
    else setCursos(data || [])
    setLoading(false)
  }

  const activos = cursos.filter(c => c.estado === 'activa')
  const historial = cursos.filter(c => c.estado !== 'activa')

  useEffect(() => { fetchCursos() }, [user])

  return { cursos, activos, historial, loading, error, refetch: fetchCursos }
}
