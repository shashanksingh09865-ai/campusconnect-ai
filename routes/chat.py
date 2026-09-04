from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.database import SessionLocal
from models.notes import Note
from ai.summarizer import summarize_text

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat(request: ChatRequest):

    db: Session = SessionLocal()

    # Get all uploaded notes
    notes = db.query(Note).all()

    db.close()

    # Build context from uploaded notes
    notes_context = ""

    for note in notes:
        notes_context += f"""
Title: {note.title}

Subject: {note.subject}

Summary:
{note.summary}

----------------------------------------
"""

    # Improved AI Prompt
    prompt = f"""
You are CampusConnect AI, an AI assistant built for college students.

Your job is to help students understand their uploaded notes.

Instructions:

- Answer using the uploaded notes whenever possible.
- If the answer is not available in the uploaded notes, clearly say:
  "I couldn't find this information in your uploaded notes."
- Explain answers in simple English.
- Use bullet points whenever helpful.
- Give examples if needed.
- Keep the answer concise and easy to understand.
- Be friendly and helpful.

=========================
UPLOADED NOTES
=========================

{notes_context}

=========================
STUDENT QUESTION
=========================

{request.message}

=========================
ANSWER
=========================
"""

    try:
        reply = summarize_text(prompt)

        return {
            "success": True,
            "user": request.message,
            "ai": reply
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }