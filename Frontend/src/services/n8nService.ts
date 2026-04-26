const N8N_WEBHOOK_URL =
  import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/ytube'

export const getVideoSummary = async (videoUrl: string) => {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl })
    })

    if (!response.ok) {
      throw new Error(`Failed: ${response.status}`)
    }

    const data: any = await response.json()

    console.log("FULL RESPONSE:", data)

    return {
      summary: data.summary || '',
      transcript: data.transcript || '',
      audioUrl: data.audioUrl || '',   // ✅ FIXED
      videoTitle: data.videoTitle || 'YouTube Video',
      videoUrl: data.videoUrl ?? videoUrl,
      videoId: data.videoId ?? '',
      status: data.status || 'completed'
    }

  } catch (error: any) {
    console.error(error)
    throw new Error('Something went wrong')
  }
}