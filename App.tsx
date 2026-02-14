
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { INITIAL_MATCHES, PLATFORM_FEE_PERCENT, WINNER_PRIZE_PERCENT } from './constants';
import { Match, MatchStatus, UserWallet, Transaction, LinkedAccount } from './types';
import Dashboard from './components/Dashboard';
import MatchDetails from './components/MatchDetails';
import Profile from './components/Profile';
import AntiCheatDashboard from './components/AntiCheatDashboard';
import LiveMatch from './components/LiveMatch';
import ServerSetup from './components/ServerSetup';

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
    username: 'Rival_Ghost',
    rank: 'Premier 15,200',
    winRate: 54.2,
    antiCheatScore: 98,
    linkedAccounts: [] as LinkedAccount[]
  });

  const linkAccount = (provider: LinkedAccount['provider'], username: string) => {
    const newAccount: LinkedAccount = {
      provider,
      username,
      id64: '76561198' + Math.floor(Math.random() * 100000000),
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
      title: data.title || 'CS2 Premier Skirmish',
      gameMode: data.gameMode || 'Premier',
      map: (data.map as any) || 'de_mirage',
      entryFee: data.entryFee || 10,
      totalPrizePool: (data.entryFee || 10) * 10,
      players: [],
      maxPlayers: 10,
      status: MatchStatus.OPEN,
      startTime: new Date().toISOString(),
      score: { ct: 0, t: 0 },
      serverIp: '127.0.0.1:27015'
    };
    setMatches(prev => [newMatch, ...prev]);
  };

  const joinMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    if (!currentUser.linkedAccounts.some(acc => acc.provider === 'Steam')) {
      alert("Safety Requirement: Link your Steam Identity via Profile to ensure server synchronization.");
      return;
    }

    if (match.players.some(p => p.id === currentUser.id)) {
      alert("Registration active: You are already in the squad.");
      return;
    }

    if (wallet.credits < match.entryFee) {
      alert("Insufficient Credits: Please top up your wallet.");
      return;
    }

    addTransaction('ENTRY', match.entryFee, `Entry: ${match.title}`);
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
          addTransaction('WIN', prize, `Major Victory: ${m.title}`);
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
      <div className="min-h-screen flex flex-col bg-slate-950">
        <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center rotate-45 border border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <i className="fa-solid fa-crosshairs -rotate-45 text-slate-950 text-xl font-black"></i>
            </div>
            <span className="font-orbitron text-2xl font-black tracking-tighter hidden md:block uppercase">
              CS2<span className="text-orange-500">Command</span>
            </span>
          </Link>
          <div className="flex items-center gap-10 font-orbitron font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400">
            <Link to="/" className="hover:text-orange-400 transition-colors">Tactical Hub</Link>
            <Link to="/setup" className="hover:text-orange-400 transition-colors">Server Link</Link>
            <Link to="/anticheat" className="hover:text-orange-400 transition-colors">Anti-Cheat</Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Wallet</span>
              <span className="text-orange-400 font-orbitron font-black">${wallet.credits.toFixed(2)}</span>
            </div>
            <Link to="/profile" className="w-11 h-11 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center overflow-hidden hover:border-orange-500/50 transition-all">
              <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${currentUser.username}`} alt="Avatar" />
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
            <Route path="/setup" element={<ServerSetup />} />
          </Routes>
        </main>

        <footer className="glass-panel py-6 border-t border-white/5 mt-auto">
          <div className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
            Valve GSI v1.4.2 Protected • RCON Encrypted
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
