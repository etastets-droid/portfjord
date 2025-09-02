import { createClient } from '@supabase/supabase-js'

// Temporary placeholder values for development
// These will be replaced when Supabase integration is properly configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create a mock client for development when Supabase isn't configured
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
})