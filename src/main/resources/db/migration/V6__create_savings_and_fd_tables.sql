
-- Create interest_rates table
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

-- Create fixed_deposits table
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

-- Create interest_postings table
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

-- Create indexes for better performance
CREATE INDEX idx_interest_rates_account_type ON interest_rates(account_type);
CREATE INDEX idx_interest_rates_effective_dates ON interest_rates(effective_from, effective_to);
CREATE INDEX idx_fixed_deposits_account ON fixed_deposits(account_id);
CREATE INDEX idx_fixed_deposits_status ON fixed_deposits(status);
CREATE INDEX idx_fixed_deposits_maturity ON fixed_deposits(maturity_date);
CREATE INDEX idx_interest_postings_account ON interest_postings(account_id);
CREATE INDEX idx_interest_postings_date ON interest_postings(posting_date);

-- Insert default interest rates
INSERT INTO interest_rates (account_type, annual_rate, min_balance, effective_from, is_active) VALUES
('SAVINGS', 2.50, 100.00, NOW(), TRUE),
('CHECKING', 1.00, 0.00, NOW(), TRUE),
('BUSINESS', 1.75, 1000.00, NOW(), TRUE),
('FIXED_DEPOSIT', 5.00, 1000.00, NOW(), TRUE);
