import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tgoqohbqrcemscrbkbwm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnb3FvaGJxcmNlbXNjcmJrYndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NjM4MjUsImV4cCI6MjA3NjQzOTgyNX0.FJeXeOWvhyvRKJBI9PBs-rn9k8QApkFRO-mmkTZEYzM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkProgress() {
  console.log('🔍 Checking Training Progress...\n')

  // Get qualified companies count
  const { count: companyCount, error: companyError } = await supabase
    .from('qualified_companies')
    .select('*', { count: 'exact', head: true })

  // Get jobs count
  const { count: jobCount, error: jobError } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })

  // Get recent jobs
  const { data: recentJobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*')
    .order('last_verified', { ascending: false })
    .limit(10)

  // Get companies
  const { data: companies, error: companiesError } = await supabase
    .from('qualified_companies')
    .select('*')
    .limit(10)

  // Get unique locations
  const { data: locations } = await supabase
    .from('jobs')
    .select('location')
    .not('location', 'is', null)

  const uniqueLocations = new Set(locations?.map(j => j.location) || []).size

  console.log('📊 TRAINING STATISTICS')
  console.log('═'.repeat(50))
  console.log(`✅ Qualified Companies: ${companyCount || 0}`)
  console.log(`✅ Jobs Scraped: ${jobCount || 0}`)
  console.log(`✅ Unique Locations: ${uniqueLocations}`)
  console.log(`✅ Unique Phrases (est): ${Math.floor((jobCount || 0) * 0.3)}`)
  console.log(`✅ Progress: ${((jobCount || 0) / 1000 * 100).toFixed(1)}% of 1,000 goal`)
  console.log()

  if (companies && companies.length > 0) {
    console.log('🏢 QUALIFIED COMPANIES (First 10)')
    console.log('═'.repeat(50))
    companies.forEach((c, i) => {
      console.log(`${i + 1}. ${c.company_name}`)
      console.log(`   📍 ${c.location_city}, ${c.location_state}`)
      console.log(`   👥 ${c.employee_count} employees | ${c.industry}`)
      console.log(`   🔗 ${c.career_page_url}`)
      console.log()
    })
  }

  if (recentJobs && recentJobs.length > 0) {
    console.log('💼 RECENT TRAINING JOBS (Last 10)')
    console.log('═'.repeat(50))
    recentJobs.forEach((job, i) => {
      console.log(`${i + 1}. ${job.job_title}`)
      console.log(`   🏢 ${job.company_name}`)
      console.log(`   📍 ${job.location}`)
      console.log(`   👥 ${job.employee_count} employees | ${job.vertical}`)
      console.log(`   📅 Scraped: ${new Date(job.last_verified).toLocaleString()}`)
      console.log(`   🔗 ${job.job_link}`)
      console.log()
    })
  } else {
    console.log('⚠️  No training jobs found yet.')
    console.log('   Run Phase 2 (Start Training Batch) to begin scraping jobs.')
  }
}

checkProgress().catch(console.error)
