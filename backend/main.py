from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import shutil

import models
import schemas
from database import engine, get_db

try:
    from openai import OpenAI, OpenAIError
    try:
        client = OpenAI() # expects OPENAI_API_KEY in env
    except OpenAIError:
        client = None
except ImportError:
    client = None

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Meeting Notes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Meeting Notes API"}

@app.post("/api/upload", response_model=schemas.Meeting)
async def upload_audio(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    transcript_text = "Transcription unavailable."
    summary_text = "Summary unavailable."
    action_items = "[]"
    decisions = "[]"

    if client:
        try:
            # 1. Transcribe with Whisper
            with open(file_path, "rb") as audio_file:
                transcription = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file
                )
            transcript_text = transcription.text

            # 2. Extract Insights with GPT-4o (or gpt-3.5-turbo if preferred)
            prompt = f"""
            Analyze the following meeting transcript. Provide a concise executive summary, a list of action items, and a list of key decisions.
            Respond strictly in the following JSON format:
            {{
                "summary": "Detailed executive summary here...",
                "action_items": [
                    {{"text": "Task description", "owner": "Name or 'Unassigned'", "status": "pending"}}
                ],
                "decisions": [
                    "Decision 1",
                    "Decision 2"
                ]
            }}

            Transcript:
            {transcript_text}
            """

            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an expert AI executive assistant."},
                    {"role": "user", "content": prompt}
                ],
                response_format={ "type": "json_object" }
            )

            import json
            result = json.loads(response.choices[0].message.content)
            summary_text = result.get("summary", "No summary generated.")
            action_items = json.dumps(result.get("action_items", []))
            decisions = json.dumps(result.get("decisions", []))

        except Exception as e:
            print(f"OpenAI API Error: {e}")
            summary_text = f"Error processing with AI: {str(e)}"
    else:
        print("Warning: OpenAI client not configured. Using placeholder data.")
        transcript_text = "Placeholder transcript. OpenAI API key is missing."
        summary_text = "Placeholder summary. Configure an OpenAI API key to enable AI features."
        action_items = json.dumps([{"id": 1, "text": "Add OpenAI API Key", "owner": "Admin", "status": "pending"}])
        decisions = json.dumps(["Run without API key for UI testing"])

    db_meeting = models.Meeting(
        title=f"Meeting: {file.filename}",
        filename=file.filename,
        transcript=transcript_text,
        summary=summary_text,
        action_items=action_items,
        decisions=decisions
    )
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

@app.get("/api/meetings", response_model=list[schemas.Meeting])
def read_meetings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    meetings = db.query(models.Meeting).offset(skip).limit(limit).all()
    return meetings

@app.get("/api/meetings/{meeting_id}", response_model=schemas.Meeting)
def read_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if meeting is None:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting

@app.put("/api/meetings/{meeting_id}", response_model=schemas.Meeting)
def update_meeting(meeting_id: int, meeting: schemas.MeetingUpdate, db: Session = Depends(get_db)):
    db_meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not db_meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    update_data = meeting.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_meeting, key, value)
        
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

@app.delete("/api/meetings/{meeting_id}")
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    db_meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not db_meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    db.delete(db_meeting)
    db.commit()
    return {"ok": True}
