import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useMisNotas() {
  const { user } = useAuth()
  const [asistencia, setAsistencia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAsistencia = async () => {
    if (!user?.alumno_id) return
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
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
    if (err) setError(err.message)
    else {
      const misRegistros = (data || []).filter(a => a.inscripcion?.alumno_id === user.alumno_id)
      setAsistencia(misRegistros)
    }
    setLoading(false)
  }

  // Calcular resumen por curso
  const resumenPorCurso = asistencia.reduce((acc, reg) => {
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

  useEffect(() => { fetchAsistencia() }, [user])

  return { asistencia, resumenPorCurso, loading, error, refetch: fetchAsistencia }
}
