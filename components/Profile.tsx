import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UserWallet, Transaction } from '../types';
import { createInvoice } from '../services/nowpayments';
import { authorizeWithdrawal } from '../services/geminiService';

interface ProfileProps {
  user: any;
  wallet: UserWallet;
  onDeposit: (amount: number, reference: string) => void;
  onWithdraw: (amount: number) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, wallet, onDeposit, onWithdraw }) => {
  const [depositAmount, setDepositAmount] = useState<number>(25);
  const [payCurrency, setPayCurrency] = useState<string>('usdttrc20');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success') {
      setAuditMessage("Payment initialized. Credits will appear once confirmed on-chain.");
    }
  }, [location]);

  const handleDeposit = async () => {
    setIsProcessing(true);
    setAuditMessage(null);
    try {
      const invoice = await createInvoice({
        price_amount: depositAmount,
        price_currency: 'usd',
        pay_currency: payCurrency,
        order_description: `Combat Credits for ${user.username}`,
        order_id: `ER_${Date.now()}`
      });

      // In production, you would handle this via Webhooks, 
      // but for this UI we redirect to the invoice page.
      if (invoice.invoice_url) {
        window.location.href = invoice.invoice_url;
      }
    } catch (error: any) {
      console.error(error);
      setAuditMessage(`Payment Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawalRequest = async () => {
    if (wallet.credits < 10) {
      setAuditMessage("Minimum withdrawal is $10.00");
      return;
    }

    setIsAuditing(true);
    setAuditMessage("Arbiter auditing match history for integrity...");
    
    const result = await authorizeWithdrawal(wallet.credits, wallet.transactions.slice(0, 20));
    
    setTimeout(() => {
      setIsAuditing(false);
      if (result.authorized) {
        onWithdraw(wallet.credits);
        setAuditMessage("Withdrawal authorized. Funds dispatched to NowPayments settlement bridge.");
      } else {
        setAuditMessage(`Audit Failed: ${result.reason}`);
      }
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Profile HUD */}
      <section className="glass-panel p-10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-transparent to-transparent opacity-20"></div>
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-slate-900 border-2 border-orange-500/50 text-orange-500 flex items-center justify-center rounded-[30px] font-orbitron font-black text-3xl shadow-xl shadow-orange-500/10">
            {user.username.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-orbitron font-black uppercase tracking-tighter">{user.username}</h1>
            <p className="text-orange-500 font-bold text-[10px] tracking-widest uppercase mt-1">{user.rank} Level Player • Trust Score: {user.trustFactor}%</p>
          </div>
        </div>
        <div className="text-right bg-black/30 p-6 rounded-3xl border border-white/5 min-w-[200px]">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Available Credits</p>
          <p className="text-4xl font-orbitron font-black text-white">${wallet.credits.toFixed(2)}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Deposit Section */}
        <section className="glass-panel p-10 rounded-[40px] border-orange-500/10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-orbitron font-black text-xs uppercase tracking-[0.3em] text-white flex items-center gap-2">
                <i className="fa-solid fa-vault text-orange-500"></i> Crypto Liquidity Top-Up
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                Powered by <span className="text-white">NOWPAYMENTS.IO</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed uppercase">
              Global instant deposits via BTC, ETH, or USDT. No borders. No limits.
            </p>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[25, 50, 100].map(amt => (
                <button 
                  key={amt}
                  onClick={() => setDepositAmount(amt)}
                  className={`py-4 rounded-xl font-orbitron font-black text-xs transition-all border ${depositAmount === amt ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-lg shadow-orange-500/20' : 'bg-slate-900 text-slate-400 border-white/5 hover:border-orange-500/50'}`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="space-y-2 mb-8">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Protocol</label>
               <select 
                value={payCurrency}
                onChange={(e) => setPayCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white font-bold outline-none"
               >
                 <option value="usdttrc20">USDT (TRC20)</option>
                 <option value="btc">Bitcoin (BTC)</option>
                 <option value="eth">Ethereum (ETH)</option>
                 <option value="ltc">Litecoin (LTC)</option>
               </select>
            </div>
          </div>
          
          <button 
            onClick={handleDeposit}
            disabled={isProcessing}
            className="w-full py-5 bg-white text-slate-950 rounded-[20px] font-orbitron font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? 'GENERATING INVOICE...' : 'INITIALIZE CRYPTO TRANSFER'}
          </button>
        </section>

        {/* Withdrawal Section */}
        <section className="glass-panel p-10 rounded-[40px] border-white/5 flex flex-col justify-between bg-slate-900/30">
          <div>
            <h3 className="font-orbitron font-black text-xs uppercase tracking-[0.3em] text-white mb-6 flex items-center gap-2">
              <i className="fa-solid fa-money-bill-transfer text-orange-500"></i> Disburse Winnings
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed uppercase">
              70% Payouts are settled to your linked wallet address. Every withdrawal is audited by Gemini-X for behavioral integrity.
            </p>
            {auditMessage && (
              <div className="mb-6 p-4 rounded-xl bg-black/40 border border-orange-500/20 text-[10px] font-black uppercase text-orange-500 animate-in fade-in">
                {auditMessage}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleWithdrawalRequest}
            disabled={isAuditing || wallet.credits < 1}
            className="w-full py-5 bg-slate-800 text-slate-300 border border-white/5 rounded-[20px] font-orbitron font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all active:scale-95 disabled:opacity-20"
          >
            {isAuditing ? 'AI AUDIT IN PROGRESS...' : 'INITIATE CRYPTO PAYOUT'}
          </button>
        </section>
      </div>

      {/* Ledger */}
      <section className="glass-panel rounded-[40px] border-white/5 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <h3 className="font-orbitron font-black text-[10px] text-slate-500 uppercase tracking-widest">Crypto Sovereignty Ledger</h3>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Blockchain Sync Active</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[400px] divide-y divide-white/5">
          {wallet.transactions.length === 0 ? (
            <div className="p-20 text-center opacity-30 italic text-xs font-bold uppercase tracking-widest">No on-chain activity detected.</div>
          ) : (
            wallet.transactions.map((tx, i) => (
              <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                    tx.type === 'WIN' ? 'bg-lime-500/10 border-lime-500/20 text-lime-400 group-hover:scale-110' : 
                    tx.type === 'ENTRY' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                    'bg-orange-500/10 border-orange-500/20 text-orange-400'
                  }`}>
                    <i className={`fa-solid ${tx.type === 'WIN' ? 'fa-trophy' : tx.type === 'ENTRY' ? 'fa-shield-halved' : 'fa-bitcoin-sign'}`}></i>
                  </div>
                  <div>
                    <p className="font-black text-sm text-white uppercase italic tracking-tighter">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[9px] text-slate-600 font-bold uppercase">{new Date(tx.timestamp).toLocaleString()}</p>
                      <span className="text-[7px] text-slate-800 font-black px-1 border border-white/5 rounded">HASH: {tx.id}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-orbitron font-black text-xl ${tx.type === 'WIN' || tx.type === 'DEPOSIT' ? 'text-lime-400' : 'text-slate-400'}`}>
                    {tx.type === 'ENTRY' || tx.type === 'WITHDRAW' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </p>
                  <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest">Verified</p>
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