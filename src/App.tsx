import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { GameCanvas } from './game/GameCanvas.tsx';
import { CodeEditor } from './components/CodeEditor.tsx';
import { CharacterGallery } from './components/CharacterGallery.tsx';
import { MechanicsGuide } from './components/MechanicsGuide.tsx';
import { BossTacticsGuide } from './components/BossTacticsGuide.tsx';
import { ScenarioLore } from './components/ScenarioLore.tsx';
import { StageExpansions } from './components/StageExpansions.tsx';
import { DEFAULT_CONFIG } from './game/defaultConfig.ts';
import { GameConfig } from './game/types.ts';
import { audioFX } from './game/audio.ts';
import { BookOpen, Sliders, Monitor, Radio, Shield, Crosshair, Sparkles } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'dual' | 'game' | 'manual'>('dual');
  const [manualSubTab, setManualSubTab] = useState<'part1' | 'part2' | 'part3' | 'lore' | 'expansion'>('expansion');
  const [activeStage, setActiveStage] = useState<number>(1);
  const [gameConfig, setGameConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [gameKey, setGameKey] = useState<number>(1); // Used to force restart when "Jalankan & Mainkan!" is clicked

  const handleRunCode = useCallback(() => {
    setGameKey((prev) => prev + 1);
    audioFX.laser();
  }, []);

  const handleSelectStage = useCallback((stage: number) => {
    setActiveStage(stage);
    setGameKey((prev) => prev + 1);
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundMuted((prev) => {
      const next = !prev;
      audioFX.setMuted(next);
      if (!next) audioFX.startBGM();
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#080b12] text-slate-100 font-sans">
      {/* Header Bar */}
      <Header
        activeView={viewMode}
        onViewChange={setViewMode}
        activeStage={activeStage}
        onSelectStage={handleSelectStage}
        onRunCode={handleRunCode}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 flex w-full overflow-hidden relative">
        {/* VIEW MODE 1: DUAL VIEW (User's preferred layout: Code Editor on Left, Game Preview on Right) */}
        {viewMode === 'dual' && (
          <div className="flex-1 flex flex-col md:flex-row w-full h-full overflow-hidden">
            {/* Left Column: Monaco-Style Code & Mod Parameter Editor */}
            <section className="w-full md:w-1/2 h-1/2 md:h-full border-r border-slate-800 flex flex-col">
              <CodeEditor
                config={gameConfig}
                onConfigChange={setGameConfig}
                onRun={handleRunCode}
              />
            </section>

            {/* Right Column: Live Playable Canvas Game Output */}
            <section className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-950 relative overflow-hidden">
              <div className="bg-slate-950/90 px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Pratinjau Live Canvas 2142 (Stage {activeStage})</span>
                </span>
                <span className="text-slate-500 hidden sm:inline">
                  A/D = Gerak · Space = Lompat · B = Slide · X = Tembak · R = Grapple
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                <GameCanvas
                  key={`${gameKey}-${activeStage}`}
                  config={gameConfig}
                  initialStage={activeStage}
                />
              </div>
            </section>
          </div>
        )}

        {/* VIEW MODE 2: FULL GAME FOCUS (Full Arena Screen) */}
        {viewMode === 'game' && (
          <div className="flex-1 flex flex-col bg-slate-950 h-full w-full overflow-hidden">
            <div className="bg-slate-950/90 px-6 py-2.5 text-xs font-mono text-slate-400 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-pixel text-cyan-400 text-xs">CYBER ARENA FULLSCREEN</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">Stage {activeStage}: {activeStage === 1 ? 'Menara Sinyal' : activeStage === 2 ? 'Jalur Melayang' : 'Pertahanan Stasiun Inti'}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-amber-400">Tembakan Fokus: Tahan X</span>
                <span className="text-sky-400">Grapple Hook: R</span>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-2 md:p-6 overflow-hidden">
              <GameCanvas
                key={`${gameKey}-${activeStage}`}
                config={gameConfig}
                initialStage={activeStage}
              />
            </div>
          </div>
        )}

        {/* VIEW MODE 3: MANUAL & GALERI REFERENSI (Bagian 1, Bagian 2, Bagian 3, Skenario) */}
        {viewMode === 'manual' && (
          <div className="flex-1 flex flex-col h-full w-full overflow-hidden bg-slate-950">
            {/* Sub-tab Navigation Bar for Reference Materials */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs font-mono">
                <button
                  onClick={() => setManualSubTab('part1')}
                  className={`px-3 py-1.5 rounded transition-all ${
                    manualSubTab === 'part1'
                      ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  Bagian 1: Galeri Karakter & Musuh
                </button>

                <button
                  onClick={() => setManualSubTab('part2')}
                  className={`px-3 py-1.5 rounded transition-all ${
                    manualSubTab === 'part2'
                      ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  Bagian 2: Lembar Mekanika Gerakan & Tempur
                </button>

                <button
                  onClick={() => setManualSubTab('part3')}
                  className={`px-3 py-1.5 rounded transition-all ${
                    manualSubTab === 'part3'
                      ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  Bagian 3: Pertempuran Bos Skala Besar
                </button>

                <button
                  onClick={() => setManualSubTab('lore')}
                  className={`px-3 py-1.5 rounded transition-all ${
                    manualSubTab === 'lore'
                      ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  Skenario Misi 2142 & Transmisi HQ
                </button>

                <button
                  onClick={() => setManualSubTab('expansion')}
                  className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                    manualSubTab === 'expansion'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'bg-slate-950 text-emerald-400 hover:text-emerald-200 border border-emerald-500/40'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3 Stage Baru, Mekanik & Parallax</span>
                </button>
              </div>

              {/* Jump to game button */}
              <button
                onClick={() => setViewMode('dual')}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1 rounded text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <span>Kembali ke Game Studio</span>
              </button>
            </div>

            {/* Sub-tab Content Panels */}
            <div className="flex-1 overflow-hidden">
              {manualSubTab === 'part1' && <CharacterGallery />}
              {manualSubTab === 'part2' && <MechanicsGuide />}
              {manualSubTab === 'part3' && <BossTacticsGuide />}
              {manualSubTab === 'expansion' && <StageExpansions />}
              {manualSubTab === 'lore' && (
                <ScenarioLore
                  onSelectStage={(stage) => {
                    setActiveStage(stage);
                    setViewMode('dual');
                    setGameKey((prev) => prev + 1);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
