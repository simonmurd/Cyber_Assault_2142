import React, { useState, useEffect } from 'react';
import { Zap, Shield, Move, Flame, ArrowUp, Navigation, AlertTriangle, Compass } from 'lucide-react';
import { updateHeatGauge } from '../game/rules.ts';

export const MechanicsGuide: React.FC = () => {
  // Interactive Heat Gauge demo
  const [demoHeat, setDemoHeat] = useState(25);
  const [demoOverheated, setDemoOverheated] = useState(false);
  const [isFiringDemo, setIsFiringDemo] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isFiringDemo) {
        setDemoHeat((prev) => {
          const next = prev + 12;
          if (next >= 100) {
            setDemoOverheated(true);
            return 100;
          }
          return next;
        });
      } else {
        setDemoHeat((prev) => {
          const result = updateHeatGauge(prev, 100, demoOverheated, 30, 0.1);
          setDemoOverheated(result.isOverheated);
          return result.heat;
        });
      }
    }, 100);

    return () => clearInterval(timer);
  }, [demoOverheated, isFiringDemo]);

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4 md:p-6 text-slate-200 font-sans space-y-6">
      {/* Title Banner matching image_3.png */}
      <div className="border border-cyan-500/40 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-1">
            BAGIAN 2 · LEMBAR MEKANIKA GERAKAN & PERTARUNGAN (REF. VISUAL: IMAGE_3.PNG)
          </div>
          <h2 className="text-2xl font-black text-slate-100 font-pixel">
            KONTROL DASAR, SISTEM TEMPUR & GRAVITASI
          </h2>
        </div>
      </div>

      {/* SECTION 1: MEKANIKA GERAKAN (KONTROL DASAR) */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Move className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-cyan-300 font-mono tracking-wide">
              SECTION 1: MEKANIKA GERAKAN (KONTROL DASAR)
            </h3>
          </div>
          <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded">
            MOBILITAS JET CYBERNETIC
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gerakan Tanah */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100 font-mono">Gerakan Tanah & Melompat</span>
              <span className="text-xs font-mono text-cyan-400">Tombol: A/D & Space / W</span>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Nexus bergerak lincah menelusuri girder kota. Melompat mengaktifkan dorongan vertikal mikro-jet di sol sepatu bot.
            </p>
            <div className="bg-slate-900 p-3 rounded text-xs font-mono space-y-2 border border-slate-800/80">
              <div className="text-slate-300 flex items-center justify-between">
                <span>Berjalan Kiri / Kanan:</span>
                <span className="text-cyan-400 font-bold">Tombol A / D atau Panah</span>
              </div>
              <div className="text-slate-300 flex items-center justify-between">
                <span>Melompat Tinggi:</span>
                <span className="text-cyan-400 font-bold">Tombol W / Space / Panah Atas</span>
              </div>
            </div>
          </div>

          {/* Gerakan Lanjutan: Dash & Slide */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 font-mono">Gerakan Lanjutan: Dash & Slide (NEW!)</span>
              <span className="text-xs font-mono text-amber-400">Tombol: B / Shift</span>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Urutan Gerakan: <strong className="text-slate-200">Lompat ➔ Air Dash ➔ Slide Tanah</strong>. Memanfaatkan mikro-jet ganda di bot untuk meluncur di bawah tembakan laser musuh.
            </p>
            <div className="bg-slate-900 p-3 rounded text-xs font-mono space-y-2 border border-slate-800/80">
              <div className="text-slate-300 flex items-center justify-between">
                <span>Booster Jet Ground Slide:</span>
                <span className="text-amber-400 font-bold">Tombol B atau Shift</span>
              </div>
              <div className="text-slate-300 flex items-center justify-between">
                <span>Fungsi Taktis:</span>
                <span className="text-emerald-400 font-bold">Menghindar Cepat & Invulnerability Frame</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: MEKANIKA PERTARUNGAN (MENEMBAK & TEMBAKAN FOKUS) */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-amber-300 font-mono tracking-wide">
              SECTION 2: MEKANIKA PERTARUNGAN (MENEMBAK & TEMBAKAN FOKUS)
            </h3>
          </div>
          <span className="text-xs font-mono bg-amber-950/60 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded">
            MULTI-ARAH & OVERHEAT
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tembakan Standar */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <span className="font-bold text-slate-100 font-mono block">1. Penembakan Multi-Arah (Tombol X / Klik Kiri)</span>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Senapan laser Nexus dapat membidik dalam 8 arah mata angin (Lurus, Diagonal Atas, Vertikal, Diagonal Bawah saat melompat). Menembak laser biru standar tanpa jeda panjang.
            </p>
            <div className="bg-slate-900 p-3 rounded text-xs font-mono text-slate-300 space-y-1">
              <div>• Damage Dasar: 12 Damage per proyektil</div>
              <div>• Heat Build: Sangat rendah (tidak mudah overheat)</div>
              <div>• Ideal untuk: Robo-Trooper biasa dan drone patroli</div>
            </div>
          </div>

          {/* Tembakan Fokus & Interactive Heat Gauge */}
          <div className="bg-slate-950 p-4 rounded-lg border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 font-mono">2. Tembakan Fokus (Tahan X / Tahan Klik)</span>
              <span className="text-xs font-mono text-rose-400 font-bold">Waspadai Overheat!</span>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Nexus menahan senapan, menembakkan balok laser kuning berdaya tinggi (32 DMG) yang menembus armor. Menguras energi dan mengisi Heat Gauge dengan cepat.
            </p>

            {/* Interactive Heat Gauge Simulator Widget */}
            <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Pengukur Panas (Heat Gauge):</span>
                <span className={demoOverheated ? 'text-rose-400 font-bold animate-pulse' : 'text-amber-400 font-bold'}>
                  {demoOverheated ? 'OVERHEAT! LOCKDOWN' : `${Math.round(demoHeat)}%`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-700">
                <div
                  className={`h-full transition-all duration-75 ${
                    demoOverheated
                      ? 'bg-rose-500 animate-pulse'
                      : demoHeat > 75
                      ? 'bg-orange-500'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${demoHeat}%` }}
                />
              </div>

              <div className="flex justify-between items-center pt-1">
                <button
                  onMouseDown={() => setIsFiringDemo(true)}
                  onMouseUp={() => setIsFiringDemo(false)}
                  onTouchStart={() => setIsFiringDemo(true)}
                  onTouchEnd={() => setIsFiringDemo(false)}
                  className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold px-3 py-1 rounded text-xs font-mono transition-transform cursor-pointer"
                >
                  Tahan untuk Uji Tembakan Fokus
                </button>
                <span className="text-[10px] font-mono text-slate-500">
                  {isFiringDemo ? '🔥 Mengisi Panas...' : '❄️ Mendingin Otomatis'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: MEKANIKA GRAVITASI & LINGKUNGAN (FITUR BARU) */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-sky-300 font-mono tracking-wide">
              SECTION 3: MEKANIKA GRAVITASI & LINGKUNGAN (FITUR BARU)
            </h3>
          </div>
          <span className="text-xs font-mono bg-sky-950/60 text-sky-400 border border-sky-500/40 px-2 py-0.5 rounded">
            PLATFORM RAPUH & GRAPPLE HOOK
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Platform Rapuh */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <span className="font-bold text-slate-100 font-mono block">1. Platform Rapuh & Runtuh</span>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Jalur kota layang yang rusak tidak stabil. Platform tertentu akan bergetar dan retak saat diinjak lebih dari 1.2 detik atau saat terkena ledakan rudal, lalu runtuh ke jurang maut!
            </p>
            <div className="bg-slate-900 p-2.5 rounded text-xs font-mono text-slate-300">
              <span className="text-rose-400 font-bold block mb-1">Tips Bertahan Hidup:</span>
              Segera lompat sebelum platform jatuh, atau gunakan kabel grappling untuk berayun ke rel langit-langit!
            </div>
          </div>

          {/* Grapple Hook Mekanik */}
          <div className="bg-slate-950 p-4 rounded-lg border border-sky-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-400 font-mono">2. Mekanik Grapple Hook (Tombol R1 / R)</span>
              <span className="text-xs font-mono text-sky-300 font-bold">Navigasi Lanjutan</span>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Kabel magnetik berenergi tinggi yang ditembakkan ke rel overhead girder. Memungkinkan Nexus berayun melintasi jurang tanpa dasar dan menghindari salvo serangan bos mech.
            </p>
            <div className="bg-slate-900 p-2.5 rounded text-xs font-mono text-slate-300 space-y-1">
              <div>• Tembak Grapple: Tekan R / E / Klik Kanan</div>
              <div>• Ayunan Momentum: Tekan A / D untuk memompa kecepatan</div>
              <div>• Lepas & Melompat: Tekan R lagi untuk terlempar ke udara</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
