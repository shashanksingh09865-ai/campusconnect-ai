from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from database.session import get_db
from models.notice import Notice
from models.notes import Note
from models.user import User
from auth.auth_handler import verify_token

router = APIRouter()

@router.get("/dashboard")
def dashboard(
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
        return {"error": "Admin access required"}

    notices = db.query(Notice).order_by(
        Notice.id.desc()
    ).limit(5).all()

    notes = db.query(Note).order_by(
        Note.id.desc()
    ).limit(5).all()

    total_users = db.query(User).count()
    total_notices = db.query(Notice).count()
    total_notes = db.query(Note).count()

    return {
        "message": "Admin Dashboard",
        "total_users": total_users,
        "total_notices": total_notices,
        "total_notes": total_notes,
        "latest_notices": notices,
        "latest_notes": notes
    }