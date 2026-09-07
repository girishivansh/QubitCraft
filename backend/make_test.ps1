import os
import sys

with open("test_groq.py", "w") as f:
    f.write('''
import os
import asyncio
from dotenv import load_dotenv
from groq import AsyncGroq

load_dotenv(override=True)

async def test():
    try:
        client = AsyncGroq()
        response = await client.chat.completions.create(
            model=os.getenv("GROQ_MODEL", "llama3-70b-8192"),
            messages=[{"role": "user", "content": "hi"}],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        print("SUCCESS")
        print(response)
    except Exception as e:
        print(f"ERROR: {e}")

asyncio.run(test())
''')
