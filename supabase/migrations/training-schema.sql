-- Training Ground Database Schema
-- This stores real employer job postings for continuous learning

-- Training job postings (real employer data)
CREATE TABLE IF NOT EXISTS training_job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR NOT NULL,
  job_title VARCHAR NOT NULL,
  location_city VARCHAR,
  location_state VARCHAR(2),
  full_description TEXT NOT NULL,
  job_url TEXT,
  source VARCHAR, -- 'linkedin', 'indeed', 'greenhouse', 'lever', 'company_site'
  posted_date TIMESTAMP,
  salary_min NUMERIC,
  salary_max NUMERIC,

  -- Extracted intelligence
  extracted_phrases TEXT[], -- Unique phrases found
  hris_systems TEXT[], -- Workday, NetSuite, etc.
  tech_stack TEXT[], -- Technologies mentioned
  certifications TEXT[], -- Required certifications
  unique_terms TEXT[], -- Rare/unique terminology

  -- Metadata
  processed BOOLEAN DEFAULT FALSE,
  training_iteration INT, -- Which training batch
  created_at TIMESTAMP DEFAULT NOW(),

  -- Indexes
  INDEX idx_company (company_name),
  INDEX idx_location (location_city, location_state),
  INDEX idx_processed (processed)
);

-- Company intelligence (learned from training data)
CREATE TABLE IF NOT EXISTS company_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR NOT NULL UNIQUE,
  headquarters_city VARCHAR,
  headquarters_state VARCHAR(2),
  all_locations JSONB, -- [{city, state, count}]
  primary_industries TEXT[],

  -- Systems & Tech
  hris_systems TEXT[], -- Confirmed HRIS/ATS systems
  common_tech_stack TEXT[], -- Frequently mentioned technologies

  -- Language patterns
  signature_phrases TEXT[], -- Unique phrases this company uses
  common_job_titles TEXT[], -- Job titles they post

  -- Metrics
  total_jobs_analyzed INT DEFAULT 0,
  avg_salary_range JSONB, -- {min, max, by_role: {...}}
  hiring_velocity INT, -- Jobs posted per month

  -- Confidence & Learning
  confidence_score FLOAT DEFAULT 0.5, -- Improves with more data
  last_job_scraped TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Phrase intelligence (learned uniqueness)
CREATE TABLE IF NOT EXISTS phrase_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phrase TEXT NOT NULL UNIQUE,
  phrase_length INT, -- Number of words

  -- Rarity metrics
  total_occurrences INT DEFAULT 1,
  appears_in_companies TEXT[], -- Which companies use this
  uniqueness_score FLOAT, -- 0-10 (higher = more unique)

  -- Context
  common_in_industries TEXT[],
  common_in_locations TEXT[], -- Format: "City, ST"
  common_in_roles TEXT[], -- Job titles where this appears

  -- Weighting
  signal_strength FLOAT, -- How useful for matching (0-1)

  -- Learning
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  INDEX idx_uniqueness (uniqueness_score DESC)
);

-- Location intelligence (learned from data)
CREATE TABLE IF NOT EXISTS location_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city VARCHAR NOT NULL,
  state VARCHAR(2) NOT NULL,

  -- Demographics
  population INT,
  metro_area VARCHAR,

  -- Economic data
  primary_industries TEXT[],
  major_employers TEXT[], -- Top employers in this location
  company_count_by_industry JSONB, -- {Manufacturing: 15, Tech: 3, ...}

  -- Hub scoring
  tech_hub_score FLOAT DEFAULT 0, -- 0-10
  finance_hub_score FLOAT DEFAULT 0,
  manufacturing_hub_score FLOAT DEFAULT 0,
  healthcare_hub_score FLOAT DEFAULT 0,
  genericity_score FLOAT, -- How generic is location+industry? (higher = more generic)

  -- Learning metadata
  total_jobs_analyzed INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),

  UNIQUE(city, state)
);

-- Training progress tracking
CREATE TABLE IF NOT EXISTS training_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  iteration INT NOT NULL UNIQUE,

  -- Progress
  total_jobs_target INT,
  jobs_scraped INT DEFAULT 0,
  jobs_processed INT DEFAULT 0,
  jobs_failed INT DEFAULT 0,

  -- Statistics
  companies_discovered INT DEFAULT 0,
  unique_phrases_extracted INT DEFAULT 0,
  locations_analyzed INT DEFAULT 0,

  -- Status
  status VARCHAR DEFAULT 'running', -- 'running', 'completed', 'failed', 'paused'
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,

  -- Errors
  error_log TEXT
);

-- Learned patterns (convergence patterns that work)
CREATE TABLE IF NOT EXISTS learned_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_type VARCHAR, -- 'phrase_combo', 'location_tech', 'system_industry'

  -- Pattern definition
  signals JSONB, -- {phrase1: "...", location: "...", system: "Workday"}
  identified_company VARCHAR,

  -- Success metrics
  times_matched INT DEFAULT 1,
  success_rate FLOAT, -- How often this pattern correctly identifies company
  avg_confidence FLOAT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Training matches (simulated reverse engineering during training)
CREATE TABLE IF NOT EXISTS training_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Source job (real employer posting)
  source_job_id UUID REFERENCES training_job_postings(id),
  actual_company VARCHAR NOT NULL,

  -- Agent's prediction
  predicted_company VARCHAR,
  confidence FLOAT,
  match_signals TEXT[], -- Which signals led to the match

  -- Result
  was_correct BOOLEAN,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_training_jobs_company ON training_job_postings(company_name);
CREATE INDEX IF NOT EXISTS idx_training_jobs_location ON training_job_postings(location_city, location_state);
CREATE INDEX IF NOT EXISTS idx_phrase_uniqueness ON phrase_intelligence(uniqueness_score DESC);
CREATE INDEX IF NOT EXISTS idx_company_confidence ON company_intelligence(confidence_score DESC);
