
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
  const [tacticalIntel, setTacticalIntel] = useState('Analyzing cloud stream data...');
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
        command: 'SERVER_PULSE',
        response: isCtWin ? 'Round verified: Defenders win' : 'Round verified: Attackers win',
        type: 'SYSTEM'
      };
      setLogs(prev => [...prev.slice(-10), newLog]);
      
      if (Math.random() > 0.7) {
        setBombStatus('PLANTED');
        setTimeout(() => setBombStatus('IDLE'), 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [match, isGameOver]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleMatchCompletion = (finalScore: {ct: number, t: number}) => {
    resolveMatch(match!.id, currentUser.id); 
    navigate('/profile');
  };

  if (!match) return null;

  return (
    <div className="flex flex-col gap-4 md:gap-6 min-h-[calc(100vh-100px)] p-2 md:p-4">
      
      {/* Dynamic Scoreboard - Optimized for Touch & Mobile Stacking */}
      <section className="glass-panel p-6 md:p-8 rounded-[30px] md:rounded-[40px] border-white/10 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Server-Side Cloud Link</span>
          </div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
            {match.map.replace('de_', '').toUpperCase()}
          </span>
        </div>

        <div className="flex flex-row items-center justify-between gap-4 md:gap-12">
          {/* CT Score */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-2">
              <i className="fa-solid fa-shield text-blue-500 text-xl md:text-2xl"></i>
            </div>
            <h2 className="text-4xl md:text-6xl font-orbitron font-black text-white">{score.ct}</h2>
            <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Defenders</p>
          </div>

          {/* Central Status */}
          <div className="flex flex-col items-center shrink-0">
             <div className={`px-4 py-2 rounded-full border ${bombStatus === 'PLANTED' ? 'bg-red-500 border-red-400 text-white animate-pulse' : 'bg-slate-900 border-white/10 text-slate-500'} text-[9px] font-black uppercase tracking-tighter mb-2`}>
                {bombStatus === 'PLANTED' ? 'DETECTION ⚠️' : 'SECURE'}
             </div>
             <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
          </div>

          {/* T Score */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mb-2">
              <i className="fa-solid fa-gun text-orange-500 text-xl md:text-2xl"></i>
            </div>
            <h2 className="text-4xl md:text-6xl font-orbitron font-black text-white">{score.t}</h2>
            <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Attackers</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0">
        
        {/* Mobile Console / Log Stream */}
        <section className="lg:col-span-2 glass-panel rounded-[30px] border-white/5 flex flex-col bg-black/40 overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Stream Logic</h3>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-lime-500"></span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px] custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className="border-l-2 border-orange-500/20 pl-3 py-1">
                <p className="text-slate-600 font-bold">[{log.timestamp}]</p>
                <p className="text-white/80">{log.response}</p>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
          <div className="p-3 border-t border-white/5 grid grid-cols-3 gap-2">
            {/* Quick Touch Buttons for Mobile RCON */}
            <button onClick={() => setRconInput('.pause')} className="bg-white/5 hover:bg-white/10 py-3 rounded-xl text-[9px] font-black uppercase text-slate-400">Pause</button>
            <button onClick={() => setRconInput('.ready')} className="bg-white/5 hover:bg-white/10 py-3 rounded-xl text-[9px] font-black uppercase text-slate-400">Ready</button>
            <button onClick={() => setRconInput('.coach')} className="bg-white/5 hover:bg-white/10 py-3 rounded-xl text-[9px] font-black uppercase text-slate-400">Coach</button>
          </div>
        </section>

        {/* Tactical & Financial */}
        <section className="space-y-4 md:space-y-6">
          <div className="glass-panel p-6 rounded-[30px] border-white/5 bg-gradient-to-br from-orange-500/5 to-transparent">
             <h3 className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-4">AI Advisor</h3>
             <p className="text-xs text-slate-300 italic mb-4 leading-relaxed">"{tacticalIntel}"</p>
             <button 
                onClick={async () => {
                  setTacticalIntel('Recalculating vectors...');
                  const advice = await generateTacticalAdvice(match.map, score);
                  setTacticalIntel(advice);
                }}
                className="w-full py-3 bg-orange-500 text-slate-950 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-orange-500/10"
              >
                Refresh Intel
             </button>
          </div>

          <div className="glass-panel p-6 rounded-[30px] border-white/5">
             <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Payout Pipeline</h3>
             <div className="bg-lime-500/10 p-4 rounded-2xl border border-lime-500/20 text-center">
                <p className="text-[8px] font-black text-lime-500 uppercase mb-1">Winning Share</p>
                <p className="text-2xl font-orbitron font-black text-lime-400">${(match.totalPrizePool * 0.7).toFixed(2)}</p>
             </div>
          </div>
        </section>
      </div>

      {isGameOver && (
        <div className="fixed inset-0 z-[300] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6 text-center">
          <div className="space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.4)]">
              <i className="fa-solid fa-trophy text-slate-950 text-3xl"></i>
            </div>
            <h2 className="text-4xl font-orbitron font-black text-white">VICTORY</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em]">Distributing Payout...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMatch;
