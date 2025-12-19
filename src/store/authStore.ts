import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { apiClient } from '../services/api'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  adminEmail: string | null
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
      login: async (email: string, password: string) => {
        try {
          // Try API login first
          const response = await apiClient.login(email, password)
          const token = response.access_token || response.token
          
          if (token) {
            // Save token to localStorage for api interceptor
            localStorage.setItem('auth_token', token)
            
            set({
              token,
              isAuthenticated: true,
              adminEmail: email,
            })
            return
          }
        } catch (apiError: any) {
          // Fallback to mock auth if API fails (for development)
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
          
          // Re-throw API error if mock auth also fails
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
    }
  )
)
