import { User } from '../types'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'

interface UserCardProps {
  user: User
  onClick: () => void
}

export default function UserCard({ user, onClick }: UserCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer border border-gray-200 hover:border-primary-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {user.business_name}
          </h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        {user.onboarding_completed ? (
          <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
            Completato
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded">
            In corso
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Username:</span>
          <span className="font-medium">{user.username}</span>
        </div>
        <div className="flex justify-between">
          <span>Creato:</span>
          <span className="font-medium">
            {format(new Date(user.created_at), 'dd MMM yyyy', { locale: it })}
          </span>
        </div>
        {user.telegram_id && (
          <div className="flex justify-between">
            <span>Telegram ID:</span>
            <span className="font-medium">{user.telegram_id}</span>
          </div>
        )}
      </div>
    </div>
  )
}
