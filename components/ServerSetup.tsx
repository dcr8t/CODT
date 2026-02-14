
import React, { useState } from 'react';

const ServerSetup: React.FC = () => {
  const [ip, setIp] = useState('');
  const [rcon, setRcon] = useState('');
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

  const downloadGsi = () => {
    const element = document.createElement("a");
    const file = new Blob([gsiConfig], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "gamestate_integration_rivals.cfg";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="glass-panel p-10 rounded-[40px] border-orange-500/20">
        <h2 className="text-3xl font-orbitron font-black text-orange-500 mb-2">SERVER COMMAND CENTER</h2>
        <p className="text-slate-400 text-sm mb-8">Establish a secure RCON bridge and configure Game State Integration.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-terminal text-orange-500"></i> RCON Authentication
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Server IP:Port</label>
                <input 
                  value={ip} 
                  onChange={e => setIp(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none font-mono" 
                  placeholder="127.0.0.1:27015"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">RCON Password</label>
                <input 
                  type="password"
                  value={rcon}
                  onChange={e => setRcon(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none font-mono" 
                  placeholder="••••••••"
                />
              </div>
              <button 
                onClick={() => { setIsTesting(true); setTimeout(() => setIsTesting(false), 2000); }}
                className="w-full py-3 bg-white text-slate-950 rounded-xl font-black text-xs uppercase hover:bg-orange-500 transition-all"
              >
                {isTesting ? 'Pinging Server...' : 'Test RCON Connection'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-file-code text-orange-500"></i> GSI Config Payload
            </h3>
            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 font-mono text-[10px] text-slate-400 h-40 overflow-y-auto">
              <pre>{gsiConfig}</pre>
            </div>
            <button 
              onClick={downloadGsi}
              className="w-full py-3 bg-orange-500/10 border border-orange-500/30 text-orange-500 rounded-xl font-black text-xs uppercase hover:bg-orange-500 hover:text-slate-950 transition-all"
            >
              Download .cfg File
            </button>
            <p className="text-[10px] text-slate-500 italic">Place this file in: <br/> \Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerSetup;
