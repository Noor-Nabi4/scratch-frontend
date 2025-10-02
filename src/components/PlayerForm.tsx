'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { User, Phone, Mail, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import InputField from '@/components/ui/InputField'

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
        >
          <InputField
            {...register('token')}
            type="text"
            id="token"
            label="Game Token"
            placeholder="Enter your game token"
            error={errors.token?.message}
            disabled={isLoading}
            helperText="Enter the token from your QR code or scratch card"
            onChange={(e) => handleTokenChange(e.target.value)}
          />
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
        <InputField
          {...register('firstName')}
          type="text"
          id="firstName"
          label="First Name *"
          placeholder="Enter your first name"
          leftIcon={<User className="w-5 h-5" />}
          error={errors.firstName?.message}
          disabled={isLoading}
          autoComplete="given-name"
        />

        <InputField
          {...register('lastName')}
          type="text"
          id="lastName"
          label="Last Name *"
          placeholder="Enter your last name"
          leftIcon={<User className="w-5 h-5" />}
          error={errors.lastName?.message}
          disabled={isLoading}
          autoComplete="family-name"
        />
      </div>

      {/* Phone */}
      <InputField
        {...register('phone')}
        type="tel"
        id="phone"
        label="Phone Number *"
        placeholder="Enter your phone number"
        leftIcon={<Phone className="w-5 h-5" />}
        error={errors.phone?.message}
        disabled={isLoading}
        autoComplete="tel"
        helperText="Include country code if international"
      />

      {/* Email */}
      <InputField
        {...register('email')}
        type="email"
        id="email"
        label="Email Address *"
        placeholder="Enter your email address"
        leftIcon={<Mail className="w-5 h-5" />}
        error={errors.email?.message}
        disabled={isLoading}
        autoComplete="email"
        helperText="We'll use this to contact you about your prize"
      />

      {/* Age */}
      <InputField
        {...register('age', { valueAsNumber: true })}
        type="number"
        id="age"
        label="Age *"
        placeholder="Enter your age"
        leftIcon={<Calendar className="w-5 h-5" />}
        error={errors.age?.message}
        disabled={isLoading}
        min={18}
        max={120}
        helperText="You must be 18 or older to participate"
      />

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
