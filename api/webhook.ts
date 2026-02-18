import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

// CRITICAL: Use SERVICE_ROLE_KEY for admin access (bypass RLS)
// Do NOT expose this key in your Vite/Client code.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase Server Config');
    return res.status(500).json({ error: 'Server Config Error' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // 1. Verify Signature (Security)
  const sig = req.headers['x-nowpayments-sig'];
  if (ipnSecret && sig) {
    const hmac = crypto.createHmac('sha512', ipnSecret);
    hmac.update(JSON.stringify(req.body));
    const signature = hmac.digest('hex');
    if (signature !== sig) {
      return res.status(403).json({ error: 'Invalid Signature' });
    }
  }

  const { payment_status, price_amount, order_description, order_id } = req.body;

  // 2. Process "Finished" Payments Only
  if (payment_status === 'finished') {
    try {
      // Extract User ID from order_description (assuming format: "Credits for [username]")
      // Or better, pass user_id in 'order_id' or a custom param. 
      // For this implementation, we'll query the profile by username if stored in description,
      // or rely on order_id if you mapped it to a transaction ID previously.
      
      // Strategy: We'll assume order_id was generated as `ER_{TIMESTAMP}_{USER_ID}` in frontend
      const parts = order_id?.split('_');
      const userId = parts && parts.length > 2 ? parts[2] : null;

      if (!userId) {
        // Fallback: Try to match via an existing pending transaction
        console.warn("Could not parse UserID from Order ID:", order_id);
        return res.status(400).json({ error: 'User Unidentified' });
      }

      // 3. Credit Wallet (Atomic Increment)
      const { error: walletError } = await supabase.rpc('increment_balance', {
        user_id_input: userId,
        amount_input: price_amount
      });

      if (walletError) {
        // Fallback if RPC doesn't exist: manual read-update (less safe for concurrency)
        const { data: wallet } = await supabase.from('wallets').select('id, balance').eq('user_id', userId).single();
        if (wallet) {
          await supabase.from('wallets').update({ balance: wallet.balance + price_amount }).eq('id', wallet.id);
        }
      }

      // 4. Log Transaction
      await supabase.from('transactions').insert({
        wallet_id: (await supabase.from('wallets').select('id').eq('user_id', userId).single()).data?.id,
        amount: price_amount,
        type: 'DEPOSIT',
        status: 'COMPLETED',
        provider_ref: req.body.payment_id,
        description: `Crypto Deposit: ${price_amount} USD`
      });

      return res.status(200).json({ status: 'ok', credits_applied: true });
    } catch (err: any) {
      console.error("Webhook Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(200).json({ status: 'ignored', reason: `Status is ${payment_status}` });
}