export const saveSummaryToBackend = async ({
  userEmail,
  videoUrl,
  videoTitle,
  summary,
  videoId,
  transcript
}: {
  userEmail: string
  videoUrl: string
  videoTitle: string
  summary: string
  videoId: string
  transcript: string
}) => {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'

  // Use videoId coming from n8n ONLY
  const videoThumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : 'https://via.placeholder.com/320x180?text=No+Thumbnail'

  console.log('Saving to backend:', {
    videoId,
    transcriptLength: transcript?.length
  })

  const response = await fetch(`${BACKEND_URL}/api/summaries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userEmail,
      videoUrl,
      videoTitle,
      summary,
      videoThumbnail,
      videoId,
      transcript
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Error from backend:', errorText)
    throw new Error(`Failed to save summary: ${errorText}`)
  }

  return await response.text()
}
