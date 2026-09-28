from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import date, datetime
import decimal

app = FastAPI(
    title="MotoPass API",
    description="Backend REST API for MotoPass - Vehicle License & Inspection Result Portal. Designed for Software Testing Case Studies.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- SCHEMAS -----------------
class UserRegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    mobile: str
    password: str
    confirm_password: str
    age: int
    address: str
    state: str
    city: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

class VehicleCreateRequest(BaseModel):
    user_id: str
    vehicle_number: str
    vehicle_type: str
    brand: str
    model: str
    manufacturing_year: int
    fuel_type: str
    owner_name: str

class LicenseApplicationRequest(BaseModel):
    user_id: str
    applicant_name: str
    age: int
    vehicle_id: str
    license_type: str
    application_date: date
    address: str
    state: str
    city: str

class InspectionComponentItem(BaseModel):
    name: str
    score: float
    max_score: float = 20.0
    remarks: Optional[str] = ""

class InspectionSubmitRequest(BaseModel):
    application_id: str
    vehicle_id: str
    inspector_id: str
    inspector_name: str
    inspection_date: date
    components: List[InspectionComponentItem]

class WalletPayRequest(BaseModel):
    user_id: str
    amount: float
    application_id: Optional[str] = None
    description: Optional[str] = "License Fee Payment"

# ----------------- IN-MEMORY STATE FOR LOCAL DEMO -----------------
USERS_DB = {}
WALLETS_DB = {}
VEHICLES_DB = {}
APPLICATIONS_DB = {}
INSPECTIONS_DB = {}
RESULTS_DB = {}
TRANSACTIONS_DB = []

# ----------------- ENDPOINTS -----------------

@app.get("/")
def read_root():
    return {
        "portal": "MotoPass – Vehicle License & Inspection Result Portal",
        "status": "Operational",
        "documentation": "/docs"
    }

# LAB 3 & LAB 8: AGE FIELD VALIDATION (BVA / EP)
@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegisterRequest):
    # Rule: Allowed age: 18 to 60 inclusive
    if user.age < 18:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Registration failed: Age must be at least 18 years old."
        )
    if user.age > 60:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Registration failed: Age cannot exceed 60 years old."
        )
    if user.password != user.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )
    if user.email in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )

    user_id = f"usr-{len(USERS_DB) + 1:03d}"
    USERS_DB[user.email] = {
        "id": user_id,
        "full_name": user.full_name,
        "email": user.email,
        "mobile": user.mobile,
        "age": user.age,
        "address": user.address,
        "state": user.state,
        "city": user.city,
        "role": "user"
    }
    # Initial wallet balance = 2000
    WALLETS_DB[user_id] = 2000.00
    return {
        "message": "Registration successful",
        "user_id": user_id,
        "initial_wallet_balance": 2000.00
    }

@app.post("/api/auth/login")
def login(creds: UserLoginRequest):
    user = USERS_DB.get(creds.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    return {
        "message": "Login successful",
        "user": user,
        "token": f"mock-jwt-token-{user['id']}"
    }

# LAB 1: VEHICLE INSPECTION SCORE CALCULATION & DIVISION-BY-ZERO SAFETY
@app.post("/api/inspections/calculate")
def calculate_inspection_score(components: List[InspectionComponentItem]):
    total_components = len(components)
    total_points = sum(c.score for c in components)

    # CRITICAL LAB 1: Test division-by-zero condition when no components exist
    if total_components == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot calculate average: no inspection components available."
        )

    average_score = round(total_points / total_components, 2)
    return {
        "total_points": total_points,
        "total_components": total_components,
        "average_score": average_score
    }

# LAB 8: WHITE-BOX TESTING BRANCH COVERAGE (PASS >= 70 / FAIL < 70)
@app.post("/api/inspections", status_code=status.HTTP_201_CREATED)
def submit_inspection(req: InspectionSubmitRequest):
    total_components = len(req.components)
    if total_components == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot calculate average: no inspection components available."
        )

    total_points = sum(c.score for c in req.components)
    avg_score = round(total_points / total_components, 2)

    # Statement & Branch Coverage Logic:
    # IF score >= 70 -> PASSED
    # ELSE -> FAILED
    if total_points >= 70:
        result_status = "PASSED"
        app_status = "Approved"
    else:
        result_status = "FAILED"
        app_status = "Rejected"

    insp_id = f"insp-{len(INSPECTIONS_DB) + 1:03d}"
    INSPECTIONS_DB[insp_id] = {
        "id": insp_id,
        "application_id": req.application_id,
        "total_points": total_points,
        "average_score": avg_score,
        "status": result_status
    }

    return {
        "inspection_id": insp_id,
        "total_points": total_points,
        "average_score": avg_score,
        "result_status": result_status,
        "application_status": app_status
    }

# LAB 4: BLACK-BOX TESTING - DIGITAL WALLET (ATM EQUIVALENT)
@app.post("/api/wallet/pay")
def pay_wallet(req: WalletPayRequest):
    user_id = req.user_id
    fee = req.amount
    balance = WALLETS_DB.get(user_id, 0.0)

    # Rule 4: Fee == 0 -> Invalid amount
    if fee == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment amount: fee must be greater than zero."
        )

    # Rule 5: Negative fee -> Invalid amount
    if fee < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment amount: negative amounts are not permitted."
        )

    # Rule 3: Balance < Fee -> Insufficient balance
    if balance < fee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient balance. Current balance: ₹{balance}, Required: ₹{fee}."
        )

    # Rules 1 & 2: Balance >= Fee -> Successful
    new_balance = balance - fee
    WALLETS_DB[user_id] = new_balance

    tx = {
        "tx_id": f"tx-{len(TRANSACTIONS_DB) + 1:04d}",
        "user_id": user_id,
        "amount": fee,
        "balance_after": new_balance,
        "status": "SUCCESS",
        "timestamp": datetime.utcnow().isoformat()
    }
    TRANSACTIONS_DB.append(tx)

    return {
        "status": "SUCCESS",
        "message": f"Payment of ₹{fee} processed successfully.",
        "previous_balance": balance,
        "new_balance": new_balance
    }

@app.get("/api/wallet/{user_id}")
def get_wallet(user_id: str):
    balance = WALLETS_DB.get(user_id, 2000.00)
    return {"user_id": user_id, "balance": balance, "currency": "₹"}
