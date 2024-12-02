from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database

router = APIRouter(
    prefix="/emergencies",
    tags=["emergencies"],
)

@router.post("/", response_model=schemas.Emergency)
def create_emergency(emergency: schemas.EmergencyCreate, db: Session = Depends(database.get_db)):
    db_emergency = models.Emergency(**emergency.dict())
    db.add(db_emergency)
    db.commit()
    db.refresh(db_emergency)
    return db_emergency

@router.get("/{emergency_id}", response_model=schemas.Emergency)
def read_emergency(emergency_id: int, db: Session = Depends(database.get_db)):
    db_emergency = db.query(models.Emergency).filter(models.Emergency.id == emergency_id).first()
    if db_emergency is None:
        raise HTTPException(status_code=404, detail="Emergency not found")
    return db_emergency

@router.put("/{emergency_id}", response_model=schemas.Emergency)
def update_emergency(emergency_id: int, emergency: schemas.EmergencyCreate, db: Session = Depends(database.get_db)):
    db_emergency = db.query(models.Emergency).filter(models.Emergency.id == emergency_id).first()
    if db_emergency is None:
        raise HTTPException(status_code=404, detail="Emergency not found")
    for key, value in emergency.dict().items():
        setattr(db_emergency, key, value)
    db.commit()
    db.refresh(db_emergency)
    return db_emergency

@router.delete("/{emergency_id}")
def delete_emergency(emergency_id: int, db: Session = Depends(database.get_db)):
    db_emergency = db.query(models.Emergency).filter(models.Emergency.id == emergency_id).first()
    if db_emergency is None:
        raise HTTPException(status_code=404, detail="Emergency not found")
    db.delete(db_emergency)
    db.commit()
    return {"message": "Emergency deleted successfully"}
