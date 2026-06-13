import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

export const supabase = isSupabaseConfigured
  ? createBrowserClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: (url, options) => {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout
          return fetch(url, {
            ...options,
            signal: controller.signal,
          })
            .then((res) => {
              clearTimeout(id);
              return res;
            })
            .catch((err) => {
              clearTimeout(id);
              throw err;
            });
        },
      },
    })
  : null;
