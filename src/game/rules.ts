/**
 * Pure game logic and mathematical rules for Cyber Assault 2142
 * Decoupled from rendering so it can be verified with node:test.
 */

export interface PlayerStats {
  hp: number;
  maxHp: number;
  heat: number;
  maxHeat: number;
  isOverheated: boolean;
  score: number;
  lives: number;
  stage: number;
}

export interface WeaponFireResult {
  canFire: boolean;
  heatGenerated: number;
  isOverheated: boolean;
  damage: number;
  beamType: 'standard' | 'focused';
}

/**
 * Calculates weapon firing outcome given current heat and trigger mode.
 */
export function calculateFiringOutcome(
  currentHeat: number,
  maxHeat: number,
  isOverheated: boolean,
  isFocused: boolean
): WeaponFireResult {
  if (isOverheated) {
    return {
      canFire: false,
      heatGenerated: 0,
      isOverheated: true,
      damage: 0,
      beamType: isFocused ? 'focused' : 'standard',
    };
  }

  if (isFocused) {
    const newHeat = currentHeat + 14;
    const overheated = newHeat >= maxHeat;
    return {
      canFire: true,
      heatGenerated: 14,
      isOverheated: overheated,
      damage: 28, // High damage focused beam
      beamType: 'focused',
    };
  }

  // Standard laser generates minimal heat (cools faster than it heats)
  const newHeat = Math.min(maxHeat, currentHeat + 1.5);
  const overheated = newHeat >= maxHeat;
  return {
    canFire: true,
    heatGenerated: 1.5,
    isOverheated: overheated,
    damage: 8,
    beamType: 'standard',
  };
}

/**
 * Cools down the heat gauge over time dt (in seconds).
 */
export function updateHeatGauge(
  currentHeat: number,
  maxHeat: number,
  isOverheated: boolean,
  coolingRate: number,
  dt: number
): { heat: number; isOverheated: boolean } {
  let heat = currentHeat - coolingRate * dt;
  if (heat <= 0) {
    heat = 0;
    return { heat, isOverheated: false };
  }
  // If overheated, it stays overheated until heat drops below 15%
  if (isOverheated) {
    const recoveryThreshold = maxHeat * 0.15;
    if (heat <= recoveryThreshold) {
      return { heat, isOverheated: false };
    }
    return { heat, isOverheated: true };
  }
  return { heat, isOverheated: false };
}

/**
 * Calculates damage dealt to the Sentinel Vanguard Mech.
 * Hitting exposed core deals 3x critical damage!
 */
export function calculateBossDamage(
  damage: number,
  hitExposedCore: boolean,
  shieldActive: boolean
): { effectiveDamage: number; isCrit: boolean } {
  if (shieldActive && !hitExposedCore) {
    // Heavy armor absorbs 60% of damage
    return { effectiveDamage: Math.max(1, Math.round(damage * 0.4)), isCrit: false };
  }
  if (hitExposedCore) {
    // Critical hit on exposed core
    return { effectiveDamage: Math.round(damage * 3.0), isCrit: true };
  }
  return { effectiveDamage: damage, isCrit: false };
}

/**
 * Grapple anchor pendulum swing calculation
 */
export function calculateGrappleSwing(
  playerPos: { x: number; y: number },
  anchorPos: { x: number; y: number },
  velocity: { vx: number; vy: number },
  ropeLength: number,
  dt: number
): { x: number; y: number; vx: number; vy: number; tension: number } {
  // Candidate next position
  const candX = playerPos.x + velocity.vx * dt;
  const candY = playerPos.y + (velocity.vy + 850 * dt) * dt;

  const dx = candX - anchorPos.x;
  const dy = candY - anchorPos.y;
  const dist = Math.hypot(dx, dy);

  if (dist <= ropeLength) {
    return {
      x: candX,
      y: candY,
      vx: velocity.vx,
      vy: velocity.vy + 850 * dt,
      tension: 0,
    };
  }

  // Constrain to circle circumference
  const angle = Math.atan2(dy, dx);
  const constrainedX = anchorPos.x + Math.cos(angle) * ropeLength;
  const constrainedY = anchorPos.y + Math.sin(angle) * ropeLength;

  // Tangent vector
  const tangentX = -Math.sin(angle);
  const tangentY = Math.cos(angle);

  // Project velocity onto tangent
  const tangentialSpeed = (velocity.vx * tangentX + (velocity.vy + 850 * dt) * tangentY) * 0.998;

  return {
    x: constrainedX,
    y: constrainedY,
    vx: tangentX * tangentialSpeed,
    vy: tangentY * tangentialSpeed,
    tension: dist - ropeLength,
  };
}

/**
 * Stage progression definition
 */
export const STAGES_CONFIG = [
  {
    id: 1,
    title: 'Stage 1: Penyusupan Menara Sinyal',
    sub: 'Signal Tower Infiltration',
    objective: 'Habisi Robo-Trooper & Drone, hancurkan Pemancar Sinyal!',
    bossName: 'Pemancar Sinyal Relay MK.I',
    bossHp: 300,
  },
  {
    id: 2,
    title: 'Stage 2: Pengejaran di Jalur Melayang',
    sub: 'Skyway Maglev Pursuit',
    objective: 'Lompati platform bergerak, hindari laser, dan kalahkan Drone Cepat!',
    bossName: 'Konvoi Sinyal Sentral',
    bossHp: 500,
  },
  {
    id: 3,
    title: 'Stage 3: Pertahanan Stasiun Inti',
    sub: 'Core Station Vanguard Confrontation',
    objective: 'Hadapi SENTINEL VANGUARD MECH, hindari rudal & tembak panel dada!',
    bossName: 'SENTINEL VANGUARD MECH',
    bossHp: 1200,
  },
];
