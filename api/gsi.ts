import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // 1. Auth Check (Valve sends this in the 'auth' object inside body)
  const auth = req.body.auth;
  if (!auth || auth.token !== process.env.GAME_SERVER_SECRET) {
    return res.status(401).json({ error: 'Unauthorized Game Server' });
  }

  const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
  
  // CS2 Payload Structure
  const { map, provider, round, player, allplayers } = req.body;

  try {
    // A. Detect Match ID (You must pass matchId via query param in config or derive it)
    // Limitation: Standard CS2 GSI doesn't let you inject custom headers easily.
    // Solution: The server admin sets the match up in DB, and we find the ONE active match for this "server".
    // For this SaaS MVP: We assume only 1 active LIVE match to simplify, or check IP.
    // Improved Solution: We assume the match was created and is currently LIVE.
    
    // Fetch the most recent LIVE match
    const { data: activeMatch } = await supabase
      .from('matches')
      .select('id, players:match_players(user_id)') // Get players to map Steam IDs
      .eq('status', 'LIVE')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!activeMatch) {
       return res.status(200).json({ status: 'no_active_match' }); // Harmless ignore
    }

    // B. Handle Live Scoring (Round End or Real-time)
    if (map && map.team_ct && map.team_t) {
        await supabase.from('matches').update({
            score: {
                teamA: map.team_ct.score,
                teamB: map.team_t.score
            },
            map: map.name,
            game_mode: map.mode
        }).eq('id', activeMatch.id);
    }

    // C. Handle Game Over (Payout Trigger)
    if (map && map.phase === 'gameover') {
        // 1. Determine Winner
        const winningTeamStr = map.winning_team; // "CT" or "T"
        
        // 2. Identify Winning Steam IDs from 'allplayers' payload
        // 'allplayers' is an object where keys are SteamID64s
        const winningSteamIds: string[] = [];
        
        if (allplayers) {
            Object.keys(allplayers).forEach(steamId => {
                const p = allplayers[steamId];
                if (p.team === winningTeamStr) {
                    winningSteamIds.push(steamId);
                }
            });
        }

        // 3. Find the Supabase User who owns this Steam ID
        // In a 1v1 or team match, we might pay the whole team or just the captain.
        // For this architecture (Winner Takes All), we pay the top fragger or the specific user.
        
        // Let's assume 1v1 for simplicity in this MVP logic:
        if (winningSteamIds.length > 0) {
            // Find user with this Steam ID
            const { data: winnerProfile } = await supabase
                .from('profiles')
                .select('id')
                .in('steam_id', winningSteamIds)
                .limit(1)
                .single();

            if (winnerProfile) {
                // 4. TRIGGER PAYOUT
                await supabase.rpc('conclude_match', {
                    match_id_input: activeMatch.id,
                    winner_id_input: winnerProfile.id
                });
                
                return res.status(200).json({ status: 'game_concluded', winner: winnerProfile.id });
            }
        }
    }

    return res.status(200).json({ status: 'processed' });
  } catch (error: any) {
    console.error("GSI Error", error);
    return res.status(500).json({ error: error.message });
  }
}