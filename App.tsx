
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { INITIAL_MATCHES, PLATFORM_FEE_PERCENT, WINNER_PRIZE_PERCENT } from './constants';
import { Match, MatchStatus, UserWallet, Transaction, LinkedAccount } from './types';
import Dashboard from './components/Dashboard';
import MatchDetails from './components/MatchDetails';
import Profile from './components/Profile';
import AntiCheatDashboard from './components/AntiCheatDashboard';
import LiveMatch from './components/LiveMatch';

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [wallet, setWallet] = useState<UserWallet>({ 
    credits: 500,
    transactions: [
      { id: 't0', type: 'DEPOSIT', amount: 500, description: 'Initial balance', timestamp: new Date().toISOString() }
    ]
  });
  
  const [currentUser, setCurrentUser] = useState({
    id: 'user_main',
    username: 'Ghost_Ops',
    rank: 'Iridicent',
    winRate: 28.4,
    antiCheatScore: 98,
    linkedAccounts: [] as LinkedAccount[]
  });

  const linkAccount = (provider: LinkedAccount['provider'], username: string) => {
    const newAccount: LinkedAccount = {
      provider,
      username,
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
      id: `t_${Math.random().toString(36).substr(2, 9)}`,
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
      title: data.title || 'Custom Skirmish',
      gameMode: data.gameMode || 'S&D',
      map: data.map || 'Unknown',
      entryFee: data.entryFee || 10,
      totalPrizePool: (data.entryFee || 10) * 10,
      players: [],
      maxPlayers: 10,
      status: MatchStatus.OPEN,
      startTime: new Date().toISOString(),
    };
    setMatches(prev => [newMatch, ...prev]);
  };

  const joinMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    if (!currentUser.linkedAccounts.some(acc => acc.provider === 'Activision')) {
      alert("Safety Requirement: You must link your Activision Account before joining paid matches.");
      return;
    }

    if (match.players.some(p => p.id === currentUser.id)) {
      alert("You are already in this match!");
      return;
    }

    if (wallet.credits < match.entryFee) {
      alert("Insufficient credits!");
      return;
    }

    addTransaction('ENTRY', match.entryFee, `Entry Fee: ${match.title}`);
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        const newPlayers = [...m.players, currentUser];
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
        if (winnerId === currentUser.id) {
          const prize = m.totalPrizePool * WINNER_PRIZE_PERCENT;
          addTransaction('WIN', prize, `Victory: ${m.title}`);
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
      <div className="min-h-screen flex flex-col">
        <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime-500 rounded flex items-center justify-center rotate-45">
              <i className="fa-solid fa-crosshairs -rotate-45 text-slate-900 text-xl font-bold"></i>
            </div>
            <span className="font-orbitron text-2xl font-black tracking-tighter hidden md:block">
              COD<span className="text-lime-400">RIVALS</span>
            </span>
          </Link>
          <div className="flex items-center gap-8 font-semibold text-sm uppercase tracking-widest text-slate-400">
            <Link to="/" className="hover:text-lime-400 transition-colors">Lobby</Link>
            <Link to="/anticheat" className="hover:text-lime-400 transition-colors">Anti-Cheat</Link>
            <Link to="/profile" className="hover:text-lime-400 transition-colors">History</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs text-slate-500">BALANCE</span>
              <span className="text-lime-400 font-orbitron font-bold">${wallet.credits.toFixed(2)}</span>
            </div>
            <Link to="/profile" className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
              {currentUser.linkedAccounts.length > 0 ? (
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`} alt="Avatar" />
              ) : (
                <i className="fa-solid fa-user text-slate-400"></i>
              )}
            </Link>
          </div>
        </nav>

        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard matches={matches} joinMatch={joinMatch} onCreateMatch={createMatch} />} />
            <Route path="/match/:id" element={<MatchDetails matches={matches} joinMatch={joinMatch} startMatch={startMatch} currentUser={currentUser} />} />
            <Route path="/live/:id" element={<LiveMatch matches={matches} resolveMatch={resolveMatch} currentUser={currentUser} />} />
            <Route path="/anticheat" element={<AntiCheatDashboard />} />
            <Route path="/profile" element={<Profile user={currentUser} wallet={wallet} onLinkAccount={linkAccount} />} />
          </Routes>
        </main>

        <footer className="glass-panel py-8 border-t border-white/5 mt-auto">
          <div className="text-center text-xs text-slate-600">
            Connecting securely via official Activision OAuth 2.0. No password storage.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
