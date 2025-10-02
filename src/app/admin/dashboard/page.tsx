'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Gift, 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  LogOut,
  Settings,
  Upload,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'
import { adminService } from '@/services/adminService'
import { DashboardStats } from '@/types/play'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    loadDashboardStats()
  }, [router])

  const loadDashboardStats = async () => {
    try {
      const data = await adminService.getDashboardStats()
      setStats(data)
    } catch (error) {
      toast.error('Failed to load dashboard stats')
      console.error('Dashboard stats error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    adminService.logout()
    router.push('/admin/login')
    toast.success('Logged out successfully')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
          <button onClick={loadDashboardStats} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/tokens')}
                className="btn-secondary"
              >
                <Upload className="w-4 h-4 mr-2" />
                Manage Tokens
              </button>
              <button
                onClick={() => router.push('/admin/plays')}
                className="btn-secondary"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Plays
              </button>
              <button
                onClick={handleLogout}
                className="btn-error"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tokens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                <p className="text-3xl font-bold text-gray-900">{stats.tokens.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-success-600 font-medium">
                {stats.tokens.available} available
              </span>
              <span className="text-gray-400 mx-2">•</span>
              <span className="text-gray-600">
                {stats.tokens.used} used
              </span>
            </div>
          </motion.div>

          {/* Total Plays */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Plays</p>
                <p className="text-3xl font-bold text-gray-900">{stats.plays.total}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-success-600 font-medium">
                {stats.plays.redeemed} redeemed
              </span>
              <span className="text-gray-400 mx-2">•</span>
              <span className="text-gray-600">
                {stats.plays.total - stats.plays.redeemed} pending
              </span>
            </div>
          </motion.div>

          {/* Today's Plays */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Plays</p>
                <p className="text-3xl font-bold text-gray-900">{stats.plays.today}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-success-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-success-600 font-medium">
                {stats.plays.thisWeek} this week
              </span>
            </div>
          </motion.div>

          {/* Active Result Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prize Types</p>
                <p className="text-3xl font-bold text-gray-900">{stats.resultTypes.length}</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-warning-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-success-600 font-medium">
                {stats.resultTypes.filter(rt => rt.isActive).length} active
              </span>
            </div>
          </motion.div>
        </div>

        {/* Result Types Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Prize Types Overview</h2>
            <button
              onClick={() => router.push('/admin/prizes')}
              className="btn-primary"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Prizes
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.resultTypes.map((resultType, index) => (
              <motion.div
                key={resultType.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{resultType.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    resultType.isActive 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {resultType.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{resultType.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Plays:</span>
                    <span className="font-medium">{resultType.playsCount}</span>
                  </div>
                  {resultType.stockLimit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Stock:</span>
                      <span className="font-medium">
                        {resultType.distributedCount}/{resultType.stockLimit}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{resultType.weight}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/admin/tokens')}
              className="btn-secondary p-4 text-left"
            >
              <Upload className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Upload Tokens</h3>
              <p className="text-sm text-gray-600">Add new game tokens via CSV</p>
            </button>
            
            <button
              onClick={() => router.push('/admin/plays')}
              className="btn-secondary p-4 text-left"
            >
              <Eye className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">View Plays</h3>
              <p className="text-sm text-gray-600">See all player plays and results</p>
            </button>
            
            <button
              onClick={() => router.push('/admin/prizes')}
              className="btn-secondary p-4 text-left"
            >
              <Settings className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Manage Prizes</h3>
              <p className="text-sm text-gray-600">Configure prize types and limits</p>
            </button>
            
            <button
              onClick={() => router.push('/staff')}
              className="btn-secondary p-4 text-left"
            >
              <CheckCircle className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Staff Portal</h3>
              <p className="text-sm text-gray-600">Quick prize redemption</p>
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
