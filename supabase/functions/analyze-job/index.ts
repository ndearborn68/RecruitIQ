// Supabase Edge Function: Analyze Job Posting with Deep Research
// This function uses Anthropic Claude API to reverse-engineer staffing agency job postings

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { jobDescription, jobUrl } = await req.json()

    if (!jobDescription || jobDescription.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: 'Job description must be at least 50 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🔍 Starting deep research analysis...')
    console.log('Job URL:', jobUrl || 'Not provided')
    console.log('Description length:', jobDescription.length)

    // Call Anthropic API with deep research prompt
    const analysisResult = await performDeepResearch(jobDescription, jobUrl)

    // Save to Supabase
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

      await supabase.from('job_analyses').insert({
        job_description: jobDescription,
        job_url: jobUrl || null,
        identified_client: analysisResult.identifiedClient,
        confidence: analysisResult.confidence,
        match_percentage: analysisResult.matchPercentage,
        reasoning: analysisResult.reasoning,
        matched_job_url: analysisResult.matchedJobUrl,
        created_at: new Date().toISOString()
      })

      console.log('✅ Saved analysis to database')
    }

    return new Response(
      JSON.stringify(analysisResult),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

/**
 * Perform deep research using Anthropic Claude API
 * Uses the proven methodology that successfully identified Disney
 */
async function performDeepResearch(jobDescription: string, jobUrl: string) {
  console.log('🤖 Calling Anthropic API for deep research...')

  const prompt = `You are a job reverse-engineering expert. Your task is to identify the REAL end employer from this staffing agency job posting.

**METHODOLOGY (Use the proven approach that found Disney):**

1. **Extract Unique Identifiers** (High-value signals):
   - Specific software/systems mentioned (e.g., "Workday", "Sage Intacct", "NetSuite")
   - Exact interview volumes (e.g., "35-70 per week")
   - Unique phrases (e.g., "fingerprint scheduling for Florida backgrounds")
   - Technical requirements with version numbers
   - Multi-location indicators
   - Industry-specific terminology

2. **Build Intelligent Search Queries**:
   - Query 1: "[Job Title]" "[Location]" "[Unique System]" site:careers OR site:greenhouse.io OR site:lever.co
   - Query 2: "[Unique Phrase]" "[Location]" -agency -staffing
   - Query 3: "[System Name]" "[Industry]" "[Location]" headquarters
   - Query 4: Check major employers in that location/industry
   - Query 5: "[Specific number/metric]" "[Job Title]" "[Location]"

3. **Cross-Reference Evidence**:
   - Verify company uses mentioned systems (check case studies, tech stack)
   - Confirm location matches (headquarters, offices)
   - Check salary ranges on Glassdoor/LinkedIn
   - Look for historical job postings with similar requirements
   - Verify industry fit

4. **Calculate Confidence Score**:
   - 90-100%: Multiple exact phrase matches + 3+ sources + system verification
   - 80-89%: Several strong matches + 2 sources + logical fit
   - 70-79%: Good matches + 1 source + reasonable hypothesis
   - Below 70%: Weak matches, multiple candidates possible

**JOB POSTING TO ANALYZE:**

${jobDescription}

${jobUrl ? `\n**Source URL:** ${jobUrl}\n` : ''}

**INSTRUCTIONS:**
- Use web search extensively (minimum 5-10 different searches)
- Focus on UNIQUE identifiers (systems, phrases, numbers)
- Cross-reference multiple sources
- Provide detailed evidence for your conclusion
- List alternative candidates if confidence < 85%

**RESPONSE FORMAT (JSON):**
{
  "identifiedClient": "Company Name",
  "confidence": 85,
  "matchPercentage": 85,
  "reasoning": [
    {
      "category": "System Match",
      "score": 95,
      "details": "Company confirmed to use Workday HRIS via case study..."
    },
    {
      "category": "Location Match",
      "score": 100,
      "details": "Headquarters located in Burbank, CA..."
    }
  ],
  "matchedJobUrl": "https://careers.company.com/job/123",
  "competitorUrl": "${jobUrl || 'N/A'}",
  "analysisDate": "${new Date().toISOString()}",
  "allMatches": [
    {
      "company": "Primary Match",
      "confidence": 85,
      "evidence": "..."
    }
  ],
  "searchQueriesUsed": [
    "Query 1...",
    "Query 2..."
  ],
  "keyEvidence": [
    "Exact interview volume match: 35-70 per week",
    "Workday system confirmed via job posting"
  ]
}`

  // Call Anthropic API
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Anthropic API error:', error)
    throw new Error(`Anthropic API failed: ${response.status} - ${error}`)
  }

  const data = await response.json()
  console.log('✅ Received response from Anthropic API')

  // Extract the JSON response from Claude
  const content = data.content[0].text

  // Try to parse JSON from the response
  let analysisResult
  try {
    // Look for JSON in the response (might be wrapped in markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      analysisResult = JSON.parse(jsonMatch[0])
    } else {
      // If no JSON found, create structured response from text
      analysisResult = {
        identifiedClient: 'Unable to determine',
        confidence: 0,
        matchPercentage: 0,
        reasoning: [{
          category: 'Analysis Result',
          score: 0,
          details: content
        }],
        matchedJobUrl: null,
        competitorUrl: jobUrl || 'N/A',
        analysisDate: new Date().toISOString(),
        allMatches: []
      }
    }
  } catch (parseError) {
    console.error('Failed to parse JSON response:', parseError)
    // Return the raw content if parsing fails
    analysisResult = {
      identifiedClient: 'Parse Error',
      confidence: 0,
      matchPercentage: 0,
      reasoning: [{
        category: 'Raw Response',
        score: 0,
        details: content
      }],
      matchedJobUrl: null,
      competitorUrl: jobUrl || 'N/A',
      analysisDate: new Date().toISOString(),
      allMatches: []
    }
  }

  console.log('🎯 Analysis complete:', analysisResult.identifiedClient, `(${analysisResult.confidence}% confidence)`)

  return analysisResult
}
