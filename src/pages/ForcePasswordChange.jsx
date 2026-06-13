import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ShieldCheck, Lock, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react'

export default function ForcePasswordChange() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validatePassword = () => {
    if (newPassword.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres'
    }
    if (newPassword !== confirmPassword) {
      return 'Las contraseñas no coinciden'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const validationError = validatePassword()
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    try {
      await updatePassword(newPassword)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Error al actualizar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  const getStrength = () => {
    if (!newPassword) return { level: 0, label: '', color: '' }
    let score = 0
    if (newPassword.length >= 8) score++
    if (newPassword.length >= 12) score++
    if (/[A-Z]/.test(newPassword)) score++
    if (/[0-9]/.test(newPassword)) score++
    if (/[^A-Za-z0-9]/.test(newPassword)) score++
    if (score <= 2) return { level: score, label: 'Débil', color: 'bg-error' }
    if (score <= 3) return { level: score, label: 'Media', color: 'bg-tertiary' }
    return { level: score, label: 'Fuerte', color: 'bg-secondary' }
  }

  const strength = getStrength()

  return (
    <div className="min-h-screen flex items-center justify-center p-4
      bg-gradient-to-br from-primary via-primary-container to-[#1a1a6e]
      relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[20%] w-[600px] h-[600px] rounded-full bg-secondary-fixed/5 blur-3xl" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary-fixed/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 p-8 sm:p-10">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-tertiary to-tertiary-container
              rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-tertiary/30">
              <ShieldCheck className="w-8 h-8 text-on-tertiary" />
            </div>
            <h1 className="font-montserrat font-bold text-xl text-on-surface text-center">
              Cambio de Contraseña Requerido
            </h1>
            <p className="text-on-surface-variant text-sm mt-2 text-center">
              Por seguridad, debes establecer una nueva contraseña antes de continuar.
            </p>
          </div>

          <div className="mb-6 p-3 bg-tertiary-fixed/20 border border-tertiary/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-on-tertiary-fixed-variant">
              Tu contraseña actual es temporal. Elige una contraseña segura de al menos 8 caracteres.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-error-container/50 border border-error/20 rounded-xl animate-fade-in">
              <p className="text-sm text-on-error-container font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="new-password" className="block text-sm font-semibold text-on-surface mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
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
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        i <= strength.level ? strength.color : 'bg-surface-container-high'
                      }`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    strength.level <= 2 ? 'text-error' : strength.level <= 3 ? 'text-tertiary' : 'text-secondary'
                  }`}>
                    Seguridad: {strength.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-semibold text-on-surface mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                  minLength={8}
                  className="input-field !pl-11"
                />
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-error mt-1.5 font-medium">Las contraseñas no coinciden</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}
              className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 !rounded-xl
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Establecer Nueva Contraseña
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-on-primary/30 mt-6">
          © {new Date().getFullYear()} EDUCA — Sistema de Gestión Educativa
        </p>
      </div>
    </div>
  )
}
