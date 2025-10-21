-- Set up hourly cron job to refresh jobs
-- This will call the refresh_jobs() function every hour

SELECT cron.schedule(
  'refresh-jobs-hourly',  -- Job name
  '0 * * * *',           -- Every hour at minute 0 (cron expression)
  $$
  SELECT refresh_jobs();
  $$
);

-- View all scheduled cron jobs
SELECT * FROM cron.job;
