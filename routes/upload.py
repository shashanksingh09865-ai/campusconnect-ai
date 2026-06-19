from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import shutil

from database.session import get_db
from models.notes import Note

from ai.pdf_reader import extract_text_from_pdf
from ai.summarizer import summarize_text

router = APIRouter()

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pdf_text = extract_text_from_pdf(file_path)

    summary = summarize_text(pdf_text[:5000])

    new_note = Note(
        title=file.filename,
        subject="Uploaded PDF",
        file_url=file_path,
        summary=summary
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return {
        "message": "File uploaded and saved",
        "note_id": new_note.id,
        "summary": summary
    }