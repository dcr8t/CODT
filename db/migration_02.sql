-- 1. SAFER DEPOSITS
-- This function is called by the Webhook to add crypto deposits
create or replace function public.increment_balance(user_id_input uuid, amount_input decimal)
returns void as $$
begin
  update public.wallets
  set balance = balance + amount_input,
      updated_at = now()
  where user_id = user_id_input;
end;
$$ language plpgsql security definer;

-- 2. THE PAYOUT ENGINE (The 70% Logic)
-- This function handles the complex logic of ending a match and paying the winner
create or replace function public.conclude_match(match_id_input uuid, winner_id_input uuid)
returns json as $$
declare
  match_record record;
  payout_amount decimal;
  platform_fee decimal;
begin
  -- Get match data
  select * into match_record from public.matches where id = match_id_input;
  
  if match_record.status = 'COMPLETED' then
    return '{"error": "Match already completed"}'::json;
  end if;

  -- Calculate the 70% Cut
  payout_amount := match_record.prize_pool * 0.70;
  platform_fee := match_record.prize_pool * 0.30;

  -- 1. Pay the Winner
  update public.wallets
  set balance = balance + payout_amount
  where user_id = winner_id_input;

  -- 2. Log the Payout Transaction
  insert into public.transactions (wallet_id, amount, type, description, status)
  select id, payout_amount, 'WIN', 'Prize Payout: ' || match_record.title, 'COMPLETED'
  from public.wallets where user_id = winner_id_input;

  -- 3. Close the Match
  update public.matches
  set status = 'COMPLETED',
      winner_id = winner_id_input,
      score = jsonb_set(score, '{winnerPaid}', to_jsonb(payout_amount))
  where id = match_id_input;

  return json_build_object('success', true, 'payout', payout_amount);
end;
$$ language plpgsql security definer;
