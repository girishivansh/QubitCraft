import uuid
from datetime import datetime, timezone
import bcrypt
from fastapi import APIRouter, HTTPException, status
from app.db.database import get_collection, db_instance
from app.models.user import (
    UserCreate,
    UserLogin,
    UserGoogleAuth,
    UserUpdate,
    UserProfile,
    AuthResponse
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # Check standard bcrypt
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        # Fallback for plain or base64 legacy passwords
        import base64
        try:
            return base64.b64encode(plain_password.encode('utf-8')).decode('utf-8') == hashed_password
        except Exception:
            return plain_password == hashed_password

def to_user_profile(doc: dict) -> UserProfile:
    return UserProfile(
        id=doc["id"],
        name=doc.get("name", ""),
        email=doc.get("email", ""),
        avatar=doc.get("avatar"),
        role=doc.get("role", "student"),
        onboardingCompleted=doc.get("onboardingCompleted", False),
        learnerType=doc.get("learnerType"),
        skillLevel=doc.get("skillLevel"),
        goals=doc.get("goals", []),
        learningPreferences=doc.get("learningPreferences", []),
        xp=doc.get("xp", 0),
        streak=doc.get("streak", 0),
        lessonsCompleted=doc.get("lessonsCompleted", 0),
        circuitsBuilt=doc.get("circuitsBuilt", 0),
        challengesCompleted=doc.get("challengesCompleted", 0),
        createdAt=doc.get("createdAt", datetime.now(timezone.utc).isoformat())
    )

@router.post("/signup", response_model=AuthResponse)
async def signup(credentials: UserCreate):
    users_col = get_collection("users")
    if users_col is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is not connected"
        )
    
    email_clean = credentials.email.lower().strip()
    existing_user = await users_col.find_one({"email": email_clean})
    if existing_user:
        return AuthResponse(success=False, error="An account with this email already exists")

    new_id = str(uuid.uuid4())
    now_iso = datetime.now(timezone.utc).isoformat()
    
    user_doc = {
        "id": new_id,
        "name": credentials.name.strip(),
        "email": email_clean,
        "passwordHash": hash_password(credentials.password),
        "avatar": None,
        "role": "student",
        "onboardingCompleted": False,
        "learnerType": None,
        "skillLevel": None,
        "goals": [],
        "learningPreferences": [],
        "xp": 0,
        "streak": 0,
        "lessonsCompleted": 0,
        "circuitsBuilt": 0,
        "challengesCompleted": 0,
        "createdAt": now_iso,
        "updatedAt": now_iso
    }

    await users_col.insert_one(user_doc)
    return AuthResponse(success=True, user=to_user_profile(user_doc))

@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    users_col = get_collection("users")
    if users_col is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is not connected"
        )
    
    email_clean = credentials.email.lower().strip()
    user_doc = await users_col.find_one({"email": email_clean})
    
    if not user_doc or not verify_password(credentials.password, user_doc.get("passwordHash", "")):
        return AuthResponse(success=False, error="Invalid email or password")
    
    return AuthResponse(success=True, user=to_user_profile(user_doc))

@router.post("/google", response_model=AuthResponse)
async def login_with_google(profile: UserGoogleAuth):
    users_col = get_collection("users")
    if users_col is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is not connected"
        )
    
    email_clean = profile.email.lower().strip()
    user_doc = await users_col.find_one({"email": email_clean})
    now_iso = datetime.now(timezone.utc).isoformat()

    if not user_doc:
        # Register new OAuth user
        user_doc = {
            "id": str(uuid.uuid4()),
            "name": profile.name.strip(),
            "email": email_clean,
            "passwordHash": "",
            "avatar": profile.avatar,
            "role": "student",
            "onboardingCompleted": False,
            "learnerType": None,
            "skillLevel": None,
            "goals": [],
            "learningPreferences": [],
            "xp": 0,
            "streak": 0,
            "lessonsCompleted": 0,
            "circuitsBuilt": 0,
            "challengesCompleted": 0,
            "createdAt": now_iso,
            "updatedAt": now_iso
        }
        await users_col.insert_one(user_doc)
    else:
        # Update avatar if provided
        if profile.avatar and user_doc.get("avatar") != profile.avatar:
            await users_col.update_one(
                {"id": user_doc["id"]},
                {"$set": {"avatar": profile.avatar, "updatedAt": now_iso}}
            )
            user_doc["avatar"] = profile.avatar

    return AuthResponse(success=True, user=to_user_profile(user_doc))

@router.get("/user/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str):
    users_col = get_collection("users")
    if users_col is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is not connected"
        )
    
    user_doc = await users_col.find_one({"id": user_id})
    if not user_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return to_user_profile(user_doc)

@router.put("/profile/{user_id}", response_model=AuthResponse)
async def update_user_profile(user_id: str, updates: UserUpdate):
    users_col = get_collection("users")
    if users_col is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is not connected"
        )
    
    update_data = {k: v for k, v in updates.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        user_doc = await users_col.find_one({"id": user_id})
        if not user_doc:
            return AuthResponse(success=False, error="User not found")
        return AuthResponse(success=True, user=to_user_profile(user_doc))

    update_data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    
    result = await users_col.find_one_and_update(
        {"id": user_id},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        return AuthResponse(success=False, error="User not found")
    
    return AuthResponse(success=True, user=to_user_profile(result))
