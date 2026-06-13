import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration missing in middleware environment variables.');
    return { supabaseResponse, user: null, supabase: null };
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
              supabaseResponse = NextResponse.next({
                request,
              });
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              );
            } catch (cookieErr) {
              console.error('Cookie sync failed in middleware:', cookieErr);
            }
          },
        },
      }
    );

    // Refresh user session if expired
    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user || null;
    } catch (err) {
      console.error('Supabase getUser failed in middleware:', err);
    }

    return { supabaseResponse, user, supabase };
  } catch (err) {
    console.error('Failed to initialize Supabase client in middleware:', err);
    return { supabaseResponse, user: null, supabase: null };
  }
}
