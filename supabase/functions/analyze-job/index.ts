// Supabase Edge Function: Analyze Job Posting with Deep Research
// This function uses Anthropic Claude API with web search to reverse-engineer staffing agency job postings
// Enhanced with extended thinking for more accurate analysis

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// Configuration for analysis
const CONFIG = {
  model: 'claude-sonnet-4-5-20250929',
  maxTokens: 16000,
  budgetTokens: 10000, // Extended thinking budget
  maxRetries: 3,
  retryDelayMs: 1000,
}

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
 * Perform deep research using Anthropic Claude API with Web Search
 * Uses extended thinking for more accurate analysis
 * Employs the proven methodology that successfully identified Disney
 */
async function performDeepResearch(jobDescription: string, jobUrl: string) {
  console.log('🤖 Calling Anthropic API with web search enabled...')

  const systemPrompt = `You are an elite job reverse-engineering expert with access to web search. Your mission is to identify the REAL end employer from staffing agency job postings.

You have proven expertise - you successfully identified Disney as the client from a staffing agency posting using systematic web research.

**YOUR PROCESS:**
1. Extract UNIQUE identifiers (software systems, interview volumes, specific phrases, metrics)
2. Conduct multiple targeted web searches to find the real employer
3. Cross-reference evidence from multiple sources
4. Calculate confidence based on evidence strength

**WEB SEARCH STRATEGY:**
- Search for unique software/systems + location + "careers"
- Search for specific metrics or numbers mentioned
- Search company career pages (greenhouse.io, lever.co, careers pages)
- Cross-reference tech stacks and requirements
- Look for historical job postings with similar requirements

**CONFIDENCE SCORING:**
- 90-100%: Multiple exact matches + 3+ sources + system verification
- 80-89%: Several strong matches + 2 sources + logical fit
- 70-79%: Good matches + 1 source + reasonable hypothesis
- Below 70%: Weak matches, multiple candidates possible

Always use web search to verify your hypotheses. Never guess without evidence.`

  const userPrompt = `Analyze this staffing agency job posting and identify the REAL end employer.

**JOB POSTING TO ANALYZE:**

${jobDescription}

${jobUrl ? `**Source URL:** ${jobUrl}` : ''}

**INSTRUCTIONS:**
1. First, extract all unique identifiers from the job posting
2. Use web search to research each identifier
3. Build a hypothesis and verify it with additional searches
4. Provide your conclusion with detailed evidence

**REQUIRED OUTPUT FORMAT (valid JSON only, no markdown):**
{
  "identifiedClient": "Company Name",
  "confidence": 85,
  "matchPercentage": 85,
  "reasoning": [
    {
      "category": "System Match",
      "score": 95,
      "details": "Evidence details here..."
    },
    {
      "category": "Location Match",
      "score": 100,
      "details": "Evidence details here..."
    },
    {
      "category": "Requirements Match",
      "score": 90,
      "details": "Evidence details here..."
    }
  ],
  "matchedJobUrl": "https://careers.company.com/job/123",
  "competitorUrl": "${jobUrl || 'N/A'}",
  "analysisDate": "${new Date().toISOString()}",
  "allMatches": [
    {
      "company": "Primary Match Company Name",
      "confidence": 85,
      "evidence": "Summary of evidence..."
    }
  ],
  "searchQueriesUsed": [
    "Query 1...",
    "Query 2..."
  ],
  "keyEvidence": [
    "Key evidence point 1",
    "Key evidence point 2"
  ]
}

Output ONLY the JSON object, no other text.`

  // Call Anthropic API with web search tool and extended thinking
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
    try {
      console.log(`📡 API call attempt ${attempt}/${CONFIG.maxRetries}...`)

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: CONFIG.model,
          max_tokens: CONFIG.maxTokens,
          thinking: {
            type: 'enabled',
            budget_tokens: CONFIG.budgetTokens
          },
          tools: [
            {
              type: 'web_search',
              name: 'web_search',
              max_uses: 10
            }
          ],
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Anthropic API error (attempt ${attempt}):`, errorText)

        // If it's a rate limit or server error, retry
        if (response.status >= 500 || response.status === 429) {
          lastError = new Error(`API error ${response.status}: ${errorText}`)
          if (attempt < CONFIG.maxRetries) {
            const delay = CONFIG.retryDelayMs * Math.pow(2, attempt - 1)
            console.log(`⏳ Retrying in ${delay}ms...`)
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          }
        }
        throw new Error(`Anthropic API failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ Received response from Anthropic API')

      // Log thinking summary if available
      const thinkingBlocks = data.content?.filter((block: any) => block.type === 'thinking') || []
      if (thinkingBlocks.length > 0) {
        console.log(`🧠 Extended thinking used: ${thinkingBlocks.length} thinking blocks`)
      }

      // Log web search usage
      const toolUseBlocks = data.content?.filter((block: any) => block.type === 'tool_use') || []
      if (toolUseBlocks.length > 0) {
        console.log(`🔍 Web searches performed: ${toolUseBlocks.length}`)
      }

      // Extract the text response from Claude
      const textBlocks = data.content?.filter((block: any) => block.type === 'text') || []
      const content = textBlocks.map((block: any) => block.text).join('\n')

      if (!content) {
        throw new Error('No text content in API response')
      }

      // Try to parse JSON from the response
      return parseAnalysisResponse(content, jobUrl)

    } catch (error) {
      lastError = error as Error
      console.error(`Error on attempt ${attempt}:`, error)

      if (attempt < CONFIG.maxRetries) {
        const delay = CONFIG.retryDelayMs * Math.pow(2, attempt - 1)
        console.log(`⏳ Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  // All retries failed
  throw lastError || new Error('All API call attempts failed')
}

/**
 * Parse and validate the analysis response
 */
function parseAnalysisResponse(content: string, jobUrl: string) {
  let analysisResult

  try {
    // Try to extract JSON from the response
    // First, try to find JSON in code blocks
    let jsonString = content

    // Remove markdown code block markers if present
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1].trim()
    } else {
      // Try to find raw JSON object
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonString = jsonMatch[0]
      }
    }

    analysisResult = JSON.parse(jsonString)

    // Validate required fields
    if (!analysisResult.identifiedClient) {
      analysisResult.identifiedClient = 'Unable to determine'
    }
    if (typeof analysisResult.confidence !== 'number') {
      analysisResult.confidence = 0
    }
    if (typeof analysisResult.matchPercentage !== 'number') {
      analysisResult.matchPercentage = analysisResult.confidence
    }
    if (!Array.isArray(analysisResult.reasoning)) {
      analysisResult.reasoning = [{
        category: 'Analysis',
        score: analysisResult.confidence,
        details: 'Analysis completed'
      }]
    }

    // Ensure dates and URLs are set
    analysisResult.analysisDate = analysisResult.analysisDate || new Date().toISOString()
    analysisResult.competitorUrl = analysisResult.competitorUrl || jobUrl || 'N/A'

  } catch (parseError) {
    console.error('Failed to parse JSON response:', parseError)
    console.log('Raw content:', content.substring(0, 500))

    // Create a structured response from the text
    analysisResult = {
      identifiedClient: extractCompanyFromText(content),
      confidence: extractConfidenceFromText(content),
      matchPercentage: extractConfidenceFromText(content),
      reasoning: [{
        category: 'Text Analysis',
        score: 50,
        details: content.substring(0, 1000)
      }],
      matchedJobUrl: null,
      competitorUrl: jobUrl || 'N/A',
      analysisDate: new Date().toISOString(),
      allMatches: [],
      parseWarning: 'Response was not valid JSON, extracted key information from text'
    }
  }

  console.log('🎯 Analysis complete:', analysisResult.identifiedClient, `(${analysisResult.confidence}% confidence)`)
  return analysisResult
}

/**
 * Helper to extract company name from unstructured text
 */
function extractCompanyFromText(text: string): string {
  // Look for common patterns like "identified as X" or "the employer is X"
  const patterns = [
    /identified (?:as|the client as|the employer as) ([A-Z][A-Za-z0-9\s&]+?)(?:\.|,|\s-)/i,
    /employer is (?:likely )?([A-Z][A-Za-z0-9\s&]+?)(?:\.|,|\s-)/i,
    /company:?\s*([A-Z][A-Za-z0-9\s&]+?)(?:\.|,|\s-)/i,
    /conclude.*?([A-Z][A-Za-z0-9\s&]+?) is the/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return 'Unable to determine'
}

/**
 * Helper to extract confidence percentage from unstructured text
 */
function extractConfidenceFromText(text: string): number {
  const patterns = [
    /confidence:?\s*(\d+)%?/i,
    /(\d+)%\s*confidence/i,
    /(\d+)%\s*(?:certain|sure|match)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const confidence = parseInt(match[1], 10)
      if (confidence >= 0 && confidence <= 100) {
        return confidence
      }
    }
  }

  return 0
}
