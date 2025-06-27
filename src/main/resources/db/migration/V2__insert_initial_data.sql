
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
