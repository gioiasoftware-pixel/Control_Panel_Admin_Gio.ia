import { User } from '../types'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import './UserCard.css'

interface UserCardProps {
  user: User
  onClick: () => void
}

export default function UserCard({ user, onClick }: UserCardProps) {
  return (
    <div onClick={onClick} className="user-card">
      <div className="user-card-header">
        <div>
          <h3 className="user-card-title">{user.business_name}</h3>
          <p className="user-card-email">{user.email}</p>
        </div>
        {user.onboarding_completed ? (
          <span className="user-card-badge completed">Completato</span>
        ) : (
          <span className="user-card-badge pending">In corso</span>
        )}
      </div>

      <div className="user-card-info">
        <div className="user-card-info-row">
          <span className="user-card-info-label">Username:</span>
          <span className="user-card-info-value">{user.username}</span>
        </div>
        <div className="user-card-info-row">
          <span className="user-card-info-label">Creato:</span>
          <span className="user-card-info-value">
            {format(new Date(user.created_at), 'dd MMM yyyy', { locale: it })}
          </span>
        </div>
        {user.telegram_id && (
          <div className="user-card-info-row">
            <span className="user-card-info-label">Telegram ID:</span>
            <span className="user-card-info-value">{user.telegram_id}</span>
          </div>
        )}
      </div>
    </div>
  )
}
