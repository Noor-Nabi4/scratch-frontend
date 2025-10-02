'use client'

import React, { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
  isLoading?: boolean
  helperText?: string
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      isLoading = false,
      helperText,
      variant = 'default',
      size = 'md',
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password') 
      : type

    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    // Size variants
    const sizeClasses = {
      sm: 'h-9 text-sm',
      md: 'h-11 text-sm',
      lg: 'h-12 text-base'
    }

    // Padding based on icons
    const getPadding = () => {
      let paddingLeft = 'pl-4'
      let paddingRight = 'pr-4'

      if (leftIcon) {
        paddingLeft = size === 'sm' ? 'pl-9' : size === 'lg' ? 'pl-12' : 'pl-10'
      }

      if (rightIcon || showPasswordToggle || isLoading) {
        paddingRight = size === 'sm' ? 'pr-9' : size === 'lg' ? 'pr-12' : 'pr-10'
      }

      return `${paddingLeft} ${paddingRight}`
    }

    // Base input classes
    const baseInputClasses = `
      w-full
      ${sizeClasses[size]}
      ${getPadding()}
      bg-white
      border
      rounded-lg
      font-medium
      transition-all
      duration-200
      ease-in-out
      placeholder:text-gray-400
      disabled:bg-gray-50
      disabled:text-gray-500
      disabled:cursor-not-allowed
      ${isFocused ? 'ring-2 ring-blue-100' : ''}
    `

    // Variant-specific classes
    const variantClasses = {
      default: error 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100',
      filled: error
        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100'
        : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-blue-100',
      outlined: error
        ? 'border-2 border-red-300 focus:border-red-500 focus:ring-red-100'
        : 'border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-100'
    }

    // Icon positioning classes
    const iconPositionClasses = {
      left: size === 'sm' ? 'left-2.5' : size === 'lg' ? 'left-4' : 'left-3',
      right: size === 'sm' ? 'right-2.5' : size === 'lg' ? 'right-4' : 'right-3'
    }

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative flex items-center">
          {/* Left Icon */}
          {leftIcon && (
            <div className={`
              absolute 
              ${iconPositionClasses.left} 
              top-1/2 
              transform 
              -translate-y-1/2 
              text-gray-400
              pointer-events-none
              z-10
            `}>
              <div className={iconSizeClasses[size]}>
                {leftIcon}
              </div>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={inputType}
            id={inputId}
            className={`
              ${baseInputClasses}
              ${variantClasses[variant]}
              ${className}
            `}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />

          {/* Right Side Icons */}
          <div className={`
            absolute 
            ${iconPositionClasses.right} 
            top-1/2 
            transform 
            -translate-y-1/2 
            flex 
            items-center 
            gap-1
          `}>
            {/* Loading Spinner */}
            {isLoading && (
              <div className={`
                ${iconSizeClasses[size]}
                border-2 
                border-gray-300 
                border-t-blue-500 
                rounded-full 
                animate-spin
              `} />
            )}

            {/* Password Toggle */}
            {showPasswordToggle && !isLoading && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`
                  ${iconSizeClasses[size]}
                  text-gray-400 
                  hover:text-gray-600 
                  focus:outline-none 
                  focus:text-gray-600
                  transition-colors
                  duration-150
                `}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !showPasswordToggle && !isLoading && (
              <div className={`${iconSizeClasses[size]} text-gray-400`}>
                {rightIcon}
              </div>
            )}

            {/* Error Indicator */}
            {error && !isLoading && !showPasswordToggle && !rightIcon && (
              <div className={`${iconSizeClasses[size]} text-red-500 flex items-center justify-center`}>
                <span className="text-sm font-bold">!</span>
              </div>
            )}
          </div>
        </div>

        {/* Helper Text or Error Message */}
        {(error || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2"
          >
            {error ? (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            ) : (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </motion.div>
        )}
      </div>
    )
  }
)

InputField.displayName = 'InputField'

export default InputField
