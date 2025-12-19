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
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token')
          window.location.href = '/admin/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth
  async login(email: string, password: string): Promise<{ access_token: string; token?: string }> {
    const response = await this.client.post('/api/auth/login', {
      email,
      password,
    })
    // Normalize response: API returns access_token, but we also support token for compatibility
    const data = response.data
    if (data.access_token) {
      return { access_token: data.access_token, token: data.access_token }
    }
    return data
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
    return response.data
  }

  async createUser(data: OnboardingData): Promise<OnboardingResponse> {
    const formData = new FormData()
    formData.append('username', data.username)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('business_name', data.business_name)
    
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
}

export const apiClient = new ApiClient()
