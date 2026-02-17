-- Run this in Supabase SQL Editor to upgrade your tables

-- 1. Add Live Score Tracking
ALTER TABLE public.matches 
ADD COLUMN IF NOT EXISTS score jsonb DEFAULT '{"teamA": 0, "teamB": 0}',
ADD COLUMN IF NOT EXISTS live_log jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS map text DEFAULT 'Urzikstan',
ADD COLUMN IF NOT EXISTS game_mode text DEFAULT 'Battle Royale';

-- 2. Add Profile Trigger (Auto-create profile/wallet on Signup)
-- This function runs every time a user signs up via Supabase Auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, trust_factor)
  values (new.id, split_part(new.email, '@', 1), 100);
  
  insert into public.wallets (user_id, balance)
  values (new.id, 0.00);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Match Players Join Table (Many-to-Many)
create table if not exists public.match_players (
  match_id uuid references public.matches(id),
  user_id uuid references public.profiles(id),
  is_ready boolean default false,
  joined_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (match_id, user_id)
);

alter table public.match_players enable row level security;
create policy "Public view match players" on public.match_players for select using (true);
create policy "Players can join" on public.match_players for insert with check (auth.uid() = user_id);
create policy "Players can update ready status" on public.match_players for update using (auth.uid() = user_id);
