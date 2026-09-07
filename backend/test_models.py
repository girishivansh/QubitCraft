import os
import asyncio
from dotenv import load_dotenv
from groq import AsyncGroq

load_dotenv(override=True)

async def test():
    try:
        client = AsyncGroq()
        models = await client.models.list()
        for m in models.data:
            print(m.id)
    except Exception as e:
        print(f"ERROR: {e}")

asyncio.run(test())
