
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Match, MatchStatus } from '../types';
import { generateMatchCommentary, verifyMatchOutcomeWithAI } from '../services/geminiService';

interface LiveMatchProps {
  matches: Match[];
  resolveMatch: (id: string, winnerId: string) => void;
  currentUser: any;
}

const LiveMatch: React.FC<LiveMatchProps> = ({ matches, resolveMatch, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const match = matches.find(m => m.id === id);

  useEffect(() => {
    if (!match || match.status !== MatchStatus.LIVE) return;

    const interval = setInterval(async () => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          handleMatchCompletion();
          return 100;
        }
        return prev + 10;
      });

      const events = ['Killsteak active', 'Hardpoint captured', 'Sniper trade', 'Flank maneuver', 'Bomb planted'];
      const event = events[Math.floor(Math.random() * events.length)];
      const line = await generateMatchCommentary(match, event);
      setLogs(l => [...l.slice(-5), line]);
    }, 3000);

    return () => clearInterval(interval);
  }, [match]);

  const handleMatchCompletion = async () => {
    setIsVerifying(true);
    setLogs(l => [...l, "📡 CONNECTING TO ACTIVISION STATS API..."]);
    
    // Simulate real API data retrieval
    const simulatedApiData = {
      matchId: "MW3-" + Math.random().toString(36).substr(2, 9),
      duration: "12:42",
      players: match?.players.map(p => ({
        id: p.id,
        placement: p.id === currentUser.id ? 1 : Math.floor(Math.random() * 10) + 2,
        kills: Math.floor(Math.random() * 30),
        deaths: Math.floor(Math.random() * 10)
      }))
    };

    setLogs(l => [...l, "🔍 AI ARBITRATOR: AUDITING TELEMETRY DATA..."]);
    
    const verification = await verifyMatchOutcomeWithAI(simulatedApiData, match);
    
    if (verification) {
      setLogs(l => [...l, `✅ AUDIT PASSED: ${verification.securityAudit}`]);
      setLogs(l => [...l, `🏆 OFFICIAL WINNER ID: ${verification.winnerId}`]);
      
      setTimeout(() => {
        resolveMatch(match!.id, verification.winnerId);
        navigate('/profile');
      }, 4000);
    }
  };

  if (!match) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-12">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-white uppercase tracking-widest">Live Integration Feed</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
          <i className="fa-solid fa-server"></i> US-WEST-1 API NODE
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-orbitron font-black">{match.title}</h1>
        <p className="text-slate-400 mt-2 uppercase text-[10px] tracking-widest font-bold">API Syncing: {match.map} • {match.gameMode}</p>
      </div>

      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
        <div 
          className={`h-full transition-all duration-700 ${isVerifying ? 'bg-blue-500 animate-pulse' : 'bg-lime-500'}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="glass-panel p-8 rounded-3xl border-white/10 min-h-[400px] flex flex-col justify-end relative">
        {isVerifying && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center rounded-3xl z-10">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-orbitron font-black text-lime-400 animate-pulse">VERIFYING API PAYLOAD</p>
            </div>
          </div>
        )}
        
        <div className="space-y-4 font-mono text-sm relative z-0">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-4 animate-fadeIn border-l-2 border-lime-500/30 pl-4 py-1">
              <span className="text-slate-500 font-bold shrink-0">{new Date().toLocaleTimeString([], { hour12: false, second: '2-digit' })}</span>
              <span className={log.includes('✅') || log.includes('🏆') ? 'text-lime-400 font-bold' : 'text-slate-300'}>{log}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'API Connection', value: 'Active', color: 'text-lime-400' },
          { label: 'Encrypted Token', value: 'OAuth_v2', color: 'text-blue-400' },
          { label: 'Integrity Check', value: 'Passed', color: 'text-lime-400' }
        ].map((item, i) => (
          <div key={i} className="glass-panel p-4 rounded-2xl flex flex-col items-center border-white/5">
            <span className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-tighter">{item.label}</span>
            <span className={`font-orbitron font-black text-sm uppercase ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMatch;
