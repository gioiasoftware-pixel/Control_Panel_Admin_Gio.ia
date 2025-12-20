// User Types
export interface User {
  id: number
  telegram_id: number | null
  username: string
  email: string
  business_name: string
  onboarding_completed: boolean
  created_at: string
  updated_at: string
  first_name?: string
  last_name?: string
  business_type?: string
  location?: string
  phone?: string
}

export interface UserStats {
  total_wines: number
  total_logs?: number
  total_consumi?: number
  total_storico?: number
  last_activity: string | null
  processing_jobs: number
  errors_count: number
  // Ultimo job processing
  last_job_message?: string | null
  last_job_date?: string | null
  // Ultimo errore
  last_error?: string | null
  last_error_date?: string | null
  // Tempo passato in app
  time_today_seconds?: number | null  // secondi passati in app oggi
  time_total_seconds?: number | null  // secondi totali passati in app
}

export interface UserWithStats extends User {
  stats?: UserStats
}

// Database Table Types
export interface InventoryRow {
  id?: number
  name: string
  winery: string
  vintage: number | null
  qty: number
  price: number | null
  type: string | null
  supplier?: string | null
  location?: string | null
  notes?: string | null
}

export interface ConsumptionRow {
  id?: number
  wine_id: number
  movement_type: 'consumo' | 'rifornimento'
  quantity: number
  date: string
  notes?: string | null
}

export interface LogRow {
  id?: number
  timestamp: string
  action: string
  details: string | null
}

export interface HistoryRow {
  id?: number
  wine_id: number
  event_type: string
  details: string | null
  timestamp: string
}

export type TableRow = InventoryRow | ConsumptionRow | LogRow | HistoryRow

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Onboarding Types
export interface OnboardingData {
  username?: string
  email?: string
  password?: string
  business_name: string  // Solo business_name è obbligatorio
  file?: File
  file_type?: 'csv' | 'excel'
}

export interface OnboardingResponse {
  job_id: string
  user_id: number
  tables_created: string[]
}

// File Types
export interface AdminFile {
  id: number
  user_id: number
  file_name: string
  file_type: string
  file_size_bytes: number
  uploaded_by: number
  uploaded_at: string
  metadata?: Record<string, any>
}

// KPI Types
export interface DashboardKPI {
  total_users: number
  active_jobs: number
  errors_24h: number
  files_uploaded_7d: number
}

// Processing Job Types
export interface ProcessingJob {
  id: number
  job_id: string
  telegram_id: number | null
  business_name: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  file_type?: string
  file_name?: string
  total_wines: number
  processed_wines: number
  saved_wines: number
  error_count: number
  created_at: string
  started_at?: string
  completed_at?: string
}

// Table Types
export type TableType = 'inventario' | 'backup' | 'log' | 'consumi' | 'storico'

export interface TableConfig {
  type: TableType
  name: string
  columns: string[]
  editable: boolean
}
