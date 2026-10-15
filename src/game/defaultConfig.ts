import { GameConfig } from './types.ts';

export const DEFAULT_CONFIG: GameConfig = {
  playerSpeed: 240,
  jumpForce: 490,
  dashPower: 450,
  laserDamage: 12,
  focusDamage: 32,
  heatMax: 100,
  heatCoolRate: 28,
  grappleMaxDist: 340,
  bossHp: 1200,
  droneSpawnInterval: 4.2,
  soundEnabled: true,
  difficulty: 'normal',
};

export interface ConfigPreset {
  id: string;
  name: string;
  description: string;
  config: GameConfig;
  scriptSnippet: string;
}

export const PRESETS: ConfigPreset[] = [
  {
    id: 'standard',
    name: 'Standar 2142 (Resmi)',
    description: 'Tingkat kesulitan orisinal seimbang untuk Nexus menembus Cyber City.',
    config: DEFAULT_CONFIG,
    scriptSnippet: `// Skenario & Konfigurasi Standar Cyber Assault 2142
const NEXUS_CONFIG = {
  speed: 240,          // Kecepatan lari Nexus (px/s)
  jumpForce: 490,      // Daya lompat mikro-jet
  dashPower: 450,      // Kecepatan slide dash (B / Shift)
  laserDamage: 12,     // Damage tembakan laser standar
  focusDamage: 32,     // Damage tembakan fokus (Tahan X)
  heatMax: 100,        // Batas Heat Gauge sebelum Overheat
  heatCoolRate: 28,    // Pendinginan panas per detik
  grappleReach: 340,   // Jangkauan kabel grappling (R1)
  bossHp: 1200,        // HP Sentinel Vanguard Mech
  difficulty: "normal"
};`,
  },
  {
    id: 'turbo_agent',
    name: 'Nexus Turbo Agent',
    description: 'Mobilitas jetboost ekstra cepat dan jangkauan kabel grapple 480px!',
    config: {
      ...DEFAULT_CONFIG,
      playerSpeed: 320,
      jumpForce: 540,
      dashPower: 600,
      grappleMaxDist: 480,
    },
    scriptSnippet: `// Konfigurasi Nexus Turbo Agent (Mobilitas Ekstrem)
const NEXUS_CONFIG = {
  speed: 320,          // Kecepatan lari supersonik
  jumpForce: 540,      // Lompatan tinggi melompati rintangan
  dashPower: 600,      // Turbo slide jet booster
  laserDamage: 14,
  focusDamage: 36,
  heatMax: 110,
  heatCoolRate: 35,
  grappleReach: 480,   // Kabel grapple ekstra panjang
  bossHp: 1200,
  difficulty: "normal"
};`,
  },
  {
    id: 'heavy_plasma',
    name: 'Heavy Core Buster',
    description: 'Tembakan fokus ekstra destruktif untuk menghancurkan inti AI.',
    config: {
      ...DEFAULT_CONFIG,
      laserDamage: 18,
      focusDamage: 55,
      heatMax: 130,
      heatCoolRate: 38,
      bossHp: 1500,
    },
    scriptSnippet: `// Konfigurasi Senjata Berat Core Buster
const NEXUS_CONFIG = {
  speed: 240,
  jumpForce: 490,
  dashPower: 450,
  laserDamage: 18,     // Laser standar di-overclock
  focusDamage: 55,     // Focused Beam berdaya tinggi
  heatMax: 130,        // Kapasitas Heat Sink diperluas
  heatCoolRate: 38,    // Pendingin nitrogen cair
  grappleReach: 340,
  bossHp: 1500,        // Mech berarmor tebal
  difficulty: "normal"
};`,
  },
  {
    id: 'hardcore_assault',
    name: 'Hardcore Robot Riot',
    description: 'Agresivitas tinggi: Drone spawn 2x lipat dan Sentinel Mech lebih buas.',
    config: {
      ...DEFAULT_CONFIG,
      bossHp: 1800,
      droneSpawnInterval: 2.2,
      heatCoolRate: 20,
      difficulty: 'hardcore',
    },
    scriptSnippet: `// Konfigurasi Hardcore: Pemberontakan Robot Ekstrem
const NEXUS_CONFIG = {
  speed: 230,
  jumpForce: 480,
  dashPower: 420,
  laserDamage: 10,
  focusDamage: 28,
  heatMax: 90,         // Heat gauge lebih cepat panas
  heatCoolRate: 20,    // Pendinginan lambat
  grappleReach: 320,
  bossHp: 1800,        // Boss mech sangat kuat
  droneSpawnInterval: 2.2, // Drone spawn sangat cepat
  difficulty: "hardcore"
};`,
  },
  {
    id: 'parallax_neon',
    name: 'Engine: Parallax & Neon Glow',
    description: 'Skrip perender 5 lapisan latar belakang paralaks dan kedipan lampu neon 2142.',
    config: DEFAULT_CONFIG,
    scriptSnippet: `// SKRIP PARALLAX BACKGROUND & PENCAHAYAAN NEON 2142
// 1. Lapisan Langit & Bulan: Rasio kecepatan 0.05x
// 2. Menara Mega & Siluet Kota: Rasio kecepatan 0.15x
// 3. Jembatan Pipa Kanal & Reklame: Rasio kecepatan 0.35x
// 4. Platform Girder & Rintangan: Rasio kecepatan 0.70x
// 5. Lampu Neon Pendar (Glow & Flicker): ShadowBlur 18-24px
const PARALLAX_SETTINGS = {
  layersCount: 5,
  skySpeed: 0.05,
  towerSpeed: 0.15,
  canalBridgeSpeed: 0.35,
  neonGlowIntensity: 22,
  flickerRate: 0.18,
  wetFloorReflections: true
};`,
  },
];
