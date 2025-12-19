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
        // Admin credentials (fallback if env vars not set)
        const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'gio.ia.software@gmail.com'
        const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Lagioiadilavorare2025'
        
        // Validate credentials
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const mockToken = 'mock-jwt-token-' + Date.now()
          set({
            token: mockToken,
            isAuthenticated: true,
            adminEmail: email,
          })
          // persist middleware will handle saving to localStorage
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
        // persist middleware will handle removing from localStorage
      },
      setToken: (token: string) => {
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
