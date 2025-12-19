import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../services/api'
import toast from 'react-hot-toast'
import UserCard from '../components/UserCard'
import OnboardingModal from '../components/OnboardingModal'

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestisci utenti e monitora il sistema
          </p>
        </div>
        <button
          onClick={() => setShowOnboarding(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
        >
          + Nuovo Utente
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Cerca utente per nome, email o business name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Users Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-500">Caricamento utenti...</p>
        </div>
      ) : usersData?.data.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Nessun utente trovato</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Precedente
          </button>
          <span className="px-4 py-2 text-gray-700">
            Pagina {page} di {Math.ceil(usersData.total / usersData.limit)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(usersData.total / usersData.limit)}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
