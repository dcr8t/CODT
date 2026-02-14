
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
      <section className="relative h-72 rounded-[40px] overflow-hidden flex flex-col md:flex-row items-center justify-between px-16 group border border-white/5 shadow-2xl">
        <img src="https://picsum.photos/seed/cs2-mirage/1200/500" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-[20s]" alt="" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full w-fit">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Premier Matchmaking Active</span>
          </div>
          <h1 className="text-5xl font-orbitron font-black leading-tight">PREMIER <br /><span className="text-orange-500">BATTLEGROUNDS</span></h1>
          <p className="text-slate-400 max-w-sm">Secure RCON management, automated payouts, and verified CS2 Sub-tick servers.</p>
        </div>

        <button 
          onClick={() => setShowHostModal(true)}
          className="relative z-10 bg-orange-500 hover:bg-orange-400 text-slate-950 px-10 py-4 rounded-2xl font-orbitron font-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
        >
          DEPLOY SERVER
        </button>
      </section>

      {showHostModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="glass-panel w-full max-w-md p-10 rounded-[40px] border-orange-500/30">
            <h2 className="text-2xl font-orbitron font-bold mb-8 text-orange-500">MATCH CONFIGURATION</h2>
            <form onSubmit={(e) => { e.preventDefault(); onCreateMatch(newMatch); setShowHostModal(false); }} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Operation Title</label>
                <input required className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500 outline-none" placeholder="Mirage Premier S1" onChange={e => setNewMatch({...newMatch, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Active Duty Map</label>
                  <select className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white" onChange={e => setNewMatch({...newMatch, map: e.target.value as any})}>
                    <option value="de_mirage">Mirage</option>
                    <option value="de_inferno">Inferno</option>
                    <option value="de_nuke">Nuke</option>
                    <option value="de_ancient">Ancient</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Entry Credit</label>
                  <input type="number" className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white" value={newMatch.entryFee} onChange={e => setNewMatch({...newMatch, entryFee: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowHostModal(false)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold text-xs uppercase">Abort</button>
                <button type="submit" className="flex-1 py-4 bg-orange-500 text-slate-950 rounded-2xl font-black font-orbitron text-xs uppercase">Initialize Server</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {matches.map(match => (
          <div key={match.id} className="glass-panel rounded-3xl overflow-hidden hover:border-orange-500/40 transition-all group flex flex-col border-white/5">
            <div className="h-48 relative overflow-hidden">
               <img src={`https://picsum.photos/seed/${match.map}/600/300`} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
               <div className="absolute bottom-4 left-6">
                 <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">Competitive 5v5</p>
                 <h3 className="text-2xl font-orbitron font-black">{match.title}</h3>
               </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center text-xs">
                 <div className="flex flex-col">
                   <span className="text-slate-500 uppercase font-bold tracking-tighter mb-1">Status</span>
                   <span className="text-lime-400 font-bold">{match.status}</span>
                 </div>
                 <div className="flex flex-col text-right">
                   <span className="text-slate-500 uppercase font-bold tracking-tighter mb-1">Prize Pool</span>
                   <span className="text-white font-orbitron font-black">${match.totalPrizePool}</span>
                 </div>
              </div>

              <Link 
                to={match.status === MatchStatus.LIVE ? `/live/${match.id}` : `/match/${match.id}`}
                className="block w-full text-center py-4 rounded-2xl font-orbitron font-black text-xs uppercase bg-white text-slate-950 hover:bg-orange-500 transition-all"
              >
                {match.status === MatchStatus.LIVE ? 'Enter Command Room' : 'Join Operation'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
