import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { INITIAL_MATCHES, WINNER_PRIZE_PERCENT } from './constants';
import { Match, MatchStatus, UserWallet, Transaction, LinkedAccount, Player } from './types';
import Dashboard from './components/Dashboard';
import MatchDetails from './components/MatchDetails';
import Profile from './components/Profile';
import AntiCheatDashboard from './components/AntiCheatDashboard';
import LiveMatch from './components/LiveMatch';
import ServerSetup from './components/ServerSetup';

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [wallet, setWallet] = useState<UserWallet>({ 
    credits: 1000,
    transactions: [
      { id: 't0', type: 'DEPOSIT', amount: 1000, description: 'Arena Initial Deposit', timestamp: new Date().toISOString() }
    ]
  });
  
  const [currentUser, setCurrentUser] = useState({
    id: 'user_ghost',
    username: 'Ghost_Rider_4',
    rank: 'Iridescent',
    elo: 18500,
    trustFactor: 99,
    linkedAccounts: [
        { provider: 'Activision', username: 'Ghost_Rider#4421', id64: 'ACT_9921', verified: true, linkedAt: new Date().toISOString() }
    ] as LinkedAccount[]
  });

  const linkAccount = (provider: LinkedAccount['provider'], username: string) => {
    const newAccount: LinkedAccount = {
      provider,
      username,
      id64: 'ID_' + Math.floor(Math.random() * 1000000),
      verified: true,
      linkedAt: new Date().toISOString()
    };
    setCurrentUser(prev => ({
      ...prev,
      linkedAccounts: [...prev.linkedAccounts, newAccount]
    }));
  };

  const addTransaction = (type: Transaction['type'], amount: number, description: string) => {
    const newTx: Transaction = {
      id: `tx_${Math.random().toString(36).substr(2, 9)}`,
      type,
      amount,
      description,
      timestamp: new Date().toISOString()
    };
    setWallet(prev => ({
      credits: prev.credits + (type === 'ENTRY' ? -amount : amount),
      transactions: [newTx, ...prev.transactions]
    }));
  };

  const createMatch = (data: Partial<Match>) => {
    const newMatch: Match = {
      id: `m_${Math.random().toString(36).substr(2, 9)}`,
      title: data.title || 'Custom COD Skirmish',
      gameType: data.gameType || 'COD_WARZONE',
      gameMode: data.gameMode || 'Killrace',
      map: (data.map as any) || 'Urzikstan',
      entryFee: data.entryFee || 25,
      totalPrizePool: (data.entryFee || 25) * 10,
      players: [],
      maxPlayers: 10,
      status: MatchStatus.OPEN,
      startTime: new Date().toISOString(),
      score: { teamA: 0, teamB: 0 },
    };
    setMatches(prev => [newMatch, ...prev]);
  };

  const joinMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    if (match.players.some(p => p.id === currentUser.id)) {
      alert("Already deployed to this lobby.");
      return;
    }

    if (wallet.credits < match.entryFee) {
      alert("Insufficient Combat Credits. Top up in Profile.");
      return;
    }

    addTransaction('ENTRY', match.entryFee, `Deployment: ${match.title}`);
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        const playerEntry: Player = {
          id: currentUser.id,
          username: currentUser.username,
          rank: currentUser.rank,
          elo: currentUser.elo,
          trustFactor: currentUser.trustFactor,
        };
        const newPlayers = [...m.players, playerEntry];
        return {
          ...m,
          players: newPlayers,
          status: newPlayers.length >= m.maxPlayers ? MatchStatus.FULL : m.status
        };
      }
      return m;
    }));
  };

  const resolveMatch = (matchId: string, winnerId: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        if (winnerId === currentUser.id && m.status !== MatchStatus.COMPLETED) {
          const prize = m.totalPrizePool * WINNER_PRIZE_PERCENT;
          addTransaction('WIN', prize, `Victory Payout: ${m.title}`);
        }
        return { ...m, status: MatchStatus.COMPLETED, winnerId };
      }
      return m;
    }));
  };

  const startMatch = (matchId: string) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: MatchStatus.LIVE } : m));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10 shadow-lg">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 gradient-orange rounded-lg flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-person-rifle text-slate-950 text-xl"></i>
            </div>
            <span className="font-orbitron text-2xl font-black tracking-tighter uppercase">
              ELITE<span className="text-orange-500">RIVALS</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 font-orbitron font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400">
            <Link to="/" className="hover:text-orange-500 transition-colors">War Room</Link>
            <Link to="/anticheat" className="hover:text-orange-500 transition-colors">Ricochet-X</Link>
            <Link to="/setup" className="hover:text-orange-500 transition-colors">Server Link</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Credits</span>
              <span className="text-orange-500 font-orbitron font-black text-lg leading-none">${wallet.credits.toFixed(0)}</span>
            </div>
            <Link to="/profile" className="w-10 h-10 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden hover:border-orange-500/50 transition-all shadow-inner">
              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`} alt="Avatar" />
            </Link>
          </div>
        </nav>

        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard matches={matches} joinMatch={joinMatch} onCreateMatch={createMatch} />} />
            <Route path="/match/:id" element={<MatchDetails matches={matches} joinMatch={joinMatch} startMatch={startMatch} currentUser={currentUser} />} />
            <Route path="/live/:id" element={<LiveMatch matches={matches} resolveMatch={resolveMatch} currentUser={currentUser} />} />
            <Route path="/anticheat" element={<AntiCheatDashboard />} />
            <Route path="/profile" element={<Profile user={currentUser} wallet={wallet} onLinkAccount={linkAccount} />} />
            <Route path="/setup" element={<ServerSetup />} />
          </Routes>
        </main>

        <footer className="glass-panel py-6 border-t border-white/5 mt-auto">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
              Activision Blizzard GSI Protected • Encrypted Payouts
            </div>
            <div className="flex gap-4 text-slate-500 text-sm">
              <i className="fa-brands fa-discord hover:text-white cursor-pointer"></i>
              <i className="fa-brands fa-twitter hover:text-white cursor-pointer"></i>
              <i className="fa-brands fa-twitch hover:text-white cursor-pointer"></i>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;