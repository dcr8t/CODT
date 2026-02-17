import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Match, MatchStatus, UserWallet, Transaction } from './types';
import Dashboard from './components/Dashboard';
import MatchDetails from './components/MatchDetails';
import Profile from './components/Profile';
import AntiCheatDashboard from './components/AntiCheatDashboard';
import LiveMatch from './components/LiveMatch';
import ServerSetup from './components/ServerSetup';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [wallet, setWallet] = useState<UserWallet>({ credits: 0, transactions: [], escrowLinked: true });
  const [matches, setMatches] = useState<Match[]>([]);

  // 1. Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch User & Wallet
  const fetchUserData = async (userId: string) => {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    const { data: walletData } = await supabase.from('wallets').select('*').eq('user_id', userId).single();
    const { data: txs } = await supabase.from('transactions').select('*').eq('wallet_id', walletData?.id).order('created_at', { ascending: false });

    setUserProfile(profile);
    if (walletData) {
      setWallet({
        credits: walletData.balance,
        transactions: txs || [],
        escrowLinked: true
      });
    }
  };

  // 3. Match Data Polling (or Subscription)
  useEffect(() => {
    if (!session) return;
    
    const fetchMatches = async () => {
      // In a real app we join 'matches' with 'match_players' to get player counts
      const { data } = await supabase.from('matches').select('*').order('created_at', { ascending: false });
      if (data) {
        // Map DB fields to UI types if necessary, for now we assume direct map or simple transform
        const mappedMatches = data.map((m: any) => ({
           id: m.id,
           title: m.title,
           gameType: 'COD_WARZONE', // Default or from DB
           gameMode: m.game_mode,
           map: m.map,
           entryFee: m.entry_fee,
           totalPrizePool: m.prize_pool,
           players: [], // Loaded individually in MatchDetails for perf
           maxPlayers: 10,
           status: m.status,
           score: m.score,
           startTime: m.created_at
        }));
        setMatches(mappedMatches);
      }
    };

    fetchMatches();
    // Subscribe to new matches
    const channel = supabase.channel('public:matches')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, fetchMatches)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [session]);

  if (!session) {
    return <Auth />;
  }

  if (!userProfile) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-orange-500 font-orbitron animate-pulse">LOADING PROFILE...</div>;
  }

  // --- Actions ---

  const createMatch = async (matchData: any) => {
    // Write to DB
    const { error } = await supabase.from('matches').insert({
      title: matchData.title,
      entry_fee: matchData.entryFee,
      prize_pool: 0, // Starts at 0, increments with joins
      game_mode: 'Battle Royale', // hardcoded for now
      map: 'Urzikstan',
      status: 'OPEN'
    });
    if (error) alert("Failed to create match: " + error.message);
  };

  const joinMatch = async (matchId: string) => {
    if (wallet.credits < 25) { // Assuming 25 is entry
      alert("Insufficient funds. Deposit crypto first.");
      return;
    }

    // 1. Deduct Balance (Ideally done via Postgres Function/Transaction for safety)
    const newBalance = wallet.credits - 25;
    await supabase.from('wallets').update({ balance: newBalance }).eq('user_id', session.user.id);
    
    // 2. Add to Match Players
    await supabase.from('match_players').insert({
      match_id: matchId,
      user_id: session.user.id
    });

    // 3. Update Prize Pool
    // NOTE: This should be a trigger or atomic increment in SQL
    const match = matches.find(m => m.id === matchId);
    if (match) {
        await supabase.from('matches').update({ prize_pool: match.totalPrizePool + 25 }).eq('id', matchId);
    }

    // Refresh Local
    fetchUserData(session.user.id);
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <nav className="glass-panel sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b border-white/10 shadow-2xl">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-11 h-11 gradient-orange rounded-xl flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(249,115,22,0.3)] group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-crosshairs text-slate-950 text-xl"></i>
            </div>
            <span className="font-orbitron text-2xl font-black tracking-tighter uppercase italic">
              ELITE<span className="text-orange-500">RIVALS</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Combat Wallet</span>
              <p className="text-white font-orbitron font-black text-xl leading-none mt-1">${wallet.credits.toFixed(0)}</p>
            </div>
            <Link to="/profile" className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden hover:border-orange-500 transition-all shadow-inner">
               <div className="font-orbitron font-bold text-orange-500">{userProfile.username.substring(0,2).toUpperCase()}</div>
            </Link>
          </div>
        </nav>

        <main className="flex-1 container mx-auto px-6 py-10 max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard matches={matches} joinMatch={joinMatch} onCreateMatch={createMatch} />} />
            <Route path="/match/:id" element={<MatchDetails matches={matches} joinMatch={joinMatch} toggleReady={() => {}} startMatch={() => {}} currentUser={userProfile} wallet={wallet} />} />
            <Route path="/live/:id" element={<LiveMatch matches={matches} resolveMatch={() => {}} currentUser={userProfile} />} />
            <Route path="/profile" element={<Profile user={userProfile} wallet={wallet} onDeposit={() => {}} onWithdraw={() => {}} />} />
            <Route path="/anticheat" element={<AntiCheatDashboard />} />
            <Route path="/setup" element={<ServerSetup />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;