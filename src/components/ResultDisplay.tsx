'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Mail, MessageCircle, RotateCcw, Trophy, Gift, Star, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface ResultDisplayProps {
  result: {
    prizeType: string
    prizeValue?: string
    description?: string
    isWinner: boolean
    resultCode: string
  }
  onPlayAgain: () => void
}

export default function ResultDisplay({ result, onPlayAgain }: ResultDisplayProps) {
  const [isSharing, setIsSharing] = useState(false)

  const getPrizeIcon = () => {
    if (result.isWinner) {
      switch (result.prizeType.toLowerCase()) {
        case 'grand prize':
          return <Trophy className="w-20 h-20 text-yellow-400" />
        case 'medium prize':
          return <Star className="w-20 h-20 text-blue-400" />
        case 'small prize':
          return <Gift className="w-20 h-20 text-green-400" />
        default:
          return <Gift className="w-20 h-20 text-yellow-400" />
      }
    }
    return <Sparkles className="w-20 h-20 text-gray-400" />
  }

  const getPrizeColor = () => {
    if (result.isWinner) {
      switch (result.prizeType.toLowerCase()) {
        case 'grand prize':
          return 'from-yellow-400 to-orange-500'
        case 'medium prize':
          return 'from-blue-400 to-purple-500'
        case 'small prize':
          return 'from-green-400 to-emerald-500'
        default:
          return 'from-yellow-400 to-orange-500'
      }
    }
    return 'from-gray-400 to-gray-500'
  }

  const getBackgroundGradient = () => {
    if (result.isWinner) {
      switch (result.prizeType.toLowerCase()) {
        case 'grand prize':
          return 'from-yellow-50 to-orange-50'
        case 'medium prize':
          return 'from-blue-50 to-purple-50'
        case 'small prize':
          return 'from-green-50 to-emerald-50'
        default:
          return 'from-yellow-50 to-orange-50'
      }
    }
    return 'from-gray-50 to-gray-100'
  }

  const handleShare = async () => {
    setIsSharing(true)
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${process.env.NEXT_PUBLIC_APP_NAME || 'Scratch & Win'} - ${result.isWinner ? 'Winner!' : 'Played'}`,
          text: `I just played ${process.env.NEXT_PUBLIC_APP_NAME || 'Scratch & Win'} and ${result.isWinner ? 'WON' : 'played'}! My result code is: ${result.resultCode}${result.isWinner ? ` - Prize: ${result.prizeType}` : ''}`,
          url: window.location.origin,
        })
      } else {
        // Fallback: copy to clipboard
        const text = `I just played ${process.env.NEXT_PUBLIC_APP_NAME || 'Scratch & Win'} and ${result.isWinner ? 'WON' : 'played'}! My result code is: ${result.resultCode}${result.isWinner ? ` - Prize: ${result.prizeType}` : ''}`
        await navigator.clipboard.writeText(text)
        toast.success('Result copied to clipboard!')
      }
    } catch (error) {
      console.error('Share failed:', error)
      toast.error('Failed to share result')
    } finally {
      setIsSharing(false)
    }
  }

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `I just played ${process.env.NEXT_PUBLIC_APP_NAME || 'Scratch & Win'} and ${result.isWinner ? 'WON' : 'played'}! ` +
      `My result code is: ${result.resultCode}${result.isWinner ? ` - Prize: ${result.prizeType}` : ''}`
    )
    const whatsappUrl = `https://wa.me/?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(
      `${result.isWinner ? '🎉 I Won!' : 'Played'} - ${process.env.NEXT_PUBLIC_APP_NAME || 'Scratch & Win'}`
    )
    const body = encodeURIComponent(
      `Hi!\n\nI just played ${process.env.NEXT_PUBLIC_APP_NAME || 'Scratch & Win'} and ${result.isWinner ? 'WON' : 'played'}!\n\n` +
      `Result Code: ${result.resultCode}\n` +
      `${result.isWinner ? `Prize: ${result.prizeType}\n` : ''}\n` +
      `Check it out: ${window.location.origin}`
    )
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
    window.location.href = mailtoUrl
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`card p-8 bg-gradient-to-br ${getBackgroundGradient()}`}
      >
        {/* Result Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="mb-6"
          >
            {getPrizeIcon()}
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className={`text-3xl font-bold mb-2 bg-gradient-to-r ${getPrizeColor()} bg-clip-text text-transparent`}
          >
            {result.isWinner ? 'Congratulations!' : 'Better Luck Next Time!'}
          </motion.h2>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-4"
          >
            <p className="text-xl text-gray-700 mb-2">
              {result.prizeType}
            </p>
            {result.prizeValue && (
              <p className="text-lg text-gray-600">
                {result.prizeValue}
              </p>
            )}
            {result.description && (
              <p className="text-sm text-gray-500 mt-1">
                {result.description}
              </p>
            )}
          </motion.div>
        </div>

        {/* Result Code */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            Your Result Code
          </h3>
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
              {result.resultCode}
            </p>
          </div>
          <p className="text-sm text-gray-600 text-center mt-3">
            {result.isWinner 
              ? 'Keep this code safe - you\'ll need it to claim your prize!'
              : 'Thanks for playing!'
            }
          </p>
        </motion.div>

        {/* Winner Instructions */}
        {result.isWinner && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="bg-gradient-to-r from-success-50 to-emerald-50 border border-success-200 rounded-2xl p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-success-800 mb-3 text-center">
              🎉 How to Claim Your Prize
            </h3>
            <ol className="text-sm text-success-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-semibold">1.</span>
                <span>Visit our store with this result code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">2.</span>
                <span>Show the code to our staff</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">3.</span>
                <span>Enjoy your {result.prizeType}!</span>
              </li>
            </ol>
          </motion.div>
        )}

        {/* Share Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
            Share Your Result
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            <motion.button
              onClick={handleShare}
              disabled={isSharing}
              className="btn-secondary w-full py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-5 h-5 mr-2" />
              {isSharing ? 'Sharing...' : 'Share Result'}
            </motion.button>
            
            <motion.button
              onClick={handleWhatsAppShare}
              className="btn-success w-full py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Share on WhatsApp
            </motion.button>
            
            <motion.button
              onClick={handleEmailShare}
              className="btn-primary w-full py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mail className="w-5 h-5 mr-2" />
              Share via Email
            </motion.button>
          </div>
        </motion.div>

        {/* Play Again Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <motion.button
            onClick={onPlayAgain}
            className="btn-secondary w-full py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        className="mt-6 text-center text-sm text-gray-600"
      >
        <p>Thank you for playing {process.env.NEXT_PUBLIC_APP_NAME || 'Scratch & Win'}!</p>
        <p className="mt-1">Play responsibly. Terms and conditions apply.</p>
      </motion.div>
    </div>
  )
}
