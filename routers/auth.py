"""
routers/auth.py
================
SARA – Smart Airport Resource Analytics
Authentication Endpoints

Handles user signup and login.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.auth import create_access_token, hash_password, verify_password
from core.database import get_db
from core.models import Airline, User
from core.schemas import LoginRequest, SignupRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(data: SignupRequest, db: Session = Depends(get_db)) -> TokenResponse:
    """
    Register a new user.

    - **email**: User's email (must be unique)
    - **password**: Plain text password (will be hashed)
    - **role**: User role (admin, manager)
    - **airline_id**: ID of the airline the user belongs to

    Returns 400 if email already exists or airline not found.
    """
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    airline = db.query(Airline).filter(Airline.id == data.airline_id).first()
    if not airline:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Airline with id {data.airline_id} not found",
        )

    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        role=data.role,
        airline_id=data.airline_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": str(user.id), "email": user.email})

    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    """
    Authenticate user and return JWT token.

    - **email**: User's email
    - **password**: User's password

    Returns 401 if credentials are invalid.
    """
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": str(user.id), "email": user.email})

    return TokenResponse(access_token=token)