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
    
    if (error.response?.data && typeof error.response.data === 'object' && 'error' in error.response.data) {
      const errorData = error.response.data as { error: { message: string } }
      throw new Error(errorData.error.message)
    }
    
    throw new Error(error.message || 'An unexpected error occurred')
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
