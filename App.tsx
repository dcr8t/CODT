
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { INITIAL_MATCHES, PLATFORM_FEE_PERCENT, WINNER_PRIZE_PERCENT } from './constants';
import { Match, MatchStatus, UserWallet } from './types';
import Dashboard from './components/Dashboard';
import MatchDetails from './components/MatchDetails';
import Profile from './components/Profile';
import AntiCheatDashboard from './components/AntiCheatDashboard';

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [wallet, setWallet] = useState<UserWallet>({ credits: 500 });
  const [currentUser] = useState({
    id: 'user_main',
    username: 'Ghost_Ops',
    rank: 'Iridicent',
    winRate: 28.4,
    antiCheatScore: 100
  });

  const joinMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    if (wallet.credits < match.entryFee) {
      alert("Insufficient credits!");
      return;
    }

    if (match.players.length >= match.maxPlayers) {
      alert("Match is full!");
      return;
    }

    setWallet(prev => ({ credits: prev.credits - match.entryFee }));
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          players: [...m.players, currentUser],
          status: m.players.length + 1 >= m.maxPlayers ? MatchStatus.FULL : m.status
        };
      }
      return m;
    }));
    alert("Successfully joined match!");
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
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
            <Link to="/" className="hover:text-lime-400 transition-colors">Matches</Link>
            <Link to="/anticheat" className="hover:text-lime-400 transition-colors">Anti-Cheat</Link>
            <Link to="/profile" className="hover:text-lime-400 transition-colors">Profile</Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs text-slate-500">CREDITS</span>
              <span className="text-lime-400 font-orbitron font-bold">${wallet.credits.toFixed(2)}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer">
              <i className="fa-solid fa-user text-slate-400"></i>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard matches={matches} joinMatch={joinMatch} />} />
            <Route path="/match/:id" element={<MatchDetails matches={matches} joinMatch={joinMatch} />} />
            <Route path="/anticheat" element={<AntiCheatDashboard />} />
            <Route path="/profile" element={<Profile user={currentUser} wallet={wallet} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="glass-panel py-8 border-t border-white/5 mt-auto">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-orbitron font-bold mb-4 text-lime-400">COD RIVALS</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                The premier destination for competitive CoD. Fair play, high stakes, and instant payouts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white uppercase tracking-wider text-sm">Policies</h4>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Anti-Cheat Commitment</li>
                <li>70/30 Prize Distribution</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white uppercase tracking-wider text-sm">Contact</h4>
              <div className="flex gap-4">
                <i className="fa-brands fa-discord text-xl hover:text-lime-400 transition-colors cursor-pointer"></i>
                <i className="fa-brands fa-twitter text-xl hover:text-lime-400 transition-colors cursor-pointer"></i>
                <i className="fa-brands fa-twitch text-xl hover:text-lime-400 transition-colors cursor-pointer"></i>
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-slate-600 mt-8">
            &copy; 2024 CoD Rivals Elite Hub. All rights reserved.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
