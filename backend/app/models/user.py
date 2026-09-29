from typing import Optional, List, Literal
from pydantic import BaseModel, Field

UserRole = Literal['student', 'instructor', 'admin']

class UserBase(BaseModel):
    name: str
    email: str
    avatar: Optional[str] = None
    role: UserRole = "student"
    onboardingCompleted: bool = False
    learnerType: Optional[str] = None
    skillLevel: Optional[str] = None
    goals: List[str] = Field(default_factory=list)
    learningPreferences: List[str] = Field(default_factory=list)
    xp: int = 0
    streak: int = 0
    lessonsCompleted: int = 0
    circuitsBuilt: int = 0
    challengesCompleted: int = 0

class UserProfile(UserBase):
    id: str
    createdAt: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserGoogleAuth(BaseModel):
    name: str
    email: str
    avatar: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    role: Optional[UserRole] = None
    onboardingCompleted: Optional[bool] = None
    learnerType: Optional[str] = None
    skillLevel: Optional[str] = None
    goals: Optional[List[str]] = None
    learningPreferences: Optional[List[str]] = None
    xp: Optional[int] = None
    streak: Optional[int] = None
    lessonsCompleted: Optional[int] = None
    circuitsBuilt: Optional[int] = None
    challengesCompleted: Optional[int] = None

class AuthResponse(BaseModel):
    success: bool
    user: Optional[UserProfile] = None
    error: Optional[str] = None
