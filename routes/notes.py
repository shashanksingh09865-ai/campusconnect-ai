from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.session import get_db
from models.notes import Note
from ai.summarizer import summarize_text

router = APIRouter()

# -------------------------
# CREATE NOTE
# -------------------------
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

    return {
        "message": "Note created successfully",
        "note_id": new_note.id
    }

# -------------------------
# GET ALL NOTES
# -------------------------
@router.get("/notes")
def get_notes(db: Session = Depends(get_db)):

    notes = db.query(Note).all()

    return notes

# -------------------------
# AI SUMMARIZE NOTE
# -------------------------
@router.post("/notes/{note_id}/summarize")
def summarize_note(note_id: int, db: Session = Depends(get_db)):

    note = db.query(Note).filter(Note.id == note_id).first()

    if not note:
        return {"error": "Note not found"}

    text_for_ai = f"""
    Title: {note.title}

    Subject: {note.subject}

    File URL: {note.file_url}
    """

    summary = summarize_text(text_for_ai)

    note.summary = summary

    db.commit()

    return {
        "message": "Summary generated successfully",
        "note_id": note.id,
        "summary": summary
    }