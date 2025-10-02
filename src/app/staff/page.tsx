'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, XCircle, User, Phone, Mail, Calendar, Gift } from 'lucide-react'
import toast from 'react-hot-toast'
import { staffService } from '@/services/staffService'
import { PlaySearchResult } from '@/types/play'

export default function StaffPortalPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<PlaySearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedPlay, setSelectedPlay] = useState<PlaySearchResult | null>(null)
  const [redeemedBy, setRedeemedBy] = useState('')
  const [notes, setNotes] = useState('')
  const [isRedeeming, setIsRedeeming] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }

    setIsSearching(true)
    try {
      const results = await staffService.searchPlay(searchQuery.trim())
      setSearchResults(results)
      if (results.length === 0) {
        toast.info('No plays found matching your search')
      }
    } catch (error) {
      toast.error('Search failed')
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleRedeem = async (play: PlaySearchResult) => {
    if (!redeemedBy.trim()) {
      toast.error('Please enter your name')
      return
    }

    setIsRedeeming(true)
    try {
      await staffService.redeemPlay(play.id, redeemedBy.trim(), notes.trim() || undefined)
      toast.success('Play redeemed successfully!')
      setSelectedPlay(null)
      setRedeemedBy('')
      setNotes('')
      // Refresh search results
      handleSearch()
    } catch (error) {
      toast.error('Redemption failed')
      console.error('Redemption error:', error)
    } finally {
      setIsRedeeming(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
              <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                Prize Redemption
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search for Play</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter result code, phone number, or email..."
                className="input"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="btn-primary px-6"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Search by result code, phone number, or email address
          </p>
        </motion.div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Results</h2>
            <div className="space-y-4">
              {searchResults.map((play, index) => (
                <motion.div
                  key={play.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {play.firstName} {play.lastName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          play.isRedeemed 
                            ? 'bg-success-100 text-success-800' 
                            : 'bg-warning-100 text-warning-800'
                        }`}>
                          {play.isRedeemed ? 'Redeemed' : 'Pending'}
                        </span>
                        {play.isWinner && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                            Winner
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{play.phone}</span>
                        </div>
                        {play.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{play.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(play.createdAt)}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{play.prizeType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">
                            {play.resultCode}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!play.isRedeemed && play.isWinner ? (
                        <button
                          onClick={() => setSelectedPlay(play)}
                          className="btn-success"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Redeem
                        </button>
                      ) : play.isRedeemed ? (
                        <div className="flex items-center gap-2 text-success-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Redeemed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm">No Prize</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Redemption Modal */}
        {selectedPlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPlay(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Redeem Prize
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Player</p>
                  <p className="font-medium">{selectedPlay.firstName} {selectedPlay.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prize</p>
                  <p className="font-medium">{selectedPlay.prizeType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Result Code</p>
                  <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {selectedPlay.resultCode}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={redeemedBy}
                    onChange={(e) => setRedeemedBy(e.target.value)}
                    placeholder="Enter your name"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes..."
                    className="input"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedPlay(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRedeem(selectedPlay)}
                  disabled={isRedeeming || !redeemedBy.trim()}
                  className="btn-success flex-1"
                >
                  {isRedeeming ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Confirm Redemption'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
