import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { PlayClaimRequest, PlayResult, PlayStatus } from '@/types/play'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://scratch-backend-production.up.railway.app'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error: AxiosError) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    console.error('API Response Error:', error.response?.data || error.message)
    
    // Handle different error response formats
    if (error.response?.data) {
      const data = error.response.data as any
      
      // Handle nested error object with message (your API format)
      if (data.error && data.error.message) {
        throw new Error(data.error.message)
      }
      
      // Handle direct message
      if (data.message) {
        throw new Error(data.message)
      }
      
      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        throw new Error(data.errors.join(', '))
      }
      
      // Handle success: false format
      if (data.success === false && data.error) {
        if (typeof data.error === 'string') {
          throw new Error(data.error)
        }
        if (data.error.message) {
          throw new Error(data.error.message)
        }
      }
    }
    
    // Handle specific HTTP status codes
    switch (error.response?.status) {
      case 400:
        throw new Error('Invalid request. Please check your input.')
      case 401:
        throw new Error('Unauthorized access.')
      case 403:
        throw new Error('Access denied.')
      case 404:
        throw new Error('Resource not found.')
      case 500:
        throw new Error('Server error. Please try again later.')
      default:
        throw new Error(error.message || 'An unexpected error occurred')
    }
  }
)

export class PlayService {
  async validateToken(token: string): Promise<{ valid: boolean; token?: any; reason?: string }> {
    try {
      const response = await api.post('/api/play/validate-token', { token })
      return response.data.data
    } catch (error) {
      console.error('Failed to validate token:', error)
      throw error
    }
  }

  async claimTokenAndPlay(request: PlayClaimRequest): Promise<PlayResult> {
    try {
      const response = await api.post('/api/play/claim', request)
      return response.data.data
    } catch (error) {
      console.error('Failed to claim token and play:', error)
      throw error
    }
  }

  async getPlayStatus(playId: string): Promise<PlayStatus> {
    try {
      const response = await api.get(`/api/play/${playId}/status`)
      return response.data.data
    } catch (error) {
      console.error('Failed to get play status:', error)
      throw error
    }
  }
}

export const playService = new PlayService()
