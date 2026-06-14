from fastapi import APIRouter

router = APIRouter()

@router.get("/upload-test")
def upload_test():
    return {"message": "Upload route working"}