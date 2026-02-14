
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Match, MatchStatus, RconLog } from '../types';
import { analyzeRconLogs, generateTacticalAdvice } from '../services/geminiService';

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
  const [tacticalIntel, setTacticalIntel] = useState('Fetching tactical intel...');
  const match = matches.find(m => m.id === id);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!match) return;

    const interval = setInterval(() => {
      // Simulate live CS2 GSI data
      const isCtWin = Math.random() > 0.5;
      setScore(prev => ({
        ct: isCtWin ? prev.ct + 1 : prev.ct,
        t: !isCtWin ? prev.t + 1 : prev.t
      }));

      const newLog: RconLog = {
        timestamp: new Date().toLocaleTimeString(),
        command: 'GSI_UPDATE',
        response: isCtWin ? 'Round win for Counter-Terrorists' : 'Round win for Terrorists',
        type: 'SYSTEM'
      };
      setLogs(prev => [...prev.slice(-20), newLog]);

      if (score.ct + score.t >= 24) {
        clearInterval(interval);
        handleMatchCompletion();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [match, score]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleMatchCompletion = () => {
    const winnerId = score.ct > score.t ? 'ct_team' : 't_team';
    // Logic to map winnerId to real user
    resolveMatch(match!.id, currentUser.id); // Mocking current user win for demo
    navigate('/profile');
  };

  const sendRconCommand = (cmd: string) => {
    const newLog: RconLog = {
      timestamp: new Date().toLocaleTimeString(),
      command: cmd,
      response: `Executing: ${cmd}... OK`,
      type: 'USER'
    };
    setLogs(prev => [...prev, newLog]);
    setRconInput('');
  };

  if (!match) return null;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 py-6 h-[calc(100vh-120px)]">
      {/* Left Column: Server Status & Tactical Intel */}
      <div className="lg:col-span-1 space-y-4">
        <section className="glass-panel p-6 rounded-2xl border-orange-500/20">
          <h3 className="text-orange-500 font-orbitron font-bold text-xs uppercase tracking-widest mb-4">Server Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
              <span className="text-xs text-slate-500">Tickrate</span>
              <span className="text-lime-400 font-mono font-bold">128 (Sub-tick)</span>
            </div>
            <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
              <span className="text-xs text-slate-500">Latency</span>
              <span className="text-white font-mono">14ms</span>
            </div>
            <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
              <span className="text-xs text-slate-500">RCON</span>
              <span className="text-lime-500 font-bold text-[10px] uppercase">Connected</span>
            </div>
          </div>
        </section>

        <section className="glass-panel p-6 rounded-2xl border-white/10 bg-orange-500/5">
          <h3 className="text-orange-500 font-orbitron font-bold text-xs uppercase tracking-widest mb-4">Tactical AI</h3>
          <p className="text-xs text-slate-300 italic leading-relaxed">
            "{tacticalIntel}"
          </p>
          <button 
            onClick={async () => setTacticalIntel(await generateTacticalAdvice(match.map, score))}
            className="mt-4 w-full text-[10px] font-bold text-orange-500 border border-orange-500/30 py-2 rounded uppercase hover:bg-orange-500/10"
          >
            Refresh Strat
          </button>
        </section>
      </div>

      {/* Center Column: Live Match State */}
      <div className="lg:col-span-2 flex flex-col space-y-6">
        <section className="glass-panel p-8 rounded-3xl border-white/10 relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl -mr-16 -mt-16"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Valve Official Match Server</p>
          
          <div className="flex items-center gap-12 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-2 border border-blue-500/30">
                <i className="fa-solid fa-shield text-blue-400 text-2xl"></i>
              </div>
              <span className="text-3xl font-orbitron font-black">{score.ct}</span>
            </div>
            <div className="text-4xl font-orbitron font-black text-slate-700">:</div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600/20 rounded-2xl flex items-center justify-center mb-2 border border-orange-500/30">
                <i className="fa-solid fa-gun text-orange-400 text-2xl"></i>
              </div>
              <span className="text-3xl font-orbitron font-black">{score.t}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-6 py-2 bg-black/40 rounded-full border border-white/10">
            <div className={`w-2 h-2 rounded-full ${bombStatus === 'PLANTED' ? 'bg-red-500 animate-ping' : 'bg-slate-700'}`}></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bomb Status: {bombStatus}</span>
          </div>
        </section>

        {/* RCON Console */}
        <section className="glass-panel flex-1 rounded-3xl border-white/10 overflow-hidden flex flex-col bg-black/60">
          <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xs font-bold font-orbitron text-slate-500 uppercase tracking-widest">RCON Command Interface</h3>
            <span className="text-[10px] bg-lime-500/10 text-lime-400 px-2 py-1 rounded font-mono">ID: 41829-LIVE</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-2">
            {logs.map((log, i) => (
              <div key={i} className={`flex gap-3 border-l-2 pl-3 ${log.type === 'USER' ? 'border-orange-500' : 'border-blue-500'}`}>
                <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                <span className="text-orange-400 font-bold">{log.command}</span>
                <span className="text-slate-300 opacity-80">{log.response}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
          <div className="p-4 border-t border-white/5">
            <form onSubmit={(e) => { e.preventDefault(); sendRconCommand(rconInput); }} className="flex gap-2">
              <input 
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm outline-none focus:border-orange-500"
                placeholder="Type RCON command... (e.g. mp_pause_match)"
                value={rconInput}
                onChange={(e) => setRconInput(e.target.value)}
              />
              <button type="submit" className="bg-orange-500 text-slate-950 px-6 py-2 rounded-xl font-black text-xs uppercase hover:bg-orange-400 transition-all">Execute</button>
            </form>
          </div>
        </section>
      </div>

      {/* Right Column: Player Roster & Economy */}
      <div className="lg:col-span-1 space-y-6">
        <section className="glass-panel p-6 rounded-3xl border-white/10">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">CT Squad (5)</h3>
          <div className="space-y-3">
            {match.players.slice(0, 5).map((p, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm font-bold text-blue-400">{p.username}</span>
                <span className="text-xs text-slate-600">$4,250</span>
              </div>
            ))}
            {match.players.length === 0 && <p className="text-xs text-slate-600 italic">No CT players yet...</p>}
          </div>
        </section>
        <section className="glass-panel p-6 rounded-3xl border-white/10">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">T Squad (5)</h3>
          <div className="space-y-3">
            {match.players.slice(5, 10).map((p, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm font-bold text-orange-400">{p.username}</span>
                <span className="text-xs text-slate-600">$1,800</span>
              </div>
            ))}
            {match.players.length === 0 && <p className="text-xs text-slate-600 italic">No T players yet...</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LiveMatch;
