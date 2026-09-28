"""
SQLAlchemy ORM Models for MotoPass Portal
Tables:
1. users
2. vehicles
3. license_applications
4. inspections
5. inspection_components
6. wallets
7. transactions
8. results
9. test_cases
10. defects
11. test_metrics
"""

from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from backend.database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    mobile = Column(String(15), nullable=False)
    password_hash = Column(String(255), nullable=False)
    age = Column(Integer, nullable=False) # BVA: 18 - 60
    address = Column(Text, nullable=False)
    state = Column(String(50), nullable=False)
    city = Column(String(50), nullable=False)
    role = Column(String(20), default="user") # 'user', 'admin', 'inspector'
    created_at = Column(DateTime, default=datetime.utcnow)

    vehicles = relationship("VehicleModel", back_populates="owner")
    applications = relationship("LicenseApplicationModel", back_populates="applicant")
    wallet = relationship("WalletModel", back_populates="user", uselist=False)

class VehicleModel(Base):
    __tablename__ = "vehicles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    vehicle_number = Column(String(20), unique=True, nullable=False)
    vehicle_type = Column(String(20), nullable=False) # Car, Bike, Scooter, Other
    brand = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    manufacturing_year = Column(Integer, nullable=False)
    fuel_type = Column(String(20), nullable=False)
    owner_name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("UserModel", back_populates="vehicles")
    applications = relationship("LicenseApplicationModel", back_populates="vehicle")

class LicenseApplicationModel(Base):
    __tablename__ = "license_applications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    applicant_name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False) # Check: 18 - 60
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    license_type = Column(String(50), nullable=False)
    application_date = Column(String(20), nullable=False)
    address = Column(Text, nullable=False)
    state = Column(String(50), nullable=False)
    city = Column(String(50), nullable=False)
    status = Column(String(30), default="Submitted") # Draft, Submitted, Under Inspection, Approved, Rejected
    fee_amount = Column(Float, default=500.0)
    payment_status = Column(String(20), default="UNPAID") # UNPAID, PAID
    created_at = Column(DateTime, default=datetime.utcnow)

    applicant = relationship("UserModel", back_populates="applications")
    vehicle = relationship("VehicleModel", back_populates="applications")
    inspection = relationship("InspectionModel", back_populates="application", uselist=False)
    result = relationship("ResultModel", back_populates="application", uselist=False)

class InspectionModel(Base):
    __tablename__ = "inspections"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("license_applications.id"), unique=True, nullable=False)
    vehicle_id = Column(String(36), nullable=False)
    inspector_id = Column(String(36), nullable=False)
    inspector_name = Column(String(100), nullable=False)
    inspection_date = Column(String(20), nullable=False)
    total_points = Column(Float, default=0.0)
    total_components = Column(Integer, default=0)
    average_score = Column(Float, default=0.0)
    status = Column(String(20), default="COMPLETED")
    created_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("LicenseApplicationModel", back_populates="inspection")
    components = relationship("InspectionComponentModel", back_populates="inspection")

class InspectionComponentModel(Base):
    __tablename__ = "inspection_components"

    id = Column(Integer, primary_key=True, autoincrement=True)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=False)
    component_name = Column(String(50), nullable=False) # Brakes, Lights, Tyres, Engine, Safety
    score = Column(Float, nullable=False) # Max 20
    max_score = Column(Float, default=20.0)
    remarks = Column(String(255))

    inspection = relationship("InspectionModel", back_populates="components")

class WalletModel(Base):
    __tablename__ = "wallets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    balance = Column(Float, default=2000.0) # Check: balance >= 0
    currency = Column(String(10), default="₹")
    last_updated = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="wallet")

class TransactionModel(Base):
    __tablename__ = "transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    application_id = Column(String(36), nullable=True)
    amount = Column(Float, nullable=False)
    type = Column(String(30), nullable=False) # CREDIT_TOPUP, DEBIT_LICENSE_FEE
    status = Column(String(30), nullable=False) # SUCCESS, INSUFFICIENT_FUNDS, INVALID_AMOUNT, FAILED
    description = Column(String(255), nullable=False)
    balance_after = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class ResultModel(Base):
    __tablename__ = "results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("license_applications.id"), unique=True, nullable=False)
    inspection_id = Column(String(36), unique=True, nullable=False)
    applicant_name = Column(String(100), nullable=False)
    vehicle_number = Column(String(20), nullable=False)
    total_score = Column(Float, nullable=False)
    average_score = Column(Float, nullable=False)
    status = Column(String(20), nullable=False) # PASSED if score >= 70 else FAILED
    application_status = Column(String(30), nullable=False) # Approved or Rejected
    inspection_date = Column(String(20), nullable=False)
    inspector = Column(String(100), nullable=False)
    remarks = Column(Text)
    evaluated_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("LicenseApplicationModel", back_populates="result")
