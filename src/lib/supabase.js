import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: window.sessionStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper: obtener usuario con metadata (rol, sede_id)
export const getUserWithRole = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  if (!user) return null

  return {
    ...user,
    role: user.user_metadata?.role || 'estudiante',
    sede_id: user.user_metadata?.sede_id || null,
    alumno_id: user.user_metadata?.alumno_id || null,
    requiresPasswordChange: user.user_metadata?.requires_password_change || false
  }
}
