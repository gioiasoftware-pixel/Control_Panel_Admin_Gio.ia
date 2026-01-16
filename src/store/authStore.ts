import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { apiClient } from '../services/api'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  adminEmail: string | null
  hasHydrated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      adminEmail: null,
      hasHydrated: false,
      login: async (email: string, password: string) => {
        // In produzione, usa solo API reale
        if (import.meta.env.PROD) {
          const response = await apiClient.login(email, password)
          const token = response.access_token || response.token
          
          if (!token) {
            throw new Error('Token non ricevuto dal server')
          }
          
          localStorage.setItem('auth_token', token)
          set({
            token,
            isAuthenticated: true,
            adminEmail: email,
          })
          return
        }
        
        // Solo in sviluppo: fallback mock
        try {
          const response = await apiClient.login(email, password)
          const token = response.access_token || response.token
          
          if (token) {
            localStorage.setItem('auth_token', token)
            set({
              token,
              isAuthenticated: true,
              adminEmail: email,
            })
            return
          }
        } catch (apiError: any) {
          // Fallback mock solo in sviluppo
          const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'gio.ia.software@gmail.com'
          const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Lagioiadilavorare2025'
          
          if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const mockToken = 'mock-jwt-token-' + Date.now()
            localStorage.setItem('auth_token', mockToken)
            
            set({
              token: mockToken,
              isAuthenticated: true,
              adminEmail: email,
            })
            return
          }
          
          throw apiError
        }
      },
      logout: () => {
        localStorage.removeItem('auth_token')
        set({
          token: null,
          isAuthenticated: false,
          adminEmail: null,
        })
      },
      setToken: (token: string) => {
        localStorage.setItem('auth_token', token)
        set({
          token,
          isAuthenticated: true,
          adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'gio.ia.software@gmail.com',
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => () => {
        set({ hasHydrated: true })
      },
    }
  )
)
