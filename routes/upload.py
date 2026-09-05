from fastapi import APIRouter, UploadFile, File, Header
from sqlalchemy.orm import Session
import shutil
import os

from database.database import SessionLocal
from models.notes import Note
from models.user import User

from auth.auth_handler import verify_token

from utils.pdf_reader import extract_text_from_pdf
from ai.summarizer import summarize_text

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    token: str = Header(...)
):

    # -----------------------
    # Verify Logged-in User
    # -----------------------

    user_data = verify_token(token)

    if not user_data:
        return {"error": "Invalid token"}

    db: Session = SessionLocal()

    current_user = db.query(User).filter(
        User.email == user_data["email"]
    ).first()

    if not current_user:
        db.close()
        return {"error": "User not found"}

    # IMPORTANT:
    # Save the user ID while the database session is active.
    user_id = current_user.id

    # -----------------------
    # Save PDF
    # -----------------------

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # -----------------------
    # Extract PDF Text
    # -----------------------

    extracted_text = extract_text_from_pdf(file_path)

    # -----------------------
    # AI Summary
    # -----------------------

    summary = summarize_text(extracted_text)

    # -----------------------
    # Save Note
    # -----------------------

    new_note = Note(
        title=file.filename,
        subject="Uploaded PDF",
        file_url=file_path,
        summary=summary,
        user_id=user_id
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    # Save ID before closing session
    note_id = new_note.id

    db.close()

    # -----------------------
    # Response
    # -----------------------

    return {
        "message": "File uploaded successfully",
        "note_id": note_id,
        "user_id": user_id,
        "summary": summary
    }