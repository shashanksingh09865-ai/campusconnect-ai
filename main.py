from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database.database import Base, engine

from routes.users import router as users_router
from routes.notes import router as notes_router
from routes.upload import router as upload_router
from routes.chat import router as chat_router
from routes.notice import router as notice_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CampusConnect AI API",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://campusconnect-4z41qjc12-shashanksingh09865-ai.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home Route
@app.get("/")
def home():
    return {
        "message": "Welcome to CampusConnect AI Backend 🚀"
    }

# Register Routers
app.include_router(users_router)
app.include_router(notes_router)
app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(notice_router)

# Serve uploaded PDFs and files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")