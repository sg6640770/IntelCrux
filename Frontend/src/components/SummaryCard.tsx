import React, { useState, useEffect, useRef } from 'react'
import { VideoSummary } from '../types'
import {
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  CheckCircle,
  XCircle,
  Volume2,
  Pause,
  Play,
  StopCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { VideoChat } from './VideoChat'

interface SummaryCardProps {
  summary: VideoSummary
  mode: 'light' | 'dark'
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary, mode }) => {
  const [copied, setCopied] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [rate, setRate] = useState(1)

  const handleDownloadPDF = async () => {
  try {
    const response = await fetch('http://localhost:5678/webhook-test/get-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        videoId: summary.videoId
      })
    })

    if (!response.ok) {
      throw new Error('Failed to download PDF')
    }

    const blob = await response.blob()
    const pdfBlob = new Blob([blob], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(pdfBlob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'summary.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()

    window.URL.revokeObjectURL(url)

    toast.success('PDF downloaded successfully')
  } catch (error) {
    console.error(error)
    toast.error('Failed to download PDF')
  }
}

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices()
      setVoices(allVoices)
      const defaultVoice = allVoices.find(v => /female/i.test(v.name)) || allVoices[0]
      setVoice(defaultVoice || null)
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const handleCopy = async () => {
    const textToCopy = summary.summary || ''
    if (!textToCopy.trim()) {
      toast.error('No summary text to copy')
      return
    }

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      toast.success('Summary copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy summary')
    }
  }

 const sanitizeText = (text: string) => {
  return text
    .replace(/[#>*_`~|]/g, '')                
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')       
    .replace(/[-]+/g, ' ')                    
    .replace(/\n{2,}/g, '\n')                 
    .replace(/\n/g, '. ')                    
    .replace(/[|]{2,}/g, ' ')                 
    .trim()
}


  const handleSpeak = () => {
    if (!summary.summary || isSpeaking) return

    const cleaned = sanitizeText(summary.summary)

    const utterance = new SpeechSynthesisUtterance(cleaned)
    utterance.voice = voice || null
    utterance.rate = rate
    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const handlePauseResume = () => {
    if (!isSpeaking) return
    if (isPaused) {
      speechSynthesis.resume()
      setIsPaused(false)
    } else {
      speechSynthesis.pause()
      setIsPaused(true)
    }
  }

  const handleStop = () => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
  }

  const getStatusIcon = () => {
    switch (summary.status) {
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (summary.status) {
      case 'pending':
        return 'Processing...'
      case 'completed':
        return 'Completed'
      case 'failed':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  const getThumbnail = () => {
    const isValid = summary.videoThumbnail && !summary.videoThumbnail.includes('placeholder')
    if (isValid) return summary.videoThumbnail

    const match = summary.videoUrl?.match(/(?:v=|\/|be\/|shorts\/|embed\/)([\w-]{11})/)
    const videoId = match?.[1]
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : 'https://dummyimage.com/320x180/cccccc/000000&text=No+Thumbnail'
  }

  const hasSummaryText = summary.summary?.trim().length > 0

  return (
    <div className={`rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-shadow
      ${mode === 'dark'
        ? 'bg-gray-800 border-gray-700 text-white'
        : 'bg-white/80 backdrop-blur-sm border-white/20 text-black'
      }`}
    >
      <div className="flex flex-col sm:flex-row w-full">
        {/* Thumbnail */}
        <div className="w-full sm:w-40 flex-shrink-0">
          <img
            src={getThumbnail()}
            alt={summary.videoTitle || 'YouTube Video'}
            className="w-full h-40 sm:h-24 object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2 gap-2">
            <h3 className={`font-semibold line-clamp-2 text-sm sm:text-base flex-1
              ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {summary.videoTitle || 'Untitled Video'}
            </h3>
            <a
              href={summary.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${mode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Status */}
          <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-3
            ${mode === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}
          >
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Summary Text + Controls */}
          {summary.status === 'completed' && hasSummaryText && (
            <div className="space-y-3">
              
              <div className={`prose max-w-none rounded-lg p-3 overflow-x-auto text-sm sm:text-base
                ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'}`}
              >
                <ReactMarkdown>{summary.summary}</ReactMarkdown>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className={`flex items-center space-x-2 text-sm transition-colors
                    ${mode === 'dark' ? 'text-purple-400 hover:text-purple-200' : 'text-purple-600 hover:text-purple-800'}`}
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                </button>

                {/* Speak Button */}
                <button
                  onClick={handleSpeak}
                  disabled={isSpeaking}
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Speak</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className={`flex items-center space-x-2 text-sm transition-colors
                  ${mode === 'dark'
                  ? 'text-green-400 hover:text-green-200'
                  : 'text-green-600 hover:text-green-800'
                  }`}
>
  📄 <span>Download PDF</span>
</button>

                {/* Pause/Resume */}
                {isSpeaking && (
                  <button
                    onClick={handlePauseResume}
                    className="flex items-center space-x-2 text-sm text-yellow-500 hover:text-yellow-600"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>
                )}

                {/* Stop */}
                {isSpeaking && (
                  <button
                    onClick={handleStop}
                    className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>Stop</span>
                  </button>
                )}
              </div>

              {/* Voice Selector */}
              <div className="mt-2">
                <label className="block text-sm mb-1">Voice:</label>
                <select
                  value={voice?.name || ''}
                  onChange={(e) => {
                    const selected = voices.find(v => v.name === e.target.value)
                    if (selected) setVoice(selected)
                  }}
                  className="w-full p-2 rounded border bg-white text-black"
                >
                  {voices.map(v => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>

              {/* Speed Control */}
              <div className="mt-2">
                <label className="block text-sm mb-1">Speed: {rate.toFixed(1)}x</label>
                <input
                  type="range"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Status messages */}
          {summary.status === 'completed' && !hasSummaryText && (
            <div className={`rounded-lg p-3 text-sm
              ${mode === 'dark' ? 'bg-orange-900 text-orange-100' : 'bg-orange-50 text-orange-700'}`}
            >
              Summary completed but no text available. Check your n8n workflow output.
            </div>
          )}

          {summary.status === 'pending' && (
            <div className={`rounded-lg p-3 text-sm
              ${mode === 'dark' ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-50 text-yellow-700'}`}
            >
              Your video is being processed. This may take a few minutes...
            </div>
          )}

          {summary.status === 'failed' && (
            <div className={`rounded-lg p-3 text-sm
              ${mode === 'dark' ? 'bg-red-900 text-red-100' : 'bg-red-50 text-red-700'}`}
            >
              Failed to process this video. Please try again.
            </div>
          )}

          {/* CHATBOT SECTION */}
          {summary.videoId && summary.status === 'completed' && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">
                Ask questions about this video
              </h4>
              <VideoChat videoId={summary.videoId} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
