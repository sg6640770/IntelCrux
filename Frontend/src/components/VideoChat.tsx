import { useRef, useState } from 'react'
import { askVideoQuestion } from '../services/chatbotService'

interface Props {
  videoId: string
}

export const VideoChat: React.FC<Props> = ({ videoId }) => {
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)

  // 🔥 Audio reference
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleAsk = async () => {
    if (!question.trim()) return

    const userMessage = { role: 'user' as const, content: question }
    setMessages(prev => [...prev, userMessage])
    setQuestion('')
    setLoading(true)

    try {
      // 👇 get BOTH text + audio
      const res = await askVideoQuestion({ videoId, question })

      // show text
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: res.text }
      ])

      // 🔥 AUTO PLAY AUDIO
      if (res.audioUrl) {
        try {
          // stop previous audio
          if (audioRef.current) {
            audioRef.current.pause()
          }

          audioRef.current = new Audio(res.audioUrl)
          await audioRef.current.play()
        } catch (err) {
          console.log('Autoplay blocked:', err)
        }
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-900 text-white">
      {/* Messages */}
      <div className="h-60 overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'ml-auto bg-purple-600 text-white'
                : 'mr-auto bg-gray-700 text-white'
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">Thinking…</div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask about this video..."
          className="flex-1 px-3 py-2 rounded-md
            bg-gray-800 text-white placeholder-gray-400
            border border-gray-600
            focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700
            text-white px-4 rounded-md disabled:opacity-50"
        >
          Ask
        </button>
      </div>
    </div>
  )
}