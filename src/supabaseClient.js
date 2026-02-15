import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hjfjzwqsfnxnvzncojrc.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZmp6d3FzZm54bnZ6bmNvanJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTU1NTUsImV4cCI6MjA3OTk3MTU1NX0.VSmP58VrnLILi5B4PIw7tuI7f_1hQdTSWKyjnpGISJ0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)