import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import { TableType } from '../types'
import UserTable from '../components/UserTable'
import UserEditForm from '../components/UserEditForm'
import UserDataModal from '../components/UserDataModal'
// Simple arrow icon component
const ArrowLeft = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
)

const TABLE_CONFIGS: Record<TableType, { name: string; editable: boolean }> = {
  inventario: { name: 'INVENTARIO', editable: true },
  backup: { name: 'INVENTARIO backup', editable: false },
  log: { name: 'LOG interazione', editable: false },
  consumi: { name: 'Consumi e rifornimenti', editable: true },
  storico: { name: 'Storico vino', editable: false },
}

type TabType = TableType | 'user'

// Funzione helper per formattare il tempo in secondi
function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (minutes === 0) {
      return `${hours}h ${secs}s`
    }
    return `${hours}h ${minutes}m ${secs}s`
  }
}

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('user')
  const [showUserDataModal, setShowUserDataModal] = useState(false)

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiClient.getUser(Number(userId)),
    enabled: !!userId,
  })

  if (userLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-gray-500">Caricamento utente...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Utente non trovato</p>
      </div>
    )
  }

  const tableName = activeTab !== 'user' ? TABLE_CONFIGS[activeTab as TableType].name : ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-md transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.business_name}
            </h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-sm font-semibold text-primary-700 bg-primary-100 rounded">
            Spectator Mode
          </span>
          <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded">
            Viewing as: {user.username}
          </span>
          <button
            onClick={() => navigate(`/admin/users/${userId}/edit`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Modifica
          </button>
        </div>
      </div>

      {/* Stats */}
      {user.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Vini Totali</p>
            <p className="text-2xl font-bold text-gray-900">{user.stats.total_wines}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 mb-2">Job Processing</p>
            {user.stats.last_job_message && user.stats.last_job_date ? (
              <div>
                <p className="text-sm font-medium text-gray-900 truncate" title={user.stats.last_job_message}>
                  {user.stats.last_job_message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(user.stats.last_job_date).toLocaleDateString('it-IT', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Nessun job</p>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 mb-2">Errori</p>
            {user.stats.last_error && user.stats.last_error_date ? (
              <div>
                <p className="text-sm font-medium text-red-600 truncate" title={user.stats.last_error}>
                  {user.stats.last_error.length > 50 
                    ? user.stats.last_error.substring(0, 50) + '...'
                    : user.stats.last_error}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(user.stats.last_error_date).toLocaleDateString('it-IT', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Nessun errore</p>
            )}
          </div>
          <div 
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setShowUserDataModal(true)}
          >
            <p className="text-sm text-gray-500 mb-2">Ultimo Accesso</p>
            <p className="text-sm font-medium text-primary-600 hover:text-primary-700">
              {user.stats.last_activity
                ? new Date(user.stats.last_activity).toLocaleDateString('it-IT', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Mai'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Clicca per vedere tutti i dati</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {/* Tab Dati Utente */}
            <button
              onClick={() => setActiveTab('user')}
              className={`
                px-6 py-3 text-sm font-medium border-b-2 transition
                ${
                  activeTab === 'user'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Dati Utente
            </button>
            {/* Tab Tabelle */}
            {Object.entries(TABLE_CONFIGS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as TableType)}
                className={`
                  px-6 py-3 text-sm font-medium border-b-2 transition
                  ${
                    activeTab === key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {config.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'user' ? (
            <UserEditForm user={user} userId={Number(userId!)} />
          ) : (
            <UserTable
              userId={Number(userId!)}
              tableName={tableName}
              tableType={activeTab as TableType}
              editable={TABLE_CONFIGS[activeTab as TableType].editable}
            />
          )}
        </div>
      </div>

      {/* Modal Dati Utente Completi */}
      {showUserDataModal && (
        <UserDataModal
          user={user}
          onClose={() => setShowUserDataModal(false)}
        />
      )}
    </div>
  )
}
