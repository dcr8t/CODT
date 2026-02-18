import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ServerSetup: React.FC = () => {
  const [token, setToken] = useState(''); 
  const [downloadUrl, setDownloadUrl] = useState('');

  const generateConfig = () => {
    if (!token) {
        alert("Enter your Vercel GAME_SERVER_SECRET");
        return;
    }

    const cfgContent = `"Elite Rivals Automated GSI"
{
    "uri" "https://${window.location.hostname}/api/gsi"
    "timeout" "5.0"
    "buffer"  "0.1"
    "throttle" "0.5"
    "heartbeat" "30.0"
    "auth"
    {
        "token" "${token}"
    }
    "data"
    {
        "provider"            "1"
        "map"                 "1"
        "round"               "1"
        "player_id"           "1"
        "player_match_stats"  "1"
        "allplayers_id"       "1"
        "allplayers_match_stats" "1"
    }
}`;

    const blob = new Blob([cfgContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12 px-6 animate-in fade-in">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-orbitron font-black tracking-tighter text-white">CS2 <span className="text-orange-500">AUTOMATION</span></h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Game State Integration Setup</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="glass-panel p-10 rounded-[30px] border-orange-500/20 space-y-8">
          <div className="flex items-center gap-4 text-orange-500 mb-4">
             <i className="fa-brands fa-steam text-3xl"></i>
             <h3 className="font-orbitron font-black text-xl uppercase italic">Server Config</h3>
          </div>
          
          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-500 uppercase">1. Server Authorization Token</label>
             <input 
                type="password" 
                value={token} 
                onChange={e => setToken(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-white font-mono text-sm focus:border-orange-500 outline-none"
                placeholder="Paste GAME_SERVER_SECRET from Vercel"
             />
             <p className="text-[9px] text-slate-600">This secret key matches the one in your Vercel Environment Variables.</p>
          </div>

          <button 
             onClick={generateConfig}
             className="w-full py-4 bg-white text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-lg"
          >
             Generate GSI Config
          </button>

          {downloadUrl && (
            <div className="bg-lime-500/10 border border-lime-500/30 p-4 rounded-xl text-center">
                <a 
                  href={downloadUrl} 
                  download="gamestate_integration_eliterivals.cfg"
                  className="text-lime-500 font-black text-xs uppercase tracking-widest underline decoration-2 underline-offset-4"
                >
                    Download .CFG File
                </a>
            </div>
          )}
        </section>

        <section className="glass-panel p-10 rounded-[30px] border-white/5 bg-slate-900/50">
           <h3 className="font-orbitron font-black text-sm text-white uppercase tracking-widest mb-6">Installation Protocol</h3>
           <ol className="space-y-6 text-xs text-slate-400 font-medium">
              <li className="flex gap-4">
                 <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white shrink-0">1</span>
                 <p>Download the generated <code className="bg-black px-1 rounded text-orange-500">.cfg</code> file.</p>
              </li>
              <li className="flex gap-4">
                 <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white shrink-0">2</span>
                 <p>Navigate to your CS2 Server Directory:<br/><code className="bg-black block mt-2 p-2 rounded text-slate-300">/csgo/cfg/</code></p>
              </li>
              <li className="flex gap-4">
                 <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white shrink-0">3</span>
                 <p>Place the file in the folder. Restart the server.</p>
              </li>
              <li className="flex gap-4">
                 <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center font-bold text-slate-950 shrink-0">4</span>
                 <p className="text-white">Start a match. The system will now automatically track kills, rounds, and trigger payouts immediately upon "Game Over".</p>
              </li>
           </ol>
        </section>
      </div>
    </div>
  );
};

export default ServerSetup;