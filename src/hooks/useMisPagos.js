import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useMisPagos() {
  const { user } = useAuth()
  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPagos = async () => {
    if (!user?.alumno_id) return
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
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
    if (err) setError(err.message)
    else {
      const misPagos = (data || []).filter(p => p.inscripcion?.alumno_id === user.alumno_id)
      setPagos(misPagos)
    }
    setLoading(false)
  }

  const pendientes = pagos.filter(p => !p.pagado)
  const completados = pagos.filter(p => p.pagado)

  useEffect(() => { fetchPagos() }, [user])

  return { pagos, pendientes, completados, loading, error, refetch: fetchPagos }
}
