import React, { useState, useEffect, useRef } from 'react';
import { Shield, Crosshair, Zap, Cpu, AlertTriangle, Eye, EyeOff, Play, Pause, Layers, Sparkles, Sliders } from 'lucide-react';

export const CharacterGallery: React.FC = () => {
  const [hudActive, setHudActive] = useState(true);
  const [activePlayerAction, setActivePlayerAction] = useState<
    'idle' | 'run' | 'jump' | 'ground_shoot' | 'slide_dash' | 'grapple_swing' | 'focused_fire'
  >('idle');
  const [isPlayingAnim, setIsPlayingAnim] = useState(true);
  const [animFrame, setAnimFrame] = useState(0);
  const [animSpeed, setAnimSpeed] = useState<number>(120);
  const [selectedUnit, setSelectedUnit] = useState<'nexus' | 'spritesheet' | 'trooper' | 'drone' | 'boss'>('nexus');

  // Animation frame ticker
  useEffect(() => {
    if (!isPlayingAnim) return;

    const maxFramesMap: Record<string, number> = {
      idle: 4,
      run: 8,
      jump: 3,
      ground_shoot: 2,
      slide_dash: 4,
      grapple_swing: 4,
      focused_fire: 3,
    };

    const max = maxFramesMap[activePlayerAction] || 4;
    const interval = setInterval(() => {
      setAnimFrame((prev) => (prev + 1) % max);
    }, animSpeed);

    return () => clearInterval(interval);
  }, [activePlayerAction, isPlayingAnim, animSpeed]);

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4 md:p-6 text-slate-200 font-sans space-y-6">
      {/* Title Banner */}
      <div className="border border-cyan-500/40 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-1">
            BAGIAN 1 · MANUAL TEKNIS UNIT & KARAKTER UTAMA 2142
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-100 font-pixel">
            CYBORG AGENT 01 "NEXUS" & ENEMY ROSTER
          </h2>
        </div>

        {/* Quick Nav Filter */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            onClick={() => setSelectedUnit('nexus')}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedUnit === 'nexus'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Nexus (Player)
          </button>
          <button
            onClick={() => setSelectedUnit('spritesheet')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              selectedUnit === 'spritesheet'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/30'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sprite Sheet Viewer</span>
          </button>
          <button
            onClick={() => setSelectedUnit('trooper')}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedUnit === 'trooper'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Robo-Trooper
          </button>
          <button
            onClick={() => setSelectedUnit('drone')}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedUnit === 'drone'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Drones (Air)
          </button>
          <button
            onClick={() => setSelectedUnit('boss')}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedUnit === 'boss'
                ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Sentinel Vanguard Mech
          </button>
        </div>
      </div>

      {/* SPRITE SHEET DEDICATED SECTION (Matching User's Uploaded Sprite Sheet) */}
      {(selectedUnit === 'spritesheet' || selectedUnit === 'nexus') && (
        <div className="border border-amber-500/40 bg-slate-900/80 rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-amber-300 font-mono tracking-wide">
                  CYBORG AGENT 01 SPRITE SHEET (LEMBAR ANIMASI LENGKAP)
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Visual pixel-art 8 kategori aksi: IDLE, RUN, JUMP/FALL, GROUND SHOOTING, SLIDE DASH, GRAPPLE HOOK, AIR SHOOTING, & FOCUSED FIRE
                </span>
              </div>
            </div>

            <span className="text-xs font-mono bg-amber-950 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded font-bold">
              PIXEL SPEC: 32x48 ARCHITECTURE
            </span>
          </div>

          {/* Sprite Sheet Grid Table */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4 overflow-x-auto">
            {/* ROW 1: IDLE */}
            <div className="p-3 bg-slate-900/60 rounded border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">1. IDLE (4 Frames)</span>
                <span className="text-slate-500">Pose napas netral dengan rifle disandang di pinggul</span>
              </div>
              <div className="flex gap-4 items-center overflow-x-auto py-2">
                {[0, 1, 2, 3].map((f) => (
                  <div key={f} className="flex flex-col items-center gap-1.5 p-2 bg-slate-950 rounded border border-slate-800 hover:border-cyan-500/50 transition-colors">
                    <div className="w-10 h-14 relative flex flex-col items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-cyan-400 border border-cyan-300 relative flex items-center justify-center">
                        <div className="w-3.5 h-1.5 bg-slate-950 flex items-center justify-end px-0.5">
                          <div className="w-2.5 h-1 bg-cyan-300 animate-pulse" />
                        </div>
                      </div>
                      <div className="w-5 h-6 bg-slate-900 border border-slate-700 relative flex flex-col items-center mt-0.5">
                        <div className="w-3.5 h-4 bg-orange-500" />
                        <div className="absolute -right-3 top-1 w-5 h-2 bg-slate-700 border border-slate-600" />
                      </div>
                      <div className="flex gap-1 mt-0.5">
                        <div className="w-2 h-4 bg-slate-800 border-b-2 border-orange-500" />
                        <div className="w-2 h-4 bg-slate-800 border-b-2 border-orange-500" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">f_{f + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ROW 2: RUN */}
            <div className="p-3 bg-slate-900/60 rounded border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">2. RUN (8 Frames)</span>
                <span className="text-slate-500">Siklus lari penuh (8-frame run cycle) dengan rambut cyan berkibar</span>
              </div>
              <div className="flex gap-3 items-center overflow-x-auto py-2">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((f) => (
                  <div key={f} className="flex flex-col items-center gap-1.5 p-2 bg-slate-950 rounded border border-slate-800 hover:border-cyan-500/50 transition-colors">
                    <div className="w-10 h-14 relative flex flex-col items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-cyan-400 border border-cyan-300 relative flex items-center justify-center">
                        <div className="w-3.5 h-1.5 bg-slate-950 flex items-center justify-end px-0.5">
                          <div className="w-2.5 h-1 bg-cyan-300" />
                        </div>
                        {/* Flowing ponytail hair */}
                        <div className="absolute -left-4 top-0.5 w-5 h-3 bg-cyan-500 rounded-l-full" />
                      </div>
                      <div className="w-5 h-6 bg-slate-900 border border-slate-700 relative flex flex-col items-center mt-0.5">
                        <div className="w-3.5 h-4 bg-orange-500" />
                        <div className="absolute -right-3 top-1 w-5 h-2 bg-slate-700 border border-slate-600" />
                      </div>
                      <div className="flex gap-1.5 mt-0.5">
                        <div className={`w-2 h-4 bg-slate-800 border-b-2 border-orange-500 transform ${f % 2 === 0 ? 'rotate-15' : '-rotate-15'}`} />
                        <div className={`w-2 h-4 bg-slate-800 border-b-2 border-orange-500 transform ${f % 2 === 0 ? '-rotate-15' : 'rotate-15'}`} />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">run_{f + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ROW 3: SLIDE DASH */}
            <div className="p-3 bg-amber-950/20 rounded border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold">3. SLIDE DASH (4 Frames)</span>
                <span className="text-amber-300/80">Meluncur rendah di bawah tembakan laser dengan jejak mikro-jet api & plasma</span>
              </div>
              <div className="flex gap-4 items-center overflow-x-auto py-2">
                {[0, 1, 2, 3].map((f) => (
                  <div key={f} className="flex flex-col items-center gap-1.5 p-2 bg-slate-950 rounded border border-slate-800 hover:border-amber-500/50 transition-colors">
                    <div className="w-16 h-10 relative flex items-center justify-center">
                      {/* Low slide torso & hair */}
                      <div className="flex items-center">
                        <div className="w-6 h-1.5 bg-gradient-to-r from-transparent via-orange-500 to-cyan-400" />
                        <div className="w-8 h-4 bg-slate-900 border border-slate-700 rounded flex items-center">
                          <div className="w-4 h-3 bg-orange-500" />
                          <div className="w-3 h-3 rounded-full bg-cyan-400 ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400">slide_{f + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ROW 4: GRAPPLE HOOK ACTION */}
            <div className="p-3 bg-sky-950/20 rounded border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-sky-400 font-bold">4. GRAPPLE HOOK ACTION (Shoot / Swing / Detach Landing)</span>
                <span className="text-sky-300/80">Urutan: Tembak kabel ke rel langit-langit ➔ Berayun melengkung ➔ Lepas & Mendarat</span>
              </div>
              <div className="flex flex-wrap gap-4 items-center py-2">
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-[11px] font-mono text-sky-400 font-bold">Shoot / Attach (4f):</span>
                  <span className="text-xs text-slate-300">Nexus mengarahkan senjata grapple diagonal ke atas.</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-[11px] font-mono text-sky-400 font-bold">Swing (4f):</span>
                  <span className="text-xs text-slate-300">Berayun di udara dengan lutut tertekuk dan rambut berkibar.</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-[11px] font-mono text-sky-400 font-bold">Detach/Landing (2f):</span>
                  <span className="text-xs text-slate-300">Melepas kabel lalu jongkok menyerap benturan pendaratan.</span>
                </div>
              </div>
            </div>

            {/* ROW 5: GROUND & AIR SHOOTING + FOCUSED FIRE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900/60 rounded border border-slate-800 space-y-1.5 text-xs font-mono">
                <span className="text-cyan-400 font-bold block">5. GROUND & AIR SHOOTING (2f Each)</span>
                <p className="text-slate-400 text-[11px]">
                  Menembakkan proyektil laser cincin plasma (<span className="text-cyan-300 font-bold">===O</span>) baik saat berdiri tegak di lantai maupun saat melayang di udara.
                </p>
              </div>

              <div className="p-3 bg-amber-950/30 rounded border border-amber-500/30 space-y-1.5 text-xs font-mono">
                <span className="text-amber-400 font-bold block">6. FOCUSED FIRE & HEAT GAUGE (3f + Thermometer)</span>
                <p className="text-slate-300 text-[11px]">
                  Stance menahan senjata mengumpulkan partikel energi plasma kuning pekat, memicu peningkatan suhu pada termometer Heat Gauge.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: KARAKTER PEMAIN - CYBORG AGENT 01 (NEXUS) */}
      <div className="border border-cyan-500/30 bg-slate-900/60 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
            <h3 className="text-lg font-bold text-cyan-300 font-mono tracking-wide">
              KARAKTER UTAMA: CYBORG AGENT 01 "NEXUS"
            </h3>
          </div>
          <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded">
            ELITE CYBERGIRL SPECIAL FORCES
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Sprite Pose Studio with Animation Controls */}
          <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono text-slate-400">Simulator Animasi Frame Nexus:</span>

              {/* Animation Speed and Play/Pause */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingAnim(!isPlayingAnim)}
                  className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  {isPlayingAnim ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlayingAnim ? 'Jeda' : 'Putar'}</span>
                </button>

                <select
                  value={animSpeed}
                  onChange={(e) => setAnimSpeed(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-slate-300 rounded px-1.5 py-0.5 text-xs font-mono"
                >
                  <option value={200}>0.5x Lambat</option>
                  <option value={120}>1.0x Normal</option>
                  <option value={60}>2.0x Cepat</option>
                </select>
              </div>
            </div>

            {/* Dynamic Pixel Sprite Mockup Canvas */}
            <div className="h-56 bg-slate-900/90 rounded border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Background Cyber Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />

              {/* Dynamic Presentation of Nexus based on active action and frame */}
              <div className="relative flex flex-col items-center z-10 transition-transform duration-75">
                {/* Hair & HUD Head */}
                <div className={`relative transition-transform duration-100 ${
                  activePlayerAction === 'slide_dash' ? 'translate-y-6 rotate-12' : ''
                }`}>
                  <div className="w-9 h-9 rounded-full bg-cyan-400 border border-cyan-300 shadow-lg shadow-cyan-400/50 flex items-center justify-center relative">
                    <div className="w-6 h-2.5 bg-slate-950 rounded-xs flex items-center justify-end px-0.5">
                      <div className={`w-4 h-1.5 ${hudActive ? 'bg-cyan-300' : 'bg-slate-700'} rounded-xs animate-pulse`} />
                    </div>
                  </div>
                  {/* Flowing ponytail hair */}
                  <div className={`absolute -left-7 top-1 w-8 h-5 bg-cyan-500 rounded-l-full transform ${
                    activePlayerAction === 'run'
                      ? animFrame % 2 === 0 ? '-rotate-12 scale-x-110' : '-rotate-6'
                      : activePlayerAction === 'jump'
                      ? '-rotate-45'
                      : activePlayerAction === 'slide_dash'
                      ? '-rotate-45 translate-x-2'
                      : ''
                  } transition-transform`} />
                </div>

                {/* Torso & Armor */}
                <div className={`w-8 h-12 bg-slate-900 border border-slate-700 rounded-xs my-0.5 relative flex flex-col items-center transition-all ${
                  activePlayerAction === 'slide_dash' ? 'translate-y-4 -rotate-45 scale-y-75' : ''
                }`}>
                  <div className="w-6 h-7 bg-orange-500 rounded-xs mt-1" />

                  {/* Weapon Laser Rifle */}
                  <div className={`absolute -right-8 top-3 w-10 h-3.5 bg-slate-800 border border-slate-600 rounded-xs flex items-center justify-end px-1 ${
                    activePlayerAction === 'ground_shoot' ? 'scale-110' : activePlayerAction === 'focused_fire' ? 'scale-125' : ''
                  }`}>
                    {activePlayerAction === 'ground_shoot' && (
                      <div className="w-6 h-2 bg-cyan-400 rounded-full animate-ping" />
                    )}
                    {activePlayerAction === 'focused_fire' && (
                      <div className="w-8 h-3 bg-amber-400 rounded-full shadow-lg shadow-amber-400 animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Legs & Micro-Jet Booster Boots */}
                <div className={`flex gap-2 transition-transform ${
                  activePlayerAction === 'slide_dash' ? 'translate-y-2 -translate-x-4 rotate-75' : ''
                }`}>
                  <div className={`w-3.5 h-9 bg-slate-800 border-b-4 border-orange-500 ${
                    activePlayerAction === 'run'
                      ? animFrame % 2 === 0 ? 'rotate-20' : '-rotate-20'
                      : activePlayerAction === 'jump'
                      ? 'rotate-25'
                      : ''
                  } transition-transform`} />
                  <div className={`w-3.5 h-9 bg-slate-800 border-b-4 border-orange-500 ${
                    activePlayerAction === 'run'
                      ? animFrame % 2 === 0 ? '-rotate-20' : 'rotate-20'
                      : activePlayerAction === 'jump'
                      ? '-rotate-25'
                      : ''
                  } transition-transform`} />
                </div>

                {/* Micro-Jet Booster Exhaust Flames */}
                {(activePlayerAction === 'slide_dash' || activePlayerAction === 'jump' || activePlayerAction === 'run') && (
                  <div className="flex gap-4 mt-1">
                    <span className="w-2 h-4 bg-orange-500 rounded-b-full shadow-md shadow-orange-500 animate-pulse" />
                    <span className="w-2 h-4 bg-cyan-400 rounded-b-full shadow-md shadow-cyan-400 animate-pulse" />
                  </div>
                )}

                {/* Slide Dash Plasma Streaks */}
                {activePlayerAction === 'slide_dash' && (
                  <div className="absolute -left-16 bottom-2 flex gap-1 items-center">
                    <div className="w-12 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-white animate-pulse" />
                    <div className="w-8 h-1 bg-gradient-to-r from-transparent to-orange-400 animate-pulse" />
                  </div>
                )}

                {/* Grapple Cable Swing */}
                {activePlayerAction === 'grapple_swing' && (
                  <div className="absolute -top-16 left-12 w-1 h-20 bg-cyan-400 shadow-md shadow-cyan-400 rotate-12" />
                )}
              </div>

              {/* Overlay Status Bar */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[11px] bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
                <div className="text-cyan-400">
                  Aksi Aktif: <span className="font-bold uppercase text-white">{activePlayerAction.replace('_', ' ')}</span>
                </div>
                <div className="text-slate-400">
                  Frame: <span className="text-amber-400 font-bold">{animFrame + 1}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {[
                { k: 'idle', label: 'Idle (4f)' },
                { k: 'run', label: 'Run (8f)' },
                { k: 'jump', label: 'Jump/Fall (3f)' },
                { k: 'ground_shoot', label: 'Shoot (2f)' },
                { k: 'slide_dash', label: 'Slide Dash (4f)' },
                { k: 'grapple_swing', label: 'Grapple Swing (4f)' },
                { k: 'focused_fire', label: 'Focused Fire (3f)' },
              ].map((btn) => (
                <button
                  key={btn.k}
                  onClick={() => {
                    setActivePlayerAction(btn.k as typeof activePlayerAction);
                    setAnimFrame(0);
                  }}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                    activePlayerAction === btn.k
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Close-Up Wajah & Kacamata HUD */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400">Spesifikasi Unit Nexus</span>
                <button
                  onClick={() => setHudActive(!hudActive)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center gap-1 text-xs font-mono cursor-pointer"
                >
                  {hudActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{hudActive ? 'HUD Visor Aktif' : 'HUD Visor Lepas'}</span>
                </button>
              </div>

              {/* Visor graphic badge */}
              <div className="p-3 bg-slate-900 rounded border border-slate-800 flex items-center gap-3.5 mb-3">
                <div className="w-14 h-14 rounded-lg bg-slate-950 border border-cyan-500/50 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                  <div className="w-10 h-3 bg-cyan-400 rounded-xs mb-1" />
                  <div className="w-6 h-1.5 bg-orange-400 rounded-xs" />
                  {hudActive && (
                    <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                      <span className="text-[7px] font-mono text-cyan-200 animate-pulse font-bold">
                        CYBER·2142
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-xs font-mono">
                  <div className="text-slate-100 font-bold">Cyborg Agent 01</div>
                  <div className="text-slate-400 text-[11px]">Rambut Biru · Armor Oranye/Hitam</div>
                  <div className="text-cyan-400 text-[10px] mt-0.5">Special Recon & Core Infiltration</div>
                </div>
              </div>

              {/* Feature Specifications */}
              <div className="bg-slate-900 p-3 rounded border border-slate-800 text-xs font-mono space-y-2">
                <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Fitur Perlengkapan Tempur</span>
                </div>
                <ul className="text-slate-300 space-y-1.5 text-[11px]">
                  <li>• <strong className="text-cyan-300">Kacamata HUD</strong>: Deteksi musuh, pengukur panas senjata, dan reticle bidik presisi.</li>
                  <li>• <strong className="text-cyan-300">Senjata Laser Standar Multi-Arah</strong>: Menembak 8 arah dengan proyektil plasma ring.</li>
                  <li>• <strong className="text-amber-300">Meluncur (Slide Dash)</strong>: Jet mikro di bot untuk meluncur cepat di bawah peluru.</li>
                  <li>• <strong className="text-sky-300">Grapple Hook</strong>: Kabel berenergi tinggi untuk berayun di rel langit-langit kota.</li>
                </ul>
              </div>
            </div>

            <div className="bg-cyan-950/40 border border-cyan-500/30 p-2.5 rounded text-center text-xs font-mono text-cyan-300">
              Agen Utama Terpilih untuk Misi Cyber Assault 2142
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: MUSUH GROUND - ROBO-TROOPER */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
            <h3 className="text-lg font-bold text-amber-300 font-mono tracking-wide">
              SECTION 2: MUSUH GROUND — ROBO-TROOPER
            </h3>
          </div>
          <span className="text-xs font-mono bg-amber-950/60 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded">
            INFANTRI PATROLI BIPEDAL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100 font-mono">Robo-Trooper MK.I (Standard)</span>
              <span className="text-xs font-mono text-cyan-400">Patrol Unit</span>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Prajurit bipedal patroli kota standar. Berpatroli di atas platform, menembakkan laser merah ketika mendeteksi Nexus.
            </p>
            <div className="bg-slate-900 p-2.5 rounded text-xs font-mono space-y-1 text-slate-300">
              <div className="flex justify-between"><span>Daya Tahan:</span><span className="text-cyan-400 font-bold">40 HP (2-3 Tembakan)</span></div>
              <div className="flex justify-between"><span>Senjata:</span><span>Senapan Laser Unit (10 DMG)</span></div>
              <div className="flex justify-between"><span>Perilaku:</span><span>Patroli bolak-balik & Tembak Lurus</span></div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-400 font-mono">Robo-Trooper Elite (Armored Variant)</span>
              <span className="text-xs font-mono text-orange-400">Heavy Guard</span>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Varian berperisai tebal berwarna perunggu/emas. Memiliki armor peredam kejut dan kecepatan tembak burst laser dua kali lipat.
            </p>
            <div className="bg-slate-900 p-2.5 rounded text-xs font-mono space-y-1 text-slate-300">
              <div className="flex justify-between"><span>Daya Tahan:</span><span className="text-orange-400 font-bold">80-100 HP</span></div>
              <div className="flex justify-between"><span>Senjata:</span><span>Dual Burst Plasma (15 DMG)</span></div>
              <div className="flex justify-between"><span>Perilaku:</span><span>Agresif & Pertahanan Posisi</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: MUSUH UDARA - DRONE (DENGUNG PELEDAK & SNIPER DRONE) */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-rose-400 rounded-full" />
            <h3 className="text-lg font-bold text-rose-300 font-mono tracking-wide">
              SECTION 3: MUSUH UDARA — DRONE PENYERANG
            </h3>
          </div>
          <span className="text-xs font-mono bg-rose-950/60 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded">
            UNIT UDARA PENGAWAS & PENYERGAP
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100 font-mono">Dengung Peledak MK.I (Explosive Drone)</span>
              <span className="text-xs font-mono text-rose-400">Kamikaze Unit</span>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Quadcopter lincah bersenjata hulu ledak mikro. Terbang dalam pola gelombang dan menukik bunuh diri saat berada di dekat Nexus.
            </p>
            <div className="bg-slate-900 p-2.5 rounded text-xs font-mono space-y-1 text-slate-300">
              <div className="flex justify-between"><span>Pola Kerusakan:</span><span>Utuh ➔ Meledak (Damage State)</span></div>
              <div className="flex justify-between"><span>Radius Ledakan:</span><span>40px (Area Damage)</span></div>
              <div className="flex justify-between"><span>Taktik Lawan:</span><span>Tembak dari jarak jauh sebelum menukik</span></div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400 font-mono">Sniper Drone (Unit Pengintai & Penghancur)</span>
              <span className="text-xs font-mono text-rose-400">Priority Target</span>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Target prioritas tinggi! Menyorot garis laser pengincar merah panjang ke posisi pemain, lalu melepaskan tembakan penetrasi berdaya hancur tinggi.
            </p>
            <div className="bg-slate-900 p-2.5 rounded text-xs font-mono space-y-1 text-slate-300">
              <div className="flex justify-between"><span>Waktu Bidik (Telegraph):</span><span className="text-amber-400">1.2 detik (Garis Merah)</span></div>
              <div className="flex justify-between"><span>Damage Laser:</span><span className="text-rose-400 font-bold">28 DMG (Kritis)</span></div>
              <div className="flex justify-between"><span>Prioritas:</span><span className="text-rose-400 font-bold">PRIORITAS UTAMA DIHABISI!</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* BOS UTAMA - SENTINEL VANGUARD MECH */}
      <div className="border-2 border-rose-500/40 bg-slate-900/80 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-500 animate-bounce" />
            <h3 className="text-lg font-bold text-rose-400 font-mono tracking-wide">
              BOS UTAMA: SENTINEL VANGUARD MECH (DETAIL ARSITEKTUR)
            </h3>
          </div>
          <span className="text-xs font-mono bg-rose-950 text-rose-300 border border-rose-500/50 px-2.5 py-0.5 rounded font-bold">
            STAGE 3 GRAND BOSS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4">
            <div className="text-xs font-mono text-slate-400">Diagram Anatomi & Komponen Utama Tempur:</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-900 p-3 rounded border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">1. Meriam Laser Laras Ganda</div>
                <p className="text-slate-400 text-[11px]">
                  Terletak pada lengan kanan. Menembakkan sapuan laser berkecepatan tinggi secara beruntun ke seluruh lantai arena.
                </p>
              </div>

              <div className="bg-slate-900 p-3 rounded border border-slate-800">
                <div className="text-orange-400 font-bold mb-1">2. Peluncur Rudal Bahu</div>
                <p className="text-slate-400 text-[11px]">
                  Pod 6 tabung di bahu kiri. Meluncurkan salvo 4 rudal berapi yang mengejar Nexus dan menghancurkan balok beton.
                </p>
              </div>

              <div className="bg-slate-900 p-3 rounded border border-slate-800">
                <div className="text-emerald-400 font-bold mb-1">3. Kaki Bipedal Mobilitas Tinggi</div>
                <p className="text-slate-400 text-[11px]">
                  Penyerap hentakan hidrolik berat, memungkinkan pergerakan langkah cepat dan getaran tanah di stasiun inti.
                </p>
              </div>

              <div className="bg-slate-900 p-3 rounded border border-rose-500/50 bg-rose-950/20">
                <div className="text-rose-400 font-bold mb-1">4. TITIK LEMAH TEREXPOSE (Panel Dada)</div>
                <p className="text-slate-300 text-[11px]">
                  Setelah salvo rudal, panel dada terbuka menampakkan inti AI yang berdenyut. Menerima 3x Critical Damage dari Tembakan Fokus!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-rose-500/30 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-rose-400 font-bold tracking-wider uppercase mb-2">
                STRATEGI MENGALAHKAN BOS
              </div>
              <ul className="text-xs font-mono text-slate-300 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">①</span>
                  <span>Gunakan Grapple Hook (R1) untuk berayun di langit-langit menghindari salvo rudal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">②</span>
                  <span>Waspadai platform rapuh yang runtuh ke jurang saat terkena api rudal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">③</span>
                  <span>Tahan tembakan laser (Tahan X) saat panel dada terbuka untuk menguras HP Vanguard Mech!</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 p-3 bg-rose-950/40 border border-rose-500/30 rounded text-center">
              <span className="text-xs font-mono text-rose-300 font-bold block">
                TOTAL HP BOS: 1200 HP
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Misi Selesai Setelah Inti AI Hancur
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
