from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.qiskit_simulator import simulate_circuit, SimulationRequest, SimulationResult
from app.services.quantum_tutor_service import tutor_chat, TutorRequest, TutorResponse
import uvicorn

app = FastAPI(title="QubitCraft Quantum Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all or restrict to http://localhost:5174
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/simulate", response_model=SimulationResult)
async def simulate(request: SimulationRequest):
    return simulate_circuit(request)

@app.post("/api/ai/tutor", response_model=TutorResponse)
async def ai_tutor(request: TutorRequest):
    return await tutor_chat(request)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
