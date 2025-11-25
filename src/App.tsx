import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { supabase, type Job } from './lib/supabase'
import { OrchestratorAgent } from './agents/orchestrator'
import {
  LayoutDashboard,
  Target,
  Users,
  GraduationCap,
  TrendingUp,
  DollarSign,
  UserSearch,
  Factory,
  Monitor,
  Wallet,
  Search,
  Download,
  Eye,
  ExternalLink,
  Check,
  X,
  AlertTriangle,
  Clipboard,
  Mail,
  Phone,
  User,
  Building2,
  RefreshCw,
  Loader2,
  Lightbulb,
  BarChart3,
  Zap,
  CheckCircle2,
  XCircle,
  UserPlus,
  FileText,
  Plus
} from 'lucide-react'

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

// Recruiter-to-Jobs Ratio Data
const recruiterJobRatioData = [
  {
    company: 'Goldman Sachs',
    totalHRStaff: 45,
    internalRecruiters: 2,
    contractRecruiters: 5,
    openJobs: 127,
    jobsPerRecruiter: 63.5,
    scenario: 'High Demand - Low Recruiters',
    status: 'critical',
    breakdown: {
      hrLeaders: 8,
      hrGeneralists: 25,
      recruiters: 2,
      contractRecruiters: 5,
      coordinators: 10
    }
  },
  {
    company: 'JP Morgan Chase',
    totalHRStaff: 120,
    internalRecruiters: 18,
    contractRecruiters: 0,
    openJobs: 89,
    jobsPerRecruiter: 4.9,
    scenario: 'Well Staffed',
    status: 'healthy',
    breakdown: {
      hrLeaders: 15,
      hrGeneralists: 60,
      recruiters: 18,
      contractRecruiters: 0,
      coordinators: 27
    }
  },
  {
    company: 'Morgan Stanley',
    totalHRStaff: 38,
    internalRecruiters: 3,
    contractRecruiters: 8,
    openJobs: 156,
    jobsPerRecruiter: 52.0,
    scenario: 'High Demand - Low Recruiters',
    status: 'critical',
    breakdown: {
      hrLeaders: 6,
      hrGeneralists: 20,
      recruiters: 3,
      contractRecruiters: 8,
      coordinators: 9
    }
  },
  {
    company: 'Citigroup',
    totalHRStaff: 95,
    internalRecruiters: 22,
    contractRecruiters: 0,
    openJobs: 45,
    jobsPerRecruiter: 2.0,
    scenario: 'Over Staffed',
    status: 'efficient',
    breakdown: {
      hrLeaders: 12,
      hrGeneralists: 45,
      recruiters: 22,
      contractRecruiters: 0,
      coordinators: 16
    }
  }
]

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
        console.log('Analysis saved to Supabase')
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
    <div className="min-h-screen">
      {/* Navigation Sidebar */}
      <div className="fixed left-0 top-0 h-full w-72 bg-white/90 backdrop-blur-xl shadow-2xl shadow-gray-900/10 border-r border-gray-200/50 z-50">
        <div className="p-8 pb-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white text-xl font-bold">R</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                RecruitIQ
              </h1>
              <p className="text-gray-500 text-xs font-medium mt-0.5">Intelligence Platform</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'leads', label: 'Lead Intelligence', icon: Target },
            { id: 'recruiter-ratio', label: 'Recruiter Analysis', icon: Users },
            { id: 'training', label: 'Training Ground', icon: GraduationCap },
            { id: 'analytics', label: 'Talent Analytics', icon: TrendingUp },
            { id: 'funding', label: 'Funding Events', icon: DollarSign },
            { id: 'icp', label: 'ICP Lookalikes', icon: UserSearch }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-item ${activeTab === item.id ? 'sidebar-nav-item-active' : ''}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="section-title">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'leads' && 'Lead Intelligence & Job Monitoring'}
              {activeTab === 'recruiter-ratio' && 'Recruiter-to-Jobs Ratio Analysis'}
              {activeTab === 'reverse' && 'Reverse Engineering'}
              {activeTab === 'analytics' && 'Talent Analytics'}
              {activeTab === 'funding' && 'Funding Events'}
              {activeTab === 'icp' && 'ICP Lookalike Companies'}
              {activeTab === 'training' && 'Training Ground'}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Last updated: {lastUpdated.toLocaleString()}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200/50">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Live
              </span>
            </div>
          </div>
          <button
            onClick={fetchJobs}
            disabled={loading}
            className="btn-ghost flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="kpi-card bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-sm font-semibold opacity-90 mb-1">Leads Delivered</div>
                  <div className="text-5xl font-bold mb-2">96</div>
                  <div className="text-xs font-medium opacity-80 flex items-center gap-1">
                    <span className="text-emerald-300">↑ 18%</span>
                    <span>from last week</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              <div className="kpi-card bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-sm font-semibold opacity-90 mb-1">Jobs Analyzed</div>
                  <div className="text-5xl font-bold mb-2">1,342</div>
                  <div className="text-xs font-medium opacity-80 flex items-center gap-1">
                    <span className="text-emerald-300">↑ 18%</span>
                    <span>from last week</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              <div className="kpi-card bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-sm font-semibold opacity-90 mb-1">Match Rate</div>
                  <div className="text-5xl font-bold mb-2">87%</div>
                  <div className="text-xs font-medium opacity-80 flex items-center gap-1">
                    <span className="text-emerald-300">↑ 5%</span>
                    <span>from last week</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              <div className="kpi-card bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-sm font-semibold opacity-90 mb-1">New Opportunities</div>
                  <div className="text-5xl font-bold mb-2">56</div>
                  <div className="text-xs font-medium opacity-80 flex items-center gap-1">
                    <span className="text-emerald-300">↑ 12%</span>
                    <span>from last week</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card card-hover">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Lead Activity Trend by Industry</h3>
                  <p className="text-sm text-gray-500">NY/NJ/CT companies (500-1,000 employees)</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={leadActivityByVertical}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Manufacturing" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Information Technology" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Finance & Accounting" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="card card-hover">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Top Companies by Lead Volume</h3>
                  <p className="text-sm text-gray-500">Real NY/NJ/CT companies actively hiring</p>
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
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                    <Factory className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Manufacturing</h3>
                    <p className="text-xs text-gray-500">{groupedJobs.manufacturing.length} companies tracked</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {groupedJobs.manufacturing.map((job, i) => (
                    <a
                      key={job.id}
                      href={job.job_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gradient-to-r from-amber-50/50 to-orange-50/50 p-4 rounded-xl border border-amber-200/50 hover:shadow-md hover:border-amber-300/50 transition-all group"
                    >
                      <div className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-amber-700 transition-colors">{job.company_name}</div>
                      <div className="text-xs text-gray-600 mb-2">{job.location} • {job.employee_count} employees</div>
                      <div className="text-xs text-amber-700 font-medium mb-2">Hiring: {job.job_title}</div>
                      <div className="text-xs text-amber-600 flex items-center gap-1.5 font-medium">
                        <ExternalLink className="w-3 h-3" />
                        <span className="group-hover:underline">View Job Posting</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* IT Companies */}
              <div className="card card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Information Technology</h3>
                    <p className="text-xs text-gray-500">{groupedJobs.it.length} companies tracked</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {groupedJobs.it.map((job) => (
                    <a
                      key={job.id}
                      href={job.job_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-4 rounded-xl border border-blue-200/50 hover:shadow-md hover:border-blue-300/50 transition-all group"
                    >
                      <div className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-700 transition-colors">{job.company_name}</div>
                      <div className="text-xs text-gray-600 mb-2">{job.location} • {job.employee_count} employees</div>
                      <div className="text-xs text-blue-700 font-medium mb-2">Hiring: {job.job_title}</div>
                      <div className="text-xs text-blue-600 flex items-center gap-1.5 font-medium">
                        <ExternalLink className="w-3 h-3" />
                        <span className="group-hover:underline">View Job Posting</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Finance Companies */}
              <div className="card card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Finance & Accounting</h3>
                    <p className="text-xs text-gray-500">{groupedJobs.finance.length} companies tracked</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {groupedJobs.finance.map((job) => (
                    <a
                      key={job.id}
                      href={job.job_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-4 rounded-xl border border-emerald-200/50 hover:shadow-md hover:border-emerald-300/50 transition-all group"
                    >
                      <div className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-emerald-700 transition-colors">{job.company_name}</div>
                      <div className="text-xs text-gray-600 mb-2">{job.location} • {job.employee_count} employees</div>
                      <div className="text-xs text-emerald-700 font-medium mb-2">Hiring: {job.job_title}</div>
                      <div className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
                        <ExternalLink className="w-3 h-3" />
                        <span className="group-hover:underline">View Job Posting</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leads Tab - Combined with Job Monitoring */}
        {activeTab === 'leads' && (
          <div className="space-y-8 animate-fade-in">
            {/* Search and Actions */}
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="Search jobs, companies, or people..."
                className="input-modern flex-1"
              />
              <button className="btn-primary flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
              <button className="btn-ghost flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>

            {/* Job Monitoring Section */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Job Monitoring</h3>
                  <p className="text-sm text-gray-500">Track career page changes and new job postings</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                {jobMonitoring.map((monitor, i) => (
                  <div key={i} className="card card-hover bg-gradient-to-r from-gray-50/50 to-blue-50/30 border border-gray-200/50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{monitor.company}</h4>
                          <span className={`badge ${monitor.status === 'Change Detected' ? 'badge-warning' : 'badge-success'}`}>
                            {monitor.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          <span className="font-semibold">Career Page:</span>
                          <a href={monitor.careerPageUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline ml-2">
                            {monitor.careerPageUrl}
                          </a>
                        </div>
                        <div className="text-sm text-gray-500">
                          Last checked: {monitor.lastChecked}
                        </div>
                      </div>
                    </div>

                    {monitor.changes.length > 0 && (
                      <div className="space-y-2 mt-4 pt-4 border-t border-gray-200/50">
                        <h5 className="font-semibold text-gray-700 mb-2">Recent Changes:</h5>
                        {monitor.changes.map((change, j) => (
                          <div key={j} className={`p-3 rounded-xl border-l-4 ${
                            change.type === 'New Job'
                              ? 'bg-emerald-50/50 border-emerald-500'
                              : 'bg-amber-50/50 border-amber-500'
                          }`}>
                            <div className="flex items-center gap-2">
                              {change.type === 'New Job'
                                ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                : <XCircle className="w-4 h-4 text-amber-600" />
                              }
                              <span className="font-semibold">{change.type}:</span>
                              <span className="text-gray-800">{change.title}</span>
                            </div>
                            <div className="text-sm text-gray-600 ml-6 mt-1">
                              {change.dept} • {change.date}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-gray-50/50 border-2 border-dashed border-gray-300/50 rounded-xl p-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Add New Monitor</h4>
                  <p className="text-gray-600 mb-4 text-sm">Track career page changes for any company</p>
                  <div className="flex gap-3 max-w-2xl mx-auto">
                    <input
                      type="text"
                      placeholder="Company name or career page URL..."
                      className="input-modern flex-1"
                    />
                    <button className="btn-primary">Start Monitoring</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Intelligence Section */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Lead Intelligence</h3>
                  <p className="text-sm text-gray-500">Detailed contact information and hiring insights</p>
                </div>
              </div>

            <div className="space-y-4">
              {mockLeads.map(lead => (
                <div key={lead.id} className="card card-hover animate-slide-up">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-2xl font-bold text-gray-900">{lead.jobTitle}</h3>
                        <span className={`badge ${lead.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                          {lead.status}
                        </span>
                        <span className="badge badge-primary">
                          {lead.matchScore}% Match
                        </span>
                      </div>
                      <div className="text-gray-600 flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-primary-600">{lead.company}</span>
                        <span className="text-gray-400">•</span>
                        <span>{lead.location}</span>
                        <span className="text-gray-400">•</span>
                        <span>Posted {lead.postedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" /> Hiring Managers
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
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              <div>
                                <div>{manager.name}</div>
                                <div className="text-xs text-gray-500 font-normal">{manager.title}</div>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>

                      <h4 className="font-semibold text-gray-700 mt-4 mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> HR Leaders
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
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              <div>
                                <div>{hr.name}</div>
                                <div className="text-xs text-gray-500 font-normal">{hr.title}</div>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>

                      <h4 className="font-semibold text-gray-700 mt-4 mb-2 flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> Recruiters
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
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
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
                        <Mail className="w-4 h-4" /> Email & Deliverability
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
                              <button className="text-primary-600 hover:text-primary-800"><Clipboard className="w-4 h-4" /></button>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className={`font-semibold flex items-center gap-1 ${
                                emailObj.status === 'verified' ? 'text-success-700' : 'text-warning-700'
                              }`}>
                                {emailObj.status === 'verified' ? <><Check className="w-3 h-3" /> Verified Email</> : <><AlertTriangle className="w-3 h-3" /> Catch-all Risky Email</>}
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
                        <Phone className="w-4 h-4" /> Phone Numbers
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
                              <button className="text-primary-600 hover:text-primary-800"><Clipboard className="w-4 h-4" /></button>
                            </div>
                            <div className="text-xs">
                              <span className={`font-semibold flex items-center gap-1 ${
                                phoneObj.verified ? 'text-success-700' : 'text-gray-600'
                              }`}>
                                {phoneObj.verified ? <><Check className="w-3 h-3" /> Phone Number Verified</> : <><X className="w-3 h-3" /> Phone Number Not Verified</>}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200/50 flex gap-3">
                    <button className="btn-primary flex-1">View Full Details</button>
                    <button className="btn-ghost">Save to CRM</button>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        )}

        {/* Recruiter-to-Jobs Ratio Tab */}
        {activeTab === 'recruiter-ratio' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="card bg-gradient-to-br from-indigo-50/50 to-purple-50/30 border border-indigo-200/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Recruiter-to-Jobs Ratio Analysis</h3>
                  <p className="text-sm text-gray-600 mt-1">Visualizing staffing efficiency and hiring capacity across companies</p>
                </div>
              </div>
            </div>

            {/* Company Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recruiterJobRatioData.map((company, idx) => (
                <div key={idx} className={`card card-hover border-2 ${
                  company.status === 'critical' ? 'border-rose-300 bg-gradient-to-br from-rose-50/50 to-orange-50/30' :
                  company.status === 'healthy' ? 'border-emerald-300 bg-gradient-to-br from-emerald-50/50 to-teal-50/30' :
                  'border-blue-300 bg-gradient-to-br from-blue-50/50 to-indigo-50/30'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{company.company}</h4>
                      <span className={`badge ${
                        company.status === 'critical' ? 'badge-danger' :
                        company.status === 'healthy' ? 'badge-success' :
                        'badge-primary'
                      }`}>
                        {company.scenario}
                      </span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                      <div className="text-xs font-semibold text-gray-500 mb-1">Total HR Staff</div>
                      <div className="text-2xl font-bold text-gray-900">{company.totalHRStaff}</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                      <div className="text-xs font-semibold text-gray-500 mb-1">Internal Recruiters</div>
                      <div className="text-2xl font-bold text-gray-900">{company.internalRecruiters}</div>
                      {company.contractRecruiters > 0 && (
                        <div className="text-xs text-rose-600 font-semibold mt-1">
                          + {company.contractRecruiters} Contract
                        </div>
                      )}
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                      <div className="text-xs font-semibold text-gray-500 mb-1">Open Jobs</div>
                      <div className="text-2xl font-bold text-gray-900">{company.openJobs}</div>
                    </div>
                    <div className={`bg-white/60 backdrop-blur-sm rounded-xl p-4 border ${
                      company.jobsPerRecruiter > 30 ? 'border-rose-300' :
                      company.jobsPerRecruiter < 5 ? 'border-emerald-300' :
                      'border-amber-300'
                    }`}>
                      <div className="text-xs font-semibold text-gray-500 mb-1">Jobs per Recruiter</div>
                      <div className={`text-2xl font-bold ${
                        company.jobsPerRecruiter > 30 ? 'text-rose-600' :
                        company.jobsPerRecruiter < 5 ? 'text-emerald-600' :
                        'text-amber-600'
                      }`}>
                        {company.jobsPerRecruiter.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Visual Ratio Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">Recruiter Capacity</span>
                      <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                        {company.jobsPerRecruiter > 30 ? <><AlertTriangle className="w-3 h-3 text-rose-600" /> Overloaded</> :
                         company.jobsPerRecruiter < 5 ? <><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Optimal</> :
                         <><Zap className="w-3 h-3 text-amber-600" /> High</>}
                      </span>
                    </div>
                    <div className="relative h-10 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div className="absolute inset-0 flex">
                        {/* Recruiters bar */}
                        <div 
                          className="bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-md rounded-full"
                          style={{ width: `${Math.min((company.internalRecruiters / (company.openJobs + company.internalRecruiters)) * 100, 100)}%` }}
                        >
                          {company.internalRecruiters} {company.contractRecruiters > 0 ? `+ ${company.contractRecruiters} Contract` : ''} Recruiters
                        </div>
                        {/* Jobs bar */}
                        <div 
                          className={`flex items-center justify-center text-white text-xs font-bold shadow-md ${
                            company.jobsPerRecruiter > 30 ? 'bg-gradient-to-r from-rose-500 to-red-500' :
                            company.jobsPerRecruiter < 5 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                            'bg-gradient-to-r from-amber-500 to-orange-500'
                          }`}
                          style={{ width: `${Math.min((company.openJobs / (company.openJobs + company.internalRecruiters)) * 100, 100)}%` }}
                        >
                          {company.openJobs} Jobs
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* HR Breakdown */}
                  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                    <div className="text-xs font-semibold text-gray-600 mb-3">HR Staff Breakdown</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                          <span className="text-xs text-gray-700">Leaders: {company.breakdown.hrLeaders}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-xs text-gray-700">Generalists: {company.breakdown.hrGeneralists}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-xs text-gray-700">Recruiters: {company.breakdown.recruiters}</span>
                        </div>
                        {company.breakdown.contractRecruiters > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-600"></div>
                            <span className="text-xs text-gray-700 font-semibold">Contract Recruiters: {company.breakdown.contractRecruiters}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                          <span className="text-xs text-gray-700">Coordinators: {company.breakdown.coordinators}</span>
                        </div>
                      </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Chart */}
            <div className="card bg-gradient-to-br from-indigo-50/50 to-purple-50/30 border border-indigo-200/50">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Scenario Comparison</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-rose-200/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                    </div>
                    <h5 className="text-lg font-bold text-gray-900">High Demand - Low Recruiters</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Companies with many open jobs but few internal recruiters face significant hiring challenges.
                    This scenario indicates high opportunity for external recruiting support.
                  </p>
                  <div className="space-y-3">
                    {recruiterJobRatioData.filter(c => c.status === 'critical').map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-rose-50/50 rounded-lg border border-rose-200/50">
                        <div>
                          <span className="font-semibold text-gray-900">{c.company}</span>
                          <div className="text-xs text-gray-600 mt-1">
                            {c.internalRecruiters} recruiters • {c.openJobs} jobs
                          </div>
                        </div>
                        <span className="font-bold text-rose-600 text-lg">{c.jobsPerRecruiter.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-emerald-200/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h5 className="text-lg font-bold text-gray-900">Well Staffed / Efficient</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Companies with balanced recruiter-to-job ratios have better hiring capacity and efficiency.
                    These companies may have less urgent need for external support.
                  </p>
                  <div className="space-y-3">
                    {recruiterJobRatioData.filter(c => c.status !== 'critical').map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/50">
                        <div>
                          <span className="font-semibold text-gray-900">{c.company}</span>
                          <div className="text-xs text-gray-600 mt-1">
                            {c.internalRecruiters} recruiters • {c.openJobs} jobs
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600 text-lg">{c.jobsPerRecruiter.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-primary-600">84</div>
                <div className="text-gray-600 mt-1">Candidates Open to Work</div>
              </div>
              <div className="card card-hover text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-accent-600" />
                </div>
                <div className="text-3xl font-bold text-accent-600">67%</div>
                <div className="text-gray-600 mt-1">Movement from Oracle</div>
              </div>
              <div className="card card-hover text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-success-600" />
                </div>
                <div className="text-3xl font-bold text-success-600">23</div>
                <div className="text-gray-600 mt-1">Active Transitions This Week</div>
              </div>
            </div>
          </div>
        )}


        {/* Funding Events Tab */}
        {activeTab === 'funding' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card card-hover text-center bg-gradient-to-br from-success-500 to-success-600 text-white">
                <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold">$700M</div>
                <div className="mt-1 opacity-90">Total Raised This Month</div>
              </div>
              <div className="card card-hover text-center bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold">12</div>
                <div className="mt-1 opacity-90">Companies Funded</div>
              </div>
              <div className="card card-hover text-center bg-gradient-to-br from-accent-500 to-accent-600 text-white">
                <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
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
                    <div className="mt-3 bg-success-50 border-l-4 border-success-500 p-3 rounded flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-success-800">
                        <span className="font-bold">Opportunity:</span> This company matches your client's ICP.
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
              <div className="flex items-center gap-3 mb-2">
                <UserSearch className="w-6 h-6" />
                <h3 className="text-xl font-bold">AI-Powered ICP Lookalike Finder</h3>
              </div>
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
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <Search className="w-7 h-7 text-primary-600" />
                </div>
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
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="w-6 h-6" />
                <h3 className="text-xl font-bold">AI Training Ground (Admin Only)</h3>
              </div>
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
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Phase 1: Identify Qualified Companies (Run Once)</h4>
                <p className="text-sm text-blue-800 mb-3">
                  First, identify 20 companies with 500-1000 employees. This takes ~2 minutes. Run multiple times to build up to 100.
                </p>
                <button
                  onClick={async () => {
                    if (!confirm('This will identify 20 companies with 500-1000 employees. Takes ~2 minutes. Continue?')) return
                    alert('Identifying companies... This will take ~2 minutes.')
                    const { data, error } = await supabase.functions.invoke('company-identifier', {
                      body: { action: 'identify_companies' }
                    })
                    if (error) {
                      alert('Company identification failed: ' + error.message)
                      console.error('Error:', error)
                    } else {
                      let message = ''
                      if (data.failed > 0 && data.successfullyInserted === 0) {
                        message = `All ${data.companiesIdentified} companies already exist in database. Phase 1 complete! You can proceed to Phase 2.`
                      } else if (data.failed > 0) {
                        message = `Added ${data.successfullyInserted} new companies. ${data.failed} already existed.`
                      } else {
                        message = `Success! Added ${data.successfullyInserted} companies to database.`
                      }
                      alert(message + '\n\nNow you can start training with Phase 2.')
                      console.log('Companies identified:', data)
                      fetchTrainingStats() // Refresh stats
                    }
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" /> Identify Companies (One-Time Setup)
                </button>
              </div>

              {/* Phase 2: Training */}
              <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
                <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Phase 2: Start Training (After Company Identification)</h4>
                <p className="text-sm text-purple-800 mb-3">
                  Scrape 10 jobs from pre-qualified companies. Runs every 2 hours automatically (via cron).
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={async () => {
                      alert('Starting training batch... This will take ~2 minutes.')
                      const { data, error } = await supabase.functions.invoke('training-scheduler')
                      if (error) {
                        alert('Training start failed: ' + error.message + '\nMake sure you ran Phase 1 first!')
                        console.error('Error:', error)
                      } else {
                        alert('Training batch complete! Scraped ' + (data?.scraped || 0) + ' jobs. Total: ' + (data?.totalJobs || 0))
                        console.log('Training result:', data)
                        fetchJobs() // Refresh job list
                        fetchTrainingStats() // Refresh stats
                      }
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" /> Start Training Batch (10 jobs)
                  </button>
                  <button
                    onClick={() => {
                      fetchJobs()
                      fetchTrainingStats()
                    }}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Refresh Progress
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
                          <ExternalLink className="w-3 h-3" />
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
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
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
