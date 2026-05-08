from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, health_router, workout_router, nutrition_router, coach_router, progress_router
app = FastAPI(title="ArogyaMitra API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])
app.include_router(health_router.router, prefix="/health", tags=["Health"])
app.include_router(workout_router.router, prefix="/workout", tags=["Workout"])
app.include_router(nutrition_router.router, prefix="/nutrition", tags=["Nutrition"])
app.include_router(coach_router.router, prefix="/coach", tags=["Coach"])
app.include_router(progress_router.router, prefix="/progress", tags=["Progress"])
@app.get("/")
def root():
    return {"message": "ArogyaMitra Backend Running"}