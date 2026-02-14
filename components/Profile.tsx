
import React, { useState } from 'react';
import { UserWallet, LinkedAccount } from '../types';

interface ProfileProps {
  user: any;
  wallet: UserWallet;
  onLinkAccount: (provider: LinkedAccount['provider'], username: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, wallet, onLinkAccount }) => {
  const [linking, setLinking] = useState<LinkedAccount['provider'] | null>(null);
  const [inputUsername, setInputUsername] = useState('');

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (linking) {
      onLinkAccount(linking, inputUsername);
      setLinking(null);
      setInputUsername('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <section className="glass-panel p-10 rounded-[40px] border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-lime-500/5 blur-3xl rounded-full"></div>
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-slate-900 border-2 border-lime-500 text-lime-500 flex items-center justify-center rounded-3xl font-orbitron font-black text-3xl shadow-[0_0_15px_rgba(132,204,22,0.2)]">
            {user.username.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-orbitron font-black">{user.username}</h1>
            <p className="text-lime-500 font-bold text-sm tracking-widest uppercase">{user.rank}</p>
          </div>
        </div>
        <div className="text-right relative z-10">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Credits</p>
          <p className="text-4xl font-orbitron font-black text-white">${wallet.credits.toFixed(2)}</p>
        </div>
      </section>

      {/* Linked Accounts - THE "REAL" PART */}
      <section className="glass-panel p-8 rounded-3xl border-white/10">
        <h3 className="font-orbitron font-bold mb-6 flex items-center gap-3">
          <i className="fa-solid fa-link text-lime-400"></i> LINKED ACCOUNTS
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['Activision', 'PlayStation', 'Xbox', 'Battle.net'] as const).map(provider => {
            const account = user.linkedAccounts.find((a: any) => a.provider === provider);
            return (
              <div key={provider} className="bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 ${account ? 'text-lime-400' : 'text-slate-600'}`}>
                    <i className={`fa-brands fa-${provider === 'Activision' ? 'codiepie' : provider.toLowerCase().replace('.', '')}`}></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{provider}</p>
                    <p className="text-sm font-bold text-white">{account ? account.username : 'Not Connected'}</p>
                  </div>
                </div>
                {account ? (
                  <span className="text-[10px] bg-lime-500/20 text-lime-400 px-2 py-1 rounded-full font-black uppercase">Verified</span>
                ) : (
                  <button 
                    onClick={() => setLinking(provider)}
                    className="text-[10px] bg-white text-slate-950 px-3 py-1 rounded-full font-black uppercase hover:bg-lime-400 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Link Account Modal */}
      {linking && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="glass-panel w-full max-w-sm p-8 rounded-3xl border-lime-500/30">
            <div className="text-center mb-6">
              <i className="fa-solid fa-shield-halved text-4xl text-lime-400 mb-4"></i>
              <h2 className="text-xl font-orbitron font-bold text-white">OAuth 2.0 Secure Link</h2>
              <p className="text-xs text-slate-400 mt-2">Link your {linking} account safely using official API credentials.</p>
            </div>
            <form onSubmit={handleLink} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Enter GamerTag / ID</label>
                <input 
                  required 
                  autoFocus
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-lime-500" 
                  placeholder="GamerTag#1234"
                  value={inputUsername}
                  onChange={e => setInputUsername(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setLinking(null)} className="flex-1 py-3 bg-slate-800 rounded-xl font-bold text-xs">CANCEL</button>
                <button type="submit" className="flex-1 py-3 bg-lime-500 text-slate-950 rounded-xl font-black font-orbitron text-xs">LINK ACCOUNT</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Ledger */}
      <section className="glass-panel rounded-3xl border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-orbitron font-bold">TRANSACTION LEDGER</h3>
        </div>
        <div className="divide-y divide-white/5">
          {wallet.transactions.map((tx, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === 'WIN' ? 'bg-lime-500/20 text-lime-400' : 
                  tx.type === 'ENTRY' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  <i className={`fa-solid ${tx.type === 'WIN' ? 'fa-trophy' : tx.type === 'ENTRY' ? 'fa-minus' : 'fa-plus'}`}></i>
                </div>
                <div>
                  <p className="font-bold text-sm">{tx.description}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{new Date(tx.timestamp).toLocaleDateString()} • {new Date(tx.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
              <p className={`font-orbitron font-bold text-lg ${tx.type === 'WIN' || tx.type === 'DEPOSIT' ? 'text-lime-400' : 'text-slate-400'}`}>
                {tx.type === 'ENTRY' ? '-' : '+'}${tx.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
