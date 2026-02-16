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

  if (!match) return <div className="text-center py-20 font-orbitron">SIGNAL LOST: MATCH DATA NOT FOUND</div>;

  const userInMatch = match.players.find(p => p.id === currentUser.id);
  const isReady = userInMatch?.isReady || false;
  const allReady = match.players.length >= 2 && match.players.every(p => p.isReady);

  const handleJoinAttempt = () => {
    if (wallet.credits < match.entryFee) {
      alert("Insufficient Combat Credits. Top up in Profile.");
      return;
    }
    if (!wallet.escrowLinked) {
      alert("You must link an Escrow Provider (e.g. Paystack) in your Profile first.");
      navigate('/profile');
      return;
    }
    setShowConfirm(true);
  };

  const handleFinalJoin = () => {
    joinMatch(match.id);
    setShowConfirm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Lobby Details */}
        <div className="lg:col-span-2 space-y-6">
          <header className="glass-panel p-10 rounded-[40px] border-orange-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 blur-3xl rounded-full"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-2 block">Mission Parameters</span>
                <h1 className="text-4xl font-orbitron font-black text-white italic uppercase tracking-tighter">{match.title}</h1>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">{match.gameType.replace('_', ' ')} • {match.map}</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center bg-black/40 px-6 py-3 rounded-2xl border border-white/5">
                   <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Entry</p>
                   <p className="text-xl font-orbitron font-black text-white">${match.entryFee}</p>
                </div>
                <div className="text-center bg-orange-500/10 px-6 py-3 rounded-2xl border border-orange-500/30">
                   <p className="text-[9px] font-bold text-orange-500 uppercase mb-1">Win Pot</p>
                   <p className="text-xl font-orbitron font-black text-orange-500">${(match.totalPrizePool * WINNER_PRIZE_PERCENT).toFixed(0)}</p>
                </div>
              </div>
            </div>
          </header>

          <section className="glass-panel p-8 rounded-[30px] border-white/5">
            <h3 className="font-orbitron font-black text-xs text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              Manifest Log ({match.players.length}/{match.maxPlayers})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {match.players.map((p) => (
                <div key={p.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${p.isReady ? 'bg-lime-500/10 border-lime-500/30' : 'bg-white/5 border-white/5 opacity-80'}`}>
                  <div className="flex items-center gap-4">
                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${p.username}`} className="w-10 h-10 rounded-xl bg-slate-900" alt="p" />
                    <div>
                      <p className="font-black text-sm text-white uppercase italic">{p.username}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{p.rank}</p>
                    </div>
                  </div>
                  {p.isReady ? (
                    <span className="text-[9px] font-black text-lime-500 uppercase border border-lime-500/30 px-3 py-1 rounded-full">Ready</span>
                  ) : (
                    <span className="text-[9px] font-black text-slate-600 uppercase border border-white/5 px-3 py-1 rounded-full">Waiting</span>
                  )}
                </div>
              ))}
              {match.players.length === 0 && <p className="text-slate-600 text-xs font-bold uppercase tracking-widest col-span-2 text-center py-10 italic">Lobby is scanning for participants...</p>}
            </div>
          </section>
        </div>

        {/* Action Sidebar */}
        <aside className="space-y-6">
          <section className={`glass-panel p-8 rounded-[40px] border-orange-500/30 sticky top-28 transition-all ${userInMatch ? 'bg-orange-500/5 animate-pulse-border' : ''}`}>
            
            {userInMatch && (
              <div className={`border p-4 rounded-2xl mb-8 flex items-center gap-4 ${wallet.escrowProvider === 'Paystack' ? 'bg-[#00BBFF]/10 border-[#00BBFF]/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${wallet.escrowProvider === 'Paystack' ? 'bg-[#00BBFF]' : 'bg-orange-500'}`}>
                    <i className="fa-solid fa-lock text-sm"></i>
                 </div>
                 <div>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${wallet.escrowProvider === 'Paystack' ? 'text-[#00BBFF]' : 'text-orange-500'}`}>
                      {wallet.escrowProvider || 'GSI'} Escrow Locked
                    </p>
                    <p className="text-[11px] font-bold text-white uppercase font-orbitron">${match.entryFee} Authorized</p>
                 </div>
              </div>
            )}

            <div className="text-center mb-8">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Lobby Status</p>
              <div className={`inline-block px-5 py-2 rounded-full font-orbitron font-black text-[10px] uppercase tracking-[0.2em] ${allReady ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/30' : 'bg-white/5 text-white border border-white/10'}`}>
                {match.status === MatchStatus.OPEN ? 'Recruiting' : allReady ? 'Authorized' : 'Preparing'}
              </div>
            </div>

            {!userInMatch ? (
              <button 
                onClick={handleJoinAttempt}
                className="w-full py-5 bg-orange-500 text-slate-950 rounded-2xl font-orbitron font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-orange-500/10"
              >
                Secure Deployment Slot
              </button>
            ) : (
              <div className="space-y-4">
                <button 
                  onClick={() => toggleReady(match.id)}
                  className={`w-full py-5 rounded-2xl font-orbitron font-black text-xs uppercase tracking-widest transition-all ${isReady ? 'bg-lime-500 text-slate-950 shadow-lg shadow-lime-500/20' : 'bg-white/10 text-white hover:bg-white hover:text-slate-950 border border-white/10'}`}
                >
                  {isReady ? 'READY FOR DEPLOYMENT' : 'MARK AS READY'}
                </button>
                
                {allReady && (
                  <button 
                    onClick={() => { startMatch(match.id); navigate(`/live/${match.id}`); }}
                    className="w-full py-5 bg-white text-slate-950 rounded-2xl font-orbitron font-black text-xs uppercase tracking-[0.3em] animate-bounce shadow-2xl shadow-white/20"
                  >
                    DEPLOY SQUAD NOW
                  </button>
                )}
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-white/5">
               <div className="flex items-center gap-3 text-slate-500 mb-2">
                 <i className="fa-solid fa-shield-check text-[10px]"></i>
                 <p className="text-[9px] font-bold uppercase tracking-widest">{wallet.escrowProvider || 'GSI'} Protection Active</p>
               </div>
               <p className="text-[8px] text-slate-600 font-bold leading-relaxed uppercase">
                 Entry fee is escrowed via {wallet.escrowProvider || 'platform'}. Payouts are triggered automatically upon GSI match verification.
               </p>
            </div>
          </section>
        </aside>
      </div>

      {/* Buy-In Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
          <div className="glass-panel w-full max-w-md p-10 rounded-[40px] border-orange-500/50 text-center animate-in zoom-in duration-300">
             <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-orange-500/30">
                <i className="fa-solid fa-file-invoice-dollar text-orange-500 text-2xl"></i>
             </div>
             <h2 className="text-2xl font-orbitron font-black text-white uppercase italic mb-2">Stake Authorization</h2>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Deploying via {wallet.escrowProvider || 'Escrow'}</p>
             
             <div className="space-y-3 mb-8">
               <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                 <span className="text-slate-500 font-bold uppercase">Entry Fee</span>
                 <span className="text-white font-black">${match.entryFee}</span>
               </div>
               <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                 <span className="text-slate-500 font-bold uppercase">Split Logic (30% Platform)</span>
                 <span className="text-slate-400 font-black">-${(match.entryFee * 0.3).toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-xs pt-2">
                 <span className="text-orange-500 font-black uppercase tracking-widest italic">Winner's Pot (70%)</span>
                 <span className="text-orange-500 font-black">${(match.totalPrizePool * WINNER_PRIZE_PERCENT).toFixed(0)}</span>
               </div>
             </div>

             <div className="flex gap-4">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-4 bg-slate-900 text-slate-500 rounded-xl font-black text-[10px] uppercase hover:text-white transition-all">Abort</button>
                <button onClick={handleFinalJoin} className="flex-1 py-4 bg-orange-500 text-slate-950 rounded-xl font-black text-[10px] uppercase hover:bg-white transition-all shadow-xl">Confirm & Join</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchDetails;