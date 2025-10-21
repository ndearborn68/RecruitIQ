# Setup Instructions for Reverse Engineering Feature

## Step 1: Get Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to "API Keys"
4. Create a new API key
5. Copy the key (starts with `sk-ant-api...`)

## Step 2: Configure Supabase Secrets

You need to add the Anthropic API key to Supabase Edge Functions:

```bash
# Login to Supabase CLI
npx supabase login

# Link your project
npx supabase link --project-ref tgoqohbqrcemscrbkbwm

# Set the Anthropic API key as a secret
npx supabase secrets set ANTHROPIC_API_KEY=your_key_here
```

## Step 3: Deploy the Edge Function

```bash
# Deploy the analyze-job function
npx supabase functions deploy analyze-job
```

## Step 4: Test the Function

You can test it locally:

```bash
# Serve functions locally
npx supabase functions serve analyze-job --env-file .env.local

# In another terminal, test with curl:
curl -i --location --request POST 'http://localhost:54321/functions/v1/analyze-job' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"jobDescription":"Your job description here..."}'
```

## Step 5: Verify Everything Works

1. Start your React app: `npm run dev`
2. Navigate to the "Reverse Engineering" tab
3. Paste a job description
4. Click "Analyze Job & Identify Client"
5. Wait 2-5 minutes for deep research
6. See results with confidence scores and evidence

## Expected Costs

- ~$0.10-$0.50 per job analysis
- Includes web search and AI analysis
- Only charged when analysis is run

## Troubleshooting

### Error: "Anthropic API failed"
- Check that your API key is set correctly
- Verify you have credits in your Anthropic account

### Error: "CORS error"
- Make sure the Edge Function is deployed
- Check that CORS headers are set in the function

### Error: "Supabase connection failed"
- Verify your Supabase URL and keys in .env
- Check that the job_analyses table exists

## Database Schema

The `job_analyses` table should already exist (created earlier). If not:

```sql
CREATE TABLE job_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_description TEXT NOT NULL,
  job_url TEXT,
  identified_client TEXT,
  confidence INTEGER,
  match_percentage INTEGER,
  reasoning JSONB,
  matched_job_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
