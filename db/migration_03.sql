-- Run this in Supabase SQL Editor

-- 1. Add Steam Identity
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS steam_id text UNIQUE;

-- 2. Update Match Schema for CS2 Specifics
ALTER TABLE public.matches
ADD COLUMN IF NOT EXISTS winning_team text; -- 'CT' or 'T'

-- 3. Policy Update (Security)
-- Ensure users can only update their steam_id if it is currently null (prevent swapping mid-game)
create policy "Users can set steam_id once" on public.profiles
for update using (
  auth.uid() = id and (steam_id is null or steam_id = steam_id)
);
