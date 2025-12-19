import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../services/api'
import toast from 'react-hot-toast'
import UserCard from '../components/UserCard'
import OnboardingModal from '../components/OnboardingModal'
import './Dashboard.css'

export default function Dashboard() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => apiClient.getUsers({ page, limit: 12, search }),
  })

  const { mutate: createUser } = useMutation({
    mutationFn: apiClient.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpi'] })
      setShowOnboarding(false)
      toast.success('Utente creato con successo')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Errore durante la creazione utente')
    },
  })

  const handleUserClick = (userId: number) => {
    navigate(`/admin/users/${userId}`)
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1>Dashboard Admin</h1>
          <p>Gestisci utenti e monitora il sistema</p>
        </div>
        <button
          onClick={() => setShowOnboarding(true)}
          className="dashboard-button"
        >
          + Nuovo Utente
        </button>
      </div>

      {/* Search */}
      <div className="dashboard-search">
        <input
          type="text"
          placeholder="Cerca utente per nome, email o business name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users Grid */}
      {isLoading ? (
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>
          <p className="dashboard-loading-text">Caricamento utenti...</p>
        </div>
      ) : usersData?.data.length === 0 ? (
        <div className="dashboard-empty">
          <p className="dashboard-empty-text">Nessun utente trovato</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {usersData?.data.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onClick={() => handleUserClick(user.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {usersData && usersData.total > usersData.limit && (
        <div className="dashboard-pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="dashboard-pagination-button"
          >
            Precedente
          </button>
          <span className="dashboard-pagination-info">
            Pagina {page} di {Math.ceil(usersData.total / usersData.limit)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(usersData.total / usersData.limit)}
            className="dashboard-pagination-button"
          >
            Successiva
          </button>
        </div>
      )}

      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          onClose={() => setShowOnboarding(false)}
          onSubmit={createUser}
        />
      )}
    </div>
  )
}
