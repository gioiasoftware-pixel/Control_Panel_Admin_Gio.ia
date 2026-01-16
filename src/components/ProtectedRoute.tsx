import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, hasHydrated } = useAuthStore()

  if (!hasHydrated) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
