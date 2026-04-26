# YouTube Video Summarizer

A beautiful, production-ready YouTube video summarizer built with React, Nhost, and n8n integration.

## Features

- **Authentication**: Secure user authentication with Nhost
- **Video Summarization**: AI-powered YouTube video summarization via n8n workflows
- **History Tracking**: Personal history of all summarized videos
- **Real-time Status**: Live updates on summarization progress
- **Responsive Design**: Beautiful, mobile-first design with glassmorphism effects
- **Copy & Share**: Easy copying and sharing of summaries

## Setup Instructions

### 1. Nhost Setup

1. Create an account at [Nhost](https://nhost.io)
2. Create a new project
3. Copy your subdomain and region
4. Update the `.env` file with your Nhost credentials

### 2. n8n Workflow Setup

You'll need to create an n8n workflow that:

1. Receives a webhook with `videoUrl` and `userId`
2. Extracts video transcript using YouTube API or transcript services
3. Summarizes the content using AI (OpenAI, Claude, etc.)
4. Stores the result in your Nhost database
5. Optionally sends status updates back to the frontend

#### Sample n8n Workflow Structure:

```
Webhook → YouTube Data → AI Summarization → Database Update → Response
```

### 3. Database Schema

Create these tables in your Nhost PostgreSQL database:

```sql
CREATE TABLE video_summaries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  video_url text NOT NULL,
  video_title text,
  video_thumbnail text,
  summary text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE video_summaries ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their summaries
CREATE POLICY "Users can view own summaries" ON video_summaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own summaries" ON video_summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own summaries" ON video_summaries
  FOR UPDATE USING (auth.uid() = user_id);
```

### 4. Environment Variables

Copy `.env.example` to `.env` and update with your values:

```env
REACT_APP_NHOST_SUBDOMAIN=your-subdomain
REACT_APP_NHOST_REGION=eu-central-1
REACT_APP_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/youtube-summarizer
```

### 5. Installation & Development

```bash
npm install
npm run dev
```

## n8n Workflow Details

Your n8n workflow should handle:

1. **Video Processing**: Extract transcript from YouTube
2. **AI Summarization**: Use AI to create concise summaries
3. **Database Updates**: Store results in Nhost
4. **Error Handling**: Proper error states and user feedback

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Authentication**: Nhost Auth
- **Database**: PostgreSQL (via Nhost)
- **Workflow**: n8n for video processing
- **UI Icons**: Lucide React
- **Notifications**: React Hot Toast

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details