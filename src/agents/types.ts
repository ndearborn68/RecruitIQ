// Shared types for all agents

export interface JobData {
  jobTitle: string
  location: {
    city: string
    state: string
    address?: string
    zipCode?: string
    neighborhood?: string
  }
  salary?: {
    min?: number
    max?: number
    currency?: string
    type?: 'hourly' | 'annual'
  }
  techStack: string[]
  requirements: {
    yearsExperience?: string
    education?: string
    certifications: string[]
    skills: string[]
  }
  description: string
  companyClues: string[]
  uniqueIdentifiers: string[]
  rawText: string
}

export interface SearchResult {
  jobUrl: string
  company: string
  jobTitle: string
  location: string
  description: string
  salary?: string
  techStack: string[]
  postedDate?: string
  source: string // 'linkedin', 'indeed', 'company-site', etc.
}

export interface MatchResult {
  company: string
  jobUrl: string
  matchScore: number
  locationScore: number
  techStackScore: number
  descriptionSimilarity: number
  salaryScore: number
  timelineScore: number
  uniqueMatchScore: number
  reasoning: MatchReasoning[]
}

export interface MatchReasoning {
  category: string
  score: number
  details: string
}

export interface AnalysisResult {
  identifiedClient: string | null
  confidence: number
  matchPercentage: number
  reasoning: MatchReasoning[]
  matchedJobUrl: string | null
  competitorUrl: string
  analysisDate: string
  allMatches: MatchResult[]
}

export interface ProgressCallback {
  (stage: string, percentage: number): void
}
