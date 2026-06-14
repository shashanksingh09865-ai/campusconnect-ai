from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from models.notice import Notice
from models.notes import Note

router = APIRouter()

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):

    notices = db.query(Notice).order_by(Notice.id.desc()).limit(5).all()
    notes = db.query(Note).order_by(Note.id.desc()).limit(5).all()

    return {
        "message": "Campus Dashboard",
        "latest_notices": notices,
        "latest_notes": notes
    }