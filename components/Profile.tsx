
import React from 'react';
import { UserWallet } from '../types';

interface ProfileProps {
  user: any;
  wallet: UserWallet;
}

const Profile: React.FC<ProfileProps> = ({ user, wallet }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="glass-panel p-10 rounded-[40px] border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-3xl bg-slate-800 border-2 border-lime-500 flex items-center justify-center text-4xl font-orbitron font-black text-lime-400">
            {user.username.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-orbitron font-black mb-2">{user.username}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-slate-400 uppercase tracking-widest border border-white/5">
                {user.rank}
              </span>
              <span className="px-3 py-1 bg-lime-500/20 rounded-full text-xs font-bold text-lime-400 uppercase tracking-widest border border-lime-500/20">
                Verified Player
              </span>
            </div>
          </div>
          <div className="bg-slate-900 px-8 py-6 rounded-3xl border border-white/5">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Wallet Balance</p>
            <p className="text-3xl font-orbitron font-black text-lime-400">${wallet.credits.toFixed(2)}</p>
            <button className="mt-4 w-full bg-white text-slate-950 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
              Add Funds
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Win Rate', value: `${user.winRate}%`, icon: 'fa-percentage' },
          { label: 'Matches Played', value: '142', icon: 'fa-gamepad' },
          { label: 'Anti-Cheat Score', value: `${user.antiCheatScore}%`, icon: 'fa-shield-halved' }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <i className={`fa-solid ${stat.icon} text-slate-500 text-sm`}></i>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{stat.label}</p>
            </div>
            <p className="text-2xl font-orbitron font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="glass-panel p-8 rounded-[40px] border-white/10">
        <h3 className="font-orbitron text-xl mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { match: 'Terminal S&D High Stakes', result: 'Won', prize: '+$175.00', date: '2 hours ago' },
            { match: 'Rebirth Resurgence', result: 'Lost', prize: '-$10.00', date: '5 hours ago' },
            { match: 'Weekend Warriors Solos', result: 'Won', prize: '+$70.00', date: 'Yesterday' }
          ].map((act, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/[0.07] transition-colors cursor-pointer border border-transparent hover:border-white/10">
              <div>
                <p className="font-bold text-white">{act.match}</p>
                <p className="text-xs text-slate-500">{act.date}</p>
              </div>
              <div className="text-right">
                <p className={`font-orbitron font-black ${act.result === 'Won' ? 'text-lime-400' : 'text-red-400'}`}>
                  {act.prize}
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-bold">{act.result}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
