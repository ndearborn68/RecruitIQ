// Parser Agent: Extracts structured data from job descriptions

import type { JobData } from './types'

export class ParserAgent {
  /**
   * Parse a job description and extract structured data
   */
  async parse(jobDescription: string): Promise<JobData> {
    console.log('🔍 Parser Agent: Starting job description analysis...')

    // Extract job title (usually first line or has common patterns)
    const jobTitle = this.extractJobTitle(jobDescription)

    // Extract location
    const location = this.extractLocation(jobDescription)

    // Extract salary
    const salary = this.extractSalary(jobDescription)

    // Extract technology stack
    const techStack = this.extractTechStack(jobDescription)

    // Extract requirements
    const requirements = this.extractRequirements(jobDescription)

    // Extract company clues
    const companyClues = this.extractCompanyClues(jobDescription)

    // Extract unique identifiers
    const uniqueIdentifiers = this.extractUniqueIdentifiers(jobDescription)

    const result: JobData = {
      jobTitle,
      location,
      salary,
      techStack,
      requirements,
      description: jobDescription,
      companyClues,
      uniqueIdentifiers,
      rawText: jobDescription
    }

    console.log('✅ Parser Agent: Extraction complete', result)
    return result
  }

  private extractJobTitle(text: string): string {
    // Pattern 1: Look for "looking for/seeking/hiring a/an [TITLE]"
    const hiringPattern = /(?:looking for|seeking|hiring)\s+(?:a|an)\s+([^,\n]{5,80}?(?:accountant|engineer|developer|architect|manager|analyst|director|lead|specialist|coordinator|designer|administrator))/im
    const hiringMatch = text.match(hiringPattern)
    if (hiringMatch) {
      return hiringMatch[1].trim()
    }

    // Pattern 2: Explicit labels "Job Title:" or "Position:" or "Role:"
    const labelPattern = /(?:job title|position|role):\s*([^\n]+)/i
    const labelMatch = text.match(labelPattern)
    if (labelMatch) {
      return labelMatch[1].trim()
    }

    // Pattern 3: Look for standalone job titles (Senior/Junior + role)
    const standalonePattern = /\b((?:senior|junior|staff|principal|lead|head)\s+(?:accountant|engineer|developer|architect|manager|analyst|director|specialist|coordinator|designer|administrator))\b/im
    const standaloneMatch = text.match(standalonePattern)
    if (standaloneMatch) {
      return standaloneMatch[1].trim()
    }

    // Pattern 4: First line starts with a job title keyword
    const firstLine = text.split('\n')[0].trim()
    if (/^(senior|junior|staff|principal|lead|head|accountant|engineer|developer|architect|manager|analyst|director)/i.test(firstLine) && firstLine.length < 100) {
      return firstLine
    }

    return 'Position Not Specified'
  }

  private extractLocation(text: string): JobData['location'] {
    const location: JobData['location'] = {
      city: '',
      state: ''
    }

    // Pattern 1: Explicit location labels
    const labelPattern = /(?:location|based in|located in|office):\s*([^,\n]+),\s*([A-Z]{2})/i
    const labelMatch = text.match(labelPattern)

    if (labelMatch) {
      location.city = labelMatch[1].trim()
      location.state = labelMatch[2].trim()
    } else {
      // Pattern 2: City, ST anywhere in text (common format)
      const cityStatePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),\s*([A-Z]{2})\b/g
      const matches = Array.from(text.matchAll(cityStatePattern))

      // Use the last match (often at bottom of job posting)
      if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1]
        location.city = lastMatch[1].trim()
        location.state = lastMatch[2].trim()
      }
    }

    // Extract address
    const addressPattern = /(\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln))/i
    const addressMatch = text.match(addressPattern)
    if (addressMatch) {
      location.address = addressMatch[1].trim()
    }

    // Extract ZIP code
    const zipPattern = /\b(\d{5}(?:-\d{4})?)\b/
    const zipMatch = text.match(zipPattern)
    if (zipMatch) {
      location.zipCode = zipMatch[1]
    }

    return location
  }

  private extractSalary(text: string): JobData['salary'] | undefined {
    // Pattern 1: $XXXk-$XXXk format
    const kPattern = /\$(\d{1,3})k\s*[-–to]+\s*\$(\d{1,3})k/i
    const kMatch = text.match(kPattern)

    if (kMatch) {
      return {
        min: parseInt(kMatch[1]) * 1000,
        max: parseInt(kMatch[2]) * 1000,
        currency: 'USD',
        type: 'annual'
      }
    }

    // Pattern 2: $XXX,XXX-$XXX,XXX format
    const commaPattern = /\$\s*(\d{1,3}(?:,\d{3})+)\s*[-–to]+\s*\$\s*(\d{1,3}(?:,\d{3})+)/
    const commaMatch = text.match(commaPattern)

    if (commaMatch) {
      const parseAmount = (str: string): number => {
        return parseInt(str.replace(/,/g, ''))
      }

      return {
        min: parseAmount(commaMatch[1]),
        max: parseAmount(commaMatch[2]),
        currency: 'USD',
        type: 'annual'
      }
    }

    return undefined
  }

  private extractTechStack(text: string): string[] {
    const commonTech = [
      'Java', 'JavaScript', 'Python', 'TypeScript', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'PHP', 'Swift', 'Kotlin',
      'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Spring Boot',
      'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab', 'GitHub Actions',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB',
      'Kafka', 'RabbitMQ', 'GraphQL', 'REST', 'Microservices', 'Terraform', 'Ansible'
    ]

    const found = new Set<string>()
    const lowerText = text.toLowerCase()

    for (const tech of commonTech) {
      // Case-insensitive search with word boundaries
      const regex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      if (regex.test(text)) {
        found.add(tech)
      }
    }

    return Array.from(found)
  }

  private extractRequirements(text: string): JobData['requirements'] {
    const requirements: JobData['requirements'] = {
      certifications: [],
      skills: []
    }

    // Years of experience
    const expPattern = /(\d+)\+?\s*years?\s+(?:of\s+)?experience/i
    const expMatch = text.match(expPattern)
    if (expMatch) {
      requirements.yearsExperience = expMatch[1] + '+ years'
    }

    // Education
    const eduPattern = /(bachelor'?s?|master'?s?|phd|doctorate|degree)/i
    const eduMatch = text.match(eduPattern)
    if (eduMatch) {
      requirements.education = eduMatch[1]
    }

    // Certifications
    const certPatterns = ['AWS Certified', 'Azure Certified', 'GCP Certified', 'PMP', 'CISSP', 'CPA', 'CFA']
    for (const cert of certPatterns) {
      if (text.toLowerCase().includes(cert.toLowerCase())) {
        requirements.certifications.push(cert)
      }
    }

    return requirements
  }

  private extractCompanyClues(text: string): string[] {
    const clues: string[] = []

    // Industry hints
    const industries = ['financial services', 'fintech', 'healthcare', 'e-commerce', 'saas', 'enterprise', 'startup']
    for (const industry of industries) {
      if (text.toLowerCase().includes(industry)) {
        clues.push(`Industry: ${industry}`)
      }
    }

    // Company size
    const sizePattern = /(\d+\+?)\s*employees/i
    const sizeMatch = text.match(sizePattern)
    if (sizeMatch) {
      clues.push(`Company size: ${sizeMatch[1]} employees`)
    }

    // Fortune 500
    if (/fortune\s*500/i.test(text)) {
      clues.push('Fortune 500 company')
    }

    return clues
  }

  private extractUniqueIdentifiers(text: string): string[] {
    const identifiers: string[] = []

    console.log('🔍 Starting ADVANCED unique identifier extraction...')

    // ============================================
    // TIER 1: CRITICAL HIGH-VALUE SIGNALS
    // ============================================

    // 1. HRIS/ATS Systems (CRITICAL - like Workday for Disney)
    const hrisPattern = /(Workday|Sage Intacct|NetSuite|Oracle HCM|SAP SuccessFactors|ADP Workforce|UltiPro|BambooHR|Greenhouse|Lever|iCIMS|Taleo|Jobvite|SmartRecruiters|SuccessFactors|PeopleSoft)/gi
    const hrisMatches = text.match(hrisPattern)
    if (hrisMatches) {
      hrisMatches.forEach(system => {
        identifiers.push(`🎯 TIER-1: HRIS/ATS System: ${system}`)
        console.log(`🔥 CRITICAL SIGNAL: ${system} system detected`)
      })
    }

    // 2. Exact Numerical Metrics (CRITICAL - like "35-70 per week" for Disney)
    const exactMetrics = this.extractExactMetrics(text)
    exactMetrics.forEach(metric => {
      identifiers.push(`🎯 TIER-1: Exact Metric: ${metric}`)
      console.log(`🔥 CRITICAL SIGNAL: Exact metric detected: ${metric}`)
    })

    // 3. State-Specific or Geographic Requirements (CRITICAL)
    const geoRequirements = this.extractGeographicRequirements(text)
    geoRequirements.forEach(req => {
      identifiers.push(`🎯 TIER-1: Geographic Requirement: ${req}`)
      console.log(`🔥 CRITICAL SIGNAL: Geographic requirement detected: ${req}`)
    })

    // ============================================
    // TIER 2: EXACT PHRASE EXTRACTION (N-GRAMS)
    // ============================================

    // Extract unique 3-5 word phrases that appear in parentheses or quotes
    const exactPhrases = this.extractExactPhrases(text)
    exactPhrases.forEach(phrase => {
      identifiers.push(`📝 TIER-2: Exact Phrase: "${phrase}"`)
      console.log(`📝 Exact phrase captured: "${phrase}"`)
    })

    // ============================================
    // TIER 3: VERTICAL-SPECIFIC TERMINOLOGY
    // ============================================

    // Industry-specific jargon and terminology
    const verticalTerms = this.extractVerticalSpecificTerms(text)
    verticalTerms.forEach(term => {
      identifiers.push(`🏢 TIER-3: Vertical Term: ${term}`)
    })

    // ============================================
    // TIER 4: LOCATION-SPECIFIC SKILLS/TOOLS
    // ============================================

    // Extract location + tool/skill combinations
    const locationTools = this.extractLocationSpecificSkills(text)
    locationTools.forEach(combo => {
      identifiers.push(`📍 TIER-4: Location-Specific: ${combo}`)
    })

    // ============================================
    // TIER 5: UNCOMMON WORD COMBINATIONS
    // ============================================

    // Find rare/uncommon word combinations (3-4 word phrases)
    const uncommonPhrases = this.extractUncommonCombinations(text)
    uncommonPhrases.forEach(phrase => {
      identifiers.push(`💎 TIER-5: Rare Phrase: "${phrase}"`)
    })

    // ============================================
    // TIER 6: TECHNICAL/COMPLIANCE REQUIREMENTS
    // ============================================

    // Standards, compliance, certifications
    const complianceTerms = this.extractComplianceTerms(text)
    complianceTerms.forEach(term => {
      identifiers.push(`⚖️ TIER-6: Compliance: ${term}`)
    })

    // ============================================
    // TIER 7: PROPRIETARY TOOLS/PROCESSES
    // ============================================

    // Company-specific tools or internal processes
    const proprietaryTools = this.extractProprietaryTools(text)
    proprietaryTools.forEach(tool => {
      identifiers.push(`🔧 TIER-7: Proprietary Tool: ${tool}`)
    })

    console.log(`✅ Advanced extraction complete: ${identifiers.length} unique identifiers found`)
    console.log(`   - Tier 1 (Critical): ${identifiers.filter(i => i.includes('TIER-1')).length}`)
    console.log(`   - Tier 2 (Exact Phrases): ${identifiers.filter(i => i.includes('TIER-2')).length}`)
    console.log(`   - Tier 3 (Vertical): ${identifiers.filter(i => i.includes('TIER-3')).length}`)
    console.log(`   - Tier 4 (Location): ${identifiers.filter(i => i.includes('TIER-4')).length}`)
    console.log(`   - Tier 5 (Rare): ${identifiers.filter(i => i.includes('TIER-5')).length}`)
    console.log(`   - Tier 6 (Compliance): ${identifiers.filter(i => i.includes('TIER-6')).length}`)
    console.log(`   - Tier 7 (Proprietary): ${identifiers.filter(i => i.includes('TIER-7')).length}`)

    return identifiers
  }

  /**
   * Extract exact numerical metrics (volumes, ranges, specific numbers)
   */
  private extractExactMetrics(text: string): string[] {
    const metrics: string[] = []

    // Interview volumes
    const interviewPattern = /(\d+)\s*[-–to]+\s*(\d+)\s*(?:interviews?|candidates?|screens?)\s+(?:per\s+)?(?:week|day|month)/gi
    let match
    while ((match = interviewPattern.exec(text)) !== null) {
      metrics.push(`${match[1]}-${match[2]} ${match[3] || 'interviews'} per ${match[4] || 'week'}`)
    }

    // Team sizes with specific numbers
    const teamPattern = /(?:team of|supporting|managing)\s+(\d+)\s+(?:recruiters?|people|members|employees|staff)/gi
    while ((match = teamPattern.exec(text)) !== null) {
      metrics.push(`team of ${match[1]} ${match[2]}`)
    }

    // Specific time commitments
    const timePattern = /(\d+)\s*[-–to]+\s*(\d+)\s+(?:hours?|days?)\s+(?:per\s+)?(?:week|month)/gi
    while ((match = timePattern.exec(text)) !== null) {
      metrics.push(`${match[1]}-${match[2]} hours per ${match[3] || 'week'}`)
    }

    return metrics
  }

  /**
   * Extract geographic-specific requirements
   */
  private extractGeographicRequirements(text: string): string[] {
    const requirements: string[] = []

    // State-specific background checks
    const bgPattern = /(fingerprint\s+(?:scheduling|check|clearance)|background\s+check|security\s+clearance)(?:\s+(?:for|in))?\s+([A-Z][a-z]+)\s+(?:backgrounds?|states?|locations?)/gi
    let match
    while ((match = bgPattern.exec(text)) !== null) {
      requirements.push(`${match[1]} for ${match[2]}`)
    }

    // Multi-state operations
    const multiStatePattern = /(?:operations|offices|locations|sites)\s+in\s+([A-Z][a-z]+(?:\s+and\s+[A-Z][a-z]+)*)/gi
    while ((match = multiStatePattern.exec(text)) !== null) {
      requirements.push(`operations in ${match[1]}`)
    }

    // Specific office locations with addresses
    const officePattern = /(?:office|campus|headquarters)\s+(?:in|at|located)\s+([^,.\n]{10,50})/gi
    while ((match = officePattern.exec(text)) !== null) {
      requirements.push(`office location: ${match[1].trim()}`)
    }

    return requirements
  }

  /**
   * Extract exact phrases from parentheses, quotes, or "e.g." examples
   */
  private extractExactPhrases(text: string): string[] {
    const phrases: string[] = []

    // Phrases in parentheses with "e.g."
    const egPattern = /\(e\.g\.?\s*([^)]{10,100})\)/gi
    let match
    while ((match = egPattern.exec(text)) !== null) {
      phrases.push(match[1].trim())
    }

    // Quoted phrases (3+ words)
    const quotePattern = /"([^"]{15,100})"/g
    while ((match = quotePattern.exec(text)) !== null) {
      if (match[1].split(/\s+/).length >= 3) {
        phrases.push(match[1].trim())
      }
    }

    // Phrases in parentheses (without e.g.)
    const parenPattern = /\(([^)]{20,100})\)/gi
    while ((match = parenPattern.exec(text)) !== null) {
      const content = match[1].trim()
      if (!content.startsWith('e.g.') && content.split(/\s+/).length >= 3) {
        phrases.push(content)
      }
    }

    return phrases
  }

  /**
   * Extract vertical/industry-specific terminology
   */
  private extractVerticalSpecificTerms(text: string): string[] {
    const terms: string[] = []

    // Accounting/Finance specific
    const accountingPattern = /\b(ASC\s+\d{3,4}|GAAP|IFRS|SOX compliance|business combinations|consolidations|treasury operations|intercompany reconciliations?|GL accounting|month-end close|financial reporting|audit preparation)\b/gi
    let match
    while ((match = accountingPattern.exec(text)) !== null) {
      terms.push(`Accounting: ${match[0]}`)
    }

    // Healthcare specific
    const healthcarePattern = /\b(HIPAA|EMR|EHR|patient care|clinical operations|medical billing|ICD-10|CPT codes|dermatology|multi-clinic|healthcare network)\b/gi
    while ((match = healthcarePattern.exec(text)) !== null) {
      terms.push(`Healthcare: ${match[0]}`)
    }

    // Entertainment/Media specific
    const mediaPattern = /\b(content production|post-production|VFX|animation studios?|streaming platform|theatrical release|box office|film distribution|studio operations)\b/gi
    while ((match = mediaPattern.exec(text)) !== null) {
      terms.push(`Media: ${match[0]}`)
    }

    // Tech/SaaS specific
    const techPattern = /\b(CI\/CD|DevOps|microservices|API gateway|container orchestration|service mesh|observability|distributed systems)\b/gi
    while ((match = techPattern.exec(text)) !== null) {
      terms.push(`Tech: ${match[0]}`)
    }

    return terms
  }

  /**
   * Extract location + skill/tool combinations
   */
  private extractLocationSpecificSkills(text: string): string[] {
    const combos: string[] = []

    // Find city/state mentions
    const locations: string[] = []
    const locationPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),\s*([A-Z]{2})\b/g
    let match
    while ((match = locationPattern.exec(text)) !== null) {
      locations.push(`${match[1]}, ${match[2]}`)
    }

    // Look for skills/tools mentioned near locations (within 50 chars)
    locations.forEach(location => {
      const locationIndex = text.indexOf(location)
      if (locationIndex >= 0) {
        const contextStart = Math.max(0, locationIndex - 50)
        const contextEnd = Math.min(text.length, locationIndex + 100)
        const context = text.substring(contextStart, contextEnd)

        // Check for tools/skills in context
        const toolPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]*)*(?:\s+\d+)?)\b/g
        while ((match = toolPattern.exec(context)) !== null) {
          const tool = match[1]
          if (tool.length > 3 && !['The', 'This', 'That', 'With', 'From'].includes(tool)) {
            combos.push(`${tool} in ${location}`)
          }
        }
      }
    })

    return [...new Set(combos)].slice(0, 5) // Dedupe and limit
  }

  /**
   * Extract uncommon word combinations (3-4 word n-grams)
   */
  private extractUncommonCombinations(text: string): string[] {
    const phrases: string[] = []

    // Clean text and split into words
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2)

    // Extract 3-word and 4-word combinations
    for (let i = 0; i < words.length - 3; i++) {
      const trigram = words.slice(i, i + 3).join(' ')
      const fourgram = words.slice(i, i + 4).join(' ')

      // Check if these are uncommon (not generic phrases)
      if (this.isUncommonPhrase(trigram)) {
        phrases.push(trigram)
      }
      if (i < words.length - 4 && this.isUncommonPhrase(fourgram)) {
        phrases.push(fourgram)
      }
    }

    // Return unique phrases, sorted by length (longer = more specific)
    return [...new Set(phrases)]
      .sort((a, b) => b.length - a.length)
      .slice(0, 10) // Top 10 most unique
  }

  /**
   * Check if a phrase is uncommon (not generic job posting language)
   */
  private isUncommonPhrase(phrase: string): boolean {
    // Filter out generic phrases
    const genericPatterns = [
      /^we are looking/,
      /^you will be/,
      /^the ideal candidate/,
      /^this position requires/,
      /^looking for a/,
      /^seeking a candidate/,
      /^must have experience/,
      /^and or equivalent/
    ]

    for (const pattern of genericPatterns) {
      if (pattern.test(phrase)) {
        return false
      }
    }

    // Must contain at least one meaningful word (not all common words)
    const commonWords = ['the', 'and', 'for', 'with', 'you', 'will', 'are', 'have', 'this', 'that', 'from']
    const words = phrase.split(/\s+/)
    const meaningfulWords = words.filter(w => !commonWords.includes(w))

    return meaningfulWords.length >= 2
  }

  /**
   * Extract compliance and regulatory terms
   */
  private extractComplianceTerms(text: string): string[] {
    const terms: string[] = []

    // Regulatory standards
    const regPattern = /\b(SOX|GDPR|CCPA|HIPAA|PCI-DSS|ISO \d{4,5}|SOC \d|FISMA|ITAR|EAR)\b/gi
    let match
    while ((match = regPattern.exec(text)) !== null) {
      terms.push(match[0])
    }

    // Certifications with context
    const certPattern = /\b(CPA|CFA|CIA|CISA|CISSP|PMP|AWS Certified|Azure Certified|Google Cloud Certified|Certified ScrumMaster)\b/gi
    while ((match = certPattern.exec(text)) !== null) {
      terms.push(match[0])
    }

    return terms
  }

  /**
   * Extract proprietary or company-specific tools
   */
  private extractProprietaryTools(text: string): string[] {
    const tools: string[] = []

    // Look for capitalized multi-word tool names (likely proprietary)
    const proprietaryPattern = /\b([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:platform|system|tool|software|application|portal)/gi
    let match
    while ((match = proprietaryPattern.exec(text)) !== null) {
      tools.push(match[1])
    }

    // Internal process names (often in quotes or caps)
    const processPattern = /["']([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})["']/g
    while ((match = processPattern.exec(text)) !== null) {
      tools.push(match[1])
    }

    return tools
  }
}
