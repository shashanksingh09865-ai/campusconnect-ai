from fastapi import APIRouter
from ai.summarizer import summarize_text

router = APIRouter()

@router.post("/summarize")
def summarize(data: dict):

    text = data["text"]

    summary = summarize_text(text)

    return {
        "summary": summary
    }