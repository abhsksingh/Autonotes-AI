from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class MeetingBase(BaseModel):
    title: str
    transcript: Optional[str] = None
    summary: Optional[str] = None
    action_items: Optional[str] = None
    decisions: Optional[str] = None

class MeetingCreate(MeetingBase):
    filename: str

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    transcript: Optional[str] = None
    summary: Optional[str] = None
    action_items: Optional[str] = None
    decisions: Optional[str] = None

class Meeting(MeetingBase):
    id: int
    date: datetime
    filename: Optional[str] = None
    duration: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
