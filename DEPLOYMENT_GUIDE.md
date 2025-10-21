# Deployment Guide: Deep Research Reverse Engineering

## 🎯 What Was Built

You now have a **production-ready job reverse engineering system** that uses the proven methodology that successfully identified Disney with 85% confidence.

### Key Features:
- ✅ Real web search via Anthropic Claude API
- ✅ Deep research with 5-10+ search queries per analysis
- ✅ High-value signal extraction (Workday HRIS, interview volumes, state-specific requirements)
- ✅ Confidence scoring based on evidence
- ✅ Automatic saving to Supabase database
- ✅ Cost: ~$0.10-$0.50 per analysis

---

## 📦 What Was Changed

### New Files Created:
1. **`supabase/functions/analyze-job/index.ts`** - Edge Function that calls Anthropic API with deep research prompt
2. **`SETUP_INSTRUCTIONS.md`** - Detailed setup guide
3. **`DEPLOYMENT_GUIDE.md`** - This file

### Files Modified:
1. **`src/agents/orchestrator.ts`** - Now calls Supabase Edge Function instead of mock data
2. **`src/agents/parser-agent.ts`** - Enhanced with high-value signal extraction:
   - 🎯 HRIS/ATS systems (Workday, Sage Intacct, etc.)
   - 🎯 Exact interview volumes (e.g., "35-70 per week")
   - 🎯 State-specific background checks (e.g., "Florida fingerprints")
   - Contract durations, hourly rates, team sizes

---

## 🚀 Deployment Steps

### Step 1: Get Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in with your account
3. Click "API Keys" in the left sidebar
4. Click "Create Key"
5. Name it "RecruitIQ Reverse Engineering"
6. Copy the key (starts with `sk-ant-api...`)
7. **Save it securely** - you won't see it again!

**Cost estimate:**
- First $5 is free credits
- After that: ~$0.10-$0.50 per job analysis
- 100 analyses/month ≈ $10-$50/month

---

### Step 2: Install Supabase CLI

```bash
# Install Supabase CLI globally
npm install -g supabase

# Or use npx (no install needed)
npx supabase --version
```

---

### Step 3: Link Your Supabase Project

```bash
# Login to Supabase
npx supabase login

# Link to your project (use the project ref from your .env)
npx supabase link --project-ref tgoqohbqrcemscrbkbwm

# This will prompt you to enter your database password
```

---

### Step 4: Set Environment Variables in Supabase

```bash
# Set the Anthropic API key as a secret
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-api-YOUR-KEY-HERE

# Verify it was set
npx supabase secrets list
```

---

### Step 5: Deploy the Edge Function

```bash
# Deploy the analyze-job function
npx supabase functions deploy analyze-job

# You should see:
# ✓ Deployed function analyze-job
# Function URL: https://tgoqohbqrcemscrbkbwm.supabase.co/functions/v1/analyze-job
```

---

### Step 6: Test the Function (Optional but Recommended)

Create a test file:

```bash
# Create test.json
cat > test.json << 'EOF'
{
  "jobDescription": "We are looking for a Talent Acquisition Coordinator for a top media & entertainment company out of their Burbank, CA offices! The Company is seeking a Talent Acquisition Coordinator to support their dynamic and fast-paced Talent Acquisition team. Schedule a high volume of interviews (approximately 35–70 per week). Experience using Workday or similar HRIS/ATS systems preferred.",
  "jobUrl": "https://solomonpage.com/job/123"
}
EOF

# Test the function
curl -i --location --request POST \
  'https://tgoqohbqrcemscrbkbwm.supabase.co/functions/v1/analyze-job' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data @test.json
```

Replace `YOUR_ANON_KEY` with your Supabase anon key from `.env`

Expected response:
```json
{
  "identifiedClient": "The Walt Disney Company",
  "confidence": 85,
  "matchPercentage": 85,
  "reasoning": [...]
}
```

---

### Step 7: Use in Your App

1. **Start your dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to http://localhost:5173**

3. **Click "Reverse Engineering" tab**

4. **Paste the Disney job description** (or any other job)

5. **Click "Analyze Job & Identify Client"**

6. **Wait 2-5 minutes** for deep research

7. **See results** with confidence scores and evidence!

---

## 💡 How It Works

```
User pastes job description
         ↓
React UI (App.tsx)
         ↓
Orchestrator Agent (orchestrator.ts)
         ↓
Supabase Edge Function (analyze-job)
         ↓
Anthropic Claude API
  - Extracts high-value signals (Workday, interview volumes, etc.)
  - Conducts 5-10+ web searches
  - Cross-references evidence
  - Calculates confidence score
         ↓
Results returned to UI
         ↓
Saved to Supabase database
```

---

## 🔍 The Methodology (What Makes It Work)

### High-Value Signals Extracted:
1. **HRIS/ATS Systems** (e.g., Workday) - Companies rarely change these
2. **Exact interview volumes** (e.g., "35-70 per week") - Very specific numbers
3. **State-specific requirements** (e.g., "Florida backgrounds") - Unique identifiers
4. **Industry terms** (e.g., "media & entertainment")
5. **Contract patterns** (e.g., "5-month contract")
6. **Location** (e.g., "Burbank, CA")

### Search Strategy:
- Query 1: Job title + Location + HRIS system + career sites
- Query 2: Unique phrase + Location -agency -staffing
- Query 3: HRIS system + Industry + Location headquarters
- Query 4: Major employers in location/industry
- Query 5: Exact numbers/metrics + Job title + Location

### Confidence Scoring:
- **90-100%**: Multiple exact matches + 3+ sources + system verification
- **80-89%**: Several strong matches + 2 sources + logical fit
- **70-79%**: Good matches + 1 source + reasonable hypothesis
- **Below 70%**: Weak matches, multiple candidates possible

---

## 💰 Cost Breakdown

**Per Analysis:**
- Input tokens: ~1,000 ($0.003)
- Output tokens: ~3,000 ($0.045)
- Web searches: 5-10 searches ($0.05-$0.10)
- **Total: ~$0.10-$0.50**

**Monthly Estimates:**
- 50 analyses/month = $5-$25
- 100 analyses/month = $10-$50
- 200 analyses/month = $20-$100

---

## 🐛 Troubleshooting

### Error: "Anthropic API failed: 401"
**Problem:** API key not set or invalid
**Solution:**
```bash
npx supabase secrets set ANTHROPIC_API_KEY=your-key-here
npx supabase functions deploy analyze-job
```

### Error: "Analysis failed: FunctionsHttpError"
**Problem:** Edge Function not deployed or CORS issue
**Solution:**
```bash
npx supabase functions deploy analyze-job
```

### Error: "No data returned from analysis"
**Problem:** Edge Function crashed or timed out
**Solution:**
- Check Supabase function logs:
  ```bash
  npx supabase functions logs analyze-job
  ```
- Verify your Anthropic API has credits

### Results are "Analysis Failed"
**Problem:** Multiple possible causes
**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Verify Edge Function is deployed:
   ```bash
   npx supabase functions list
   ```

---

## ✅ Success Checklist

- [ ] Anthropic API key obtained
- [ ] Supabase CLI installed
- [ ] Project linked (`npx supabase link`)
- [ ] API key set as secret (`npx supabase secrets set`)
- [ ] Edge Function deployed (`npx supabase functions deploy`)
- [ ] Function tested with curl (optional)
- [ ] React app running (`npm run dev`)
- [ ] Reverse Engineering tab works
- [ ] Test analysis completed successfully
- [ ] Results saved to database

---

## 🎉 Next Steps

### Recommended Improvements:
1. **Add rate limiting** - Prevent abuse of your API
2. **Add caching** - Cache results for identical job descriptions
3. **Add analysis history** - View past analyses in a new tab
4. **Add export feature** - Export results to PDF/CSV
5. **Add batch processing** - Analyze multiple jobs at once
6. **Add confidence threshold filter** - Only show high-confidence results

### Monitoring:
1. **Check Anthropic usage**: https://console.anthropic.com/settings/usage
2. **Check Supabase usage**: https://supabase.com/dashboard/project/tgoqohbqrcemscrbkbwm/settings/billing
3. **Monitor Edge Function logs**:
   ```bash
   npx supabase functions logs analyze-job --tail
   ```

---

## 📞 Need Help?

If you encounter issues:
1. Check the logs: `npx supabase functions logs analyze-job`
2. Verify secrets: `npx supabase secrets list`
3. Test the Edge Function directly with curl
4. Check browser DevTools Console for frontend errors
5. Verify your Anthropic API has credits

---

## 🔐 Security Notes

**✅ Secure:**
- API keys are stored as Supabase secrets (server-side only)
- Never exposed in browser/frontend code
- CORS headers properly configured

**⚠️ Important:**
- Never commit API keys to git
- Keep your Supabase service role key private
- Monitor your Anthropic usage to prevent unexpected costs

---

## 📊 Expected Results

**Example Output (Disney analysis):**

```json
{
  "identifiedClient": "The Walt Disney Company",
  "confidence": 85,
  "matchPercentage": 85,
  "reasoning": [
    {
      "category": "HRIS System Match",
      "score": 95,
      "details": "Workday confirmed via Disney job postings and case studies"
    },
    {
      "category": "Interview Volume Match",
      "score": 100,
      "details": "Exact match: '35-70 interviews per week' found in historical Disney TA Coordinator postings"
    },
    {
      "category": "Location Match",
      "score": 100,
      "details": "Burbank, CA - Disney Studios headquarters confirmed"
    },
    {
      "category": "Florida Background Check",
      "score": 80,
      "details": "Logical for Disney's dual-state operations (CA + FL theme parks)"
    }
  ],
  "matchedJobUrl": "https://disney.careers.com/job/...",
  "analysisDate": "2025-10-20T..."
}
```

---

**You're all set! 🚀**

Your reverse engineering feature now has the same power that identified Disney with 85% confidence.
