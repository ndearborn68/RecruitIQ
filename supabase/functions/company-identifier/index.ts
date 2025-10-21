// Company Identifier Agent
// FIRST identifies companies with 500-1000 employees
// THEN we scrape jobs from these pre-qualified companies

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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action } = await req.json()

    if (action === 'identify_companies') {
      return await identifyQualifiedCompanies()
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

/**
 * Identify companies with 500-1000 employees across target industries
 */
async function identifyQualifiedCompanies() {
  console.log('🔍 Identifying companies with 500-1000 employees...')

  const prompt = `You are a company research agent. Your STRICT task is to identify REAL companies with EXACTLY 500-1000 employees in the United States.

**CRITICAL REQUIREMENTS:**
- Employee count: MUST be between 500-1000 employees
- Must verify employee count through LinkedIn, company websites, or business databases
- Only include companies actively hiring
- Geographic and industry diversity required

**TARGET: 20 COMPANIES TOTAL**

**TARGET DISTRIBUTION:**

**SOFTWARE/TECH COMPANIES (6 companies):**
Location requirements:
- NOT Silicon Valley/San Francisco (too many large companies)
- Focus: Austin TX, Seattle WA, Denver CO, Portland OR, Boston MA, Atlanta GA, Pittsburgh PA, Salt Lake City UT, Minneapolis MN, Raleigh NC

For each company, verify:
- Employee count on LinkedIn
- Active job postings
- Company stage (established, not startup, not enterprise)

Example format:
- Bazaarvoice (Austin, TX): 715 employees, SaaS product reviews
- Avalara (Seattle, WA): 850 employees, Tax compliance software
- SendGrid (Denver, CO): 650 employees, Email API platform

**FINANCE/ACCOUNTING COMPANIES (6 companies):**
Location requirements:
- NOT NYC/Wall Street (too large)
- Focus: Charlotte NC, Chicago IL, Boston MA, Dallas TX, Phoenix AZ, Minneapolis MN, Columbus OH, Philadelphia PA, Nashville TN

Target: Regional banks, insurance companies, fintech, accounting firms
Example:
- First Horizon Bank (Memphis, TN): 750 employees
- TIAA (Charlotte, NC regional): 650 employees
- Northwestern Mutual (Milwaukee regional): 800 employees

**MANUFACTURING COMPANIES (5 companies):**
Location requirements:
- Small to mid-sized cities only
- Focus: Green Bay WI, Milwaukee WI, Grand Rapids MI, Akron OH, Fort Wayne IN, Wichita KS, Peoria IL, Rockford IL, Davenport IA

Target: Automotive suppliers, industrial equipment, food processing, packaging
Example:
- Douglas Autotech (Grand Rapids, MI): 600 employees, Automotive parts
- Manitowoc Company (Manitowoc, WI): 900 employees, Cranes and lifting
- Tenneco (Monroe, MI): 750 employees, Auto parts

**MARKETING/SERVICES COMPANIES (3 companies):**
Location requirements:
- Diverse locations
- Focus: San Diego CA, Nashville TN, Miami FL, Kansas City MO, Indianapolis IN, Columbus OH

Target: Marketing agencies, consulting, professional services
Example:
- R2integrated (Baltimore, MD): 550 employees, Digital marketing
- Prophet Brand Strategy (multiple offices): 650 employees
- Daggerwing Group (Boston, MA): 600 employees, Change management

**FOR EACH COMPANY, PROVIDE:**
{
  "companyName": "Company Name",
  "location": {
    "city": "City",
    "state": "ST",
    "isHQ": true
  },
  "employeeCount": 750,
  "employeeCountSource": "LinkedIn verified 2025-10",
  "industry": "Software|Finance|Manufacturing|Marketing",
  "description": "Brief description of what they do",
  "activelyHiring": true,
  "careerPageUrl": "https://company.com/careers",
  "linkedInUrl": "https://linkedin.com/company/...",
  "verificationNotes": "Employee count verified via LinkedIn company page as of Oct 2025"
}

**STRICT VERIFICATION:**
- Use web search to verify employee counts
- Check LinkedIn company pages
- Confirm they have active job postings
- Reject companies with <500 or >1000 employees
- Reject staffing agencies

**CRITICAL OUTPUT FORMAT:**
You MUST return ONLY a valid JSON array. Do NOT include any explanatory text, markdown formatting, or commentary.
Start your response with [ and end with ]
NO text before or after the JSON array.

Return exactly 20 companies (6 Software, 6 Finance, 5 Manufacturing, 3 Marketing) as a JSON array.`

  // Call Anthropic API
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  if (!response.ok) {
    throw new Error(`Anthropic API failed: ${response.status}`)
  }

  const data = await response.json()
  const content = data.content[0].text

  console.log('Claude response (first 500 chars):', content.substring(0, 500))

  // Find JSON array - be more aggressive about extracting clean JSON
  let jsonStr = content

  // If there's text before the array, remove it
  const startBracket = content.indexOf('[')
  if (startBracket > 0) {
    jsonStr = content.substring(startBracket)
  }

  // If there's text after the array, remove it
  const endBracket = jsonStr.lastIndexOf(']')
  if (endBracket !== -1) {
    jsonStr = jsonStr.substring(0, endBracket + 1)
  }

  console.log('Extracted JSON length:', jsonStr.length)
  console.log('First 100 chars of JSON:', jsonStr.substring(0, 100))

  const companies = JSON.parse(jsonStr)

  // Store in Supabase using UPSERT to avoid duplicate key errors
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

  let successCount = 0
  let skippedCount = 0
  const skipped = []

  for (const company of companies) {
    // Check if company already exists
    const { data: existing, error: checkError } = await supabase
      .from('qualified_companies')
      .select('company_name')
      .eq('company_name', company.companyName)
      .single()

    if (existing) {
      console.log(`⏭️  Skipping ${company.companyName} (already exists)`)
      skippedCount++
      skipped.push(company.companyName)
      continue
    }

    // Insert new company
    const { data, error } = await supabase.from('qualified_companies').insert({
      company_name: company.companyName,
      location_city: company.location.city,
      location_state: company.location.state,
      employee_count: company.employeeCount,
      employee_count_source: company.employeeCountSource,
      industry: company.industry,
      description: company.description,
      actively_hiring: company.activelyHiring === true || company.activelyHiring === 'true', // Convert string to boolean
      career_page_url: company.careerPageUrl,
      linkedin_url: company.linkedInUrl,
      verification_notes: company.verificationNotes,
      verified_date: new Date().toISOString()
    })

    if (error) {
      console.error(`❌ Failed to insert ${company.companyName}:`, error)
      // This shouldn't happen now since we check first
      skippedCount++
      skipped.push(company.companyName)
    } else {
      console.log(`✅ Inserted ${company.companyName}`)
      successCount++
    }
  }

  console.log(`✅ Successfully inserted ${successCount}/${companies.length} companies`)
  if (skippedCount > 0) {
    console.log(`⏭️  Skipped ${skippedCount} existing companies:`, skipped.slice(0, 5))
  }

  return new Response(
    JSON.stringify({
      message: 'Company identification complete',
      companiesIdentified: companies.length,
      successfullyInserted: successCount,
      failed: skippedCount,
      skipped: skippedCount > 0 ? skipped.slice(0, 10) : undefined
    }),
    {
      status: 200, // Always return 200 now, even if all were skipped
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}
