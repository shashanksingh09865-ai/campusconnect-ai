from fastapi import FastAPI, Header
from routes.users import router as users_router
from routes.notice import router as notice_router
from routes.notes import router as notes_router
from routes.dashboard import router as dashboard_router
from routes.upload import router as upload_router
from database.database import Base, engine
from auth.auth_handler import verify_token
from routes.ai_routes import router as ai_router
from routes.ai_chat import router as ai_chat_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(ai_router)
app.include_router(notice_router)
app.include_router(notes_router)
app.include_router(dashboard_router)
app.include_router(upload_router)
app.include_router(ai_chat_router)

@app.get("/")
def home():
    return {"message": "CampusConnect AI is Live"}

@app.get("/make-admin")
def make_admin():
    from database.session import SessionLocal
    from models.user import User

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == "student1@gmail.com"
    ).first()

    if not user:
        return {"error": "User not found"}

    user.role = "admin"

    db.commit()

    return {"message": "User is now admin"}