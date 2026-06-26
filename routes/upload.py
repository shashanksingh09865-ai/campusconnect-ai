from fastapi import APIRouter, UploadFile, File
import shutil
import os

from utils.pdf_reader import extract_text_from_pdf
from ai.summarizer import summarize_text
from database.database import SessionLocal
from models.notes import Note

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Save uploaded PDF
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from PDF
    extracted_text = extract_text_from_pdf(file_path)

    # Generate AI summary
    summary = summarize_text(extracted_text)

    # Save note to database
    db = SessionLocal()

    new_note = Note(
        title=file.filename,
        subject="Uploaded PDF",
        file_url=file_path,
        summary=summary
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    db.close()

    return {
        "message": "File uploaded successfully",
        "note_id": new_note.id,
        "filename": file.filename,
        "text_preview": extracted_text[:500],
        "summary": summary
    }