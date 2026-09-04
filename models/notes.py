from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from database.database import Base


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    subject = Column(String, nullable=False)

    file_url = Column(String, nullable=False)

    summary = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Link note to the user who uploaded it
    user_id = Column(Integer, ForeignKey("users.id"))

    # Relationship with User model
    owner = relationship("User", back_populates="notes")