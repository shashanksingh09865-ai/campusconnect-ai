from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import google.generativeai as genai

from database.session import get_db
from models.notes import Note

router = APIRouter()

@router.post("/ask-ai")
def ask_ai(data: dict, db: Session = Depends(get_db)):

    question = data["question"]

    notes = db.query(Note).all()

    context = ""

    for note in notes:
        if note.summary:
            context += f"\n{note.summary}\n"

    prompt = f"""
You are CampusConnect AI, a helpful college assistant.

Instructions:
- Answer in simple student-friendly language.
- Use bullet points whenever possible.
- If the answer exists in the notes, prioritize the notes.
- If the notes do not contain enough information, use general knowledge.
- Keep answers concise and useful.

Notes:
{context}

Question:
{question}
"""

    model = genai.GenerativeModel("gemini-2.5-flash")

    response = model.generate_content(prompt)

    return {
        "question": question,
        "answer": response.text
    }