/**
 * Environment configuration
 * Access environment variables safely with type checking
 */

interface AppEnv {
  SUPABASE_URL: string | undefined;
  SUPABASE_ANON_KEY: string | undefined;
}

export const env: AppEnv = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
}
