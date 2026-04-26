📽️ YouTube Video Summarizer — Full Stack AI App
A full-stack application that allows authenticated users to input a YouTube video URL and receive a structured, AI-generated summary. This project leverages modern frontend frameworks, backend APIs, workflow automation, and AI models.

🚀 Tech Stack Overview
🖥️ Frontend — Built with Next.js + React
Technology	Description
Next.js	React framework with built-in routing, SSR, and API routes.
React	Component-based JavaScript library for building dynamic UIs.
Tailwind CSS	Utility-first CSS framework for rapid, responsive UI design.
TypeScript	Superset of JavaScript that provides static typing.
Lucide Icons	Open-source icon set used for visual feedback (e.g., loaders).
@nhost/nextjs	Auth hook integration with Nhost for user session and identity management.

⚙️ Backend — Summary Storage & Auth Integration
Technology	Description
Spring Boot	Java-based framework for building RESTful backend services.
REST API	Exposes /api/summaries endpoint to store video summaries per user.
JDBC	Java Database Connectivity used for executing SQL queries.
MySQL	Relational database for persisting summary history (linked with user email).

🤖 AI Summarization — Powered by n8n + OpenAI GPT
Technology	Description
n8n	Low-code automation tool that orchestrates the summary flow.
Webhook Node	Receives video URL from frontend as a POST request.
Custom Code Node	Extracts YouTube Video ID and cleans the transcript.
youtube-transcript.io	External API that fetches transcript from YouTube using video ID.
LangChain + GPT-4o	OpenAI GPT-4o model (via LangChain) generates markdown-based structured summaries.

🔐 Authentication — Using Nhost
Technology	Description
Nhost	Backend-as-a-Service offering GraphQL, Auth, and Postgres.
JWT Token Auth	Secures API calls from frontend and identifies the logged-in user.

🌐 Integration Utilities
Tool/Library	Purpose
fetch API	Performs HTTP requests from frontend to backend/n8n.
.env Variables	Secures environment-specific configuration like API URLs, Nhost keys, etc.

🧠 How It Works
User logs in using Nhost authentication.

User submits a YouTube URL from the frontend.

URL is sent to an n8n workflow, which:

Extracts video ID.

Gets the transcript via API.

Uses GPT-4o to summarize it.

Summary is sent back to the frontend.

Summary is stored in your Spring Boot + MySQL backend for authenticated users.

