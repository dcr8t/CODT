
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

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <section className="relative h-[450px] rounded-[50px] overflow-hidden flex flex-col md:flex-row items-center justify-between px-10 md:px-20 group border border-white/5 shadow-2xl">
        <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-[30s]" alt="" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-transparent"></div>
        
        <div className="relative z-10 space-y-6 max-w-xl">
          <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit">
            <i className="fa-solid fa-cloud text-blue-400 text-[10px]"></i>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Server-Side Verification Active</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-orbitron font-black leading-[0.9] tracking-tighter text-white">
            JOIN. PLAY. <br /><span className="text-orange-500">GET PAID.</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
            Zero-config competitive CS2. No file downloads required. Compatible with <span className="text-white">Android, iOS, and GeForce Now.</span>
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <button 
              onClick={() => setShowHostModal(true)}
              className="bg-orange-500 hover:bg-white text-slate-950 px-10 py-5 rounded-2xl font-orbitron font-black transition-all hover:scale-105 uppercase text-sm tracking-widest"
            >
              Host Operation
            </button>
            <a href="#active-duty" className="bg-slate-900/80 border border-white/10 hover:border-white/30 text-white px-10 py-5 rounded-2xl font-orbitron font-black transition-all uppercase text-sm tracking-widest">
              Join Lobby
            </a>
          </div>
        </div>
      </section>

      {/* Active Duty Section */}
      <section id="active-duty" className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-orbitron font-black text-white">ACTIVE OPERATIONS</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.4em]">Zero-Config Matchmaking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map(match => (
            <div key={match.id} className="glass-panel rounded-[40px] overflow-hidden hover:border-blue-500/40 transition-all group flex flex-col border-white/5">
              <div className="h-52 relative overflow-hidden">
                 <img src={`https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=800&seed=${match.map}`} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-[10s]" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                 
                 {/* GeForce Now Ready Badge */}
                 <div className="absolute top-6 left-6 flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                    <i className="fa-solid fa-mobile-screen-button text-[10px]"></i>
                    <span className="text-[9px] font-black uppercase tracking-tighter">Mobile & GFN Ready</span>
                 </div>

                 <div className="absolute bottom-6 left-8">
                   <h3 className="text-2xl font-orbitron font-black text-white tracking-tighter">{match.title}</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{match.map.replace('de_', '')}</p>
                 </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-black block">Winner Pot (70%)</span>
                    <span className="text-2xl font-orbitron font-black text-lime-400">${(match.totalPrizePool * 0.7).toFixed(0)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 uppercase font-black block">Entry Fee</span>
                    <span className="text-xl font-orbitron font-black text-white">${match.entryFee}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-blue-400">Server-Side Active</span>
                  </div>
                  <div className="text-slate-500">
                    {match.players.length} / {match.maxPlayers} SLOTS
                  </div>
                </div>

                <Link 
                  to={match.status === MatchStatus.LIVE ? `/live/${match.id}` : `/match/${match.id}`}
                  className="block w-full text-center py-5 rounded-2xl font-orbitron font-black text-[11px] uppercase tracking-widest transition-all bg-white text-slate-950 hover:bg-orange-500 hover:scale-[1.02]"
                >
                  {match.status === MatchStatus.LIVE ? 'Enter Spectator HUD' : 'Secure Position'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Simple Create Modal */}
      {showHostModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="glass-panel w-full max-w-lg p-10 rounded-[50px] border-blue-500/30 relative">
            <button onClick={() => setShowHostModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
            <h2 className="text-3xl font-orbitron font-black mb-8 text-white uppercase italic">Deploy New Server</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); onCreateMatch(newMatch); setShowHostModal(false); }} className="space-y-6">
              <input required className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white" placeholder="Operation Title" onChange={e => setNewMatch({...newMatch, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none" onChange={e => setNewMatch({...newMatch, map: e.target.value as any})}>
                  <option value="de_mirage">de_mirage</option>
                  <option value="de_inferno">de_inferno</option>
                  <option value="de_nuke">de_nuke</option>
                </select>
                <input type="number" className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-white" placeholder="Entry Fee ($)" onChange={e => setNewMatch({...newMatch, entryFee: parseInt(e.target.value)})} />
              </div>
              <button type="submit" className="w-full py-5 bg-blue-500 text-white rounded-2xl font-black font-orbitron text-sm uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all">
                Initialize Cloud Bridge
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
