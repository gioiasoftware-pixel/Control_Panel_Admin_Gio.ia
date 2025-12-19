import { NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import { DashboardKPI } from '../types'

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
      } catch (error) {
        // Return mock data if API not available
        return mockKPI
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <nav className="flex-1 p-4">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `block px-4 py-2 mb-2 rounded-md transition ${
              isActive
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/files"
          className={({ isActive }) =>
            `block px-4 py-2 mb-2 rounded-md transition ${
              isActive
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          File Manager
        </NavLink>
      </nav>

      {/* KPI Section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
          KPI Sistema
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Utenti</span>
            <span className="text-sm font-semibold text-gray-900">
              {kpi?.total_users ?? '-'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Job Attivi</span>
            <span className="text-sm font-semibold text-gray-900">
              {kpi?.active_jobs ?? '-'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Errori 24h</span>
            <span className="text-sm font-semibold text-red-600">
              {kpi?.errors_24h ?? '-'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">File 7d</span>
            <span className="text-sm font-semibold text-gray-900">
              {kpi?.files_uploaded_7d ?? '-'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
