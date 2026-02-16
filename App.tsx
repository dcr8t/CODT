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
    credits: 500,
    transactions: [
      { id: 't0', type: 'DEPOSIT', amount: 500, description: 'Initial Combat Deposit', timestamp: new Date().toISOString() }
    ]
  });
  
  const [currentUser] = useState({
    id: 'user_ghost',
    username: 'Ghost_Rider_4',
    rank: 'Iridescent',
    elo: 18500,
    trustFactor: 99,
    linkedAccounts: [
        { provider: 'Activision', username: 'Ghost_Rider#4421', id64: 'ACT_9921', verified: true, linkedAt: new Date().toISOString() }
    ] as LinkedAccount[]
  });

  const addTransaction = (type: Transaction['type'], amount: number, description: string) => {
    const newTx: Transaction = {
      id: `tx_${Math.random().toString(36).substr(2, 9)}`,
      type,
      amount,
      description,
      timestamp: new Date().toISOString()
    };
    setWallet(prev => ({
      credits: prev.credits + (type === 'ENTRY' || type === 'WITHDRAW' ? -amount : amount),
      transactions: [newTx, ...prev.transactions]
    }));
  };

  const joinMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match || wallet.credits < match.entryFee) return;

    addTransaction('ENTRY', match.entryFee, `Deployment: ${match.title}`);
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
          status: newPlayers.length >= m.maxPlayers ? MatchStatus.FULL : m.status
        };
      }
      return m;
    }));
  };

  const toggleReady = (matchId: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          players: m.players.map(p => p.id === currentUser.id ? { ...p, isReady: !p.isReady } : p),
          status: MatchStatus.READY_CHECK
        };
      }
      return m;
    }));
  };

  const startMatch = (matchId: string) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: MatchStatus.LIVE } : m));
  };

  const resolveMatch = (matchId: string, winnerId: string, report: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        if (winnerId === currentUser.id && m.status !== MatchStatus.COMPLETED) {
          const prize = m.totalPrizePool * WINNER_PRIZE_PERCENT;
          addTransaction('WIN', prize, `GSI Verified Victory: ${m.title}`);
        }
        return { ...m, status: MatchStatus.COMPLETED, winnerId, verificationReport: report };
      }
      return m;
    }));
  };

  const createMatch = (data: Partial<Match>) => {
    const newMatch: Match = {
      id: `m_${Math.random().toString(36).substr(2, 9)}`,
      title: data.title || 'Custom Skirmish',
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

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <nav className="glass-panel sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b border-white/10 shadow-xl">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-11 h-11 gradient-orange rounded-xl flex items-center justify-center border border-white/10 shadow-[0_0_25px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-person-rifle text-slate-950 text-xl"></i>
            </div>
            <span className="font-orbitron text-2xl font-black tracking-tighter uppercase italic">
              ELITE<span className="text-orange-500">RIVALS</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-10 font-orbitron font-bold text-[10px] uppercase tracking-[0.3em] text-slate-500">
            <Link to="/" className="hover:text-orange-500 transition-colors">War Room</Link>
            <Link to="/anticheat" className="hover:text-orange-500 transition-colors">Ricochet-X</Link>
            <Link to="/setup" className="hover:text-orange-500 transition-colors">Server Link</Link>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Live Balance</span>
              <p className="text-orange-500 font-orbitron font-black text-xl leading-none mt-1">${wallet.credits.toFixed(0)}</p>
            </div>
            <Link to="/profile" className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden hover:border-orange-500/50 transition-all shadow-inner ring-1 ring-white/5">
              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`} alt="Avatar" />
            </Link>
          </div>
        </nav>

        <main className="flex-1 container mx-auto px-6 py-10 max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard matches={matches} joinMatch={joinMatch} onCreateMatch={createMatch} />} />
            <Route path="/match/:id" element={<MatchDetails matches={matches} joinMatch={joinMatch} toggleReady={toggleReady} startMatch={startMatch} currentUser={currentUser} walletBalance={wallet.credits} />} />
            <Route path="/live/:id" element={<LiveMatch matches={matches} resolveMatch={resolveMatch} currentUser={currentUser} />} />
            <Route path="/anticheat" element={<AntiCheatDashboard />} />
            <Route path="/profile" element={<Profile user={currentUser} wallet={wallet} onWithdraw={(amt) => addTransaction('WITHDRAW', amt, 'Wallet Withdrawal')} />} />
            <Route path="/setup" element={<ServerSetup />} />
          </Routes>
        </main>

        <footer className="glass-panel py-8 border-t border-white/5">
          <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em] flex items-center gap-4">
              <i className="fa-solid fa-shield-halved text-orange-500"></i> GSI ARBITRATION ACTIVE • ISO-27001 SECURE
            </div>
            <div className="flex gap-6 text-slate-500 text-lg">
              <i className="fa-brands fa-discord hover:text-white transition-colors cursor-pointer"></i>
              <i className="fa-brands fa-twitter hover:text-white transition-colors cursor-pointer"></i>
              <i className="fa-brands fa-twitch hover:text-white transition-colors cursor-pointer"></i>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;