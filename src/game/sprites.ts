/**
 * 16-BIT CYBERPUNK PIXEL ART SPRITE & NEON LIGHTING ENGINE
 * Strict pixelated rendering (imageSmoothingEnabled = false),
 * frame cropping (sx, sy, sw, sh), neon glow (shadowBlur/shadowColor),
 * and retro arcade HUD.
 */

export interface SpriteFrame {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dw: number;
  dh: number;
}

// Variables to load external sprite sheets and stage backgrounds
export const AssetImages = {
  playerSpritesheet: null as HTMLImageElement | null,
  roboTrooperSpritesheet: null as HTMLImageElement | null,
  droneSpritesheet: null as HTMLImageElement | null,
  sniperDroneSpritesheet: null as HTMLImageElement | null,
  bossMechSpritesheet: null as HTMLImageElement | null,
  stage1Bg: null as HTMLImageElement | null,
  stage2CanalBg: null as HTMLImageElement | null,
  stage2ToxicBg: null as HTMLImageElement | null,
  stage3CoreBg: null as HTMLImageElement | null,
  loaded: false,
};

/**
 * Initializes external images or prepares procedural pixel atlas fallbacks
 */
export function initGameAssets(onReady?: () => void) {
  // Can load custom sprite sheet URLs or assets if supplied
  const loadImg = (src: string, onLoad: (img: HTMLImageElement) => void) => {
    const img = new Image();
    img.src = src;
    img.onload = () => onLoad(img);
    img.onerror = () => {
      // Fallback gracefully to procedural pixel renderer
    };
  };

  // Attempt to load provided background assets if available
  loadImg('/assets/ref_stage1_city.png', (img) => { AssetImages.stage1Bg = img; });
  loadImg('/assets/ref_part2_mechanics.png', (img) => { AssetImages.stage2CanalBg = img; });
  loadImg('/assets/ref_stage3_boss.png', (img) => { AssetImages.stage3CoreBg = img; });

  AssetImages.loaded = true;
  if (onReady) onReady();
}

/**
 * Ensures strict pixelated rendering on any 2D canvas context
 */
export function enablePixelatedRendering(ctx: CanvasRenderingContext2D) {
  ctx.imageSmoothingEnabled = false;
  // Vendor prefixes for legacy compatibility
  const ctxAny = ctx as unknown as Record<string, boolean>;
  ctxAny.webkitImageSmoothingEnabled = false;
  ctxAny.mozImageSmoothingEnabled = false;
  ctxAny.msImageSmoothingEnabled = false;
}

/**
 * Draws a glowing neon rect or outline with shadowBlur & shadowColor
 */
export function drawNeonGlowBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  blur = 18,
  fillAlpha = 0.85
) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = `rgba(15, 23, 42, ${fillAlpha})`;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

/**
 * Procedural Pixel Art Renderer for Cyborg Agent 01 (Nexus)
 * Renders authentic 16-bit pixel art frames matching CYBORG AGENT 01 SPRITE SHEET
 */
export function drawPixelPlayer(
  ctx: CanvasRenderingContext2D,
  p: {
    x: number;
    y: number;
    facing: 1 | -1;
    isDashing: boolean;
    isGrounded: boolean;
    isGrappling: boolean;
    isChargingFocus: boolean;
    vx: number;
  },
  time: number
) {
  enablePixelatedRendering(ctx);
  const px = Math.round(p.x);
  const py = Math.round(p.y);
  const isMoving = Math.abs(p.vx) > 20 && p.isGrounded;
  const runFrame = Math.floor(time * 12) % 8;

  ctx.save();

  // Face left or right
  if (p.facing < 0) {
    ctx.translate(px + 32, py);
    ctx.scale(-1, 1);
    ctx.translate(-px, -py);
  }

  if (p.isDashing) {
    // ==========================================
    // SLIDE DASH (4-Frame Low Ground Slide + Jet Exhaust)
    // ==========================================
    // 1. Blue speed ghost afterimages
    for (let g = 1; g <= 3; g++) {
      ctx.fillStyle = g === 1 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(249, 115, 22, 0.2)';
      ctx.fillRect(px - g * 12, py + 22, 26, 16);
    }

    // 2. Micro-jet exhaust flame & sparks (Yellow/Orange & Cyan Trails)
    ctx.save();
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - 14, py + 26, 8, 4);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(px - 22, py + 25, 10, 6);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(px - 32, py + 26, 12, 4);
    ctx.restore();

    // 3. Sliding low body: Legs stretched out
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 12, py + 28, 18, 6);
    ctx.fillRect(px - 4, py + 28, 14, 6);
    // Orange boot guards
    ctx.fillStyle = '#f97316';
    ctx.fillRect(px + 24, py + 27, 6, 8);
    ctx.fillRect(px - 4, py + 27, 6, 8);

    // 4. Low torso & cyber armor
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px + 4, py + 18, 22, 12);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(px + 8, py + 20, 14, 8);

    // 5. Head & Streamlined hair flowing backwards
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(px + 18, py + 12, 8, 8);
    // Flowing hair trail
    ctx.fillRect(px + 4, py + 10, 14, 6);
    ctx.fillRect(px - 10, py + 12, 14, 4);

    // 6. Glowing cyan visor HUD
    ctx.save();
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(px + 22, py + 14, 6, 3);
    ctx.restore();

    // 7. Laser Rifle pointing forward low
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 18, py + 22, 22, 5);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(px + 36, py + 23, 4, 3);
  } else if (p.isGrappling) {
    // ==========================================
    // GRAPPLE HOOK SWING (Hands Up, Bent Knees, Flowing Hair)
    // ==========================================
    const tilt = Math.max(-0.35, Math.min(0.35, p.vx * 0.0015));
    ctx.translate(px + 16, py + 22);
    ctx.rotate(tilt);
    ctx.translate(-(px + 16), -(py + 22));

    // Hands reaching up to grapple line
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 12, py, 6, 14);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(px + 11, py, 8, 4);

    // Head & flowing cyan ponytail
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(px + 10, py + 6, 10, 10);
    // Hair blown by wind
    ctx.fillRect(px - 6, py + 4, 16, 6);
    ctx.fillRect(px - 14, py + 8, 10, 8);

    // Visor
    ctx.save();
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(px + 16, py + 9, 6, 3);
    ctx.restore();

    // Torso
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px + 8, py + 16, 16, 15);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(px + 10, py + 18, 12, 10);

    // Bent knees tucked in swing
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 4, py + 30, 12, 8);
    ctx.fillRect(px + 14, py + 32, 12, 8);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(px + 12, py + 30, 4, 6);
    ctx.fillRect(px + 22, py + 33, 4, 6);
  } else {
    // ==========================================
    // IDLE / RUN / JUMP / SHOOTING (8-Gait Run Cycle)
    // ==========================================
    // Micro-jet thruster on boots when jumping
    if (!p.isGrounded) {
      ctx.save();
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(px + 8, py + 44, 4, 8 + Math.random() * 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + 9, py + 44, 2, 4);
      ctx.restore();
    }

    // Legs: 8-frame stride
    const legOffset1 = isMoving ? Math.sin(runFrame * 0.785) * 8 : !p.isGrounded ? 4 : 0;
    const legOffset2 = isMoving ? -Math.sin(runFrame * 0.785) * 8 : !p.isGrounded ? -4 : 0;

    // Left & Right Leg
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 6 + legOffset1, py + 28, 6, 18);
    ctx.fillRect(px + 16 + legOffset2, py + 28, 6, 18);
    // Orange armor boots & knees
    ctx.fillStyle = '#f97316';
    ctx.fillRect(px + 5 + legOffset1, py + 32, 8, 6);
    ctx.fillRect(px + 15 + legOffset2, py + 32, 8, 6);
    ctx.fillRect(px + 6 + legOffset1, py + 42, 8, 4);
    ctx.fillRect(px + 16 + legOffset2, py + 42, 8, 4);

    // Torso (Orange & Black tactical armor)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px + 6, py + 14, 18, 15);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(px + 9, py + 16, 12, 10);
    // Cyber belt & holster
    ctx.fillStyle = '#334155';
    ctx.fillRect(px + 5, py + 26, 20, 3);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(px + 4, py + 24, 4, 6); // Grapple holster

    // Head & Cyan Ponytail
    ctx.fillStyle = '#fed7aa'; // Face skin
    ctx.fillRect(px + 12, py + 6, 9, 8);
    ctx.fillStyle = '#06b6d4'; // Cyan hair
    ctx.fillRect(px + 8, py + 3, 13, 5);

    // Flowing ponytail behind
    const hairBob = isMoving ? Math.sin(runFrame) * 3 : 0;
    ctx.fillRect(px - 4 + hairBob, py + 4, 14, 5);
    ctx.fillRect(px - 10 + hairBob, py + 8, 8, 12);
    ctx.fillRect(px - 6 + hairBob, py + 18, 5, 8);

    // Glowing HUD Visor
    ctx.save();
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(px + 14, py + 7, 8, 4);
    ctx.restore();

    // Laser Rifle
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 14, py + 17, 24, 7);
    ctx.fillStyle = '#475569';
    ctx.fillRect(px + 18, py + 15, 12, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(px + 34, py + 18, 4, 5);

    // Charging glow on focused fire
    if (p.isChargingFocus) {
      ctx.save();
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(px + 40, py + 20, 6 + Math.random() * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.restore();
}

/**
 * Procedural Pixel Art Renderer for Robo-Trooper (Standard & Elite)
 * Matching ROBO-TROOPER UNIT SPRITE SHEET
 */
export function drawPixelRoboTrooper(
  ctx: CanvasRenderingContext2D,
  e: { x: number; y: number; facing: 1 | -1; hp: number; isElite?: boolean },
  time: number
) {
  enablePixelatedRendering(ctx);
  const ex = Math.round(e.x);
  const ey = Math.round(e.y);
  const isElite = Boolean(e.isElite);
  const walkPhase = Math.floor(time * 8) % 4;

  ctx.save();
  if (e.facing > 0) {
    ctx.translate(ex + 32, ey);
    ctx.scale(-1, 1);
    ctx.translate(-ex, -ey);
  }

  // Legs with walking cycle
  const legOffset1 = Math.sin(walkPhase * 1.57) * 4;
  const legOffset2 = -Math.sin(walkPhase * 1.57) * 4;

  ctx.fillStyle = isElite ? '#7c2d12' : '#334155';
  ctx.fillRect(ex + 6 + legOffset1, ey + 26, 7, 22);
  ctx.fillRect(ex + 18 + legOffset2, ey + 26, 7, 22);

  // Heavy knee & boot plating
  ctx.fillStyle = isElite ? '#d97706' : '#64748b';
  ctx.fillRect(ex + 5 + legOffset1, ey + 32, 9, 8);
  ctx.fillRect(ex + 17 + legOffset2, ey + 32, 9, 8);

  // Armored Torso Chassis
  ctx.fillStyle = isElite ? '#9a3412' : '#1e293b';
  ctx.fillRect(ex + 4, ey + 10, 22, 17);
  ctx.fillStyle = isElite ? '#ea580c' : '#475569';
  ctx.fillRect(ex + 7, ey + 12, 16, 12);

  // Head & Robot Optics
  ctx.fillStyle = isElite ? '#451a03' : '#0f172a';
  ctx.fillRect(ex + 8, ey, 14, 11);
  // Visor eye
  ctx.save();
  const eyeColor = isElite ? '#f97316' : '#06b6d4';
  ctx.shadowColor = eyeColor;
  ctx.shadowBlur = 8;
  ctx.fillStyle = eyeColor;
  ctx.fillRect(ex + 6, ey + 3, 5, 4);
  ctx.restore();

  // Robot Unit Laser Rifle
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(ex - 8, ey + 16, 26, 6);
  ctx.fillStyle = isElite ? '#f97316' : '#38bdf8';
  ctx.fillRect(ex - 12, ey + 17, 5, 4);

  ctx.restore();
}

/**
 * Procedural Pixel Art Renderer for Sentinel Vanguard Mech
 * Matching SENTINEL VANGUARD MECH SPRITE SHEET (Walk, Fire, Exposed Core)
 */
export function drawPixelVanguardMech(
  ctx: CanvasRenderingContext2D,
  mech: {
    x: number;
    y: number;
    hp: number;
    maxHp: number;
    exposedCore?: boolean;
  },
  time: number
) {
  enablePixelatedRendering(ctx);
  const mx = Math.round(mech.x);
  const my = Math.round(mech.y);
  const walkStride = Math.sin(time * 4) * 6;

  ctx.save();

  // Bipedal Heavy Legs
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(mx + 20 + walkStride, my + 118, 28, 66);
  ctx.fillRect(mx + 85 - walkStride, my + 118, 28, 66);

  // Hydraulic Knee Joint Plates
  ctx.fillStyle = '#475569';
  ctx.fillRect(mx + 16 + walkStride, my + 144, 36, 14);
  ctx.fillRect(mx + 81 - walkStride, my + 144, 36, 14);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(mx + 12 + walkStride, my + 174, 44, 12);
  ctx.fillRect(mx + 77 - walkStride, my + 174, 44, 12);

  // Heavy Chassis Torso
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(mx + 8, my + 38, 116, 84);
  ctx.fillStyle = '#334155';
  ctx.fillRect(mx + 14, my + 44, 104, 72);

  // Cockpit Head & Red Sensor Visor
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(mx + 42, my + 10, 44, 30);
  ctx.save();
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(mx + 46, my + 20, 36, 8);
  ctx.restore();

  // Left Shoulder Pod: Missile Launcher (6 tubes)
  ctx.fillStyle = '#475569';
  ctx.fillRect(mx + 88, my - 8, 44, 46);
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(mx + 88, my - 8, 44, 46);
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(mx + 93 + c * 11, my + 2 + r * 16, 8, 10);
    }
  }

  // Right Arm: Dual Rotary Gatling Laser
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(mx - 24, my + 84, 44, 26);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(mx - 54, my + 88, 30, 8);
  ctx.fillRect(mx - 54, my + 100, 30, 8);

  // CHEST WEAK POINT EXPOSURE (Image 1, 4 & Mech Sprite Sheet)
  if (mech.exposedCore) {
    // Open chest doors
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(mx + 16, my + 50, 16, 48);
    ctx.fillRect(mx + 74, my + 50, 16, 48);

    // Glowing exposed energy core
    ctx.save();
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(mx + 53, my + 74, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(mx + 53, my + 74, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Floating text label: MAIN CORE EXPOSED
    ctx.save();
    ctx.font = 'bold 8px "Press Start 2P", monospace';
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
    ctx.textAlign = 'center';
    ctx.fillText('MAIN CORE EXPOSED', mx + 53, my + 44);
    ctx.restore();
  } else {
    // Armored chest plate
    ctx.fillStyle = '#475569';
    ctx.fillRect(mx + 28, my + 52, 50, 48);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(mx + 28, my + 52, 50, 48);
  }

  ctx.restore();
}

/**
 * Draws the Retro Arcade HUD matching Image 8:
 * - HEALTH [III] bar with segmented pips
 * - SCORE 0014275
 * - TIME 04:12
 * - STAGE 1-3
 * - HEAT GAUGE with dynamic warning
 * - CREDITS: 4, PRESS START, LEVEL UP!
 */
export function drawRetroArcadeHUD(
  ctx: CanvasRenderingContext2D,
  hud: {
    hp: number;
    maxHp: number;
    score: number;
    timeSeconds: number;
    stageName: string;
    heat: number;
    maxHeat: number;
    isOverheated: boolean;
    lives: number;
  },
  width: number,
  height: number
) {
  enablePixelatedRendering(ctx);
  ctx.save();

  // Top Dark Bar Background with Neon Border
  ctx.fillStyle = 'rgba(6, 11, 25, 0.9)';
  ctx.fillRect(0, 0, width, 58);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 58);
  ctx.lineTo(width, 58);
  ctx.stroke();

  // 1. HEALTH [III]
  ctx.font = 'bold 12px "Press Start 2P", monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 10;
  ctx.textAlign = 'left';
  ctx.fillText('HEALTH [III]', 20, 24);
  ctx.shadowBlur = 0;

  // Segmented Health Bar
  const hpWidth = 145;
  ctx.fillStyle = '#090d16';
  ctx.fillRect(20, 32, hpWidth, 14);
  const hpRatio = Math.max(0, hud.hp / hud.maxHp);
  const fillGrad = ctx.createLinearGradient(20, 32, 20 + hpWidth, 32);
  fillGrad.addColorStop(0, '#f97316');
  fillGrad.addColorStop(0.5, '#06b6d4');
  fillGrad.addColorStop(1, '#00f0ff');
  ctx.fillStyle = hud.hp > 25 ? fillGrad : '#ef4444';
  ctx.fillRect(22, 34, (hpWidth - 4) * hpRatio, 10);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(20, 32, hpWidth, 14);

  // 2. SCORE
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#0284c7';
  ctx.shadowBlur = 8;
  ctx.fillText('SCORE', 340, 22);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(String(hud.score).padStart(7, '0'), 340, 44);

  // 3. TIME
  const mins = Math.floor(hud.timeSeconds / 60);
  const secs = Math.floor(hud.timeSeconds % 60);
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  ctx.fillStyle = '#facc15';
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 8;
  ctx.fillText('TIME', 500, 22);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(timeStr, 500, 44);

  // 4. STAGE TITLE
  ctx.textAlign = 'right';
  ctx.fillStyle = '#00f0ff';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 8;
  ctx.fillText(hud.stageName, width - 20, 22);
  ctx.shadowBlur = 0;

  // 5. HEAT GAUGE THERMOMETER
  const heatWidth = 110;
  const heatX = width - heatWidth - 20;
  ctx.font = 'bold 9px "Press Start 2P", monospace';
  ctx.fillStyle = hud.isOverheated ? '#ef4444' : '#f59e0b';
  ctx.fillText(hud.isOverheated ? 'OVERHEAT!' : 'HEAT GAUGE', width - 20, 36);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(heatX, 40, heatWidth, 9);
  const heatRatio = Math.min(1, hud.heat / hud.maxHeat);
  ctx.fillStyle = hud.isOverheated ? '#ef4444' : heatRatio > 0.75 ? '#f97316' : '#facc15';
  ctx.fillRect(heatX, 40, heatWidth * heatRatio, 9);
  ctx.strokeStyle = hud.isOverheated ? '#ef4444' : '#64748b';
  ctx.strokeRect(heatX, 40, heatWidth, 9);

  // 6. BOTTOM MARQUEE: CREDITS: 4 · PRESS START · LEVEL UP!
  ctx.font = '10px "Press Start 2P", monospace';
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'left';
  ctx.fillText('CREDITS: 4', 20, height - 16);

  ctx.textAlign = 'center';
  ctx.fillStyle = Math.floor(Date.now() / 400) % 2 === 0 ? '#ffffff' : '#64748b';
  ctx.fillText('PRESS START', width / 2, height - 16);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#facc15';
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 8;
  ctx.fillText('LEVEL UP!', width - 20, height - 16);

  ctx.restore();
}
