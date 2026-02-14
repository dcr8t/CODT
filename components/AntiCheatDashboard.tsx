
import React, { useState } from 'react';
import { analyzeAntiCheatLog } from '../services/geminiService';

const AntiCheatDashboard: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const runSimulation = async () => {
    setAnalyzing(true);
    // Mocking high precision data for Gemini to analyze
    const mockData = {
      avgKillsPerMin: 4.2,
      headshotRatio: 0.85,
      recoilCompensation: "Suspiciously Perfect",
      mapAwareness: "100% Correct Reads",
      inputConsistency: "0.001ms variance"
    };
    
    const result = await analyzeAntiCheatLog(mockData);
    setReport(result);
    setAnalyzing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-orbitron font-black">
          RICHOCHET<span className="text-lime-400">-X</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Our proprietary AI-driven anti-cheat ecosystem monitors every bullet fired. 
          Integrity is our top priority.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="glass-panel p-8 rounded-3xl border-white/10">
          <h3 className="font-orbitron text-2xl mb-6">Core Strategies</h3>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-lime-500/10 rounded-xl flex items-center justify-center text-lime-400">
                <i className="fa-solid fa-microchip text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Behavioral Analysis</h4>
                <p className="text-sm text-slate-400">Real-time tracking of mouse/stick movements to detect non-human aim patterns and digital assistance.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                <i className="fa-solid fa-network-wired text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Network Scrutiny</h4>
                <p className="text-sm text-slate-400">Advanced detection for lag-switching and geolocation spoofing to ensure low-latency fair play.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                <i className="fa-solid fa-eye text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Human-In-The-Loop</h4>
                <p className="text-sm text-slate-400">Top-tier moderators manually review flagged kill-cams within 15 minutes of an incident report.</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="glass-panel p-8 rounded-3xl border-white/10 bg-gradient-to-br from-slate-900 to-slate-950">
          <h3 className="font-orbitron text-2xl mb-2">Trust Tester</h3>
          <p className="text-sm text-slate-500 mb-8 uppercase tracking-widest font-bold">AI Diagnostics Console</p>
          
          <div className="bg-black/50 rounded-2xl p-6 font-mono text-sm border border-white/5 space-y-4 mb-8">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500">System Scan:</span>
              <span className="text-lime-400">Secure</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500">Memory Integrity:</span>
              <span className="text-lime-400">Verified</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500">Injectable Hooks:</span>
              <span className="text-slate-400">None Detected</span>
            </div>
          </div>

          <button 
            onClick={runSimulation}
            disabled={analyzing}
            className="w-full bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-orbitron font-black text-lime-400 transition-all border border-lime-500/20"
          >
            {analyzing ? 'ANALYZING TELEMETRY...' : 'RUN DEEP DIAGNOSTIC'}
          </button>

          {report && (
            <div className="mt-8 p-6 bg-slate-950 rounded-2xl border border-red-500/30 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold uppercase tracking-widest text-xs">Analysis Verdict:</span>
                <span className={`px-2 py-1 rounded text-[10px] font-black ${report.verdict === 'Flagged' ? 'bg-red-500 text-white' : 'bg-orange-500 text-slate-950'}`}>
                  {report.verdict.toUpperCase()}
                </span>
              </div>
              <p className="text-2xl font-orbitron font-black text-white mb-2">RISK: {report.riskScore}/100</p>
              <p className="text-xs text-slate-400 italic">"{report.reason}"</p>
            </div>
          )}
        </section>
      </div>

      <section className="text-center bg-lime-500 p-12 rounded-[50px] space-y-6">
        <h2 className="text-4xl font-orbitron font-black text-slate-950">ZERO TOLERANCE. NO EXCEPTIONS.</h2>
        <p className="text-slate-900 font-bold max-w-2xl mx-auto opacity-80 uppercase tracking-widest text-sm">
          We have banned over 45,000 players to date. Our algorithms are constantly evolving to stay ahead of exploit developers.
        </p>
        <div className="flex justify-center gap-8 pt-4">
          <div className="text-slate-950">
            <p className="text-4xl font-orbitron font-black">100%</p>
            <p className="text-[10px] font-bold uppercase tracking-widest">Payout Security</p>
          </div>
          <div className="text-slate-950">
            <p className="text-4xl font-orbitron font-black">24/7</p>
            <p className="text-[10px] font-bold uppercase tracking-widest">Active Monitoring</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AntiCheatDashboard;
