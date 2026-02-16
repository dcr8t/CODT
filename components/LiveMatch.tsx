import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Match, MatchStatus, TelemetryLog } from '../types';
import { generateTacticalAdvice, speakTacticalAdvice } from '../services/geminiService';

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
  const [statusText, setStatusText] = useState('SYNCING RICON-6 TELEMETRY...');
  const [tacticalIntel, setTacticalIntel] = useState('Analyzing battlefield dynamics...');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const match = matches.find(m => m.id === id);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!match || isGameOver) return;

    const interval = setInterval(() => {
      const isTeamAWin = Math.random() > 0.45; 
      setScore(prev => {
        const nextScore = {
          teamA: isTeamAWin ? prev.teamA + 1 : prev.teamA,
          teamB: !isTeamAWin ? prev.teamB + 1 : prev.teamB
        };
        
        const limit = match.gameType.includes('WARZONE') ? 30 : 6; 
        if (nextScore.teamA >= limit || nextScore.teamB >= limit) {
          setIsGameOver(true);
          setTimeout(() => handleMatchCompletion(nextScore), 4000);
        }
        
        return nextScore;
      });

      const newLog: TelemetryLog = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        event: match.gameType.includes('WARZONE') ? 'OPERATOR_ELIMINATED' : 'S&D_ROUND_VERIFIED',
        data: isTeamAWin ? `${currentUser.username} confirmed long-range elimination` : 'Opposition squad secured tactical site',
        type: 'GAME_EVENT'
      };
      setLogs(prev => [...prev.slice(-15), newLog]);
      setStatusText('SIGNAL STRENGTH: OPTIMAL');
      
    }, 3500);

    return () => clearInterval(interval);
  }, [match, isGameOver]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleMatchCompletion = (finalScore: {teamA: number, teamB: number}) => {
    resolveMatch(match!.id, currentUser.id); 
  };

  const refreshTacticalIntel = async () => {
    setIsSpeaking(true);
    setTacticalIntel('Recalibrating for optimal strategy...');
    const advice = await generateTacticalAdvice(match!.map, {ct: score.teamA, t: score.teamB});
    setTacticalIntel(advice);
    await speakTacticalAdvice(advice);
    setIsSpeaking(false);
  };

  if (!match) return <div className="text-center py-20 font-orbitron text-slate-500">LOBBY SIGNAL LOST</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Tactical HUD Header */}
      <section className="glass-panel p-8 md:p-12 rounded-[40px] border-orange-500/20 relative overflow-hidden bg-slate-900/40 shadow-2xl animate-pulse-border">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping shadow-[0_0_10px_#f97316]"></div>
            <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">{match.gameType.replace('_', ' ')} DATA LINK</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{statusText}</p>
            </div>
          </div>
          <div className="px-6 py-2 bg-black/60 rounded-full border border-white/10 flex gap-4 items-center">
            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{match.map}</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{match.gameMode}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 px-10">
          <div className="text-center flex-1">
            <div className="w-20 h-20 bg-blue-500/10 border-2 border-blue-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-ghost text-blue-500 text-3xl"></i>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">TEAM ALPHA</p>
            <h2 className="text-7xl font-orbitron font-black text-white">{score.teamA}</h2>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-2xl font-orbitron font-black text-slate-800 italic">SCORE</div>
            <div className="h-16 w-[2px] bg-slate-800 my-2"></div>
          </div>

          <div className="text-center flex-1">
            <div className="w-20 h-20 bg-orange-500/10 border-2 border-orange-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-skull-crossbones text-orange-500 text-3xl"></i>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">TEAM BRAVO</p>
            <h2 className="text-7xl font-orbitron font-black text-white">{score.teamB}</h2>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Telemetry Log */}
        <section className="lg:col-span-2 glass-panel rounded-[30px] border-white/5 flex flex-col bg-black/60 overflow-hidden min-h-[400px]">
          <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <i className="fa-solid fa-terminal text-orange-500"></i> Combat Feed
            </h3>
            <span className="text-[9px] font-black text-lime-500 uppercase tracking-widest">GSI Verified</span>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-4 font-mono text-[11px] max-h-[400px]">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 group animate-in slide-in-from-bottom-2">
                <span className="text-slate-600 font-bold">[{log.timestamp}]</span>
                <div>
                  <span className="text-orange-500 font-black uppercase tracking-widest text-[9px] mr-2">:: {log.event}</span>
                  <span className="text-slate-300">{log.data}</span>
                </div>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </section>

        {/* Tactical Info Sidebar */}
        <aside className="space-y-6">
          <div className="glass-panel p-8 rounded-[30px] border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent relative">
             {isSpeaking && <div className="absolute top-4 right-4 text-orange-500 animate-pulse"><i className="fa-solid fa-volume-high"></i></div>}
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-500 shadow-inner">
                 <i className="fa-solid fa-robot"></i>
               </div>
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Command Center Uplink</h3>
             </div>
             <p className="text-sm text-slate-300 italic mb-8 leading-relaxed font-semibold border-l-2 border-orange-500/30 pl-4">
               "{tacticalIntel}"
             </p>
             <button 
                onClick={refreshTacticalIntel}
                disabled={isSpeaking}
                className="w-full py-4 bg-orange-500 text-slate-950 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-orange-500/20 hover:bg-white transition-all disabled:opacity-50"
              >
                {isSpeaking ? 'TRANSMITTING VOICE...' : 'REQUEST TACTICAL OVERRIDE'}
             </button>
          </div>

          <div className="glass-panel p-8 rounded-[30px] border-white/5">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Escrow Verification</h3>
             <div className="bg-lime-500/10 p-6 rounded-2xl border border-lime-500/30 text-center mb-4">
                <p className="text-[10px] font-black text-lime-500 uppercase mb-1 tracking-widest">Locked Winner Payout</p>
                <p className="text-4xl font-orbitron font-black text-lime-400">${(match.totalPrizePool * 0.7).toFixed(0)}</p>
             </div>
             <p className="text-[9px] text-slate-500 font-bold leading-relaxed italic text-center uppercase">
               GSI Confirmed • Ricochet-X Monitor Active
             </p>
          </div>
        </aside>
      </div>

      {isGameOver && (
        <div className="fixed inset-0 z-[300] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-500">
          <div className="text-center space-y-8 animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-orange-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.6)]">
              <i className="fa-solid fa-medal text-slate-950 text-4xl"></i>
            </div>
            <h2 className="text-8xl font-orbitron font-black text-white tracking-tighter uppercase italic">VICTORY</h2>
            <div className="max-w-md mx-auto space-y-4">
              <p className="text-xs font-black text-orange-500 uppercase tracking-[0.5em]">GSI Verifying Eliminaton Telemetry...</p>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 animate-[loading_4s_ease-in-out]"></div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/profile')}
              className="px-12 py-5 bg-white text-slate-950 rounded-xl font-orbitron font-black text-xs uppercase hover:bg-orange-500 hover:text-white transition-all shadow-2xl"
            >
              Transfer $ to Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMatch;