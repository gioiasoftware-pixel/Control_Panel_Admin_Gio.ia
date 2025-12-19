import { NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import { DashboardKPI } from '../types'
import './Sidebar.css'

// Mock KPI data for development
const mockKPI: DashboardKPI = {
  total_users: 0,
  active_jobs: 0,
  errors_24h: 0,
  files_uploaded_7d: 0,
}

export default function Sidebar() {
  const { data: kpi } = useQuery<DashboardKPI>({
    queryKey: ['dashboard-kpi'],
    queryFn: async () => {
      try {
        return await apiClient.getDashboardKPI()
      } catch (error: any) {
        // Return mock data if API not available
        if (error?.code === 'ERR_NETWORK' || error?.message?.includes('ERR_CONNECTION_REFUSED')) {
          console.warn('⚠️ Impossibile connettersi al backend per KPI. Verifica VITE_API_URL su Railway.')
        }
        return mockKPI
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 2, // Retry 2 times before giving up
  })

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/files"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          File Manager
        </NavLink>
      </nav>

      {/* KPI Section */}
      <div className="sidebar-kpi">
        <h3 className="sidebar-kpi-title">KPI Sistema</h3>
        <div>
          <div className="sidebar-kpi-item">
            <span className="sidebar-kpi-label">Utenti</span>
            <span className="sidebar-kpi-value">
              {kpi?.total_users ?? '-'}
            </span>
          </div>
          <div className="sidebar-kpi-item">
            <span className="sidebar-kpi-label">Job Attivi</span>
            <span className="sidebar-kpi-value">
              {kpi?.active_jobs ?? '-'}
            </span>
          </div>
          <div className="sidebar-kpi-item">
            <span className="sidebar-kpi-label">Errori 24h</span>
            <span className="sidebar-kpi-value error">
              {kpi?.errors_24h ?? '-'}
            </span>
          </div>
          <div className="sidebar-kpi-item">
            <span className="sidebar-kpi-label">File 7d</span>
            <span className="sidebar-kpi-value">
              {kpi?.files_uploaded_7d ?? '-'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
