from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from database.session import get_db
from models.notice import Notice
from models.user import User
from auth.auth_handler import verify_token

router = APIRouter()

# CREATE NOTICE (ADMIN ONLY)
@router.post("/notice")
def create_notice(
    data: dict,
    token: str = Header(),
    db: Session = Depends(get_db)
):

    user_data = verify_token(token)

    if not user_data:
        return {"error": "Invalid token"}

    user = db.query(User).filter(
        User.email == user_data["email"]
    ).first()

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