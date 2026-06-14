from fastapi import FastAPI
from routes.users import router as users_router
from routes.notice import router as notice_router
from routes.notes import router as notes_router
from routes.dashboard import router as dashboard_router
from database.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users_router)
app.include_router(notice_router)
app.include_router(notes_router)
app.include_router(dashboard_router)

@app.get("/")
def home():
    return {"message": "CampusConnect AI is Live"}