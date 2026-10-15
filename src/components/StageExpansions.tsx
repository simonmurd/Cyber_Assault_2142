import React, { useState } from 'react';
import { Layers, Zap, Flame, Skull, Terminal, Sparkles, AlertOctagon, Lightbulb, Radio, Check } from 'lucide-react';

export const StageExpansions: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<'canal' | 'acid' | 'biocore'>('canal');
  const [copiedCode, setCopiedCode] = useState(false);

  const parallaxScript = `// ==============================================================
// CYBERPUNK 2142: PARALLAX ENGINE & PROCEDURAL NEON GLOW SCRIPT
// Multi-Plane Parallax Layering + CRT Scanline + Emissive Lighting
// ==============================================================

class CyberParallaxRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cameraX = 0;
    this.time = 0;

    // 5-Layer Parallax Architecture
    this.layers = [
      { speed: 0.05, draw: (ctx, x) => this.drawMoonAndSky(ctx, x) },
      { speed: 0.15, draw: (ctx, x) => this.drawMegaTowers(ctx, x) },
      { speed: 0.35, draw: (ctx, x) => this.drawCanalBridges(ctx, x) },
      { speed: 0.70, draw: (ctx, x) => this.drawNeonSignsAndVents(ctx, x) },
      { speed: 1.00, draw: (ctx, x) => this.drawForegroundPipes(ctx, x) }
    ];

    // Neon Billboards with Flicker State
    this.neonSigns = [
      { text: "CYBERCITY 2142", color: "#00f0ff", baseGlow: 18, x: 120, y: 160 },
      { text: "RAMKOREA",       color: "#ec4899", baseGlow: 22, x: 580, y: 220 },
      { text: "OUTPOST 7",      color: "#f59e0b", baseGlow: 15, x: 740, y: 180 },
      { text: "STAGE 2 - CANAL",color: "#38bdf8", baseGlow: 16, x: 340, y: 140 }
    ];
  }

  // Efek Kedipan Neon Alami (Flicker & Voltage Drop)
  getNeonFlicker(time, seed = 1) {
    const noise = Math.sin(time * 24 + seed * 13) * Math.cos(time * 48);
    // Drop tegangan acak sesekali
    if (Math.sin(time * 3 + seed) > 0.94) return 0.25; 
    return 0.85 + 0.15 * noise;
  }

  // Render Multi-Layer Parallax
  render(dt, playerVelocityX) {
    this.time += dt;
    this.cameraX += playerVelocityX * dt;
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Iterasi setiap lapisan dengan rasio kecepatan berbeda
    this.layers.forEach(layer => {
      ctx.save();
      const offsetX = -(this.cameraX * layer.speed) % canvas.width;
      ctx.translate(offsetX, 0);
      layer.draw(ctx, offsetX);
      ctx.translate(canvas.width, 0);
      layer.draw(ctx, offsetX); // Seamless repeat tile
      ctx.restore();
    });

    // Emissive Bloom Pass (Refleksi Cahaya di Lantai Basah)
    this.drawWetSurfaceReflections(ctx);
  }

  drawNeonSignsAndVents(ctx, layerOffsetX) {
    this.neonSigns.forEach((sign, idx) => {
      const flicker = this.getNeonFlicker(this.time, idx);
      ctx.save();
      // Dual-Pass Glowing Box
      ctx.shadowColor = sign.color;
      ctx.shadowBlur = sign.baseGlow * flicker;
      ctx.strokeStyle = sign.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(sign.x, sign.y, 160, 40);

      // Emissive Typography
      ctx.fillStyle = sign.color;
      ctx.font = 'bold 12px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(sign.text, sign.x + 80, sign.y + 25);
      ctx.restore();
    });
  }

  drawWetSurfaceReflections(ctx) {
    // Gradien pantulan lantai logam basah di bagian bawah
    const floorY = 480;
    const grad = ctx.createLinearGradient(0, floorY, 0, 560);
    grad.addColorStop(0, 'rgba(6, 182, 212, 0.18)'); // Cyan ambient sheen
    grad.addColorStop(0.5, 'rgba(236, 72, 153, 0.12)'); // Magenta neon bounce
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, floorY, this.canvas.width, 80);
  }
}`;

  const copyScript = () => {
    navigator.clipboard?.writeText(parallaxScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4 md:p-6 text-slate-200 font-sans space-y-6">
      {/* Header Banner */}
      <div className="border border-cyan-500/40 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-1">
            EKSPANSI DUNIA 2142 · ANALISIS REFERENSI VISUAL & DESAIN LEVEL
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-100 font-pixel">
            KONSEP 3 STAGE, MEKANIK LINGKUNGAN & PARALLAX SCRIPT
          </h2>
        </div>

        {/* Theme Picker */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            onClick={() => setSelectedTheme('canal')}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedTheme === 'canal'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Stage A: Canal District
          </button>
          <button
            onClick={() => setSelectedTheme('acid')}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedTheme === 'acid'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                : 'bg-slate-800 text-emerald-300 hover:bg-slate-700 border border-emerald-500/40'
            }`}
          >
            Stage B: Toxic Outpost 7
          </button>
          <button
            onClick={() => setSelectedTheme('biocore')}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedTheme === 'biocore'
                ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30'
                : 'bg-slate-800 text-rose-300 hover:bg-slate-700 border border-rose-500/40'
            }`}
          >
            Stage C: Bio-Core Overheat
          </button>
        </div>
      </div>

      {/* PART 1: RANCANGAN KONSEP 3 STAGE BERIKUTNYA */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-slate-100 font-mono tracking-wide">
            1. RANCANGAN KONSEP 3 STAGE BERIKUTNYA (WORLD EXPANSION)
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Stage A */}
          <div className={`p-4 rounded-lg border transition-all ${
            selectedTheme === 'canal' ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/10' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                STAGE 2-A
              </span>
              <span className="text-xs font-mono text-cyan-300">Neon Violet & Cyan</span>
            </div>
            <h4 className="font-bold text-slate-100 font-mono text-sm mb-1">
              Canal District: Megacity Under-Viaduct
            </h4>
            <p className="text-xs text-slate-400 font-mono leading-relaxed mb-3">
              Kanal air bawah kota dengan kabut tipis dan jembatan pipa berkarat. Dihiasi papan reklame neon "RAMKOREA", "KEON 2142", dan kedai ramen holografik. Nexus harus berayun menggunakan Grapple Hook di antara viaduk bertingkat.
            </p>
            <div className="bg-slate-950 p-2.5 rounded text-[11px] font-mono space-y-1 text-slate-300 border border-slate-800/80">
              <div className="text-cyan-400 font-bold">Palet: Cyan (#00f0ff), Magenta (#ec4899), Dark Slate (#0f172a)</div>
              <div>Bahaya: Jurang kanal berarus deras, kabel tegangan tinggi basah.</div>
            </div>
          </div>

          {/* Stage B */}
          <div className={`p-4 rounded-lg border transition-all ${
            selectedTheme === 'acid' ? 'bg-slate-900 border-emerald-400 shadow-lg shadow-emerald-500/10' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                STAGE 2-B
              </span>
              <span className="text-xs font-mono text-emerald-300">Toxic Emerald & Amber</span>
            </div>
            <h4 className="font-bold text-emerald-300 font-mono text-sm mb-1">
              Outpost 7: Acid Canal & Reactor Vents
            </h4>
            <p className="text-xs text-slate-400 font-mono leading-relaxed mb-3">
              Pos terluar pabrik kimia militer robotik yang mengalami kebocoran reaktor. Air kanal berubah menjadi limbah asam hijau berpendar (Matrix Toxic Green). Asap beracun keluar dari pipa cerobong raksasa secara berkala.
            </p>
            <div className="bg-slate-950 p-2.5 rounded text-[11px] font-mono space-y-1 text-slate-300 border border-slate-800/80">
              <div className="text-emerald-400 font-bold">Palet: Acid Green (#10b981), Amber Moon (#f59e0b), Rust Olive (#365314)</div>
              <div>Bahaya: Genangan asam korosif, semburan uap gas beracun.</div>
            </div>
          </div>

          {/* Stage C */}
          <div className={`p-4 rounded-lg border transition-all ${
            selectedTheme === 'biocore' ? 'bg-slate-900 border-rose-500 shadow-lg shadow-rose-500/10' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/50 text-xs font-mono font-bold">
                STAGE 3-FINAL
              </span>
              <span className="text-xs font-mono text-rose-400">Bio-Cybernetic Mutation</span>
            </div>
            <h4 className="font-bold text-rose-400 font-mono text-sm mb-1">
              The Core: Bio-Mechanical Quarantine
            </h4>
            <p className="text-xs text-slate-400 font-mono leading-relaxed mb-3">
              Pusat stasiun reaktor inti AI yang telah terkorupsi ("QUARANTINE: CORE LEVEL 10"). Dinding logam ditumbuhi tentakel bio-mekanis organik mutasi, lantai membeku es nitrogen cair bocor, dan alarm "CORE OVERHEAT" berkedip merah.
            </p>
            <div className="bg-slate-950 p-2.5 rounded text-[11px] font-mono space-y-1 text-slate-300 border border-slate-800/80">
              <div className="text-rose-400 font-bold">Palet: Flesh Purple (#a855f7), Frozen Slime (#67e8f9), Deep Abyss (#020617)</div>
              <div>Bahaya: Tentakel bio-cybernetic penjepit, platform lantai licin es nitrogen.</div>
            </div>
          </div>
        </div>
      </div>

      {/* PART 2: SARAN MEKANIK LINGKUNGAN BARU */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-slate-100 font-mono tracking-wide">
            2. REKOMENDASI MEKANIK LINGKUNGAN INTERAKTIF (ENVIRONMENTAL HAZARDS)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          {/* Mekanik 1 */}
          <div className="bg-slate-900/80 border border-cyan-500/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Lightbulb className="w-4 h-4 text-cyan-300" />
              <span>1. Kabel & Neon Bertegangan Arcing</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Lampu papan neon (seperti CYBERCITY & RAMKOREA) yang dapat ditembak putus oleh pemain. Kabel yang terjatuh menghasilkan sengatan listrik (*electrical arc*) yang membunuh musuh di bawahnya atau menyengat Nexus jika salah melangkah.
            </p>
          </div>

          {/* Mekanik 2 */}
          <div className="bg-slate-900/80 border border-emerald-500/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Skull className="w-4 h-4 text-emerald-300" />
              <span>2. Katup Semburan Uap Asam (Steam Vents)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Cerobong pipa besi Outpost 7 menyemburkan uap asam hijau secara periodik (interval 2 detik). Nexus harus mengatur waktu *Slide Dash* untuk meluncur melewatinya saat katup tertutup tanpa terkena korosi armor.
            </p>
          </div>

          {/* Mekanik 3 */}
          <div className="bg-slate-900/80 border border-amber-500/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Terminal className="w-4 h-4 text-amber-300" />
              <span>3. Terminal Komputer Outpost Hackable</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Terminal kontrol komputer di tepi platform (seperti pada gambar Outpost 7). Nexus dapat menekan tombol interaksi untuk meretas pintu sekat, mematikan laser pertahanan, atau memanggil drone sekutu.
            </p>
          </div>

          {/* Mekanik 4 */}
          <div className="bg-slate-900/80 border border-rose-500/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertOctagon className="w-4 h-4 text-rose-300" />
              <span>4. Tentakel Bio-Mekanis Perangkap</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Pada Core Stage, sulur tentakel daging-kabel menjalar dari pipa. Jika Nexus menginjaknya, tentakel akan melilit kaki mengurangi mobilitas lari 50% kecuali jika ditembak menggunakan *Focused Fire* untuk memotongnya.
            </p>
          </div>

          {/* Mekanik 5 */}
          <div className="bg-slate-900/80 border border-sky-500/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <Radio className="w-4 h-4 text-sky-300" />
              <span>5. Proyektor Uap Hologram Pengalih</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Hologram mangkuk ramen/minuman berkedip di udara. Nexus dapat menembak proyektornya untuk menciptakan distorsi cahaya yang membingungkan sistem pengincar laser milik *Sniper Drone*.
            </p>
          </div>

          {/* Mekanik 6 */}
          <div className="bg-slate-900/80 border border-purple-500/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <Flame className="w-4 h-4 text-purple-300" />
              <span>6. Lantai Nitrogen Beku & Overheat Hazard</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Bocoran nitrogen cair membuat platform licin (menambah jarak seluncur *Slide Dash* 2x lipat), sementara zona ventilasi panas membuat *Heat Gauge* Nexus naik 2x lebih cepat bila menembak di dekatnya.
            </p>
          </div>
        </div>
      </div>

      {/* PART 3: SCRIPT / KODE DASAR EFEK PARALLAX BACKGROUND & PENCAHAYAAN NEON */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-100 font-mono tracking-wide">
              3. SCRIPT TEKNIS: PARALLAX 5-LAYER & NEON EMISSIVE SHADOW
            </h3>
          </div>

          <button
            onClick={copyScript}
            className="self-start sm:self-auto px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedCode ? 'Tersalin ke Clipboard!' : 'Salin Script Parallax'}</span>
          </button>
        </div>

        {/* Code Block Display */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden font-mono text-xs">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-slate-400 flex justify-between">
            <span>CyberParallaxRenderer.js</span>
            <span className="text-cyan-400">WebGL & Canvas2D Compliant</span>
          </div>
          <pre className="p-4 text-slate-300 overflow-x-auto leading-relaxed max-h-96">
            <code>{parallaxScript}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
