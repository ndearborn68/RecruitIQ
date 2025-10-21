// Matcher Agent: Compares job descriptions and calculates similarity scores

import type { JobData, SearchResult, MatchResult, MatchReasoning } from './types'

export class MatcherAgent {
  /**
   * Analyze search results and find the best matches
   */
  async match(jobData: JobData, searchResults: SearchResult[]): Promise<MatchResult[]> {
    console.log(`🔍 Matcher Agent: Analyzing ${searchResults.length} candidates...`)

    const matches: MatchResult[] = []

    for (const result of searchResults) {
      const matchResult = this.calculateMatch(jobData, result)
      if (matchResult.matchScore >= 40) { // Only include matches above 40%
        matches.push(matchResult)
      }
    }

    // Sort by match score (highest first)
    matches.sort((a, b) => b.matchScore - a.matchScore)

    console.log(`✅ Matcher Agent: Found ${matches.length} strong matches`)
    return matches
  }

  private calculateMatch(jobData: JobData, searchResult: SearchResult): MatchResult {
    // Calculate individual component scores
    const locationScore = this.calculateLocationScore(jobData, searchResult)
    const techStackScore = this.calculateTechStackScore(jobData, searchResult)
    const descriptionSimilarity = this.calculateDescriptionSimilarity(jobData, searchResult)
    const salaryScore = this.calculateSalaryScore(jobData, searchResult)
    const timelineScore = this.calculateTimelineScore(searchResult)
    const uniqueMatchScore = this.calculateUniqueMatchScore(jobData, searchResult)

    // Weighted average for overall match score
    // PRIORITIZE unique identifiers - they are the strongest signal!
    const matchScore = Math.round(
      uniqueMatchScore * 0.35 +       // HIGHEST - unique phrases are fingerprints
      descriptionSimilarity * 0.25 +  // High text similarity = likely same job
      locationScore * 0.20 +          // Location important but not decisive
      techStackScore * 0.10 +         // Tech stack can vary
      salaryScore * 0.05 +            // Salary ranges often overlap
      timelineScore * 0.05            // Timeline less important
    )

    const reasoning: MatchReasoning[] = []

    if (locationScore > 0) {
      reasoning.push({
        category: 'Location Match',
        score: locationScore,
        details: this.getLocationDetails(jobData, searchResult, locationScore)
      })
    }

    if (techStackScore > 0) {
      reasoning.push({
        category: 'Technology Stack',
        score: techStackScore,
        details: this.getTechStackDetails(jobData, searchResult, techStackScore)
      })
    }

    if (descriptionSimilarity > 0) {
      reasoning.push({
        category: 'Job Description Similarity',
        score: descriptionSimilarity,
        details: this.getDescriptionDetails(descriptionSimilarity)
      })
    }

    if (salaryScore > 0) {
      reasoning.push({
        category: 'Salary Range',
        score: salaryScore,
        details: this.getSalaryDetails(jobData, searchResult, salaryScore)
      })
    }

    if (timelineScore > 0) {
      reasoning.push({
        category: 'Posting Timeline',
        score: timelineScore,
        details: this.getTimelineDetails(searchResult, timelineScore)
      })
    }

    return {
      company: searchResult.company,
      jobUrl: searchResult.jobUrl,
      matchScore,
      locationScore,
      techStackScore,
      descriptionSimilarity,
      salaryScore,
      timelineScore,
      uniqueMatchScore,
      reasoning
    }
  }

  private calculateLocationScore(jobData: JobData, searchResult: SearchResult): number {
    const resultLocationLower = searchResult.location.toLowerCase()
    const jobLocationLower = `${jobData.location.city}, ${jobData.location.state}`.toLowerCase()

    // Exact match
    if (resultLocationLower.includes(jobLocationLower) || jobLocationLower.includes(resultLocationLower)) {
      return 95
    }

    // City match
    if (resultLocationLower.includes(jobData.location.city.toLowerCase())) {
      return 80
    }

    // State match
    if (resultLocationLower.includes(jobData.location.state.toLowerCase())) {
      return 50
    }

    return 0
  }

  private calculateTechStackScore(jobData: JobData, searchResult: SearchResult): number {
    if (jobData.techStack.length === 0 || searchResult.techStack.length === 0) {
      return 0
    }

    const jobTechLower = jobData.techStack.map(t => t.toLowerCase())
    const resultTechLower = searchResult.techStack.map(t => t.toLowerCase())

    const matches = jobTechLower.filter(tech => resultTechLower.includes(tech))
    const matchPercentage = (matches.length / jobTechLower.length) * 100

    return Math.round(matchPercentage)
  }

  private calculateDescriptionSimilarity(jobData: JobData, searchResult: SearchResult): number {
    // Simple word-based similarity
    const jobWords = this.extractWords(jobData.description)
    const resultWords = this.extractWords(searchResult.description)

    const commonWords = jobWords.filter(word => resultWords.includes(word))
    const similarity = (commonWords.length / Math.max(jobWords.length, resultWords.length)) * 100

    return Math.round(similarity)
  }

  private calculateSalaryScore(jobData: JobData, searchResult: SearchResult): number {
    if (!jobData.salary || !searchResult.salary) {
      return 0
    }

    // Extract salary numbers from string
    const salaryMatch = searchResult.salary.match(/\$?(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–to]+\s*\$?(\d{1,3}(?:,\d{3})*(?:k|K)?)/)

    if (!salaryMatch) return 0

    const parseAmount = (str: string): number => {
      const cleaned = str.replace(/,/g, '')
      if (cleaned.toLowerCase().includes('k')) {
        return parseInt(cleaned) * 1000
      }
      return parseInt(cleaned)
    }

    const resultMin = parseAmount(salaryMatch[1])
    const resultMax = parseAmount(salaryMatch[2])

    // Check for overlap
    if (jobData.salary.min && jobData.salary.max) {
      const overlap =
        (Math.min(jobData.salary.max, resultMax) - Math.max(jobData.salary.min, resultMin)) > 0

      if (overlap) {
        // Calculate % overlap
        const overlapAmount = Math.min(jobData.salary.max, resultMax) - Math.max(jobData.salary.min, resultMin)
        const totalRange = Math.max(jobData.salary.max, resultMax) - Math.min(jobData.salary.min, resultMin)
        return Math.round((overlapAmount / totalRange) * 100)
      }
    }

    return 0
  }

  private calculateTimelineScore(searchResult: SearchResult): number {
    if (!searchResult.postedDate) return 50 // Unknown = medium score

    const posted = new Date(searchResult.postedDate)
    const now = new Date()
    const daysAgo = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24))

    if (daysAgo <= 3) return 95
    if (daysAgo <= 7) return 85
    if (daysAgo <= 14) return 75
    if (daysAgo <= 30) return 60
    return 40
  }

  private calculateUniqueMatchScore(jobData: JobData, searchResult: SearchResult): number {
    if (jobData.uniqueIdentifiers.length === 0) return 0

    let matchCount = 0
    const resultTextLower = searchResult.description.toLowerCase()

    for (const identifier of jobData.uniqueIdentifiers) {
      if (resultTextLower.includes(identifier.toLowerCase())) {
        matchCount++
      }
    }

    return Math.round((matchCount / jobData.uniqueIdentifiers.length) * 100)
  }

  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3) // Ignore short words
  }

  private getLocationDetails(jobData: JobData, searchResult: SearchResult, score: number): string {
    if (score >= 90) {
      return `Exact location match: ${searchResult.location}`
    }
    if (score >= 75) {
      return `Same city match: ${jobData.location.city}`
    }
    return `Nearby location: ${searchResult.location}`
  }

  private getTechStackDetails(jobData: JobData, searchResult: SearchResult, score: number): string {
    const matches = jobData.techStack.filter(tech =>
      searchResult.techStack.some(t => t.toLowerCase() === tech.toLowerCase())
    )
    return `${matches.length}/${jobData.techStack.length} technologies match: ${matches.join(', ')}`
  }

  private getDescriptionDetails(score: number): string {
    if (score >= 75) {
      return `${score}% text similarity with original posting. Multiple exact phrase matches found.`
    }
    if (score >= 50) {
      return `${score}% text similarity. Significant keyword overlap detected.`
    }
    return `${score}% text similarity. Some common phrases found.`
  }

  private getSalaryDetails(jobData: JobData, searchResult: SearchResult, score: number): string {
    if (score >= 80) {
      return `Salary range ${searchResult.salary} closely matches expected range`
    }
    return `Partial salary range overlap: ${searchResult.salary}`
  }

  private getTimelineDetails(searchResult: SearchResult, score: number): string {
    if (!searchResult.postedDate) {
      return 'Posting date unknown'
    }
    const posted = new Date(searchResult.postedDate)
    const daysAgo = Math.floor((Date.now() - posted.getTime()) / (1000 * 60 * 60 * 24))
    return `Job posted ${daysAgo} days ago`
  }
}
