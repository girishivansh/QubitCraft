from typing import List, Optional, Any
from pydantic import BaseModel, Field

class GateOperationModel(BaseModel):
    id: str
    type: str
    target: int
    control: Optional[int] = None
    moment: int

class CircuitStateModel(BaseModel):
    numQubits: int
    operations: List[GateOperationModel] = Field(default_factory=list)

class ExperimentCreate(BaseModel):
    name: str
    description: str = ""
    circuit: CircuitStateModel
    userId: Optional[str] = None

class ExperimentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    circuit: Optional[CircuitStateModel] = None

class ExperimentModel(BaseModel):
    id: str
    name: str
    description: str = ""
    circuit: CircuitStateModel
    userId: Optional[str] = None
    createdAt: str
    updatedAt: str
