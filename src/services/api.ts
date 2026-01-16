import axios, { AxiosInstance, AxiosError } from 'axios'
import type {
  User,
  UserWithStats,
  PaginatedResponse,
  OnboardingData,
  OnboardingResponse,
  DashboardKPI,
  AdminFile,
  ProcessingJob,
  TableRow,
} from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const PROCESSOR_URL = import.meta.env.VITE_PROCESSOR_URL || 'http://localhost:8001'

function safeDecodeJwt(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch {
    return null
  }
}

function logAuthDebug(context: string, token: string | null, requestUrl?: string) {
  const payload = token ? safeDecodeJwt(token) : null
  const exp = payload?.exp ? new Date(payload.exp * 1000) : null
  const now = new Date()
  const expInMin = exp ? Math.round((exp.getTime() - now.getTime()) / 60000) : null
  console.warn('[ADMIN_AUTH_DEBUG]', {
    context,
    requestUrl,
    apiBaseUrl: API_URL,
    hasToken: !!token,
    tokenPayload: payload ? {
      user_id: payload.user_id,
      type: payload.type,
      is_spectator: payload.is_spectator,
      exp: payload.exp
    } : null,
    tokenExpiresInMin: expInMin
  })
}

function getStoredToken(): string | null {
  const directToken = localStorage.getItem('auth_token')
  if (directToken) return directToken
  try {
    const raw = localStorage.getItem('auth-storage')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const token = parsed?.state?.token
    if (token) {
      localStorage.setItem('auth_token', token)
      return token
    }
  } catch {
    return null
  }
  return null
}

// Warn if using default URLs in production
if (import.meta.env.PROD) {
  if (!import.meta.env.VITE_API_URL) {
    console.error(
      '⚠️ VITE_API_URL non configurata! Il Control Panel sta usando localhost:8000 come fallback.\n' +
      'Configura VITE_API_URL su Railway con l\'URL del backend Web App.\n' +
      'Vedi RAILWAY_ENV_SETUP.md per istruzioni dettagliate.'
    )
  }
  // VITE_PROCESSOR_URL non è necessaria - il Control Panel chiama solo il backend Web App
  // che a sua volta chiama Processor usando la sua PROCESSOR_URL
}

class ApiClient {
  private client: AxiosInstance
  private processorClient: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.processorClient = axios.create({
      baseURL: PROCESSOR_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = getStoredToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Handle connection errors
        if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
          const apiUrl = API_URL
          console.error(
            `❌ Errore di connessione al backend: ${apiUrl}\n` +
            `Verifica che:\n` +
            `1. VITE_API_URL sia configurata correttamente su Railway\n` +
            `2. Il backend Web App sia online e raggiungibile\n` +
            `3. L'URL sia corretto (non localhost in produzione)\n` +
            `Vedi RAILWAY_ENV_SETUP.md per istruzioni dettagliate.`
          )
        }
        
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token')
          window.location.href = '/admin/login'
        }
        if (error.response?.status === 403) {
          const token = getStoredToken()
          const requestUrl = (error.config?.baseURL || '') + (error.config?.url || '')
          logAuthDebug('403 forbidden', token, requestUrl)
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth
  async login(email: string, password: string): Promise<{ access_token: string; token?: string }> {
    try {
      console.log('[API] Login request to:', `${API_URL}/api/auth/login`)
      const response = await this.client.post('/api/auth/login', {
        email,
        password,
      })
      console.log('[API] Login response status:', response.status)
      console.log('[API] Login response data:', response.data)
      // Normalize response: API returns access_token, but we also support token for compatibility
      const data = response.data
      if (data.access_token) {
        logAuthDebug('login success', data.access_token)
        return { access_token: data.access_token, token: data.access_token }
      }
      return data
    } catch (error: any) {
      console.error('[API] Login error:', error)
      console.error('[API] Login error response:', error.response)
      console.error('[API] Login error message:', error.message)
      throw error
    }
  }

  // Users
  async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<PaginatedResponse<User>> {
    const response = await this.client.get('/api/admin/users', { params })
    return response.data
  }

  async getUser(userId: number): Promise<UserWithStats> {
    const response = await this.client.get(`/api/admin/users/${userId}`)
    // Il backend restituisce {user: {...}, stats: {...}}, dobbiamo combinare
    const data = response.data
    
    // Debug logging
    console.log('[API] getUser response:', JSON.stringify(data, null, 2))
    
    if (data.user && data.stats) {
      const combined = {
        ...data.user,
        stats: data.stats
      }
      console.log('[API] Combined user data:', JSON.stringify(combined, null, 2))
      return combined
    }
    
    // Se la struttura è già corretta (stats direttamente nell'oggetto)
    if (data.stats && data.id) {
      console.log('[API] User data already in correct format')
      return data as UserWithStats
    }
    
    // Fallback per compatibilità
    console.warn('[API] Unexpected response structure:', data)
    return data
  }

  async createUser(data: OnboardingData): Promise<OnboardingResponse> {
    const formData = new FormData()
    
    // Solo business_name è obbligatorio
    formData.append('business_name', data.business_name)
    
    // Aggiungi campi opzionali solo se forniti
    if (data.username && data.username.trim() !== '') {
      formData.append('username', data.username)
    }
    if (data.email && data.email.trim() !== '') {
      formData.append('email', data.email)
    }
    if (data.password && data.password.trim() !== '') {
      formData.append('password', data.password)
    }
    
    if (data.file) {
      formData.append('file', data.file)
      formData.append('file_type', data.file_type || 'csv')
    }

    // Send to Web App backend which handles user creation and Processor integration
    const response = await this.client.post('/api/admin/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    const response = await this.client.patch(`/api/admin/users/${userId}`, data)
    return response.data
  }

  async getSpectatorToken(userId: number): Promise<{ spectator_token: string; web_app_url: string; redirect_url: string }> {
    const response = await this.client.post(`/api/admin/users/${userId}/spectator-token`)
    return response.data
  }

  // Dashboard KPI
  async getDashboardKPI(): Promise<DashboardKPI> {
    const response = await this.client.get('/api/admin/dashboard/kpi')
    return response.data
  }

  // User Tables
  async getUserTable(
    userId: number,
    tableName: string,
    params?: {
      page?: number
      limit?: number
      sort?: string
    }
  ): Promise<PaginatedResponse<TableRow>> {
    const response = await this.client.get(
      `/api/admin/users/${userId}/tables/${encodeURIComponent(tableName)}`,
      { params }
    )
    return response.data
  }

  async updateTableRow(
    userId: number,
    tableName: string,
    rowId: number,
    data: Partial<TableRow>
  ): Promise<TableRow> {
    const response = await this.client.patch(
      `/api/admin/users/${userId}/tables/${encodeURIComponent(tableName)}/${rowId}`,
      data
    )
    return response.data
  }

  async deleteTableRow(
    userId: number,
    tableName: string,
    rowId: number
  ): Promise<void> {
    await this.client.delete(
      `/api/admin/users/${userId}/tables/${encodeURIComponent(tableName)}/${rowId}`
    )
  }

  async createTableRow(
    userId: number,
    tableName: string,
    data: Partial<TableRow>
  ): Promise<TableRow> {
    const response = await this.client.post(
      `/api/admin/users/${userId}/tables/${encodeURIComponent(tableName)}`,
      data
    )
    return response.data
  }

  // Files
  async getFiles(userId?: number): Promise<AdminFile[]> {
    const params = userId ? { user_id: userId } : {}
    const response = await this.client.get('/api/admin/files', { params })
    return response.data
  }

  async uploadFile(file: File, userId: number): Promise<AdminFile> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('user_id', userId.toString())

    const response = await this.client.post('/api/admin/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async downloadFile(fileId: number): Promise<Blob> {
    const response = await this.client.get(`/api/admin/files/${fileId}/download`, {
      responseType: 'blob',
    })
    return response.data
  }

  async deleteFile(fileId: number): Promise<void> {
    await this.client.delete(`/api/admin/files/${fileId}`)
  }

  // Processor Integration
  async getJobStatus(jobId: string): Promise<ProcessingJob> {
    const response = await this.processorClient.get(`/status/${jobId}`)
    return response.data
  }

  async getInventorySnapshot(userId: number): Promise<any> {
    const response = await this.processorClient.get('/api/inventory/snapshot', {
      params: { user_id: userId },
    })
    return response.data
  }

  // PDF Reports
  async triggerGeneratePdfReports(userId?: number, reportDate?: string): Promise<any> {
    const formData = new FormData()
    if (userId) formData.append('user_id', userId.toString())
    if (reportDate) formData.append('report_date', reportDate)
    
    const response = await this.processorClient.post('/admin/trigger-generate-pdf-reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async triggerSendPdfReports(userId?: number, reportDate?: string): Promise<any> {
    const params: any = {}
    if (userId) params.user_id = userId
    if (reportDate) params.report_date = reportDate
    
    const response = await this.client.post('/api/admin/trigger-send-pdf-reports', null, { params })
    return response.data
  }

  async getDebugLoggingStatus(): Promise<{ enabled: boolean }> {
    const response = await this.client.get('/api/admin/debug-logging')
    return response.data
  }

  async setDebugLoggingStatus(enabled: boolean): Promise<{ enabled: boolean }> {
    const response = await this.client.put('/api/admin/debug-logging', { enabled })
    return response.data
  }
}

export const apiClient = new ApiClient()
