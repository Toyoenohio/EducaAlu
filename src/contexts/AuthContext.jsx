import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getUserWithRole, hasLocalSession } from '../lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    let isMounted = true
    let timeoutId = null

    async function restoreSession() {
      try {
        const userWithRole = await getUserWithRole()
        if (!isMounted) return

        if (userWithRole) {
          setUser(userWithRole)
          setAuthError(null)
        } else if (hasLocalSession()) {
          console.warn('AuthContext: localStorage session invalid, clearing')
          localStorage.removeItem('educa-alu-auth')
        }
      } catch (err) {
        console.error('AuthContext: session restoration failed:', err)
        if (isMounted && hasLocalSession()) {
          setAuthError('No se pudo verificar la sesión. Verificá tu conexión.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    // Si hay sesión local: sin timeout (confiamos en que getSession() resolverá)
    // Si no hay sesión: 8s safety net
    if (hasLocalSession()) {
      restoreSession()
    } else {
      timeoutId = setTimeout(() => {
        if (isMounted) {
          console.warn('AuthContext: no local session, giving up after 8s')
          setLoading(false)
        }
      }, 8000)
      restoreSession().finally(() => clearTimeout(timeoutId))
    }

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
          queryClient.clear()
          setUser(null)
          setAuthError(null)
        } else if (session?.user) {
          try {
            const userWithRole = await getUserWithRole()
            if (isMounted) {
              setUser(userWithRole)
              setAuthError(null)
            }
          } catch (err) {
            console.error('AuthContext: error updating role:', err)
          }
        } else {
          setUser(null)
          setAuthError(null)
        }
      }
    )

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      listener.subscription.unsubscribe()
    }
  }, [queryClient])

  const login = async (email, password, captchaToken = null) => {
    const options = captchaToken ? { captchaToken } : {}
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options,
    })
    if (error) throw error
    setAuthError(null)
    return data
  }

  const logout = async () => {
    queryClient.clear()
    await supabase.auth.signOut()
    setUser(null)
    setAuthError(null)
  }

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      data: { requires_password_change: false },
    })
    if (error) throw error
    const userWithRole = await getUserWithRole()
    setUser(userWithRole)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updatePassword,
        loading,
        authError,
        isEstudiante: user?.role === 'estudiante',
        requiresPasswordChange: user?.requiresPasswordChange || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
