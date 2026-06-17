import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const STORAGE_KEY = 'educa-alu-auth'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storageKey: STORAGE_KEY,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // email/password auth, no OAuth URL tokens
  },
})

// Verifica sincrónicamente si hay sesión — no depende de Supabase
export function hasLocalSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return !!(parsed.access_token && parsed.expires_at > Math.floor(Date.now() / 1000))
  } catch {
    return false
  }
}

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
    requiresPasswordChange: user.user_metadata?.requires_password_change || false,
  }
}
