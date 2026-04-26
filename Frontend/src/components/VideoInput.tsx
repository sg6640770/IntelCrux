import React, { useState } from 'react'
import { getVideoSummary } from '../services/n8nService'
import { SummaryCard } from './SummaryCard'
import { VideoSummary } from '../types'
import { Loader2 } from 'lucide-react'
import { saveSummaryToBackend } from '../services/summaryService'

interface VideoInputProps {
  mode: 'light' | 'dark'
  userEmail: string
  onSummarizationStart:string
}

export const VideoInput: React.FC<VideoInputProps> = ({ mode, userEmail }) => {
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [summaryData, setSummaryData] = useState<VideoSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoUrl.trim()) return

    setLoading(true)
    setError(null)

    try {
const result = await getVideoSummary(videoUrl)

const newSummary: VideoSummary = {
  id: result.id || 'job-' + Date.now(),
  videoUrl: result.videoUrl,
  videoTitle: result.videoTitle,
  summary: result.summary,
  transcript: result.transcript,     
  videoId: result.videoId,           
  status: result.status || 'completed',
  videoThumbnail: `https://img.youtube.com/vi/${result.videoId}/0.jpg`,
}

setSummaryData(newSummary)

await saveSummaryToBackend({
  userEmail,
  videoUrl: newSummary.videoUrl,
  videoTitle: newSummary.videoTitle,
  summary: newSummary.summary,
  videoId: newSummary.videoId,       
  transcript: newSummary.transcript  
})


    } catch (err) {
      console.error(err)
      setError('Failed to fetch summary. Please try again.')
      setSummaryData(null)
    } finally {
      setLoading(false)
    }
  }

  const extractVideoId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/.*[?&]v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    )
    return match ? match[1] : ''
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 sm:mt-8 space-y-6 px-4 sm:px-0 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          type="url"
          required
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube video URL"
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500
            ${mode === 'dark'
              ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
              : 'bg-white text-black border-gray-300'}`}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto flex justify-center items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Summarize'
          )}
        </button>
      </form>

      {error && (
        <div
          className={`border p-3 rounded-lg text-sm sm:text-base ${
            mode === 'dark'
              ? 'text-red-200 bg-red-900 border-red-700'
              : 'text-red-600 bg-red-50 border-red-200'
          }`}
        >
          {error}
        </div>
      )}

      {summaryData && <SummaryCard summary={summaryData} mode={mode} />}
    </div>
  )
}
