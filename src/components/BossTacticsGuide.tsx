import React from 'react';
import { AlertCircle, Target, ShieldAlert, Zap, Compass, Flame } from 'lucide-react';

export const BossTacticsGuide: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4 md:p-6 text-slate-200 font-sans space-y-6">
      {/* Title Banner matching image_4.png */}
      <div className="border border-rose-500/40 bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-rose-400 font-mono text-xs tracking-widest uppercase mb-1">
            BAGIAN 3 · LEMBAR MEKANIKA LINGKUNGAN & PERTEMPURAN SKALA BESAR (REF. VISUAL: IMAGE_4.PNG)
          </div>
          <h2 className="text-2xl font-black text-slate-100 font-pixel">
            SKENARIO KOMPOSIT: PERTEMPURAN BOS MECH KOTA NEON
          </h2>
        </div>
        <span className="text-xs font-mono bg-rose-950 text-rose-300 border border-rose-500/50 px-3 py-1 rounded font-bold">
          STAGE 3 · CLIMAX BATTLE
        </span>
      </div>

      {/* Overview Card */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-lg space-y-3">
        <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>Skenario Puncak: Menghadapi Sentinel Vanguard Mech di Cuaca Badai Ekstrem</span>
        </h3>
        <p className="text-xs text-slate-300 font-mono leading-relaxed">
          Semua mekanika yang dipelajari di Bagian 1 dan 2 (Grapple Hook, Platform Rapuh, Tembakan Fokus, Pengukur Panas) disatukan dalam satu pertempuran puncak berskala besar. Mech raksasa Vanguard berada dalam kondisi rusak berat, memuntahkan rentetan rudal sementara Sniper Drone mengunci laser pengincar.
        </p>
      </div>

      {/* 4 Interactive POI Cards (Points of Interest from image_4.png) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* POI 1 */}
        <div className="bg-slate-900/90 border border-sky-500/40 p-4 rounded-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-sky-400 font-mono font-bold text-sm">
            <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-500/50 text-xs">POI 1</span>
            <span>Penggunaan Grapple Lanjutan (R1)</span>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            Pemain beraksi di udara (Mid-Air) menggunakan grappling hook untuk menempel ke rel langit-langit dan berayun di atas jurang maut, secara efektif menghindari puing runtuh dan lintasan rudal berapi bos.
          </p>
          <div className="bg-slate-950 p-2.5 rounded text-[11px] font-mono text-sky-300">
            Teks Label: "Gunakan Grapple (R1) untuk Menghindari Puing & Pola Rudal Bos."
          </div>
        </div>

        {/* POI 2 */}
        <div className="bg-slate-900/90 border border-amber-500/40 p-4 rounded-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
            <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/50 text-xs">POI 2</span>
            <span>Titik Lemah Terbuka & Tembakan Fokus (Tahan X)</span>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            Setelah Vanguard Mech menembakkan salvo rudal, panel pelindung dada akan terbuka menampakkan inti AI yang berdenyut. Tembakan standar hanya memberi sedikit damage, tetapi <strong className="text-amber-300">Tembakan Fokus (Tahan X)</strong> memberikan 3x Critical Damage langsung ke inti!
          </p>
          <div className="bg-slate-950 p-2.5 rounded text-[11px] font-mono text-amber-300">
            Teks Label: "TITIK LEMAH TEREXPOSE: Gunakan Tembakan Terfokus (Tahan X)."
          </div>
        </div>

        {/* POI 3 */}
        <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-slate-300 font-mono font-bold text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-600 text-xs">POI 3</span>
            <span>Lingkungan Destruktif (Balok Runtuh)</span>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            Platform tengah arena dapat hancur akibat ledakan rudal atau injakan berulang. Balok beton yang condong dan puing yang jatuh dapat dijadikan pijakan sementara untuk rute baru menuju posisi bos.
          </p>
          <div className="bg-slate-950 p-2.5 rounded text-[11px] font-mono text-slate-400">
            Teks Label: "Lingkungan Destruktif - JATUHKAN BALOK BETON untuk Rute Baru!"
          </div>
        </div>

        {/* POI 4 */}
        <div className="bg-slate-900/90 border border-rose-500/40 p-4 rounded-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm">
            <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-500/50 text-xs">POI 4</span>
            <span>Musuh Baru: Sniper Drone (Target Prioritas)</span>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            Drone sniper mengintai dari kejauhan dengan garis laser merah pengincar. Memiliki daya tembus fatal bila diabaikan. Pemain harus melompat dan menembak drone ini sebelum memfokuskan serangan pada Vanguard Mech.
          </p>
          <div className="bg-slate-950 p-2.5 rounded text-[11px] font-mono text-rose-300">
            Teks Label: "MUSUH BARU: SNIPER DRONE - Target Prioritas (Prioritaskan untuk Dieliminasi!)"
          </div>
        </div>
      </div>

      {/* Visual Composite Breakdown Box */}
      <div className="p-4 bg-slate-900/80 border border-cyan-500/30 rounded-lg space-y-3">
        <h4 className="font-bold text-cyan-400 font-mono text-sm">
          Sintesis Elemen Desain 2142 (Visual Composite Summary)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300">
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">Visual Arena:</span>
            Kota neon dengan cuaca hujan asam badai kilat, billboard neon menyala, dan asap hitam dari mesin mech yang rusak.
          </div>
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">HUD Taktis:</span>
            Menampilkan bar HEALTH [III], SCORE tinggi (00152500), TIME 07:15, STAGE 2-2 / 3-1, dan Heat Gauge dengan status peringatan.
          </div>
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">Klimaks Gameplay:</span>
            Menghancurkan panel dada Vanguard Mech menonaktifkan inti AI pusat dan menyelamatkan Cyber City dari keruntuhan.
          </div>
        </div>
      </div>
    </div>
  );
};
