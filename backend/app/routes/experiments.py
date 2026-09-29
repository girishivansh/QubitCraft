import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.db.database import get_collection
from app.models.experiment import (
    ExperimentModel,
    ExperimentCreate,
    ExperimentUpdate
)

router = APIRouter(prefix="/experiments", tags=["Experiments"])

def to_experiment_model(doc: dict) -> ExperimentModel:
    return ExperimentModel(
        id=doc["id"],
        name=doc.get("name", ""),
        description=doc.get("description", ""),
        circuit=doc.get("circuit", {"numQubits": 3, "operations": []}),
        userId=doc.get("userId"),
        createdAt=doc.get("createdAt", datetime.now(timezone.utc).isoformat()),
        updatedAt=doc.get("updatedAt", datetime.now(timezone.utc).isoformat())
    )

@router.get("", response_model=List[ExperimentModel])
async def get_experiments(userId: Optional[str] = Query(None)):
    experiments_col = get_collection("experiments")
    if experiments_col is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is not connected"
        )
    
    query = {}
    if userId:
        query = {"$or": [{"userId": userId}, {"userId": None}]}
    
    cursor = experiments_col.find(query).sort("updatedAt", -1)
    docs = await cursor.to_list(length=200)
    return [to_experiment_model(d) for d in docs]

@router.get("/{experiment_id}", response_model=ExperimentModel)
async def get_experiment(experiment_id: str):
    experiments_col = get_collection("experiments")
    if experiments_col is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is not connected"
        )
    
    doc = await experiments_col.find_one({"id": experiment_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experiment not found")
    
    return to_experiment_model(doc)

@router.post("", response_model=ExperimentModel)
async def create_experiment(payload: ExperimentCreate):
    experiments_col = get_collection("experiments")
    if experiments_col is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is not connected"
        )
    
    now_iso = datetime.now(timezone.utc).isoformat()
    new_id = str(uuid.uuid4())
    
    doc = {
        "id": new_id,
        "name": payload.name,
        "description": payload.description,
        "circuit": payload.circuit.model_dump(),
        "userId": payload.userId,
        "createdAt": now_iso,
        "updatedAt": now_iso
    }
    
    await experiments_col.insert_one(doc)
    return to_experiment_model(doc)

@router.put("/{experiment_id}", response_model=ExperimentModel)
async def update_experiment(experiment_id: str, updates: ExperimentUpdate):
    experiments_col = get_collection("experiments")
    if experiments_col is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is not connected"
        )
    
    update_data = {k: v for k, v in updates.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        doc = await experiments_col.find_one({"id": experiment_id})
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experiment not found")
        return to_experiment_model(doc)

    update_data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    
    result = await experiments_col.find_one_and_update(
        {"id": experiment_id},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experiment not found")
    
    return to_experiment_model(result)

@router.delete("/{experiment_id}")
async def delete_experiment(experiment_id: str):
    experiments_col = get_collection("experiments")
    if experiments_col is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is not connected"
        )
    
    res = await experiments_col.delete_one({"id": experiment_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experiment not found")
    
    return {"success": True, "id": experiment_id}
