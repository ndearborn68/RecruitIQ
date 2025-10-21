// Supabase Edge Function for Real Web Search
// This function performs web searches using SerpAPI and returns job posting results

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchRequest {
  query: string
  jobData?: {
    jobTitle?: string
    location?: {
      city: string
      state: string
    }
  }
}

interface SearchResult {
  jobUrl: string
  company: string
  jobTitle: string
  location: string
  description: string
  salary?: string
  techStack: string[]
  postedDate: string
  source: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, jobData }: SearchRequest = await req.json()

    console.log('🔍 Edge Function: Searching for:', query)

    // Get SerpAPI key from environment
    const serpApiKey = Deno.env.get('SERP_API_KEY')
    if (!serpApiKey) {
      throw new Error('SERP_API_KEY not configured in Supabase secrets')
    }

    // Make request to SerpAPI
    const serpUrl = new URL('https://serpapi.com/search.json')
    serpUrl.searchParams.set('q', query)
    serpUrl.searchParams.set('api_key', serpApiKey)
    serpUrl.searchParams.set('engine', 'google')
    serpUrl.searchParams.set('num', '10')
    serpUrl.searchParams.set('gl', 'us') // US results
    serpUrl.searchParams.set('hl', 'en') // English

    const response = await fetch(serpUrl.toString())

    if (!response.ok) {
      throw new Error(`SerpAPI error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Parse results and extract job postings
    const results: SearchResult[] = parseSearchResults(data, jobData)

    console.log(`✅ Found ${results.length} job postings from search`)

    return new Response(
      JSON.stringify({ results, totalResults: data.search_information?.total_results || 0 }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('❌ Search error:', error)
    return new Response(
      JSON.stringify({ error: error.message, results: [] }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 with empty results so app doesn't break
      },
    )
  }
})

function parseSearchResults(serpData: any, jobData: any): SearchResult[] {
  const results: SearchResult[] = []

  // Parse organic results
  if (serpData.organic_results && Array.isArray(serpData.organic_results)) {
    for (const item of serpData.organic_results) {
      // Look for job-related links
      const isJobPosting =
        item.link.includes('careers') ||
        item.link.includes('jobs') ||
        item.link.includes('greenhouse') ||
        item.link.includes('lever') ||
        item.link.includes('workday') ||
        item.link.includes('talentify') ||
        item.link.includes('linkedin.com/jobs') ||
        item.link.includes('indeed.com') ||
        item.link.includes('glassdoor.com')

      if (isJobPosting && item.link && item.title && item.snippet) {
        results.push({
          jobUrl: item.link,
          company: extractCompanyName(item.link, item.title, item.snippet),
          jobTitle: cleanJobTitle(item.title),
          location: extractLocation(item.snippet, jobData?.location),
          description: item.snippet || '',
          salary: extractSalary(item.snippet),
          techStack: extractTechStack(item.snippet),
          postedDate: extractPostedDate(item.snippet),
          source: extractSource(item.link)
        })
      }
    }
  }

  return results
}

function extractCompanyName(url: string, title: string, snippet: string): string {
  // Try to extract company from various sources

  // 1. From domain name
  try {
    const domain = new URL(url).hostname.replace('www.', '')

    // Special cases for known job boards
    if (domain.includes('greenhouse.io')) {
      const match = url.match(/\/ghs\/app\/([^\/]+)/)
      if (match) return formatCompanyName(match[1])
    }
    if (domain.includes('lever.co')) {
      const match = url.match(/jobs\.lever\.co\/([^\/]+)/)
      if (match) return formatCompanyName(match[1])
    }
    if (domain.includes('talentify.io')) {
      const companyMatch = snippet.match(/at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*?)(?:\s+–|\s+-|,)/i)
      if (companyMatch) return companyMatch[1].trim()
    }

    // Extract from main domain
    const parts = domain.split('.')
    const companyPart = parts.length > 2 ? parts[parts.length - 2] : parts[0]
    return formatCompanyName(companyPart)
  } catch (e) {
    // Fallback to title parsing
    const titleParts = title.split('-')
    if (titleParts.length > 1) {
      return titleParts[titleParts.length - 1].trim()
    }
    return 'Unknown Company'
  }
}

function formatCompanyName(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function cleanJobTitle(title: string): string {
  // Remove common suffixes like company names
  const cleaned = title
    .replace(/\s*[-–|]\s*[^-–|]*$/, '') // Remove "- Company Name" at end
    .replace(/\s*at\s+.*$/i, '') // Remove "at Company"
    .trim()

  return cleaned || title
}

function extractLocation(snippet: string, defaultLocation?: any): string {
  // Try to extract location from snippet
  const patterns = [
    /(?:in|at|location:)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})\b/i,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})\b/
  ]

  for (const pattern of patterns) {
    const match = snippet.match(pattern)
    if (match) {
      return `${match[1]}, ${match[2]}`
    }
  }

  // Use default location if provided
  if (defaultLocation?.city && defaultLocation?.state) {
    return `${defaultLocation.city}, ${defaultLocation.state}`
  }

  return 'Location Not Specified'
}

function extractSalary(snippet: string): string | undefined {
  // Look for salary patterns
  const patterns = [
    /\$\s*(\d{1,3})k\s*[-–to]+\s*\$?\s*(\d{1,3})k/i,
    /\$\s*(\d{1,3}(?:,\d{3})+)\s*[-–to]+\s*\$?\s*(\d{1,3}(?:,\d{3})+)/
  ]

  for (const pattern of patterns) {
    const match = snippet.match(pattern)
    if (match) {
      return `$${match[1]}-$${match[2]}`
    }
  }

  return undefined
}

function extractTechStack(snippet: string): string[] {
  const techKeywords = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Java',
    'C++', 'Go', 'Rust', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST',
    'Sage Intacct', 'NetSuite', 'Oracle', 'SAP', 'Workday'
  ]

  const found: string[] = []
  const lowerSnippet = snippet.toLowerCase()

  for (const tech of techKeywords) {
    if (lowerSnippet.includes(tech.toLowerCase())) {
      found.push(tech)
    }
  }

  return found
}

function extractPostedDate(snippet: string): string {
  // Try to extract posting date
  const patterns = [
    /(\d{1,2})\s+days?\s+ago/i,
    /(\d{1,2})\s+hours?\s+ago/i,
    /posted\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/i
  ]

  for (const pattern of patterns) {
    const match = snippet.match(pattern)
    if (match) {
      if (match[0].includes('days ago')) {
        const daysAgo = parseInt(match[1])
        const date = new Date()
        date.setDate(date.getDate() - daysAgo)
        return date.toISOString()
      }
      if (match[0].includes('hours ago')) {
        const hoursAgo = parseInt(match[1])
        const date = new Date()
        date.setHours(date.getHours() - hoursAgo)
        return date.toISOString()
      }
    }
  }

  // Default to recent date
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 14))
  return date.toISOString()
}

function extractSource(url: string): string {
  if (url.includes('linkedin')) return 'linkedin'
  if (url.includes('indeed')) return 'indeed'
  if (url.includes('glassdoor')) return 'glassdoor'
  if (url.includes('greenhouse')) return 'greenhouse'
  if (url.includes('lever')) return 'lever'
  if (url.includes('workday')) return 'workday'
  if (url.includes('talentify')) return 'talentify'
  return 'company-careers'
}
