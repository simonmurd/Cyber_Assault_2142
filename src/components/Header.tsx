import React from 'react';
import { Play, Sparkles, BookOpen, Monitor, Sliders, Volume2, VolumeX, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  activeView: 'dual' | 'game' | 'manual';
  onViewChange: (view: 'dual' | 'game' | 'manual') => void;
  activeStage: number;
  onSelectStage: (stage: number) => void;
  onRunCode: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  activeStage,
  onSelectStage,
  onRunCode,
  soundMuted,
  onToggleSound,
}) => {
  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between z-30 shrink-0">
      {/* Brand & Title */}
      <div className="flex items-center space-x-3">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
        </span>
        <div className="flex items-center gap-2">
          <h1 className="text-sm md:text-base font-black text-slate-100 tracking-wider font-pixel flex items-center gap-2">
            CYBER ASSAULT <span className="text-cyan-400">2142</span>
          </h1>
          <span className="hidden sm:inline-block text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded font-mono font-bold tracking-widest">
            NEXUS EDITION
          </span>
        </div>
      </div>

      {/* Navigation View Toggles */}
      <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-mono">
        <button
          onClick={() => onViewChange('dual')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
            activeView === 'dual'
              ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Editor & Game (Dual)</span>
        </button>

        <button
          onClick={() => onViewChange('game')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
            activeView === 'game'
              ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Fokus Game</span>
        </button>

        <button
          onClick={() => onViewChange('manual')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
            activeView === 'manual'
              ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Manual & Galeri (Bagian 1-3)</span>
        </button>
      </div>

      {/* Stage Select & Actions */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Stage quick selection */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 text-xs font-mono">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => onSelectStage(s)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                activeStage === s
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={`Pindah ke Stage ${s}`}
            >
              Stage {s}
            </button>
          ))}
        </div>

        {/* Download Standalone Single-File HTML */}
        <a
          href="/cyber-assault-2142.html"
          download="cyber-assault-2142-studio.html"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-emerald-800/80 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-mono transition-all"
          title="Unduh 1 Berkas HTML Tunggal Standalone (Bisa dibuka offline di mana saja)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span className="hidden xl:inline">Unduh 1 File HTML</span>
        </a>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className="p-1.5 rounded border border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300"
          title={soundMuted ? 'Nyalakan Audio' : 'Bisukan Audio'}
        >
          {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Run / Apply Mod Button */}
        <button
          id="run-btn"
          onClick={onRunCode}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-3.5 md:px-4 py-1.5 rounded-md transition-all flex items-center space-x-1.5 shadow-lg shadow-cyan-500/25 text-xs md:text-sm font-mono cursor-pointer active:scale-95"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Jalankan & Mainkan!</span>
        </button>
      </div>
    </header>
  );
};
