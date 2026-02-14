
import React from 'react';
import { Link } from 'react-router-dom';
import { Match, MatchStatus } from '../types';
import { PLATFORM_FEE_PERCENT, WINNER_PRIZE_PERCENT } from '../constants';

interface DashboardProps {
  matches: Match[];
  joinMatch: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ matches, joinMatch }) => {
  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <section className="relative h-64 rounded-3xl overflow-hidden flex items-center px-12 group">
        <img 
          src="https://picsum.photos/seed/cod-bg/1200/400" 
          alt="Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-orbitron font-black mb-4 leading-tight">
            COMPETE. <span className="text-lime-400">CONQUER.</span> <br />COLLECT.
          </h1>
          <p className="text-slate-300 text-lg">
            High-stakes 10-player tournaments. 70% prize pool to the winner. 
            Powered by advanced <span className="text-lime-400 font-bold">RICHOCHET-X</span> AI anti-cheat.
          </p>
        </div>
      </section>

      {/* Stats Quick Look */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Matches', value: matches.length, icon: 'fa-gamepad', color: 'text-lime-400' },
          { label: 'Avg. Prize Pool', value: '$125.00', icon: 'fa-trophy', color: 'text-yellow-400' },
          { label: 'Total Players', value: '12,402', icon: 'fa-users', color: 'text-blue-400' },
          { label: 'Protected By', value: 'AI Anti-Cheat', icon: 'fa-shield-halved', color: 'text-red-400' }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl flex items-center gap-5 border-white/5">
            <div className={`text-2xl ${stat.color} bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-orbitron font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Match List */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-orbitron font-bold">Featured Matches</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-800 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors">Filter</button>
            <button className="px-4 py-2 bg-slate-800 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors">Sort By</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {matches.map(match => (
            <div key={match.id} className="glass-panel rounded-2xl overflow-hidden card-shadow transition-all duration-300 group border-white/10 flex flex-col">
              <div className="h-40 relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${match.id}/600/300`} 
                  alt={match.map} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  {match.gameMode}
                </div>
                {match.status === MatchStatus.FULL && (
                  <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-red-500 px-4 py-2 rounded font-orbitron font-bold text-sm tracking-widest">MATCH FULL</span>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold font-orbitron group-hover:text-lime-400 transition-colors">{match.title}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="space-y-1">
                    <p className="text-slate-500 text-xs uppercase font-bold">Map</p>
                    <p className="font-semibold">{match.map}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500 text-xs uppercase font-bold">Prize Pool</p>
                    <p className="text-lime-400 font-bold">${match.totalPrizePool.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="text-sm">
                      <span className="text-slate-400">Entry Fee:</span> <span className="text-white font-bold ml-1">${match.entryFee}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {match.players.length} / {match.maxPlayers} Players
                    </div>
                  </div>
                  
                  {/* Progress Bar for Players */}
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${match.status === MatchStatus.FULL ? 'bg-red-500' : 'bg-lime-500'}`}
                      style={{ width: `${(match.players.length / match.maxPlayers) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link 
                      to={`/match/${match.id}`}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold text-sm text-center transition-colors"
                    >
                      View Details
                    </Link>
                    <button 
                      onClick={() => joinMatch(match.id)}
                      disabled={match.status === MatchStatus.FULL}
                      className={`flex-1 ${match.status === MatchStatus.FULL ? 'bg-slate-900 cursor-not-allowed text-slate-600' : 'bg-lime-500 hover:bg-lime-400 text-slate-950'} py-3 rounded-xl font-bold text-sm transition-colors`}
                    >
                      {match.status === MatchStatus.FULL ? 'Locked' : 'Join Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
