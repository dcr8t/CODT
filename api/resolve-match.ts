import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Security Check: Only the "Game Server" or an Admin can call this
  // In production, this token checks if the request comes from your trusted server
  const serverToken = req.headers['x-server-token'];
  if (serverToken !== process.env.GAME_SERVER_SECRET) {
     return res.status(401).json({ error: 'Unauthorized: Invalid Server Token' });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Server Config Error' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { matchId, winnerId } = req.body;

  if (!matchId || !winnerId) {
    return res.status(400).json({ error: 'Missing matchId or winnerId' });
  }

  try {
    // Call the Postgres function we created in migration_02.sql
    const { data, error } = await supabase.rpc('conclude_match', {
      match_id_input: matchId,
      winner_id_input: winnerId
    });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Payout Error:", error);
    return res.status(500).json({ error: error.message });
  }
}