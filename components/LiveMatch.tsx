
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
  const [tacticalIntel, setTacticalIntel] = useState('Standby for tactical assessment...');
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
        
        // Match Point (First to 13 in Premier)
        if (nextScore.ct >= 13 || nextScore.t >= 13) {
          setIsGameOver(true);
          setTimeout(() => handleMatchCompletion(nextScore), 3000);
        }
        
        return nextScore;
      });

      const newLog: RconLog = {
        timestamp: new Date().toLocaleTimeString(),
        command: 'GSI_EVENT',
        response: isCtWin ? 'Round end: Counter-Terrorists eliminated enemy' : 'Round end: Terrorists detonated objective',
        type: 'SYSTEM'
      };
      setLogs(prev => [...prev.slice(-15), newLog]);
      
      // Random bomb plant simulation
      if (Math.random() > 0.7) {
        setBombStatus('PLANTED');
        setTimeout(() => setBombStatus('IDLE'), 2000);
      }

    }, 4000);

    return () => clearInterval(interval);
  }, [match, isGameOver]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleMatchCompletion = (finalScore: {ct: number, t: number}) => {
    const winnerId = finalScore.ct > finalScore.t ? 'CT_WIN' : 'T_WIN';
    // In a real app, we check if current user was on the winning team
    resolveMatch(match!.id, currentUser.id); 
    navigate('/profile');
  };

  const sendRconCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    const newLog: RconLog = {
      timestamp: new Date().toLocaleTimeString(),
      command: cmd,
      response: `Server: Executing dynamic command...`,
      type: 'USER'
    };
    setLogs(prev => [...prev, newLog]);
    setRconInput('');
  };

  if (!match) return null;

  return (
    <div className="max-w-7xl mx-auto py-4 h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row items-stretch gap-6">
        
        {/* Scoreboard Panel */}
        <section className="flex-1 glass-panel p-8 rounded-[40px] border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-orange-500 to-blue-500"></div>
          
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-lime-500 rounded-full animate-pulse shadow-[0_0_10px_#84cc16]"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">GSI Link: Active</span>
             </div>
             <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] border border-orange-500/30 px-3 py-1 rounded-full">
               Live: {match.map.replace('de_', '').toUpperCase()}
             </div>
          </div>

          <div className="flex items-center justify-around">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-600/10 border-2 border-blue-500/20 rounded-[2rem] flex items-center justify-center mb-3 group-hover:border-blue-500/50 transition-all">
                <i className="fa-solid fa-shield text-blue-500 text-3xl"></i>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">DEFENDERS</p>
              <h2 className="text-6xl font-orbitron font-black text-white">{score.ct}</h2>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-4xl font-orbitron font-black text-slate-800 mb-2">VS</div>
              <div className={`px-4 py-1 rounded-full border ${bombStatus === 'PLANTED' ? 'bg-red-500 border-red-400 text-white animate-bounce' : 'bg-slate-800 border-white/10 text-slate-500'} text-[9px] font-black uppercase tracking-widest`}>
                {bombStatus === 'PLANTED' ? '⚠️ BOMB DETECTED' : 'SECURE'}
              </div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-orange-600/10 border-2 border-orange-500/20 rounded-[2rem] flex items-center justify-center mb-3 group-hover:border-orange-500/50 transition-all">
                <i className="fa-solid fa-fire text-orange-500 text-3xl"></i>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">ATTACKERS</p>
              <h2 className="text-6xl font-orbitron font-black text-white">{score.t}</h2>
            </div>
          </div>
        </section>

        {/* Tactical Intel Panel */}
        <section className="w-full md:w-80 glass-panel p-6 rounded-[32px] border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-brain text-orange-500"></i> AI STRATEGIST
            </h3>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 min-h-[120px]">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{tacticalIntel}"
              </p>
            </div>
          </div>
          <button 
            onClick={async () => {
              setTacticalIntel('Calculating optimal pathing...');
              const advice = await generateTacticalAdvice(match.map, score);
              setTacticalIntel(advice);
            }}
            className="mt-4 py-3 bg-orange-500 text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg"
          >
            Request New Intel
          </button>
        </section>
      </div>

      {/* Console & Payout Monitoring */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        <section className="flex-1 glass-panel rounded-[32px] border-white/5 flex flex-col overflow-hidden bg-black/40">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Server Stream</h3>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-500"></span>
              <span className="w-2 h-2 rounded-full bg-lime-500"></span>
              <span className="w-2 h-2 rounded-full bg-slate-700"></span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] space-y-3 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <span className="text-slate-600 font-bold shrink-0">[{log.timestamp}]</span>
                <div className="flex flex-col">
                  <span className={`${log.type === 'USER' ? 'text-orange-400' : 'text-blue-400'} font-bold uppercase`}>
                    {log.type === 'USER' ? 'RCON CMD > ' : 'SYSTEM > '} {log.command}
                  </span>
                  <span className="text-slate-400 opacity-80 group-hover:opacity-100 transition-opacity">{log.response}</span>
                </div>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>

          <div className="p-4 border-t border-white/5">
            <form onSubmit={(e) => { e.preventDefault(); sendRconCommand(rconInput); }} className="flex gap-3">
              <div className="relative flex-1">
                <i className="fa-solid fa-chevron-right absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 text-[10px]"></i>
                <input 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white font-mono text-xs outline-none focus:border-orange-500/50"
                  placeholder="EXECUTE RCON CMD..."
                  value={rconInput}
                  onChange={(e) => setRconInput(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-white text-slate-950 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all">Submit</button>
            </form>
          </div>
        </section>

        {/* Financial Status */}
        <section className="w-full md:w-80 glass-panel p-6 rounded-[32px] border-white/5 space-y-6">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Payout Pipeline</h3>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Locked Prize</p>
                <p className="text-2xl font-orbitron font-black text-white">${match.totalPrizePool.toFixed(2)}</p>
              </div>
              <div className="bg-lime-500/10 p-4 rounded-2xl border border-lime-500/20">
                <p className="text-[9px] font-black text-lime-500 uppercase mb-1">Winner's Share (70%)</p>
                <p className="text-2xl font-orbitron font-black text-lime-400">${(match.totalPrizePool * 0.7).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <i className="fa-solid fa-lock text-[10px]"></i>
              <span className="text-[9px] font-black uppercase tracking-widest">Escrow Active</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              Funds will be distributed automatically to the winning team's wallets via smart-contract resolution upon match completion signal.
            </p>
          </div>
        </section>
      </div>

      {/* Fullscreen Victory Overlay */}
      {isGameOver && (
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="text-center space-y-6 max-w-lg">
            <div className="w-24 h-24 bg-orange-500 rounded-full mx-auto flex items-center justify-center animate-bounce shadow-[0_0_50px_rgba(249,115,22,0.5)]">
              <i className="fa-solid fa-trophy text-slate-950 text-4xl"></i>
            </div>
            <h2 className="text-6xl font-orbitron font-black tracking-tighter text-white">MISSION COMPLETE</h2>
            <p className="text-orange-500 font-black tracking-[0.3em] uppercase">VERIFYING FINAL STATE & PAYOUT</p>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-orange-500 animate-[loading_3s_ease-in-out]"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMatch;
