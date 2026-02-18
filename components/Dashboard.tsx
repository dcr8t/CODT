import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Match, MatchStatus, GameType } from '../types';
import { getLatestCodMeta } from '../services/geminiService';

interface DashboardProps {
  matches: Match[];
  joinMatch: (id: string) => void;
  onCreateMatch: (data: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ matches, joinMatch, onCreateMatch }) => {
  const [showHostModal, setShowHostModal] = useState(false);
  const [filter, setFilter] = useState<GameType | 'ALL'>('CS2');
  const [newMatch, setNewMatch] = useState({ title: '', gameType: 'CS2' as GameType, map: 'de_mirage', entryFee: 25 });
  const [intel, setIntel] = useState<{ summary: string; sources: any[] }>({ summary: "Scrutinizing battlefield meta...", sources: [] });

  useEffect(() => {
    getLatestCodMeta().then(setIntel);
  }, []);

  const filteredMatches = filter === 'ALL' ? matches : matches.filter(m => m.gameType === filter);

  return (
    <div className="space-y-12">
      {/* Tactical Hero */}
      <section className="relative h-[400px] md:h-[500px] rounded-[40px] overflow-hidden flex flex-col items-center justify-center text-center px-6 border border-white/10 shadow-2xl animate-pulse-border">
        <img 
          src="https://images.unsplash.com/photo-1624138784181-29e5e6e96405?auto=format&fit=crop&q=80&w=1200" 
          className="absolute inset-0 w-full h-full object-cover opacity-20" 
          alt="CS2 Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent"></div>
        
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316] animate-ping"></span>
            <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em]">CS2 GSI Automation Active</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-orbitron font-black leading-none tracking-tighter text-white uppercase italic">
            COUNTER-STRIKE <span className="text-orange-500 glow-orange">2.0</span>
          </h1>
          
          <p className="text-slate-400 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Connect your Steam ID. Deploy your server. <span className="text-white font-bold">The Payout is Automated.</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button 
              onClick={() => setShowHostModal(true)}
              className="bg-white text-slate-950 px-10 py-4 rounded-xl font-orbitron font-black hover:bg-orange-500 hover:text-white transition-all hover:scale-105 shadow-xl uppercase text-[10px] tracking-[0.2em]"
            >
              Host Match
            </button>
            <Link to="/setup" className="bg-slate-900 border border-white/10 text-white px-10 py-4 rounded-xl font-orbitron font-black hover:bg-slate-800 transition-all uppercase text-[10px] tracking-[0.2em]">
              Server Config
            </Link>
          </div>
        </div>
      </section>

      {/* Lobbies Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-orbitron font-black text-white uppercase italic">Active Lobbies</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Global Offensive Operations</p>
        </div>
        <div className="flex bg-slate-900 rounded-xl p-1 border border-white/5 overflow-hidden">
          {['ALL', 'CS2', 'COD_WARZONE'].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${filter === t ? 'bg-orange-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Lobby Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {filteredMatches.length === 0 ? (
           <div className="col-span-3 text-center py-20 opacity-50 font-orbitron">NO ACTIVE OPERATIONS. INITIALIZE A LOBBY.</div>
        ) : (
          filteredMatches.map(match => (
            <div key={match.id} className="glass-panel rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all group flex flex-col shadow-lg border-white/10">
              <div className="h-48 relative overflow-hidden bg-slate-900">
                <img 
                  src={match.gameType === 'CS2' ? 'https://images.unsplash.com/photo-1624138784181-29e5e6e96405?auto=format&fit=crop&q=80&w=600' : 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=600'} 
                  className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" 
                  alt="Game Map" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-lg border border-white/10">
                    <span className={`w-1.5 h-1.5 rounded-full ${match.status === MatchStatus.LIVE ? 'bg-orange-500 animate-pulse' : 'bg-lime-500'}`}></span>
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">{match.gameType.replace('_', ' ')}</span>
                </div>

                <div className="absolute bottom-4 left-6">
                  <h3 className="text-2xl font-orbitron font-black text-white uppercase italic leading-tight">{match.title}</h3>
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{match.map} • {match.gameMode}</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-black block tracking-widest">Entry Fee</span>
                    <span className="text-xl font-orbitron font-black text-white">${match.entryFee}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[10px] text-orange-500 uppercase font-black block tracking-widest">Winner's Pot (70%)</span>
                    <span className="text-2xl font-orbitron font-black text-orange-500 leading-none">${(match.totalPrizePool * 0.7).toFixed(0)}</span>
                  </div>
                </div>

                <Link 
                  to={match.status === MatchStatus.LIVE ? `/live/${match.id}` : `/match/${match.id}`}
                  className="block w-full text-center py-4 rounded-xl font-orbitron font-black text-[10px] uppercase tracking-[0.2em] transition-all bg-orange-500 text-slate-950 hover:bg-white shadow-lg shadow-orange-500/10"
                >
                  {match.status === MatchStatus.LIVE ? 'Enter Active War Zone' : 'Secure Deployment Slot'}
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Host Modal */}
      {showHostModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
          <div className="glass-panel w-full max-w-lg p-10 rounded-[40px] border-orange-500/40 relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowHostModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <h2 className="text-3xl font-orbitron font-black mb-1 text-white uppercase italic">CS2 Lobby</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Deploy your own high-stakes skirmish</p>
            
            <form onSubmit={(e) => { e.preventDefault(); onCreateMatch(newMatch); setShowHostModal(false); }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase">Operation Name</label>
                <input required className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold placeholder:text-slate-700 focus:border-orange-500 outline-none transition-all" placeholder="e.g. Mirage 1v1" onChange={e => setNewMatch({...newMatch, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Map</label>
                  <select className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold outline-none appearance-none cursor-pointer" onChange={e => setNewMatch({...newMatch, map: e.target.value})}>
                    <option value="de_mirage">Mirage</option>
                    <option value="de_inferno">Inferno</option>
                    <option value="de_dust2">Dust 2</option>
                    <option value="de_nuke">Nuke</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Entry Fee ($)</label>
                  <input type="number" className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold outline-none" placeholder="25" onChange={e => setNewMatch({...newMatch, entryFee: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/20 text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Winner Payout</p>
                 <p className="text-3xl font-orbitron font-black text-orange-500">${(newMatch.entryFee * 2 * 0.7).toFixed(0)}</p>
                 <p className="text-[9px] text-slate-600 mt-2 italic font-bold">Calculation based on 1v1.</p>
              </div>

              <button type="submit" className="w-full py-5 bg-orange-500 text-slate-950 rounded-xl font-black font-orbitron text-[11px] uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-orange-500/20">
                Confirm Lobby Deployment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;