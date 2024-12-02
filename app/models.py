from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Emergency(Base):
    __tablename__ = "emergencies"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(1024), index=True)
    location = Column(String(255), index=True)
    responder_id = Column(Integer, ForeignKey('users.id'))
    response_text = Column(String(1024))

    responder = relationship("User", back_populates="emergencies")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(String(255), index=True)

    emergencies = relationship("Emergency", back_populates="responder")
