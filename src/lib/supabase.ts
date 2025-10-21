import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Job {
  id: string
  company_name: string
  job_title: string
  location: string
  employee_count: number
  vertical: 'Manufacturing' | 'IT' | 'Finance'
  job_link: string
  last_verified: string
  created_at: string
}
