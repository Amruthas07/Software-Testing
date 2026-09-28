# MotoPass – Vehicle License & Inspection Result Portal
### Software Testing Laboratory & Final Case Study System

---

## 1. Project Overview
MotoPass is a full-stack portal designed to demonstrate core Software Testing concepts on a live, functioning application:
- **Lab 1**: Division-by-Zero Safety in Inspection Score calculation ($Total Points / Total Components$)
- **Lab 2 & 9**: IEEE-829 Test Planning & 9-Step Selenium End-to-End Automation
- **Lab 3 & 8**: Boundary Value Analysis (BVA: 17, 18, 19, 59, 60, 61) & Equivalence Partitioning ($Age < 18$, $18 \le Age \le 60$, $Age > 60$)
- **Lab 4**: Black-Box Testing – Digital Wallet (ATM Withdrawal Equivalent) with Non-Negative Invariant
- **Lab 5**: Defect Tracking System (Open $\to$ In Progress $\to$ Fixed $\to$ Retest $\to$ Closed)
- **Lab 6 & 7**: Test Metrics Dashboard ($Pass\%$, $Fail\%$, Defect Density, Inspection Pass Rate)
- **Lab 8**: White-Box Statement & Branch Coverage ($Score \ge 70 \implies PASSED$, else $FAILED$)
- **Lab 13**: Systematic Test Case Management

---

## 2. Directory & File Structure
```
/
├── backend/
│   ├── main.py              # FastAPI REST API implementation
│   ├── models.py            # SQLAlchemy ORM models
│   ├── database.py          # MySQL session & engine connection
│   └── requirements.txt     # Python dependencies
├── database/
│   ├── schema.sql           # MySQL 8.0 DDL with primary/foreign keys & CHECK constraints
│   └── seed_data.sql        # Seed data for users, vehicles, applications, and wallets
├── tests/
│   ├── test_api.py          # PyTest test suite (BVA, EP, ATM, Zero-Division, White-Box)
│   └── test_selenium.py     # Selenium automated 9-step regression suite
├── docs/
│   ├── IEEE_829_TEST_PLAN.md
│   └── SOFTWARE_TESTING_SYLLABUS_MAPPING.md # 22-part curriculum mapping
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── DashboardView.tsx
│   │   ├── AdminDashboardView.tsx
│   │   ├── VehicleRegistrationView.tsx
│   │   ├── LicenseApplicationView.tsx
│   │   ├── InspectionView.tsx
│   │   ├── WalletView.tsx
│   │   ├── TestingLabView.tsx
│   │   ├── DocumentationView.tsx
│   │   ├── AuthModal.tsx
│   │   └── ResultCertificateModal.tsx
│   ├── services/
│   │   ├── api.ts           # Axios client service
│   │   └── store.ts         # Authoritative business logic & persistence
│   ├── types/
│   │   └── index.ts         # TypeScript definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── vite.config.ts
```

---

## 3. How to Run Locally

### Frontend (React + Vite + Tailwind CSS)
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Backend (Python + FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API docs available at http://localhost:8000/docs
```

### Database (MySQL 8.0)
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed_data.sql
```

### Running Test Suites

#### 1. PyTest Unit & Integration Tests:
```bash
pytest tests/test_api.py -v
```

#### 2. Selenium Automated Workflow:
```bash
python tests/test_selenium.py
```

---

## 4. Default Demonstration Accounts
- **Citizen / User**: `rahul.verma@example.com` / `Password@123` (Age 24)
- **Admin**: `admin@motopass.gov` / `Admin@123`
- **Vehicle Inspector**: `inspector@motopass.gov` / `Inspector@123`
