import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://giwlzcfqivutenqemehz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpd2x6Y2ZxaXZ1dGVucWVtZWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDYxMjMsImV4cCI6MjA3MTcyMjEyM30.Kt_mD97Xw-zhHRn2NRO4t_z'

// Create Supabase client for public access
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Create Supabase client with service role for admin operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Storage bucket configuration
export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'evidence'
