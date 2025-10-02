'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles, Gift, Smartphone, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import PlayerForm from '@/components/PlayerForm'
import ScratchCard from '@/components/ScratchCard'
import ResultDisplay from '@/components/ResultDisplay'
import { playService } from '@/services/playService'
import { PlayResult } from '@/types/play'

function HomePageContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [step, setStep] = useState<'form' | 'scratch' | 'result'>('form')
  const [playResult, setPlayResult] = useState<PlayResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setStep('form')
    }
  }, [token])

  const handlePlaySubmit = async (formData: any) => {
    setIsLoading(true)
    setSubmitError(null) // Clear previous errors
    
    try {
      const result = await playService.claimTokenAndPlay({
        ...formData,
        token: token || formData.token
      })
      
      setPlayResult(result)
      setStep('scratch')
    } catch (error) {
      console.error('Play submission failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit. Please try again.'
      setSubmitError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScratchComplete = () => {
    setStep('result')
  }

  const handlePlayAgain = () => {
    setStep('form')
    setPlayResult(null)
    setSubmitError(null)
  }

  // Clear error when user starts interacting with form
  const handleFormChange = () => {
    if (submitError) {
      setSubmitError(null)
    }
  }

  if (step === 'scratch' && playResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <ScratchCard
            result={playResult.result}
            onComplete={handleScratchComplete}
          />
        </motion.div>
      </div>
    )
  }

  if (step === 'result' && playResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <ResultDisplay
            result={playResult.result}
            onPlayAgain={handlePlayAgain}
          />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                {/* <Sparkles className="w-5 h-5 text-white" /> */}
                <Image src="/logo.jpeg" alt="Logo" width={32} height={32} />
              </div>
              <h1 className="text-xl font-bold text-gradient">
                {process.env.NEXT_PUBLIC_APP_NAME || 'Scratch & Win'}
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Smartphone className="w-4 h-4" />
              <span>Mobile First</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full mb-6 animate-bounce-gentle">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Scratch & Win!
            </h2>
            <p className="text-gray-600 text-lg">
              {token 
                ? 'Enter your details below to start playing!'
                : 'Scan a QR code or enter a token to begin your game.'
              }
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-8"
          >
            {/* Error Display */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800 mb-1">
                      Submission Failed
                    </h4>
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div onChange={handleFormChange}>
              <PlayerForm
                token={token}
                onSubmit={handlePlaySubmit}
                isLoading={isLoading}
              />
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 grid grid-cols-1 gap-4"
          >
            <div className="card p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fair & Secure</h3>
              <p className="text-sm text-gray-600">
                All results are determined server-side with cryptographic fairness
              </p>
            </div>
            
            <div className="card p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-warning-500 to-warning-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
              <p className="text-sm text-gray-600">
                Beautiful, responsive design that works perfectly on all devices
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2024 {process.env.NEXT_PUBLIC_APP_NAME || 'Scratch & Win'}. All rights reserved.</p>
            <p className="mt-2">Play responsibly. Terms and conditions apply.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}
