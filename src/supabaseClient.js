import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lnnrspmmmofoiyzxhckd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubnJzcG1tbW9mb2l5enhoY2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNTgyNTcsImV4cCI6MjA2ODkzNDI1N30.084sASlqISC3wvUl-LsTeN1fAeZB_5XTT3us46sfN5c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
