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
  const [newMatch, setNewMatch] = useState({ title: '', gameType: 'COD_WARZONE' as GameType, map: 'Urzikstan', entryFee: 25 });

  const filteredMatches = filter === 'ALL' ? matches : matches.filter(m => m.gameType === filter);

  return (
    <div className="space-y-12">
      {/* Tactical Hero */}
      <section className="relative h-[400px] md:h-[500px] rounded-[40px] overflow-hidden flex flex-col items-center justify-center text-center px-6 border border-white/10 shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1200" 
          className="absolute inset-0 w-full h-full object-cover opacity-20" 
          alt="Warzone Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent"></div>
        
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"></span>
            <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em]">Deployment Authorized: High-Stakes COD Season 1</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-orbitron font-black leading-none tracking-tighter text-white uppercase italic">
            STAKE YOUR <span className="text-orange-500">CLAIM.</span>
          </h1>
          
          <p className="text-slate-400 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
            The ultimate competitive arena for <span className="text-white font-bold">Call of Duty</span>. Enter the lobby, dominate the map, and secure your <span className="text-orange-500 font-bold">70% payout</span> automatically.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button 
              onClick={() => setShowHostModal(true)}
              className="bg-white text-slate-950 px-10 py-4 rounded-xl font-orbitron font-black hover:bg-orange-500 hover:text-white transition-all hover:scale-105 shadow-xl uppercase text-[10px] tracking-[0.2em]"
            >
              Initialize Lobby
            </button>
          </div>
        </div>
      </section>

      {/* Stats/Info Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: 'fa-wallet', title: 'Buy In', text: 'Secure entry with Combat Credits.', color: 'text-orange-500' },
          { icon: 'fa-user-shield', title: 'Ricochet-X', text: 'AI-monitored integrity protocols.', color: 'text-lime-500' },
          { icon: 'fa-trophy', title: 'Winner Takes 70%', text: 'Automatic payout distribution.', color: 'text-orange-500' },
          { icon: 'fa-clock', title: 'Instant Finish', text: 'Results verified in < 60s.', color: 'text-blue-500' }
        ].map((item, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border-white/5 flex gap-4 items-center">
            <div className={`w-12 h-12 shrink-0 bg-white/5 rounded-2xl flex items-center justify-center ${item.color} text-xl`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <div>
              <h3 className="font-orbitron font-black text-white text-[10px] uppercase mb-1">{item.title}</h3>
              <p className="text-[11px] text-slate-500 leading-tight font-medium">{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Lobbies Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-orbitron font-black text-white uppercase italic">Active Lobbies</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">War Room Deployment Selection</p>
        </div>
        <div className="flex bg-slate-900 rounded-xl p-1 border border-white/5 overflow-hidden">
          {['ALL', 'COD_WARZONE', 'COD_MW3', 'CS2'].map(t => (
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
        {filteredMatches.map(match => (
          <div key={match.id} className="glass-panel rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all group flex flex-col shadow-lg border-white/10">
            <div className="h-48 relative overflow-hidden bg-slate-900">
               <img 
                 src={match.gameType.includes('WARZONE') ? 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=600' : 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=600'} 
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

              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex -space-x-2">
                  {[...Array(Math.max(1, Math.min(match.players.length, 4)))].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg border border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${i+match.id}`} alt="p" />
                    </div>
                  ))}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {match.players.length} / {match.maxPlayers} Registered
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
        ))}
      </div>

      {/* Host Modal */}
      {showHostModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
          <div className="glass-panel w-full max-w-lg p-10 rounded-[40px] border-orange-500/40 relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowHostModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <h2 className="text-3xl font-orbitron font-black mb-1 text-white uppercase italic">Lobby Setup</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Deploy your own high-stakes skirmish</p>
            
            <form onSubmit={(e) => { e.preventDefault(); onCreateMatch(newMatch); setShowHostModal(false); }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase">Operation Name</label>
                <input required className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold placeholder:text-slate-700 focus:border-orange-500 outline-none transition-all" placeholder="e.g. Midnight Killrace" onChange={e => setNewMatch({...newMatch, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Deployment Platform</label>
                  <select className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold outline-none appearance-none cursor-pointer" onChange={e => setNewMatch({...newMatch, gameType: e.target.value as any})}>
                    <option value="COD_WARZONE">Warzone</option>
                    <option value="COD_MW3">MW3 S&D</option>
                    <option value="CS2">CS2 Premier</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Entry Fee ($)</label>
                  <input type="number" className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold outline-none" placeholder="25" onChange={e => setNewMatch({...newMatch, entryFee: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/20 text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Estimated Winner Payout (70%)</p>
                 <p className="text-3xl font-orbitron font-black text-orange-500">${(newMatch.entryFee * 10 * 0.7).toFixed(0)}*</p>
                 <p className="text-[9px] text-slate-600 mt-2 italic font-bold">Calculation based on 10 player fill. 30% platform fee applies.</p>
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