from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from models.notice import Notice

router = APIRouter()

# CREATE NOTICE
@router.post("/notice")
def create_notice(data: dict, db: Session = Depends(get_db)):

    new_notice = Notice(
        title=data["title"],
        content=data["content"]
    )

    db.add(new_notice)
    db.commit()
    db.refresh(new_notice)

    return {"message": "Notice created successfully"}

# GET ALL NOTICES
@router.get("/notices")
def get_notices(db: Session = Depends(get_db)):

    notices = db.query(Notice).all()
    return notices