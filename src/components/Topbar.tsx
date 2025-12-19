import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Topbar() {
  const { logout, adminEmail } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-primary-600">Gio.ia</h1>
          <span className="px-2 py-1 text-xs font-semibold text-white bg-primary-500 rounded">
            Dev
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{adminEmail}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
