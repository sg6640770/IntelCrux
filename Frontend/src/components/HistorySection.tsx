import React, { useRef, useState } from 'react'
import { VideoSummary } from '../types'
import { SummaryCard } from './SummaryCard'
import { ChevronLeft, ChevronRight, History } from 'lucide-react'

interface HistorySectionProps {
  summaries: VideoSummary[]
  loading: boolean
  onRefresh?: () => void
  mode: 'light' | 'dark' 
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  summaries,
  loading,
  onRefresh,
  mode
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const scroll = (direction: 'left' | 'right') => {
    setCurrentIndex((prev) => {
      const maxIndex = summaries.length - 1
      if (direction === 'left') return prev > 0 ? prev - 1 : maxIndex
      else return prev < maxIndex ? prev + 1 : 0
    })
  }

  const currentSummary = summaries[currentIndex]

  return (
    <div
      className={`w-full rounded-2xl shadow-2xl border p-6 sm:p-8 space-y-6
        ${mode === 'dark'
          ? 'bg-grey-700 text-white border-gray-600'
          : 'bg-white/90 text-black border-gray-200 backdrop-blur-md'
        }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Summary History
            </h2>
            <p className={`text-sm ${mode === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
              Your previously summarized videos
            </p>
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition disabled:opacity-50
              ${mode === 'dark'
                ? 'text-gray-200 hover:text-white hover:bg-gray-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 4v6h6M20 20v-6h-6M4 20l16-16" />
            </svg>
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Loading or Empty */}
      {loading && summaries.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Loading your summaries...</p>
        </div>
      ) : summaries.length === 0 ? (
        <div className="text-center py-12">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 
            ${mode === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
            <History className={`w-8 h-8 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-400'}`} />
          </div>
          <h3 className={`text-lg font-medium ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
            No summaries yet
          </h3>
          <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
            Start by summarizing your first YouTube video above
          </p>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          {/* Arrows */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 border rounded-full p-2 shadow
              ${mode === 'dark'
                ? 'bg-gray-600 text-white hover:bg-gray-500'
                : 'bg-white/90 text-gray-600 hover:bg-gray-100'
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll('right')}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 border rounded-full p-2 shadow
              ${mode === 'dark'
                ? 'bg-gray-600 text-white hover:bg-gray-500'
                : 'bg-white/90 text-gray-600 hover:bg-gray-100'
              }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Single Card Slider */}
          <div className="flex justify-center items-center transition-all duration-500 ease-in-out">
            <div className="w-full max-w-xl">
              
              <SummaryCard summary={currentSummary} />
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="mt-4 flex justify-center space-x-2">
            {summaries.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 
                  ${idx === currentIndex ? 'bg-green-600' : mode === 'dark' ? 'bg-gray-500' : 'bg-gray-300'}`}
              ></span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
