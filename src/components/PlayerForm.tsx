'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { User, Phone, Mail, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const playerSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20, 'Phone number too long'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  age: z.number().min(18, 'You must be at least 18 years old').max(120, 'Invalid age'),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
})

type PlayerFormData = z.infer<typeof playerSchema>

interface PlayerFormProps {
  token?: string | null
  onSubmit: (data: PlayerFormData) => void
  isLoading: boolean
}

export default function PlayerForm({ token, onSubmit, isLoading }: PlayerFormProps) {
  const [showTokenInput, setShowTokenInput] = useState(!token)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      token: token || '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      age: 18,
      acceptTerms: false,
    },
    mode: 'onChange'
  })

  const watchedToken = watch('token')
  const watchedAcceptTerms = watch('acceptTerms')

  const handleFormSubmit = (data: PlayerFormData) => {
    if (!isValid) {
      toast.error('Please fill in all required fields correctly')
      return
    }
    
    onSubmit(data)
  }

  const handleTokenChange = (value: string) => {
    setValue('token', value, { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Token Input */}
      {showTokenInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <label htmlFor="token" className="block text-sm font-medium text-gray-700">
            Game Token
          </label>
          <div className="relative">
            <input
              {...register('token')}
              type="text"
              id="token"
              placeholder="Enter your game token"
              className={`input ${errors.token ? 'input-error' : ''}`}
              onChange={(e) => handleTokenChange(e.target.value)}
            />
            {errors.token && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <AlertCircle className="w-5 h-5 text-error-500" />
              </div>
            )}
          </div>
          {errors.token && (
            <p className="text-sm text-error-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.token.message}
            </p>
          )}
        </motion.div>
      )}

      {/* Token Display */}
      {token && !showTokenInput && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-700">Game Token</p>
              <p className="text-lg font-mono text-primary-900">{token}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowTokenInput(true)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Change
            </button>
          </div>
        </motion.div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <div className="relative">
            <input
              {...register('firstName')}
              type="text"
              id="firstName"
              placeholder="Enter your first name"
              className={`input ${errors.firstName ? 'input-error' : ''}`}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            {errors.firstName && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <AlertCircle className="w-5 h-5 text-error-500" />
              </div>
            )}
          </div>
          {errors.firstName && (
            <p className="text-sm text-error-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <div className="relative">
            <input
              {...register('lastName')}
              type="text"
              id="lastName"
              placeholder="Enter your last name"
              className={`input ${errors.lastName ? 'input-error' : ''}`}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            {errors.lastName && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <AlertCircle className="w-5 h-5 text-error-500" />
              </div>
            )}
          </div>
          {errors.lastName && (
            <p className="text-sm text-error-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <div className="relative">
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            placeholder="Enter your phone number"
            className={`input ${errors.phone ? 'input-error' : ''}`}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Phone className="w-5 h-5 text-gray-400" />
          </div>
          {errors.phone && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AlertCircle className="w-5 h-5 text-error-500" />
            </div>
          )}
        </div>
        {errors.phone && (
          <p className="text-sm text-error-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <div className="relative">
          <input
            {...register('email')}
            type="email"
            id="email"
            placeholder="Enter your email address"
            className={`input ${errors.email ? 'input-error' : ''}`}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          {errors.email && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AlertCircle className="w-5 h-5 text-error-500" />
            </div>
          )}
        </div>
        {errors.email && (
          <p className="text-sm text-error-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Age */}
      <div className="space-y-2">
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Age *
        </label>
        <div className="relative">
          <input
            {...register('age', { valueAsNumber: true })}
            type="number"
            id="age"
            min="18"
            max="120"
            placeholder="Enter your age"
            className={`input ${errors.age ? 'input-error' : ''}`}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          {errors.age && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AlertCircle className="w-5 h-5 text-error-500" />
            </div>
          )}
        </div>
        {errors.age && (
          <p className="text-sm text-error-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.age.message}
          </p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            {...register('acceptTerms')}
            type="checkbox"
            className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">
            I accept the{' '}
            <a href="/terms" className="text-primary-600 hover:text-primary-700 underline">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-sm text-error-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={!isValid || isLoading}
        className={`btn-primary w-full py-4 text-lg font-semibold ${
          !isValid || isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        whileHover={{ scale: isValid && !isLoading ? 1.02 : 1 }}
        whileTap={{ scale: isValid && !isLoading ? 0.98 : 1 }}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Start Playing
          </div>
        )}
      </motion.button>

      {/* Help Text */}
      <div className="text-center text-sm text-gray-600">
        <p>By playing, you agree to our terms and conditions.</p>
        <p className="mt-1">Results are determined fairly and securely.</p>
      </div>
    </form>
  )
}
