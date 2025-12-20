import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { apiClient } from '../services/api'
import toast from 'react-hot-toast'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, setToken } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Try API login first
      console.log('[LOGIN] Tentativo login per:', email)
      const response = await apiClient.login(email, password)
      console.log('[LOGIN] Risposta ricevuta:', response)
      const token = response.access_token || response.token
      
      if (!token) {
        console.error('[LOGIN] Token non ricevuto, response:', response)
        throw new Error('Token non ricevuto dal server')
      }
      
      console.log('[LOGIN] Token ricevuto, salvando...')
      setToken(token)
      toast.success('Login effettuato con successo')
      navigate('/admin/dashboard')
    } catch (error: any) {
      console.error('[LOGIN] Errore durante login:', error)
      console.error('[LOGIN] Error response:', error.response)
      console.error('[LOGIN] Error message:', error.message)
      
      // In produzione, non usare fallback mock - mostra errore reale
      if (import.meta.env.PROD) {
        const errorMessage = error.response?.data?.detail || error.message || 'Errore durante il login'
        setError(errorMessage)
        toast.error(errorMessage)
      } else {
        // Solo in sviluppo, prova fallback mock
        try {
          console.log('[LOGIN] Tentativo fallback mock login...')
          await login(email, password)
          toast.success('Login effettuato con successo (modalità sviluppo)')
          navigate('/admin/dashboard')
        } catch (mockError: any) {
          console.error('[LOGIN] Errore anche nel fallback mock:', mockError)
          const errorMessage = error.response?.data?.detail || error.message || 'Errore durante il login'
          setError(errorMessage)
          toast.error(errorMessage)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-container">
            <img src="/logo.png" alt="Gio.ia Logo" className="logo" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }} />
          </div>
          <h1 className="login-title">Gio.ia</h1>
        </div>

        <div className="login-form active">
          <h2 className="form-title">Accedi</h2>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </form>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
