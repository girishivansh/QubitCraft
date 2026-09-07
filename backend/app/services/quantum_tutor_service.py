import os
import json
from typing import List, Dict, Optional, Any
from pydantic import BaseModel
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()

class TutorContext(BaseModel):
    learnerLevel: Optional[str] = "beginner"
    lesson: Optional[Dict[str, Any]] = None
    circuit: Optional[Dict[str, Any]] = None
    selectedGate: Optional[Dict[str, Any]] = None
    simulation: Optional[Dict[str, Any]] = None
    statevector: Optional[Dict[str, Any]] = None
    selectedQubit: Optional[int] = None

class Message(BaseModel):
    role: str
    content: str

class TutorRequest(BaseModel):
    message: str
    context: Optional[TutorContext] = None
    conversation: Optional[List[Message]] = []

class TutorResponse(BaseModel):
    message: str
    responseType: str
    keyPoints: List[str]
    suggestions: List[str]

GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

SYSTEM_PROMPT = """You are QubitCraft Quantum Tutor.
You are an educational assistant specialized in quantum computing.
Your job is to help learners understand quantum computing through clear explanations, circuits, simulations and intuition.

Adapt your explanation to the learner's skill level.
Use the provided QubitCraft context when relevant.
Never invent simulation results.
Never contradict provided simulation data without explicitly identifying the discrepancy.

Distinguish:
- amplitudes
- probabilities
- measurement counts
- quantum states
- classical measurement results

When discussing a circuit, reason from the actual circuit operations.
When explaining a simulation, reason from the actual provided simulation result.
Prefer conceptual clarity before advanced mathematics for beginners.
If the user asks for mathematics, provide mathematically accurate explanations.
If information is missing, say what is missing instead of inventing it.
You are a tutor, not a replacement for the simulator.

IMPORTANT: You must respond in ONLY valid JSON matching this schema:
{
  "message": "Your main explanation text (can use markdown).",
  "responseType": "explanation | hint | debug | concept | result",
  "keyPoints": ["point 1", "point 2"],
  "suggestions": ["suggested follow-up question 1", "suggested follow-up question 2"]
}
"""

async def tutor_chat(request: TutorRequest) -> TutorResponse:
    if not os.getenv("GROQ_API_KEY"):
        return TutorResponse(
            message="Quantum Tutor is currently unavailable. Please configure the GROQ_API_KEY in the backend.",
            responseType="error",
            keyPoints=[],
            suggestions=[]
        )

    client = AsyncGroq()

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    context_str = "CURRENT QUBITCRAFT CONTEXT (Use this to answer accurately):\n"
    has_context = False
    if request.context:
        if request.context.learnerLevel:
            context_str += f"- Learner Level: {request.context.learnerLevel}\n"
            has_context = True
        if request.context.circuit:
            context_str += f"- Circuit: {json.dumps(request.context.circuit)}\n"
            has_context = True
        if request.context.simulation:
            sim = request.context.simulation
            compact_sim = {
                "counts": sim.get("counts"),
                "probabilities": sim.get("probabilities")
            }
            context_str += f"- Simulation Result: {json.dumps(compact_sim)}\n"
            has_context = True
        if request.context.selectedGate:
            context_str += f"- Selected Gate: {json.dumps(request.context.selectedGate)}\n"
            has_context = True
        
    if has_context:
        messages.append({"role": "system", "content": context_str})

    for msg in request.conversation:
        messages.append({"role": msg.role, "content": msg.content})
    
    messages.append({"role": "user", "content": request.message})

    try:
        response = await client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        return TutorResponse(
            message=data.get("message", "I couldn't generate a clear response."),
            responseType=data.get("responseType", "explanation"),
            keyPoints=data.get("keyPoints", []),
            suggestions=data.get("suggestions", [])
        )
    except Exception as e:
        print(f"Groq API Error: {e}"); open('error.log', 'a').write(f"{e}\n")
        return TutorResponse(
            message="Quantum Tutor is temporarily unavailable. Please try again.",
            responseType="error",
            keyPoints=[],
            suggestions=[]
        )
