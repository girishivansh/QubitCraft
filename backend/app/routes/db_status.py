from fastapi import APIRouter
from app.db.database import check_mongo_health, get_database, get_collection

router = APIRouter(tags=["Health & Database Status"])

@router.get("/health")
async def health_check():
    db_health = await check_mongo_health()
    return {
        "status": "online",
        "service": "QubitCraft Quantum Backend",
        "database": db_health
    }

@router.get("/db/stats")
async def get_db_stats():
    db_health = await check_mongo_health()
    if not db_health.get("connected"):
        return {
            "connected": False,
            "error": db_health.get("error", "Database disconnected")
        }
    
    users_col = get_collection("users")
    exp_col = get_collection("experiments")
    prog_col = get_collection("progress")
    
    users_count = await users_col.count_documents({}) if users_col is not None else 0
    exp_count = await exp_col.count_documents({}) if exp_col is not None else 0
    prog_count = await prog_col.count_documents({}) if prog_col is not None else 0

    return {
        "connected": True,
        "database": db_health.get("database"),
        "collections": {
            "users": users_count,
            "experiments": exp_count,
            "progress": prog_count
        }
    }
