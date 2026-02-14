
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
  const [newMatch, setNewMatch] = useState({ title: '', map: 'de_mirage', entryFee: 15 });

  const activeLiveMatches = matches.filter(m => m.status === MatchStatus.LIVE);

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <section className="relative h-96 rounded-[50px] overflow-hidden flex flex-col md:flex-row items-center justify-between px-20 group border border-white/5 shadow-2xl">
        <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-[30s] ease-linear" alt="" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
        
        <div className="relative z-10 space-y-6 max-w-xl">
          <div className="flex items-center gap-3 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full w-fit">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#f97316]"></span>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">High Stakes Network Online</span>
          </div>
          <h1 className="text-6xl font-orbitron font-black leading-[0.9] tracking-tighter text-white">
            MASTER THE <br /><span className="text-orange-500">ARENA.</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            The world's first fully automated CS2 tournament platform with <span className="text-white">Sub-tick verification</span> and instant 70/30 payouts.
          </p>
          <div className="pt-4 flex gap-4">
            <button 
              onClick={() => setShowHostModal(true)}
              className="bg-orange-500 hover:bg-white text-slate-950 px-10 py-5 rounded-2xl font-orbitron font-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] uppercase text-sm tracking-widest"
            >
              Initialize Match
            </button>
            <a href="#active-duty" className="bg-slate-900/80 border border-white/10 hover:border-white/30 text-white px-10 py-5 rounded-2xl font-orbitron font-black transition-all uppercase text-sm tracking-widest flex items-center gap-2">
              Browse Lobby
            </a>
          </div>
        </div>

        {/* Live Mini Stats Overlay */}
        <div className="relative z-10 hidden xl:flex flex-col gap-4">
           <div className="glass-panel p-6 rounded-3xl border-white/10 w-64 rotate-3 hover:rotate-0 transition-transform">
             <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Total Paid Out</p>
             <p className="text-3xl font-orbitron font-black text-lime-400">$142,500.00</p>
           </div>
           <div className="glass-panel p-6 rounded-3xl border-white/10 w-64 -rotate-2 hover:rotate-0 transition-transform translate-x-12">
             <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Active Combatants</p>
             <p className="text-3xl font-orbitron font-black text-orange-500">1,248 Players</p>
           </div>
        </div>
      </section>

      {/* Active Duty Section */}
      <section id="active-duty" className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-orbitron font-black text-white">ACTIVE DUTY</h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Available Combat Operations</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white"><i className="fa-solid fa-filter"></i></button>
            <button className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white"><i className="fa-solid fa-sort"></i></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map(match => (
            <div key={match.id} className="glass-panel rounded-[40px] overflow-hidden hover:border-orange-500/40 transition-all group flex flex-col border-white/5 group">
              <div className="h-56 relative overflow-hidden">
                 <img src={`https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=800&seed=${match.map}`} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-[10s]" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                 <div className="absolute top-6 right-6">
                   <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                     {match.gameMode}
                   </div>
                 </div>
                 <div className="absolute bottom-6 left-8">
                   <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">Squad vs Squad</p>
                   <h3 className="text-3xl font-orbitron font-black text-white tracking-tighter">{match.title}</h3>
                 </div>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                     <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest block mb-1">Prize Pot</span>
                     <span className="text-xl font-orbitron font-black text-white">${match.totalPrizePool}</span>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                     <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest block mb-1">Entry Credits</span>
                     <span className="text-xl font-orbitron font-black text-orange-500">${match.entryFee}</span>
                   </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${match.status === MatchStatus.LIVE ? 'bg-orange-500 animate-pulse' : 'bg-lime-500'}`}></span>
                    <span className={match.status === MatchStatus.LIVE ? 'text-orange-500' : 'text-lime-500'}>{match.status}</span>
                  </div>
                  <div className="text-slate-500">
                    <i className="fa-solid fa-users mr-2"></i>
                    {match.players.length} / {match.maxPlayers} SLOTS
                  </div>
                </div>

                <Link 
                  to={match.status === MatchStatus.LIVE ? `/live/${match.id}` : `/match/${match.id}`}
                  className={`block w-full text-center py-5 rounded-2xl font-orbitron font-black text-[11px] uppercase tracking-widest transition-all ${
                    match.status === MatchStatus.LIVE 
                    ? 'bg-orange-500 text-slate-950 hover:bg-white' 
                    : 'bg-white text-slate-950 hover:bg-lime-500 hover:shadow-[0_0_20px_rgba(132,204,22,0.3)]'
                  }`}
                >
                  {match.status === MatchStatus.LIVE ? 'ENTER COMMAND ROOM' : 'SECURE SQUAD POSITION'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Host Modal Overlay */}
      {showHostModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in zoom-in duration-300">
          <div className="glass-panel w-full max-w-lg p-10 rounded-[50px] border-orange-500/30 relative">
            <button onClick={() => setShowHostModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
            
            <h2 className="text-3xl font-orbitron font-black mb-2 text-white uppercase tracking-tighter">Mission Setup</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">Configure your dedicated skirmish</p>

            <form onSubmit={(e) => { e.preventDefault(); onCreateMatch(newMatch); setShowHostModal(false); }} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operation Designation</label>
                <input 
                  required 
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500 outline-none transition-all" 
                  placeholder="e.g., MIRAGE PREMIER OPEN" 
                  onChange={e => setNewMatch({...newMatch, title: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Map</label>
                  <select className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white appearance-none outline-none focus:border-orange-500" onChange={e => setNewMatch({...newMatch, map: e.target.value as any})}>
                    <option value="de_mirage">de_mirage</option>
                    <option value="de_inferno">de_inferno</option>
                    <option value="de_nuke">de_nuke</option>
                    <option value="de_ancient">de_ancient</option>
                    <option value="de_anubis">de_anubis</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Fee ($)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-orange-500" 
                    value={newMatch.entryFee} 
                    onChange={e => setNewMatch({...newMatch, entryFee: parseInt(e.target.value)})} 
                  />
                </div>
              </div>

              <div className="bg-orange-500/5 p-6 rounded-3xl border border-orange-500/20 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold">Projected Prize Pool:</span>
                  <span className="text-white font-black font-orbitron">${newMatch.entryFee * 10}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500 font-bold italic">Winner takes (70%):</span>
                  <span className="text-lime-500 font-bold">${(newMatch.entryFee * 10 * 0.7).toFixed(0)}</span>
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-orange-500 text-slate-950 rounded-2xl font-black font-orbitron text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-xl shadow-orange-500/20">
                Deploy Server
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
