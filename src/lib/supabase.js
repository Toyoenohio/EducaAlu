import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper: obtener usuario con metadata (rol, sede_id)
export const getUserWithRole = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  return {
    ...user,
    role: user.user_metadata?.role || 'estudiante',
    sede_id: user.user_metadata?.sede_id || null,
    alumno_id: user.user_metadata?.alumno_id || null
  }
}
