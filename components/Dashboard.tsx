
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Match, MatchStatus, GameType } from '../types';

interface DashboardProps {
  matches: Match[];
  joinMatch: (id: string) => void;
  onCreateMatch: (data: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ matches, joinMatch, onCreateMatch }) => {
  const [showHostModal, setShowHostModal] = useState(false);
  const [filter, setFilter] = useState<GameType | 'ALL'>('ALL');
  const [newMatch, setNewMatch] = useState({ title: '', gameType: 'COD_WARZONE' as GameType, map: 'Urzikstan', entryFee: 20 });

  const filteredMatches = filter === 'ALL' ? matches : matches.filter(m => m.gameType === filter);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-[60px] overflow-hidden flex flex-col items-center justify-center text-center px-6 border border-white/5 shadow-2xl">
        <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-10" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
        
        <div className="relative z-10 space-y-8 max-w-3xl">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full animate-pulse">
            <span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_#f97316]"></span>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">Next-Gen Arena Deployment Live</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-orbitron font-black leading-none tracking-tighter text-white">
            ELITE <span className="text-orange-500 italic">RIVALS.</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            The world's most efficient gaming arena. Buy entry to <span className="text-white">Call of Duty</span> & <span className="text-white">CS2</span> matches. Winner takes <span className="text-orange-500 font-black">70%</span> of the pot automatically.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => setShowHostModal(true)}
              className="bg-white text-slate-950 px-12 py-6 rounded-3xl font-orbitron font-black hover:bg-orange-500 transition-all hover:scale-105 shadow-2xl shadow-white/5 uppercase text-xs tracking-[0.2em]"
            >
              Host High-Stakes Match
            </button>
          </div>
        </div>
      </section>

      {/* 1% Task: Quick Start Guide for Novices */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-8 rounded-[40px] border-white/5 bg-gradient-to-br from-white/5 to-transparent">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 mb-6 text-xl">
            <i className="fa-solid fa-wallet"></i>
          </div>
          <h3 className="font-orbitron font-black text-white text-sm uppercase mb-2">1. Credit Wallet</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-bold">Top up your account with credits to buy entry into active lobbies.</p>
        </div>
        <div className="glass-panel p-8 rounded-[40px] border-white/5 bg-gradient-to-br from-white/5 to-transparent">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-500 mb-6 text-xl">
            <i className="fa-solid fa-link"></i>
          </div>
          <h3 className="font-orbitron font-black text-white text-sm uppercase mb-2">2. Link ID</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-bold">Link your Activision or Steam ID in your profile for automated scoring.</p>
        </div>
        <div className="glass-panel p-8 rounded-[40px] border-white/5 bg-gradient-to-br from-white/5 to-transparent">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-lime-500 mb-6 text-xl">
            <i className="fa-solid fa-trophy"></i>
          </div>
          <h3 className="font-orbitron font-black text-white text-sm uppercase mb-2">3. Win & Cashout</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-bold">Dominate the arena. 70% of the entry pool hits your wallet instantly.</p>
        </div>
      </section>

      {/* Lobby Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-orbitron font-black text-white">ACTIVE LOBBIES</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Battleground Selection</p>
        </div>
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
          {['ALL', 'COD_WARZONE', 'COD_MW3', 'CS2'].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all ${filter === t ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Match Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMatches.map(match => (
          <div key={match.id} className="glass-panel rounded-[50px] overflow-hidden hover:border-orange-500/40 transition-all group flex flex-col border-white/5">
            <div className="h-60 relative overflow-hidden">
               <img src={`https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=800&seed=${match.map}`} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-[10s]" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
               
               <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <span className={`w-2 h-2 rounded-full ${match.status === MatchStatus.LIVE ? 'bg-orange-500 animate-pulse' : 'bg-lime-500'}`}></span>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{match.gameType.replace('_', ' ')}</span>
               </div>

               <div className="absolute bottom-8 left-10">
                 <h3 className="text-3xl font-orbitron font-black text-white tracking-tighter mb-1 uppercase italic">{match.title}</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{match.map} • {match.gameMode}</p>
               </div>
            </div>

            <div className="p-10 space-y-8">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-black block tracking-widest">Entry Fee</span>
                  <span className="text-2xl font-orbitron font-black text-white">${match.entryFee}</span>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[10px] text-orange-500 uppercase font-black block tracking-widest italic">Winner Takes (70%)</span>
                  <span className="text-2xl font-orbitron font-black text-orange-500">${(match.totalPrizePool * 0.7).toFixed(0)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-3">
                  {[...Array(Math.min(match.players.length, 3))].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center">
                      <i className="fa-solid fa-user text-[10px] text-slate-500"></i>
                    </div>
                  ))}
                  <div className="text-[11px] font-black text-slate-500 ml-4 self-center uppercase tracking-widest">
                    {match.players.length} / {match.maxPlayers} SLOTS
                  </div>
                </div>
              </div>

              <Link 
                to={match.status === MatchStatus.LIVE ? `/live/${match.id}` : `/match/${match.id}`}
                className="block w-full text-center py-6 rounded-[2rem] font-orbitron font-black text-[11px] uppercase tracking-[0.2em] transition-all bg-white text-slate-950 hover:bg-orange-500 hover:text-white"
              >
                {match.status === MatchStatus.LIVE ? 'ENTER ARENA' : 'RESERVE SQUAD POSITION'}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Host Modal */}
      {showHostModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
          <div className="glass-panel w-full max-w-xl p-12 rounded-[60px] border-orange-500/30 relative">
            <button onClick={() => setShowHostModal(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors">
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            <h2 className="text-4xl font-orbitron font-black mb-2 text-white uppercase italic tracking-tighter">Initialize Arena</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">Configure high-stakes match parameters</p>
            
            <form onSubmit={(e) => { e.preventDefault(); onCreateMatch(newMatch); setShowHostModal(false); }} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase">Operation Title</label>
                <input required className="w-full bg-slate-900/50 border border-white/10 rounded-3xl p-5 text-white focus:border-orange-500 outline-none" placeholder="e.g., REBIRTH ISLAND DUO DASH" onChange={e => setNewMatch({...newMatch, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Game Platform</label>
                  <select className="w-full bg-slate-900/50 border border-white/10 rounded-3xl p-5 text-white outline-none appearance-none" onChange={e => setNewMatch({...newMatch, gameType: e.target.value as any})}>
                    <option value="COD_WARZONE">COD: WARZONE</option>
                    <option value="COD_MW3">COD: MW3</option>
                    <option value="CS2">CS2 PREMIER</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Entry Fee ($)</label>
                  <input type="number" className="w-full bg-slate-900/50 border border-white/10 rounded-3xl p-5 text-white outline-none" placeholder="25" onChange={e => setNewMatch({...newMatch, entryFee: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="bg-orange-500/5 p-8 rounded-[40px] border border-orange-500/10 text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Estimated Winner Payout</p>
                 <p className="text-4xl font-orbitron font-black text-orange-500">${(newMatch.entryFee * 10 * 0.7).toFixed(0)}*</p>
                 <p className="text-[9px] text-slate-600 mt-2 italic">*Based on full 10-player lobby. 70/30 split enforced.</p>
              </div>

              <button type="submit" className="w-full py-6 bg-orange-500 text-slate-950 rounded-3xl font-black font-orbitron text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-orange-500/20">
                Deploy Match Server
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
