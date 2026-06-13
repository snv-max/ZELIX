-- AUTH0 COMPATIBILITY MIGRATION SCRIPT
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/obkvtnutntcseqeapzci/sql)
-- to allow Auth0 string IDs instead of Supabase UUIDs, and disable RLS for testing.

-- 1. Drop foreign key constraints that reference UUID fields
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE public.wishlists DROP CONSTRAINT IF EXISTS wishlists_user_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Alter column types from UUID to TEXT to accept Auth0 string user IDs (e.g. "auth0|12345")
ALTER TABLE public.profiles ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE public.orders ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE public.wishlists ALTER COLUMN user_id TYPE text USING user_id::text;

-- 3. Re-establish foreign keys between our tables using the new TEXT type
ALTER TABLE public.orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.wishlists ADD CONSTRAINT wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 4. Disable Row Level Security (RLS) on user-related tables so they can be queried using the anon client with Auth0
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists DISABLE ROW LEVEL SECURITY;

-- 5. Drop RLS policies that are no longer needed
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own wishlist" ON public.wishlists;
DROP POLICY IF EXISTS "Users can manage their own wishlist" ON public.wishlists;

RAISE NOTICE 'Auth0 migration completed successfully.';
