
-- Complete Core Banking System Database Schema
-- This file contains all tables, indexes, and initial data

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS core_banking_db;

-- Use the database
USE core_banking_db;

-- ============================================================================
-- USERS TABLE - Core user authentication
-- ============================================================================
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CUSTOMER') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for users table
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- CUSTOMERS TABLE - Customer profile and KYC information
-- ============================================================================
CREATE TABLE customers (
    customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    kyc_status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED') DEFAULT 'PENDING',
    kyc_documents JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create indexes for customers table
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_phone_number ON customers(phone_number);
CREATE INDEX idx_customers_kyc_status ON customers(kyc_status);
CREATE INDEX idx_customers_created_at ON customers(created_at);

-- ============================================================================
-- ACCOUNTS TABLE - Bank account information
-- ============================================================================
CREATE TABLE accounts (
    account_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type ENUM('SAVINGS', 'CHECKING', 'BUSINESS', 'FIXED_DEPOSIT') NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status ENUM('ACTIVE', 'INACTIVE', 'FROZEN', 'CLOSED') NOT NULL DEFAULT 'ACTIVE',
    opened_date DATETIME NOT NULL,
    closed_date DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- ============================================================================
-- TRANSACTIONS TABLE - All banking transactions
-- ============================================================================
CREATE TABLE transactions (
    transaction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id BIGINT NOT NULL,
    transaction_type ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT', 'INTEREST_CREDIT', 'FEE_DEBIT') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description VARCHAR(255),
    transaction_date DATETIME NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    reference_number VARCHAR(50),
    to_account_number VARCHAR(20),
    from_account_number VARCHAR(20),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    INDEX idx_account_date (account_id, transaction_date),
    INDEX idx_reference_number (reference_number)
);

-- ============================================================================
-- AUDIT LOGS TABLE - System audit trail
-- ============================================================================
CREATE TABLE audit_logs (
    audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255),
    old_values TEXT,
    new_values TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    severity ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL') DEFAULT 'INFO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for audit logs table
CREATE INDEX idx_audit_username ON audit_logs(username);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_severity ON audit_logs(severity);

-- ============================================================================
-- INTEREST RATES TABLE - Interest rates configuration
-- ============================================================================
CREATE TABLE interest_rates (
    rate_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_type ENUM('SAVINGS', 'CHECKING', 'BUSINESS', 'FIXED_DEPOSIT') NOT NULL,
    annual_rate DECIMAL(5,2) NOT NULL,
    min_balance DECIMAL(15,2),
    max_balance DECIMAL(15,2),
    effective_from DATETIME NOT NULL,
    effective_to DATETIME,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50)
);

-- ============================================================================
-- FIXED DEPOSITS TABLE - Fixed deposit account details
-- ============================================================================
CREATE TABLE fixed_deposits (
    fd_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id BIGINT NOT NULL,
    fd_number VARCHAR(20) UNIQUE NOT NULL,
    principal_amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    tenure_months INT NOT NULL,
    start_date DATETIME NOT NULL,
    maturity_date DATETIME NOT NULL,
    maturity_amount DECIMAL(15,2),
    status ENUM('ACTIVE', 'MATURED', 'CLOSED_PREMATURELY', 'RENEWED') NOT NULL DEFAULT 'ACTIVE',
    is_auto_renewal BOOLEAN NOT NULL DEFAULT FALSE,
    premature_closure_date DATETIME,
    premature_penalty_rate DECIMAL(5,2),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

-- ============================================================================
-- INTEREST POSTINGS TABLE - Interest calculation and posting records
-- ============================================================================
CREATE TABLE interest_postings (
    posting_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id BIGINT NOT NULL,
    posting_date DATETIME NOT NULL,
    interest_amount DECIMAL(15,2) NOT NULL,
    calculation_period_from DATETIME NOT NULL,
    calculation_period_to DATETIME NOT NULL,
    average_balance DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    transaction_reference VARCHAR(50),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

-- ============================================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================================================

-- Interest rates indexes
CREATE INDEX idx_interest_rates_account_type ON interest_rates(account_type);
CREATE INDEX idx_interest_rates_effective_dates ON interest_rates(effective_from, effective_to);

-- Fixed deposits indexes
CREATE INDEX idx_fixed_deposits_account ON fixed_deposits(account_id);
CREATE INDEX idx_fixed_deposits_status ON fixed_deposits(status);
CREATE INDEX idx_fixed_deposits_maturity ON fixed_deposits(maturity_date);

-- Interest postings indexes
CREATE INDEX idx_interest_postings_account ON interest_postings(account_id);
CREATE INDEX idx_interest_postings_date ON interest_postings(posting_date);

-- ============================================================================
-- INSERT INITIAL DATA
-- ============================================================================

-- Insert default admin user
INSERT INTO users (username, email, password_hash, role, is_active) 
VALUES (
    'admin', 
    'admin@corebanking.com', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P/YhCxnFRrVJdO', -- password: admin123
    'ADMIN', 
    TRUE
);

-- Insert sample customer user
INSERT INTO users (username, email, password_hash, role, is_active) 
VALUES (
    'customer1', 
    'customer1@email.com', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P/YhCxnFRrVJdO', -- password: customer123
    'CUSTOMER', 
    TRUE
);

-- Insert default interest rates
INSERT INTO interest_rates (account_type, annual_rate, min_balance, effective_from, is_active) VALUES
('SAVINGS', 2.50, 100.00, NOW(), TRUE),
('CHECKING', 1.00, 0.00, NOW(), TRUE),
('BUSINESS', 1.75, 1000.00, NOW(), TRUE),
('FIXED_DEPOSIT', 5.00, 1000.00, NOW(), TRUE);

-- ============================================================================
-- SUMMARY OF TABLES AND THEIR PURPOSE
-- ============================================================================

/*
TABLE SUMMARY:

1. USERS - Core authentication and user management
   - Stores login credentials, roles, and security information
   - Supports admin and customer roles
   - Includes account lockout mechanism

2. CUSTOMERS - Customer profile and KYC information
   - Personal details, address, contact information
   - KYC status tracking and document storage
   - Links to users table via user_id

3. ACCOUNTS - Bank accounts for customers
   - Supports multiple account types (Savings, Checking, Business, Fixed Deposit)
   - Tracks balance, status, and account lifecycle
   - Links to customers table via customer_id

4. TRANSACTIONS - All banking transactions
   - Records all debits, credits, transfers
   - Maintains balance after each transaction
   - Supports various transaction types and references

5. AUDIT_LOGS - System audit trail
   - Tracks all user actions and system changes
   - Stores old and new values for change tracking
   - Includes severity levels and metadata

6. INTEREST_RATES - Interest rate configuration
   - Configurable rates for different account types
   - Supports balance-based rate tiers
   - Time-bound rate effectiveness

7. FIXED_DEPOSITS - Fixed deposit management
   - Tracks FD details, tenure, and maturity
   - Supports auto-renewal and premature closure
   - Links to accounts table via account_id

8. INTEREST_POSTINGS - Interest calculation records
   - Records interest calculations and postings
   - Tracks calculation periods and applied rates
   - Links to transactions for interest credits

RELATIONSHIPS:
- Users (1) -> Customers (1)
- Customers (1) -> Accounts (Many)
- Accounts (1) -> Transactions (Many)
- Accounts (1) -> Fixed Deposits (Many)
- Accounts (1) -> Interest Postings (Many)
*/

