-- Initial migration for authentication system
-- This creates the users table for the private section

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    role TEXT DEFAULT 'member'
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- Insert a default admin user (password: 'admin123' hashed with bcrypt)
-- Note: In production, this should be changed immediately
INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@projectiron.pl', '$2b$10$8K1p/a/NIdlUJt4FHstN..8GU7DxKGG7O8bJlMp7Hj1XnO1QvbQGS', 'admin');

-- Insert a test member user (password: 'member123')
INSERT INTO users (username, email, password_hash, role) 
VALUES ('member', 'member@projectiron.pl', '$2b$10$K7f8Gs1Nzv/XhYfgFP3Z.uS2lB/6YhbGJSPKGFW6pC7/QXIN4Q5EC', 'member');