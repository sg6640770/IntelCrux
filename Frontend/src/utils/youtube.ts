// src/utils/videoUtils.ts

// Extracts YouTube video ID from various URL formats
export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/  //added support for shorts URLs
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }

  return null
}

// Validates if a YouTube URL is supported and parsable
export const isValidYouTubeUrl = (url: string): boolean => {
  try {
    new URL(url) // Ensures it's a valid URL
    return extractVideoId(url) !== null
  } catch {
    return false
  }
}

// Gets the thumbnail from YouTube by video ID
export const getVideoThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

// Dummy fallback for video title (used in mock/demo or non-API mode)
export const getVideoTitle = async (videoId: string): Promise<string> => {
  return `YouTube Video (${videoId})`
}
