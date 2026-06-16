from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from models.notice import Notice
from models.user import User

router = APIRouter()

# CREATE NOTICE (ADMIN ONLY)
@router.post("/notice")
def create_notice(data: dict, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data["email"]).first()

    if not user:
        return {"error": "User not found"}

    if user.role != "admin":
        return {"error": "Only admin can create notices"}

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