import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import { Loader2 } from 'lucide-react'

const Login = lazy(() => import('./pages/Login'))
const ForcePasswordChange = lazy(() => import('./pages/ForcePasswordChange'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const MiPerfil = lazy(() => import('./pages/MiPerfil'))
const MisCursos = lazy(() => import('./pages/MisCursos'))
const MisPagos = lazy(() => import('./pages/MisPagos'))
const MisNotas = lazy(() => import('./pages/MisNotas'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
        <p className="text-sm text-on-surface-variant font-medium">Cargando...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading, requiresPasswordChange } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-on-surface-variant font-medium">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (requiresPasswordChange) return <Navigate to="/force-password-change" replace />
  return children
}

function PasswordChangeRoute({ children }) {
  const { user, loading, requiresPasswordChange } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (!requiresPasswordChange) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/force-password-change"
          element={
            <PasswordChangeRoute>
              <ForcePasswordChange />
            </PasswordChangeRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="perfil" element={<Suspense fallback={<PageLoader />}><MiPerfil /></Suspense>} />
          <Route path="cursos" element={<Suspense fallback={<PageLoader />}><MisCursos /></Suspense>} />
          <Route path="pagos" element={<Suspense fallback={<PageLoader />}><MisPagos /></Suspense>} />
          <Route path="notas" element={<Suspense fallback={<PageLoader />}><MisNotas /></Suspense>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
