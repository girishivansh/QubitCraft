from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.db.database import connect_to_mongo, close_mongo_connection
from app.routes.db_status import router as db_status_router
from app.routes.auth import router as auth_router
from app.routes.experiments import router as experiments_router
from app.routes.progress import router as progress_router
from app.services.qiskit_simulator import simulate_circuit, SimulationRequest, SimulationResult
from app.services.quantum_tutor_service import tutor_chat, TutorRequest, TutorResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="QubitCraft Quantum Backend",
    version="1.1.0",
    description="FastAPI Quantum Simulation and AI Tutor backend with MongoDB persistence",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include MongoDB-powered routers
app.include_router(db_status_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(experiments_router, prefix="/api")
app.include_router(progress_router, prefix="/api")

# Quantum simulation & AI endpoints
@app.post("/api/simulate", response_model=SimulationResult)
async def simulate(request: SimulationRequest):
    return simulate_circuit(request)

@app.post("/api/ai/tutor", response_model=TutorResponse)
async def ai_tutor(request: TutorRequest):
    return await tutor_chat(request)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
