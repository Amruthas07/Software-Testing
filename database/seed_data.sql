-- MotoPass - Seed Data Script
-- Populates initial citizens, vehicles, inspections, wallets, test cases, and defects

USE motopass_db;

-- 1. Users
INSERT INTO users (id, full_name, email, mobile, password_hash, age, address, state, city, role)
VALUES
('usr-admin-01', 'Officer Vikram Sharma', 'admin@motopass.gov', '9876543210', 'hashed_pass_admin', 42, 'RTO Sector 18', 'Delhi', 'New Delhi', 'admin'),
('usr-inspect-01', 'Inspector Priya Patel', 'inspector@motopass.gov', '9811223344', 'hashed_pass_insp', 38, 'Bay 3, Central RTO', 'Maharashtra', 'Mumbai', 'inspector'),
('usr-demo-01', 'Rahul Verma', 'rahul.verma@example.com', '9123456780', 'hashed_pass_user', 24, 'Flat 402, Green Valley', 'Karnataka', 'Bengaluru', 'user');

-- 2. Wallets
INSERT INTO wallets (id, user_id, balance, currency)
VALUES
('wal-001', 'usr-demo-01', 1500.00, '₹');

-- 3. Vehicles
INSERT INTO vehicles (id, user_id, vehicle_number, vehicle_type, brand, model, manufacturing_year, fuel_type, owner_name)
VALUES
('veh-001', 'usr-demo-01', 'KA-01-MJ-2024', 'Car', 'Tata', 'Nexon EV', 2024, 'Electric', 'Rahul Verma'),
('veh-002', 'usr-demo-01', 'KA-05-EX-7788', 'Bike', 'Royal Enfield', 'Hunter 350', 2023, 'Petrol', 'Rahul Verma');

-- 4. License Applications
INSERT INTO license_applications (id, user_id, applicant_name, age, vehicle_id, license_type, application_date, address, state, city, status, fee_amount, payment_status)
VALUES
('app-001', 'usr-demo-01', 'Rahul Verma', 24, 'veh-001', 'Four-Wheeler LMV', '2026-02-10', 'Flat 402, Green Valley', 'Karnataka', 'Bengaluru', 'Approved', 500.00, 'PAID'),
('app-002', 'usr-demo-01', 'Rahul Verma', 24, 'veh-002', 'Two-Wheeler Permanent', '2026-03-01', 'Flat 402, Green Valley', 'Karnataka', 'Bengaluru', 'Under Inspection', 350.00, 'UNPAID');

-- 5. Inspections
INSERT INTO inspections (id, application_id, vehicle_id, inspector_id, inspector_name, inspection_date, total_points, total_components, average_score, status)
VALUES
('insp-001', 'app-001', 'veh-001', 'usr-inspect-01', 'Inspector Priya Patel', '2026-02-12', 88.00, 5, 17.60, 'COMPLETED');

-- 6. Inspection Components
INSERT INTO inspection_components (inspection_id, component_name, score, max_score, remarks)
VALUES
('insp-001', 'Brakes', 18.00, 20.00, 'Hydraulic ABS nominal'),
('insp-001', 'Lights', 19.00, 20.00, 'All lamps functional'),
('insp-001', 'Tyres', 17.00, 20.00, 'Tread depth within limit'),
('insp-001', 'Engine', 18.00, 20.00, 'EV powertrain OK'),
('insp-001', 'Safety Equipment', 16.00, 20.00, 'Emergency gear present');

-- 7. Results (Score 88 >= 70 -> PASSED)
INSERT INTO results (id, application_id, inspection_id, applicant_name, vehicle_number, total_score, average_score, status, application_status, inspection_date, inspector, remarks)
VALUES
('res-001', 'app-001', 'insp-001', 'Rahul Verma', 'KA-01-MJ-2024', 88.00, 17.60, 'PASSED', 'Approved', '2026-02-12', 'Inspector Priya Patel', 'Passed all statutory checks. Recommended for licensing.');

-- 8. Transactions
INSERT INTO transactions (id, user_id, applicationId, amount, type, status, description, balance_after)
VALUES
('tx-001', 'usr-demo-01', NULL, 2000.00, 'CREDIT_TOPUP', 'SUCCESS', 'Initial Wallet Balance Allocation', 2000.00),
('tx-002', 'usr-demo-01', 'app-001', 500.00, 'DEBIT_LICENSE_FEE', 'SUCCESS', 'License Fee for #app-001', 1500.00);
