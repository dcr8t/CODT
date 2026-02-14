
import React, { useState } from 'react';

const ServerSetup: React.FC = () => {
  const [ip, setIp] = useState('');
  const [rcon, setRcon] = useState('');
  const [setupMode, setSetupMode] = useState<'SERVER' | 'PLAYER'>('SERVER');
  const [isTesting, setIsTesting] = useState(false);

  const gsiConfig = `"Elite_Rivals_GSI" {
    "uri" "https://api.cs2command.io/gsi/v1"
    "timeout" "5.0"
    "buffer"  "0.1"
    "throttle" "0.1"
    "heartbeat" "30.0"
    "data" {
        "map" "1"
        "round" "1"
        "player_id" "1"
        "player_state" "1"
    }
}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-4 md:py-8">
      <div className="glass-panel p-6 md:p-10 rounded-[30px] md:rounded-[40px] border-orange-500/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-orbitron font-black text-orange-500 mb-1 uppercase">Control Center</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Global Server Orchestration</p>
          </div>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5 w-full md:w-auto">
            <button 
              onClick={() => setSetupMode('SERVER')}
              className={`flex-1 md:px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${setupMode === 'SERVER' ? 'bg-orange-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}
            >
              Cloud/Server Mode
            </button>
            <button 
              onClick={() => setSetupMode('PLAYER')}
              className={`flex-1 md:px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${setupMode === 'PLAYER' ? 'bg-orange-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}
            >
              Legacy Player Mode
            </button>
          </div>
        </div>

        {setupMode === 'SERVER' ? (
          <div className="space-y-8">
            <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl flex items-start gap-4">
              <i className="fa-solid fa-cloud text-blue-400 text-xl mt-1"></i>
              <div>
                <h4 className="text-sm font-black text-white uppercase mb-1">GeForce Now & Mobile Compatibility</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In <b>Cloud Mode</b>, GSI is installed directly on the dedicated server. Players on Android, iOS, or GeForce Now do not need to install any files. Data is sent directly from the server to our app.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">RCON Bridge</label>
                <input 
                  value={ip} 
                  onChange={e => setIp(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-orange-500 outline-none" 
                  placeholder="Server IP:Port"
                />
                <input 
                  type="password"
                  value={rcon}
                  onChange={e => setRcon(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-orange-500 outline-none" 
                  placeholder="Secret RCON Key"
                />
                <button 
                  onClick={() => { setIsTesting(true); setTimeout(() => setIsTesting(false), 2000); }}
                  className="w-full py-4 bg-white text-slate-950 rounded-xl font-black text-xs uppercase hover:bg-orange-500 transition-all shadow-xl"
                >
                  {isTesting ? 'Initializing Link...' : 'Authenticate Server'}
                </button>
              </div>
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4">Server GSI Log</h4>
                <div className="space-y-2 font-mono text-[9px]">
                  <p className="text-lime-500">[OK] Auth successful</p>
                  <p className="text-slate-600">[WAIT] Awaiting heartbeat...</p>
                  <p className="text-blue-400 animate-pulse">[INFO] Cloud link established</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="bg-black/60 p-6 rounded-2xl border border-white/5 font-mono text-[10px] text-slate-400 h-40 overflow-y-auto">
              <pre>{gsiConfig}</pre>
            </div>
            <button className="w-full py-4 bg-orange-500 text-slate-950 rounded-xl font-black text-xs uppercase">Download Client .cfg</button>
            <p className="text-[10px] text-center text-slate-500">Not compatible with GeForce Now or Mobile users.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerSetup;
