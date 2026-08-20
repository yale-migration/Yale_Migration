import { createBrowserClient } from '@supabase/ssr'
import { publicConfig } from './config'

/** Browser client. Only ever holds the anon key, which RLS constrains. */
export function createClient() {
  const { url, anonKey } = publicConfig()
  return createBrowserClient(url, anonKey)
}
