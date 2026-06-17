import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getUserWithRole } from '../lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    let timeoutId
    let isMounted = true

    // Safety timeout: force loading=false after 3s if Supabase hangs
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('AuthContext: getSession() timed out, forcing loading=false')
        setLoading(false)
      }
    }, 3000)

    getUserWithRole().then((userWithRole) => {
      clearTimeout(timeoutId)
      if (isMounted) setUser(userWithRole)
    }).catch((err) => {
      console.error('getUserWithRole() failed:', err)
      clearTimeout(timeoutId)
    }).finally(() => {
      if (isMounted) setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
          queryClient.clear()
          setUser(null)
        } else if (session?.user) {
          const userWithRole = await getUserWithRole()
          setUser(userWithRole)
        } else {
          setUser(null)
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
      options
    })
    if (error) throw error
    return data
  }

  const logout = async () => {
    queryClient.clear()
    await supabase.auth.signOut()
    setUser(null)
  }

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      data: { requires_password_change: false }
    })
    if (error) throw error
    const userWithRole = await getUserWithRole()
    setUser(userWithRole)
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updatePassword,
      loading,
      isEstudiante: user?.role === 'estudiante',
      requiresPasswordChange: user?.requiresPasswordChange || false
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
