import os
import asyncio
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

async def main():
    uri = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI") or "mongodb://localhost:27017"
    db_name = os.getenv("MONGODB_DB_NAME", "qubitcraft")

    masked_uri = uri
    if "@" in uri:
        # Hide credentials in printout
        prefix = uri.split("://")[0]
        host = uri.split("@")[-1]
        masked_uri = f"{prefix}://*****:*****@{host}"

    print("=" * 60)
    print("QubitCraft MongoDB Connectivity Diagnostic")
    print("=" * 60)
    print(f"Target URI: {masked_uri}")
    print(f"Database:   {db_name}")
    print("Attempting connection (timeout 4s)...")

    client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=4000, connectTimeoutMS=4000)
    try:
        # Test ping
        await client.admin.command('ping')
        print(" Connected to MongoDB successfully!")
        
        db = client[db_name]
        # Test collection stats
        collections = await db.list_collection_names()
        print(f"Existing collections in '{db_name}': {collections}")

        # Test insert / find / delete
        test_col = db["_test_diagnostic"]
        test_doc = {"diagnostic": "qubitcraft_mongo_test", "status": "ok"}
        insert_res = await test_col.insert_one(test_doc)
        print(f" Test write succeeded (inserted_id: {insert_res.inserted_id})")

        found = await test_col.find_one({"_id": insert_res.inserted_id})
        print(f" Test read succeeded: {found['diagnostic']}")

        await test_col.delete_one({"_id": insert_res.inserted_id})
        print(" Test cleanup succeeded.")

        print("=" * 60)
        print(" MongoDB is ready for QubitCraft!")
        print("=" * 60)
    except Exception as e:
        print(f"\n MongoDB Connection Notice: {e}")
        print("\nIf you are using MongoDB Atlas (cloud):")
        print("  Set your connection string in .env:")
        print("  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/qubitcraft?retryWrites=true&w=majority")
        print("\nIf you are using local MongoDB:")
        print("  1. Make sure mongod service is started: `net start MongoDB` or run `mongod`")
        print("  2. Or run via Docker: `docker run -d -p 27017:27017 --name mongo mongo:latest`")
        print("=" * 60)
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
