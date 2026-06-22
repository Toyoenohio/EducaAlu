import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useMisPagos() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const alumnoId = user?.alumno_id

  // ── OBLIGACIONES pendientes del alumno ──
  const {
    data: obligaciones = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['mis-obligaciones', alumnoId],
    queryFn: async () => {
      // 1) Obtener todas las inscripciones activas del alumno
      const { data: inscripciones, error: inscError } = await supabase
        .from('inscripciones')
        .select('id')
        .eq('alumno_id', alumnoId)
        .in('estado', ['activa', 'en_curso'])

      if (inscError) throw inscError
      if (!inscripciones?.length) return []

      const inscripcionIds = inscripciones.map(i => i.id)

      // 2) Obtener obligaciones de esas inscripciones (pendientes + vencidas)
      const { data, error } = await supabase
        .from('obligaciones_con_estado')
        .select(`
          *,
          inscripcion:inscripcion_id(
            id,
            estado,
            seccion:seccion_id(
              id, codigo,
              curso_sede:curso_sede_id(
                curso:cursos(id, nombre)
              )
            )
          )
        `)
        .in('inscripcion_id', inscripcionIds)
        .in('estado', ['pendiente', 'vencido'])
        .order('fecha_vencimiento', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: !!alumnoId,
  })

  const pendientes = useMemo(
    () => obligaciones.filter(o => o.estado === 'pendiente'),
    [obligaciones]
  )
  const vencidas = useMemo(
    () => obligaciones.filter(o => o.estado === 'vencido'),
    [obligaciones]
  )

  const totalPendiente = useMemo(
    () => pendientes.reduce((s, o) => s + Number(o.saldo_pendiente), 0),
    [pendientes]
  )
  const totalVencido = useMemo(
    () => vencidas.reduce((s, o) => s + Number(o.saldo_pendiente), 0),
    [vencidas]
  )

  // ── PAGOS completados (historial) ──
  const {
    data: pagos = [],
    isLoading: loadingHistorial,
    error: histError,
    refetch: refetchHistorial,
  } = useQuery({
    queryKey: ['mis-pagos-historial', alumnoId],
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
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []).filter(p => p.inscripcion?.alumno_id === alumnoId)
    },
    enabled: !!alumnoId,
  })

  const completados = useMemo(
    () => pagos.filter(p => p.pagado),
    [pagos]
  )

  // ── SOLICITAR CARNET ──
  const solicitarCarnetMutation = useMutation({
    mutationFn: async () => {
      // Buscar la inscripción activa más reciente del alumno
      const { data: inscripciones, error: inscError } = await supabase
        .from('inscripciones')
        .select('id')
        .eq('alumno_id', alumnoId)
        .in('estado', ['activa', 'en_curso'])
        .order('created_at', { ascending: false })
        .limit(1)

      if (inscError) throw inscError
      if (!inscripciones?.length) throw new Error('No tienes una inscripción activa para solicitar el carnet')

      const inscripcionId = inscripciones[0].id

      // Llamar a la Edge Function
      const { data, error } = await supabase.functions.invoke('agregar-obligacion', {
        body: { inscripcion_id: inscripcionId, concepto: 'certificado_carnet' },
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mis-obligaciones'] })
    },
  })

  // Verificar si ya tiene un carnet solicitado
  const tieneCarnetPendiente = useMemo(
    () => obligaciones.some(o => o.concepto === 'certificado_carnet'),
    [obligaciones]
  )
  const registrarPagoMutation = useMutation({
    mutationFn: async ({ inscripcion_id, monto, metodo_pago, referencia, obligacion_ids }) => {
      const { data, error } = await supabase.functions.invoke('registrar-pago', {
        body: { inscripcion_id, monto, metodo_pago, referencia, obligacion_ids },
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mis-obligaciones'] })
      queryClient.invalidateQueries({ queryKey: ['mis-pagos-historial'] })
    },
  })

  return {
    obligaciones,
    pendientes,
    vencidas,
    completados,
    totalPendiente,
    totalVencido,
    loading,
    loadingHistorial,
    error: error?.message || histError?.message || null,
    refetch,
    registrarPago: registrarPagoMutation.mutateAsync,
    isRegistering: registrarPagoMutation.isPending,
    solicitarCarnet: solicitarCarnetMutation.mutateAsync,
    isRequestingCarnet: solicitarCarnetMutation.isPending,
    tieneCarnetPendiente,
  }
}
