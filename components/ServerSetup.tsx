
import React, { useState } from 'react';

const ServerSetup: React.FC = () => {
  const [ip, setIp] = useState('');
  const [rcon, setRcon] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <header className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-orbitron font-black tracking-tighter">CLOUD <span className="text-blue-500">ORCHESTRATOR</span></h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">High-Efficiency Server-Side Integration</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Connection Form */}
        <section className="glass-panel p-8 md:p-10 rounded-[40px] border-blue-500/20 space-y-8">
          <div>
            <h2 className="text-xl font-orbitron font-black text-white mb-2 uppercase italic">1. Bridge Parameters</h2>
            <p className="text-xs text-slate-500 font-medium">Connect your dedicated server directly to our automated arbiter.</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <i className="fa-solid fa-globe absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 text-xs"></i>
              <input 
                value={ip} 
                onChange={e => setIp(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 pl-10 text-white font-mono text-sm focus:border-blue-500 outline-none transition-all" 
                placeholder="Server IP:Port"
              />
            </div>
            <div className="relative">
              <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 text-xs"></i>
              <input 
                type="password"
                value={rcon}
                onChange={e => setRcon(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 pl-10 text-white font-mono text-sm focus:border-blue-500 outline-none transition-all" 
                placeholder="RCON Password"
              />
            </div>
            
            <button 
              onClick={() => { setIsTesting(true); setTimeout(() => setIsTesting(false), 2000); }}
              className="w-full py-5 bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-xl shadow-blue-500/10"
            >
              {isTesting ? 'CALIBRATING LINK...' : 'AUTHENTICATE CLOUD BRIDGE'}
            </button>
          </div>
        </section>

        {/* Benefits & Info */}
        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-[40px] border-white/5 bg-gradient-to-br from-blue-500/5 to-transparent">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <h3 className="font-bold text-white uppercase text-xs tracking-widest">Why Server-Side?</h3>
            </div>
            <ul className="space-y-4 text-xs text-slate-400 font-medium">
              <li className="flex gap-3"><i className="fa-solid fa-check text-lime-500 mt-0.5"></i> <b>Zero User Friction:</b> Players don't install anything.</li>
              <li className="flex gap-3"><i className="fa-solid fa-check text-lime-500 mt-0.5"></i> <b>Tamper-Proof:</b> Data comes from the server, not the client.</li>
              <li className="flex gap-3"><i className="fa-solid fa-check text-lime-500 mt-0.5"></i> <b>Universal Compatibility:</b> Works for GeForce Now & Android.</li>
            </ul>
          </div>

          <div className="bg-black/40 p-8 rounded-[40px] border border-white/5 space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Telemetry</h4>
            <div className="font-mono text-[10px] space-y-2">
              <p className="text-slate-600">Awaiting GSI packet...</p>
              <p className="text-blue-500 animate-pulse">Scanning RCON response...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerSetup;
