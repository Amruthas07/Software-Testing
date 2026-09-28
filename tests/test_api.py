"""
PyTest Test Suite for MotoPass Portal
Designed for Software Testing Laboratory Examination
Covers:
- Lab 1: Division by Zero Error Handling
- Lab 3 & Lab 8: Age Field Boundary Value Analysis (BVA) & Equivalence Partitioning (EP)
- Lab 4: Digital Wallet Black-Box Testing (ATM Equivalent)
- Lab 8: White-Box Statement & Branch Coverage
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

# ==============================================================
# LAB 1: DIVISION BY ZERO / INSPECTION COMPONENT CALCULATION
# ==============================================================
class TestLab1InspectionCalculation:

    def test_inspection_score_normal_components(self):
        """Test standard 5-component inspection calculation."""
        components = [
            {"name": "Brakes", "score": 20, "max_score": 20},
            {"name": "Lights", "score": 20, "max_score": 20},
            {"name": "Tyres", "score": 20, "max_score": 20},
            {"name": "Engine", "score": 20, "max_score": 20},
            {"name": "Safety Equipment", "score": 20, "max_score": 20},
        ]
        response = client.post("/api/inspections/calculate", json=components)
        assert response.status_code == 200
        data = response.json()
        assert data["total_points"] == 100
        assert data["total_components"] == 5
        assert data["average_score"] == 20.0

    def test_inspection_score_division_by_zero_handling(self):
        """
        LAB 1 TEST CASE: Division-by-zero condition when no components exist.
        Calculation function MUST safely handle 0 components and return appropriate error.
        """
        empty_components = []
        response = client.post("/api/inspections/calculate", json=empty_components)
        assert response.status_code == 400
        data = response.json()
        assert "Cannot calculate average: no inspection components available." in data["detail"]


# ==============================================================
# LAB 3 & LAB 8: AGE FIELD VALIDATION (BVA & EQUIVALENCE PARTITIONING)
# Allowed age: 18 to 60 inclusive.
# BVA Test Points: 17, 18, 19, 59, 60, 61
# ==============================================================
class TestLab3AgeFieldBVAAndEP:

    def get_payload(self, age: int, email_suffix: str):
        return {
            "full_name": f"Test Applicant {age}",
            "email": f"applicant_{age}_{email_suffix}@motopass.gov",
            "mobile": "9876543210",
            "password": "Password@123",
            "confirm_password": "Password@123",
            "age": age,
            "address": "404 Testing Lab Boulevard",
            "state": "Karnataka",
            "city": "Bengaluru"
        }

    # BVA: 17 -> Invalid (Min - 1)
    def test_bva_age_17_invalid(self):
        payload = self.get_payload(17, "bva17")
        response = client.post("/api/auth/register", json=payload)
        assert response.status_code == 422
        assert "Age must be at least 18 years old" in response.json()["detail"]

    # BVA: 18 -> Valid (Min Boundary)
    def test_bva_age_18_valid(self):
        payload = self.get_payload(18, "bva18")
        response = client.post("/api/auth/register", json=payload)
        assert response.status_code == 201

    # BVA: 19 -> Valid (Min + 1)
    def test_bva_age_19_valid(self):
        payload = self.get_payload(19, "bva19")
        response = client.post("/api/auth/register", json=payload)
        assert response.status_code == 201

    # BVA: 59 -> Valid (Max - 1)
    def test_bva_age_59_valid(self):
        payload = self.get_payload(59, "bva59")
        response = client.post("/api/auth/register", json=payload)
        assert response.status_code == 201

    # BVA: 60 -> Valid (Max Boundary)
    def test_bva_age_60_valid(self):
        payload = self.get_payload(60, "bva60")
        response = client.post("/api/auth/register", json=payload)
        assert response.status_code == 201

    # BVA: 61 -> Invalid (Max + 1)
    def test_bva_age_61_invalid(self):
        payload = self.get_payload(61, "bva61")
        response = client.post("/api/auth/register", json=payload)
        assert response.status_code == 422
        assert "Age cannot exceed 60 years old" in response.json()["detail"]

    # EP: Invalid Partition 1 (Age < 18)
    def test_ep_underage_partition(self):
        payload = self.get_payload(10, "ep10")
        response = client.post("/api/auth/register", json=payload)
        assert response.status_code == 422

    # EP: Valid Partition (18 <= Age <= 60)
    def test_ep_valid_partition(self):
        payload = self.get_payload(35, "ep35")
        response = client.post("/api/auth/register", json=payload)
        assert response.status_code == 201

    # EP: Invalid Partition 2 (Age > 60)
    def test_ep_overage_partition(self):
        payload = self.get_payload(72, "ep72")
        response = client.post("/api/auth/register", json=payload)
        assert response.status_code == 422


# ==============================================================
# LAB 4: BLACK-BOX TESTING - DIGITAL WALLET (ATM EQUIVALENT)
# Test cases:
# 1. Balance > Fee -> Payment successful
# 2. Balance = Fee -> Payment successful
# 3. Balance < Fee -> Insufficient balance
# 4. Fee = 0 -> Invalid amount
# 5. Negative fee -> Invalid amount
# Balance never negative
# ==============================================================
class TestLab4DigitalWalletBlackBox:

    def test_wallet_balance_greater_than_fee(self):
        # Register user with initial 2000 balance
        reg = client.post("/api/auth/register", json={
            "full_name": "Wallet User 1",
            "email": "wallet1@test.gov",
            "mobile": "9999911111",
            "password": "Password@123",
            "confirm_password": "Password@123",
            "age": 28,
            "address": "Wallet Lane",
            "state": "Karnataka",
            "city": "Bengaluru"
        }).json()
        uid = reg["user_id"]

        # Pay 500 when balance = 2000
        res = client.post("/api/wallet/pay", json={"user_id": uid, "amount": 500.0})
        assert res.status_code == 200
        assert res.json()["new_balance"] == 1500.0

    def test_wallet_balance_equals_fee(self):
        # Top-up user so balance exactly equals fee
        reg = client.post("/api/auth/register", json={
            "full_name": "Wallet User 2",
            "email": "wallet2@test.gov",
            "mobile": "9999922222",
            "password": "Password@123",
            "confirm_password": "Password@123",
            "age": 30,
            "address": "Exact Lane",
            "state": "Karnataka",
            "city": "Bengaluru"
        }).json()
        uid = reg["user_id"]

        # User has 2000. Pay exact 2000.
        res = client.post("/api/wallet/pay", json={"user_id": uid, "amount": 2000.0})
        assert res.status_code == 200
        assert res.json()["new_balance"] == 0.0

    def test_wallet_insufficient_balance(self):
        reg = client.post("/api/auth/register", json={
            "full_name": "Wallet User 3",
            "email": "wallet3@test.gov",
            "mobile": "9999933333",
            "password": "Password@123",
            "confirm_password": "Password@123",
            "age": 32,
            "address": "Low Balance Ave",
            "state": "Karnataka",
            "city": "Bengaluru"
        }).json()
        uid = reg["user_id"]

        # Balance is 2000. Attempt 2500 fee payment.
        res = client.post("/api/wallet/pay", json={"user_id": uid, "amount": 2500.0})
        assert res.status_code == 400
        assert "Insufficient balance" in res.json()["detail"]

    def test_wallet_zero_amount(self):
        reg = client.post("/api/auth/register", json={
            "full_name": "Wallet User 4",
            "email": "wallet4@test.gov",
            "mobile": "9999944444",
            "password": "Password@123",
            "confirm_password": "Password@123",
            "age": 34,
            "address": "Zero Ave",
            "state": "Karnataka",
            "city": "Bengaluru"
        }).json()
        uid = reg["user_id"]

        res = client.post("/api/wallet/pay", json={"user_id": uid, "amount": 0.0})
        assert res.status_code == 400
        assert "fee must be greater than zero" in res.json()["detail"]

    def test_wallet_negative_amount(self):
        reg = client.post("/api/auth/register", json={
            "full_name": "Wallet User 5",
            "email": "wallet5@test.gov",
            "mobile": "9999955555",
            "password": "Password@123",
            "confirm_password": "Password@123",
            "age": 36,
            "address": "Neg Ave",
            "state": "Karnataka",
            "city": "Bengaluru"
        }).json()
        uid = reg["user_id"]

        res = client.post("/api/wallet/pay", json={"user_id": uid, "amount": -100.0})
        assert res.status_code == 400
        assert "negative amounts are not permitted" in res.json()["detail"]


# ==============================================================
# LAB 8: WHITE-BOX TESTING (STATEMENT & BRANCH COVERAGE)
# Decision logic:
# IF score >= 70:
#     status = "PASSED"
# ELSE:
#     status = "FAILED"
# Test cases:
# - score = 70 (True branch boundary)
# - score = 69 (False branch boundary)
# - score = 100 (True branch maximum)
# - score = 0 (False branch minimum)
# ==============================================================
class TestLab8WhiteBoxCoverage:

    def test_whitebox_branch_score_70_passed(self):
        payload = {
            "application_id": "app-wb-70",
            "vehicle_id": "veh-wb-70",
            "inspector_id": "ins-01",
            "inspector_name": "Inspector Test",
            "inspection_date": "2026-03-28",
            "components": [
                {"name": "Brakes", "score": 14, "max_score": 20},
                {"name": "Lights", "score": 14, "max_score": 20},
                {"name": "Tyres", "score": 14, "max_score": 20},
                {"name": "Engine", "score": 14, "max_score": 20},
                {"name": "Safety", "score": 14, "max_score": 20},
            ] # Total = 70
        }
        res = client.post("/api/inspections", json=payload)
        assert res.status_code == 201
        assert res.json()["result_status"] == "PASSED"
        assert res.json()["application_status"] == "Approved"

    def test_whitebox_branch_score_69_failed(self):
        payload = {
            "application_id": "app-wb-69",
            "vehicle_id": "veh-wb-69",
            "inspector_id": "ins-01",
            "inspector_name": "Inspector Test",
            "inspection_date": "2026-03-28",
            "components": [
                {"name": "Brakes", "score": 14, "max_score": 20},
                {"name": "Lights", "score": 14, "max_score": 20},
                {"name": "Tyres", "score": 14, "max_score": 20},
                {"name": "Engine", "score": 14, "max_score": 20},
                {"name": "Safety", "score": 13, "max_score": 20},
            ] # Total = 69
        }
        res = client.post("/api/inspections", json=payload)
        assert res.status_code == 201
        assert res.json()["result_status"] == "FAILED"
        assert res.json()["application_status"] == "Rejected"

    def test_whitebox_branch_score_100_passed(self):
        payload = {
            "application_id": "app-wb-100",
            "vehicle_id": "veh-wb-100",
            "inspector_id": "ins-01",
            "inspector_name": "Inspector Test",
            "inspection_date": "2026-03-28",
            "components": [
                {"name": "Brakes", "score": 20, "max_score": 20},
                {"name": "Lights", "score": 20, "max_score": 20},
                {"name": "Tyres", "score": 20, "max_score": 20},
                {"name": "Engine", "score": 20, "max_score": 20},
                {"name": "Safety", "score": 20, "max_score": 20},
            ] # Total = 100
        }
        res = client.post("/api/inspections", json=payload)
        assert res.status_code == 201
        assert res.json()["result_status"] == "PASSED"

    def test_whitebox_branch_score_0_failed(self):
        payload = {
            "application_id": "app-wb-0",
            "vehicle_id": "veh-wb-0",
            "inspector_id": "ins-01",
            "inspector_name": "Inspector Test",
            "inspection_date": "2026-03-28",
            "components": [
                {"name": "Brakes", "score": 0, "max_score": 20},
                {"name": "Lights", "score": 0, "max_score": 20},
                {"name": "Tyres", "score": 0, "max_score": 20},
                {"name": "Engine", "score": 0, "max_score": 20},
                {"name": "Safety", "score": 0, "max_score": 20},
            ] # Total = 0
        }
        res = client.post("/api/inspections", json=payload)
        assert res.status_code == 201
        assert res.json()["result_status"] == "FAILED"
