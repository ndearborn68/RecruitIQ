// Background Training Agent
// Continuously scrapes real employer job postings and learns from them

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
    const { action, batchSize = 50 } = await req.json()

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    if (action === 'start_training') {
      // Start a new training iteration
      return await startTraining(supabase, batchSize)
    } else if (action === 'get_progress') {
      // Get current training progress
      return await getProgress(supabase)
    } else if (action === 'process_batch') {
      // Process a batch of scraped jobs
      return await processBatch(supabase, batchSize)
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
 * Start a new training iteration
 */
async function startTraining(supabase: any, targetJobs: number) {
  console.log(`🎓 Starting training iteration with target: ${targetJobs} jobs`)

  // Create training progress record
  const { data: progress, error } = await supabase
    .from('training_progress')
    .insert({
      total_jobs_target: targetJobs,
      status: 'running'
    })
    .select()
    .single()

  if (error) throw error

  // Trigger job scraping via Anthropic API
  const scrapedJobs = await scrapeEmployerJobs(targetJobs)

  // Store scraped jobs
  for (const job of scrapedJobs) {
    await supabase.from('training_job_postings').insert({
      company_name: job.company,
      job_title: job.title,
      location_city: job.location.city,
      location_state: job.location.state,
      full_description: job.description,
      job_url: job.url,
      source: job.source,
      posted_date: job.postedDate,
      training_iteration: progress.iteration
    })
  }

  // Update progress
  await supabase
    .from('training_progress')
    .update({ jobs_scraped: scrapedJobs.length })
    .eq('id', progress.id)

  return new Response(
    JSON.stringify({
      message: 'Training started',
      iteration: progress.iteration,
      jobsScraped: scrapedJobs.length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

/**
 * Scrape real employer job postings using Anthropic API
 * ONLY from pre-qualified companies with 500-1000 employees
 */
async function scrapeEmployerJobs(targetCount: number) {
  console.log(`🔍 Scraping ${targetCount} employer job postings from QUALIFIED companies...`)

  // Get qualified companies from database
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

  const { data: qualifiedCompanies } = await supabase
    .from('qualified_companies')
    .select('*')
    .eq('actively_hiring', true)
    .order('total_jobs_scraped', { ascending: true }) // Prioritize least-scraped companies
    .limit(100)

  if (!qualifiedCompanies || qualifiedCompanies.length === 0) {
    throw new Error('No qualified companies found! Run company-identifier first.')
  }

  console.log(`📋 Using ${qualifiedCompanies.length} pre-qualified companies (500-1000 employees)`)

  // Build company list for prompt
  const companiesByIndustry = {
    Software: qualifiedCompanies.filter(c => c.industry === 'Software'),
    Finance: qualifiedCompanies.filter(c => c.industry === 'Finance'),
    Manufacturing: qualifiedCompanies.filter(c => c.industry === 'Manufacturing'),
    Marketing: qualifiedCompanies.filter(c => c.industry === 'Marketing')
  }

  const prompt = `You are a job posting researcher. Your task is to find ${targetCount} REAL employer job postings from the PRE-QUALIFIED companies listed below.

**CRITICAL: ONLY scrape jobs from these companies (all have 500-1000 employees):**

**CRITICAL: Job Distribution (${targetCount} jobs total):**
- 30% Software Engineering jobs (${Math.floor(targetCount * 0.3)})
- 30% Finance & Accounting jobs (${Math.floor(targetCount * 0.3)})
- 24% Industrial/Manufacturing Engineering jobs (${Math.floor(targetCount * 0.24)})
- 16% Marketing jobs (${Math.floor(targetCount * 0.16)})

**SOFTWARE ENGINEERING COMPANIES (Select ${Math.floor(targetCount * 0.3)} jobs from these):**
${companiesByIndustry.Software.map(c => `- ${c.company_name} (${c.location_city}, ${c.location_state}): ${c.employee_count} employees - ${c.description}`).join('\n')}

**FINANCE & ACCOUNTING COMPANIES (Select ${Math.floor(targetCount * 0.3)} jobs from these):**
${companiesByIndustry.Finance.map(c => `- ${c.company_name} (${c.location_city}, ${c.location_state}): ${c.employee_count} employees - ${c.description}`).join('\n')}

**MANUFACTURING COMPANIES (Select ${Math.floor(targetCount * 0.24)} jobs from these):**
${companiesByIndustry.Manufacturing.map(c => `- ${c.company_name} (${c.location_city}, ${c.location_state}): ${c.employee_count} employees - ${c.description}`).join('\n')}

**MARKETING COMPANIES (Select ${Math.floor(targetCount * 0.16)} jobs from these):**
${companiesByIndustry.Marketing.map(c => `- ${c.company_name} (${c.location_city}, ${c.location_state}): ${c.employee_count} employees - ${c.description}`).join('\n')}

**JOB ROLES TO TARGET:**
Software: Backend Engineer (Java/Spring), Full Stack (React/Node), DevOps (AWS/K8s), Data Engineer, Mobile, Cloud Architect, ML Engineer, SRE
Finance: Senior Accountant (CPA), Financial Analyst, Controller, Tax Manager (ASC 842, SOX), FP&A, Revenue Accountant (ASC 606), Treasury, Auditor, GL Accountant
Manufacturing: Industrial Engineer (Lean), Manufacturing Engineer (PLCs, Ladder Logic), Process Engineer (Six Sigma), Quality Engineer (ISO 9001), Automation Engineer, Mechanical Engineer (CAD)
Marketing: Marketing Manager (B2B SaaS), Digital Marketing (SEO/SEM), Content Marketing, Product Marketing, Brand Manager, Marketing Analytics

**Requirements:**
1. ONLY DIRECT employer postings (NO staffing agencies!)
2. Medium-sized companies (100-5000 employees)
3. Mix of small towns, mid-sized cities, major metros
4. Include FULL job descriptions with exact language from employer sites
5. MUST follow the distribution above exactly

**For each job, provide:**
{
  "company": "Company Name",
  "title": "Job Title",
  "location": {"city": "City", "state": "ST"},
  "description": "Full job description with exact language including: responsibilities, requirements, systems/tools mentioned, certifications, specific phrases...",
  "url": "Job posting URL",
  "source": "linkedin|indeed|greenhouse|lever|company_site",
  "postedDate": "2025-10-20",
  "industry": "Software|Finance|Manufacturing|Marketing",
  "companySize": 500
}

Use web search to find real, active job postings. Copy the EXACT language from employer job descriptions.

Return JSON array of exactly ${targetCount} jobs matching the distribution above.`

  // Call Anthropic API with web search
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

  const data = await response.json()
  const content = data.content[0].text

  // Parse JSON from response
  const jsonMatch = content.match(/\[[\s\S]*\]/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }

  return []
}

/**
 * Process a batch of scraped jobs to extract intelligence
 */
async function processBatch(supabase: any, batchSize: number) {
  console.log(`⚙️ Processing batch of ${batchSize} jobs...`)

  // Get unprocessed jobs
  const { data: jobs, error } = await supabase
    .from('training_job_postings')
    .select('*')
    .eq('processed', false)
    .limit(batchSize)

  if (error) throw error
  if (!jobs || jobs.length === 0) {
    return new Response(
      JSON.stringify({ message: 'No jobs to process' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  let processed = 0
  for (const job of jobs) {
    try {
      // Extract intelligence from this job
      const intelligence = await extractIntelligence(job)

      // Update company intelligence
      await updateCompanyIntelligence(supabase, job.company_name, intelligence)

      // Update phrase intelligence
      await updatePhraseIntelligence(supabase, intelligence.phrases)

      // Update location intelligence
      await updateLocationIntelligence(supabase, job.location_city, job.location_state, job.company_name, intelligence.industry)

      // Mark job as processed
      await supabase
        .from('training_job_postings')
        .update({
          processed: true,
          extracted_phrases: intelligence.phrases,
          hris_systems: intelligence.hrisSystems,
          tech_stack: intelligence.techStack,
          unique_terms: intelligence.uniqueTerms
        })
        .eq('id', job.id)

      processed++
    } catch (error) {
      console.error(`Failed to process job ${job.id}:`, error)
    }
  }

  return new Response(
    JSON.stringify({
      message: 'Batch processed',
      processed,
      total: jobs.length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

/**
 * Extract intelligence from a job posting using AI
 */
async function extractIntelligence(job: any) {
  const prompt = `Analyze this job posting and extract intelligence signals:

**Company:** ${job.company_name}
**Title:** ${job.job_title}
**Location:** ${job.location_city}, ${job.location_state}
**Description:**
${job.full_description}

Extract:
1. **Unique phrases** (3-10 words) that are distinctive/uncommon
2. **HRIS/ATS systems** mentioned (Workday, NetSuite, etc.)
3. **Tech stack** (programming languages, frameworks, tools)
4. **Certifications** required
5. **Unique terminology** specific to this industry/company
6. **Exact metrics** (team sizes, volumes, numbers)

Return JSON:
{
  "phrases": ["phrase 1", "phrase 2", ...],
  "hrisSystems": ["Workday"],
  "techStack": ["Java", "Spring Boot"],
  "certifications": ["CPA"],
  "uniqueTerms": ["ladder logic programming"],
  "metrics": ["35-70 interviews per week"],
  "industry": "Manufacturing|Tech|Healthcare|Finance|Other"
}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await response.json()
  const content = data.content[0].text

  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }

  return { phrases: [], hrisSystems: [], techStack: [], uniqueTerms: [], metrics: [] }
}

/**
 * Update company intelligence database
 */
async function updateCompanyIntelligence(supabase: any, companyName: string, intelligence: any) {
  // Check if company exists
  const { data: existing } = await supabase
    .from('company_intelligence')
    .select('*')
    .eq('company_name', companyName)
    .single()

  if (existing) {
    // Update existing
    await supabase
      .from('company_intelligence')
      .update({
        signature_phrases: [...new Set([...existing.signature_phrases, ...intelligence.phrases])],
        hris_systems: [...new Set([...existing.hris_systems, ...intelligence.hrisSystems])],
        common_tech_stack: [...new Set([...existing.common_tech_stack, ...intelligence.techStack])],
        total_jobs_analyzed: existing.total_jobs_analyzed + 1,
        updated_at: new Date().toISOString()
      })
      .eq('company_name', companyName)
  } else {
    // Insert new
    await supabase
      .from('company_intelligence')
      .insert({
        company_name: companyName,
        signature_phrases: intelligence.phrases,
        hris_systems: intelligence.hrisSystems,
        common_tech_stack: intelligence.techStack,
        total_jobs_analyzed: 1
      })
  }
}

/**
 * Update phrase intelligence
 */
async function updatePhraseIntelligence(supabase: any, phrases: string[]) {
  for (const phrase of phrases) {
    const { data: existing } = await supabase
      .from('phrase_intelligence')
      .select('*')
      .eq('phrase', phrase)
      .single()

    if (existing) {
      await supabase
        .from('phrase_intelligence')
        .update({
          total_occurrences: existing.total_occurrences + 1,
          updated_at: new Date().toISOString()
        })
        .eq('phrase', phrase)
    } else {
      await supabase
        .from('phrase_intelligence')
        .insert({
          phrase,
          phrase_length: phrase.split(/\s+/).length,
          total_occurrences: 1,
          uniqueness_score: 5.0 // Default, will be calculated later
        })
    }
  }
}

/**
 * Update location intelligence
 */
async function updateLocationIntelligence(supabase: any, city: string, state: string, company: string, industry: string) {
  const { data: existing } = await supabase
    .from('location_intelligence')
    .select('*')
    .eq('city', city)
    .eq('state', state)
    .single()

  if (existing) {
    await supabase
      .from('location_intelligence')
      .update({
        major_employers: [...new Set([...existing.major_employers, company])],
        total_jobs_analyzed: existing.total_jobs_analyzed + 1,
        last_updated: new Date().toISOString()
      })
      .eq('city', city)
      .eq('state', state)
  } else {
    await supabase
      .from('location_intelligence')
      .insert({
        city,
        state,
        major_employers: [company],
        primary_industries: [industry],
        total_jobs_analyzed: 1
      })
  }
}

/**
 * Get training progress
 */
async function getProgress(supabase: any) {
  const { data: latestProgress } = await supabase
    .from('training_progress')
    .select('*')
    .order('iteration', { ascending: false })
    .limit(1)
    .single()

  const { data: companiesCount } = await supabase
    .from('company_intelligence')
    .select('id', { count: 'exact' })

  const { data: phrasesCount } = await supabase
    .from('phrase_intelligence')
    .select('id', { count: 'exact' })

  const { data: locationsCount } = await supabase
    .from('location_intelligence')
    .select('id', { count: 'exact' })

  return new Response(
    JSON.stringify({
      progress: latestProgress,
      stats: {
        companiesDiscovered: companiesCount?.length || 0,
        uniquePhrases: phrasesCount?.length || 0,
        locationsAnalyzed: locationsCount?.length || 0
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
