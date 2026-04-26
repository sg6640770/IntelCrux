const CHATBOT_WEBHOOK =
  import.meta.env.VITE_N8N_CHATBOT_URL ||
  'http://localhost:5678/webhook-test/ytube'

export const askVideoQuestion = async ({
  videoId,
  question
}: {
  videoId: string
  question: string
}) => {
  const response = await fetch(CHATBOT_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      videoId,
      question
    })
  })

  if (!response.ok) {
    throw new Error('Failed to get chatbot response')
  }

  const data = await response.json()

  console.log("RAW API DATA:", data)

  // Handle array or object response
  const item = Array.isArray(data) ? data[0] : data

  const result = {
    text: item?.output || '',
    audioUrl: item?.audioUrl || ''
  }

  console.log("FINAL RESULT:", result)

  return result
}