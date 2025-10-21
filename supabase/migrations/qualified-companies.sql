-- Qualified Companies Database
-- Stores pre-verified companies with 500-1000 employees

CREATE TABLE IF NOT EXISTS qualified_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Company info
  company_name VARCHAR NOT NULL UNIQUE,
  location_city VARCHAR NOT NULL,
  location_state VARCHAR(2) NOT NULL,

  -- Employee count (STRICT: 500-1000)
  employee_count INT NOT NULL CHECK (employee_count >= 500 AND employee_count <= 1000),
  employee_count_source VARCHAR, -- "LinkedIn verified 2025-10"
  verified_date TIMESTAMP,

  -- Industry
  industry VARCHAR NOT NULL CHECK (industry IN ('Software', 'Finance', 'Manufacturing', 'Marketing')),
  description TEXT,

  -- Hiring status
  actively_hiring BOOLEAN DEFAULT TRUE,
  career_page_url TEXT,
  linkedin_url TEXT,

  -- Verification
  verification_notes TEXT,
  last_scraped TIMESTAMP,
  total_jobs_scraped INT DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Indexes
  INDEX idx_industry (industry),
  INDEX idx_location (location_city, location_state),
  INDEX idx_employee_count (employee_count),
  INDEX idx_actively_hiring (actively_hiring)
);

-- Comments
COMMENT ON TABLE qualified_companies IS 'Pre-verified companies with 500-1000 employees for training';
COMMENT ON COLUMN qualified_companies.employee_count IS 'MUST be between 500-1000';
COMMENT ON COLUMN qualified_companies.employee_count_source IS 'Where we verified the count (LinkedIn, company site, etc.)';
