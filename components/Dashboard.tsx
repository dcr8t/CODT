
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Match, MatchStatus } from '../types';

interface DashboardProps {
  matches: Match[];
  joinMatch: (id: string) => void;
  onCreateMatch: (data: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ matches, joinMatch, onCreateMatch }) => {
  const [showHostModal, setShowHostModal] = useState(false);
  const [newMatch, setNewMatch] = useState({ title: '', map: 'Favelas', gameMode: 'S&D - 5v5', entryFee: 10 });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateMatch(newMatch);
    setShowHostModal(false);
  };

  return (
    <div className="space-y-12">
      <section className="relative h-64 rounded-3xl overflow-hidden flex flex-col md:flex-row items-center justify-between px-12 group">
        <img src="https://picsum.photos/seed/cod-bg/1200/400" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-orbitron font-black mb-2">ACTIVE <span className="text-lime-400">WARZONE</span></h1>
          <p className="text-slate-400">Join a 10-player room and claim 70% of the pool.</p>
        </div>
        <button 
          onClick={() => setShowHostModal(true)}
          className="relative z-10 bg-lime-500 hover:bg-lime-400 text-slate-950 px-8 py-3 rounded-xl font-orbitron font-black transition-all hover:scale-105"
        >
          HOST A MATCH
        </button>
      </section>

      {showHostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-8 rounded-3xl border-lime-500/30">
            <h2 className="text-2xl font-orbitron font-bold mb-6 text-lime-400">HOST NEW MATCH</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Match Title</label>
                <input required className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-lime-500 outline-none" placeholder="Friday Night Grudge" onChange={e => setNewMatch({...newMatch, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Map</label>
                  <select className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" onChange={e => setNewMatch({...newMatch, map: e.target.value})}>
                    <option>Terminal</option><option>Rust</option><option>Highrise</option><option>Scrapyard</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Entry Fee ($)</label>
                  <input type="number" min="5" max="100" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" value={newMatch.entryFee} onChange={e => setNewMatch({...newMatch, entryFee: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setShowHostModal(false)} className="flex-1 py-3 bg-slate-800 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-lime-500 text-slate-950 rounded-xl font-black font-orbitron">DEPLOY</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {matches.map(match => (
          <div key={match.id} className="glass-panel rounded-2xl overflow-hidden hover:border-lime-500/50 transition-all flex flex-col">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${match.status === MatchStatus.COMPLETED ? 'bg-slate-700' : 'bg-lime-500 text-slate-950'}`}>
                  {match.status}
                </span>
                <span className="text-lime-400 font-bold">${match.totalPrizePool} POOL</span>
              </div>
              <h3 className="text-xl font-orbitron font-bold mb-1">{match.title}</h3>
              <p className="text-slate-500 text-xs uppercase font-bold mb-6">{match.map} • {match.gameMode}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Players Joined</span>
                  <span className="text-white">{match.players.length}/{match.maxPlayers}</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-lime-500 transition-all duration-500" style={{ width: `${(match.players.length / match.maxPlayers) * 100}%` }}></div>
                </div>
                <Link 
                  to={match.status === MatchStatus.LIVE ? `/live/${match.id}` : `/match/${match.id}`}
                  className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-all ${
                    match.status === MatchStatus.COMPLETED ? 'bg-slate-800 text-slate-400 cursor-default' : 'bg-white text-slate-950 hover:bg-lime-400'
                  }`}
                >
                  {match.status === MatchStatus.COMPLETED ? 'MATCH ENDED' : match.status === MatchStatus.LIVE ? 'WATCH LIVE' : 'VIEW DETAILS'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
