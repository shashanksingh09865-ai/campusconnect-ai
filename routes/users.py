from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from database.session import get_db
from models.user import User
from auth.auth_handler import (
    hash_password,
    verify_password,
    create_token,
    verify_token
)

router = APIRouter()

# -------------------------
# REGISTER
# -------------------------
@router.post("/register")
def register(user: dict, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user["email"]
    ).first()

    if existing_user:
        return {"error": "User already exists"}

    hashed_password = hash_password(user["password"])

    new_user = User(
        name=user["username"],
        email=user["email"],
        password=hashed_password,
        role=user.get("role", "student")
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

# -------------------------
# LOGIN
# -------------------------
@router.post("/login")
def login(user: dict, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(
        User.email == user["email"]
    ).first()

    if not db_user:
        return {"error": "User not found"}

    if not verify_password(
        user["password"],
        db_user.password
    ):
        return {"error": "Invalid password"}

    token = create_token({
        "email": db_user.email,
        "role": db_user.role
    })

    return {
        "message": "Login successful",
        "access_token": token
    }

# -------------------------
# CURRENT USER PROFILE
# -------------------------
@router.get("/me")
def get_current_user(
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

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }