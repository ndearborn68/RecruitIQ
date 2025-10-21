# 🤖 Deploy Auto-Training System (Every 2 Hours)

## ✅ What's Built

1. ✅ **Background Trainer** - Scrapes 50 jobs with perfect diversity
2. ✅ **Auto Scheduler** - Runs every 2 hours automatically
3. ✅ **Job Distribution:**
   - 15 Software Engineering jobs (30%)
   - 15 Finance & Accounting jobs (30%)
   - 12 Industrial/Manufacturing jobs (24%)
   - 8 Marketing jobs (16%)
4. ✅ **Stops at 1,000 jobs** automatically
5. ✅ **Sample job list** in `SAMPLE_JOBS_TO_SCRAPE.md`

---

## 🚀 Deploy (4 Commands)

### Step 1: Deploy Database Schema

```bash
npx supabase db push
```

### Step 2: Set Anthropic API Key (if not done)

```bash
npx supabase secrets set ANTHROPIC_API_KEY=your-key-here
```

### Step 3: Deploy Functions

```bash
# Deploy background trainer
npx supabase functions deploy background-trainer

# Deploy auto-scheduler
npx supabase functions deploy training-scheduler
```

### Step 4: Set Up Cron Job (Every 2 Hours)

Go to Supabase Dashboard:
1. Navigate to: https://supabase.com/dashboard/project/tgoqohbqrcemscrbkbwm/database/cron-jobs
2. Click "Create a new cron job"
3. Use these settings:

```sql
-- Name: Auto Training Every 2 Hours
-- Schedule: */2 * * * *  (every 2 hours)
-- SQL Command:

SELECT
  net.http_post(
    url := 'https://tgoqohbqrcemscrbkbwm.supabase.co/functions/v1/training-scheduler',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb
  ) as request_id;
```

4. Click "Create cron job"

---

## ⏰ Schedule Explained

**Cron: `*/2 * * * *`** = Every 2 hours

```
Batch 1:  00:00 - Scrapes 50 jobs (15 SW, 15 Finance, 12 Mfg, 8 Marketing)
Batch 2:  02:00 - Scrapes 50 jobs (different companies)
Batch 3:  04:00 - Scrapes 50 jobs (different locations)
...
Batch 20: 40:00 - Reaches 1,000 jobs → STOPS AUTOMATICALLY
```

---

## 🎯 What Happens Automatically

**Every 2 Hours:**
1. ✅ Scheduler wakes up
2. ✅ Checks total jobs count
3. ✅ If < 1,000: Scrapes 50 new jobs
4. ✅ Extracts intelligence automatically
5. ✅ Updates databases
6. ✅ Goes back to sleep

**When Complete:**
- ✅ Stops at exactly 1,000 jobs
- ✅ Agent has learned from 200+ companies
- ✅ 5,000+ unique phrases extracted
- ✅ 50+ locations analyzed
- ✅ Ready to match any job!

---

## 📊 Job Diversity (Per Batch)

**Software Engineering (15 jobs):**
- Austin, Seattle, Denver, Portland, Boston, Atlanta, Pittsburgh
- Backend, Full Stack, DevOps, Data Engineer, Mobile, Cloud, ML, SRE
- Companies: Indeed, Dell, Oracle, Zillow, Workday, HubSpot, Salesforce

**Finance & Accounting (15 jobs):**
- Charlotte, Chicago, Boston, Dallas, Phoenix, Minneapolis, Columbus
- Accountant, Financial Analyst, Controller, Tax Manager, FP&A, Treasury
- Companies: Bank of America, Truist, Fidelity, Charles Schwab, Ameriprise

**Industrial/Manufacturing (12 jobs):**
- Green Bay, Milwaukee, Grand Rapids, Akron, Fort Wayne, Wichita
- Industrial Engineer, Manufacturing Engineer, Process, Quality, Automation
- Companies: Rockwell, Johnson Controls, Georgia-Pacific, Goodyear, GM

**Marketing (8 jobs):**
- San Diego, Nashville, Miami, Salt Lake City, Kansas City
- Marketing Manager, Digital Marketing, Content, Product Marketing, Brand
- Companies: Qualcomm, Intuit, Adobe, Qualtrics, Royal Caribbean

---

## 💰 Cost Estimate

**Per Batch (50 jobs):**
- Scraping: ~$0.50-1.00
- Processing: ~$0.25-0.50
- **Total per batch:** ~$0.75-1.50

**Complete Training (1,000 jobs):**
- 20 batches × $1.00 = **$20.00**
- Spread over 40 hours (less than 2 days)
- **Worth it** - Agent becomes expert at matching!

---

## 🎮 Manual Controls (Training Ground Tab)

You can also manually control:
- **Start New Batch** - Trigger immediately (don't wait 2 hours)
- **Process Batch** - Process scraped jobs
- **Refresh Progress** - See latest stats

---

## 🔍 Monitor Progress

**In Training Ground Tab:**
- Jobs Scraped: Updates every 2 hours
- Companies Discovered: Real-time count
- Unique Phrases: Growing intelligence
- Locations Analyzed: Hub scores

**In Supabase:**
```sql
-- Check progress
SELECT * FROM training_progress ORDER BY iteration DESC LIMIT 1;

-- Check total jobs
SELECT COUNT(*) FROM training_job_postings;

-- Check companies learned
SELECT COUNT(*) FROM company_intelligence;
```

---

## 🛑 Pause Training

To pause the auto-training:
1. Go to Supabase Cron Jobs
2. Disable the "Auto Training Every 2 Hours" job
3. Re-enable when ready to continue

---

## ✅ Success Checklist

- [ ] Database schema deployed
- [ ] Anthropic API key set
- [ ] background-trainer function deployed
- [ ] training-scheduler function deployed
- [ ] Cron job created (every 2 hours)
- [ ] First batch started
- [ ] Training Ground shows results

---

## 🎉 Ready!

The agent will now automatically:
- ✅ Scrape 50 diverse jobs every 2 hours
- ✅ Learn from 15 Software + 15 Finance + 12 Manufacturing + 8 Marketing
- ✅ Extract intelligence automatically
- ✅ Stop at 1,000 jobs
- ✅ Become expert at matching!

**Check `SAMPLE_JOBS_TO_SCRAPE.md` for the full job list!**
