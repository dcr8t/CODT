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
  const [escrowLinking, setEscrowLinking] = useState<any>(null);
  const [inputUsername, setInputUsername] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditLog, setAuditLog] = useState<string | null>(null);

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (linking && onLinkAccount) {
      onLinkAccount(linking, inputUsername);
      setLinking(null);
      setInputUsername('');
    }
  };

  const finalizeEscrowLink = () => {
    onLinkEscrow(escrowLinking);
    setEscrowLinking(null);
  };

  const processWithdrawal = async () => {
    if (wallet.credits <= 0) return;
    setIsAuditing(true);
    setAuditLog("Initiating AI Security Audit...");
    
    const result = await authorizeWithdrawal(wallet.credits, wallet.transactions.slice(0, 5));
    
    setTimeout(() => {
      if (result.authorized) {
        onWithdraw(wallet.credits);
        setAuditLog(`Withdrawal Approved: ${result.code}`);
      } else {
        setAuditLog(`Flagged: ${result.reason}`);
      }
      setIsAuditing(false);
      setTimeout(() => setAuditLog(null), 3000);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Profile Header */}
      <section className="glass-panel p-10 rounded-[40px] border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full"></div>
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-slate-900 border-2 border-orange-500 text-orange-500 flex items-center justify-center rounded-3xl font-orbitron font-black text-3xl shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            {user.username.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-orbitron font-black uppercase tracking-tighter">{user.username}</h1>
            <p className="text-orange-500 font-bold text-sm tracking-widest uppercase">Premier Rank: {user.rank}</p>
          </div>
        </div>
        <div className="text-right relative z-10">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Combat Credits</p>
          <div className="flex items-center gap-3 justify-end">
            {wallet.escrowLinked && <span className="px-2 py-0.5 bg-lime-500 text-slate-950 text-[8px] font-black rounded uppercase">Escrow Active</span>}
            <p className="text-4xl font-orbitron font-black text-white">${wallet.credits.toFixed(2)}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tactical Vault (Escrow Integration) */}
        <section className="glass-panel p-8 rounded-3xl border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
          <h3 className="font-orbitron font-bold text-xs uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
            <i className="fa-solid fa-vault text-orange-500"></i> Tactical Vault
          </h3>
          <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed uppercase">
            Bridge your real-world currency to the battlefield. Select your preferred gateway for automated payouts.
          </p>
          
          <div className="space-y-3">
             <button 
                onClick={() => setEscrowLinking('Paystack')}
                className={`w-full p-4 border rounded-2xl flex items-center justify-between transition-all group ${wallet.escrowProvider === 'Paystack' ? 'bg-orange-500/20 border-orange-500' : 'bg-white/5 border-white/5 hover:border-orange-500/30'}`}
              >
               <div className="flex items-center gap-3">
                 <div className="w-6 h-6 bg-[#00BBFF] rounded-md flex items-center justify-center text-white text-[10px] font-black">P</div>
                 <span className={`text-xs font-black ${wallet.escrowProvider === 'Paystack' ? 'text-white' : 'text-slate-400'}`}>Paystack Checkout</span>
               </div>
               {wallet.escrowProvider === 'Paystack' ? <i className="fa-solid fa-check text-lime-500"></i> : <i className="fa-solid fa-plus text-[10px] text-slate-600"></i>}
             </button>

             {['Stripe Connect', 'Web3 Wallet'].map(method => (
               <button key={method} className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:border-white/20 transition-all opacity-50 cursor-not-allowed">
                 <span className="text-xs font-black text-slate-500">{method}</span>
                 <i className="fa-solid fa-lock text-[10px] text-slate-700"></i>
               </button>
             ))}
          </div>
        </section>

        {/* AI Payout Authorization */}
        <section className="glass-panel p-8 rounded-3xl border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="font-orbitron font-bold text-xs uppercase tracking-[0.2em] text-white mb-6">Arbiter Authorization</h3>
            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 mb-6">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Escrowed Balance</p>
               <p className="text-2xl font-orbitron font-black text-white">${wallet.credits.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {auditLog && (
              <div className={`p-3 rounded-lg text-center text-[10px] font-black uppercase tracking-widest animate-pulse ${auditLog.includes('Approved') ? 'bg-lime-500/20 text-lime-400' : 'bg-orange-500/20 text-orange-400'}`}>
                {auditLog}
              </div>
            )}
            <button 
              onClick={processWithdrawal}
              disabled={isAuditing || wallet.credits <= 0 || !wallet.escrowLinked}
              className="w-full py-4 bg-white text-slate-950 rounded-2xl font-orbitron font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/10 disabled:opacity-30"
            >
              {isAuditing ? 'AI AUDITING...' : wallet.escrowLinked ? 'AUTHORIZE PAYSTACK PAYOUT' : 'LINK ESCROW TO WITHDRAW'}
            </button>
          </div>
        </section>
      </div>

      {/* Paystack Simulation Modal */}
      {escrowLinking && (
        <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
           <div className="glass-panel w-full max-w-sm p-10 rounded-[40px] border-[#00BBFF]/30 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-[#00BBFF] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#00BBFF]/20">
                 <i className="fa-solid fa-credit-card text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-orbitron font-black text-white uppercase italic mb-2">Paystack Bridge</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Authorizing Split-Payment Escrow</p>
              
              <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 mb-8 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase">Settlement Split</span>
                  <span className="text-[10px] font-black text-[#00BBFF] uppercase">70% Winner / 30% Platform</span>
                </div>
                <div className="h-[1px] bg-white/5"></div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  By linking Paystack, you authorize Elite Rivals to lock match entry fees in a secure escrow subaccount until GSI verification is complete.
                </p>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setEscrowLinking(null)} className="flex-1 py-4 bg-slate-950 text-slate-500 rounded-xl font-black text-[10px] uppercase">Cancel</button>
                 <button onClick={finalizeEscrowLink} className="flex-1 py-4 bg-[#00BBFF] text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-[#00BBFF]/20">Authorize Link</button>
              </div>
           </div>
        </div>
      )}

      {/* Transaction Ledger */}
      <section className="glass-panel rounded-3xl border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <h3 className="font-orbitron font-bold uppercase tracking-widest text-xs text-slate-500">Financial Ledger</h3>
          <span className="text-[9px] font-black text-lime-500 uppercase border border-lime-500/20 px-3 py-1 rounded-full">GSI Secured</span>
        </div>
        <div className="divide-y divide-white/5">
          {wallet.transactions.length === 0 ? (
            <div className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs italic">No activity detected on chain.</div>
          ) : (
            wallet.transactions.map((tx, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'WIN' ? 'bg-lime-500/20 text-lime-400' : 
                    tx.type === 'ENTRY' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    <i className={`fa-solid ${tx.type === 'WIN' ? 'fa-trophy' : tx.type === 'ENTRY' ? 'fa-lock' : 'fa-plus'}`}></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm">{tx.description}</p>
                      {tx.provider === 'Paystack' && <span className="text-[7px] bg-[#00BBFF]/10 text-[#00BBFF] px-1 rounded font-black uppercase">Paystack</span>}
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{new Date(tx.timestamp).toLocaleDateString()} @ {new Date(tx.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                <p className={`font-orbitron font-bold text-lg ${tx.type === 'WIN' || tx.type === 'DEPOSIT' ? 'text-lime-400' : 'text-slate-400'}`}>
                  {tx.type === 'ENTRY' || tx.type === 'WITHDRAW' ? '-' : '+'}${tx.amount.toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;