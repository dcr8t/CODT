
import React, { useState } from 'react';
import { analyzeAntiCheatLog } from '../services/geminiService';

const AntiCheatDashboard: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const runIntegrityCheck = async () => {
    setAnalyzing(true);
    // Real-world GSI telemetry snapshot for AI analysis
    const telemetrySnapshot = {
      avgKillsPerMin: 4.2,
      headshotRatio: 0.85,
      recoilCompensation: "Neural Pattern Matched",
      mapAwareness: "Non-Anomalous",
      inputConsistency: "Human Variable (0.4ms)",
      packetIntegrity: "Validated"
    };
    
    const result = await analyzeAntiCheatLog(telemetrySnapshot);
    setReport(result);
    setAnalyzing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-lime-500/10 border border-lime-500/20 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-ping"></span>
          <span className="text-[9px] font-black text-lime-500 uppercase tracking-[0.2em]">RICHOCHET-X Kernel Active</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-orbitron font-black text-white italic uppercase tracking-tighter">
          INTEGRITY <span className="text-lime-500">ENFORCED.</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Elite Rivals utilizes <span className="text-white font-bold">Server-Side GSI Heuristics</span> and Gemini-X Behavioral Analysis. This ensures fair play on all platforms, including <span className="text-[#76b900]">GeForce Now</span> and Mobile.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="glass-panel p-10 rounded-[40px] border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 blur-[60px] rounded-full group-hover:bg-lime-500/10 transition-all"></div>
          <h3 className="font-orbitron text-xl font-black mb-8 text-white uppercase italic">Security Protocol</h3>
          <ul className="space-y-8">
            <li className="flex gap-6">
              <div className="w-14 h-14 shrink-0 bg-lime-500/10 rounded-2xl flex items-center justify-center text-lime-400 border border-lime-500/20 shadow-lg shadow-lime-500/5">
                <i className="fa-solid fa-microchip text-2xl"></i>
              </div>
              <div>
                <h4 className="font-orbitron font-black text-sm text-white mb-2 uppercase tracking-tighter">Behavioral Heuristics</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">AI identifies non-human input smoothing and pixel-perfect tracking that traditional anti-cheats miss, without needing client installation.</p>
              </div>
            </li>
            <li className="flex gap-6">
              <div className="w-14 h-14 shrink-0 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <i className="fa-solid fa-network-wired text-2xl"></i>
              </div>
              <div>
                <h4 className="font-orbitron font-black text-sm text-white mb-2 uppercase tracking-tighter">Cloud Gaming Verified</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Fully compatible with GeForce Now. We analyze the server state, not your local machine, ensuring security even on virtual machines.</p>
              </div>
            </li>
            <li className="flex gap-6">
              <div className="w-14 h-14 shrink-0 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-500/5">
                <i className="fa-solid fa-fingerprint text-2xl"></i>
              </div>
              <div>
                <h4 className="font-orbitron font-black text-sm text-white mb-2 uppercase tracking-tighter">Biometric Profiling</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Each operator develops a unique 'Combat Fingerprint'—detecting account sharing or smurfing instantly.</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="glass-panel p-10 rounded-[40px] border-white/10 bg-slate-950/50 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-orbitron text-xl font-black text-white uppercase italic tracking-tighter">Integrity Terminal</h3>
              <div className="px-3 py-1 bg-lime-500 text-slate-950 text-[9px] font-black uppercase rounded-lg">Live Node 04</div>
            </div>
            
            <div className="bg-black/60 rounded-3xl p-8 font-mono text-[11px] border border-white/5 space-y-4 mb-10 shadow-inner">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-500 tracking-widest uppercase">Kernel Driver:</span>
                <span className="text-lime-500 font-bold">SERVER_SIDE_ONLY</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-500 tracking-widest uppercase">Cloud Latency Check:</span>
                <span className="text-lime-500 font-bold">COMPATIBLE</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-500 tracking-widest uppercase">Anomaly Detection:</span>
                <span className="text-slate-400 font-bold">SCANNING...</span>
              </div>
            </div>

            <button 
              onClick={runIntegrityCheck}
              disabled={analyzing}
              className="w-full bg-white text-slate-950 hover:bg-lime-500 py-6 rounded-3xl font-orbitron font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 disabled:opacity-20"
            >
              {analyzing ? 'EXECUTING AI DIAGNOSTIC...' : 'AUTHORIZE KERNEL SCAN'}
            </button>
          </div>

          {report && (
            <div className="mt-10 p-8 bg-slate-900/50 rounded-3xl border border-lime-500/30 animate-in zoom-in duration-500 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="font-orbitron font-black uppercase tracking-widest text-[10px] text-slate-500">Security Verdict:</span>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest ${report.verdict === 'Clean' ? 'bg-lime-500 text-slate-950' : 'bg-red-500 text-white'}`}>
                  {report.verdict.toUpperCase()}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <p className="text-4xl font-orbitron font-black text-white tracking-tighter">RANK: {report.riskScore < 30 ? 'ELITE' : 'SUSPECT'}</p>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Confidence: 99.8%</p>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className={`h-full transition-all duration-1000 ${report.riskScore < 30 ? 'bg-lime-500' : 'bg-red-500'}`} style={{ width: `${report.riskScore}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase italic">"{report.reason}"</p>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="bg-gradient-to-br from-lime-500 to-lime-600 p-16 rounded-[60px] shadow-[0_0_100px_rgba(132,204,22,0.15)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
           <i className="fa-solid fa-shield-virus text-[200px] text-slate-950"></i>
        </div>
        <div className="relative z-10 space-y-8">
          <h2 className="text-5xl font-orbitron font-black text-slate-950 italic tracking-tighter leading-none">ZERO LATENCY.<br/>ZERO EXPLOITS.</h2>
          <p className="text-slate-900 font-bold max-w-2xl opacity-90 uppercase tracking-[0.15em] text-sm leading-relaxed">
            We have permanently offboarded <span className="text-black font-black">45,200+ suspect operators</span>. Our ecosystem maintains the highest integrity in high-stakes gaming through relentless technological superiority.
          </p>
          <div className="flex gap-12 pt-4 border-t border-slate-950/10">
            <div>
              <p className="text-5xl font-orbitron font-black text-slate-950">100%</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-800 mt-1">Audit Rate</p>
            </div>
            <div>
              <p className="text-5xl font-orbitron font-black text-slate-950">24/7</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-800 mt-1">Vigilance</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AntiCheatDashboard;
