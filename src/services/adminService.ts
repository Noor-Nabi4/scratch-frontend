import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { LoginRequest, LoginResponse, DashboardStats, ResultType, Token, PlaySearchResult } from '@/types/play'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    
    if (error.response?.data && typeof error.response.data === 'object' && 'error' in error.response.data) {
      const errorData = error.response.data as { error: { message: string } }
      throw new Error(errorData.error.message)
    }
    
    throw new Error(error.message || 'An unexpected error occurred')
  }
)

export class AdminService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post('/api/admin/login', credentials)
      const { token, admin } = response.data.data
      
      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_user', JSON.stringify(admin))
      
      return { token, admin }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  async getProfile() {
    try {
      const response = await api.get('/api/admin/profile')
      return response.data.data
    } catch (error) {
      console.error('Failed to get profile:', error)
      throw error
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/api/admin/dashboard')
      return response.data.data
    } catch (error) {
      console.error('Failed to get dashboard stats:', error)
      throw error
    }
  }

  async getTokens(page: number = 1, limit: number = 50, search?: string, isUsed?: boolean) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      
      if (search) params.append('search', search)
      if (isUsed !== undefined) params.append('isUsed', isUsed.toString())
      
      const response = await api.get(`/api/admin/tokens?${params}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to get tokens:', error)
      throw error
    }
  }

  async uploadTokens(file: File): Promise<{ message: string; count: number }> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/api/admin/tokens/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to upload tokens:', error)
      throw error
    }
  }

  // Token Management
  async createTokens(count: number, expiresAt?: string, metadata?: any) {
    try {
      const response = await api.post('/api/admin/tokens/create', {
        count,
        expiresAt,
        metadata
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to create tokens:', error)
      throw error
    }
  }

  async getTokenStats() {
    try {
      const response = await api.get('/api/admin/tokens/stats')
      return response.data.data
    } catch (error) {
      console.error('Failed to get token stats:', error)
      throw error
    }
  }

  async deleteTokens(tokenIds: string[]) {
    try {
      const response = await api.delete('/api/admin/tokens', {
        data: { tokenIds }
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to delete tokens:', error)
      throw error
    }
  }

  // Prize Management
  async getPrizes(includeInactive: boolean = false): Promise<ResultType[]> {
    try {
      const params = includeInactive ? '?includeInactive=true' : ''
      const response = await api.get(`/api/admin/prizes${params}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to get prizes:', error)
      throw error
    }
  }

  async getPrize(id: string) {
    try {
      const response = await api.get(`/api/admin/prizes/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to get prize:', error)
      throw error
    }
  }

  async createPrize(data: {
    name: string;
    code: string;
    description?: string;
    prizeValue?: string;
    weight: number;
    stockLimit?: number;
    isPrize: boolean;
    isActive?: boolean;
  }): Promise<ResultType> {
    try {
      const response = await api.post('/api/admin/prizes', data)
      return response.data.data
    } catch (error) {
      console.error('Failed to create prize:', error)
      throw error
    }
  }

  async updatePrize(id: string, data: Partial<ResultType>): Promise<ResultType> {
    try {
      const response = await api.put(`/api/admin/prizes/${id}`, data)
      return response.data.data
    } catch (error) {
      console.error('Failed to update prize:', error)
      throw error
    }
  }

  async deletePrize(id: string) {
    try {
      const response = await api.delete(`/api/admin/prizes/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to delete prize:', error)
      throw error
    }
  }

  async getPrizeStats() {
    try {
      const response = await api.get('/api/admin/prizes/stats')
      return response.data.data
    } catch (error) {
      console.error('Failed to get prize stats:', error)
      throw error
    }
  }

  async updatePrizeStock(id: string, stockLimit: number) {
    try {
      const response = await api.put(`/api/admin/prizes/${id}/stock`, { stockLimit })
      return response.data.data
    } catch (error) {
      console.error('Failed to update prize stock:', error)
      throw error
    }
  }

  async validatePrizeConfiguration() {
    try {
      const response = await api.get('/api/admin/prizes/validate')
      return response.data.data
    } catch (error) {
      console.error('Failed to validate prize configuration:', error)
      throw error
    }
  }

  async getPlays(page: number = 1, limit: number = 50, filters?: {
    from?: string;
    to?: string;
    prizeType?: string;
    isRedeemed?: boolean;
  }) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      
      if (filters?.from) params.append('from', filters.from)
      if (filters?.to) params.append('to', filters.to)
      if (filters?.prizeType) params.append('prizeType', filters.prizeType)
      if (filters?.isRedeemed !== undefined) params.append('isRedeemed', filters.isRedeemed.toString())
      
      const response = await api.get(`/api/admin/plays?${params}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to get plays:', error)
      throw error
    }
  }

  async exportPlays(filters?: {
    from?: string;
    to?: string;
    prizeType?: string;
  }): Promise<Blob> {
    try {
      const params = new URLSearchParams()
      if (filters?.from) params.append('from', filters.from)
      if (filters?.to) params.append('to', filters.to)
      if (filters?.prizeType) params.append('prizeType', filters.prizeType)
      
      const response = await api.get(`/api/admin/exports/plays.csv?${params}`, {
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      console.error('Failed to export plays:', error)
      throw error
    }
  }

  async redeemPlay(playId: string, redeemedBy: string, notes?: string) {
    try {
      const response = await api.post(`/api/admin/play/${playId}/redeem`, {
        redeemedBy,
        notes,
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to redeem play:', error)
      throw error
    }
  }
}

export const adminService = new AdminService()
