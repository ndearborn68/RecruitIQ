# 🚀 FINAL DEPLOYMENT GUIDE

## ✅ System Overview

**Auto-Training System with 1-Week Auto-Stop**

### What It Does:
1. ✅ Identifies 100 companies with **500-1000 employees** (one-time)
2. ✅ Scrapes 50 jobs every 2 hours from these companies
3. ✅ **Stops automatically after 1 week** for your review
4. ✅ Learns from real employer job postings

### Auto-Stop Logic:
- **After 1 week (7 days):** Training pauses automatically
- **Status changes to:** "paused_for_review"
- **You review results**, then manually resume if desired
- **Or hits 1,000 jobs**, whichever comes first

---

## 📊 Expected Results After 1 Week

**Jobs Scraped:**
- 50 jobs every 2 hours × 12 batches/day × 7 days = **~4,200 jobs maximum**
- **But stops at 1,000 jobs** (takes ~40 hours = 1.67 days)

**So realistically:**
- Training will **complete in ~2 days** (1,000 jobs)
- Then **stop and wait** for you to review
- 1-week timer is a safety net

---

## 🚀 Deployment Steps

### Step 1: Deploy Database Schema

```bash
npx supabase db push
```

This creates:
- `qualified_companies` - Pre-verified companies (500-1000 employees)
- `training_job_postings` - Scraped jobs
- `company_intelligence` - Learned patterns
- `phrase_intelligence` - Unique phrases
- `location_intelligence` - Hub scores
- `training_progress` - Progress tracking

### Step 2: Set Anthropic API Key

```bash
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-api-YOUR-KEY-HERE
```

Get key from: https://console.anthropic.com/settings/keys

### Step 3: Deploy Edge Functions

```bash
# Deploy all 3 functions
npx supabase functions deploy company-identifier
npx supabase functions deploy background-trainer
npx supabase functions deploy training-scheduler
```

### Step 4: Identify Qualified Companies (ONE-TIME)

**Option A: Via Training Ground UI**
1. Go to http://localhost:5173
2. Click "Training Ground" tab
3. Click "Identify Companies (One-Time)"
4. Wait ~5 minutes
5. See 100 companies appear

**Option B: Via Command Line**
```bash
curl -X POST \
  'https://tgoqohbqrcemscrbkbwm.supabase.co/functions/v1/company-identifier' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"action": "identify_companies"}'
```

**Verify companies were identified:**
```sql
SELECT COUNT(*) FROM qualified_companies;
-- Should return 100

SELECT industry, COUNT(*)
FROM qualified_companies
GROUP BY industry;
-- Software: 30, Finance: 30, Manufacturing: 25, Marketing: 15
```

### Step 5: Set Up Auto-Scraper (Every 2 Hours)

Go to: https://supabase.com/dashboard/project/tgoqohbqrcemscrbkbwm/database/cron-jobs

**Create Cron Job:**
- **Name:** Auto Training (Stops After 1 Week)
- **Schedule:** `*/2 * * * *` (every 2 hours)
- **SQL Command:**

```sql
SELECT
  net.http_post(
    url := 'https://tgoqohbqrcemscrbkbwm.supabase.co/functions/v1/training-scheduler',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb
  ) as request_id;
```

### Step 6: Start First Batch (Optional - Or Wait for Cron)

**Via UI:**
- Go to Training Ground tab
- Click "Start Training Batch"

**Via Command:**
```bash
curl -X POST \
  'https://tgoqohbqrcemscrbkbwm.supabase.co/functions/v1/training-scheduler' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

---

## ⏰ Timeline

```
Day 0, Hour 0:  Deploy system, identify 100 companies
Day 0, Hour 1:  Start first batch (50 jobs)
Day 0, Hour 3:  Batch 2 (100 jobs total)
Day 0, Hour 5:  Batch 3 (150 jobs total)
...
Day 1, Hour 16: Batch 20 (1,000 jobs) → AUTO-STOPS
Day 1-7:        Waits for your review
Day 7:          Safety stop (if somehow still running)
```

**Most likely:** Stops after **~40 hours** (1,000 jobs reached)

---

## 🎯 What Gets Learned

**After 1,000 Jobs:**
- ✅ 100 companies (all 500-1000 employees)
- ✅ 5,000+ unique phrases extracted
- ✅ Company signatures identified
- ✅ Location hub scores calculated
- ✅ HRIS/ATS systems mapped
- ✅ Industry-specific terminology learned

**Example Intelligence:**
```
Bazaarvoice (Austin, TX - 715 employees):
  Signature phrases: ["product reviews platform", "UGC content", "brand advocacy"]
  HRIS: Workday
  Common roles: Senior Software Engineer, Product Manager
  Tech stack: Java, React, AWS
```

---

## 📊 Monitor Progress

### Via Training Ground UI:
- Jobs Scraped: Updates every 2 hours
- Companies Discovered: Shows 100
- Days Remaining: Countdown to 1-week mark
- Status: "Running" → "Paused for Review" or "Completed"

### Via SQL:
```sql
-- Check progress
SELECT * FROM training_progress ORDER BY started_at DESC LIMIT 1;

-- Check jobs scraped
SELECT COUNT(*), industry FROM training_job_postings GROUP BY industry;

-- Check time elapsed
SELECT
  started_at,
  NOW() - started_at as time_elapsed,
  CASE
    WHEN NOW() - started_at > INTERVAL '7 days' THEN 'SHOULD BE PAUSED'
    ELSE 'STILL RUNNING'
  END as status
FROM training_progress
ORDER BY started_at DESC LIMIT 1;

-- View qualified companies
SELECT company_name, employee_count, location_city, location_state
FROM qualified_companies
ORDER BY total_jobs_scraped DESC;
```

---

## 🛑 Auto-Stop Conditions

Training stops when **EITHER**:

1. **1,000 jobs scraped** (most likely, ~40 hours)
2. **1 week elapsed** (safety stop, 7 days)

**Status Updates:**
- `running` → Training in progress
- `completed` → Reached 1,000 jobs
- `paused_for_review` → 1 week elapsed, waiting for review

---

## 🔄 Resume After Review

After reviewing results:

**Option 1: Resume Training**
```sql
UPDATE training_progress
SET status = 'running'
WHERE id = (SELECT id FROM training_progress ORDER BY started_at DESC LIMIT 1);
```

**Option 2: Start Fresh**
```sql
-- Clear all training data
TRUNCATE training_job_postings;
TRUNCATE company_intelligence;
TRUNCATE phrase_intelligence;
TRUNCATE training_progress;

-- Keep qualified_companies (don't re-identify)
-- Then start new training batch
```

---

## 💰 Cost Estimate

**Phase 1 (Identify Companies):**
- $2-3 one-time

**Phase 2 (Scrape 1,000 Jobs):**
- 50 jobs × 20 batches × $0.75-1.00 = $15-20

**Total: ~$17-23**

---

## ✅ Success Checklist

- [ ] Database schema deployed
- [ ] Anthropic API key set ($5 free credits available)
- [ ] All 3 functions deployed
- [ ] 100 companies identified (500-1000 employees verified)
- [ ] Verified in database: `SELECT COUNT(*) FROM qualified_companies`
- [ ] Cron job created (every 2 hours)
- [ ] First batch started
- [ ] Training Ground shows progress
- [ ] Auto-stop set for 1 week

---

## 🎉 Final Result

**After 1,000 jobs (or 1 week):**
- ✅ Training pauses automatically
- ✅ You review the learned intelligence
- ✅ Decide to resume or stop
- ✅ Agent is ready to match staffing agency jobs!

**Check Training Ground tab to see:**
- Companies learned
- Unique phrases extracted
- Location intelligence
- System mappings

---

## 🚨 Troubleshooting

**"No qualified companies found"**
- Run Step 4 first (identify companies)
- Verify: `SELECT COUNT(*) FROM qualified_companies`

**"Training not starting"**
- Check cron job is enabled
- Check Anthropic API has credits
- View logs: `npx supabase functions logs training-scheduler`

**"Still running after 1 week"**
- Check status: `SELECT status FROM training_progress`
- Should auto-update to `paused_for_review`
- Manually pause if needed

---

**You're ready to deploy! 🚀**

Follow steps 1-6 above, then monitor Training Ground tab!
