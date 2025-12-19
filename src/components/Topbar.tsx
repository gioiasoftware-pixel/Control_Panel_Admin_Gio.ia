import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import './Topbar.css'

export default function Topbar() {
  const { logout, adminEmail } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
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
          <span className="topbar-email">{adminEmail}</span>
          <button onClick={handleLogout} className="topbar-logout">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
