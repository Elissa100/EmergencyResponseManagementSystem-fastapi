from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from passlib.context import CryptContext
from passlib.exc import UnknownHashError
from . import models, schemas, database
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except UnknownHashError:
        raise HTTPException(status_code=400, detail="Invalid password hash")

def verify_token(token: str, db: Session):
    # Implement token verification logic here
    # Return user object if valid, otherwise raise HTTPException
    user = db.query(models.User).filter(models.User.token == token).first()  # Example logic
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return verify_token(token, db)

def is_admin(user: schemas.User):
    if user.role != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized")
    return user

@app.get("/")
def read_root():
    return {"message": "Welcome to the Emergency Management System API using FastAPI"}

# User Registration
@app.post("/register/", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role if user.role else "User"  # Ensure role is set
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        print(f"Error registering user: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")

# User Login
@app.post("/login/")
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user is None:
        raise HTTPException(status_code=400, detail="Invalid email")
    try:
        if not verify_password(user.password, db_user.hashed_password):
            raise HTTPException(status_code=400, detail="Invalid password")
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    return {"id": db_user.id, "role": db_user.role, "message": "Login successful"}

# Create Emergency
@app.post("/emergencies/", response_model=schemas.Emergency)
def create_emergency(emergency: schemas.EmergencyCreate, db: Session = Depends(get_db)):
    db_emergency = models.Emergency(description=emergency.description, location=emergency.location, responder_id=emergency.responder_id)
    db.add(db_emergency)
    try:
        db.commit()
        db.refresh(db_emergency)
        return db_emergency
    except Exception as e:
        print(f"Error creating emergency: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Get a specific Emergency by ID
@app.get("/emergencies/{emergency_id}", response_model=schemas.Emergency)
def read_emergency(emergency_id: int, db: Session = Depends(get_db)):
    emergency = db.query(models.Emergency).filter(models.Emergency.id == emergency_id).first()
    if emergency is None:
        raise HTTPException(status_code=404, detail="Emergency not found")
    return emergency

# Get all Emergencies
@app.get("/emergencies/", response_model=List[schemas.Emergency])
def read_emergencies(db: Session = Depends(get_db)):
    emergencies = db.query(models.Emergency).all()
    return emergencies

# Get a specific User by ID
@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Get all Users (Admin Only)
@app.get("/users/", response_model=List[schemas.User])
def read_users(db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    is_admin(current_user)  # Check if the current user is admin
    users = db.query(models.User).all()
    return users

# Delete User (Admin Only)
@app.delete("/users/{user_id}", response_model=schemas.User)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    is_admin(current_user)  # Check if the current user is admin
    user_to_delete = db.query(models.User).filter(models.User.id == user_id).first()
    if user_to_delete is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user_to_delete)
    try:
        db.commit()
        return user_to_delete
    except Exception as e:
        print(f"Error deleting user: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")

def notify_user(user_email: str, emergency_description: str, response_text: str):
    print(f"Notification sent to {user_email}: Your emergency '{emergency_description}' has been responded to. Response: {response_text}")

# Assign Responder to Emergency and Store Response
@app.post("/emergencies/{emergency_id}/respond")
async def respond_to_emergency(emergency_id: int, request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    data = await request.json()
    responder_id = data['responder_id']
    response_text = data['response_text']
    emergency = db.query(models.Emergency).filter(models.Emergency.id == emergency_id).first()
    if emergency is None:
        raise HTTPException(status_code=404, detail="Emergency not found")
    if emergency.responder_id is not None:
        raise HTTPException(status_code=400, detail="Emergency already responded to")
    emergency.responder_id = responder_id
    emergency.response_text = response_text
    db_user = db.query(models.User).filter(models.User.id == emergency_id).first()
    try:
        db.commit()
        db.refresh(emergency)
        # Notify the user who reported the emergency
        if db_user:
            background_tasks.add_task(notify_user, db_user.email, emergency.description, response_text)
        return {"message": "Responder assigned successfully", "response_text": response_text}
    except Exception as e:
        print(f"Error assigning responder: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Analytics Endpoint
@app.get("/analytics/", response_model=schemas.Analytics)
def get_analytics(db: Session = Depends(get_db)):
    total_emergencies = db.query(models.Emergency).count()
    total_users = db.query(models.User).count()

    emergencies = db.query(models.Emergency).all()
    standard_emergency_types = {
        "Earthquake": ["Earthquake", "Earthquake: Earthquake"],
        "Fire": ["fire", "Fire in building", "Fire in the building!", "Fire outbreak", "Fire: ykjewfnmd v,n fxc", "A fire broke out in building X."],
        "Chemical Spill": ["Chemical Spill: chem spill"],
        "Choking": ["Choking: Choke"],
        "Poisoning": ["Poisoning:  I was present when the incident occurred. I noticed that the individual seemed fine at first, but then exhibited sudden changes in behavior.", "Poisoning: poison"],
        "Road Traffic Accident": ["Road Traffic Accident: A car hit me"],
        "Severe Allergic Reaction": ["Severe Allergic Reaction (Anaphylaxis): l"],
        "Severe Bleeding": ["Severe Bleeding: severe bleeding"],
        "Hurricane": ["Hurricane: Standing on the shore, the atmosphere is charged with an uncanny energy. The sky darkens ominously, shifting from blue to a deep gray, as thick clouds swell with moisture. The wind begins to pick up, howling and whipping about, creating a rising chorus of sound that drowns out everything else."]
    }

    standardized_emergencies = []
    for emergency in emergencies:
        standardized_type = "Other"
        for standard_type, variations in standard_emergency_types.items():
            if emergency.description in variations:
                standardized_type = standard_type
                break
        standardized_emergencies.append(standardized_type)

    emergency_counts = {type_: standardized_emergencies.count(type_) for type_ in standard_emergency_types.keys()}
    emergencies_by_type_data = [{"type": type_, "count": count} for type_, count in emergency_counts.items()]
    
    # Add logging for debugging
    print("Emergencies by Type Data:", emergencies_by_type_data)

    emergencies_by_location = (
        db.query(models.Emergency.location, func.count(models.Emergency.id))
        .group_by(models.Emergency.location)
        .all()
    )

    emergencies_by_location_data = [{"location": loc, "count": count} for loc, count in emergencies_by_location]

    return {
        "totalEmergencies": total_emergencies,
        "totalUsers": total_users,
        "emergenciesByType": emergencies_by_type_data,
        "emergenciesByLocation": emergencies_by_location_data,
    }
