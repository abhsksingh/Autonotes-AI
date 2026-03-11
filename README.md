# AutoNotes-AI

A full-stack AI Meeting Notes Automation web application. Automatically transcribes your meeting audio and extracts intelligent summaries, action items, and key decisions using OpenAI's Whisper and GPT-4 APIs.

## Features

- **Upload Meeting Audio**: Drag-and-drop support for `.mp3`, `.wav`, and `.m4a` files.
- **Flawless Transcription**: Powered by OpenAI Whisper.
- **Smart Insights**: Uses OpenAI GPT models to automatically extract a concise summary, actionable tasks with owners, and key decisions made during the meeting.
- **Modern Dashboard UI**: Clean, responsive layout with dark mode to view and edit generated notes.
- **Meeting History**: Search and manage all previous meetings.

## Tech Stack

### Frontend
- **React 18** (via Vite)
- **Tailwind CSS 4**
- **Framer Motion** (for smooth UI transitions)
- **Lucide Icons**
- **Axios** (for API calls)

### Backend
- **Python 3.13**
- **FastAPI**
- **SQLite** + **SQLAlchemy** (for local data persistence)
- **OpenAI API** (`whisper-1`, `gpt-4o`)

---

## Getting Started

### Prerequisites
- Node.js (v24+)
- Python (3.13+)
- An OpenAI API Key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Virtual Environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set your OpenAI API Key (optional but required for real AI processing):
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```
   *(If you run the app without an API key, it will use placeholder dummy data for UI testing).*
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be running at `http://127.0.0.1:8000`.

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local URL in your browser (usually `http://localhost:5173` or `http://localhost:5174`).

---

## Usage

1. Go to the web UI and click **Go to Dashboard**.
2. Drag and drop any `.mp3`, `.wav`, or `.m4a` file.
3. Wait as the system uploads, transcribes, and extracts AI notes.
4. View your perfectly formatted Executive Summary, transcript, tasks, and decisions.

## License
MIT License
