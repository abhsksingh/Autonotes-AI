from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
import datetime

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, default="Untitled Meeting")
    date = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    filename = Column(String)
    duration = Column(Integer, nullable=True)  # in seconds
    transcript = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    action_items = Column(Text, nullable=True) # Stored as JSON string or text block
    decisions = Column(Text, nullable=True)    # Stored as JSON string or text block
