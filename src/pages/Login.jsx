import { useState, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

export default function Login() {
  const { user, login, loading: authLoading, requiresPasswordChange } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState(null)
  const turnstileRef = useRef(null)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-container to-primary">
        <Loader2 className="w-8 h-8 text-on-primary animate-spin" />
      </div>
    )
  }

  if (user && requiresPasswordChange) {
    return <Navigate to="/force-password-change" replace />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setError('Por favor, completa la verificación de seguridad.')
      return
    }

    setLoading(true)
    try {
      const data = await login(email, password, captchaToken)
      if (data?.user?.user_metadata?.requires_password_change) {
        navigate('/force-password-change', { replace: true })
      }
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Credenciales incorrectas. Verifica tu email y contraseña.'
          : err.message || 'Error al iniciar sesión'
      )
      setCaptchaToken(null)
      turnstileRef.current?.reset()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4
      bg-gradient-to-br from-primary via-primary-container to-[#1a1a6e]
      relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[20%] w-[600px] h-[600px] rounded-full bg-secondary-fixed/5 blur-3xl" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary-fixed/10 blur-3xl" />
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-tertiary-fixed/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container
              rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
              <GraduationCap className="w-8 h-8 text-on-primary" />
            </div>
            <h1 className="font-montserrat font-bold text-2xl text-on-surface">EDUCA</h1>
            <p className="text-on-surface-variant text-sm mt-1">Portal Estudiantil</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-container/50 border border-error/20 rounded-xl animate-fade-in">
              <p className="text-sm text-on-error-container font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-on-surface mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="input-field !pl-11"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-on-surface mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field !pl-11 !pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50
                    hover:text-on-surface-variant transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {TURNSTILE_SITE_KEY && (
              <div className="flex justify-center">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={setCaptchaToken}
                  onError={() => setCaptchaToken(null)}
                  onExpire={() => setCaptchaToken(null)}
                  options={{ theme: 'light', size: 'normal' }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (TURNSTILE_SITE_KEY && !captchaToken)}
              className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 !rounded-xl
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-on-surface-variant/50 mt-6">
            ¿Problemas para acceder? Contacta a tu administrador.
          </p>
        </div>

        <p className="text-center text-xs text-on-primary/30 mt-6">
          © {new Date().getFullYear()} EDUCA — Sistema de Gestión Educativa
        </p>
      </div>
    </div>
  )
}
