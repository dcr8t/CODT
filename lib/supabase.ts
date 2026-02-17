import { createClient } from '@supabase/supabase-js';

// Access environment variables via process.env as polyfilled by vite.config.ts
// This avoids TypeScript errors regarding import.meta.env when types are not fully loaded
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // We don't throw immediately to allow build process to pass, but logic will fail if missing.
  console.error("Missing Supabase credentials");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');