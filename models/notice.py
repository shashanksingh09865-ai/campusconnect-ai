from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database.database import Base

class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)