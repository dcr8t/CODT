
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Match, MatchStatus, TelemetryLog } from '../types';
import { generateTacticalAdvice } from '../services/geminiService';

interface LiveMatchProps {
  matches: Match[];
  resolveMatch: (id: string, winnerId: string) => void;
  currentUser: any;
}

const LiveMatch: React.FC<LiveMatchProps> = ({ matches, resolveMatch, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [score, setScore] = useState({ teamA: 0, teamB: 0 });
  const [statusText, setStatusText] = useState('SYNCING CLOUD TELEMETRY...');
  const [tacticalIntel, setTacticalIntel] = useState('Awaiting game state pulse...');
  const [isGameOver, setIsGameOver] = useState(false);
  const match = matches.find(m => m.id === id);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!match || isGameOver) return;

    const interval = setInterval(() => {
      const isTeamAWin = Math.random() > 0.5;
      setScore(prev => {
        const nextScore = {
          teamA: isTeamAWin ? prev.teamA + 1 : prev.teamA,
          teamB: !isTeamAWin ? prev.teamB + 1 : prev.teamB
        };
        
        // CoD/CS Victory Condition simulation
        const limit = match.gameType.includes('COD') ? 30 : 13;
        if (nextScore.teamA >= limit || nextScore.teamB >= limit) {
          setIsGameOver(true);
          setTimeout(() => handleMatchCompletion(nextScore), 3000);
        }
        
        return nextScore;
      });

      const newLog: TelemetryLog = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        event: match.gameType.includes('COD') ? 'ELIMINATION_CONFIRMED' : 'ROUND_VERIFIED',
        data: isTeamAWin ? 'Squad 1 (Alpha) dominant state' : 'Squad 2 (Bravo) dominant state',
        type: 'GAME_EVENT'
      };
      setLogs(prev => [...prev.slice(-15), newLog]);
      setStatusText('LIVE TELEMETRY: OK');
      
    }, 4000);

    return () => clearInterval(interval);
  }, [match, isGameOver]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleMatchCompletion = (finalScore: {teamA: number, teamB: number}) => {
    resolveMatch(match!.id, currentUser.id); 
    navigate('/profile');
  };

  if (!match) return null;

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 p-4 md:p-8">
      
      {/* Universal Arena HUD */}
      <section className="glass-panel p-10 md:p-16 rounded-[60px] border-orange-500/20 relative overflow-hidden bg-slate-900/30">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-white to-orange-500 opacity-40"></div>
        
        <div className="flex justify-between items-start mb-16">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">{match.gameType.replace('_', ' ')} TELEMETRY</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{statusText}</span>
            </div>
          </div>
          <div className="bg-black/40 border border-white/5 px-6 py-2 rounded-full">
            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{match.map} // {match.gameMode}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-around gap-12">
          {/* Team A */}
          <div className="text-center group flex-1">
            <div className="w-24 h-24 bg-blue-500/10 border-2 border-blue-500/30 rounded-[3rem] flex items-center justify-center mx-auto mb-6 group-hover:border-blue-500 transition-all shadow-2xl">
              <i className="fa-solid fa-users text-blue-500 text-4xl"></i>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">SQUAD ALPHA</p>
            <h2 className="text-7xl md:text-9xl font-orbitron font-black text-white tracking-tighter">{score.teamA}</h2>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="text-3xl font-orbitron font-black text-slate-800 italic">VS</div>
            <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Team B */}
          <div className="text-center group flex-1">
            <div className="w-24 h-24 bg-orange-500/10 border-2 border-orange-500/30 rounded-[3rem] flex items-center justify-center mx-auto mb-6 group-hover:border-orange-500 transition-all shadow-2xl">
              <i className="fa-solid fa-fire text-orange-500 text-4xl"></i>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">SQUAD BRAVO</p>
            <h2 className="text-7xl md:text-9xl font-orbitron font-black text-white tracking-tighter">{score.teamB}</h2>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Live Event Stream */}
        <section className="lg:col-span-2 glass-panel rounded-[50px] border-white/5 flex flex-col bg-black/50 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
              <i className="fa-solid fa-satellite-dish text-orange-500"></i> Cloud Pulse Stream
            </h3>
            <span className="text-[9px] font-black text-lime-500 uppercase bg-lime-500/10 px-4 py-1.5 rounded-full border border-lime-500/20">Sync Latency: 4ms</span>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-6 font-mono text-[11px] custom-scrollbar h-[400px]">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-6 group animate-in slide-in-from-left-2">
                <span className="text-slate-600 shrink-0 font-bold">[{log.timestamp}]</span>
                <div>
                  <p className="text-orange-500 font-black uppercase tracking-widest text-[9px] mb-0.5">{log.event}</p>
                  <p className="text-slate-300 font-medium">{log.data}</p>
                </div>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
          <div className="p-6 bg-white/5 border-t border-white/5 flex gap-4">
             <button className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-3xl text-[10px] font-black uppercase text-white transition-all tracking-widest border border-white/5">Pause Monitoring</button>
             <button className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-3xl text-[10px] font-black uppercase text-white transition-all tracking-widest border border-white/5">Export Match Replay</button>
          </div>
        </section>

        {/* Financial & Tactical Hub */}
        <section className="space-y-8">
          <div className="glass-panel p-10 rounded-[50px] border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent shadow-2xl">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                 <i className="fa-solid fa-brain"></i>
               </div>
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest">AI Tactical Advisor</h3>
             </div>
             <p className="text-sm text-slate-400 italic mb-10 leading-relaxed font-medium">"{tacticalIntel}"</p>
             <button 
                onClick={async () => {
                  setTacticalIntel('Recalculating battlefield vectors...');
                  const advice = await generateTacticalAdvice(match.map, {ct: score.teamA, t: score.teamB});
                  setTacticalIntel(advice);
                }}
                className="w-full py-5 bg-orange-500 text-slate-950 rounded-3xl font-black text-[10px] uppercase shadow-2xl shadow-orange-500/20 hover:bg-white transition-all"
              >
                Request Fresh Intel
             </button>
          </div>

          <div className="glass-panel p-10 rounded-[50px] border-white/5 shadow-2xl">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Escrow Distribution</h3>
             <div className="space-y-6">
                <div className="bg-lime-500/5 p-8 rounded-[40px] border border-lime-500/20 text-center">
                  <p className="text-[10px] font-black text-lime-500 uppercase mb-2 tracking-widest italic">Winner's Projected Take</p>
                  <p className="text-5xl font-orbitron font-black text-lime-400">${(match.totalPrizePool * 0.7).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4 text-slate-600 px-2">
                  <i className="fa-solid fa-lock text-[12px]"></i>
                  <p className="text-[9px] font-bold leading-relaxed italic uppercase tracking-tighter">
                    Funds are locked in high-security escrow until game-over telemetry is verified by the cloud arbiter.
                  </p>
                </div>
             </div>
          </div>
        </section>
      </div>

      {isGameOver && (
        <div className="fixed inset-0 z-[300] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-8 text-center animate-in fade-in duration-700">
          <div className="space-y-8 animate-in zoom-in duration-500 max-w-2xl">
            <div className="w-32 h-32 bg-orange-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_80px_rgba(249,115,22,0.6)] animate-bounce">
              <i className="fa-solid fa-trophy text-slate-950 text-5xl"></i>
            </div>
            <h2 className="text-7xl md:text-9xl font-orbitron font-black text-white tracking-tighter uppercase italic">VICTORY</h2>
            <div className="space-y-4">
              <p className="text-xs font-black text-orange-500 uppercase tracking-[0.6em]">VERIFYING KILL-FEED TELEMETRY...</p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 animate-[loading_3s_ease-in-out]"></div>
              </div>
            </div>
            <p className="text-slate-400 text-lg font-medium leading-relaxed uppercase tracking-widest opacity-60">Payout distribution to winner's wallet initiated.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMatch;
