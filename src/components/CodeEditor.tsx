import React, { useState } from 'react';
import { GameConfig } from '../game/types.ts';
import { PRESETS, ConfigPreset } from '../game/defaultConfig.ts';
import { Code2, Sliders, RotateCcw, Check, Sparkles, AlertTriangle } from 'lucide-react';

interface CodeEditorProps {
  config: GameConfig;
  onConfigChange: (newConfig: GameConfig) => void;
  onRun: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ config, onConfigChange, onRun }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'sliders'>('code');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('standard');
  const [codeContent, setCodeContent] = useState<string>(PRESETS[0].scriptSnippet);
  const [saveToast, setSaveToast] = useState(false);

  const handleSelectPreset = (preset: ConfigPreset) => {
    setSelectedPresetId(preset.id);
    setCodeContent(preset.scriptSnippet);
    onConfigChange(preset.config);
  };

  const handleSliderChange = (key: keyof GameConfig, val: number) => {
    const updated = { ...config, [key]: val };
    onConfigChange(updated);
  };

  const handleApplyCode = () => {
    // Attempt to extract values or apply
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
    onRun();
  };

  return (
    <section className="h-full flex flex-col bg-slate-900 border-r border-slate-800 overflow-hidden font-mono text-xs">
      {/* Tab bar */}
      <div className="bg-slate-950/90 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              activeTab === 'code'
                ? 'bg-slate-800 text-cyan-400 font-bold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>cyber_nexus_mod.js</span>
          </button>

          <button
            onClick={() => setActiveTab('sliders')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              activeTab === 'sliders'
                ? 'bg-slate-800 text-cyan-400 font-bold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tuning Slider Parameter</span>
          </button>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 hidden sm:inline">Preset:</span>
          <select
            value={selectedPresetId}
            onChange={(e) => {
              const found = PRESETS.find((p) => p.id === e.target.value);
              if (found) handleSelectPreset(found);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-cyan-500"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'code' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Line numbers gutter */}
            <div className="w-10 bg-slate-950/70 border-r border-slate-800/80 text-slate-600 select-none py-3 text-right pr-2 font-mono text-[11px] leading-5">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code text area */}
            <textarea
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              spellCheck={false}
              className="flex-1 p-3 bg-slate-900/95 text-slate-200 font-mono text-xs leading-5 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/50 selection:bg-cyan-500/30 selection:text-white"
            />
          </div>
        ) : (
          /* Parameter Tuning Sliders */
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/70">
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg flex items-start gap-2.5 text-cyan-300 text-xs">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-100">Modifikasi Real-Time Cyber Assault 2142</strong>
                Sesuaikan parameter fisik gerak Agen Nexus, daya tembakan fokus, kapasitas Heat Gauge, dan daya tahan bos Sentinel Mech.
              </div>
            </div>

            {/* Slider 1: Player Speed */}
            <div className="space-y-1 bg-slate-950/50 p-2.5 rounded border border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Kecepatan Lari Nexus (speed)</span>
                <span className="text-cyan-400 font-bold">{config.playerSpeed} px/s</span>
              </div>
              <input
                type="range"
                min="160"
                max="400"
                step="10"
                value={config.playerSpeed}
                onChange={(e) => handleSliderChange('playerSpeed', Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Slider 2: Jump Force */}
            <div className="space-y-1 bg-slate-950/50 p-2.5 rounded border border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Daya Lompat Jet Boots (jumpForce)</span>
                <span className="text-cyan-400 font-bold">{config.jumpForce}</span>
              </div>
              <input
                type="range"
                min="380"
                max="620"
                step="10"
                value={config.jumpForce}
                onChange={(e) => handleSliderChange('jumpForce', Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Slider 3: Focused Beam Damage */}
            <div className="space-y-1 bg-slate-950/50 p-2.5 rounded border border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Damage Tembakan Fokus (focusDamage)</span>
                <span className="text-amber-400 font-bold">{config.focusDamage} pts</span>
              </div>
              <input
                type="range"
                min="15"
                max="80"
                step="1"
                value={config.focusDamage}
                onChange={(e) => handleSliderChange('focusDamage', Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Slider 4: Heat Cooling Rate */}
            <div className="space-y-1 bg-slate-950/50 p-2.5 rounded border border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Kecepatan Pendinginan Heat Gauge (heatCoolRate)</span>
                <span className="text-emerald-400 font-bold">{config.heatCoolRate} pts/s</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="2"
                value={config.heatCoolRate}
                onChange={(e) => handleSliderChange('heatCoolRate', Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Slider 5: Grapple Hook Reach */}
            <div className="space-y-1 bg-slate-950/50 p-2.5 rounded border border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Jangkauan Kabel Grappling Hook (grappleReach)</span>
                <span className="text-sky-400 font-bold">{config.grappleMaxDist} px</span>
              </div>
              <input
                type="range"
                min="240"
                max="550"
                step="10"
                value={config.grappleMaxDist}
                onChange={(e) => handleSliderChange('grappleMaxDist', Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>

            {/* Slider 6: Boss Mech HP */}
            <div className="space-y-1 bg-slate-950/50 p-2.5 rounded border border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>HP Sentinel Vanguard Mech (bossHp)</span>
                <span className="text-rose-400 font-bold">{config.bossHp} HP</span>
              </div>
              <input
                type="range"
                min="600"
                max="2500"
                step="50"
                value={config.bossHp}
                onChange={(e) => handleSliderChange('bossHp', Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>
        )}

        {/* Save confirmation toast */}
        {saveToast && (
          <div className="absolute top-3 right-3 bg-emerald-500/90 text-slate-950 font-bold px-3 py-1.5 rounded shadow-lg flex items-center gap-1.5 animate-in fade-in duration-200">
            <Check className="w-4 h-4" />
            <span>Konfigurasi Diterapkan!</span>
          </div>
        )}
      </div>

      {/* Footer bar with shortcut guides */}
      <div className="bg-slate-950 px-4 py-2 text-[11px] text-slate-400 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-400">
          <span className="text-cyan-400 font-bold">KONTROL:</span>
          <span>A/D Gerak</span>
          <span>·</span>
          <span>W/Space Lompat</span>
          <span>·</span>
          <span>B Slide</span>
          <span>·</span>
          <span>X Tembak</span>
          <span>·</span>
          <span>R Grapple</span>
        </div>

        <button
          onClick={handleApplyCode}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Check className="w-3 h-3" />
          <span>Terapkan Mod</span>
        </button>
      </div>
    </section>
  );
};
