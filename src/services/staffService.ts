import axios from 'axios'
import { PlaySearchResult } from '@/types/play'

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
    const token = localStorage.getItem('staff_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('staff_token')
      window.location.href = '/staff/login'
    }
    
    if (error.response?.data?.error?.message) {
      throw new Error(error.response.data.error.message)
    }
    
    throw new Error(error.message || 'An unexpected error occurred')
  }
)

export class StaffService {
  async searchPlay(query: string): Promise<PlaySearchResult[]> {
    try {
      const response = await api.get(`/api/staff/play/search?query=${encodeURIComponent(query)}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to search play:', error)
      throw error
    }
  }

  async getPlay(playId: string): Promise<PlaySearchResult> {
    try {
      const response = await api.get(`/api/staff/play/${playId}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to get play:', error)
      throw error
    }
  }

  async redeemPlay(playId: string, redeemedBy: string, notes?: string) {
    try {
      const response = await api.post(`/api/staff/play/${playId}/redeem`, {
        notes,
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to redeem play:', error)
      throw error
    }
  }
}

export const staffService = new StaffService()
