-- ClearChoice Insight Database Schema
-- PostgreSQL schema for product transparency platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table - stores basic product information
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN (
        'food-beverage', 
        'fashion-apparel', 
        'home-living', 
        'health-wellness', 
        'electronics', 
        'other'
    )),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product submissions table - stores form submission data
CREATE TABLE IF NOT EXISTS product_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    submission_data JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending', 
        'processing', 
        'completed', 
        'failed'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI questions table - stores dynamically generated questions
CREATE TABLE IF NOT EXISTS ai_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES product_submissions(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(100) NOT NULL,
    step_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User responses table - stores answers to AI questions
CREATE TABLE IF NOT EXISTS user_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES ai_questions(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES product_submissions(id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transparency reports table - stores generated reports
CREATE TABLE IF NOT EXISTS transparency_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES product_submissions(id) ON DELETE CASCADE,
    report_data JSONB NOT NULL,
    pdf_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'generating' CHECK (status IN (
        'generating', 
        'completed', 
        'failed'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_name);
CREATE INDEX IF NOT EXISTS idx_submissions_product ON product_submissions(product_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON product_submissions(status);
CREATE INDEX IF NOT EXISTS idx_questions_product ON ai_questions(product_id);
CREATE INDEX IF NOT EXISTS idx_questions_submission ON ai_questions(submission_id);
CREATE INDEX IF NOT EXISTS idx_responses_question ON user_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_reports_submission ON transparency_reports(submission_id);

-- Update trigger for products table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON product_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

