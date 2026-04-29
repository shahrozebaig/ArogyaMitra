import os
from dotenv import load_dotenv
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_MINUTES = int(os.getenv("JWT_EXPIRATION_MINUTES", 1440))
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./arogyamitra.db")
BACKEND_HOST = os.getenv("BACKEND_HOST", "0.0.0.0")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", 8000))
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3001")
DEBUG = os.getenv("DEBUG", "True") == "True"