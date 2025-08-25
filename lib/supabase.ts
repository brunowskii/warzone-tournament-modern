import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wmwpdlfjytdnsrbfzwmd.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtd3BkbGZqeXRkbnNyYmZ6d21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDc4MTIsImV4cCI6MjA3MTcyMzgxMn0.PZSHDPnHHS4JZNxnwIAg5-A-dkbufb47-M-J0EpQ9EU'

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
