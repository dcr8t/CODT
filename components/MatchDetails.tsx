import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Match, MatchStatus, UserWallet } from '../types';
import { WINNER_PRIZE_PERCENT } from '../constants';

interface MatchDetailsProps {
  matches: Match[];
  joinMatch: (id: string) => void;
  toggleReady: (matchId: string) => void;
  startMatch: (id: string) => void;
  currentUser: any;
  wallet: UserWallet;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ matches, joinMatch, toggleReady, startMatch, currentUser, wallet }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const match = matches.find(m => m.id === id);

  if (!match) return <div className="text-center py-20 font-orbitron">404: LOBBY DEFUNCT</div>;

  const userInMatch = match.players.find(p => p.id === currentUser.id);
  const isReady = userInMatch?.isReady || false;
  const allReady = match.players.length >= 2 && match.players.every(p => p.isReady);
  
  // Dynamic Math: Show what the prize is RIGHT NOW vs what it will be
  const currentTotalPool = match.totalPrizePool;
  const currentWinnerShare = currentTotalPool * WINNER_PRIZE_PERCENT;
  const projectedFullPool = match.entryFee * match.maxPlayers;
  const projectedWinnerShare = projectedFullPool * WINNER_PRIZE_PERCENT;

  const handleJoinAttempt = () => {
    if (wallet.credits < match.entryFee) {
      alert("Insufficient Balance. Top up via Paystack.");
      return;
    }
    if (!wallet.escrowLinked) {
      alert("Escrow provider (Paystack) not linked. Update Profile.");
      navigate('/profile');
      return;
    }
    setShowConfirm(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-6">
          <header className="glass-panel p-10 rounded-[40px] border-orange-500/20 relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full group-hover:bg-orange-500/20 transition-all duration-1000"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] mb-2 block">Mission Parameters</span>
                <h1 className="text-5xl font-orbitron font-black text-white italic uppercase tracking-tighter">{match.title}</h1>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] mt-2">{match.gameType} • {match.map}</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center bg-black/60 px-6 py-4 rounded-3xl border border-white/5">
                   <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Entry Stake</p>
                   <p className="text-2xl font-orbitron font-black text-white">${match.entryFee}</p>
                </div>
                <div className="text-center bg-orange-500/10 px-6 py-4 rounded-3xl border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                   <p className="text-[9px] font-bold text-orange-500 uppercase mb-1">Live Winner Share (70%)</p>
                   <p className="text-2xl font-orbitron font-black text-orange-500">${currentWinnerShare.toFixed(0)}</p>
                </div>
              </div>
            </div>
          </header>

          <section className="glass-panel p-8 rounded-[30px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-orbitron font-black text-xs text-white uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                Deployment Manifest ({match.players.length}/{match.maxPlayers})
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[8px] font-black text-slate-500 uppercase">Max Potential Pot</p>
                  <p className="text-xs font-orbitron font-bold text-white">${projectedWinnerShare.toFixed(0)}</p>
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-full">GSI-v4 Active</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {match.players.map((p) => (
                <div key={p.id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ${p.isReady ? 'bg-lime-500/10 border-lime-500/30 shadow-[0_0_15px_rgba(132,204,22,0.05)]' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${p.username}`} alt="avatar" />
                    </div>
                    <div>
                      <p className="font-black text-sm text-white uppercase italic">{p.username}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.rank}</p>
                    </div>
                  </div>
                  {p.isReady ? (
                    <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black text-lime-500 uppercase mb-1">Authorized</span>
                      <i className="fa-solid fa-circle-check text-lime-500 text-xs"></i>
                    </div>
                  ) : (
                    <span className="text-[8px] font-black text-slate-600 uppercase border border-white/10 px-3 py-1 rounded-full">In Staging</span>
                  )}
                </div>
              ))}
              {match.players.length === 0 && (
                <div className="col-span-2 py-20 text-center space-y-4 opacity-40">
                  <i className="fa-solid fa-satellite-dish text-4xl text-slate-600 animate-bounce"></i>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Combatants...</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className={`glass-panel p-8 rounded-[40px] border-orange-500/30 sticky top-28 transition-all ${userInMatch ? 'bg-orange-500/5' : ''}`}>
            
            {userInMatch && (
              <div className={`border p-5 rounded-3xl mb-8 flex items-center gap-4 animate-in zoom-in ${wallet.escrowProvider === 'Paystack' ? 'bg-[#00BBFF]/10 border-[#00BBFF]/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${wallet.escrowProvider === 'Paystack' ? 'bg-[#00BBFF] shadow-[#00BBFF]/20' : 'bg-orange-500 shadow-orange-500/20'}`}>
                    <i className="fa-solid fa-lock text-lg"></i>
                 </div>
                 <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${wallet.escrowProvider === 'Paystack' ? 'text-[#00BBFF]' : 'text-orange-500'}`}>
                      {wallet.escrowProvider} Split Locked
                    </p>
                    <p className="text-xs font-bold text-white uppercase font-orbitron">Stake: ${match.entryFee}.00</p>
                 </div>
              </div>
            )}

            <div className="text-center mb-8">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">Deployment Status</p>
              <div className={`inline-block px-8 py-3 rounded-full font-orbitron font-black text-xs uppercase tracking-[0.2em] transition-all duration-700 ${allReady ? 'bg-orange-500 text-slate-950 shadow-[0_0_30px_rgba(249,115,22,0.4)]' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
                {match.status === MatchStatus.OPEN ? 'Recruiting' : allReady ? 'GO FOR LAUNCH' : 'STAGING AREA'}
              </div>
            </div>

            {!userInMatch ? (
              <button 
                onClick={handleJoinAttempt}
                className="w-full py-6 bg-orange-500 text-slate-950 rounded-[20px] font-orbitron font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl active:scale-95 group"
              >
                Secure Payout Slot
                <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
              </button>
            ) : (
              <div className="space-y-4">
                <button 
                  onClick={() => toggleReady(match.id)}
                  className={`w-full py-6 rounded-[20px] font-orbitron font-black text-xs uppercase tracking-[0.3em] transition-all ${isReady ? 'bg-lime-500 text-slate-950 shadow-[0_0_30px_rgba(132,204,22,0.3)]' : 'bg-white/10 text-white border border-white/10 hover:bg-white hover:text-slate-950'}`}
                >
                  {isReady ? 'READY TO DEPLOY' : 'AUTHORIZE READINESS'}
                </button>
                
                {allReady && (
                  <button 
                    onClick={() => { startMatch(match.id); navigate(`/live/${match.id}`); }}
                    className="w-full py-6 bg-white text-slate-950 rounded-[20px] font-orbitron font-black text-xs uppercase tracking-[0.4em] animate-bounce shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                  >
                    LAUNCH MISSION
                  </button>
                )}
              </div>
            )}
            
            <div className="mt-10 pt-8 border-t border-white/10">
               <div className="flex items-center gap-3 text-slate-500 mb-4">
                 <i className="fa-solid fa-fingerprint text-orange-500"></i>
                 <p className="text-[10px] font-black uppercase tracking-widest">Paystack Settlement Active</p>
               </div>
               <p className="text-[9px] text-slate-600 font-bold leading-relaxed uppercase italic">
                 The winner takes 70% of the accumulated pool. Elite Rivals keeps a 30% platform fee for GSI maintenance and server costs.
               </p>
            </div>
          </section>
        </aside>
      </div>

      {/* Buy-In Auth Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-6">
          <div className="glass-panel w-full max-w-md p-10 rounded-[50px] border-orange-500/40 text-center animate-in zoom-in duration-500">
             <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(249,115,22,0.3)] border border-orange-400/50">
                <i className="fa-solid fa-file-invoice-dollar text-slate-950 text-3xl"></i>
             </div>
             <h2 className="text-3xl font-orbitron font-black text-white uppercase italic mb-2 tracking-tighter">Confirm Buy-In</h2>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Escrow Provider: {wallet.escrowProvider}</p>
             
             <div className="space-y-4 mb-10 bg-black/40 p-6 rounded-3xl border border-white/5">
               <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-500 font-black uppercase">Your Total Stake</span>
                 <span className="text-white font-orbitron font-black">${match.entryFee}.00</span>
               </div>
               <div className="h-[1px] bg-white/5"></div>
               <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-500 font-black uppercase">Service Tax (30%)</span>
                 <span className="text-slate-600 font-black">-${(match.entryFee * 0.3).toFixed(2)}</span>
               </div>
               <div className="h-[1px] bg-white/5"></div>
               <div className="flex justify-between items-center text-sm pt-2">
                 <span className="text-orange-500 font-black uppercase tracking-widest">Your Prize Contribution</span>
                 <span className="text-orange-500 font-orbitron font-black">${(match.entryFee * 0.7).toFixed(2)}</span>
               </div>
             </div>

             <div className="flex gap-4">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-5 bg-slate-900 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white">Cancel</button>
                <button onClick={() => { joinMatch(match.id); setShowConfirm(false); }} className="flex-1 py-5 bg-orange-500 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white shadow-xl">Authorize Split</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchDetails;