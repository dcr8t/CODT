import React, { useState } from 'react';
import { UserWallet, LinkedAccount, Transaction } from '../types';
import { authorizeWithdrawal } from '../services/geminiService';

interface ProfileProps {
  user: any;
  wallet: UserWallet;
  onLinkAccount?: (provider: LinkedAccount['provider'], username: string) => void;
  onLinkEscrow: (provider: 'Paystack' | 'Stripe' | 'Crypto') => void;
  onWithdraw: (amount: number) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, wallet, onLinkAccount, onLinkEscrow, onWithdraw }) => {
  const [linking, setLinking] = useState<LinkedAccount['provider'] | null>(null);
  const [escrowLinking, setEscrowLinking] = useState<'Paystack' | null>(null);
  const [inputUsername, setInputUsername] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{ authorized?: boolean; reason?: string } | null>(null);

  const processWithdrawal = async () => {
    if (wallet.credits <= 0) return;
    setIsAuditing(true);
    setAuditResult(null);
    
    const result = await authorizeWithdrawal(wallet.credits, wallet.transactions.slice(0, 10));
    
    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult(result);
      if (result.authorized) {
        onWithdraw(wallet.credits);
      }
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in duration-1000">
      {/* Header HUD */}
      <section className="glass-panel p-12 rounded-[50px] border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-transparent to-transparent opacity-30"></div>
        <div className="flex items-center gap-10 relative z-10">
          <div className="w-28 h-28 bg-slate-950 border-2 border-orange-500/50 text-orange-500 flex items-center justify-center rounded-[35px] font-orbitron font-black text-4xl shadow-[0_0_40px_rgba(249,115,22,0.1)] group-hover:scale-105 transition-transform duration-500">
            {user.username.charAt(0)}
          </div>
          <div>
            <h1 className="text-4xl font-orbitron font-black uppercase tracking-tighter italic">{user.username}</h1>
            <div className="flex items-center gap-3 mt-2">
               <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{user.rank} OPERATOR</span>
               <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ELO: {user.elo}</span>
            </div>
          </div>
        </div>
        <div className="text-right relative z-10 bg-black/30 p-8 rounded-[40px] border border-white/5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Tactical Balance</p>
          <div className="flex items-center gap-3 justify-end">
            {wallet.escrowLinked && <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse shadow-[0_0_10px_#84cc16]"></div>}
            <p className="text-5xl font-orbitron font-black text-white">${wallet.credits.toFixed(0)}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tactical Vault (Paystack Section) */}
        <section className="glass-panel p-10 rounded-[40px] border-orange-500/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#00BBFF]/10 rounded-2xl flex items-center justify-center text-[#00BBFF] border border-[#00BBFF]/20">
                <i className="fa-solid fa-vault"></i>
              </div>
              <h3 className="font-orbitron font-black text-[10px] uppercase tracking-[0.3em] text-white">Tactical Vault</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed uppercase">
              Bridge your Paystack subaccount for automated match splits. This ensures 70% payouts are executed instantly.
            </p>
            
            <div className="space-y-4">
               <button 
                  onClick={() => setEscrowLinking('Paystack')}
                  className={`w-full p-6 border rounded-3xl flex items-center justify-between transition-all group ${wallet.escrowProvider === 'Paystack' ? 'bg-[#00BBFF]/10 border-[#00BBFF]/40' : 'bg-white/5 border-white/5 hover:border-[#00BBFF]/30'}`}
                >
                 <div className="flex items-center gap-4">
                   <div className="w-8 h-8 bg-[#00BBFF] rounded-lg flex items-center justify-center text-white text-[12px] font-black shadow-lg shadow-[#00BBFF]/20">P</div>
                   <span className={`text-xs font-black uppercase tracking-widest ${wallet.escrowProvider === 'Paystack' ? 'text-white' : 'text-slate-500'}`}>Paystack Checkout</span>
                 </div>
                 {wallet.escrowProvider === 'Paystack' ? (
                   <span className="text-[8px] font-black bg-lime-500 text-slate-950 px-3 py-1 rounded-full uppercase">Authenticated</span>
                 ) : (
                   <i className="fa-solid fa-link text-xs text-slate-700 group-hover:text-white transition-colors"></i>
                 )}
               </button>

               {['Stripe Connect', 'Crypto Gateway'].map(method => (
                 <div key={method} className="w-full p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between opacity-30 grayscale cursor-not-allowed">
                   <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{method}</span>
                   <i className="fa-solid fa-lock text-xs text-slate-800"></i>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Arbiter Settlement */}
        <section className="glass-panel p-10 rounded-[40px] border-white/5 flex flex-col justify-between bg-gradient-to-br from-white/[0.02] to-transparent">
          <div>
            <h3 className="font-orbitron font-black text-[10px] uppercase tracking-[0.3em] text-white mb-8 flex items-center gap-3">
              <i className="fa-solid fa-robot text-orange-500"></i> Arbiter Settlement
            </h3>
            <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 mb-8">
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2">Available for Withdrawal</p>
               <p className="text-4xl font-orbitron font-black text-white">${wallet.credits.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {auditResult && (
              <div className={`p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2 ${auditResult.authorized ? 'bg-lime-500/20 text-lime-400' : 'bg-red-500/20 text-red-400'}`}>
                {auditResult.authorized ? 'Audit Passed: Payout Authorized' : `Audit Flagged: ${auditResult.reason}`}
              </div>
            )}
            <button 
              onClick={processWithdrawal}
              disabled={isAuditing || wallet.credits <= 0 || !wallet.escrowLinked}
              className="w-full py-6 bg-white text-slate-950 rounded-[25px] font-orbitron font-black text-[11px] uppercase tracking-[0.3em] hover:bg-orange-500 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-20"
            >
              {isAuditing ? 'Gemini Security Audit...' : 'Withdraw to Paystack'}
            </button>
            <p className="text-[8px] text-center text-slate-600 font-bold uppercase tracking-widest">Final payout is net 70% of prize earnings.</p>
          </div>
        </section>
      </div>

      {/* Paystack Bridge UI Simulation */}
      {escrowLinking && (
        <div className="fixed inset-0 z-[600] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-6">
           <div className="glass-panel w-full max-w-sm p-12 rounded-[50px] border-[#00BBFF]/30 text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-[#00BBFF] rounded-[25px] flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(0,187,255,0.3)]">
                 <i className="fa-solid fa-building-columns text-white text-3xl"></i>
              </div>
              <h2 className="text-3xl font-orbitron font-black text-white uppercase italic mb-2 tracking-tighter">Paystack Bridge</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mb-12">Authorizing Settlement Splits</p>
              
              <div className="bg-slate-950 p-8 rounded-3xl border border-white/10 mb-10 space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-600 uppercase">Settlement Rule</span>
                  <span className="text-[10px] font-black text-[#00BBFF] uppercase">70% Win / 30% Fee</span>
                </div>
                <div className="h-[1px] bg-white/5"></div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase italic">
                  "I authorize Elite Rivals to manage a virtual escrow subaccount. Prize payouts will be automated via Gemini-X Arbiter logic."
                </p>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setEscrowLinking(null)} className="flex-1 py-5 bg-slate-900 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Abort</button>
                 <button 
                  onClick={() => { onLinkEscrow('Paystack'); setEscrowLinking(null); }} 
                  className="flex-1 py-5 bg-[#00BBFF] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#00BBFF]/20"
                >
                  Confirm Bridge
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Ledger UI */}
      <section className="glass-panel rounded-[40px] border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
          <h3 className="font-orbitron font-black uppercase tracking-[0.3em] text-[10px] text-slate-500">Combat Financial Records</h3>
          <span className="text-[8px] font-black text-lime-500 uppercase border border-lime-500/20 px-3 py-1 rounded-full animate-pulse">Live Link: Secure</span>
        </div>
        <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
          {wallet.transactions.length === 0 ? (
            <div className="p-32 text-center text-slate-700 font-black uppercase tracking-[0.5em] text-[10px] italic">No transaction packets detected.</div>
          ) : (
            wallet.transactions.map((tx, i) => (
              <div key={i} className="p-8 flex items-center justify-between hover:bg-white/[0.03] transition-colors group">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors ${
                    tx.type === 'WIN' ? 'bg-lime-500/10 border-lime-500/30 text-lime-400 group-hover:bg-lime-500/20' : 
                    tx.type === 'ENTRY' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 group-hover:bg-orange-500/20' : 'bg-slate-900 border-white/5 text-slate-500'
                  }`}>
                    <i className={`fa-solid ${tx.type === 'WIN' ? 'fa-trophy' : tx.type === 'ENTRY' ? 'fa-lock' : 'fa-receipt'}`}></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-black text-sm uppercase italic text-white tracking-tighter">{tx.description}</p>
                      {tx.provider === 'Paystack' && <span className="text-[7px] bg-[#00BBFF]/20 text-[#00BBFF] px-2 py-0.5 rounded font-black uppercase tracking-widest">Paystack</span>}
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">{new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-orbitron font-black text-xl ${tx.type === 'WIN' || tx.type === 'DEPOSIT' ? 'text-lime-400' : 'text-slate-400'}`}>
                    {tx.type === 'ENTRY' || tx.type === 'WITHDRAW' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </p>
                  <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest">ID: {tx.id.toUpperCase()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;