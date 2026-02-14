
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Match, MatchStatus } from '../types';
import { WINNER_PRIZE_PERCENT } from '../constants';

interface MatchDetailsProps {
  matches: Match[];
  joinMatch: (id: string) => void;
  startMatch: (id: string) => void;
  currentUser: any;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ matches, joinMatch, startMatch, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const match = matches.find(m => m.id === id);

  if (!match) return <div className="text-center py-20">Match not found.</div>;

  const isPlayerIn = match.players.some(p => p.id === currentUser.id);

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <section className="glass-panel p-8 rounded-3xl border-white/10">
          <h1 className="text-3xl font-orbitron font-black mb-4">{match.title}</h1>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pot To Winner</p>
              <p className="text-2xl font-orbitron font-bold text-lime-400">${(match.totalPrizePool * WINNER_PRIZE_PERCENT).toFixed(2)}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Entry Fee</p>
              <p className="text-2xl font-orbitron font-bold">${match.entryFee}</p>
            </div>
          </div>

          <h3 className="font-orbitron font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Player Registry ({match.players.length}/{match.maxPlayers})</h3>
          <div className="space-y-2">
            {match.players.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black">{p.username.charAt(0)}</div>
                  <span className="font-bold text-sm">{p.username} {p.id === currentUser.id && '(YOU)'}</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">{p.rank}</span>
              </div>
            ))}
            {match.players.length === 0 && <p className="text-center text-slate-600 italic py-4">Lobby is empty...</p>}
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="glass-panel p-8 rounded-3xl border-lime-500/20 sticky top-28">
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Match Status</p>
            <div className="inline-block px-4 py-1 bg-lime-500 text-slate-950 rounded-full font-black font-orbitron text-xs">
              {match.status}
            </div>
          </div>

          {!isPlayerIn ? (
            <button 
              onClick={() => joinMatch(match.id)}
              disabled={match.status !== MatchStatus.OPEN}
              className="w-full py-4 bg-lime-500 hover:bg-lime-400 text-slate-950 rounded-2xl font-orbitron font-black text-lg transition-all shadow-[0_0_20px_rgba(132,204,22,0.3)] disabled:opacity-50"
            >
              PAY & JOIN
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-lime-500/10 border border-lime-500/30 rounded-2xl text-center text-lime-400 font-bold">
                You're in the squad!
              </div>
              {match.status === MatchStatus.FULL && (
                <button 
                  onClick={() => {
                    startMatch(match.id);
                    navigate(`/live/${match.id}`);
                  }}
                  className="w-full py-4 bg-white text-slate-950 rounded-2xl font-orbitron font-black text-lg animate-pulse"
                >
                  START MATCH
                </button>
              )}
            </div>
          )}
          
          <p className="text-[10px] text-center text-slate-500 mt-6 uppercase font-bold tracking-tighter">
            Funds are locked until match completion. AI Arbitrator verdict is final.
          </p>
        </section>
      </div>
    </div>
  );
};

export default MatchDetails;
