-- ZELIX E-COMMERCE SUPABASE SCHEMA
-- Create this in your Supabase SQL Editor.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Profiles Table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  full_name text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

-- 2. Create Categories Table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

-- 3. Create Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text not null,
  price numeric not null check (price >= 0),
  images text[] not null default '{}',
  category_id uuid references public.categories on delete set null,
  inventory integer not null default 0 check (inventory >= 0),
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

-- 4. Create Orders Table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  total_amount numeric not null check (total_amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb not null,
  stripe_session_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

-- 5. Create Order Items Table
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products on delete set null,
  quantity integer not null check (quantity > 0),
  price numeric not null check (price >= 0),
  size text,
  color text
);

alter table public.order_items enable row level security;

-- 6. Create Wishlists Table
create table public.wishlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

alter table public.wishlists enable row level security;

---------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
---------------------------------------------------------

-- helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Profiles Policies
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can update any profile" on public.profiles
  for all using (public.is_admin());

-- Categories Policies
create policy "Categories are viewable by everyone" on public.categories
  for select using (true);

create policy "Only admins can modify categories" on public.categories
  for all using (public.is_admin());

-- Products Policies
create policy "Products are viewable by everyone" on public.products
  for select using (true);

create policy "Only admins can modify products" on public.products
  for all using (public.is_admin());

-- Orders Policies
create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Users can insert their own orders" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "Admins can manage all orders" on public.orders
  for all using (public.is_admin());

-- Order Items Policies
create policy "Users can view their own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Users can insert their own order items" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Admins can manage all order items" on public.order_items
  for all using (public.is_admin());

-- Wishlist Policies
create policy "Users can view their own wishlist" on public.wishlists
  for select using (auth.uid() = user_id);

create policy "Users can manage their own wishlist" on public.wishlists
  for all using (auth.uid() = user_id);

---------------------------------------------------------
-- TRIGGERS & FUNCTIONS
---------------------------------------------------------

-- Create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  is_first_user boolean;
begin
  -- If this is the first user ever, make them admin (handy for testing)
  select not exists (select 1 from public.profiles) into is_first_user;
  
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'avatar_url',
    case when is_first_user then 'admin' else 'customer' end
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Promote email helper SQL snippet:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
