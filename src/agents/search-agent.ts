// Search Agent: Searches the web for matching job postings
// Uses deep research and web search capabilities

import type { JobData, SearchResult } from './types'

export class SearchAgent {
  /**
   * Search for matching jobs based on extracted job data
   * This method will delegate to a Task agent for deep web research
   */
  async search(jobData: JobData): Promise<SearchResult[]> {
    console.log('🔍 Search Agent: Starting deep web search for matching jobs...')

    // Return a flag indicating real search is needed
    // The orchestrator will handle the actual Task agent invocation
    return []
  }

  /**
   * Build search queries for the Task agent
   */
  buildSearchQueries(jobData: JobData): string[] {
    const queries: string[] = []
    const { jobTitle, location, salary, techStack, uniqueIdentifiers, companyClues } = jobData

    const hasLocation = location.city && location.state
    const locationStr = hasLocation ? `"${location.city}, ${location.state}"` : ''

    // PRIORITY 1: Unique identifiers (MOST IMPORTANT - these are fingerprints!)
    if (uniqueIdentifiers.length > 0) {
      // Query 1: Full unique phrase + location + job title
      const technicalPhrase = uniqueIdentifiers.find(id => id.includes('Technical accounting'))
      if (technicalPhrase && hasLocation) {
        const phrase = technicalPhrase.replace('Technical accounting: ', '')
        queries.push(
          `"${phrase}" "${jobTitle}" ${locationStr} -staffing -agency`
        )
      }

      // Query 2: Software + ASC standard + location
      const software = uniqueIdentifiers.find(id => /Sage|NetSuite|Oracle|SAP/i.test(id))
      const ascStandard = uniqueIdentifiers.find(id => /ASC\s*\d{3,4}/.test(id))
      if (software && ascStandard && hasLocation) {
        queries.push(
          `"${software}" "${ascStandard}" "${jobTitle}" ${locationStr} -agency`
        )
      }

      // Query 3: Multi-site + healthcare/industry + location
      const multiSite = uniqueIdentifiers.find(id => id.includes('multi-site'))
      const healthcare = uniqueIdentifiers.find(id => /healthcare|dermatology|medical/i.test(id))
      if (multiSite && healthcare && hasLocation) {
        queries.push(
          `"${multiSite}" "${healthcare}" "${jobTitle}" ${locationStr}`
        )
      }

      // Query 4: Each unique identifier individually (high value!)
      for (const identifier of uniqueIdentifiers.slice(0, 2)) {
        queries.push(
          `"${identifier}" ${locationStr} "${jobTitle}" -agency`
        )
      }
    }

    // PRIORITY 2: Job Title + Location + Salary
    if (salary && salary.min && salary.max && hasLocation) {
      const salaryRange = `$${Math.floor(salary.min / 1000)}k-$${Math.floor(salary.max / 1000)}k`
      queries.push(
        `"${jobTitle}" ${locationStr} salary ${salaryRange} -staffing -agency site:linkedin.com OR site:indeed.com`
      )
    }

    // PRIORITY 3: Company career pages
    if (hasLocation) {
      queries.push(
        `"${jobTitle}" ${locationStr} site:greenhouse.io OR site:lever.co OR site:talentify.io OR site:workday.com OR site:*/careers -agency`
      )
    }

    // PRIORITY 4: Industry + Location
    if (companyClues.length > 0 && hasLocation) {
      const industryHint = companyClues[0]
      queries.push(
        `"${jobTitle}" "${industryHint}" ${locationStr} -staffing -agency site:linkedin.com OR site:glassdoor.com`
      )
    }

    return queries.filter(q => q.trim().length > 10) // Remove empty queries
  }

  /**
   * Parse search results and extract job information
   */
  parseSearchResults(searchData: string): SearchResult[] {
    const results: SearchResult[] = []

    // This will be populated by the orchestrator with real search data
    // For now, return empty to signal that Task agent is needed

    return results
  }

  private deduplicateResults(results: SearchResult[]): SearchResult[] {
    const seen = new Set<string>()
    return results.filter(result => {
      const key = `${result.company}-${result.jobTitle}-${result.location}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }
}
