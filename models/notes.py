from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database.database import Base

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    subject = Column(String)
    file_url = Column(String)  # for now simple text link
    created_at = Column(DateTime, default=datetime.utcnow)