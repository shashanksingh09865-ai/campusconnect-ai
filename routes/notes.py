from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from models.notes import Note

router = APIRouter()

# CREATE NOTE
@router.post("/notes")
def create_note(data: dict, db: Session = Depends(get_db)):

    new_note = Note(
        title=data["title"],
        subject=data["subject"],
        file_url=data["file_url"]
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return {"message": "Note added successfully"}

# GET ALL NOTES
@router.get("/notes")
def get_notes(db: Session = Depends(get_db)):

    notes = db.query(Note).all()
    return notes