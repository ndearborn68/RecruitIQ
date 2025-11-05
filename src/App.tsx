import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { supabase, type Job } from './lib/supabase'

// ==================== SAMPLE DATA ====================

// LinkedIn Posts Data
const linkedinPosts = [
  {
    id: 1,
    author: 'Sarah Chen',
    authorTitle: 'VP of Engineering @ Stripe',
    authorLinkedIn: 'https://linkedin.com/in/sarahchen',
    company: 'Stripe',
    postDate: '2025-11-02',
    content: "Excited to announce we're expanding our Platform Engineering team! Looking for experienced engineers who are passionate about...",
    engagement: { likes: 342, comments: 28, shares: 15 },
    signals: ['Hiring Signal', 'Team Expansion'],
    relevance: 95
  },
  {
    id: 2,
    author: 'Michael Rodriguez',
    authorTitle: 'Chief Technology Officer @ Plaid',
    authorLinkedIn: 'https://linkedin.com/in/mrodriguez',
    company: 'Plaid',
    postDate: '2025-11-01',
    content: "After our Series D, we're doubling down on our infrastructure. Hiring 20+ engineers across backend, data, and platform teams...",
    engagement: { likes: 589, comments: 45, shares: 32 },
    signals: ['Funding Mention', 'Hiring Signal', 'Team Growth'],
    relevance: 98
  },
  {
    id: 3,
    author: 'Jennifer Wu',
    authorTitle: 'Head of Talent Acquisition @ Databricks',
    authorLinkedIn: 'https://linkedin.com/in/jenniferwu',
    company: 'Databricks',
    postDate: '2025-10-31',
    content: "Big news! Databricks is opening a new engineering hub in NYC. We're looking for senior engineers to help build...",
    engagement: { likes: 421, comments: 67, shares: 28 },
    signals: ['Office Opening', 'Hiring Signal', 'Location Expansion'],
    relevance: 92
  }
]

// Fresh Open Jobs Data
const freshOpenJobs = [
  {
    id: 1,
    jobTitle: 'Senior Backend Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    salary: '$180,000 - $250,000',
    postedDate: '2025-11-03',
    postedHoursAgo: 8,
    jobUrl: 'https://stripe.com/jobs/listing/senior-backend-engineer',
    department: 'Platform Engineering',
    remote: 'Hybrid',
    urgency: 'High'
  },
  {
    id: 2,
    jobTitle: 'Staff Software Engineer - Data Infrastructure',
    company: 'Plaid',
    location: 'New York, NY',
    salary: '$200,000 - $280,000',
    postedDate: '2025-11-03',
    postedHoursAgo: 12,
    jobUrl: 'https://plaid.com/careers/opening/data-engineer',
    department: 'Data Platform',
    remote: 'Remote',
    urgency: 'High'
  },
  {
    id: 3,
    jobTitle: 'Principal Engineer - Distributed Systems',
    company: 'Databricks',
    location: 'New York, NY',
    salary: '$220,000 - $320,000',
    postedDate: '2025-11-02',
    postedHoursAgo: 24,
    jobUrl: 'https://databricks.com/company/careers/open-positions',
    department: 'Core Infrastructure',
    remote: 'Hybrid',
    urgency: 'Medium'
  },
  {
    id: 4,
    jobTitle: 'Engineering Manager - Backend Services',
    company: 'Coinbase',
    location: 'Remote (US)',
    salary: '$190,000 - $270,000',
    postedDate: '2025-11-02',
    postedHoursAgo: 30,
    jobUrl: 'https://coinbase.com/careers',
    department: 'Product Engineering',
    remote: 'Remote',
    urgency: 'Medium'
  }
]

// Stakeholders & Hiring Managers Data
const stakeholders = [
  {
    id: 1,
    name: 'Sarah Chen',
    title: 'VP of Engineering',
    company: 'Stripe',
    department: 'Engineering',
    role: 'Hiring Manager',
    linkedIn: 'https://linkedin.com/in/sarahchen',
    email: 'sarah.chen@stripe.com',
    emailStatus: 'verified',
    emailDeliverability: 95,
    phone: '+1-650-555-0123',
    phoneVerified: true,
    recentActivity: 'Posted about hiring 2 days ago',
    influence: 'High'
  },
  {
    id: 2,
    name: 'Jennifer Wu',
    title: 'Head of Talent Acquisition',
    company: 'Databricks',
    department: 'People/HR',
    role: 'Recruiter',
    linkedIn: 'https://linkedin.com/in/jenniferwu',
    email: 'jennifer.wu@databricks.com',
    emailStatus: 'verified',
    emailDeliverability: 92,
    phone: '+1-415-555-0198',
    phoneVerified: true,
    recentActivity: 'Announced NYC office opening 3 days ago',
    influence: 'High'
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    title: 'Chief Technology Officer',
    company: 'Plaid',
    department: 'Engineering',
    role: 'Executive',
    linkedIn: 'https://linkedin.com/in/mrodriguez',
    email: 'michael.r@plaid.com',
    emailStatus: 'verified',
    emailDeliverability: 98,
    phone: '+1-415-555-0247',
    phoneVerified: true,
    recentActivity: 'Mentioned Series D hiring 4 days ago',
    influence: 'Very High'
  },
  {
    id: 4,
    name: 'David Park',
    title: 'Director of Engineering',
    company: 'Coinbase',
    department: 'Engineering',
    role: 'Hiring Manager',
    linkedIn: 'https://linkedin.com/in/davidpark',
    email: 'david.park@coinbase.com',
    emailStatus: 'catch-all',
    emailDeliverability: 68,
    phone: '+1-650-555-0334',
    phoneVerified: false,
    recentActivity: 'Posted job opening 1 week ago',
    influence: 'Medium'
  }
]

// Website Job Monitoring Data
const websiteMonitoring = [
  {
    id: 1,
    company: 'Stripe',
    careerPageUrl: 'https://stripe.com/jobs',
    lastChecked: '2025-11-03 09:00 AM',
    status: 'New Jobs Detected',
    changes: [
      { type: 'New Job Posted', title: 'Senior Backend Engineer', department: 'Platform Engineering', timestamp: '2025-11-03 08:00 AM' },
      { type: 'New Job Posted', title: 'Staff Product Manager', department: 'Product', timestamp: '2025-11-03 06:30 AM' }
    ],
    jobCount: 247,
    previousJobCount: 245,
    monitoring: 'Active'
  },
  {
    id: 2,
    company: 'Databricks',
    careerPageUrl: 'https://databricks.com/company/careers',
    lastChecked: '2025-11-03 09:00 AM',
    status: 'No Changes',
    changes: [],
    jobCount: 156,
    previousJobCount: 156,
    monitoring: 'Active'
  },
  {
    id: 3,
    company: 'Plaid',
    careerPageUrl: 'https://plaid.com/careers',
    lastChecked: '2025-11-03 09:00 AM',
    status: 'Jobs Removed',
    changes: [
      { type: 'Job Removed', title: 'Junior Software Engineer', department: 'Engineering', timestamp: '2025-11-02 04:00 PM' }
    ],
    jobCount: 89,
    previousJobCount: 90,
    monitoring: 'Active'
  }
]

// Reverse Engineered Jobs Data
const reverseEngineeredJobs = [
  {
    id: 1,
    competitorAgency: 'TechStaff Solutions',
    postedJobTitle: 'Senior Backend Developer - Fintech Client',
    location: 'San Francisco, CA',
    identifiedClient: 'Stripe',
    confidence: 94,
    matchIndicators: [
      'Location match (exact address: 510 Townsend St)',
      'Tech stack 95% match (Ruby, Go, PostgreSQL, Kubernetes)',
      'Salary range identical ($180k-$250k)',
      'Job description 89% similarity'
    ],
    competitorUrl: 'https://techstaff.com/jobs/backend-dev-fintech',
    originalJobUrl: 'https://stripe.com/jobs/listing/senior-backend-engineer',
    analysisDate: '2025-11-02',
    status: 'Verified Match'
  },
  {
    id: 2,
    competitorAgency: 'Elite Recruiting Partners',
    postedJobTitle: 'Data Infrastructure Engineer - Tech Startup',
    location: 'New York, NY',
    identifiedClient: 'Plaid (Suspected)',
    confidence: 87,
    matchIndicators: [
      'Location proximity (NYC Financial District)',
      'Tech stack overlap (Python, Kafka, Airflow)',
      'Posting date within 2 days of original',
      'Requirements 82% match'
    ],
    competitorUrl: 'https://eliterecruitingpartners.com/positions/data-eng',
    originalJobUrl: 'https://plaid.com/careers/opening/data-engineer',
    analysisDate: '2025-11-01',
    status: 'High Probability'
  }
]

// Job Changes & Executive Movements Data
const jobChanges = [
  {
    id: 1,
    person: 'Alex Thompson',
    previousTitle: 'Director of Engineering',
    newTitle: 'VP of Engineering',
    previousCompany: 'Google',
    newCompany: 'Stripe',
    changeDate: '2025-10-28',
    linkedIn: 'https://linkedin.com/in/alexthompson',
    signal: 'Likely hiring for their former team',
    relevance: 'High',
    teamSize: 'Likely building 15-20 person team'
  },
  {
    id: 2,
    person: 'Maria Santos',
    previousTitle: 'Senior Recruiter - Engineering',
    newTitle: 'Head of Technical Recruiting',
    previousCompany: 'Meta',
    newCompany: 'Databricks',
    changeDate: '2025-10-25',
    linkedIn: 'https://linkedin.com/in/mariasantos',
    signal: 'Major hiring push expected',
    relevance: 'Very High',
    teamSize: 'Building recruiting team of 5-8'
  },
  {
    id: 3,
    person: 'James Wilson',
    previousTitle: 'Engineering Manager',
    newTitle: 'Director of Engineering',
    previousCompany: 'Uber',
    newCompany: 'Coinbase',
    changeDate: '2025-10-20',
    linkedIn: 'https://linkedin.com/in/jameswilson',
    signal: 'Team expansion likely',
    relevance: 'Medium',
    teamSize: 'Expanding from 8 to 15+ engineers'
  }
]

// Funding Events Data
const fundingEvents = [
  {
    id: 1,
    company: 'Ramp',
    eventType: 'Series D',
    amount: '$300M',
    date: '2025-10-28',
    lead: 'Thrive Capital',
    valuation: '$8.1B',
    industry: 'Fintech',
    postFundingSignals: [
      'CEO announced 30% headcount growth',
      '5 new job postings within 48 hours',
      'Opening Austin office (15-20 hires expected)'
    ],
    hiringImpact: 'Very High',
    estimatedHires: '50-75 in next 6 months'
  },
  {
    id: 2,
    company: 'Anthropic',
    eventType: 'Series C',
    amount: '$450M',
    date: '2025-10-15',
    lead: 'Google',
    valuation: '$15B',
    industry: 'AI/ML',
    postFundingSignals: [
      'Announced research team doubling',
      '12 engineering roles posted',
      'Expanding SF and London offices'
    ],
    hiringImpact: 'Very High',
    estimatedHires: '100+ in next 6 months'
  },
  {
    id: 3,
    company: 'Scale AI',
    eventType: 'Series E Extension',
    amount: '$250M',
    date: '2025-10-10',
    lead: 'Accel',
    valuation: '$13.8B',
    industry: 'AI/ML',
    postFundingSignals: [
      'VP of Eng posted about team growth',
      '8 new positions opened',
      'Building ML Infrastructure team'
    ],
    hiringImpact: 'High',
    estimatedHires: '40-60 in next 6 months'
  }
]

// Company Events Data
const companyEvents = [
  {
    id: 1,
    company: 'Stripe',
    eventType: 'Product Launch',
    eventTitle: 'Stripe Banking-as-a-Service Platform Launch',
    date: '2025-11-01',
    description: 'Major new product line requiring significant engineering investment',
    hiringSignals: [
      'Job postings increased 40% in last week',
      'VP of Eng posted about team expansion',
      'New engineering org announced'
    ],
    impact: 'Very High',
    estimatedHires: '30-40 engineers needed',
    source: 'TechCrunch, Company Blog'
  },
  {
    id: 2,
    company: 'Databricks',
    eventType: 'Office Opening',
    eventTitle: 'New York Engineering Hub Opening',
    date: '2025-10-30',
    description: '20,000 sq ft office space for 100+ engineers',
    hiringSignals: [
      'Head of TA announced NYC hiring push',
      '15 NYC-specific roles posted',
      'Hiring event scheduled for Nov 15'
    ],
    impact: 'Very High',
    estimatedHires: '50-75 engineers in first year',
    source: 'LinkedIn, Company Careers Page'
  },
  {
    id: 3,
    company: 'Coinbase',
    eventType: 'Strategic Partnership',
    eventTitle: 'Partnership with Visa for Crypto Payments',
    date: '2025-10-22',
    description: 'Integration project requiring specialized payment infrastructure team',
    hiringSignals: [
      'Posted 6 payment engineering roles',
      'Engineering Manager hired from Visa',
      'Team size growing 25%'
    ],
    impact: 'High',
    estimatedHires: '15-25 engineers',
    source: 'Press Release, LinkedIn'
  }
]

const COLORS = ['#0ea5e9', '#d946ef', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

// ==================== MAIN COMPONENT ====================

function App() {
  const [activeTab, setActiveTab] = useState('linkedin')
  const [loading, setLoading] = useState(false)
  const [lastUpdated] = useState<Date>(new Date())

  // AI Assistant state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-xl border-b-4 border-blue-500">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                RecruitIQ Intelligence Platform
              </h1>
              <p className="text-slate-300 text-sm mt-1">AI-Powered Recruitment Data Blocks</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Live Data • Updated {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-[1800px] mx-auto">
        {/* Page Header with Description */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">📊 Data Intelligence Blocks</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              This dashboard delivers <strong>8 critical data streams</strong> for recruitment intelligence.
              Each block below represents a different data source that we monitor and analyze in real-time.
              Use the tabs below to explore each data source.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">8 Data Sources</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Real-Time Updates</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">AI-Powered Analysis</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">Verified Contacts</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-2 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'linkedin'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            💼 LinkedIn Posts
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'jobs'
                ? 'bg-green-600 text-white shadow-lg scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🆕 Fresh Jobs
          </button>
          <button
            onClick={() => setActiveTab('stakeholders')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'stakeholders'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            👥 Stakeholders
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'monitoring'
                ? 'bg-orange-600 text-white shadow-lg scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            👁️ Monitoring
          </button>
          <button
            onClick={() => setActiveTab('reverse')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'reverse'
                ? 'bg-pink-600 text-white shadow-lg scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🔍 Reverse Eng.
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'movements'
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🔄 Job Changes
          </button>
          <button
            onClick={() => setActiveTab('funding')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'funding'
                ? 'bg-emerald-600 text-white shadow-lg scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            💰 Funding
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-cyan-600 text-white shadow-lg scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            📰 Events
          </button>
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'ai-assistant'
                ? 'bg-violet-600 text-white shadow-lg scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🤖 AI Assistant
          </button>
        </div>

        {/* Data Blocks Grid */}
        <div className="space-y-8">

          {/* Block 1: LinkedIn Posts */}
          {activeTab === 'linkedin' && (
          <div className="bg-white rounded-xl shadow-xl border-2 border-blue-200 overflow-hidden transform transition-all hover:shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">💼</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">LinkedIn Posts & Hiring Signals</h3>
                  <p className="text-blue-100 text-sm">Real-time monitoring of executive and recruiter activity</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold">{linkedinPosts.length} Posts</span>
            </div>
            <div className="p-6">
              <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-slate-700">
                  <strong>What this shows:</strong> Recent LinkedIn activity from hiring managers, executives, and recruiters
                  mentioning team growth, new roles, or hiring initiatives. These are strong early signals before jobs are posted.
                </p>
              </div>
              <div className="space-y-4">
                {linkedinPosts.map(post => (
                  <div key={post.id} className="border border-slate-200 rounded-lg p-5 hover:border-blue-400 transition-colors bg-slate-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <a href={post.authorLinkedIn} target="_blank" rel="noopener noreferrer"
                             className="font-bold text-lg text-slate-800 hover:text-blue-600">
                            {post.author}
                          </a>
                          <div className="text-sm text-slate-600">{post.authorTitle}</div>
                          <div className="text-xs text-slate-500 mt-1">{post.company} • Posted {post.postDate}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{post.relevance}%</div>
                        <div className="text-xs text-slate-500">Relevance</div>
                      </div>
                    </div>
                    <div className="mb-3 text-slate-700 leading-relaxed bg-white p-4 rounded border border-slate-200">
                      "{post.content}"
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-slate-600">
                        <span>👍 {post.engagement.likes}</span>
                        <span>💬 {post.engagement.comments}</span>
                        <span>🔄 {post.engagement.shares}</span>
                      </div>
                      <div className="flex gap-2">
                        {post.signals.map((signal, i) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {signal}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Block 2: Fresh Open Jobs */}
          {activeTab === 'jobs' && (
          <div className="bg-white rounded-xl shadow-xl border-2 border-green-200 overflow-hidden transform transition-all hover:shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🆕</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">Fresh Open Jobs (Last 48 Hours)</h3>
                  <p className="text-green-100 text-sm">Newly posted positions from target companies</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold">{freshOpenJobs.length} Jobs</span>
            </div>
            <div className="p-6">
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-sm text-slate-700">
                  <strong>What this shows:</strong> Jobs posted in the last 48 hours from companies matching your ICP.
                  Early awareness gives you a competitive advantage to reach out first.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {freshOpenJobs.map(job => (
                  <div key={job.id} className="border border-slate-200 rounded-lg p-5 hover:border-green-400 transition-colors bg-slate-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-lg text-slate-800">{job.jobTitle}</h4>
                          {job.urgency === 'High' && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">🔥 URGENT</span>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-blue-600">{job.company}</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{job.location} ({job.remote})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span className="font-semibold text-green-600">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🏢</span>
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⏰</span>
                        <span className="font-semibold text-orange-600">Posted {job.postedHoursAgo} hours ago</span>
                      </div>
                    </div>
                    <a href={job.jobUrl} target="_blank" rel="noopener noreferrer"
                       className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                      View Job Posting →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Block 3: Stakeholders & Hiring Managers */}
          {activeTab === 'stakeholders' && (
          <div className="bg-white rounded-xl shadow-xl border-2 border-purple-200 overflow-hidden transform transition-all hover:shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">👥</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">Verified Stakeholders & Hiring Managers</h3>
                  <p className="text-purple-100 text-sm">Decision makers with verified contact information</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-purple-500 text-white rounded-lg font-bold">{stakeholders.length} Contacts</span>
            </div>
            <div className="p-6">
              <div className="mb-4 bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <p className="text-sm text-slate-700">
                  <strong>What this shows:</strong> Key decision makers, hiring managers, and recruiters with <strong>verified emails and phone numbers</strong>.
                  Each contact includes deliverability scores so you know which emails are safe to use.
                </p>
              </div>
              <div className="space-y-4">
                {stakeholders.map(person => (
                  <div key={person.id} className="border border-slate-200 rounded-lg p-5 hover:border-purple-400 transition-colors bg-slate-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <a href={person.linkedIn} target="_blank" rel="noopener noreferrer"
                               className="font-bold text-xl text-slate-800 hover:text-purple-600 flex items-center gap-2">
                              {person.name} 🔗
                            </a>
                            <div className="text-sm text-slate-600 font-medium">{person.title}</div>
                            <div className="text-sm text-slate-500">{person.company} • {person.department}</div>
                            <div className="mt-2 flex gap-2">
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                {person.role}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                person.influence === 'Very High' ? 'bg-red-100 text-red-700' :
                                person.influence === 'High' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {person.influence} Influence
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-sm text-slate-700">
                          <strong>Recent Activity:</strong> {person.recentActivity}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className={`p-3 rounded-lg border-l-4 ${
                          person.emailStatus === 'verified' ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-sm text-slate-800">{person.email}</span>
                            <button className="text-blue-600 hover:text-blue-800">📋</button>
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <span className={`font-bold ${
                              person.emailStatus === 'verified' ? 'text-green-700' : 'text-yellow-700'
                            }`}>
                              {person.emailStatus === 'verified' ? '✓ Verified' : '⚠ Catch-All'}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className={`font-bold ${
                              person.emailDeliverability >= 90 ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {person.emailDeliverability}% Deliverability
                            </span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg border-l-4 ${
                          person.phoneVerified ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-400'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-sm text-slate-800">{person.phone}</span>
                            <button className="text-blue-600 hover:text-blue-800">📋</button>
                          </div>
                          <div className="text-xs">
                            <span className={`font-bold ${
                              person.phoneVerified ? 'text-green-700' : 'text-gray-600'
                            }`}>
                              {person.phoneVerified ? '✓ Verified' : '✗ Not Verified'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Block 4: Website Job Monitoring */}
          {activeTab === 'monitoring' && (
          <div className="bg-white rounded-xl shadow-xl border-2 border-orange-200 overflow-hidden transform transition-all hover:shadow-2xl">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">👁️</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">Career Page Monitoring</h3>
                  <p className="text-orange-100 text-sm">24/7 tracking of company career pages for new postings</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold">{websiteMonitoring.length} Sites</span>
            </div>
            <div className="p-6">
              <div className="mb-4 bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <p className="text-sm text-slate-700">
                  <strong>What this shows:</strong> Automated monitoring of career pages you care about.
                  Get instant alerts when new jobs are posted or existing jobs are removed.
                </p>
              </div>
              <div className="space-y-4">
                {websiteMonitoring.map(site => (
                  <div key={site.id} className="border border-slate-200 rounded-lg p-5 hover:border-orange-400 transition-colors bg-slate-50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-xl text-slate-800 mb-1">{site.company}</h4>
                        <a href={site.careerPageUrl} target="_blank" rel="noopener noreferrer"
                           className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                          🔗 {site.careerPageUrl}
                        </a>
                        <div className="text-xs text-slate-500 mt-2">Last checked: {site.lastChecked}</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-4 py-2 rounded-lg font-bold ${
                          site.status === 'New Jobs Detected' ? 'bg-green-100 text-green-700' :
                          site.status === 'Jobs Removed' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {site.status}
                        </span>
                        <div className="text-sm text-slate-600 mt-2">
                          {site.jobCount} total jobs ({site.jobCount > site.previousJobCount ? '+' : ''}{site.jobCount - site.previousJobCount})
                        </div>
                      </div>
                    </div>
                    {site.changes.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-semibold text-slate-700 text-sm">Recent Changes:</h5>
                        {site.changes.map((change, i) => (
                          <div key={i} className={`p-3 rounded-lg border-l-4 ${
                            change.type === 'New Job Posted' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                          }`}>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-lg">{change.type === 'New Job Posted' ? '✅' : '❌'}</span>
                              <span className="font-semibold">{change.type}:</span>
                              <span className="text-slate-800">{change.title}</span>
                            </div>
                            <div className="text-xs text-slate-600 ml-7">
                              {change.department} • {change.timestamp}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Block 5: Reverse Engineered Jobs */}
          {activeTab === 'reverse' && (
          <div className="bg-white rounded-xl shadow-xl border-2 border-pink-200 overflow-hidden transform transition-all hover:shadow-2xl">
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🔍</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">Reverse Engineered Competitor Jobs</h3>
                  <p className="text-pink-100 text-sm">AI analysis identifying real clients behind staffing agency posts</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-pink-500 text-white rounded-lg font-bold">{reverseEngineeredJobs.length} Matches</span>
            </div>
            <div className="p-6">
              <div className="mb-4 bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
                <p className="text-sm text-slate-700">
                  <strong>What this shows:</strong> When competitors post vague "client confidential" jobs, our AI reverse engineers them
                  to identify the real company. This gives you insights into who your competitors are working with.
                </p>
              </div>
              <div className="space-y-4">
                {reverseEngineeredJobs.map(job => (
                  <div key={job.id} className="border border-slate-200 rounded-lg p-5 hover:border-pink-400 transition-colors bg-slate-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-3">
                          <div className="text-xs text-slate-500 mb-1">COMPETITOR POSTED:</div>
                          <div className="font-bold text-lg text-slate-800">{job.postedJobTitle}</div>
                          <div className="text-sm text-slate-600 mt-1">by {job.competitorAgency}</div>
                          <div className="text-xs text-slate-500 mt-1">📍 {job.location}</div>
                        </div>
                        <a href={job.competitorUrl} target="_blank" rel="noopener noreferrer"
                           className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                          🔗 View Competitor Posting
                        </a>
                      </div>
                      <div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-4">
                          <div className="text-xs text-slate-600 mb-1">AI IDENTIFIED CLIENT:</div>
                          <div className="font-bold text-2xl text-green-700 mb-2">{job.identifiedClient}</div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="text-3xl font-bold text-green-600">{job.confidence}%</div>
                            <div className="text-xs text-slate-600">Confidence</div>
                          </div>
                          <div className="text-xs">
                            <span className={`px-2 py-1 rounded font-bold ${
                              job.status === 'Verified Match' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                            }`}>
                              {job.status}
                            </span>
                          </div>
                          <a href={job.originalJobUrl} target="_blank" rel="noopener noreferrer"
                             className="mt-3 block text-sm text-blue-600 hover:underline flex items-center gap-1">
                            🔗 View Original Job
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="text-sm font-semibold text-slate-700 mb-2">Match Indicators:</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {job.matchIndicators.map((indicator, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-white p-2 rounded border border-slate-200">
                            <span className="text-green-500">✓</span>
                            <span>{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Block 6: Job Changes & Executive Movements */}
          {activeTab === 'movements' && (
          <div className="bg-white rounded-xl shadow-xl border-2 border-indigo-200 overflow-hidden transform transition-all hover:shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🔄</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">Job Changes & Executive Movements</h3>
                  <p className="text-indigo-100 text-sm">Track when key people change roles (strong hiring signals)</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-bold">{jobChanges.length} Changes</span>
            </div>
            <div className="p-6">
              <div className="mb-4 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                <p className="text-sm text-slate-700">
                  <strong>What this shows:</strong> When executives, engineering managers, or recruiters change companies,
                  they typically hire for their new teams within 30-90 days. These are high-value early signals.
                </p>
              </div>
              <div className="space-y-4">
                {jobChanges.map(change => (
                  <div key={change.id} className="border border-slate-200 rounded-lg p-5 hover:border-indigo-400 transition-colors bg-slate-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                          {change.person.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <a href={change.linkedIn} target="_blank" rel="noopener noreferrer"
                             className="font-bold text-xl text-slate-800 hover:text-indigo-600 flex items-center gap-2">
                            {change.person} 🔗
                          </a>
                          <div className="text-sm text-slate-600 mt-2 space-y-1">
                            <div>
                              <span className="text-slate-500">From:</span>{' '}
                              <span className="font-semibold">{change.previousTitle}</span> at {change.previousCompany}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 font-bold">→</span>
                              <span className="text-slate-500">To:</span>{' '}
                              <span className="font-semibold text-green-700">{change.newTitle}</span> at{' '}
                              <span className="font-semibold text-green-700">{change.newCompany}</span>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 mt-2">Changed on {change.changeDate}</div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg font-bold text-sm ${
                        change.relevance === 'Very High' ? 'bg-red-100 text-red-700' :
                        change.relevance === 'High' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {change.relevance} Priority
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                        <div className="text-xs text-slate-600 font-semibold mb-1">HIRING SIGNAL:</div>
                        <div className="text-sm text-slate-800">{change.signal}</div>
                      </div>
                      <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                        <div className="text-xs text-slate-600 font-semibold mb-1">EXPECTED TEAM SIZE:</div>
                        <div className="text-sm text-slate-800">{change.teamSize}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Block 7: Funding Events */}
          {activeTab === 'funding' && (
          <div className="bg-white rounded-xl shadow-xl border-2 border-emerald-200 overflow-hidden transform transition-all hover:shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">💰</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">Funding Events & Investment News</h3>
                  <p className="text-emerald-100 text-sm">Recent funding rounds with hiring impact analysis</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold">{fundingEvents.length} Events</span>
            </div>
            <div className="p-6">
              <div className="mb-4 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
                <p className="text-sm text-slate-700">
                  <strong>What this shows:</strong> Companies that just raised funding typically go on hiring sprees.
                  We track funding announcements and analyze post-funding hiring signals to predict hiring volume.
                </p>
              </div>
              <div className="space-y-4">
                {fundingEvents.map(event => (
                  <div key={event.id} className="border border-slate-200 rounded-lg p-5 hover:border-emerald-400 transition-colors bg-slate-50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-2xl text-slate-800 mb-1">{event.company}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <span className="font-semibold">{event.eventType}</span>
                          <span>•</span>
                          <span>{event.date}</span>
                          <span>•</span>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                            {event.industry}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-600">{event.amount}</div>
                        <div className="text-sm text-slate-500">Valuation: {event.valuation}</div>
                        <div className="text-xs text-slate-500 mt-1">Led by {event.lead}</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-lg mb-3">
                      <div className="text-xs font-bold text-slate-600 mb-2">POST-FUNDING HIRING SIGNALS:</div>
                      <div className="space-y-1">
                        {event.postFundingSignals.map((signal, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="text-blue-500">✓</span>
                            <span>{signal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-lg font-bold text-sm ${
                          event.hiringImpact === 'Very High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {event.hiringImpact} Impact
                        </span>
                        <span className="text-sm text-slate-600">
                          <strong>Estimated:</strong> {event.estimatedHires}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Block 8: Company Events */}
          {activeTab === 'events' && (
          <div className="bg-white rounded-xl shadow-xl border-2 border-cyan-200 overflow-hidden transform transition-all hover:shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">📰</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">Company Events & Announcements</h3>
                  <p className="text-cyan-100 text-sm">Product launches, office openings, partnerships & more</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold">{companyEvents.length} Events</span>
            </div>
            <div className="p-6">
              <div className="mb-4 bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
                <p className="text-sm text-slate-700">
                  <strong>What this shows:</strong> Major company milestones like product launches, office openings, or partnerships
                  often trigger hiring surges. These events help predict when companies will need more talent.
                </p>
              </div>
              <div className="space-y-4">
                {companyEvents.map(event => (
                  <div key={event.id} className="border border-slate-200 rounded-lg p-5 hover:border-cyan-400 transition-colors bg-slate-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-xl text-slate-800">{event.company}</h4>
                          <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-bold">
                            {event.eventType}
                          </span>
                        </div>
                        <div className="font-semibold text-lg text-slate-700 mb-1">{event.eventTitle}</div>
                        <div className="text-sm text-slate-500">{event.date} • Source: {event.source}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg font-bold text-sm ${
                        event.impact === 'Very High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {event.impact} Impact
                      </span>
                    </div>
                    <div className="bg-slate-100 border-l-4 border-slate-400 p-3 rounded mb-3">
                      <p className="text-sm text-slate-700">{event.description}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg">
                      <div className="text-xs font-bold text-slate-600 mb-2">HIRING SIGNALS DETECTED:</div>
                      <div className="space-y-1 mb-3">
                        {event.hiringSignals.map((signal, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="text-green-500">✓</span>
                            <span>{signal}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-sm font-bold text-green-700">
                        Estimated Hiring Need: {event.estimatedHires}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Block 9: AI Assistant with Natural Language Questions */}
          {activeTab === 'ai-assistant' && (
          <div className="bg-white rounded-xl shadow-xl border-2 border-violet-200 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🤖</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">AI Assistant - Natural Language Questions</h3>
                  <p className="text-violet-100 text-sm">Ask questions about your recruitment data in plain English</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {!isLoggedIn ? (
                /* Login Interface */
                <div className="max-w-md mx-auto">
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-300 rounded-xl p-8 shadow-lg">
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">🔐</div>
                      <h4 className="text-2xl font-bold text-slate-800 mb-2">Client Login Required</h4>
                      <p className="text-slate-600">Sign in to access the AI Assistant and ask questions about your data</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="client@company.com"
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                        <input
                          type="password"
                          value={userPassword}
                          onChange={(e) => setUserPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>

                      <button
                        onClick={() => {
                          if (userEmail && userPassword) {
                            setIsLoggedIn(true)
                            setChatMessages([
                              { role: 'assistant', content: 'Hello! I\'m your AI recruitment assistant. I can help you analyze data, find insights, and answer questions about your recruitment intelligence. What would you like to know?' }
                            ])
                          } else {
                            alert('Please enter both email and password')
                          }
                        }}
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg"
                      >
                        Sign In to AI Assistant
                      </button>

                      <div className="text-center">
                        <a href="#" className="text-sm text-violet-600 hover:underline">Forgot password?</a>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-violet-200">
                      <p className="text-xs text-slate-500 text-center">
                        Demo Mode: Enter any email and password to access the AI Assistant mockup
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Interface */
                <div className="max-w-4xl mx-auto">
                  {/* User Info Bar */}
                  <div className="bg-gradient-to-r from-violet-100 to-purple-100 border-2 border-violet-300 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {userEmail.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{userEmail}</div>
                        <div className="text-sm text-slate-600">Client Account</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false)
                        setUserEmail('')
                        setUserPassword('')
                        setChatMessages([])
                      }}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>

                  {/* Explanation Box */}
                  <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-slate-700">
                      <strong>What this does:</strong> Ask questions in natural language about your recruitment data.
                      For example: "Show me all funding events from last month" or "Which companies have the most hiring managers with verified emails?"
                    </p>
                  </div>

                  {/* Chat Messages */}
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 mb-6 min-h-[400px] max-h-[500px] overflow-y-auto">
                    <div className="space-y-4">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-xl p-4 ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                              : 'bg-white border-2 border-slate-300 text-slate-800'
                          }`}>
                            <div className="flex items-start gap-3">
                              {msg.role === 'assistant' && (
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                  🤖
                                </div>
                              )}
                              <div className="flex-1">
                                <div className={`text-xs font-bold mb-1 ${msg.role === 'user' ? 'text-violet-100' : 'text-violet-600'}`}>
                                  {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                </div>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {isProcessing && (
                        <div className="flex justify-start">
                          <div className="bg-white border-2 border-slate-300 rounded-xl p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <span className="ml-2 text-sm text-slate-600">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Question Input */}
                  <div className="bg-white border-2 border-slate-300 rounded-xl p-4 shadow-lg">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={currentQuestion}
                        onChange={(e) => setCurrentQuestion(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && currentQuestion.trim() && !isProcessing) {
                            const userMsg = currentQuestion.trim()
                            setChatMessages([...chatMessages, { role: 'user', content: userMsg }])
                            setCurrentQuestion('')
                            setIsProcessing(true)

                            // Simulate AI response
                            setTimeout(() => {
                              const responses = [
                                'Based on your data, I found 3 companies that received funding in the last 30 days: Ramp ($300M Series D), Anthropic ($450M Series C), and Scale AI ($250M Series E Extension). All three show high hiring signals with 50-100+ estimated hires in the next 6 months.',
                                'I analyzed the stakeholder data and found 4 verified contacts across your target companies. 3 have verified emails with 90%+ deliverability rates, and 3 have verified phone numbers. The highest influence contact is Michael Rodriguez (CTO at Plaid).',
                                'Looking at the LinkedIn activity, there are 3 recent hiring signals. The most relevant is Michael Rodriguez\'s post about hiring 20+ engineers after their Series D, with a 98% relevance score.',
                                'I found 2 reverse-engineered jobs with high confidence. The top match is a "Senior Backend Developer - Fintech Client" posted by TechStaff Solutions, which I identified as Stripe with 94% confidence based on location, tech stack, and salary match.'
                              ]
                              const randomResponse = responses[Math.floor(Math.random() * responses.length)]
                              setChatMessages(prev => [...prev, { role: 'assistant', content: randomResponse }])
                              setIsProcessing(false)
                            }, 1500)
                          }
                        }}
                        placeholder="Ask a question about your recruitment data..."
                        disabled={isProcessing}
                        className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-violet-500 transition-colors disabled:bg-slate-100"
                      />
                      <button
                        onClick={() => {
                          if (currentQuestion.trim() && !isProcessing) {
                            const userMsg = currentQuestion.trim()
                            setChatMessages([...chatMessages, { role: 'user', content: userMsg }])
                            setCurrentQuestion('')
                            setIsProcessing(true)

                            setTimeout(() => {
                              const responses = [
                                'Based on your data, I found 3 companies that received funding in the last 30 days: Ramp ($300M Series D), Anthropic ($450M Series C), and Scale AI ($250M Series E Extension). All three show high hiring signals.',
                                'I analyzed the stakeholder data and found 4 verified contacts with 90%+ email deliverability rates across your target companies.',
                                'Looking at the LinkedIn activity, there are 3 recent hiring signals with relevance scores above 90%. The top signal is from Michael Rodriguez (CTO at Plaid) with 98% relevance.',
                              ]
                              const randomResponse = responses[Math.floor(Math.random() * responses.length)]
                              setChatMessages(prev => [...prev, { role: 'assistant', content: randomResponse }])
                              setIsProcessing(false)
                            }, 1500)
                          }
                        }}
                        disabled={!currentQuestion.trim() || isProcessing}
                        className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="text-xs text-slate-500 w-full mb-1">Suggested questions:</div>
                      {[
                        'Show me companies that raised funding last month',
                        'Which stakeholders have verified emails?',
                        'What are the latest LinkedIn hiring signals?',
                        'Show me reverse-engineered competitor jobs'
                      ].map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestion(suggestion)}
                          className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs hover:bg-violet-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}

        </div>

        {/* Summary Footer */}
        <div className="mt-12 bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 rounded-xl shadow-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">📊 Dashboard Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-300">{linkedinPosts.length}</div>
              <div className="text-sm text-slate-300 mt-1">LinkedIn Signals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300">{freshOpenJobs.length}</div>
              <div className="text-sm text-slate-300 mt-1">Fresh Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-300">{stakeholders.length}</div>
              <div className="text-sm text-slate-300 mt-1">Verified Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-300">{websiteMonitoring.length}</div>
              <div className="text-sm text-slate-300 mt-1">Sites Monitored</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
