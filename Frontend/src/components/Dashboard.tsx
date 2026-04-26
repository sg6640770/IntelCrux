import React, { useEffect } from 'react'
import { VideoInput } from './VideoInput'
import { HistorySection } from './HistorySection'
import { useVideoSummaries } from '../hooks/useVideoSummaries'

interface DashboardProps {
  mode: 'light' | 'dark'
  userEmail: string | "null"
}


export const Dashboard: React.FC<DashboardProps> = ({ mode, userEmail }) => {

  const { summaries, loading, addSummary, fetchSummaries } = useVideoSummaries(userEmail)

  useEffect(() => {
    fetchSummaries()
  }, [userEmail])

  return (
    <div
      className={`w-full max-w-5xl mx-auto px-4 space-y-8 transition-colors duration-500 ${
        mode === 'dark' ? 'text-white' : 'text-black'
      }`}
    >
 <VideoInput
  onSummarizationStart={addSummary}
  mode={mode}
  userEmail={userEmail} 
/>


      <HistorySection
        summaries={summaries}
        loading={loading}
        onRefresh={fetchSummaries}
        mode={mode} 
      />
    </div>
  )
}
