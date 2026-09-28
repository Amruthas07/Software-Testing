# MotoPass – Vehicle License & Inspection Result Portal
## Complete Software Testing Laboratory Case Study & Documentation
**Syllabus Mapping for Labs 1 through 9, Final Case Study, and Viva Voce**

---

### Section 1: Project Introduction
MotoPass is an enterprise-grade vehicle licensing, mechanical inspection scoring, and digital fee processing portal. Built specifically as an educational and operational case study for Software Testing engineering courses, the platform provides working interactive demonstrations of core verification and validation methodologies: Boundary Value Analysis (BVA), Equivalence Partitioning (EP), Black-Box Behavioral Testing, White-Box Statement & Branch Coverage, IEEE-829 Test Planning, Selenium Automation, and Defect Tracking.

### Section 2: Problem Statement
Traditional transport office licensing systems suffer from fragmented manual inspection score recording, inconsistent application status synchronization, and arithmetic vulnerabilities (such as unhandled zero-division when inspection bays lack active component sensors). In academic software testing curricula, students frequently learn theoretical testing concepts without experiencing how code logic, boundary conditions, and test metrics function in a live, interconnected full-stack environment.

### Section 3: Objectives
1. Provide a zero-crash, highly resilient portal for citizen vehicle registration and license application.
2. Enforce strict Age validation (18 to 60 inclusive) across frontend UI controls and backend REST API contracts.
3. Implement a 5-component vehicle inspection scoring engine with graceful division-by-zero handling (Lab 1).
4. Demonstrate Black-Box testing via a simulated digital wallet replicating ATM withdrawal boundary rules (Lab 4).
5. Demonstrate White-Box testing with complete statement and branch coverage on the Pass/Fail decision boundary (Score $\ge$ 70) (Lab 8).
6. Enable live defect lifecycle tracking and test execution metrics generation (Labs 5, 6, 7).
7. Expose deterministic, predictable DOM selectors for Selenium automated end-to-end regression testing (Labs 2 & 9).

### Section 4: Scope
- **User / Citizen Operations**: Registration, secure authentication, vehicle profile management, license application submission, inspection result verification, and wallet fee payment.
- **Admin / Inspector Operations**: Citizen auditing, inspection scoring entry across 5 components, Pass/Fail result authorization, transaction monitoring, and defect tracking.
- **Testing Engineer Operations**: Interactive execution of BVA/EP matrices, inspection arithmetic testing, white-box branch tracing, defect logging, and metrics computation.

### Section 5: Functional Requirements (FR)
- **FR-01 (Authentication)**: Register users with Full Name, Email, Mobile, Password, Age, Address, State, City. Validate unique email and password confirmation.
- **FR-02 (Age Boundary Enforcement)**: Block registration and license submission if applicant age is outside $[18, 60]$. Return HTTP 422 with descriptive validation text.
- **FR-03 (Vehicle Registry)**: Register vehicles with Vehicle Number, Vehicle Type (Car, Bike, Scooter, Other), Brand, Model, Year ($\ge 1980$), Fuel Type, Owner Name.
- **FR-04 (License Application)**: Link verified vehicle to applicant with selected License Type (Two-Wheeler Learner, Permanent, Four-Wheeler LMV, Commercial Transport).
- **FR-05 (Inspection Scoring)**: Enter component scores for Brakes (20), Lights (20), Tyres (20), Engine (20), Safety Equipment (20). Total = 100. Calculate Total Points and Average Score ($\text{Total Points} / \text{Total Components}$).
- **FR-06 (Division by Zero Safety)**: If $\text{Total Components} = 0$, abort calculation gracefully and return: `"Cannot calculate average: no inspection components available."`
- **FR-07 (Pass/Fail Decision Logic)**: If $\text{Score} \ge 70$, mark license application status as **PASSED/Approved**; else mark **FAILED/Rejected**.
- **FR-08 (Digital Wallet Engine)**: Allow simulated digital wallet balance debit for license fees. Enforce:
  - $\text{Balance} > \text{Fee} \implies \text{Success}$
  - $\text{Balance} = \text{Fee} \implies \text{Success}$
  - $\text{Balance} < \text{Fee} \implies \text{Insufficient Balance}$
  - $\text{Fee} = 0 \implies \text{Invalid Amount}$
  - $\text{Fee} < 0 \implies \text{Invalid Amount}$
  - Balance must never become negative.

### Section 6: Non-Functional Requirements (NFR)
- **NFR-01 (Reliability & Robustness)**: Zero unhandled runtime exceptions; all calculation corner cases trapped with user-friendly notices.
- **NFR-02 (Deterministic Automation)**: All interactive inputs and buttons carry static, predictable IDs (`id="reg-age"`, `id="btn-login-submit"`, `id="insp-brakes"`).
- **NFR-03 (Performance)**: Client UI transitions render within 150ms; API latency $\le 200\text{ms}$.
- **NFR-04 (Security)**: Passwords hashed; role-based access control (User vs Admin vs Inspector).

### Section 7: System Architecture
```
+-------------------------------------------------------------+
|                     Client Presentation                     |
|  React 19 + Vite + Tailwind CSS + Lucide Icons + Axios      |
|  - User Portal     - Admin Inspector View   - Testing Lab   |
+------------------------------+------------------------------+
                               | REST JSON HTTP Calls
+------------------------------v------------------------------+
|                    FastAPI Backend Engine                   |
|  - Auth & Age Boundary Validator (BVA/EP Engine)             |
|  - Inspection Arithmetic Service (Division-by-Zero Safety)  |
|  - White-Box Decision Logic (Branch Score >= 70)            |
|  - Digital Wallet Debit Controller (ATM Invariants)         |
+------------------------------+------------------------------+
                               | SQL DDL / ORM
+------------------------------v------------------------------+
|                     MySQL 8.0 Database                      |
|  - users              - vehicles            - applications   |
|  - inspections        - components          - results        |
|  - wallets            - transactions        - test_cases     |
|  - defects            - test_metrics                         |
+-------------------------------------------------------------+
```

### Section 8: Database Design
See `/database/schema.sql` for table definitions, foreign keys, CHECK constraints (`chk_user_age`, `chk_veh_year`, `chk_non_negative_balance`), and relationships.

### Section 9 & 10: Use Case Diagram & Data Flow Diagram (DFD)
- **Use Cases**:
  - `UC-1`: Citizen Register & Login
  - `UC-2`: Citizen Add Vehicle
  - `UC-3`: Citizen Apply for Driving License
  - `UC-4`: Inspector Conduct Component Inspection
  - `UC-5`: System Compute Score & Determine Result
  - `UC-6`: Citizen Pay License Fee via Wallet
  - `UC-7`: QA Engineer Execute Test Cases & Log Defects
- **DFD Level 0**: External Entities (Citizen, Inspector, QA Tester) $\to$ MotoPass Core System $\to$ Database Storage.
- **DFD Level 1**: User Credentials $\to$ 1.0 Auth Process $\to$ 2.0 Vehicle Registration $\to$ 3.0 License Submission $\to$ 4.0 Inspection Bay $\to$ 5.0 Result Engine $\to$ 6.0 Wallet Transaction.

### Section 11: IEEE-829 Format Test Plan Summary
1. **Test Plan Identifier**: `TP-MOTOPASS-2026-V1`
2. **Introduction**: Verifies functional correctness, boundary safety, division-by-zero avoidance, and wallet integrity.
3. **Test Items**: Authentication module, Inspection calculation module, Wallet payment module, White-box decision module.
4. **Features to be Tested**: Age BVA (17, 18, 19, 59, 60, 61), Zero component handling, ATM payment conditions, Pass/Fail threshold (70).
5. **Item Pass/Fail Criteria**: 100% of critical tests must pass; 0 critical unhandled defects.
6. **Approach**: Automated PyTest unit tests, Selenium end-to-end regression, manual interactive workbench verification.

### Section 12: Test Cases (Summary)
- `TC-AGE-001` through `TC-AGE-006`: BVA Age testing (17, 18, 19, 59, 60, 61)
- `TC-EP-001` through `TC-EP-003`: Equivalence Partitioning (<18, 18-60, >60)
- `TC-INSP-001`: Lab 1 Division-by-zero check (0 components)
- `TC-WAL-001` through `TC-WAL-005`: Black-box wallet test matrix
- `TC-WB-001` through `TC-WB-004`: White-box statement & branch coverage (70, 69, 100, 0)
- `TC-INT-001`: End-to-end integration workflow

### Section 13 & 14: Equivalence Partitioning & Boundary Value Analysis (Age Field)
| Partition Type | Range | Test Value | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **Invalid Partition 1** | $\text{Age} < 18$ | 12 | Registration Rejected (HTTP 422) |
| **Valid Partition** | $18 \le \text{Age} \le 60$ | 32 | Registration Accepted (HTTP 201) |
| **Invalid Partition 2** | $\text{Age} > 60$ | 75 | Registration Rejected (HTTP 422) |

**BVA Values**:
- $17$ ($\text{Min} - 1$): Invalid
- $18$ ($\text{Min}$ boundary): Valid
- $19$ ($\text{Min} + 1$): Valid
- $59$ ($\text{Max} - 1$): Valid
- $60$ ($\text{Max}$ boundary): Valid
- $61$ ($\text{Max} + 1$): Invalid

### Section 15: Black-Box Testing (Digital Wallet / ATM Equivalent)
| Test Condition | Wallet Balance | Fee Amount | Expected Status | Resulting Balance |
| :--- | :--- | :--- | :--- | :--- |
| $\text{Balance} > \text{Fee}$ | ₹2,000 | ₹500 | `SUCCESS` | ₹1,500 |
| $\text{Balance} = \text{Fee}$ | ₹500 | ₹500 | `SUCCESS` | ₹0 |
| $\text{Balance} < \text{Fee}$ | ₹200 | ₹500 | `INSUFFICIENT_FUNDS` | ₹200 (Untouched) |
| $\text{Fee} = 0$ | ₹1,000 | ₹0 | `INVALID_AMOUNT` | ₹1,000 (Untouched) |
| $\text{Fee} < 0$ | ₹1,000 | -₹150 | `INVALID_AMOUNT` | ₹1,000 (Untouched) |

### Section 16: White-Box Testing (Statement & Branch Coverage)
```
                  [Start]
                     |
        [Inspection Score Calculated]
                     |
             Is Score >= 70 ?
             /              \
       TRUE /                \ FALSE
           v                  v
  [status = "PASSED"]    [status = "FAILED"]
  [app = "Approved"]     [app = "Rejected"]
           \                  /
            \                /
             v              v
      [Save Result & Certificate]
                     |
                   [End]
```
- **Test 1** ($\text{Score} = 70$): Exercises True branch along boundary condition.
- **Test 2** ($\text{Score} = 69$): Exercises False branch along boundary condition.
- **Test 3** ($\text{Score} = 100$): Exercises True branch extreme.
- **Test 4** ($\text{Score} = 0$): Exercises False branch extreme.
- Together, $100\%$ Statement Coverage and $100\%$ Branch Coverage are achieved.

### Section 17: Defect Tracking Workflow
Statuses: `Open` $\to$ `In Progress` $\to$ `Fixed` $\to$ `Retest` $\to$ `Closed`.
Every defect captures: Defect ID, Module, Description, Severity, Priority, Steps to Reproduce, Expected Result, Actual Result, Assigned Engineer.

### Section 18: Test Metrics Formulas
- $\text{Pass Percentage} = \left(\frac{\text{Passed Test Cases}}{\text{Executed Test Cases}}\right) \times 100$
- $\text{Fail Percentage} = \left(\frac{\text{Failed Test Cases}}{\text{Executed Test Cases}}\right) \times 100$
- $\text{Defect Density} = \frac{\text{Total Defects Found}}{\text{Total Executed Test Cases}}$
- $\text{Inspection Pass Rate} = \left(\frac{\text{Passed Inspections}}{\text{Total Inspections Completed}}\right) \times 100$
