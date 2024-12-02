from pydantic import BaseModel
from typing import Optional, List

class EmergencyCreate(BaseModel):
    description: Optional[str] = None
    location: Optional[str] = None
    responder_id: Optional[int] = None

class Emergency(BaseModel):
    id: int
    description: Optional[str] = None
    location: Optional[str] = None
    responder_id: Optional[int] = None
    response_text: Optional[str] = None

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str

class User(BaseModel):
    id: int
    name: str
    email: str
    role: Optional[str] = None  # Allow role to be optional

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

class EmergencyTypeCount(BaseModel):
    type: str
    count: int

class EmergencyLocationCount(BaseModel):
    location: str
    count: int

class Analytics(BaseModel):
    totalEmergencies: int
    totalUsers: int
    emergenciesByType: List[EmergencyTypeCount]
    emergenciesByLocation: List[EmergencyLocationCount]
