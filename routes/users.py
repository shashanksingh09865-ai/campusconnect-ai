from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from models.user import User
from auth.auth_handler import hash_password, verify_password, create_token

router = APIRouter()

# -------------------------
# REGISTER (DB VERSION)
# -------------------------
@router.post("/register")
def register(user: dict, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user["email"]).first()
    if existing_user:
        return {"error": "User already exists"}

    new_user = User(
        name=user["name"],
        email=user["email"],
        password=hash_password(user["password"])
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

# -------------------------
# LOGIN (DB VERSION)
# -------------------------
@router.post("/login")
def login(user: dict, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user["email"]).first()

    if not db_user:
        return {"error": "User not found"}

    if not verify_password(user["password"], db_user.password):
        return {"error": "Invalid password"}

    token = create_token({"email": db_user.email})

    return {
        "message": "Login successful",
        "access_token": token
    }