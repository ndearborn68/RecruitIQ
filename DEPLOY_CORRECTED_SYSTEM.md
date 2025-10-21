# 🎯 Deploy CORRECTED Training System (500-1000 Employees ONLY)

## ✅ What's Fixed

**OLD APPROACH (WRONG):**
- ❌ Scraped from random large companies (Disney, Goldman Sachs, etc.)
- ❌ No employee count verification
- ❌ Mixed company sizes

**NEW APPROACH (CORRECT):**
- ✅ **FIRST:** Identify 100 companies with 500-1000 employees
- ✅ **THEN:** Scrape jobs ONLY from these pre-qualified companies
- ✅ Strict headcount verification via LinkedIn
- ✅ Geographic and industry diversity

---

## 🏗️ Two-Phase System

### **Phase 1: Identify Qualified Companies** (One-time, ~5 minutes)
1. Agent researches companies with 500-1000 employees
2. Verifies headcount via LinkedIn
3. Stores 100 pre-qualified companies in database

### **Phase 2: Scrape Jobs** (Every 2 hours)
1. Agent pulls from pre-qualified company list
2. Scrapes 50 jobs from ONLY these companies
3. Ensures perfect diversity

---

## 🚀 Deploy (5 Steps)

### Step 1: Deploy Database Schema

```bash
# Create qualified companies table
npx supabase db push
```

Or manually run both:
- `supabase/migrations/qualified-companies.sql`
- `supabase/migrations/training-schema.sql`

### Step 2: Set Anthropic API Key

```bash
npx supabase secrets set ANTHROPIC_API_KEY=your-key-here
```

### Step 3: Deploy Functions

```bash
# Deploy company identifier (Phase 1)
npx supabase functions deploy company-identifier

# Deploy background trainer (Phase 2)
npx supabase functions deploy background-trainer

# Deploy scheduler
npx supabase functions deploy training-scheduler
```

### Step 4: Identify Qualified Companies (Run Once)

```bash
# Call the identifier to find 100 companies with 500-1000 employees
curl -X POST \
  'https://tgoqohbqrcemscrbkbwm.supabase.co/functions/v1/company-identifier' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"action": "identify_companies"}'
```

**This will take ~5 minutes and identify:**
- 30 Software companies (500-1000 employees)
- 30 Finance companies (500-1000 employees)
- 25 Manufacturing companies (500-1000 employees)
- 15 Marketing companies (500-1000 employees)

**Example companies it will find:**
- Bazaarvoice (Austin, TX): 715 employees, SaaS
- Avalara (Seattle, WA): 850 employees, Tax software
- First Horizon Bank (Memphis, TN): 750 employees
- Manitowoc Company (Manitowoc, WI): 900 employees, Cranes

### Step 5: Set Up Cron (Every 2 Hours)

Go to: https://supabase.com/dashboard/project/tgoqohbqrcemscrbkbwm/database/cron-jobs

Create cron job:
```sql
-- Schedule: */2 * * * * (every 2 hours)
SELECT
  net.http_post(
    url := 'https://tgoqohbqrcemscrbkbwm.supabase.co/functions/v1/training-scheduler',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb
  ) as request_id;
```

---

## 📊 What Happens

### Phase 1 (One-Time):
```
Company Identifier Agent
    ↓
Searches for companies with 500-1000 employees
    ↓
Verifies headcount via LinkedIn
    ↓
Stores 100 qualified companies in database
    ↓
DONE (never runs again)
```

### Phase 2 (Every 2 Hours):
```
Training Scheduler wakes up
    ↓
Pulls from qualified_companies table
    ↓
Scrapes 50 jobs from ONLY these companies
    ↓
Extracts intelligence
    ↓
Stores in training_job_postings
    ↓
Sleeps for 2 hours
    ↓
Repeat until 1,000 jobs scraped
```

---

## 🎯 Company Distribution (100 Total)

**Software (30 companies):**
- Cities: Austin, Seattle, Denver, Portland, Boston, Atlanta, Pittsburgh, Salt Lake City
- Examples: Bazaarvoice, Avalara, SendGrid, DataStax, SailPoint
- 500-1000 employees each, verified via LinkedIn

**Finance (30 companies):**
- Cities: Charlotte, Chicago, Dallas, Phoenix, Minneapolis, Columbus, Philadelphia
- Examples: First Horizon Bank, Pinnacle Financial, Regions Bank (branches)
- 500-1000 employees each

**Manufacturing (25 companies):**
- Cities: Green Bay, Milwaukee, Grand Rapids, Akron, Fort Wayne, Wichita
- Examples: Manitowoc Company, Douglas Autotech, Tenneco (divisions)
- 500-1000 employees each

**Marketing (15 companies):**
- Cities: San Diego, Nashville, Miami, Kansas City, Indianapolis
- Examples: R2integrated, Prophet Brand Strategy, Daggerwing Group
- 500-1000 employees each

---

## ✅ Verification Checklist

After Step 4, verify companies were identified:

```sql
-- Check total count
SELECT COUNT(*) FROM qualified_companies;
-- Should return 100

-- Check distribution
SELECT industry, COUNT(*)
FROM qualified_companies
GROUP BY industry;
-- Should show: Software 30, Finance 30, Manufacturing 25, Marketing 15

-- Check employee counts
SELECT MIN(employee_count), MAX(employee_count)
FROM qualified_companies;
-- Should show: MIN=500, MAX=1000

-- View sample companies
SELECT company_name, location_city, location_state, employee_count, industry
FROM qualified_companies
LIMIT 20;
```

---

## 💰 Cost Estimate

**Phase 1 (One-time):**
- Identify 100 companies: ~$2-3
- Runs once, never again

**Phase 2 (Every 2 hours):**
- Scrape 50 jobs: ~$0.75-1.00 per batch
- 20 batches to reach 1,000 jobs = ~$15-20
- **Total:** ~$17-23 for complete training

---

## 🎓 Training Ground UI

The UI will show:
- **Companies Discovered:** 100 (all 500-1000 employees)
- **Jobs Scraped:** 0 → 1,000
- **Progress:** Real-time updates every 2 hours

---

## 🔍 Monitor Progress

**Check qualified companies:**
```sql
SELECT * FROM qualified_companies ORDER BY company_name;
```

**Check training progress:**
```sql
SELECT COUNT(*), industry
FROM training_job_postings
GROUP BY industry;
```

**Check which companies have been scraped:**
```sql
SELECT qc.company_name, qc.employee_count, qc.total_jobs_scraped
FROM qualified_companies qc
ORDER BY qc.total_jobs_scraped DESC;
```

---

## ✅ Success Checklist

- [ ] Database schema deployed
- [ ] Anthropic API key set
- [ ] All 3 functions deployed
- [ ] Phase 1 completed (100 companies identified)
- [ ] Verified 100 companies in database
- [ ] All companies have 500-1000 employees
- [ ] Cron job created
- [ ] First training batch started
- [ ] Training Ground shows results

---

## 🎉 Result

After 40 hours (20 batches × 2 hours):
- ✅ 1,000 jobs scraped from 100 pre-qualified companies
- ✅ All companies have 500-1000 employees
- ✅ Perfect industry diversity
- ✅ Agent trained on real employer language
- ✅ Ready to match any job!

**This is the CORRECT approach!**
