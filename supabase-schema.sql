-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  location TEXT NOT NULL,
  employee_count INTEGER,
  vertical TEXT NOT NULL CHECK (vertical IN ('Manufacturing', 'IT', 'Finance')),
  job_link TEXT NOT NULL UNIQUE,
  last_verified TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_jobs_vertical ON jobs(vertical);
CREATE INDEX IF NOT EXISTS idx_jobs_last_verified ON jobs(last_verified DESC);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON jobs
  FOR SELECT USING (true);

-- Create policy to allow service role to insert/update
CREATE POLICY "Allow service role to insert" ON jobs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role to update" ON jobs
  FOR UPDATE USING (true);

-- Function to refresh job data (called by cron)
CREATE OR REPLACE FUNCTION refresh_jobs()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Mark jobs older than 24 hours as stale by updating last_verified
  -- In production, the Edge Function will handle actual job scraping
  RAISE NOTICE 'Job refresh triggered at %', NOW();
END;
$$;

-- Initial seed data with the current verified jobs
INSERT INTO jobs (company_name, job_title, location, employee_count, vertical, job_link) VALUES
  ('RTX (Pratt & Whitney)', 'Supplier Manufacturing Engineer', 'East Hartford, CT', 1000, 'Manufacturing', 'https://careers.rtx.com/global/en/job/01796139'),
  ('RTX (Pratt & Whitney)', 'Principal Additive Mfg Engineer', 'East Hartford, CT', 1000, 'Manufacturing', 'https://careers.rtx.com/global/en/job/01781156/Principal-Additive-Manufacturing-Process-Engineer'),
  ('Shutterstock', 'Data Engineer, Analytics', 'New York, NY', 1715, 'IT', 'https://careers.shutterstock.com/us/en/job/R0003035/Data-Engineer-Analytics'),
  ('Gemini', 'Staff Data Engineer', 'New York, NY', 586, 'IT', 'https://job-boards.greenhouse.io/gemini/jobs/7254038'),
  ('Zocdoc', 'Staff SWE, Data Infrastructure', 'New York, NY', 564, 'IT', 'https://job-boards.greenhouse.io/zocdoc/jobs/6821794'),
  ('Datadog', 'Senior FP&A Analyst', 'New York, NY', 7200, 'Finance', 'https://boards.greenhouse.io/datadog/jobs/7027764'),
  ('Squarespace', 'Senior Financial Analyst, Investments', 'New York, NY', 1739, 'Finance', 'https://www.squarespace.com/careers/jobs/7195483?location=new-york')
ON CONFLICT (job_link) DO UPDATE SET
  last_verified = NOW();
