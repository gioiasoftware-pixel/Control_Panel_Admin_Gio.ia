import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import toast from 'react-hot-toast'
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

export default function UserEdit() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiClient.getUser(Number(userId)),
    enabled: !!userId,
  })

  const [formData, setFormData] = useState({
    email: '',
    business_name: '',
    password: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        business_name: user.business_name,
        password: '',
      })
    }
  }, [user])

  const updateMutation = useMutation({
    mutationFn: (data: Partial<typeof formData>) =>
      apiClient.updateUser(Number(userId!), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      toast.success('Utente aggiornato con successo')
      navigate(`/admin/users/${userId}`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Errore durante l\'aggiornamento')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToUpdate: any = {
      email: formData.email,
      business_name: formData.business_name,
    }
    if (formData.password) {
      dataToUpdate.password = formData.password
    }
    updateMutation.mutate(dataToUpdate)
  }

  if (isLoading || !user) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-gray-500">Caricamento...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/admin/users/${userId}`)}
          className="p-2 hover:bg-gray-100 rounded-md transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Modifica Utente</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              required
              value={formData.business_name}
              onChange={(e) =>
                setFormData({ ...formData, business_name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nuova Password (lascia vuoto per non modificare)
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-gray-500">Minimo 8 caratteri</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/admin/users/${userId}`)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
