from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from app.db.database import get_collection
from app.models.progress import LearningProgressModel

router = APIRouter(prefix="/progress", tags=["Learning Progress"])

def to_progress_model(doc: dict, user_id: str) -> LearningProgressModel:
    return LearningProgressModel(
        userId=user_id,
        completedLessonIds=doc.get("completedLessonIds", []),
        completedCheckIds=doc.get("completedCheckIds", []),
        currentLessonId=doc.get("currentLessonId"),
        currentCourseId=doc.get("currentCourseId"),
        currentPathId=doc.get("currentPathId"),
        lastActiveDate=doc.get("lastActiveDate"),
        longestStreak=doc.get("longestStreak", 0),
        unlockedAchievementIds=doc.get("unlockedAchievementIds", []),
        updatedAt=doc.get("updatedAt")
    )

@router.get("/{user_id}", response_model=LearningProgressModel)
async def get_user_progress(user_id: str):
    progress_col = get_collection("progress")
    if progress_col is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is not connected"
        )
    
    doc = await progress_col.find_one({"userId": user_id})
    if not doc:
        return LearningProgressModel(userId=user_id)
    
    return to_progress_model(doc, user_id)

@router.post("/{user_id}", response_model=LearningProgressModel)
async def save_user_progress(user_id: str, progress: LearningProgressModel):
    progress_col = get_collection("progress")
    if progress_col is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is not connected"
        )
    
    now_iso = datetime.now(timezone.utc).isoformat()
    data = progress.model_dump()
    data["userId"] = user_id
    data["updatedAt"] = now_iso

    result = await progress_col.find_one_and_update(
        {"userId": user_id},
        {"$set": data},
        upsert=True,
        return_document=True
    )

    return to_progress_model(result, user_id)
