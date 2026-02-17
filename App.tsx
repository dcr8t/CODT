import React, { useState, useEffect } from 'react';
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
  const [wallet, setWallet] = useState<UserWallet>(() => {
    const saved = localStorage.getItem('er_wallet');
    return saved ? JSON.parse(saved) : { 
      credits: 0,
      escrowLinked: false,
      transactions: []
    };
  });
  
  const [currentUser, setCurrentUser] = useState({
    id: 'user_operator_1',
    email: 'competitor@eliterivals.pro',
    username: 'Ghost_Operative',
    rank: 'Master',
    elo: 15400,
    trustFactor: 95,
    linkedAccounts: [] as LinkedAccount[]
  });

  useEffect(() => {
    localStorage.setItem('er_wallet', JSON.stringify(wallet));
  }, [wallet]);

  const addTransaction = (type: Transaction['type'], amount: number, description: string, provider?: string) => {
    const newTx: Transaction = {
      id: `NP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      type,
      amount,
      description,
      timestamp: new Date().toISOString(),
      provider
    };
    setWallet(prev => ({
      ...prev,
      credits: prev.credits + (type === 'ENTRY' || type === 'WITHDRAW' ? -amount : amount),
      transactions: [newTx, ...prev.transactions]
    }));
  };

  const depositFunds = (amount: number, reference: string) => {
    addTransaction('DEPOSIT', amount, `Crypto Credit: ${reference}`, 'NOWPayments');
  };

  const joinMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match || wallet.credits < match.entryFee) return;

    addTransaction('ENTRY', match.entryFee, `Stake Locked: ${match.title}`, 'Arbiter Escrow');
    
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        const playerEntry: Player = {
          id: currentUser.id,
          username: currentUser.username,
          rank: currentUser.rank,
          elo: currentUser.elo,
          trustFactor: currentUser.trustFactor,
          isReady: false
        };
        const newPlayers = [...m.players, playerEntry];
        return {
          ...m,
          players: newPlayers,
          totalPrizePool: m.totalPrizePool + match.entryFee,
          status: newPlayers.length >= m.maxPlayers ? MatchStatus.FULL : m.status
        };
      }
      return m;
    }));
  };

  const toggleReady = (matchId: string) => {
    setMatches(prev => prev.map(m => m.id === matchId ? {
      ...m,
      players: m.players.map(p => p.id === currentUser.id ? { ...p, isReady: !p.isReady } : p),
      status: MatchStatus.READY_CHECK
    } : m));
  };

  const resolveMatch = (matchId: string, winnerId: string, report: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId && m.status !== MatchStatus.COMPLETED) {
        if (winnerId === currentUser.id) {
          const netPrize = m.totalPrizePool * WINNER_PRIZE_PERCENT;
          addTransaction('WIN', netPrize, `Victory Payout: ${m.title}`);
        }
        return { ...m, status: MatchStatus.COMPLETED, winnerId, verificationReport: report };
      }
      return m;
    }));
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
              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`} alt="Avatar" />
            </Link>
          </div>
        </nav>

        <main className="flex-1 container mx-auto px-6 py-10 max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard matches={matches} joinMatch={joinMatch} onCreateMatch={() => {}} />} />
            <Route path="/match/:id" element={<MatchDetails matches={matches} joinMatch={joinMatch} toggleReady={toggleReady} startMatch={(id) => setMatches(prev => prev.map(m => m.id === id ? {...m, status: MatchStatus.LIVE} : m))} currentUser={currentUser} wallet={wallet} />} />
            <Route path="/live/:id" element={<LiveMatch matches={matches} resolveMatch={resolveMatch} currentUser={currentUser} />} />
            <Route path="/profile" element={<Profile user={currentUser} wallet={wallet} onDeposit={depositFunds} onWithdraw={() => {}} />} />
            <Route path="/anticheat" element={<AntiCheatDashboard />} />
            <Route path="/setup" element={<ServerSetup />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;