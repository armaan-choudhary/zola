// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// This check helps debug if the file isn't loading correctly
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables! Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)