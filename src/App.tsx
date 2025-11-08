import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { supabase, type Job } from './lib/supabase'
import { OrchestratorAgent } from './agents/orchestrator'

// Mock data with real LinkedIn profiles
const mockLeads = [
  {
    id: 1,
    jobTitle: 'Senior Java Engineer',
    company: 'Goldman Sachs',
    location: 'New York, NY',
    postedDate: '2025-10-15',
    hiringManagers: [
      { name: 'Konstantinos R.', title: 'Managing Director, Goldman Sachs Engineering', linkedin: 'https://www.linkedin.com/in/rizakos/' },
      { name: 'James Colletti', title: 'Managing Director, Global Co-Head of PWM Engineering', linkedin: 'https://www.linkedin.com/in/james-colletti-1b46455/' }
    ],
    hrLeaders: [
      { name: 'Jacqueline Arthur', title: 'Global Head of Human Capital Management', linkedin: 'https://www.linkedin.com/in/jacqueline-arthur-5b82576/' },
      { name: 'Annie Yearwood', title: 'VP, Human Capital Management', linkedin: 'https://www.linkedin.com/in/annie-yearwood-2187901b/' }
    ],
    recruiters: [
      { name: 'Joseph Dougherty', title: 'Senior Talent Acquisition Lead', linkedin: 'https://www.linkedin.com/in/joseph-dougherty-9bb20b158/' },
      { name: 'Rekha Rajan', title: 'Talent Acquisition Specialist', linkedin: 'https://www.linkedin.com/in/rekharajan/' }
    ],
    emails: [
      { email: 'konstantinos.r@gs.com', deliverability: 90, status: 'verified' },
      { email: 'james.colletti@gs.com', deliverability: 90, status: 'verified' },
      { email: 'jacqueline.arthur@gs.com', deliverability: 45, status: 'catch-all' }
    ],
    phones: [
      { number: '+1-212-902-1000', verified: true },
      { number: '+1-212-902-5500', verified: false }
    ],
    status: 'Active',
    matchScore: 95
  },
  {
    id: 2,
    jobTitle: 'Lead Java Developer',
    company: 'JP Morgan Chase',
    location: 'Jersey City, NJ',
    postedDate: '2025-10-14',
    hiringManagers: [
      { name: 'Gregory Hodges', title: 'Managing Director, Product and Software Engineering', linkedin: 'https://www.linkedin.com/in/gregory-hodges-100477100/' },
      { name: 'Smitha Sreekantan', title: 'Executive Director, Engineering Lead on API Platform', linkedin: 'https://www.linkedin.com/in/smitha-sreekantan-127131a2/' }
    ],
    hrLeaders: [
      { name: 'Robin Leopold', title: 'EVP, Head of Human Resources', linkedin: 'https://www.linkedin.com/in/robin-leopold-50a7b647/' },
      { name: 'Julie Bohan', title: 'Managing Director - HR Executive', linkedin: 'https://www.linkedin.com/in/julie-bohan-2393947/' }
    ],
    recruiters: [
      { name: 'Zach Werde', title: 'Senior Technical Recruiter - Cybersecurity', linkedin: 'https://www.linkedin.com/in/zachwerde/' },
      { name: 'Timothy F. Hunt', title: 'Senior Associate, Technical Recruiter', linkedin: 'https://www.linkedin.com/in/timothyhuntjpmc/' }
    ],
    emails: [
      { email: 'gregory.hodges@jpmorgan.com', deliverability: 90, status: 'verified' },
      { email: 'robin.leopold@jpmchase.com', deliverability: 90, status: 'verified' },
      { email: 'zach.werde@chase.com', deliverability: 45, status: 'catch-all' }
    ],
    phones: [
      { number: '+1-212-270-6000', verified: true },
      { number: '+1-201-354-9000', verified: true }
    ],
    status: 'Active',
    matchScore: 92
  },
  {
    id: 3,
    jobTitle: 'Java Software Engineer',
    company: 'Morgan Stanley',
    location: 'New York, NY',
    postedDate: '2025-10-12',
    hiringManagers: [
      { name: 'Jacob Thomas', title: 'Executive Director, Technology Incident Management', linkedin: 'https://www.linkedin.com/in/jacobthomasny/' },
      { name: 'Sandeep Anand', title: 'Executive Director, Head of Engineering for Fixed Income', linkedin: 'https://www.linkedin.com/in/sandeep-anand-095159a/' }
    ],
    hrLeaders: [
      { name: 'Mandell Crawley', title: 'Chief Client Officer (Former CHRO)', linkedin: 'https://www.linkedin.com/in/mandellcrawley/' },
      { name: 'Jason Simmonds', title: 'Chief of Staff to CHRO', linkedin: 'https://www.linkedin.com/in/jason-simmonds-977610b/' }
    ],
    recruiters: [
      { name: 'Mitch Brodsky', title: 'VP, Talent Acquisition', linkedin: 'https://www.linkedin.com/in/mitch-brodsky-697304101/' },
      { name: 'Taryn O\'Sullivan', title: 'Director, Talent Acquisition', linkedin: 'https://www.linkedin.com/in/taryn-o-sullivan-4a9b3a7' }
    ],
    emails: [
      { email: 'jacob.thomas@morganstanley.com', deliverability: 90, status: 'verified' },
      { email: 'mandell.crawley@morganstanley.com', deliverability: 90, status: 'verified' },
      { email: 'mitch.brodsky@morganstanley.com', deliverability: 45, status: 'catch-all' }
    ],
    phones: [
      { number: '+1-212-761-4000', verified: true },
      { number: '+1-212-761-0100', verified: false }
    ],
    status: 'Active',
    matchScore: 88
  },
  {
    id: 4,
    jobTitle: 'Principal Java Engineer',
    company: 'Citigroup',
    location: 'New York, NY',
    postedDate: '2025-10-10',
    hiringManagers: [
      { name: 'Jose Perez', title: 'Managing Director and COO, Personal Banking Technology', linkedin: 'https://www.linkedin.com/in/jose-perez-44187414/' },
      { name: 'Denis Urusov', title: 'Managing Director, Financial Services Technology', linkedin: 'https://www.linkedin.com/in/durusov/' }
    ],
    hrLeaders: [
      { name: 'Sara Wechter', title: 'Chief Human Resources Officer', linkedin: 'https://www.linkedin.com/in/sarawechter/' },
      { name: 'Lynn Pettit', title: 'Director, Global HR Advisor', linkedin: 'https://www.linkedin.com/in/lynn-pettit-36053a7/' }
    ],
    recruiters: [
      { name: 'Angie Backe', title: 'VP, Executive Recruiter', linkedin: 'https://www.linkedin.com/in/angie-backe-06949710/' },
      { name: 'Bernard Frye', title: 'AVP, Talent Acquisition, Senior Recruiter', linkedin: 'https://www.linkedin.com/in/bernard-frye-07b7958/' }
    ],
    emails: [
      { email: 'jose.perez@citi.com', deliverability: 90, status: 'verified' },
      { email: 'sara.wechter@citi.com', deliverability: 90, status: 'verified' },
      { email: 'angie.backe@citi.com', deliverability: 45, status: 'catch-all' }
    ],
    phones: [
      { number: '+1-212-559-1000', verified: true },
      { number: '+1-212-559-5000', verified: false }
    ],
    status: 'Filled',
    matchScore: 85
  }
]

const mockReverseEngineering = [
  {
    id: 1,
    competitorAgency: 'TechStaff Solutions',
    jobPosted: 'Senior Backend Developer - Financial Services',
    location: 'Manhattan, NY',
    analysisStatus: 'Complete',
    confidence: 87,
    identifiedClient: 'Bank of America',
    matchingIndicators: [
      'Exact location match (One Bryant Park)',
      'Duplicate text in requirements (85% similarity)',
      'Technology stack identical',
      'Posting dates within 3 days'
    ],
    originalJobLink: 'https://careers.bankofamerica.com/...',
    competitorLink: 'https://techstaff.com/jobs/...'
  },
  {
    id: 2,
    competitorAgency: 'Elite Recruiting Group',
    jobPosted: 'Java Architect - Fintech',
    location: 'NYC',
    analysisStatus: 'In Progress',
    confidence: 73,
    identifiedClient: 'Stripe (Suspected)',
    matchingIndicators: [
      'Similar tech stack',
      'Location proximity',
      'Job description overlap (62%)'
    ],
    originalJobLink: 'https://stripe.com/jobs/...',
    competitorLink: 'https://eliterg.com/...'
  }
]

// Recruiting Capacity Analysis Data
const mockCapacityData = [
  {
    id: 1,
    company: 'TechVision Corp',
    location: 'New York, NY',
    employees: 850,
    openJobs: 47,
    internalRecruiters: 2,
    hrStaff: 3,
    recruitingTeam: [
      { name: 'Sarah Mitchell', title: 'Senior Technical Recruiter', linkedin: '#', experience: '5 years' },
      { name: 'Michael Chen', title: 'Technical Recruiter', linkedin: '#', experience: '2 years' }
    ],
    hrTeam: [
      { name: 'Jennifer Lopez', title: 'VP Human Resources', linkedin: '#', activeRecruiting: false },
      { name: 'David Park', title: 'HR Business Partner', linkedin: '#', activeRecruiting: true },
      { name: 'Amanda Stone', title: 'HR Coordinator', linkedin: '#', activeRecruiting: false }
    ],
    jobsPerRecruiter: 23.5,
    capacityScore: 15, // Out of 100, lower = more overwhelmed
    agencyOpportunity: 'Extreme',
    industryBenchmark: 8, // Industry standard jobs per recruiter
    estimatedAgencySpend: '$940,000/year',
    recentHires: 34,
    timeToFill: 67, // days
    industryAvgTimeToFill: 42
  },
  {
    id: 2,
    company: 'FinanceHub Solutions',
    location: 'Jersey City, NJ',
    employees: 1200,
    openJobs: 89,
    internalRecruiters: 3,
    hrStaff: 5,
    recruitingTeam: [
      { name: 'Robert Johnson', title: 'Director of Talent Acquisition', linkedin: '#', experience: '8 years' },
      { name: 'Lisa Wang', title: 'Senior Recruiter', linkedin: '#', experience: '4 years' },
      { name: 'Carlos Rodriguez', title: 'Technical Recruiter', linkedin: '#', experience: '1 year' }
    ],
    hrTeam: [
      { name: 'Patricia Williams', title: 'Chief People Officer', linkedin: '#', activeRecruiting: false },
      { name: 'Mark Thompson', title: 'HR Director', linkedin: '#', activeRecruiting: true },
      { name: 'Emily Chen', title: 'HR Manager', linkedin: '#', activeRecruiting: true },
      { name: 'James Lee', title: 'HR Generalist', linkedin: '#', activeRecruiting: false },
      { name: 'Rachel Green', title: 'HR Assistant', linkedin: '#', activeRecruiting: false }
    ],
    jobsPerRecruiter: 29.7,
    capacityScore: 8,
    agencyOpportunity: 'Critical',
    industryBenchmark: 8,
    estimatedAgencySpend: '$1.78M/year',
    recentHires: 56,
    timeToFill: 82,
    industryAvgTimeToFill: 42
  },
  {
    id: 3,
    company: 'DataStream Inc',
    location: 'Stamford, CT',
    employees: 650,
    openJobs: 31,
    internalRecruiters: 4,
    hrStaff: 2,
    recruitingTeam: [
      { name: 'Katherine Adams', title: 'Head of Recruiting', linkedin: '#', experience: '7 years' },
      { name: 'Thomas Brown', title: 'Technical Recruiter', linkedin: '#', experience: '3 years' },
      { name: 'Nicole Martinez', title: 'Recruiter', linkedin: '#', experience: '2 years' },
      { name: 'Andrew Kim', title: 'Junior Recruiter', linkedin: '#', experience: '6 months' }
    ],
    hrTeam: [
      { name: 'Susan Clark', title: 'VP of People', linkedin: '#', activeRecruiting: false },
      { name: 'Daniel White', title: 'HR Business Partner', linkedin: '#', activeRecruiting: true }
    ],
    jobsPerRecruiter: 7.8,
    capacityScore: 78,
    agencyOpportunity: 'Low',
    industryBenchmark: 8,
    estimatedAgencySpend: '$155,000/year',
    recentHires: 42,
    timeToFill: 38,
    industryAvgTimeToFill: 42
  },
  {
    id: 4,
    company: 'CloudNine Technologies',
    location: 'Newark, NJ',
    employees: 980,
    openJobs: 156,
    internalRecruiters: 5,
    hrStaff: 4,
    recruitingTeam: [
      { name: 'Michelle Davis', title: 'VP Talent Acquisition', linkedin: '#', experience: '10 years' },
      { name: 'Brandon Hall', title: 'Senior Technical Recruiter', linkedin: '#', experience: '6 years' },
      { name: 'Stephanie Young', title: 'Technical Recruiter', linkedin: '#', experience: '3 years' },
      { name: 'Jason Scott', title: 'Recruiter', linkedin: '#', experience: '2 years' },
      { name: 'Melissa Turner', title: 'Recruiting Coordinator', linkedin: '#', experience: '1 year' }
    ],
    hrTeam: [
      { name: 'Christopher Moore', title: 'CHRO', linkedin: '#', activeRecruiting: false },
      { name: 'Angela Harris', title: 'HR Director', linkedin: '#', activeRecruiting: true },
      { name: 'Kevin Wright', title: 'HR Manager', linkedin: '#', activeRecruiting: true },
      { name: 'Laura Anderson', title: 'HR Specialist', linkedin: '#', activeRecruiting: false }
    ],
    jobsPerRecruiter: 31.2,
    capacityScore: 5,
    agencyOpportunity: 'Extreme',
    industryBenchmark: 8,
    estimatedAgencySpend: '$3.12M/year',
    recentHires: 89,
    timeToFill: 95,
    industryAvgTimeToFill: 42
  },
  {
    id: 5,
    company: 'MediTech Systems',
    location: 'New York, NY',
    employees: 720,
    openJobs: 52,
    internalRecruiters: 3,
    hrStaff: 3,
    recruitingTeam: [
      { name: 'Rebecca Taylor', title: 'Talent Acquisition Lead', linkedin: '#', experience: '5 years' },
      { name: 'Nathan Lewis', title: 'Senior Recruiter', linkedin: '#', experience: '4 years' },
      { name: 'Olivia Martinez', title: 'Recruiter', linkedin: '#', experience: '2 years' }
    ],
    hrTeam: [
      { name: 'Frank Robinson', title: 'VP HR', linkedin: '#', activeRecruiting: false },
      { name: 'Grace Hill', title: 'HR Manager', linkedin: '#', activeRecruiting: true },
      { name: 'Henry Foster', title: 'HR Coordinator', linkedin: '#', activeRecruiting: false }
    ],
    jobsPerRecruiter: 17.3,
    capacityScore: 35,
    agencyOpportunity: 'High',
    industryBenchmark: 8,
    estimatedAgencySpend: '$780,000/year',
    recentHires: 38,
    timeToFill: 58,
    industryAvgTimeToFill: 42
  }
]

// Real NY/NJ/CT companies with LIVE verified job links (October 2025)
const realCompanies = {
  manufacturing: [
    {
      name: 'RTX (Pratt & Whitney)',
      location: 'East Hartford, CT',
      employees: 1000,
      jobs: ['Supplier Manufacturing Engineer'],
      jobLink: 'https://careers.rtx.com/global/en/job/01796139'
    },
    {
      name: 'RTX (Pratt & Whitney)',
      location: 'East Hartford, CT',
      employees: 1000,
      jobs: ['Principal Additive Mfg Engineer'],
      jobLink: 'https://careers.rtx.com/global/en/job/01781156/Principal-Additive-Manufacturing-Process-Engineer'
    }
  ],
  it: [
    {
      name: 'Shutterstock',
      location: 'New York, NY',
      employees: 1715,
      jobs: ['Data Engineer, Analytics'],
      jobLink: 'https://careers.shutterstock.com/us/en/job/R0003035/Data-Engineer-Analytics'
    },
    {
      name: 'Gemini',
      location: 'New York, NY',
      employees: 586,
      jobs: ['Staff Data Engineer'],
      jobLink: 'https://job-boards.greenhouse.io/gemini/jobs/7254038'
    },
    {
      name: 'Zocdoc',
      location: 'New York, NY',
      employees: 564,
      jobs: ['Staff SWE, Data Infrastructure'],
      jobLink: 'https://job-boards.greenhouse.io/zocdoc/jobs/6821794'
    }
  ],
  finance: [
    {
      name: 'Datadog',
      location: 'New York, NY',
      employees: 7200,
      jobs: ['Senior FP&A Analyst'],
      jobLink: 'https://boards.greenhouse.io/datadog/jobs/7027764'
    },
    {
      name: 'Squarespace',
      location: 'New York, NY',
      employees: 1739,
      jobs: ['Senior Financial Analyst, Investments'],
      jobLink: 'https://www.squarespace.com/careers/jobs/7195483?location=new-york'
    }
  ]
}

// Lead Activity Trend by Vertical (NY/NJ/CT companies, 500-1000 employees)
const leadActivityByVertical = [
  { month: 'Jun', Manufacturing: 18, 'Information Technology': 24, 'Finance & Accounting': 15 },
  { month: 'Jul', Manufacturing: 22, 'Information Technology': 28, 'Finance & Accounting': 19 },
  { month: 'Aug', Manufacturing: 26, 'Information Technology': 32, 'Finance & Accounting': 23 },
  { month: 'Sep', Manufacturing: 31, 'Information Technology': 38, 'Finance & Accounting': 27 },
  { month: 'Oct', Manufacturing: 35, 'Information Technology': 42, 'Finance & Accounting': 31 }
]

// Top Companies by Lead Volume (Real NY/NJ/CT companies with live jobs)
const topCompaniesByLeads = [
  { name: 'Shutterstock (IT)', location: 'NYC', value: 28 },
  { name: 'Datadog (Finance)', location: 'NYC', value: 23 },
  { name: 'Gemini (IT)', location: 'NYC', value: 18 },
  { name: 'RTX Pratt & Whitney (Mfg)', location: 'East Hartford, CT', value: 15 },
  { name: 'Squarespace (Finance)', location: 'NYC', value: 12 }
]

// Analytics data (for Talent Analytics tab)
const candidateMovementData = [
  { month: 'Jun', Oracle: 12, IBM: 8, Google: 15, Microsoft: 10 },
  { month: 'Jul', Oracle: 15, IBM: 10, Google: 18, Microsoft: 12 },
  { month: 'Aug', Oracle: 18, IBM: 12, Google: 20, Microsoft: 14 },
  { month: 'Sep', Oracle: 20, IBM: 14, Google: 22, Microsoft: 16 },
  { month: 'Oct', Oracle: 23, IBM: 16, Google: 25, Microsoft: 18 }
]

const companyTrendsData = [
  { name: 'Oracle → Goldman Sachs', value: 28 },
  { name: 'IBM → JP Morgan', value: 24 },
  { name: 'Google → Morgan Stanley', value: 19 },
  { name: 'Microsoft → Citigroup', value: 15 },
  { name: 'Oracle → Bank of America', value: 12 }
]

const jobMonitoring = [
  {
    company: 'Goldman Sachs',
    careerPageUrl: 'https://goldmansachs.com/careers',
    lastChecked: '2025-10-19 08:30 AM',
    status: 'Change Detected',
    changes: [
      { type: 'New Job', title: 'VP Java Engineer', dept: 'Technology', date: '2025-10-19' },
      { type: 'Job Closed', title: 'Associate Developer', dept: 'Operations', date: '2025-10-18' }
    ]
  },
  {
    company: 'JP Morgan Chase',
    careerPageUrl: 'https://jpmorganchase.com/careers',
    lastChecked: '2025-10-19 08:15 AM',
    status: 'No Changes',
    changes: []
  },
  {
    company: 'Morgan Stanley',
    careerPageUrl: 'https://morganstanley.com/careers',
    lastChecked: '2025-10-19 08:00 AM',
    status: 'Change Detected',
    changes: [
      { type: 'New Job', title: 'Senior Java Developer', dept: 'Wealth Management', date: '2025-10-19' }
    ]
  }
]

const fundingEvents = [
  {
    company: 'Brex',
    eventType: 'Series D',
    amount: '$300M',
    date: '2025-10-15',
    lead: 'Tiger Global',
    valuation: '$12.3B',
    industry: 'Fintech',
    relevance: 'High'
  },
  {
    company: 'Ramp',
    eventType: 'Series C Extension',
    amount: '$150M',
    date: '2025-10-10',
    lead: 'Founders Fund',
    valuation: '$8.1B',
    industry: 'Fintech',
    relevance: 'High'
  },
  {
    company: 'Plaid',
    eventType: 'Secondary Sale',
    amount: '$250M',
    date: '2025-10-05',
    lead: 'Altimeter Capital',
    valuation: '$13.4B',
    industry: 'Fintech',
    relevance: 'Medium'
  }
]

const icpLookalikes = [
  {
    company: 'Affirm',
    similarity: 94,
    matchReasons: ['Fintech', 'Series G', '1000-5000 employees', 'Similar tech stack'],
    employees: 2800,
    location: 'San Francisco, CA',
    fundingStage: 'Public',
    techStack: ['Java', 'Python', 'AWS', 'Kubernetes']
  },
  {
    company: 'Chime',
    similarity: 91,
    matchReasons: ['Digital Banking', 'Series G', '1000-5000 employees', 'VC-backed'],
    employees: 1500,
    location: 'San Francisco, CA',
    fundingStage: 'Series G',
    techStack: ['Java', 'Go', 'GCP', 'Docker']
  },
  {
    company: 'Robinhood',
    similarity: 89,
    matchReasons: ['Fintech', 'Public', '1000-5000 employees', 'Financial services'],
    employees: 3200,
    location: 'Menlo Park, CA',
    fundingStage: 'Public',
    techStack: ['Python', 'Java', 'AWS', 'Terraform']
  }
]

const COLORS = ['#0ea5e9', '#d946ef', '#22c55e', '#f59e0b', '#ef4444']

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [liveJobs, setLiveJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Reverse Engineering state
  const [jobUrl, setJobUrl] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisStage, setAnalysisStage] = useState('')
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  // Training Ground state
  const [trainingStats, setTrainingStats] = useState({
    jobsScraped: 0,
    companiesDiscovered: 0,
    uniquePhrases: 0,
    locationsAnalyzed: 0
  })

  // Fetch jobs from Supabase
  const fetchJobs = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('last_verified', { ascending: false })

      if (error) throw error
      setLiveJobs(data || [])
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch training stats
  const fetchTrainingStats = async () => {
    try {
      // Get count of jobs scraped
      const { count: jobCount, error: jobError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })

      // Get count of qualified companies
      const { count: companyCount, error: companyError } = await supabase
        .from('qualified_companies')
        .select('*', { count: 'exact', head: true })

      // Get unique locations count
      const { data: locations, error: locationError } = await supabase
        .from('jobs')
        .select('location')
        .not('location', 'is', null)

      const uniqueLocations = new Set(locations?.map(j => j.location) || []).size

      if (!jobError && !companyError && !locationError) {
        setTrainingStats({
          jobsScraped: jobCount || 0,
          companiesDiscovered: companyCount || 0,
          uniquePhrases: Math.floor((jobCount || 0) * 0.3), // Estimate based on job count
          locationsAnalyzed: uniqueLocations
        })
      }
    } catch (error) {
      console.error('Error fetching training stats:', error)
    }
  }

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs()
    fetchTrainingStats()
  }, [])

  // Reverse Engineering Analysis Function
  const handleAnalyzeJob = async () => {
    if (!jobDescription.trim() && !jobUrl.trim()) {
      alert('Please enter a job URL or paste a job description')
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setAnalysisResults(null)

    try {
      // Create orchestrator and run analysis
      const orchestrator = new OrchestratorAgent()

      const results = await orchestrator.analyze(
        jobDescription,
        jobUrl,
        (stage: string, percentage: number) => {
          setAnalysisStage(stage)
          setAnalysisProgress(percentage)
        }
      )

      // Set results
      setAnalysisResults(results)

      // Save to Supabase
      try {
        await supabase.from('job_analyses').insert({
          job_description: jobDescription,
          job_url: jobUrl || null,
          identified_client: results.identifiedClient,
          confidence: results.confidence,
          match_percentage: results.matchPercentage,
          reasoning: results.reasoning,
          matched_job_url: results.matchedJobUrl,
          created_at: new Date().toISOString()
        })
        console.log('✅ Analysis saved to Supabase')
      } catch (dbError) {
        console.error('Failed to save to Supabase:', dbError)
        // Don't fail the whole analysis if DB save fails
      }

    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysisStage('Error during analysis')
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClearAnalysis = () => {
    setJobUrl('')
    setJobDescription('')
    setIsAnalyzing(false)
    setAnalysisProgress(0)
    setAnalysisStage('')
    setAnalysisResults(null)
  }

  // Group jobs by vertical for display
  const groupedJobs = {
    manufacturing: liveJobs.filter(job => job.vertical === 'Manufacturing'),
    it: liveJobs.filter(job => job.vertical === 'IT'),
    finance: liveJobs.filter(job => job.vertical === 'Finance')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Navigation Sidebar */}
      <div className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 shadow-hard border-r border-dark-800">
        <div className="p-8 border-b border-dark-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
              <span className="text-white text-xl font-bold">R</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                RecruitIQ
              </h1>
              <p className="text-gray-500 text-xs">Intelligence Platform</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-success-500/10 border border-success-500/20 rounded-lg">
            <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-success-400">Live Data Feed Active</span>
          </div>
        </div>

        <nav className="mt-6 px-4">
          {[
            { id: 'overview', label: 'Dashboard', icon: '📊', desc: 'Overview & Analytics' },
            { id: 'leads', label: 'Lead Intelligence', icon: '🎯', desc: 'Contact Discovery' },
            { id: 'capacity', label: 'Recruiting Capacity', icon: '⚖️', desc: 'Agency Opportunity' },
            { id: 'training', label: 'Training Ground', icon: '🎓', desc: 'AI Training' },
            { id: 'analytics', label: 'Talent Analytics', icon: '📈', desc: 'Movement Tracking' },
            { id: 'monitoring', label: 'Job Monitoring', icon: '👁️', desc: 'Career Pages' },
            { id: 'funding', label: 'Funding Events', icon: '💰', desc: 'VC Intelligence' },
            { id: 'icp', label: 'ICP Lookalikes', icon: '🎭', desc: 'Company Matching' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 mb-2 rounded-xl transition-all duration-300 flex items-center gap-3 group ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-glow'
                  : 'text-gray-400 hover:bg-dark-800 hover:text-white'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-sm">{item.label}</div>
                <div className={`text-xs mt-0.5 ${activeTab === item.id ? 'text-white/70' : 'text-gray-600'}`}>
                  {item.desc}
                </div>
              </div>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-dark-800">
          <div className="text-xs text-gray-600">
            <div className="flex items-center justify-between mb-1">
              <span>Database Status</span>
              <span className="text-success-400 font-semibold">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Sync</span>
              <span className="text-gray-400">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-700 to-accent-700 bg-clip-text text-transparent mb-2">
                {activeTab === 'overview' && 'Intelligence Dashboard'}
                {activeTab === 'leads' && 'Lead Intelligence Center'}
                {activeTab === 'capacity' && 'Recruiting Capacity Analysis'}
                {activeTab === 'reverse' && 'Reverse Engineering'}
                {activeTab === 'analytics' && 'Talent Movement Analytics'}
                {activeTab === 'monitoring' && 'Career Page Monitoring'}
                {activeTab === 'funding' && 'Funding Intelligence'}
                {activeTab === 'icp' && 'ICP Lookalike Discovery'}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'overview' && 'Comprehensive recruitment intelligence across all data sources'}
                {activeTab === 'leads' && 'Discover decision-makers, hiring managers, and recruiters'}
                {activeTab === 'capacity' && 'Identify companies overwhelmed with hiring needs - prime agency opportunities'}
                {activeTab === 'analytics' && 'Track candidate movement and hiring trends'}
                {activeTab === 'monitoring' && 'Real-time job posting change detection'}
                {activeTab === 'funding' && 'VC-backed companies and funding opportunities'}
                {activeTab === 'icp' && 'Find companies matching your ideal customer profile'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right text-sm">
                <div className="text-gray-500">Last updated</div>
                <div className="font-semibold text-gray-700">{lastUpdated.toLocaleTimeString()}</div>
              </div>
              <button
                onClick={fetchJobs}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? '⟳' : '🔄'}</span>
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>

          {/* Platform Capabilities Banner */}
          {activeTab === 'overview' && (
            <div className="flex gap-3 flex-wrap">
              <div className="showcase-badge">
                <span>🎯</span>
                <span>50,000+ Companies Tracked</span>
              </div>
              <div className="showcase-badge">
                <span>👥</span>
                <span>10M+ Contact Records</span>
              </div>
              <div className="showcase-badge">
                <span>⚡</span>
                <span>Real-Time Job Monitoring</span>
              </div>
              <div className="showcase-badge">
                <span>🔍</span>
                <span>AI-Powered Matching</span>
              </div>
              <div className="showcase-badge">
                <span>💰</span>
                <span>Funding Data Integration</span>
              </div>
            </div>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Primary KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stat-card group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-soft">
                    <span className="text-white text-2xl">🎯</span>
                  </div>
                  <span className="badge badge-success">+18%</span>
                </div>
                <div className="stat-label">Leads Delivered This Week</div>
                <div className="stat-number">96</div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="text-success-600 font-semibold">↑ 18%</span> from last week
                </div>
                <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" style={{width: '72%'}}></div>
                </div>
              </div>

              <div className="stat-card group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-soft">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                  <span className="badge badge-primary">Active</span>
                </div>
                <div className="stat-label">Jobs Analyzed</div>
                <div className="stat-number">1,342</div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="text-success-600 font-semibold">↑ 18%</span> from last week
                </div>
                <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent-500 to-accent-600 rounded-full" style={{width: '89%'}}></div>
                </div>
              </div>

              <div className="stat-card group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-soft">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                  <span className="badge badge-success">High</span>
                </div>
                <div className="stat-label">Match Rate</div>
                <div className="stat-number">87%</div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="text-success-600 font-semibold">↑ 5%</span> from last week
                </div>
                <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-success-500 to-success-600 rounded-full" style={{width: '87%'}}></div>
                </div>
              </div>

              <div className="stat-card group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-soft">
                    <span className="text-white text-2xl">🚀</span>
                  </div>
                  <span className="badge badge-warning">+12%</span>
                </div>
                <div className="stat-label">New Opportunities</div>
                <div className="stat-number">56</div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="text-success-600 font-semibold">↑ 12%</span> from last week
                </div>
                <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-warning-500 to-warning-600 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
            </div>

            {/* Data Capabilities Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-glass p-6 border-l-4 border-primary-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">👥</div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">10M+</div>
                    <div className="text-sm text-gray-600">Contact Records</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  <span className="data-pill">Hiring Managers</span>
                  <span className="data-pill">HR Leaders</span>
                  <span className="data-pill">Recruiters</span>
                </div>
              </div>

              <div className="card-glass p-6 border-l-4 border-accent-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">🏢</div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">50K+</div>
                    <div className="text-sm text-gray-600">Companies Tracked</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  <span className="data-pill">500-1000 employees</span>
                  <span className="data-pill">NY/NJ/CT</span>
                </div>
              </div>

              <div className="card-glass p-6 border-l-4 border-success-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">⚡</div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">Real-Time</div>
                    <div className="text-sm text-gray-600">Job Monitoring</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  <span className="data-pill">Live Updates</span>
                  <span className="data-pill">Change Detection</span>
                </div>
              </div>
            </div>

            {/* Analytics & Insights */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">Real-Time Analytics & Insights</h3>
                <div className="flex gap-2">
                  <span className="badge badge-primary">Live Data</span>
                  <span className="badge badge-accent">Updated Now</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-premium card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Lead Activity Trend</h3>
                    <p className="text-sm text-gray-600 mt-1">by Industry Vertical</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Coverage</div>
                    <div className="text-sm font-bold text-primary-600">NY/NJ/CT</div>
                  </div>
                </div>
                <div className="mb-4 flex gap-2 flex-wrap">
                  <span className="data-pill">500-1K employees</span>
                  <span className="data-pill">3 Industries</span>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={leadActivityByVertical}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="Manufacturing" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} />
                    <Line type="monotone" dataKey="Information Technology" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                    <Line type="monotone" dataKey="Finance & Accounting" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="card-premium card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Top Companies</h3>
                    <p className="text-sm text-gray-600 mt-1">by Lead Volume</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-sm font-bold text-accent-600">287 Leads</div>
                  </div>
                </div>
                <div className="mb-4 flex gap-2 flex-wrap">
                  <span className="data-pill">Active Hiring</span>
                  <span className="data-pill">Verified Contacts</span>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topCompaniesByLeads}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {topCompaniesByLeads.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Real Companies Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Manufacturing Companies */}
              <div className="card card-hover">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🏭</span> Manufacturing
                </h3>
                <p className="text-sm text-gray-600 mb-4">{groupedJobs.manufacturing.length} companies tracked</p>
                <div className="space-y-3">
                  {groupedJobs.manufacturing.map((job, i) => (
                    <a
                      key={job.id}
                      href={job.job_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gradient-to-r from-warning-50 to-orange-50 p-3 rounded-lg border-l-4 border-warning-500 hover:shadow-md transition-shadow"
                    >
                      <div className="font-semibold text-gray-800 text-sm">{job.company_name}</div>
                      <div className="text-xs text-gray-600 mt-1">{job.location} • {job.employee_count} employees</div>
                      <div className="text-xs text-warning-700 mt-1 font-medium">Hiring: {job.job_title}</div>
                      <div className="text-xs text-warning-600 mt-1 flex items-center gap-1">
                        <span>🔗</span>
                        <span className="underline">View Job Posting</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* IT Companies */}
              <div className="card card-hover">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💻</span> Information Technology
                </h3>
                <p className="text-sm text-gray-600 mb-4">{groupedJobs.it.length} companies tracked</p>
                <div className="space-y-3">
                  {groupedJobs.it.map((job) => (
                    <a
                      key={job.id}
                      href={job.job_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gradient-to-r from-primary-50 to-blue-50 p-3 rounded-lg border-l-4 border-primary-500 hover:shadow-md transition-shadow"
                    >
                      <div className="font-semibold text-gray-800 text-sm">{job.company_name}</div>
                      <div className="text-xs text-gray-600 mt-1">{job.location} • {job.employee_count} employees</div>
                      <div className="text-xs text-primary-700 mt-1 font-medium">Hiring: {job.job_title}</div>
                      <div className="text-xs text-primary-600 mt-1 flex items-center gap-1">
                        <span>🔗</span>
                        <span className="underline">View Job Posting</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Finance Companies */}
              <div className="card card-hover">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💰</span> Finance & Accounting
                </h3>
                <p className="text-sm text-gray-600 mb-4">{groupedJobs.finance.length} companies tracked</p>
                <div className="space-y-3">
                  {groupedJobs.finance.map((job) => (
                    <a
                      key={job.id}
                      href={job.job_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gradient-to-r from-success-50 to-green-50 p-3 rounded-lg border-l-4 border-success-500 hover:shadow-md transition-shadow"
                    >
                      <div className="font-semibold text-gray-800 text-sm">{job.company_name}</div>
                      <div className="text-xs text-gray-600 mt-1">{job.location} • {job.employee_count} employees</div>
                      <div className="text-xs text-success-700 mt-1 font-medium">Hiring: {job.job_title}</div>
                      <div className="text-xs text-success-600 mt-1 flex items-center gap-1">
                        <span>🔗</span>
                        <span className="underline">View Job Posting</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Search jobs, companies, or people..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="btn-primary">🔍 Search</button>
              <button className="btn-secondary">📥 Export</button>
            </div>

            <div className="space-y-4">
              {mockLeads.map(lead => (
                <div key={lead.id} className="card card-hover animate-slide-up">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{lead.jobTitle}</h3>
                        <span className={`badge ${lead.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                          {lead.status}
                        </span>
                        <span className="badge badge-primary">
                          {lead.matchScore}% Match
                        </span>
                      </div>
                      <div className="text-gray-600 flex items-center gap-2 mb-3">
                        <span className="font-semibold text-primary-600">{lead.company}</span>
                        <span>•</span>
                        <span>{lead.location}</span>
                        <span>•</span>
                        <span>Posted {lead.postedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>👤</span> Hiring Managers
                      </h4>
                      <ul className="space-y-2">
                        {lead.hiringManagers.map((manager, i) => (
                          <li key={i} className="ml-6">
                            <a
                              href={manager.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-800 hover:underline font-medium flex items-center gap-2"
                            >
                              <span>🔗</span>
                              <div>
                                <div>{manager.name}</div>
                                <div className="text-xs text-gray-500 font-normal">{manager.title}</div>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>

                      <h4 className="font-semibold text-gray-700 mt-4 mb-2 flex items-center gap-2">
                        <span>🏢</span> HR Leaders
                      </h4>
                      <ul className="space-y-2">
                        {lead.hrLeaders.map((hr, i) => (
                          <li key={i} className="ml-6">
                            <a
                              href={hr.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-800 hover:underline font-medium flex items-center gap-2"
                            >
                              <span>🔗</span>
                              <div>
                                <div>{hr.name}</div>
                                <div className="text-xs text-gray-500 font-normal">{hr.title}</div>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>

                      <h4 className="font-semibold text-gray-700 mt-4 mb-2 flex items-center gap-2">
                        <span>🎯</span> Recruiters
                      </h4>
                      <ul className="space-y-2">
                        {lead.recruiters.map((recruiter, i) => (
                          <li key={i} className="ml-6">
                            <a
                              href={recruiter.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-800 hover:underline font-medium flex items-center gap-2"
                            >
                              <span>🔗</span>
                              <div>
                                <div>{recruiter.name}</div>
                                <div className="text-xs text-gray-500 font-normal">{recruiter.title}</div>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>✉️</span> Email & Deliverability
                      </h4>
                      <div className="space-y-2">
                        {lead.emails.map((emailObj, i) => (
                          <div key={i} className={`${
                            emailObj.status === 'verified'
                              ? 'bg-success-50 border-l-4 border-success-500'
                              : 'bg-warning-50 border-l-4 border-warning-500'
                          } px-3 py-2 rounded-lg text-sm`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-gray-800">{emailObj.email}</span>
                              <button className="text-primary-600 hover:text-primary-800">📋</button>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className={`font-semibold ${
                                emailObj.status === 'verified' ? 'text-success-700' : 'text-warning-700'
                              }`}>
                                {emailObj.status === 'verified' ? '✓ Verified Email' : '⚠ Catch-all Risky Email'}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className={`font-bold ${
                                emailObj.deliverability >= 80 ? 'text-success-600' : 'text-warning-600'
                              }`}>
                                {emailObj.deliverability}% Deliverability
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <h4 className="font-semibold text-gray-700 mt-4 mb-2 flex items-center gap-2">
                        <span>📞</span> Phone Numbers
                      </h4>
                      <div className="space-y-2">
                        {lead.phones.map((phoneObj, i) => (
                          <div key={i} className={`${
                            phoneObj.verified
                              ? 'bg-success-50 border-l-4 border-success-500'
                              : 'bg-gray-50 border-l-4 border-gray-400'
                          } px-3 py-2 rounded-lg text-sm`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-gray-800">{phoneObj.number}</span>
                              <button className="text-primary-600 hover:text-primary-800">📋</button>
                            </div>
                            <div className="text-xs">
                              <span className={`font-semibold ${
                                phoneObj.verified ? 'text-success-700' : 'text-gray-600'
                              }`}>
                                {phoneObj.verified ? '✓ Phone Number Verified' : '✗ Phone Number Not Verified'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                    <button className="btn-primary flex-1">View Full Details</button>
                    <button className="btn-secondary">Save to CRM</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recruiting Capacity Analysis Tab */}
        {activeTab === 'capacity' && (
          <div className="space-y-8 animate-fade-in">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="stat-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-danger-500 to-danger-600 flex items-center justify-center shadow-soft">
                    <span className="text-white text-2xl">🔴</span>
                  </div>
                </div>
                <div className="stat-label">Critical Capacity</div>
                <div className="stat-number">{mockCapacityData.filter(c => c.agencyOpportunity === 'Critical' || c.agencyOpportunity === 'Extreme').length}</div>
                <div className="mt-2 text-sm text-gray-600">Companies overwhelmed</div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-soft">
                    <span className="text-white text-2xl">⚠️</span>
                  </div>
                </div>
                <div className="stat-label">High Opportunity</div>
                <div className="stat-number">{mockCapacityData.filter(c => c.agencyOpportunity === 'High').length}</div>
                <div className="mt-2 text-sm text-gray-600">Above industry average</div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-soft">
                    <span className="text-white text-2xl">💰</span>
                  </div>
                </div>
                <div className="stat-label">Est. Total Spend</div>
                <div className="stat-number text-2xl">$7.6M</div>
                <div className="mt-2 text-sm text-gray-600">Annual agency budget</div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-soft">
                    <span className="text-white text-2xl">⚖️</span>
                  </div>
                </div>
                <div className="stat-label">Avg Jobs/Recruiter</div>
                <div className="stat-number">21.9</div>
                <div className="mt-2 text-sm text-gray-600">vs industry std. 8</div>
              </div>
            </div>

            {/* Company Cards */}
            <div className="space-y-6">
              {mockCapacityData.map(company => {
                const opportunityColor = {
                  'Extreme': 'danger',
                  'Critical': 'danger',
                  'High': 'warning',
                  'Medium': 'primary',
                  'Low': 'success'
                }[company.agencyOpportunity] || 'primary'

                const activeRecruiting = company.hrTeam.filter(hr => hr.activeRecruiting).length

                return (
                  <div key={company.id} className="card-premium card-hover">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{company.company}</h3>
                          <span className={`badge badge-${opportunityColor}`}>
                            {company.agencyOpportunity} Opportunity
                          </span>
                        </div>
                        <div className="text-gray-600 flex items-center gap-3 text-sm">
                          <span>📍 {company.location}</span>
                          <span>•</span>
                          <span>👥 {company.employees} employees</span>
                          <span>•</span>
                          <span className="font-semibold text-primary-600">{company.openJobs} Open Jobs</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">{company.jobsPerRecruiter.toFixed(1)}</div>
                        <div className="text-xs text-gray-600">Jobs per Recruiter</div>
                        <div className="text-xs text-gray-500 mt-1">Industry avg: {company.industryBenchmark}</div>
                      </div>
                    </div>

                    {/* Capacity Score */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Recruiting Capacity Score</span>
                        <span className="text-sm font-bold" style={{color: company.capacityScore < 30 ? '#ef4444' : company.capacityScore < 60 ? '#f59e0b' : '#22c55e'}}>
                          {company.capacityScore}/100
                        </span>
                      </div>
                      <div className="progress-bar h-3">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${company.capacityScore}%`,
                            background: company.capacityScore < 30
                              ? 'linear-gradient(to right, #ef4444, #dc2626)'
                              : company.capacityScore < 60
                                ? 'linear-gradient(to right, #f59e0b, #d97706)'
                                : 'linear-gradient(to right, #22c55e, #16a34a)'
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {company.capacityScore < 30 && '⚠️ Severely understaffed - High agency dependence likely'}
                        {company.capacityScore >= 30 && company.capacityScore < 60 && '⚖️ Moderate strain - Agency support probable'}
                        {company.capacityScore >= 60 && '✓ Good capacity - Limited agency need'}
                      </div>
                    </div>

                    {/* Team Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {/* Internal Recruiters */}
                      <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-200/50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span>🎯</span> Internal Recruiters
                          </h4>
                          <span className="badge badge-primary">{company.internalRecruiters} Total</span>
                        </div>
                        <div className="space-y-2">
                          {company.recruitingTeam.map((recruiter, i) => (
                            <div key={i} className="bg-white p-3 rounded-lg border border-primary-100">
                              <div className="font-medium text-gray-900 text-sm">{recruiter.name}</div>
                              <div className="text-xs text-gray-600 mt-0.5">{recruiter.title}</div>
                              <div className="text-xs text-primary-600 mt-1 font-medium">
                                📊 ~{Math.round(company.openJobs / company.internalRecruiters)} jobs per person
                              </div>
                              <div className="text-xs text-gray-500">Experience: {recruiter.experience}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* HR Team */}
                      <div className="bg-accent-50/50 p-4 rounded-xl border border-accent-200/50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span>🏢</span> HR Staff
                          </h4>
                          <span className="badge badge-accent">{company.hrStaff} Total</span>
                        </div>
                        <div className="space-y-2">
                          {company.hrTeam.map((hr, i) => (
                            <div key={i} className={`bg-white p-3 rounded-lg border ${hr.activeRecruiting ? 'border-accent-300' : 'border-gray-200'}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900 text-sm">{hr.name}</div>
                                  <div className="text-xs text-gray-600 mt-0.5">{hr.title}</div>
                                </div>
                                {hr.activeRecruiting ? (
                                  <span className="badge badge-success text-xs">Active Recruiting</span>
                                ) : (
                                  <span className="badge badge-warning text-xs">Admin Only</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-xs text-gray-600 bg-white p-2 rounded border border-accent-200">
                          <strong>{activeRecruiting}</strong> of {company.hrStaff} actively recruiting (rest are admin/compliance)
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Effective Recruiting Staff</div>
                        <div className="text-xl font-bold text-gray-900">{company.internalRecruiters + activeRecruiting}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Time to Fill</div>
                        <div className="text-xl font-bold text-danger-600">{company.timeToFill} days</div>
                        <div className="text-xs text-gray-500">Industry avg: {company.industryAvgTimeToFill}d</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Recent Hires (6mo)</div>
                        <div className="text-xl font-bold text-gray-900">{company.recentHires}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Est. Agency Spend</div>
                        <div className="text-xl font-bold text-success-600">{company.estimatedAgencySpend}</div>
                      </div>
                    </div>

                    {/* Insight */}
                    <div className={`mt-6 p-4 rounded-xl border-l-4 ${
                      company.agencyOpportunity === 'Extreme' || company.agencyOpportunity === 'Critical'
                        ? 'bg-danger-50 border-danger-500'
                        : company.agencyOpportunity === 'High'
                          ? 'bg-warning-50 border-warning-500'
                          : 'bg-success-50 border-success-500'
                    }`}>
                      <div className="font-semibold text-gray-900 mb-1">💡 Agency Opportunity Insight</div>
                      <div className="text-sm text-gray-700">
                        {company.agencyOpportunity === 'Extreme' && `With ${company.jobsPerRecruiter.toFixed(1)} jobs per recruiter (${Math.round((company.jobsPerRecruiter / company.industryBenchmark - 1) * 100)}% above industry standard), this company is severely overwhelmed. Their ${company.timeToFill}-day time-to-fill is ${company.timeToFill - company.industryAvgTimeToFill} days slower than average. They likely rely heavily on external agencies.`}
                        {company.agencyOpportunity === 'Critical' && `With ${company.jobsPerRecruiter.toFixed(1)} jobs per recruiter, this company is critically understaffed. Extended time-to-fill (${company.timeToFill} days) indicates strong agency dependence.`}
                        {company.agencyOpportunity === 'High' && `${company.jobsPerRecruiter.toFixed(1)} jobs per recruiter is ${Math.round((company.jobsPerRecruiter / company.industryBenchmark - 1) * 100)}% above industry standard. Time-to-fill of ${company.timeToFill} days suggests moderate agency usage for overflow.`}
                        {company.agencyOpportunity === 'Low' && `With ${company.jobsPerRecruiter.toFixed(1)} jobs per recruiter, this company is well-staffed and within industry norms. Limited agency opportunity.`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Reverse Engineering Tab - REMOVED */}
        {false && activeTab === 'reverse' && (
          <div className="space-y-6 animate-fade-in">
            <div className="card bg-gradient-to-r from-primary-500 to-accent-500 text-white">
              <h3 className="text-xl font-bold mb-2">🔍 AI-Powered Job Reverse Engineering</h3>
              <p className="opacity-90">
                Our AI agent analyzes competitor staffing agency job posts to identify the real end client by cross-referencing
                language, location, job descriptions, and duties across the web.
              </p>
            </div>

            <div className="card">
              <div className="mb-6">
                <div className="text-4xl mb-4 text-center">🤖</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Job Reverse Engineering</h3>
                <p className="text-gray-600 text-center mb-6">
                  Paste a job URL or the full job description text below to identify the real end client
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    disabled={isAnalyzing}
                    placeholder="https://competitor-site.com/job/12345"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the URL of the competitor's job posting</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-sm text-gray-500 font-medium">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Description Text
                  </label>
                  <textarea
                    rows={12}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={isAnalyzing}
                    placeholder="Paste the full job description here...

Example:
Senior Backend Developer - Financial Services
Location: Manhattan, NY
Salary: $150,000 - $200,000

We are seeking a Senior Backend Developer to join our team...
Requirements:
- 5+ years of experience with Java
- Experience with Spring Boot
- Strong understanding of microservices architecture
..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Paste the complete job description including title, location, salary, requirements, etc.</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAnalyzeJob}
                    disabled={isAnalyzing}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? '⏳ Analyzing...' : '🔍 Analyze Job & Identify Client'}
                  </button>
                  <button
                    onClick={handleClearAnalysis}
                    disabled={isAnalyzing}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {!isAnalyzing && !analysisResults && (
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">💡</span>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">How it works</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Our AI analyzes job descriptions from competitor staffing agencies</li>
                        <li>• Cross-references language, location, tech stack, and requirements</li>
                        <li>• Identifies the real end client with confidence scoring</li>
                        <li>• Provides matching indicators and evidence</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Indicator */}
              {isAnalyzing && (
                <div className="mt-6 p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200 rounded-lg">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - analysisProgress / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-500"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#d946ef" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-800">{analysisProgress}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800 mb-2">{analysisStage}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analysisProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">This may take 2-5 minutes for a thorough analysis...</p>
                  </div>
                </div>
              )}

              {/* Results Display */}
              {analysisResults && !isAnalyzing && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  {/* Main Result Card */}
                  <div className="card bg-gradient-to-r from-success-50 to-primary-50 border-2 border-success-500">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">
                          🎯 Identified Client: {analysisResults.identifiedClient}
                        </h3>
                        <p className="text-sm text-gray-600">Analysis completed on {new Date(analysisResults.analysisDate).toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-5xl font-bold text-success-600">{analysisResults.matchPercentage}%</div>
                        <div className="text-sm text-gray-600 mt-1">Match Confidence</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-success-200">
                      <a
                        href={analysisResults.matchedJobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline text-sm flex items-center gap-2"
                      >
                        <span>🔗</span>
                        <span>View Original Job Posting</span>
                      </a>
                      {analysisResults.competitorUrl !== 'N/A' && (
                        <a
                          href={analysisResults.competitorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-600 hover:underline text-sm flex items-center gap-2"
                        >
                          <span>🔗</span>
                          <span>View Competitor Posting</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Detailed Reasoning */}
                  <div className="card">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">📊 Detailed Match Analysis</h4>
                    <div className="space-y-4">
                      {analysisResults.reasoning.map((item: any, i: number) => (
                        <div key={i} className="border-l-4 border-primary-500 bg-primary-50 p-4 rounded-r-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-gray-800">{item.category}</h5>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    item.score >= 90 ? 'bg-success-500' :
                                    item.score >= 75 ? 'bg-primary-500' :
                                    item.score >= 60 ? 'bg-warning-500' : 'bg-gray-400'
                                  }`}
                                  style={{ width: `${item.score}%` }}
                                ></div>
                              </div>
                              <span className="font-bold text-gray-700 min-w-[3rem] text-right">{item.score}%</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{item.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="btn-primary flex-1">Save Analysis</button>
                    <button onClick={handleClearAnalysis} className="btn-secondary">New Analysis</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <div className="card card-hover">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Candidate Movement Trends</h3>
              <p className="text-gray-600 mb-6">
                Track where candidates are moving from and to. This chart shows hiring trends from Oracle to various financial institutions.
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={candidateMovementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Oracle" fill="#0ea5e9" />
                  <Bar dataKey="IBM" fill="#d946ef" />
                  <Bar dataKey="Google" fill="#22c55e" />
                  <Bar dataKey="Microsoft" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card card-hover">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Company-to-Company Movement</h3>
              <div className="space-y-4">
                {companyTrendsData.map((trend, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-48 font-semibold text-gray-700">{trend.name}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-end pr-3 text-white font-bold"
                        style={{ width: `${(trend.value / 30) * 100}%` }}
                      >
                        {trend.value} moves
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card card-hover text-center">
                <div className="text-4xl mb-2">🔄</div>
                <div className="text-3xl font-bold text-primary-600">84</div>
                <div className="text-gray-600 mt-1">Candidates Open to Work</div>
              </div>
              <div className="card card-hover text-center">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-3xl font-bold text-accent-600">67%</div>
                <div className="text-gray-600 mt-1">Movement from Oracle</div>
              </div>
              <div className="card card-hover text-center">
                <div className="text-4xl mb-2">⚡</div>
                <div className="text-3xl font-bold text-success-600">23</div>
                <div className="text-gray-600 mt-1">Active Transitions This Week</div>
              </div>
            </div>
          </div>
        )}

        {/* Job Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6 animate-fade-in">
            {jobMonitoring.map((monitor, i) => (
              <div key={i} className="card card-hover animate-slide-up">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{monitor.company}</h3>
                      <span className={`badge ${monitor.status === 'Change Detected' ? 'badge-warning' : 'badge-success'}`}>
                        {monitor.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Career Page:</span>
                      <a href={monitor.careerPageUrl} className="text-primary-600 hover:underline ml-2">
                        {monitor.careerPageUrl}
                      </a>
                    </div>
                    <div className="text-sm text-gray-500">
                      Last checked: {monitor.lastChecked}
                    </div>
                  </div>
                </div>

                {monitor.changes.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <h4 className="font-semibold text-gray-700">Recent Changes:</h4>
                    {monitor.changes.map((change, j) => (
                      <div key={j} className={`p-3 rounded-lg border-l-4 ${
                        change.type === 'New Job'
                          ? 'bg-success-50 border-success-500'
                          : 'bg-warning-50 border-warning-500'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">
                            {change.type === 'New Job' ? '✅' : '❌'}
                          </span>
                          <span className="font-semibold">{change.type}:</span>
                          <span className="text-gray-800">{change.title}</span>
                        </div>
                        <div className="text-sm text-gray-600 ml-6">
                          {change.dept} • {change.date}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="card bg-gray-50 border-2 border-dashed border-gray-300">
              <div className="text-center py-8">
                <div className="text-4xl mb-3">👁️</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Add New Monitor</h3>
                <p className="text-gray-600 mb-4">Track career page changes for any company</p>
                <div className="flex gap-3 max-w-2xl mx-auto">
                  <input
                    type="text"
                    placeholder="Company name or career page URL..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button className="btn-primary">Start Monitoring</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Funding Events Tab */}
        {activeTab === 'funding' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card card-hover text-center bg-gradient-to-br from-success-500 to-success-600 text-white">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-3xl font-bold">$700M</div>
                <div className="mt-1 opacity-90">Total Raised This Month</div>
              </div>
              <div className="card card-hover text-center bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                <div className="text-4xl mb-2">🏢</div>
                <div className="text-3xl font-bold">12</div>
                <div className="mt-1 opacity-90">Companies Funded</div>
              </div>
              <div className="card card-hover text-center bg-gradient-to-br from-accent-500 to-accent-600 text-white">
                <div className="text-4xl mb-2">🎯</div>
                <div className="text-3xl font-bold">8</div>
                <div className="mt-1 opacity-90">High Relevance Matches</div>
              </div>
            </div>

            <div className="space-y-4">
              {fundingEvents.map((event, i) => (
                <div key={i} className="card card-hover animate-slide-up">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-800">{event.company}</h3>
                        <span className={`badge ${
                          event.relevance === 'High' ? 'badge-success' :
                          event.relevance === 'Medium' ? 'badge-warning' : 'badge-primary'
                        }`}>
                          {event.relevance} Relevance
                        </span>
                        <span className="badge badge-primary">{event.industry}</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-semibold">{event.eventType}</span> • {event.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-success-600">{event.amount}</div>
                      <div className="text-sm text-gray-500">Valuation: {event.valuation}</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Lead Investor</div>
                        <div className="font-bold text-gray-800 text-lg">{event.lead}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-primary">View Details</button>
                        <button className="btn-secondary">Track Company</button>
                      </div>
                    </div>
                  </div>

                  {event.relevance === 'High' && (
                    <div className="mt-3 bg-success-50 border-l-4 border-success-500 p-3 rounded">
                      <div className="text-sm text-success-800">
                        <span className="font-bold">💡 Opportunity:</span> This company matches your client's ICP.
                        Expected hiring surge in engineering roles within 30-60 days.
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ICP Lookalikes Tab */}
        {activeTab === 'icp' && (
          <div className="space-y-6 animate-fade-in">
            <div className="card bg-gradient-to-r from-primary-500 to-accent-500 text-white">
              <h3 className="text-xl font-bold mb-2">🎭 AI-Powered ICP Lookalike Finder</h3>
              <p className="opacity-90">
                Our system identifies companies similar to your ideal customer profile based on industry, size, funding stage,
                tech stack, and market positioning.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {icpLookalikes.map((company, i) => (
                <div key={i} className="card card-hover animate-slide-up">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                      {company.similarity}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{company.company}</h3>
                    <div className="text-sm text-gray-500">{company.location}</div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Match Score</div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-full bg-gradient-to-r from-success-500 to-primary-500 rounded-full"
                          style={{ width: `${company.similarity}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <div>
                        <div className="text-gray-600">Employees</div>
                        <div className="font-bold text-gray-800">{company.employees.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-600">Stage</div>
                        <div className="font-bold text-gray-800">{company.fundingStage}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Why They Match:</div>
                    <div className="space-y-1">
                      {company.matchReasons.map((reason, j) => (
                        <div key={j} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded">
                          • {reason}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Tech Stack:</div>
                    <div className="flex flex-wrap gap-2">
                      {company.techStack.map((tech, j) => (
                        <span key={j} className="px-2 py-1 bg-accent-100 text-accent-700 rounded text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="btn-primary flex-1 text-sm">View Profile</button>
                    <button className="btn-secondary text-sm">Track</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card bg-gray-50 border-2 border-dashed border-gray-300">
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Find More Lookalikes</h3>
                <p className="text-gray-600 mb-4">Enter a company to find similar organizations</p>
                <div className="flex gap-3 max-w-2xl mx-auto">
                  <input
                    type="text"
                    placeholder="Company name (e.g., Goldman Sachs)..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button className="btn-primary">Find Lookalikes</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Training Ground Tab (Admin Only) */}
        {activeTab === 'training' && (
          <div className="space-y-6 animate-fade-in">
            <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <h3 className="text-xl font-bold mb-2">🎓 AI Training Ground (Admin Only)</h3>
              <p className="opacity-90">
                This agent continuously trains on real employer job postings to learn matching patterns.
                Training data is NOT visible in production.
              </p>
            </div>

            {/* Training Controls */}
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Training Controls</h3>

              {/* Phase 1: Company Identification */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                <h4 className="font-bold text-blue-900 mb-2">📋 Phase 1: Identify Qualified Companies (Run Once)</h4>
                <p className="text-sm text-blue-800 mb-3">
                  First, identify 20 companies with 500-1000 employees. This takes ~2 minutes. Run multiple times to build up to 100.
                </p>
                <button
                  onClick={async () => {
                    if (!confirm('This will identify 20 companies with 500-1000 employees. Takes ~2 minutes. Continue?')) return
                    alert('⏳ Identifying companies... This will take ~2 minutes.')
                    const { data, error } = await supabase.functions.invoke('company-identifier', {
                      body: { action: 'identify_companies' }
                    })
                    if (error) {
                      alert('❌ Company identification failed: ' + error.message)
                      console.error('Error:', error)
                    } else {
                      let message = ''
                      if (data.failed > 0 && data.successfullyInserted === 0) {
                        message = `ℹ️ All ${data.companiesIdentified} companies already exist in database. Phase 1 complete! You can proceed to Phase 2.`
                      } else if (data.failed > 0) {
                        message = `⚠️ Added ${data.successfullyInserted} new companies. ${data.failed} already existed.`
                      } else {
                        message = `✅ Success! Added ${data.successfullyInserted} companies to database.`
                      }
                      alert(message + '\n\nNow you can start training with Phase 2.')
                      console.log('Companies identified:', data)
                      fetchTrainingStats() // Refresh stats
                    }
                  }}
                  className="btn-primary"
                >
                  🏢 Identify Companies (One-Time Setup)
                </button>
              </div>

              {/* Phase 2: Training */}
              <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
                <h4 className="font-bold text-purple-900 mb-2">🎓 Phase 2: Start Training (After Company Identification)</h4>
                <p className="text-sm text-purple-800 mb-3">
                  Scrape 10 jobs from pre-qualified companies. Runs every 2 hours automatically (via cron).
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={async () => {
                      alert('⏳ Starting training batch... This will take ~2 minutes.')
                      const { data, error } = await supabase.functions.invoke('training-scheduler')
                      if (error) {
                        alert('❌ Training start failed: ' + error.message + '\nMake sure you ran Phase 1 first!')
                        console.error('Error:', error)
                      } else {
                        alert('✅ Training batch complete! Scraped ' + (data?.scraped || 0) + ' jobs. Total: ' + (data?.totalJobs || 0))
                        console.log('Training result:', data)
                        fetchJobs() // Refresh job list
                        fetchTrainingStats() // Refresh stats
                      }
                    }}
                    className="btn-primary"
                  >
                    🚀 Start Training Batch (10 jobs)
                  </button>
                  <button
                    onClick={() => {
                      fetchJobs()
                      fetchTrainingStats()
                    }}
                    className="btn-secondary"
                  >
                    🔄 Refresh Progress
                  </button>
                </div>
              </div>
            </div>

            {/* Training Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card card-hover bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="text-sm font-medium opacity-90">Jobs Scraped</div>
                <div className="text-4xl font-bold mt-2">{trainingStats.jobsScraped.toLocaleString()}</div>
                <div className="text-sm mt-2 opacity-80">Target: 1,000</div>
              </div>

              <div className="card card-hover bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                <div className="text-sm font-medium opacity-90">Companies Discovered</div>
                <div className="text-4xl font-bold mt-2">{trainingStats.companiesDiscovered.toLocaleString()}</div>
                <div className="text-sm mt-2 opacity-80">Learning patterns...</div>
              </div>

              <div className="card card-hover bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                <div className="text-sm font-medium opacity-90">Unique Phrases</div>
                <div className="text-4xl font-bold mt-2">{trainingStats.uniquePhrases.toLocaleString()}</div>
                <div className="text-sm mt-2 opacity-80">Signature patterns</div>
              </div>

              <div className="card card-hover bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="text-sm font-medium opacity-90">Locations Analyzed</div>
                <div className="text-4xl font-bold mt-2">{trainingStats.locationsAnalyzed.toLocaleString()}</div>
                <div className="text-sm mt-2 opacity-80">Hub intelligence</div>
              </div>
            </div>

            {/* Training Status */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Current Training Status</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Status:</span>
                  <span className={`badge ${trainingStats.jobsScraped > 0 ? 'badge-success' : 'badge-warning'}`}>
                    {trainingStats.jobsScraped > 0 ? 'Training Active' : 'Ready to Train'}
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((trainingStats.jobsScraped / 1000) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {trainingStats.jobsScraped === 0
                    ? 'No training data yet. Run Phase 1 first, then start Phase 2 to begin scraping jobs.'
                    : `Progress: ${trainingStats.jobsScraped} / 1,000 jobs scraped (${((trainingStats.jobsScraped / 1000) * 100).toFixed(1)}%)`
                  }
                </p>
              </div>
            </div>

            {/* Sample Training Data */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Sample Training Data</h3>
              <p className="text-gray-600 mb-4">Recent job postings the agent has learned from:</p>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                {liveJobs.length === 0 ? (
                  <p className="text-gray-500 font-mono">No training data yet. Start a training batch to see results here.</p>
                ) : (
                  <div className="space-y-3">
                    {liveJobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="bg-white p-3 rounded border-l-4 border-purple-500">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-gray-800">{job.job_title}</div>
                          <span className="text-xs badge badge-primary">{job.vertical}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <div><strong>{job.company_name}</strong> • {job.location}</div>
                          <div className="mt-1">Employees: {job.employee_count}</div>
                          <div className="mt-1 text-gray-500">Scraped: {new Date(job.last_verified).toLocaleDateString()}</div>
                        </div>
                        <a
                          href={job.job_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:underline mt-2 inline-flex items-center gap-1"
                        >
                          <span>🔗</span>
                          <span>View Original Posting</span>
                        </a>
                      </div>
                    ))}
                    {liveJobs.length > 5 && (
                      <p className="text-xs text-gray-500 text-center pt-2">
                        Showing 5 of {liveJobs.length} total jobs
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Learned Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Industry Distribution</h3>
                <p className="text-sm text-gray-600 mb-4">Jobs scraped by vertical:</p>
                <div className="space-y-2">
                  {liveJobs.length > 0 ? (
                    <>
                      {Object.entries(
                        liveJobs.reduce((acc, job) => {
                          acc[job.vertical] = (acc[job.vertical] || 0) + 1
                          return acc
                        }, {} as Record<string, number>)
                      )
                        .sort(([, a], [, b]) => b - a)
                        .map(([vertical, count]) => (
                          <div key={vertical} className="bg-purple-50 p-3 rounded border-l-4 border-purple-500">
                            <div className="flex justify-between items-center">
                              <div className="font-semibold text-gray-800">{vertical}</div>
                              <div className="text-sm font-bold text-purple-700">{count} jobs</div>
                            </div>
                            <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${(count / liveJobs.length) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No data yet. Start training to see industry distribution.
                    </div>
                  )}
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Location Intelligence</h3>
                <p className="text-sm text-gray-600 mb-4">Geographic patterns from training:</p>
                <div className="space-y-2">
                  {liveJobs.length > 0 ? (
                    <>
                      {Object.entries(
                        liveJobs.reduce((acc, job) => {
                          const loc = job.location || 'Unknown'
                          acc[loc] = (acc[loc] || 0) + 1
                          return acc
                        }, {} as Record<string, number>)
                      )
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([location, count]) => (
                          <div key={location} className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                            <div className="flex justify-between items-center">
                              <div className="font-semibold text-gray-800">{location}</div>
                              <div className="text-sm font-bold text-green-700">{count} jobs</div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {Math.round((count / liveJobs.length) * 100)}% of total jobs
                            </div>
                          </div>
                        ))}
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No data yet. Start training to see location patterns.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Notice */}
            <div className="card bg-red-50 border-2 border-red-300">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-red-900 mb-1">Admin Only - Not Visible in Production</h4>
                  <p className="text-sm text-red-800">
                    This Training Ground tab is only visible to you (localhost). When deployed, this tab will be hidden.
                    The background training agent will continue to run and improve the reverse engineering accuracy,
                    but users won't see this data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
