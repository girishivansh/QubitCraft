from typing import List, Optional
from pydantic import BaseModel, Field

class LearningProgressModel(BaseModel):
    userId: str
    completedLessonIds: List[str] = Field(default_factory=list)
    completedCheckIds: List[str] = Field(default_factory=list)
    currentLessonId: Optional[str] = None
    currentCourseId: Optional[str] = None
    currentPathId: Optional[str] = None
    lastActiveDate: Optional[str] = None
    longestStreak: int = 0
    unlockedAchievementIds: List[str] = Field(default_factory=list)
    updatedAt: Optional[str] = None
