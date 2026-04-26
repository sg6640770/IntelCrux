import { useEffect, useState } from 'react'
import { VideoSummary } from '../types'

export const useVideoSummaries = (userEmail: string) => {
  const [summaries, setSummaries] = useState<VideoSummary[]>([])
  const [loading, setLoading] = useState(false)

  const addSummary = (summary: VideoSummary) => {
    setSummaries(prev => [summary, ...prev])
  }

  const fetchSummaries = async () => {
    console.log('Fetching summaries for', userEmail)

    if (!userEmail) return
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8080/api/summaries/${userEmail}`)
      const data = await res.json()
      console.log('Fetched from backend:', data)


      const summariesWithStatus: VideoSummary[] = data.map((item: any) => ({
        ...item,
        status: 'completed',
      }))

      setSummaries(summariesWithStatus)
    } catch (error) {
      console.error('Failed to fetch summaries', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    summaries,
    loading,
    addSummary,
    fetchSummaries,
  }
}
