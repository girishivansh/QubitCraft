import os
import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ASCENDING
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("qubitcraft.db")

MONGODB_URI = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI") or "mongodb://localhost:27017"
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "qubitcraft")

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    is_connected: bool = False

db_instance = Database()

async def connect_to_mongo():
    """Initializes the MongoDB connection and creates required indexes."""
    try:
        logger.info(f"Connecting to MongoDB at {MONGODB_URI.split('@')[-1] if '@' in MONGODB_URI else MONGODB_URI}...")
        db_instance.client = AsyncIOMotorClient(
            MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        db_instance.db = db_instance.client[MONGODB_DB_NAME]
        
        # Ping the server to verify connectivity
        await db_instance.client.admin.command('ping')
        db_instance.is_connected = True
        logger.info(f"Successfully connected to MongoDB database '{MONGODB_DB_NAME}'.")
        
        # Ensure indexes
        await _create_indexes()
    except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
        db_instance.is_connected = False
        logger.warning(
            f"MongoDB connection failed: {e}. "
            "Backend will continue running, but MongoDB persistence endpoints will report database unavailable."
        )

async def close_mongo_connection():
    """Closes the MongoDB connection."""
    if db_instance.client is not None:
        db_instance.client.close()
        db_instance.is_connected = False
        logger.info("MongoDB connection closed.")

async def _create_indexes():
    """Creates indexes for users, experiments, and progress collections."""
    if not db_instance.is_connected or db_instance.db is None:
        return
    try:
        # Users indexes
        await db_instance.db.users.create_index([("email", ASCENDING)], unique=True, sparse=True)
        await db_instance.db.users.create_index([("id", ASCENDING)], unique=True)
        
        # Experiments indexes
        await db_instance.db.experiments.create_index([("id", ASCENDING)], unique=True)
        await db_instance.db.experiments.create_index([("userId", ASCENDING)])
        
        # Progress indexes
        await db_instance.db.progress.create_index([("userId", ASCENDING)], unique=True)
        
        logger.info("MongoDB indexes verified and ready.")
    except Exception as e:
        logger.warning(f"Error creating MongoDB indexes: {e}")

def get_database() -> Optional[AsyncIOMotorDatabase]:
    """Returns the active MongoDB database instance, or None if not connected."""
    return db_instance.db

def get_collection(name: str):
    """Returns a collection from the database or None if not connected."""
    if db_instance.db is not None:
        return db_instance.db[name]
    return None

async def check_mongo_health() -> dict:
    """Checks MongoDB connection status and returns details."""
    if not db_instance.client:
        return {
            "connected": False,
            "database": MONGODB_DB_NAME,
            "error": "MongoDB client is not initialized"
        }
    try:
        await db_instance.client.admin.command('ping')
        return {
            "connected": True,
            "database": MONGODB_DB_NAME,
            "error": None
        }
    except Exception as e:
        return {
            "connected": False,
            "database": MONGODB_DB_NAME,
            "error": str(e)
        }
