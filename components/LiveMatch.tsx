import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Match, MatchStatus, TelemetryLog } from '../types';
import { verifyMatchResult, speakTacticalAdvice, generateTacticalAdvice } from '../services/geminiService';

interface LiveMatchProps {
  matches: Match[];
  resolveMatch: (id: string, winnerId: string, report: string) => void;
  currentUser: any;
}

const LiveMatch: React.FC<LiveMatchProps> = ({ matches, resolveMatch, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [score, setScore] = useState({ teamA: 0, teamB: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tacticalIntel, setTacticalIntel] = useState('Analyzing live GSI telemetry...');
  const match = matches.find(m => m.id === id);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!match || isGameOver) return;

    const interval = setInterval(() => {
      const isTeamAWin = Math.random() > 0.48; 
      setScore(prev => {
        const nextScore = {
          teamA: isTeamAWin ? prev.teamA + 1 : prev.teamA,
          teamB: !isTeamAWin ? prev.teamB + 1 : prev.teamB
        };
        const limit = match.gameType.includes('WARZONE') ? 25 : 6; 
        if (nextScore.teamA >= limit || nextScore.teamB >= limit) {
          setIsGameOver(true);
          handleMatchEnding();
        }
        return nextScore;
      });

      const newLog: TelemetryLog = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        event: 'TELEMETRY_GSI_PACKET',
        data: isTeamAWin ? `Operator ${currentUser.username.toUpperCase()} confirmed precision strike` : 'Squad BRAVO secured tactical site control',
        type: 'GAME_EVENT'
      };
      setLogs(prev => [...prev.slice(-15), newLog]);
    }, 3000);

    return () => clearInterval(interval);
  }, [match, isGameOver]);

  const handleMatchEnding = async () => {
    setIsVerifying(true);
    // Simulate Gemini AI Arbiter verification
    const result = await verifyMatchResult(match, logs);
    setTimeout(() => {
      resolveMatch(match!.id, result.winnerId, result.report);
      setIsVerifying(false);
    }, 5000);
  };

  const getTacticalOveride = async () => {
    setIsSpeaking(true);
    setTacticalIntel('Recalibrating for squad advantage...');
    const advice = await generateTacticalAdvice(match!.map, {ct: score.teamA, t: score.teamB});
    setTacticalIntel(advice);
    await speakTacticalAdvice(advice);
    setIsSpeaking(false);
  };

  if (!match) return <div className="text-center py-40 font-orbitron text-slate-700 uppercase tracking-widest">Lobby Link Terminated</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      {/* HUD Header */}
      <section className="glass-panel p-10 rounded-[40px] border-orange-500/20 relative overflow-hidden shadow-2xl animate-pulse-border">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="text-center md:text-left">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] mb-2 block">GSI Stream Active</span>
              <h2 className="text-3xl font-orbitron font-black text-white italic uppercase">{match.title}</h2>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{match.map} • CLOUD-SYNC v4.1</p>
           </div>
           
           <div className="flex items-center gap-16 px-12 py-6 bg-black/40 rounded-[30px] border border-white/5">
              <div className="text-center">
                <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">ALPHA</p>
                <p className="text-6xl font-orbitron font-black text-white">{score.teamA}</p>
              </div>
              <div className="h-12 w-[1px] bg-white/10"></div>
              <div className="text-center">
                <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mb-1">BRAVO</p>
                <p className="text-6xl font-orbitron font-black text-white">{score.teamB}</p>
              </div>
           </div>

           <div className="hidden lg:block text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Escrow Pot</p>
              <p className="text-3xl font-orbitron font-black text-orange-500">${(match.totalPrizePool * 0.7).toFixed(0)}</p>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal Log */}
        <div className="lg:col-span-2 glass-panel rounded-[30px] overflow-hidden flex flex-col min-h-[500px]">
           <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">:: Cloud Telemetry Feed</p>
              <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></span>
           </div>
           <div className="p-8 space-y-4 font-mono text-[11px] overflow-y-auto max-h-[450px]">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4 animate-in slide-in-from-left-2">
                   <span className="text-slate-600">[{log.timestamp}]</span>
                   <span className="text-orange-500 font-black tracking-widest uppercase">{log.event}</span>
                   <span className="text-slate-400">{log.data}</span>
                </div>
              ))}
              <div ref={logEndRef} />
           </div>
        </div>

        {/* AI Tactical Sidebar */}
        <aside className="space-y-6">
           <section className="glass-panel p-8 rounded-[30px] border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-slate-950 shadow-lg">
                    <i className="fa-solid fa-satellite"></i>
                 </div>
                 <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Tactical Link</h3>
              </div>
              <p className="text-sm text-slate-300 italic font-medium leading-relaxed mb-8 border-l-2 border-orange-500/30 pl-4">
                "{tacticalIntel}"
              </p>
              <button 
                onClick={getTacticalOveride}
                disabled={isSpeaking}
                className="w-full py-4 bg-orange-500 text-slate-950 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-orange-500/20 hover:bg-white transition-all disabled:opacity-50"
              >
                {isSpeaking ? 'SYNCING VOICE...' : 'REQUEST STRAT OVERRIDE'}
              </button>
           </section>

           <section className="glass-panel p-8 rounded-[30px] border-white/5 text-center">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Integrity Status</h4>
              <div className="flex justify-center gap-3 mb-6">
                 {['GSI', 'RICHOCHET', 'SSL'].map(sys => (
                   <span key={sys} className="px-2 py-1 bg-lime-500/10 border border-lime-500/30 text-[8px] font-black text-lime-500 uppercase rounded">{sys}</span>
                 ))}
              </div>
              <p className="text-[9px] text-slate-600 font-bold uppercase italic leading-relaxed">
                Server-side logs monitored by Gemini-X Cloud Arbiter. Manual reviews triggered on anomaly detection.
              </p>
           </section>
        </aside>
      </div>

      {/* Verification Overlay */}
      {isVerifying && (
        <div className="fixed inset-0 z-[600] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-8">
           <div className="text-center space-y-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-orange-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_80px_rgba(249,115,22,0.4)]">
                 <i className="fa-solid fa-robot text-slate-950 text-4xl animate-bounce"></i>
              </div>
              <h2 className="text-6xl font-orbitron font-black text-white italic uppercase tracking-tighter">ARBITER VERIFYING...</h2>
              <div className="max-w-md mx-auto space-y-4">
                 <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] animate-pulse">Running Gemini Anti-Cheat Diagnostic</p>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 animate-[loading_5s_ease-in-out]"></div>
                 </div>
              </div>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest italic opacity-60">Scrutinizing GSI Packets for Aim-Assist Anomolies & Packet Spoofing</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default LiveMatch;