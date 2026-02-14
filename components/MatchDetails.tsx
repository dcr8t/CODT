
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Match, MatchStatus } from '../types';
import { PLATFORM_FEE_PERCENT, WINNER_PRIZE_PERCENT } from '../constants';
import { getMatchProTips } from '../services/geminiService';

interface MatchDetailsProps {
  matches: Match[];
  joinMatch: (id: string) => void;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ matches, joinMatch }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tips, setTips] = useState<string>("Loading strategy tips...");
  
  const match = matches.find(m => m.id === id);

  useEffect(() => {
    if (match) {
      getMatchProTips(match.map, match.gameMode).then(setTips);
    }
  }, [match]);

  if (!match) return <div className="text-center py-20">Match not found.</div>;

  const winnerTakeHome = match.totalPrizePool * WINNER_PRIZE_PERCENT;
  const platformFee = match.totalPrizePool * PLATFORM_FEE_PERCENT;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Info & Tips */}
      <div className="lg:col-span-2 space-y-8">
        <section className="glass-panel p-8 rounded-3xl border-white/10">
          <button 
            onClick={() => navigate(-1)}
            className="mb-6 text-slate-500 hover:text-white flex items-center gap-2 transition-colors text-sm uppercase tracking-widest font-bold"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Lobby
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-orbitron font-black mb-2">{match.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2 text-slate-400 bg-white/5 px-3 py-1 rounded">
                  <i className="fa-solid fa-map-location-dot"></i> {match.map}
                </span>
                <span className="flex items-center gap-2 text-slate-400 bg-white/5 px-3 py-1 rounded">
                  <i className="fa-solid fa-gamepad"></i> {match.gameMode}
                </span>
                <span className="flex items-center gap-2 text-lime-400 bg-white/5 px-3 py-1 rounded font-bold">
                  <i className="fa-solid fa-shield-check"></i> RICHOCHET-X Active
                </span>
              </div>
            </div>
            <div className="bg-lime-500 text-slate-950 px-6 py-4 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Winner Prize</span>
              <span className="text-2xl font-orbitron font-black">${winnerTakeHome.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-slate-500 uppercase mb-1 font-bold">Entry Fee</p>
              <p className="text-xl font-bold font-orbitron">${match.entryFee}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-slate-500 uppercase mb-1 font-bold">Total Pool</p>
              <p className="text-xl font-bold font-orbitron">${match.totalPrizePool}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-slate-500 uppercase mb-1 font-bold">Max Players</p>
              <p className="text-xl font-bold font-orbitron">{match.maxPlayers}</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h3 className="font-orbitron text-xl mb-4 text-white">AI Strategy Intel</h3>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-lime-500/20 text-slate-300 leading-relaxed italic">
              {tips.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-panel p-8 rounded-3xl border-white/10">
          <h3 className="font-orbitron text-xl mb-6 flex items-center gap-3">
            <i className="fa-solid fa-users text-lime-400"></i> Registered Squad
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-left text-xs text-slate-500 uppercase tracking-widest border-b border-white/5">
                <tr>
                  <th className="pb-4 px-2">Player</th>
                  <th className="pb-4 px-2">Rank</th>
                  <th className="pb-4 px-2">Win Rate</th>
                  <th className="pb-4 px-2">Trust Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {match.players.map((p, i) => (
                  <tr key={i} className="group">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold">
                          {p.username.charAt(0)}
                        </div>
                        <span className="font-bold group-hover:text-lime-400 transition-colors">{p.username}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-slate-400 text-sm">{p.rank}</td>
                    <td className="py-4 px-2 font-mono text-sm">{p.winRate}%</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-slate-800 rounded-full">
                          <div 
                            className="h-full bg-lime-500 rounded-full" 
                            style={{ width: `${p.antiCheatScore}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-lime-400 font-bold">{p.antiCheatScore}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {match.players.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500 italic">No players joined yet. Be the first!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Right Column: Prize Breakdown & Action */}
      <div className="space-y-8">
        <section className="glass-panel p-8 rounded-3xl border-white/10 sticky top-28">
          <h3 className="font-orbitron text-xl mb-8">Prize Distribution</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lime-500/20 flex items-center justify-center text-lime-400">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <div>
                  <p className="font-bold text-white">Winner (70%)</p>
                  <p className="text-xs text-slate-500">Instant Credit Transfer</p>
                </div>
              </div>
              <span className="text-xl font-bold text-lime-400">${winnerTakeHome.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                  <i className="fa-solid fa-building"></i>
                </div>
                <div>
                  <p className="font-bold text-white">Platform Fee (30%)</p>
                  <p className="text-xs text-slate-500">Anti-Cheat & Support</p>
                </div>
              </div>
              <span className="text-xl font-bold text-slate-500">${platformFee.toFixed(2)}</span>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm mb-6">
                <span className="text-slate-400">Entry Fee:</span>
                <span className="text-white font-bold">${match.entryFee.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={() => joinMatch(match.id)}
                disabled={match.status === MatchStatus.FULL}
                className={`w-full py-4 rounded-2xl font-orbitron font-black text-lg transition-all ${
                  match.status === MatchStatus.FULL 
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                    : 'bg-lime-500 hover:bg-lime-400 text-slate-950 hover:shadow-[0_0_20px_rgba(132,204,22,0.4)]'
                }`}
              >
                {match.status === MatchStatus.FULL ? 'MATCH FULL' : 'SECURE YOUR SPOT'}
              </button>
              
              <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-widest font-bold">
                <i className="fa-solid fa-lock mr-2"></i> Encrypted Transaction
              </p>
            </div>
          </div>
        </section>

        <section className="glass-panel p-6 rounded-3xl border-white/10 bg-gradient-to-br from-red-500/5 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
            <h4 className="font-orbitron font-bold text-sm text-red-500 uppercase tracking-widest">Anti-Cheat Notice</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            By joining, you agree to our 24/7 AI-monitored replay analysis. Detection of chronus, aim-bots, or wall-hacks will result in a permanent HWID ban and forfeiture of all platform funds.
          </p>
        </section>
      </div>
    </div>
  );
};

export default MatchDetails;
