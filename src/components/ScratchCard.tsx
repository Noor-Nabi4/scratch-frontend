'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Gift, Trophy, Star } from 'lucide-react'
import { PlayResult } from '@/types/play'

interface ScratchCardProps {
  result: PlayResult['result']
  onComplete: () => void
}

export default function ScratchCard({ result, onComplete }: ScratchCardProps) {
  const [isScratched, setIsScratched] = useState(false)
  const [scratchProgress, setScratchProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = cardRef.current?.getBoundingClientRect()
    if (rect) {
      canvas.width = rect.width
      canvas.height = rect.height
    }

    // Fill with scratch surface
    ctx.fillStyle = '#9ca3af'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add scratch texture
    ctx.fillStyle = '#6b7280'
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 3 + 1
      ctx.fillRect(x, y, size, size)
    }

    // Add "SCRATCH HERE" text
    ctx.fillStyle = '#374151'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2)
    ctx.font = '16px Arial'
    ctx.fillText('Use your finger to reveal your prize!', canvas.width / 2, canvas.height / 2 + 30)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true)
    scratch(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) {
      scratch(e)
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    const touch = e.touches[0]
    scratch(touch)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    if (isDrawing) {
      const touch = e.touches[0]
      scratch(touch)
    }
  }

  const handleTouchEnd = () => {
    setIsDrawing(false)
  }

  const scratch = (e: React.MouseEvent | React.Touch) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX || (e as React.Touch).clientX) - rect.left
    const y = (e.clientY || (e as React.Touch).clientY) - rect.top

    // Use composite operation to "erase" the scratch surface
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, Math.PI * 2)
    ctx.fill()

    // Calculate scratch progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let transparentPixels = 0

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++
      }
    }

    const progress = (transparentPixels / (pixels.length / 4)) * 100
    setScratchProgress(progress)

    // If 30% or more is scratched, reveal the result
    if (progress >= 30 && !isScratched) {
      setIsScratched(true)
      setIsAnimating(true)
      
      setTimeout(() => {
        onComplete()
      }, 2000)
    }
  }

  const getPrizeIcon = () => {
    if (result.isWinner) {
      switch (result.prizeType.toLowerCase()) {
        case 'grand prize':
          return <Trophy className="w-16 h-16 text-yellow-400" />
        case 'medium prize':
          return <Star className="w-16 h-16 text-blue-400" />
        case 'small prize':
          return <Gift className="w-16 h-16 text-green-400" />
        default:
          return <Gift className="w-16 h-16 text-yellow-400" />
      }
    }
    return <Sparkles className="w-16 h-16 text-gray-400" />
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

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Scratch & Win!</h2>
        <p className="text-gray-600">Use your finger to scratch and reveal your prize</p>
      </div>

      <div className="relative">
        <motion.div
          ref={cardRef}
          className="scratch-card min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Scratch Surface */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'none' }}
          />

          {/* Revealed Content */}
          <AnimatePresence>
            {isScratched && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
              >
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
                    className="mb-4"
                  >
                    {getPrizeIcon()}
                  </motion.div>
                  
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className={`text-2xl font-bold mb-2 bg-gradient-to-r ${getPrizeColor()} bg-clip-text text-transparent`}
                  >
                    {result.isWinner ? 'Congratulations!' : 'Better Luck Next Time!'}
                  </motion.h3>
                  
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-lg text-white/90 mb-4"
                  >
                    {result.prizeType}
                    {result.prizeValue && (
                      <span className="block text-sm text-white/70 mt-1">
                        {result.prizeValue}
                      </span>
                    )}
                  </motion.p>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
                  >
                    <p className="text-sm text-white/80 mb-2">Your Result Code:</p>
                    <p className="text-lg font-mono font-bold text-white">
                      {result.resultCode}
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Progress Indicator */}
        {!isScratched && (
          <div className="mt-4 text-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(scratchProgress, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {scratchProgress < 30 
                ? `Scratch more to reveal your prize! (${Math.round(scratchProgress)}%)`
                : 'Keep scratching to reveal your prize!'
              }
            </p>
          </div>
        )}

        {/* Instructions */}
        {!isScratched && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              💡 Tip: Use your finger to scratch the surface above
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
