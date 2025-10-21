# Supabase Edge Function Setup for Real Web Search

This guide will help you set up real-time web search using Supabase Edge Functions and SerpAPI.

## Prerequisites

1. **Supabase account** (you already have this)
2. **SerpAPI account** (free tier: 100 searches/month)

---

## Step 1: Sign up for SerpAPI

1. Go to https://serpapi.com/
2. Click "Sign Up" (or "Get Started")
3. Create a free account
4. Go to your dashboard: https://serpapi.com/manage-api-key
5. **Copy your API key** (looks like: `abc123def456...`)

**Pricing:**
- Free: 100 searches/month
- Paid: $50/month for 5,000 searches

---

## Step 2: Install Supabase CLI

```bash
# Install Supabase CLI globally
npm install -g supabase

# Verify installation
supabase --version
```

---

## Step 3: Login to Supabase

```bash
# Login to your Supabase account
supabase login

# This will open your browser to authenticate
```

---

## Step 4: Link Your Project

```bash
# Navigate to your project directory
cd /Users/isaacmarks/dashboard-ui

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Find your project ref at: https://supabase.com/dashboard/project/_/settings/general
# It looks like: tgoqohbqrcemscrbkbwm
```

---

## Step 5: Set the API Key Secret

```bash
# Set your SerpAPI key as a secret (replace YOUR_API_KEY with actual key)
supabase secrets set SERP_API_KEY=YOUR_SERPAPI_KEY_HERE

# Example:
# supabase secrets set SERP_API_KEY=abc123def456...
```

---

## Step 6: Deploy the Edge Function

```bash
# Deploy the web-search function
supabase functions deploy web-search

# You should see:
# ✅ Deployed Function web-search
```

---

## Step 7: Test the Function (Optional)

```bash
# Test the function with a sample query
supabase functions invoke web-search \
  --data '{"query": "Senior Accountant Austin TX healthcare"}'

# You should see JSON results with job postings
```

---

## Step 8: Update Your Frontend

The frontend code has already been prepared. Once you deploy the Edge Function, it will automatically start using real web search!

No additional changes needed - just deploy and test!

---

## Verification Checklist

- [ ] SerpAPI account created and API key obtained
- [ ] Supabase CLI installed (`supabase --version` works)
- [ ] Logged into Supabase (`supabase login`)
- [ ] Project linked (`supabase link`)
- [ ] API key secret set (`supabase secrets set SERP_API_KEY=...`)
- [ ] Function deployed (`supabase functions deploy web-search`)
- [ ] Tested in UI (paste job description and click "Analyze Job")

---

## Troubleshooting

### Error: "SERP_API_KEY not configured"
- Make sure you ran: `supabase secrets set SERP_API_KEY=your_key`
- Secrets need to be set BEFORE deploying the function
- If you already deployed, set the secret and redeploy

### Error: "Failed to deploy function"
- Make sure you're logged in: `supabase login`
- Make sure project is linked: `supabase link`
- Check you're in the correct directory: `pwd` should show `/Users/isaacmarks/dashboard-ui`

### Error: "SerpAPI rate limit exceeded"
- Free tier is limited to 100 searches/month
- Each analysis uses 5-7 searches
- Consider upgrading to paid plan or wait until next month

### Search returns no results
- Check console logs for errors
- Verify the Edge Function deployed successfully
- Try testing the function directly with `supabase functions invoke`

---

## Alternative: Use Mock Data (Development Only)

If you don't want to set up real search yet, the app will continue using mock data. You can test the parser improvements and matching algorithm without real search.

Real search is recommended for production use to get accurate employer identification.

---

## Cost Estimation

**Free Tier:**
- 100 searches/month
- Each analysis = ~5 searches
- **~20 analyses per month** (free)

**Paid Plan ($50/month):**
- 5,000 searches/month
- **~1,000 analyses per month**
- $0.05 per analysis

---

## Questions?

If you encounter any issues, check:
1. Supabase function logs: https://supabase.com/dashboard/project/_/functions
2. Browser console for error messages
3. SerpAPI dashboard for usage stats
