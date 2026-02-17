import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Match, TelemetryLog } from '../types';
import { verifyMatchResult, speakTacticalAdvice, generateTacticalAdvice } from '../services/geminiService';

interface LiveMatchProps {
  matches: Match[];
  resolveMatch: (id: string, winnerId: string, report: string) => void;
  currentUser: any;
}

const LiveMatch: React.FC<LiveMatchProps> = ({ matches, resolveMatch, currentUser }) => {
  const { id } = useParams();
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [score, setScore] = useState({ teamA: 0, teamB: 0 });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tacticalIntel, setTacticalIntel] = useState('Waiting for GSI uplink...');
  
  // Use DB match if available, else fallback to passed props for initial render
  const match = matches.find(m => m.id === id);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    // 1. Subscribe to Live Score Updates from DB (Pushed by Game Server)
    const channel = supabase.channel(`match:${id}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'matches', 
        filter: `id=eq.${id}` 
      }, (payload) => {
        const newData = payload.new;
        if (newData.score) setScore(newData.score);
        if (newData.live_log && Array.isArray(newData.live_log)) {
          // If the server pushes logs to a column, we display them
          // For now, let's assume we just want to see score updates
        }
        if (newData.status === 'COMPLETED') {
          // Handle end game
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  // We no longer simulate scores. The UI will remain at 0-0 until the DB updates.
  // This forces the user to actually connect the Game Server (ServerSetup).

  const getTacticalOveride = async () => {
    if (!match) return;
    setIsSpeaking(true);
    setTacticalIntel('Recalibrating for squad advantage...');
    const advice = await generateTacticalAdvice(match.map, {ct: score.teamA, t: score.teamB});
    setTacticalIntel(advice);
    await speakTacticalAdvice(advice);
    setIsSpeaking(false);
  };

  if (!match) return <div className="text-center py-40 font-orbitron text-slate-700 uppercase tracking-widest">Lobby Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      {/* HUD Header */}
      <section className="glass-panel p-10 rounded-[40px] border-orange-500/20 relative overflow-hidden shadow-2xl animate-pulse-border">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="text-center md:text-left">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] mb-2 block">Realtime GSI Stream</span>
              <h2 className="text-3xl font-orbitron font-black text-white italic uppercase">{match.title}</h2>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{match.map} • SERVER LINKED</p>
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">:: Server Packet Monitor</p>
              <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></span>
           </div>
           <div className="p-8 flex flex-col items-center justify-center h-full space-y-4 font-mono text-[11px] opacity-50">
              {score.teamA === 0 && score.teamB === 0 ? (
                <>
                  <i className="fa-solid fa-server text-4xl mb-4 text-slate-700"></i>
                  <p>AWAITING SERVER DATA...</p>
                  <p className="text-[9px] max-w-xs text-center">Ensure your Dedicated Server plugin is configured to point to: <span className="text-blue-500">wss://api.eliterivals.pro/gsi</span></p>
                </>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex gap-4 w-full">
                     <span className="text-slate-600">[{log.timestamp}]</span>
                     <span className="text-orange-500 font-black tracking-widest uppercase">{log.event}</span>
                     <span className="text-slate-400">{log.data}</span>
                  </div>
                ))
              )}
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
        </aside>
      </div>
    </div>
  );
};

export default LiveMatch;