-- Drop database if it exists (BE CAREFUL with this in production!)
DROP DATABASE IF EXISTS farmchain;
DROP USER IF EXISTS farmchain_user;

-- Create database user
CREATE USER farmchain_user WITH PASSWORD 'farmchain_2024';

-- Create database
CREATE DATABASE farmchain;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE farmchain TO farmchain_user;

-- Connect to the database
\c farmchain

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schema
CREATE SCHEMA IF NOT EXISTS public;

-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'distributor', 'retailer', 'admin')),
    phone VARCHAR(20),
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Batches Table
CREATE TABLE batches (
    batch_id VARCHAR(50) PRIMARY KEY,
    farmer_id INTEGER REFERENCES users(user_id),
    crop_type VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    harvest_date DATE NOT NULL,
    quality_grade VARCHAR(5) NOT NULL,
    blockchain_hash VARCHAR(255),
    qr_code_url TEXT,
    status VARCHAR(20) DEFAULT 'created',
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    batch_id VARCHAR(50) REFERENCES batches(batch_id),
    from_user_id INTEGER REFERENCES users(user_id),
    to_user_id INTEGER REFERENCES users(user_id),
    transaction_type VARCHAR(50) NOT NULL,
    location TEXT,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    blockchain_tx_hash VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quality Reports Table
CREATE TABLE quality_reports (
    report_id SERIAL PRIMARY KEY,
    batch_id VARCHAR(50) REFERENCES batches(batch_id),
    inspector_id INTEGER REFERENCES users(user_id),
    inspection_date DATE NOT NULL,
    pesticide_used BOOLEAN,
    organic_certified BOOLEAN,
    grade VARCHAR(5) NOT NULL,
    remarks TEXT,
    report_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grant permissions to farmchain_user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO farmchain_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO farmchain_user;

-- Create indexes
CREATE INDEX idx_batches_farmer_id ON batches(farmer_id);
CREATE INDEX idx_transactions_batch_id ON transactions(batch_id);
CREATE INDEX idx_quality_reports_batch_id ON quality_reports(batch_id);