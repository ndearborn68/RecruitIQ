# RecruitIQ 🎯

AI-Powered Recruitment Intelligence Dashboard with continuous learning from real job postings.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Features

### 📊 **Dashboard Overview**
- Real-time KPI tracking (leads delivered, jobs analyzed, match rates)
- Live job monitoring from Supabase database
- Interactive charts and visualizations
- Company insights across Manufacturing, IT, and Finance sectors

### 🎯 **Lead Intelligence**
- Comprehensive contact discovery (hiring managers, HR leaders, recruiters)
- LinkedIn profile integration
- Email deliverability verification
- Phone number validation
- Match scoring algorithm

### 🎓 **Training Ground (Admin)**
- **Phase 1**: AI-powered company identification (500-1000 employees)
- **Phase 2**: Automated job scraping from qualified companies
- Real-time training statistics
- Industry and location intelligence
- Progress tracking toward 1,000 job goal

### 📈 **Talent Analytics**
- Candidate movement tracking
- Company-to-company flow analysis
- Market trend visualization

### 👁️ **Job Monitoring**
- Career page change detection
- New job alerts
- Automated tracking

### 💰 **Funding Events**
- VC funding tracking
- Company valuation monitoring
- Investment opportunity identification

### 🎭 **ICP Lookalikes**
- AI-powered company matching
- Similarity scoring
- Tech stack analysis

## 🏗️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Charts**: Recharts
- **AI**: Claude API (Anthropic)
- **Deployment**: Vercel / Netlify ready

## 📦 Project Structure

```
dashboard-ui/
├── src/
│   ├── components/          # React components
│   ├── agents/              # AI agent logic
│   │   ├── orchestrator.ts  # Main orchestration agent
│   │   ├── search-agent.ts  # Web search capabilities
│   │   ├── parser-agent.ts  # Job description parsing
│   │   └── matcher-agent.ts # Company matching logic
│   ├── lib/
│   │   └── supabase.ts      # Supabase client
│   └── App.tsx              # Main application
├── supabase/
│   ├── functions/           # Edge Functions
│   │   ├── company-identifier/    # Phase 1: Company ID
│   │   ├── training-scheduler/    # Phase 2: Job scraping
│   │   └── analyze-job/           # Job analysis
│   └── migrations/          # Database schemas
└── check-progress.js        # CLI progress checker

```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Anthropic API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/RecruitIQ.git
cd RecruitIQ
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

Create a new project at [supabase.com](https://supabase.com) if you haven't already.

Then set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials (found in Project Settings → API):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Link to your Supabase project** (optional, for CLI usage)
```bash
npx supabase login
npx supabase link --project-ref your-project-ref
```

5. **Run database migrations**
```bash
npx supabase db push
```

6. **Deploy Edge Functions**
```bash
npx supabase functions deploy company-identifier
npx supabase functions deploy training-scheduler
```

7. **Start development server**
```bash
npm run dev
```

Visit http://localhost:5173

## 🎓 Training System

### Check Progress
```bash
node check-progress.js
```

Output:
```
📊 TRAINING STATISTICS
✅ Qualified Companies: 59
✅ Jobs Scraped: 7
✅ Progress: 0.7% of 1,000 goal
```

### Manual Training
1. Navigate to Training Ground tab
2. **Phase 1**: Click "Identify Companies" (one-time setup)
3. **Phase 2**: Click "Start Training Batch" (scrape 10 jobs)

### Automatic Training (Cron)
Set up automatic training every 2 hours in Supabase Dashboard:
```sql
-- See supabase-cron.sql for setup
```

## 📊 Current Status

- ✅ **59 qualified companies** identified
- ✅ **7 jobs scraped** from real employers
- ✅ **Real-time analytics** enabled
- ✅ **0.7% progress** toward training goal

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Key Technologies

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast HMR
- **Tailwind CSS**: Utility-first styling
- **Supabase**: Backend-as-a-Service
- **Edge Functions**: Serverless compute

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## 🙏 Acknowledgments

Built with [Claude Code](https://claude.com/claude-code)

---

**Note**: This is an admin dashboard for internal use. The Training Ground tab is hidden in production deployments.
