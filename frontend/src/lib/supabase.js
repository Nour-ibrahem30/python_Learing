import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
// Note: These are public credentials (anon key is designed to be public)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pzrqdqmcjdqrxngbhcgx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6cnFkcW1jamRxcnhuZ2JoY2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5OTM0MjQsImV4cCI6MjEwNzU2OTQyNH0.F6BZPd8Ud_c3eAJMP5OBaBQ-Y_LLGVXpG0GA9j6X80U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
