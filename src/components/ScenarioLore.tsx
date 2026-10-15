import React, { useState } from 'react';
import { Terminal, Radio, ShieldCheck, ChevronRight, Volume2, Play, CheckCircle2 } from 'lucide-react';
import { audioFX } from '../game/audio.ts';

interface ScenarioLoreProps {
  onSelectStage: (stage: number) => void;
}

export const ScenarioLore: React.FC<ScenarioLoreProps> = ({ onSelectStage }) => {
  const [isPlayingBriefing, setIsPlayingBriefing] = useState(false);

  const handlePlayAudioBriefing = () => {
    setIsPlayingBriefing(true);
    audioFX.bossAlert();
    setTimeout(() => {
      audioFX.laser();
    }, 400);
    setTimeout(() => {
      setIsPlayingBriefing(false);
    }, 3000);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4 md:p-6 text-slate-200 font-sans space-y-6">
      {/* Header Banner */}
      <div className="border border-cyan-500/40 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-1">
            DOKUMEN OPERASI KHUSUS · CYBER CITY 2142
          </div>
          <h2 className="text-2xl font-black text-slate-100 font-pixel">
            SKENARIO & MISI CYBER ASSAULT 2142
          </h2>
        </div>

        {/* Audio Transmission Simulator */}
        <button
          onClick={handlePlayAudioBriefing}
          className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 px-4 py-2 rounded text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-950/60"
        >
          <Radio className={`w-4 h-4 text-cyan-400 ${isPlayingBriefing ? 'animate-pulse' : ''}`} />
          <span>{isPlayingBriefing ? 'Memutar Transmisi HQ...' : 'Putar Transmisi Suara HQ'}</span>
        </button>
      </div>

      {/* PENGANTAR 2142 */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-lg space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
          <Terminal className="w-4 h-4" />
          <span>PENGANTAR MISI (TAHUN 2142)</span>
        </div>
        <p className="text-sm text-slate-200 font-mono leading-relaxed bg-slate-950 p-4 rounded border border-slate-800">
          "Tahun 2142, Cyber City telah jatuh ke dalam kekacauan akibat pemberontakan robot bersenjata. Kamu berperan sebagai <strong className="text-cyan-400">"Nexus"</strong>, agen elit cybergirl, yang ditugaskan untuk menyusup ke pusat kota dan menghancurkan inti AI yang mengendalikan seluruh pasukan robot."
        </p>
      </div>

      {/* STAGE BREAKDOWNS (1, 2, 3) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 font-mono tracking-wider uppercase">
          ALUR TAHAPAN MISI UTAMA
        </h3>

        {/* Stage 1 */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/40 transition-colors">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                STAGE 1
              </span>
              <h4 className="font-bold text-slate-100 font-mono">Penyusupan Menara Sinyal</h4>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Nexus mulai dari pinggiran kota, berhadapan dengan robot penjaga patroli (Robo-Trooper) dan drone terbang. Level ini berfokus pada melatih pemain untuk melompat dan menembak robot dasar. Di akhir level, Nexus harus menghancurkan pemancar sinyal relay yang lemah untuk menghentikan bala bantuan robot.
            </p>
          </div>
          <button
            onClick={() => onSelectStage(1)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold px-4 py-2 rounded flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Mainkan Stage 1</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stage 2 */}
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/40 transition-colors">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                STAGE 2
              </span>
              <h4 className="font-bold text-slate-100 font-mono">Pengejaran di Jalur Melayang</h4>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Nexus menyusup ke jalur kereta melayang yang hancur. Di level ini, tantangannya adalah melompat di antara platform yang bergerak sambil menghindari rintangan laser dan menembak robot terbang yang lebih cepat. Tidak ada bos utama di sini, tetapi robot semakin agresif dan jurang maut menuntut keahlian Grapple Hook.
            </p>
          </div>
          <button
            onClick={() => onSelectStage(2)}
            className="bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold px-4 py-2 rounded flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Mainkan Stage 2</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stage 3 */}
        <div className="bg-slate-900/70 border border-rose-500/40 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-rose-500/60 transition-colors">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-500/50 text-xs font-mono font-bold">
                STAGE 3
              </span>
              <h4 className="font-bold text-rose-300 font-mono">Pertahanan Stasiun Inti (Boss Battle)</h4>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Nexus akhirnya sampai di pusat kendali, Stasiun Inti AI. Ini adalah level bos di mana dia harus berhadapan dengan robot besar <strong className="text-rose-400">"Sentinel Vanguard Mech"</strong>. Vanguard Mech memiliki dua meriam dan meriam utama. Strateginya adalah menghindari tembakan meriamnya, lalu menembak bagian intinya yang terbuka.
            </p>
          </div>
          <button
            onClick={() => onSelectStage(3)}
            className="bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold px-4 py-2 rounded flex items-center gap-1.5 shrink-0 cursor-pointer shadow-lg shadow-rose-600/30"
          >
            <span>Mainkan Boss Stage 3</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AKHIR SKENARIO */}
      <div className="bg-emerald-950/30 border border-emerald-500/40 p-5 rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>AKHIR SKENARIO (MISI SELESAI)</span>
        </div>
        <p className="text-xs md:text-sm text-slate-200 font-mono leading-relaxed">
          "Setelah Vanguard Mech dikalahkan, Nexus menghancurkan AI pusat. Sinyal AI mati, dan robot-robot di Cyber City pun nonaktif. Nexus mengakhiri misi dan Cyber City kembali aman."
        </p>
      </div>
    </div>
  );
};
