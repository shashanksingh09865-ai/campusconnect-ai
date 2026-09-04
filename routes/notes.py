from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database.session import get_db
from models.notes import Note
from models.user import User

from auth.auth_handler import verify_token
from ai.summarizer import summarize_text

router = APIRouter()


# -------------------------
# CREATE NOTE
# -------------------------
@router.post("/notes")
def create_note(
    data: dict,
    token: str = Header(...),
    db: Session = Depends(get_db)
):

    user_data = verify_token(token)

    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid token")

    current_user = db.query(User).filter(
        User.email == user_data["email"]
    ).first()

    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    new_note = Note(
        title=data["title"],
        subject=data["subject"],
        file_url=data["file_url"],
        user_id=current_user.id
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return {
        "message": "Note created successfully",
        "note_id": new_note.id
    }


# -------------------------
# GET USER NOTES
# -------------------------
@router.get("/notes")
def get_notes(
    token: str = Header(...),
    db: Session = Depends(get_db)
):

    user_data = verify_token(token)

    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid token")

    current_user = db.query(User).filter(
        User.email == user_data["email"]
    ).first()

    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    notes = db.query(Note).filter(
        Note.user_id == current_user.id
    ).all()

    return notes


# -------------------------
# AI SUMMARIZE NOTE
# -------------------------
@router.post("/notes/{note_id}/summarize")
def summarize_note(
    note_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db)
):

    user_data = verify_token(token)

    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid token")

    current_user = db.query(User).filter(
        User.email == user_data["email"]
    ).first()

    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    text_for_ai = f"""
Title: {note.title}

Subject: {note.subject}

File URL: {note.file_url}
"""

    summary = summarize_text(text_for_ai)

    note.summary = summary

    db.commit()
    db.refresh(note)

    return {
        "message": "Summary generated successfully",
        "note_id": note.id,
        "summary": summary
    }


# -------------------------
# DELETE NOTE
# -------------------------
@router.delete("/notes/{note_id}")
def delete_note(
    note_id: int,
    token: str = Header(...),
    db: Session = Depends(get_db)
):

    user_data = verify_token(token)

    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid token")

    current_user = db.query(User).filter(
        User.email == user_data["email"]
    ).first()

    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    db.delete(note)
    db.commit()

    return {
        "message": "Note deleted successfully"
    }


# -------------------------
# DASHBOARD STATISTICS
# -------------------------
@router.get("/dashboard/stats")
def dashboard_stats(
    token: str = Header(...),
    db: Session = Depends(get_db)
):

    user_data = verify_token(token)

    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid token")

    current_user = db.query(User).filter(
        User.email == user_data["email"]
    ).first()

    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    notes = db.query(Note).filter(
        Note.user_id == current_user.id
    ).all()

    total_notes = len(notes)

    summarized_notes = len([
        note for note in notes
        if note.summary and note.summary.strip()
    ])

    latest_upload = None

    if notes:
        latest_upload = max(
            notes,
            key=lambda note: note.created_at
        ).created_at

        return {
        "total_notes": total_notes,
        "summarized_notes": summarized_notes,
        "latest_upload": latest_upload
    }


# -------------------------
# ADMIN - GET ALL NOTES
# -------------------------
@router.get("/admin/notes")
def get_all_notes(
    db: Session = Depends(get_db)
):

    notes = db.query(Note).all()

    return notes


# -------------------------
# SEARCH NOTES
# -------------------------
@router.get("/search")
def search_notes(
    query: str,
    db: Session = Depends(get_db)
):

    notes = db.query(Note).filter(
        or_(
            Note.title.ilike(f"%{query}%"),
            Note.subject.ilike(f"%{query}%"),
            Note.summary.ilike(f"%{query}%")
        )
    ).all()

    return notes