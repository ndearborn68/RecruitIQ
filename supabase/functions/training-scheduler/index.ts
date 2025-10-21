// Training Scheduler - Automatically runs training every 2 hours
// This function is triggered by a cron job

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  console.log('⏰ Training scheduler triggered')

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // Get training progress
    const { data: progress } = await supabase
      .from('training_progress')
      .select('*')
      .order('iteration', { ascending: false })
      .limit(1)
      .single()

    // Check if training started more than 1 week ago
    if (progress && progress.started_at) {
      const startTime = new Date(progress.started_at).getTime()
      const currentTime = new Date().getTime()
      const oneWeek = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

      if (currentTime - startTime > oneWeek) {
        console.log('⏰ One week elapsed! Stopping training for review.')

        await supabase
          .from('training_progress')
          .update({ status: 'paused_for_review' })
          .eq('id', progress.id)

        const { count } = await supabase
          .from('training_job_postings')
          .select('*', { count: 'exact', head: true })

        return new Response(
          JSON.stringify({
            message: 'Training paused after 1 week for review',
            totalJobs: count,
            daysElapsed: Math.floor((currentTime - startTime) / (24 * 60 * 60 * 1000))
          }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // Check if we've reached 1,000 jobs
    const { count } = await supabase
      .from('training_job_postings')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Current total jobs: ${count}`)

    if (count && count >= 1000) {
      console.log('🎉 Training complete! Reached 1,000 jobs.')

      if (progress) {
        await supabase
          .from('training_progress')
          .update({ status: 'completed' })
          .eq('id', progress.id)
      }

      return new Response(
        JSON.stringify({ message: 'Training complete', totalJobs: count }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Start a new training batch (10 jobs)
    console.log('🚀 Starting new training batch (10 jobs)...')

    const { data, error } = await supabase.functions.invoke('background-trainer', {
      body: { action: 'start_training', batchSize: 10 }
    })

    if (error) {
      console.error('❌ Training batch failed:', error)
      throw error
    }

    console.log('✅ Training batch started:', data)

    // Automatically process the batch after scraping
    console.log('⚙️ Auto-processing batch...')
    const { data: processData, error: processError } = await supabase.functions.invoke('background-trainer', {
      body: { action: 'process_batch', batchSize: 10 }
    })

    if (processError) {
      console.error('❌ Processing failed:', processError)
    } else {
      console.log('✅ Batch processed:', processData)
    }

    return new Response(
      JSON.stringify({
        message: 'Training batch complete',
        scraped: data?.jobsScraped || 0,
        processed: processData?.processed || 0,
        totalJobs: (count || 0) + (data?.jobsScraped || 0)
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
