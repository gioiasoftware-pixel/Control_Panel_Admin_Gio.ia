import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import type { User } from '../types'
import toast from 'react-hot-toast'

interface UserEditFormProps {
  user: User
  userId: number
}

export default function UserEditForm({ user, userId }: UserEditFormProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    email: user.email || '',
    username: user.username || '',
    business_name: user.business_name || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    business_type: user.business_type || '',
    location: user.location || '',
    phone: user.phone || '',
    password: '', // Password vuota di default (solo se si vuole cambiare)
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const { mutate: updateUser } = useMutation({
    mutationFn: (data: Record<string, any>) => apiClient.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsEditing(false)
      toast.success('Utente aggiornato con successo')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Errore durante l\'aggiornamento')
      setLoading(false)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepara dati da inviare (solo campi modificati)
      // Usa Record<string, any> per includere password che non è nel tipo User
      const updateData: Record<string, any> = {}
      
      if (formData.email !== user.email) updateData.email = formData.email
      if (formData.username !== user.username) updateData.username = formData.username
      if (formData.business_name !== user.business_name) updateData.business_name = formData.business_name
      if (formData.first_name !== (user.first_name || '')) updateData.first_name = formData.first_name || undefined
      if (formData.last_name !== (user.last_name || '')) updateData.last_name = formData.last_name || undefined
      if (formData.business_type !== (user.business_type || '')) updateData.business_type = formData.business_type || undefined
      if (formData.location !== (user.location || '')) updateData.location = formData.location || undefined
      if (formData.phone !== (user.phone || '')) updateData.phone = formData.phone || undefined
      
      // Password solo se fornita e non vuota
      if (formData.password && formData.password.trim() !== '') {
        if (formData.password.length < 8) {
          toast.error('La password deve essere di almeno 8 caratteri')
          setLoading(false)
          return
        }
        updateData.password = formData.password
      }

      if (Object.keys(updateData).length === 0) {
        toast('Nessuna modifica da salvare', { icon: 'ℹ️' })
        setIsEditing(false)
        setLoading(false)
        return
      }

      updateUser(updateData)
    } catch (error: any) {
      toast.error(error.message || 'Errore durante l\'aggiornamento')
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      email: user.email || '',
      username: user.username || '',
      business_name: user.business_name || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      business_type: user.business_type || '',
      location: user.location || '',
      phone: user.phone || '',
      password: '',
    })
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Dati Utente</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition"
          >
            Modifica
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telegram ID</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.telegram_id || 'N/A'}</p>
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
              {new Date(user.created_at).toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Modifica Dati Utente</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            disabled={loading}
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvataggio...' : 'Salva'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
          <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">{user.id}</p>
          <p className="text-xs text-gray-400 mt-1">Non modificabile</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telegram ID</label>
          <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">{user.telegram_id || 'N/A'}</p>
          <p className="text-xs text-gray-400 mt-1">Non modificabile</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
          <input
            type="text"
            value={formData.business_name}
            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
          <input
            type="text"
            value={formData.business_type}
            onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nuova Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Lascia vuoto per non cambiare"
            minLength={8}
          />
          <p className="text-xs text-gray-500 mt-1">Minimo 8 caratteri se fornita</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Onboarding Completato</label>
          <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
            {user.onboarding_completed ? 'Sì' : 'No'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Non modificabile</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Creato il</label>
          <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
            {new Date(user.created_at).toLocaleDateString('it-IT')}
          </p>
          <p className="text-xs text-gray-400 mt-1">Non modificabile</p>
        </div>
      </div>
    </form>
  )
}
