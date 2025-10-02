'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Lock, Mail, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminService } from '@/services/adminService'
import InputField from '@/components/ui/InputField'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Clear login error when user starts typing
  const watchedEmail = watch('email')
  const watchedPassword = watch('password')
  
  useEffect(() => {
    if (loginError && (watchedEmail || watchedPassword)) {
      setLoginError(null)
    }
  }, [watchedEmail, watchedPassword, loginError])

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setLoginError(null) // Clear previous errors
    
    try {
      await adminService.login(data)
      toast.success('Login successful!')
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.'
      setLoginError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Login Error Display */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <p className="text-sm text-red-600 font-medium">{loginError}</p>
              </motion.div>
            )}
            
            {/* Email Field */}
            <InputField
              {...register('email')}
              type="email"
              id="email"
              label="Email Address"
              placeholder="Enter your email"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              disabled={isLoading}
              autoComplete="email"
              size="md"
            />

            {/* Password Field */}
            <InputField
              {...register('password')}
              type="password"
              id="password"
              label="Password"
              placeholder="Enter your password"
              leftIcon={<Lock className="w-5 h-5" />}
              showPasswordToggle
              error={errors.password?.message}
              disabled={isLoading}
              autoComplete="current-password"
              size="md"
            />

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Admin:</strong> admin@example.com / admin123</p>
              <p><strong>Staff:</strong> staff@example.com / staff123</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <p>&copy; 2024 {process.env.NEXT_PUBLIC_APP_NAME || 'Scratch & Win'}. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  )
}
