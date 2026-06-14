from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

# Secret key (used to sign tokens)
SECRET_KEY = "campusconnect_secret_key"
ALGORITHM = "HS256"

# Password hashing system
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# -------------------------
# PASSWORD FUNCTIONS
# -------------------------

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# -------------------------
# JWT TOKEN FUNCTION
# -------------------------

def create_token(data: dict, expires_minutes: int = 30):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token