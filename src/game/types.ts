export interface GameConfig {
  playerSpeed: number;
  jumpForce: number;
  dashPower: number;
  laserDamage: number;
  focusDamage: number;
  heatMax: number;
  heatCoolRate: number;
  grappleMaxDist: number;
  bossHp: number;
  droneSpawnInterval: number;
  soundEnabled: boolean;
  difficulty: 'normal' | 'easy' | 'hardcore';
}

export interface PlayerEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  heat: number;
  maxHeat: number;
  isOverheated: boolean;
  facing: 1 | -1;
  aimAngle: number;
  isGrounded: boolean;
  isDashing: boolean;
  dashTimer: number;
  isGrappling: boolean;
  grappleAnchor: { x: number; y: number } | null;
  ropeLength: number;
  isChargingFocus: boolean;
  focusChargeTime: number;
  invulnerableTimer: number;
  score: number;
  lives: number;
}

export interface BulletEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  type: 'player_laser' | 'player_focus' | 'enemy_laser' | 'boss_laser' | 'boss_missile' | 'sniper_beam';
  radius: number;
  fromPlayer: boolean;
  life: number;
  targetX?: number;
  targetY?: number;
}

export interface EnemyEntity {
  id: number;
  type: 'robo_trooper' | 'robo_elite' | 'explosive_drone' | 'sniper_drone' | 'signal_relay' | 'vanguard_mech';
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  facing: 1 | -1;
  shootCooldown: number;
  patrolMinX: number;
  patrolMaxX: number;
  stateTimer: number;
  laserAimTimer?: number;
  targetLocked?: boolean;
  phase?: number;
  exposedCore?: boolean;
  exposedCoreTimer?: number;
  missileTimer?: number;
}

export interface PlatformEntity {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isCrumbling?: boolean;
  crumbleTimer?: number;
  isDestroyed?: boolean;
  isMoving?: boolean;
  moveRange?: number;
  moveSpeed?: number;
  startX?: number;
}

export interface GrappleRail {
  x1: number;
  y: number;
  x2: number;
}

export interface ParticleEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  alpha: number;
}
