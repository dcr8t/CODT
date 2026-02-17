-- 1. USERS TABLE (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique not null,
  trust_factor int default 100,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. WALLETS (The Ledger)
create table public.wallets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  balance decimal(10, 2) default 0.00 check (balance >= 0),
  currency text default 'USD',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. TRANSACTIONS (Immutable History)
create type transaction_type as enum ('DEPOSIT', 'WITHDRAW', 'ENTRY_FEE', 'PRIZE_PAYOUT');

create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  wallet_id uuid references public.wallets(id) not null,
  amount decimal(10, 2) not null,
  type transaction_type not null,
  description text,
  provider_ref text, -- Stores NOWPayments Invoice ID
  status text default 'PENDING', -- PENDING, COMPLETED, FAILED
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. MATCHES (Game History)
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  entry_fee decimal(10, 2) not null,
  prize_pool decimal(10, 2) not null,
  winner_id uuid references public.profiles(id),
  verification_log jsonb, -- Stores the Gemini AI Audit Report
  status text default 'OPEN',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SECURITY POLICIES (RLS)
alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.transactions enable row level security;

-- Users can read their own profile
create policy "Public profiles are viewable by everyone." on public.profiles for select using ( true );
create policy "Users can update own profile." on public.profiles for update using ( auth.uid() = id );

-- Only the owner can see their wallet balance
create policy "Users can view own wallet." on public.wallets for select using ( auth.uid() = user_id );

-- Only the owner can see their transactions
create policy "Users can view own transactions." on public.transactions for select using ( 
  wallet_id in (select id from public.wallets where user_id = auth.uid()) 
);
