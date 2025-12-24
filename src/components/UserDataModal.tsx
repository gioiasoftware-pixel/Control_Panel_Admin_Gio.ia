import { useRef, useEffect } from 'react'
import type { UserWithStats } from '../types'

interface UserDataModalProps {
  user: UserWithStats
  onClose: () => void
}

export default function UserDataModal({ user, onClose }: UserDataModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Chiudi modal quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  // Funzione per esportare dati come JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(user, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `user_${user.id}_${user.business_name}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Funzione per copiare dati come testo
  const handleCopyText = () => {
    const text = `
Dati Utente - ${user.business_name}
ID: ${user.id}
Email: ${user.email || 'N/A'}
Username: ${user.username || 'N/A'}
Business Name: ${user.business_name || 'N/A'}
Telegram ID: ${user.telegram_id || 'N/A'}
First Name: ${user.first_name || 'N/A'}
Last Name: ${user.last_name || 'N/A'}
Business Type: ${user.business_type || 'N/A'}
Location: ${user.location || 'N/A'}
Phone: ${user.phone || 'N/A'}
Onboarding Completato: ${user.onboarding_completed ? 'Sì' : 'No'}
Creato il: ${new Date(user.created_at).toLocaleString('it-IT')}
Aggiornato il: ${new Date(user.updated_at).toLocaleString('it-IT')}

Statistiche:
- Vini Totali: ${user.stats?.total_wines || 0}
- Log Totali: ${user.stats?.total_logs || 0}
- Consumi Totali: ${user.stats?.total_consumi || 0}
- Storico Totali: ${user.stats?.total_storico || 0}
- Ultimo Accesso: ${user.stats?.last_activity ? new Date(user.stats.last_activity).toLocaleString('it-IT') : 'Mai'}
- Ultimo Job: ${user.stats?.last_job_message || 'N/A'} (${user.stats?.last_job_date ? new Date(user.stats.last_job_date).toLocaleString('it-IT') : 'N/A'})
- Ultimo Errore: ${user.stats?.last_error || 'Nessuno'} (${user.stats?.last_error_date ? new Date(user.stats.last_error_date).toLocaleString('it-IT') : 'N/A'})
    `.trim()
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Dati copiati negli appunti!')
    }).catch(() => {
      alert('Errore durante la copia')
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Dati Completi - {user.business_name}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleCopyText}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              Copia Testo
            </button>
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition"
            >
              Esporta JSON
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              Chiudi
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Dati Utente */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dati Utente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.email || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.username || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.business_name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telegram ID</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.telegram_id || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.first_name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.last_name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.business_type || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.location || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Onboarding Completato</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {user.onboarding_completed ? 'Sì' : 'No'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Creato il</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {new Date(user.created_at).toLocaleString('it-IT')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aggiornato il</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {new Date(user.updated_at).toLocaleString('it-IT')}
                </p>
              </div>
            </div>
          </div>

          {/* Statistiche */}
          {user.stats && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiche</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vini Totali</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.stats.total_wines}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Log Totali</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.stats.total_logs}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consumi Totali</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.stats.total_consumi}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storico Totali</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.stats.total_storico}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ultimo Accesso</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {user.stats.last_activity
                      ? new Date(user.stats.last_activity).toLocaleString('it-IT')
                      : 'Mai'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ultimo Job</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {user.stats.last_job_message || 'N/A'}
                  </p>
                  {user.stats.last_job_date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(user.stats.last_job_date).toLocaleString('it-IT')}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ultimo Errore</label>
                  <p className="text-sm text-red-600 bg-gray-50 p-2 rounded break-words">
                    {user.stats.last_error || 'Nessuno'}
                  </p>
                  {user.stats.last_error_date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(user.stats.last_error_date).toLocaleString('it-IT')}
                    </p>
                  )}
                </div>
                {user.stats.time_today_seconds !== undefined && user.stats.time_today_seconds !== null && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tempo in App Oggi</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {user.stats.time_today_seconds > 0 
                        ? formatTime(user.stats.time_today_seconds)
                        : 'Nessuna attività oggi'}
                    </p>
                  </div>
                )}
                {user.stats.time_total_seconds !== undefined && user.stats.time_total_seconds !== null && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tempo Totale in App</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {user.stats.time_total_seconds > 0
                        ? formatTime(user.stats.time_total_seconds)
                        : 'Nessuna attività registrata'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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



