import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
        // TODO: Replace with actual API call
        // For now, using mock authentication
        if (email === import.meta.env.VITE_ADMIN_EMAIL && 
            password === import.meta.env.VITE_ADMIN_PASSWORD) {
          const mockToken = 'mock-jwt-token-' + Date.now()
          set({
            token: mockToken,
            isAuthenticated: true,
            adminEmail: email,
          })
          localStorage.setItem('auth_token', mockToken)
        } else {
          throw new Error('Credenziali non valide')
        }
      },
      logout: () => {
        set({
          token: null,
          isAuthenticated: false,
          adminEmail: null,
        })
        localStorage.removeItem('auth_token')
      },
      setToken: (token: string) => {
        set({
          token,
          isAuthenticated: true,
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
