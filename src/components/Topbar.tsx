import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../services/api'
import './Topbar.css'

export default function Topbar() {
  const { logout, adminEmail } = useAuthStore()
  const navigate = useNavigate()
  const [debugEnabled, setDebugEnabled] = useState<boolean | null>(null)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    let mounted = true
    apiClient.getDebugLoggingStatus()
      .then((data) => {
        if (mounted) setDebugEnabled(!!data.enabled)
      })
      .catch(() => {
        if (mounted) setDebugEnabled(null)
      })
    return () => { mounted = false }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const handleToggleDebug = async () => {
    if (debugEnabled === null || isToggling) return
    const nextValue = !debugEnabled
    setIsToggling(true)
    try {
      const result = await apiClient.setDebugLoggingStatus(nextValue)
      setDebugEnabled(!!result.enabled)
      toast.success(result.enabled ? 'Logging app attivato' : 'Logging app disattivato')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || error.message || 'Errore aggiornamento logging')
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="topbar-left">
          <img src="/logo.png" alt="Gio.ia Logo" className="topbar-logo" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }} />
          <h1 className="topbar-title">Gio.ia</h1>
          <span className="topbar-badge">Dev</span>
        </div>
        <div className="topbar-right">
          <button
            type="button"
            onClick={handleToggleDebug}
            className={`topbar-debug-toggle ${debugEnabled ? 'is-on' : 'is-off'}`}
            disabled={debugEnabled === null || isToggling}
            title={debugEnabled ? 'Disattiva logging app' : 'Attiva logging app'}
          >
            {debugEnabled === null ? 'Log App: --' : debugEnabled ? 'Log App: ON' : 'Log App: OFF'}
          </button>
          <span className="topbar-email">{adminEmail}</span>
          <button onClick={handleLogout} className="topbar-logout">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
