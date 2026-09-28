# MotoPass - Database Schema (MySQL 8.0+)
# Complete DDL with Primary Keys, Foreign Keys, Constraints, and Indexes

CREATE DATABASE IF NOT EXISTS motopass_db;
USE motopass_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    address TEXT NOT NULL,
    state VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    role ENUM('user', 'admin', 'inspector') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_age CHECK (age >= 18 AND age <= 60)
);

-- 2. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    vehicle_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type ENUM('Car', 'Bike', 'Scooter', 'Other') NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    manufacturing_year INT NOT NULL,
    fuel_type ENUM('Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid') NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_veh_year CHECK (manufacturing_year >= 1980)
);

-- 3. LICENSE APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS license_applications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    applicant_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    vehicle_id VARCHAR(36) NOT NULL,
    license_type ENUM('Two-Wheeler Learner', 'Two-Wheeler Permanent', 'Four-Wheeler LMV', 'Commercial Transport') NOT NULL,
    application_date DATE NOT NULL,
    address TEXT NOT NULL,
    state VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    status ENUM('Draft', 'Submitted', 'Under Inspection', 'Approved', 'Rejected') DEFAULT 'Draft',
    fee_amount DECIMAL(10,2) NOT NULL DEFAULT 500.00,
    payment_status ENUM('UNPAID', 'PAID') DEFAULT 'UNPAID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
    CONSTRAINT chk_app_age CHECK (age >= 18 AND age <= 60)
);

-- 4. INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS inspections (
    id VARCHAR(36) PRIMARY KEY,
    application_id VARCHAR(36) NOT NULL UNIQUE,
    vehicle_id VARCHAR(36) NOT NULL,
    inspector_id VARCHAR(36) NOT NULL,
    inspector_name VARCHAR(100) NOT NULL,
    inspection_date DATE NOT NULL,
    total_points DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    total_components INT NOT NULL DEFAULT 0,
    average_score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    status ENUM('PENDING', 'COMPLETED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES license_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (inspector_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_total_points CHECK (total_points >= 0 AND total_points <= 100)
);

-- 5. INSPECTION COMPONENTS TABLE
CREATE TABLE IF NOT EXISTS inspection_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inspection_id VARCHAR(36) NOT NULL,
    component_name VARCHAR(50) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL DEFAULT 20.00,
    remarks VARCHAR(255),
    FOREIGN KEY (inspection_id) REFERENCES inspections(id) ON DELETE CASCADE,
    CONSTRAINT chk_component_score CHECK (score >= 0 AND score <= max_score)
);

-- 6. WALLETS TABLE
CREATE TABLE IF NOT EXISTS wallets (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    balance DECIMAL(12,2) NOT NULL DEFAULT 2000.00,
    currency VARCHAR(10) DEFAULT '₹',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_non_negative_balance CHECK (balance >= 0)
);

-- 7. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    application_id VARCHAR(36),
    amount DECIMAL(10,2) NOT NULL,
    type ENUM('CREDIT_TOPUP', 'DEBIT_LICENSE_FEE') NOT NULL,
    status ENUM('SUCCESS', 'INSUFFICIENT_FUNDS', 'INVALID_AMOUNT', 'FAILED') NOT NULL,
    description VARCHAR(255) NOT NULL,
    balance_after DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES license_applications(id) ON DELETE SET NULL
);

-- 8. RESULTS TABLE
CREATE TABLE IF NOT EXISTS results (
    id VARCHAR(36) PRIMARY KEY,
    application_id VARCHAR(36) NOT NULL UNIQUE,
    inspection_id VARCHAR(36) NOT NULL UNIQUE,
    applicant_name VARCHAR(100) NOT NULL,
    vehicle_number VARCHAR(20) NOT NULL,
    total_score DECIMAL(5,2) NOT NULL,
    average_score DECIMAL(5,2) NOT NULL,
    status ENUM('PASSED', 'FAILED') NOT NULL,
    application_status ENUM('Approved', 'Rejected') NOT NULL,
    inspection_date DATE NOT NULL,
    inspector VARCHAR(100) NOT NULL,
    remarks TEXT,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES license_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (inspection_id) REFERENCES inspections(id) ON DELETE CASCADE
);

-- 9. TEST CASES TABLE (Software Testing Lab)
CREATE TABLE IF NOT EXISTS test_cases (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    module VARCHAR(50) NOT NULL,
    scenario VARCHAR(255) NOT NULL,
    preconditions TEXT,
    steps TEXT NOT NULL,
    test_data VARCHAR(255) NOT NULL,
    expected_result TEXT NOT NULL,
    actual_result TEXT,
    status ENUM('Passed', 'Failed', 'Blocked', 'Pending') DEFAULT 'Pending',
    severity ENUM('Critical', 'Major', 'Medium', 'Minor') NOT NULL,
    technique VARCHAR(50) NOT NULL,
    execution_date DATE
);

-- 10. DEFECTS TABLE (Defect Tracking System)
CREATE TABLE IF NOT EXISTS defects (
    id VARCHAR(36) PRIMARY KEY,
    defect_id VARCHAR(30) NOT NULL UNIQUE,
    module VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('Critical', 'Major', 'Medium', 'Minor') NOT NULL,
    priority ENUM('P1', 'P2', 'P3', 'P4') NOT NULL,
    steps_to_reproduce TEXT NOT NULL,
    expected_result TEXT NOT NULL,
    actual_result TEXT NOT NULL,
    status ENUM('Open', 'In Progress', 'Fixed', 'Retest', 'Closed') DEFAULT 'Open',
    assigned_to VARCHAR(100) NOT NULL,
    created_date DATE NOT NULL,
    resolved_date DATE
);

-- 11. TEST METRICS SUMMARY TABLE
CREATE TABLE IF NOT EXISTS test_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_test_cases INT NOT NULL DEFAULT 0,
    executed_test_cases INT NOT NULL DEFAULT 0,
    passed_test_cases INT NOT NULL DEFAULT 0,
    failed_test_cases INT NOT NULL DEFAULT 0,
    blocked_test_cases INT NOT NULL DEFAULT 0,
    defects_found INT NOT NULL DEFAULT 0,
    defects_fixed INT NOT NULL DEFAULT 0,
    pass_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    fail_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
