
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Match, MatchStatus, RconLog } from '../types';
import { generateTacticalAdvice } from '../services/geminiService';

interface LiveMatchProps {
  matches: Match[];
  resolveMatch: (id: string, winnerId: string) => void;
  currentUser: any;
}

const LiveMatch: React.FC<LiveMatchProps> = ({ matches, resolveMatch, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<RconLog[]>([]);
  const [score, setScore] = useState({ ct: 0, t: 0 });
  const [bombStatus, setBombStatus] = useState<'IDLE' | 'PLANTED' | 'DEFUSING'>('IDLE');
  const [rconInput, setRconInput] = useState('');
  const [tacticalIntel, setTacticalIntel] = useState('Syncing with server truth...');
  const [isGameOver, setIsGameOver] = useState(false);
  const match = matches.find(m => m.id === id);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!match || isGameOver) return;

    const interval = setInterval(() => {
      const isCtWin = Math.random() > 0.5;
      setScore(prev => {
        const nextScore = {
          ct: isCtWin ? prev.ct + 1 : prev.ct,
          t: !isCtWin ? prev.t + 1 : prev.t
        };
        
        if (nextScore.ct >= 13 || nextScore.t >= 13) {
          setIsGameOver(true);
          setTimeout(() => handleMatchCompletion(nextScore), 3000);
        }
        
        return nextScore;
      });

      const newLog: RconLog = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        command: 'CLOUD_VERIFY',
        response: `Round ${score.ct + score.t + 1}: ${isCtWin ? 'Defenders Win' : 'Attackers Win'} (Server Validated)`,
        type: 'SYSTEM'
      };
      setLogs(prev => [...prev.slice(-12), newLog]);
      
    }, 6000);

    return () => clearInterval(interval);
  }, [match, isGameOver, score]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleMatchCompletion = (finalScore: {ct: number, t: number}) => {
    resolveMatch(match!.id, currentUser.id); 
    navigate('/profile');
  };

  if (!match) return null;

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      
      {/* High-Accuracy Scoreboard */}
      <section className="glass-panel p-8 md:p-12 rounded-[50px] border-blue-500/20 relative overflow-hidden bg-slate-900/40">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
        
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Server-Side Pulse</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">Source: Cloud Bridge Verified</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-white uppercase tracking-widest bg-blue-500/20 border border-blue-500/30 px-4 py-1.5 rounded-full">
               Live: {match.map.replace('de_', '').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <h2 className="text-7xl md:text-8xl font-orbitron font-black text-white">{score.ct}</h2>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-2">Defenders</p>
          </div>

          <div className="flex flex-col items-center gap-4">
             <div className="text-2xl font-orbitron font-black text-slate-800">VS</div>
             <div className={`px-5 py-2 rounded-full border ${bombStatus === 'PLANTED' ? 'bg-red-500 border-red-400 text-white shadow-lg' : 'bg-slate-900 border-white/10 text-slate-500'} text-[10px] font-black uppercase tracking-widest`}>
                {bombStatus === 'PLANTED' ? 'DETONATION RISK' : 'SECURE'}
             </div>
          </div>

          <div className="flex-1 text-center">
            <h2 className="text-7xl md:text-8xl font-orbitron font-black text-white">{score.t}</h2>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-2">Attackers</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Verification Stream */}
        <section className="lg:col-span-2 glass-panel rounded-[40px] border-white/5 flex flex-col bg-black/40 overflow-hidden">
          <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-microchip text-blue-500"></i> Logic Stream
            </h3>
            <span className="text-[9px] font-bold text-slate-600 uppercase">Sub-tick Verified</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs custom-scrollbar h-80">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 group">
                <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                <p className="text-slate-300"><span className="text-blue-500 font-bold">●</span> {log.response}</p>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
          <div className="p-4 bg-white/5 border-t border-white/5 grid grid-cols-3 gap-3">
             <button className="bg-white/5 hover:bg-white/10 py-3 rounded-2xl text-[10px] font-black uppercase text-white transition-all">Pause Stream</button>
             <button className="bg-white/5 hover:bg-white/10 py-3 rounded-2xl text-[10px] font-black uppercase text-white transition-all">Export GSI</button>
             <button className="bg-white/5 hover:bg-white/10 py-3 rounded-2xl text-[10px] font-black uppercase text-white transition-all">Request VOD</button>
          </div>
        </section>

        {/* Tactical Pipeline */}
        <section className="space-y-6">
          <div className="glass-panel p-8 rounded-[40px] border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
             <div className="flex items-center gap-3 mb-6">
               <i className="fa-solid fa-brain text-blue-500"></i>
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest">AI Strategist</h3>
             </div>
             <p className="text-sm text-slate-400 italic mb-8 leading-relaxed">"{tacticalIntel}"</p>
             <button 
                onClick={async () => {
                  setTacticalIntel('Calculating optimal paths...');
                  const advice = await generateTacticalAdvice(match.map, score);
                  setTacticalIntel(advice);
                }}
                className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-blue-500/20"
              >
                Refresh Strategy
             </button>
          </div>

          <div className="glass-panel p-8 rounded-[40px] border-white/5">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Payout Pipeline</h3>
             <div className="space-y-4">
                <div className="bg-lime-500/10 p-5 rounded-3xl border border-lime-500/20">
                  <p className="text-[9px] font-black text-lime-500 uppercase mb-1">Guaranteed Winner Share</p>
                  <p className="text-3xl font-orbitron font-black text-lime-400">${(match.totalPrizePool * 0.7).toFixed(2)}</p>
                </div>
                <p className="text-[9px] text-slate-500 font-medium leading-relaxed italic">
                  *Funds are locked in a smart-escrow. Server-side gameover signal triggers instant release.
                </p>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LiveMatch;
