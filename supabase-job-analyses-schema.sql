-- Supabase schema for job_analyses table
-- This table stores all reverse engineering analysis results

CREATE TABLE IF NOT EXISTS job_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_description TEXT NOT NULL,
  job_url TEXT,
  identified_client TEXT,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  match_percentage INTEGER CHECK (match_percentage >= 0 AND match_percentage <= 100),
  reasoning JSONB,
  matched_job_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_job_analyses_created_at ON job_analyses(created_at DESC);

-- Create index on identified_client for filtering
CREATE INDEX IF NOT EXISTS idx_job_analyses_client ON job_analyses(identified_client);

-- Create index on confidence for filtering high-confidence matches
CREATE INDEX IF NOT EXISTS idx_job_analyses_confidence ON job_analyses(confidence DESC);

-- Add a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_analyses_updated_at
  BEFORE UPDATE ON job_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE job_analyses IS 'Stores job reverse engineering analysis results';
COMMENT ON COLUMN job_analyses.job_description IS 'Original job description pasted by user';
COMMENT ON COLUMN job_analyses.job_url IS 'URL of competitor job posting (optional)';
COMMENT ON COLUMN job_analyses.identified_client IS 'Name of identified end client/employer';
COMMENT ON COLUMN job_analyses.confidence IS 'Overall confidence score (0-100)';
COMMENT ON COLUMN job_analyses.match_percentage IS 'Match percentage (0-100)';
COMMENT ON COLUMN job_analyses.reasoning IS 'JSON array of match reasoning details';
COMMENT ON COLUMN job_analyses.matched_job_url IS 'URL of matched employer job posting';
