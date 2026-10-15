import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameConfig, PlayerEntity, BulletEntity, EnemyEntity, PlatformEntity, GrappleRail, ParticleEntity } from './types.ts';
import { audioFX } from './audio.ts';
import { calculateFiringOutcome, updateHeatGauge, calculateBossDamage, calculateGrappleSwing } from './rules.ts';
import { Play, RotateCcw, Volume2, VolumeX, Shield, Zap, Crosshair, Award } from 'lucide-react';

interface GameCanvasProps {
  config: GameConfig;
  initialStage?: number;
  onStatsUpdate?: (score: number, stage: number, lives: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ config, initialStage = 1, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'title' | 'playing' | 'paused' | 'victory' | 'gameover'>('title');
  const [currentStage, setCurrentStage] = useState<number>(initialStage);
  const [soundMuted, setSoundMuted] = useState<boolean>(!config.soundEnabled);
  const [activeScore, setActiveScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('cyber_assault_high') || '14275', 10);
    } catch {
      return 14275;
    }
  });

  // Keep references for animation frame loop to avoid re-renders tearing down canvas
  const configRef = useRef(config);
  configRef.current = config;

  const stateRef = useRef({
    gameState: 'title' as 'title' | 'playing' | 'paused' | 'victory' | 'gameover',
    stage: initialStage,
    score: 0,
    timeElapsed: 0,
    keys: new Set<string>(),
    mouse: { x: 0, y: 0, down: false, rightDown: false },
    screenShake: 0,
    flashColor: '',
    flashAlpha: 0,
  });

  // Entities state
  const playerRef = useRef<PlayerEntity>({
    x: 120,
    y: 380,
    vx: 0,
    vy: 0,
    width: 32,
    height: 48,
    hp: 100,
    maxHp: 100,
    heat: 0,
    maxHeat: config.heatMax,
    isOverheated: false,
    facing: 1,
    aimAngle: 0,
    isGrounded: false,
    isDashing: false,
    dashTimer: 0,
    isGrappling: false,
    grappleAnchor: null,
    ropeLength: 0,
    isChargingFocus: false,
    focusChargeTime: 0,
    invulnerableTimer: 0,
    score: 0,
    lives: 3,
  });

  const bulletsRef = useRef<BulletEntity[]>([]);
  const enemiesRef = useRef<EnemyEntity[]>([]);
  const platformsRef = useRef<PlatformEntity[]>([]);
  const railsRef = useRef<GrappleRail[]>([]);
  const particlesRef = useRef<ParticleEntity[]>([]);
  const nextBulletId = useRef(1);
  const nextEnemyId = useRef(1);

  // Background hovercars & rain particles
  const hovercarsRef = useRef<{ x: number; y: number; speed: number; color: string }[]>([
    { x: 100, y: 120, speed: 1.2, color: '#ec4899' },
    { x: 450, y: 160, speed: 1.8, color: '#06b6d4' },
    { x: 700, y: 90, speed: 1.0, color: '#f59e0b' },
  ]);

  const rainRef = useRef<{ x: number; y: number; length: number; speed: number }[]>([]);

  // Init Rain
  useEffect(() => {
    const drops = [];
    for (let i = 0; i < 90; i++) {
      drops.push({
        x: Math.random() * 900,
        y: Math.random() * 600,
        length: 12 + Math.random() * 16,
        speed: 18 + Math.random() * 10,
      });
    }
    rainRef.current = drops;
  }, []);

  // Build Level Scene Geometry & Enemies based on Stage
  const buildStage = useCallback((stageNum: number) => {
    stateRef.current.stage = stageNum;
    setCurrentStage(stageNum);
    bulletsRef.current = [];
    particlesRef.current = [];

    const p = playerRef.current;
    p.x = 90;
    p.y = 350;
    p.vx = 0;
    p.vy = 0;
    p.isGrappling = false;
    p.grappleAnchor = null;
    p.isOverheated = false;
    p.heat = 0;
    p.hp = 100;

    // Default Overhead Grapple Rails
    railsRef.current = [
      { x1: 60, y: 110, x2: 840 },
      { x1: 220, y: 190, x2: 680 },
    ];

    if (stageNum === 1) {
      // Stage 1: Outskirts Signal Tower
      platformsRef.current = [
        { id: 1, x: 0, y: 460, width: 340, height: 40 }, // Starting platform
        { id: 2, x: 380, y: 420, width: 220, height: 35, isCrumbling: false }, // Mid platform
        { id: 3, x: 640, y: 460, width: 260, height: 40 }, // Boss platform
        { id: 4, x: 260, y: 280, width: 140, height: 25 }, // Elevated platform
        { id: 5, x: 480, y: 240, width: 150, height: 25 },
      ];

      enemiesRef.current = [
        {
          id: nextEnemyId.current++,
          type: 'robo_trooper',
          x: 440,
          y: 380,
          vx: -40,
          vy: 0,
          width: 32,
          height: 48,
          hp: 40,
          maxHp: 40,
          facing: -1,
          shootCooldown: 2.0,
          patrolMinX: 390,
          patrolMaxX: 580,
          stateTimer: 0,
        },
        {
          id: nextEnemyId.current++,
          type: 'robo_elite',
          x: 720,
          y: 420,
          vx: -35,
          vy: 0,
          width: 34,
          height: 50,
          hp: 80,
          maxHp: 80,
          facing: -1,
          shootCooldown: 2.2,
          patrolMinX: 660,
          patrolMaxX: 860,
          stateTimer: 0,
        },
        {
          id: nextEnemyId.current++,
          type: 'explosive_drone',
          x: 520,
          y: 170,
          vx: 60,
          vy: 0,
          width: 36,
          height: 24,
          hp: 25,
          maxHp: 25,
          facing: -1,
          shootCooldown: 3,
          patrolMinX: 350,
          patrolMaxX: 700,
          stateTimer: 0,
        },
        // Stage 1 Objective Boss: Signal Relay
        {
          id: nextEnemyId.current++,
          type: 'signal_relay',
          x: 780,
          y: 360,
          vx: 0,
          vy: 0,
          width: 60,
          height: 100,
          hp: 300,
          maxHp: 300,
          facing: -1,
          shootCooldown: 3.5,
          patrolMinX: 780,
          patrolMaxX: 780,
          stateTimer: 0,
        },
      ];
    } else if (stageNum === 2) {
      // Stage 2: Skyway Maglev Pursuit (Moving platforms & laser hazards)
      platformsRef.current = [
        { id: 1, x: 0, y: 460, width: 220, height: 40 },
        { id: 2, x: 260, y: 420, width: 140, height: 25, isMoving: true, startX: 260, moveRange: 120, moveSpeed: 45 },
        { id: 3, x: 460, y: 360, width: 150, height: 25, isCrumbling: true, crumbleTimer: 0 },
        { id: 4, x: 660, y: 420, width: 140, height: 25, isMoving: true, startX: 660, moveRange: 100, moveSpeed: -50 },
        { id: 5, x: 780, y: 460, width: 120, height: 40 },
        { id: 6, x: 340, y: 220, width: 160, height: 20 },
      ];

      enemiesRef.current = [
        {
          id: nextEnemyId.current++,
          type: 'explosive_drone',
          x: 320,
          y: 150,
          vx: 90,
          vy: 0,
          width: 36,
          height: 24,
          hp: 30,
          maxHp: 30,
          facing: -1,
          shootCooldown: 2.2,
          patrolMinX: 200,
          patrolMaxX: 650,
          stateTimer: 0,
        },
        {
          id: nextEnemyId.current++,
          type: 'sniper_drone',
          x: 780,
          y: 160,
          vx: 0,
          vy: 0,
          width: 40,
          height: 30,
          hp: 45,
          maxHp: 45,
          facing: -1,
          shootCooldown: 2.5,
          laserAimTimer: 1.5,
          patrolMinX: 780,
          patrolMaxX: 780,
          stateTimer: 0,
        },
        {
          id: nextEnemyId.current++,
          type: 'robo_elite',
          x: 790,
          y: 420,
          vx: 0,
          vy: 0,
          width: 34,
          height: 50,
          hp: 100,
          maxHp: 100,
          facing: -1,
          shootCooldown: 1.8,
          patrolMinX: 760,
          patrolMaxX: 860,
          stateTimer: 0,
        },
        {
          id: nextEnemyId.current++,
          type: 'signal_relay',
          x: 820,
          y: 370,
          vx: 0,
          vy: 0,
          width: 50,
          height: 90,
          hp: 450,
          maxHp: 450,
          facing: -1,
          shootCooldown: 2.8,
          patrolMinX: 820,
          patrolMaxX: 820,
          stateTimer: 0,
        },
      ];
    } else {
      // Stage 3: Core Station Vanguard Confrontation (Giant Boss Arena)
      platformsRef.current = [
        { id: 1, x: 0, y: 460, width: 320, height: 40 }, // Player start
        { id: 2, x: 350, y: 410, width: 160, height: 26, isCrumbling: true, crumbleTimer: 0 }, // Crumbling beam in middle
        { id: 3, x: 550, y: 460, width: 350, height: 40 }, // Boss platform
        { id: 4, x: 180, y: 280, width: 140, height: 24 }, // High platform
        { id: 5, x: 420, y: 230, width: 130, height: 24 }, // Grapple swing vantage
      ];

      enemiesRef.current = [
        {
          id: nextEnemyId.current++,
          type: 'vanguard_mech',
          x: 640,
          y: 270,
          vx: 0,
          vy: 0,
          width: 140,
          height: 190,
          hp: configRef.current.bossHp,
          maxHp: configRef.current.bossHp,
          facing: -1,
          shootCooldown: 1.8,
          patrolMinX: 580,
          patrolMaxX: 760,
          stateTimer: 0,
          phase: 1,
          exposedCore: false,
          exposedCoreTimer: 0,
          missileTimer: 3.5,
        },
        {
          id: nextEnemyId.current++,
          type: 'sniper_drone',
          x: 820,
          y: 130,
          vx: 0,
          vy: 0,
          width: 40,
          height: 30,
          hp: 50,
          maxHp: 50,
          facing: -1,
          shootCooldown: 3.5,
          laserAimTimer: 2.0,
          patrolMinX: 820,
          patrolMaxX: 820,
          stateTimer: 0,
        },
        {
          id: nextEnemyId.current++,
          type: 'robo_trooper',
          x: 740,
          y: 420,
          vx: -25,
          vy: 0,
          width: 32,
          height: 48,
          hp: 40,
          maxHp: 40,
          facing: -1,
          shootCooldown: 2.5,
          patrolMinX: 620,
          patrolMaxX: 820,
          stateTimer: 0,
        },
      ];
    }
  }, []);

  // Spawn visual particles
  const spawnParticles = useCallback((x: number, y: number, color: string, count: number, speedMult = 1) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (20 + Math.random() * 120) * speedMult;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.25 + Math.random() * 0.4,
        maxLife: 0.6,
        color,
        size: 2 + Math.random() * 3,
        alpha: 1,
      });
    }
  }, []);

  // Player action: Fire weapon
  const handleFire = useCallback((isFocusMode: boolean) => {
    const p = playerRef.current;
    if (stateRef.current.gameState !== 'playing') return;

    const outcome = calculateFiringOutcome(p.heat, p.maxHeat, p.isOverheated, isFocusMode);
    p.heat = Math.min(p.maxHeat, p.heat + outcome.heatGenerated);
    p.isOverheated = outcome.isOverheated;

    if (p.isOverheated) {
      audioFX.overheatWarning();
      spawnParticles(p.x + (p.facing > 0 ? 24 : -8), p.y + 12, '#ef4444', 8);
    }

    if (!outcome.canFire) return;

    const spawnX = p.facing > 0 ? p.x + 28 : p.x - 8;
    const spawnY = p.y + 16;
    const speed = isFocusMode ? 780 : 640;

    // Direct aiming angle or straight forward based on facing
    let angle = p.facing > 0 ? 0 : Math.PI;
    if (stateRef.current.keys.has('KeyW') || stateRef.current.keys.has('ArrowUp')) {
      if (stateRef.current.keys.has('KeyD') || stateRef.current.keys.has('ArrowRight')) {
        angle = -Math.PI / 4;
      } else if (stateRef.current.keys.has('KeyA') || stateRef.current.keys.has('ArrowLeft')) {
        angle = (-3 * Math.PI) / 4;
      } else {
        angle = -Math.PI / 2;
      }
    } else if (stateRef.current.keys.has('KeyS') || stateRef.current.keys.has('ArrowDown')) {
      if (!p.isGrounded) {
        angle = Math.PI / 2;
      }
    }

    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    bulletsRef.current.push({
      id: nextBulletId.current++,
      x: spawnX,
      y: spawnY,
      vx,
      vy,
      damage: outcome.damage,
      type: isFocusMode ? 'player_focus' : 'player_laser',
      radius: isFocusMode ? 8 : 4,
      fromPlayer: true,
      life: 1.2,
    });

    if (isFocusMode) {
      audioFX.focusedBeam();
      stateRef.current.screenShake = 4;
      spawnParticles(spawnX, spawnY, '#fbbf24', 12, 1.4);
    } else {
      audioFX.laser();
      spawnParticles(spawnX, spawnY, '#06b6d4', 4, 0.8);
    }
  }, [spawnParticles]);

  // Player action: Fire or release Grapple Hook
  const handleGrappleToggle = useCallback(() => {
    const p = playerRef.current;
    if (p.isGrappling) {
      // Release grapple with boost
      p.isGrappling = false;
      p.grappleAnchor = null;
      audioFX.grappleFire();
      p.vy = Math.min(p.vy, -280); // Upward leap boost
      spawnParticles(p.x, p.y, '#06b6d4', 8);
      return;
    }

    // Attempt to latch to nearest ceiling rail
    let bestAnchor: { x: number; y: number } | null = null;
    let minDist = configRef.current.grappleMaxDist;

    for (const rail of railsRef.current) {
      if (rail.y < p.y - 40) {
        // Clamp X to rail bounds
        const targetX = Math.max(rail.x1, Math.min(rail.x2, p.x + p.vx * 0.15));
        const dist = Math.hypot(targetX - p.x, rail.y - p.y);
        if (dist <= minDist) {
          minDist = dist;
          bestAnchor = { x: targetX, y: rail.y };
        }
      }
    }

    if (bestAnchor) {
      p.isGrappling = true;
      p.grappleAnchor = bestAnchor;
      p.ropeLength = minDist;
      audioFX.grappleLatch();
      spawnParticles(bestAnchor.x, bestAnchor.y, '#38bdf8', 12);
    }
  }, [spawnParticles]);

  // Player action: Slide Dash
  const handleDash = useCallback(() => {
    const p = playerRef.current;
    if (p.isDashing || p.dashTimer > 0) return;

    p.isDashing = true;
    p.dashTimer = 0.28;
    p.vx = p.facing * configRef.current.dashPower;
    audioFX.dashJet();
    stateRef.current.screenShake = 3;
    spawnParticles(p.x + (p.facing > 0 ? -12 : 24), p.y + 40, '#06b6d4', 14, 1.5);
  }, [spawnParticles]);

  // Restart / Start Game
  const handleStartGame = useCallback((stageNumber = 1) => {
    audioFX.setMuted(soundMuted);
    audioFX.startBGM();
    buildStage(stageNumber);
    stateRef.current.gameState = 'playing';
    stateRef.current.timeElapsed = 0;
    setGameState('playing');
    document.body.dataset.state = 'playing';
  }, [buildStage, soundMuted]);

  // Update Game Physics & Simulation Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const rawDt = (time - lastTime) / 1000;
      lastTime = time;
      const dt = Math.min(rawDt, 0.045); // Clamp dt for stability

      const p = playerRef.current;
      const keys = stateRef.current.keys;

      if (stateRef.current.gameState === 'playing') {
        stateRef.current.timeElapsed += dt;

        // 1. Cool down heat gauge
        const heatResult = updateHeatGauge(
          p.heat,
          p.maxHeat,
          p.isOverheated,
          configRef.current.heatCoolRate,
          dt
        );
        p.heat = heatResult.heat;
        p.isOverheated = heatResult.isOverheated;

        // 2. Dash Timer update
        if (p.dashTimer > 0) {
          p.dashTimer -= dt;
          if (p.dashTimer <= 0) p.isDashing = false;
        }

        // 3. Invulnerability flash timer
        if (p.invulnerableTimer > 0) {
          p.invulnerableTimer -= dt;
        }

        // 4. Movement handling
        if (!p.isGrappling) {
          // Horizontal input
          let moveDir = 0;
          if (keys.has('KeyA') || keys.has('ArrowLeft')) moveDir -= 1;
          if (keys.has('KeyD') || keys.has('ArrowRight')) moveDir += 1;

          if (moveDir !== 0) {
            p.facing = moveDir as 1 | -1;
            if (!p.isDashing) {
              p.vx = moveDir * configRef.current.playerSpeed;
            }
          } else if (!p.isDashing) {
            p.vx *= 0.8;
          }

          // Gravity
          p.vy += 980 * dt;

          // Jump
          if ((keys.has('KeyW') || keys.has('ArrowUp') || keys.has('Space')) && p.isGrounded) {
            p.vy = -configRef.current.jumpForce;
            p.isGrounded = false;
            audioFX.dashJet();
            spawnParticles(p.x + 12, p.y + 44, '#06b6d4', 6);
          }

          // Update position
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        } else if (p.grappleAnchor) {
          // Grapple Swing Physics
          // Pump momentum with A/D
          let swingPush = 0;
          if (keys.has('KeyA') || keys.has('ArrowLeft')) swingPush -= 380;
          if (keys.has('KeyD') || keys.has('ArrowRight')) swingPush += 380;

          p.vx += swingPush * dt;

          const swing = calculateGrappleSwing(
            { x: p.x, y: p.y },
            p.grappleAnchor,
            { vx: p.vx, vy: p.vy },
            p.ropeLength,
            dt
          );

          p.x = swing.x;
          p.y = swing.y;
          p.vx = swing.vx;
          p.vy = swing.vy;

          if (p.vx > 10) p.facing = 1;
          else if (p.vx < -10) p.facing = -1;

          // Swing particles
          if (Math.random() < 0.3) {
            spawnParticles(p.x + 16, p.y + 36, '#38bdf8', 1, 0.4);
          }
        }

        // 5. Screen boundary check
        if (p.x < 10) p.x = 10;
        if (p.x > 860) p.x = 860;

        // Pit fall check (Stage 2 & 3 chasms)
        if (p.y > 560) {
          p.hp = 0;
          audioFX.explosion('boss');
          stateRef.current.screenShake = 10;
        }

        // 6. Platform collisions
        p.isGrounded = false;
        for (const plat of platformsRef.current) {
          if (plat.isDestroyed) continue;

          // Moving platform update
          if (plat.isMoving && plat.startX !== undefined && plat.moveRange && plat.moveSpeed) {
            plat.x += plat.moveSpeed * dt;
            if (plat.x > plat.startX + plat.moveRange) {
              plat.x = plat.startX + plat.moveRange;
              plat.moveSpeed = -Math.abs(plat.moveSpeed);
            } else if (plat.x < plat.startX - plat.moveRange) {
              plat.x = plat.startX - plat.moveRange;
              plat.moveSpeed = Math.abs(plat.moveSpeed);
            }
          }

          // Check landing on top
          const footX = p.x + p.width / 2;
          const footY = p.y + p.height;
          if (
            footX >= plat.x &&
            footX <= plat.x + plat.width &&
            footY >= plat.y &&
            footY <= plat.y + 18 &&
            p.vy >= 0
          ) {
            p.y = plat.y - p.height;
            p.vy = 0;
            p.isGrounded = true;

            // Handle crumbling platforms
            if (plat.isCrumbling) {
              plat.crumbleTimer = (plat.crumbleTimer || 0) + dt;
              if (Math.random() < 0.2) {
                spawnParticles(footX, plat.y + 4, '#94a3b8', 2);
              }
              if (plat.crumbleTimer > 1.2) {
                plat.isDestroyed = true;
                audioFX.explosion('small');
                spawnParticles(plat.x + plat.width / 2, plat.y + 10, '#64748b', 18);
              }
            }
          }
        }

        // 7. Bullets update
        bulletsRef.current.forEach((b) => {
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          b.life -= dt;
        });
        bulletsRef.current = bulletsRef.current.filter((b) => b.life > 0 && b.x > -40 && b.x < 920 && b.y > -40 && b.y < 620);

        // 8. Enemy behavior & bullet collisions
        const activeEnemies = enemiesRef.current;
        for (let i = activeEnemies.length - 1; i >= 0; i--) {
          const e = activeEnemies[i];
          e.stateTimer += dt;
          e.shootCooldown -= dt;

          if (e.type === 'robo_trooper' || e.type === 'robo_elite') {
            // Patrol ground
            e.x += e.vx * dt;
            if (e.x < e.patrolMinX) {
              e.x = e.patrolMinX;
              e.vx = Math.abs(e.vx);
              e.facing = 1;
            } else if (e.x > e.patrolMaxX) {
              e.x = e.patrolMaxX;
              e.vx = -Math.abs(e.vx);
              e.facing = -1;
            }

            // Shoot at player when in line of sight
            if (e.shootCooldown <= 0 && Math.abs(e.y - p.y) < 100) {
              e.shootCooldown = e.type === 'robo_elite' ? 1.4 : 2.2;
              const dir = p.x < e.x ? -1 : 1;
              e.facing = dir;
              bulletsRef.current.push({
                id: nextBulletId.current++,
                x: e.x + (dir > 0 ? 28 : -8),
                y: e.y + 18,
                vx: dir * 320,
                vy: 0,
                damage: e.type === 'robo_elite' ? 15 : 10,
                type: 'enemy_laser',
                radius: 4,
                fromPlayer: false,
                life: 2.0,
              });
              audioFX.laser();
            }
          } else if (e.type === 'explosive_drone') {
            // Hover in sine pattern, swoop towards player
            e.x += e.vx * dt;
            if (e.x < e.patrolMinX || e.x > e.patrolMaxX) e.vx = -e.vx;
            e.y += Math.sin(e.stateTimer * 4) * 35 * dt;

            // Direct kamikaze dive if player is close
            const distToPlayer = Math.hypot(p.x - e.x, p.y - e.y);
            if (distToPlayer < 180) {
              e.x += (p.x - e.x) * 1.5 * dt;
              e.y += (p.y - e.y) * 1.5 * dt;
            }
          } else if (e.type === 'sniper_drone') {
            // Sniper Drone with telegraph laser
            if (e.laserAimTimer !== undefined) {
              e.laserAimTimer -= dt;
              if (e.laserAimTimer <= 0.4 && e.laserAimTimer > 0.35) {
                audioFX.sniperTelegraph();
              }
              if (e.laserAimTimer <= 0) {
                e.laserAimTimer = 2.4;
                // Fire instant high-speed sniper bolt
                const angle = Math.atan2(p.y + 20 - e.y, p.x + 16 - e.x);
                bulletsRef.current.push({
                  id: nextBulletId.current++,
                  x: e.x,
                  y: e.y + 14,
                  vx: Math.cos(angle) * 750,
                  vy: Math.sin(angle) * 750,
                  damage: 28,
                  type: 'sniper_beam',
                  radius: 5,
                  fromPlayer: false,
                  life: 1.5,
                });
                audioFX.laser();
                stateRef.current.screenShake = 3;
              }
            }
          } else if (e.type === 'vanguard_mech') {
            // GRAND BOSS: SENTINEL VANGUARD MECH
            // Alternates phases: Gatling sweeps, Missile Barrage, Exposed Chest Core!
            if (e.missileTimer !== undefined) {
              e.missileTimer -= dt;
              if (e.missileTimer <= 0) {
                e.missileTimer = 5.5;
                audioFX.missileLaunch();
                audioFX.bossAlert();
                stateRef.current.screenShake = 5;

                // Launch 4 homing/arcing fiery missiles
                for (let m = 0; m < 4; m++) {
                  const launchX = e.x + 30 + m * 15;
                  const launchY = e.y + 20;
                  bulletsRef.current.push({
                    id: nextBulletId.current++,
                    x: launchX,
                    y: launchY,
                    vx: -180 - m * 30,
                    vy: -240 + m * 40,
                    damage: 22,
                    type: 'boss_missile',
                    radius: 7,
                    fromPlayer: false,
                    life: 3.2,
                    targetX: p.x,
                    targetY: p.y,
                  });
                }
              }
            }

            // Dual Gatling laser firing
            if (e.shootCooldown <= 0) {
              e.shootCooldown = 0.35;
              bulletsRef.current.push({
                id: nextBulletId.current++,
                x: e.x - 20,
                y: e.y + 105,
                vx: -480,
                vy: (Math.random() - 0.5) * 60,
                damage: 12,
                type: 'boss_laser',
                radius: 5,
                fromPlayer: false,
                life: 1.8,
              });
              audioFX.laser();
            }

            // Expose chest core after every missile salvo!
            if (e.exposedCoreTimer !== undefined && e.exposedCore) {
              e.exposedCoreTimer -= dt;
              if (e.exposedCoreTimer <= 0) {
                e.exposedCore = false;
              }
            } else if (Math.sin(e.stateTimer * 0.8) > 0.6) {
              if (!e.exposedCore) {
                e.exposedCore = true;
                e.exposedCoreTimer = 3.5;
                audioFX.bossCoreExpose();
              }
            }
          }

          // Bullet collisions with enemy
          for (let bIdx = bulletsRef.current.length - 1; bIdx >= 0; bIdx--) {
            const b = bulletsRef.current[bIdx];
            if (!b.fromPlayer) continue;

            // Check hit
            if (
              b.x >= e.x &&
              b.x <= e.x + e.width &&
              b.y >= e.y &&
              b.y <= e.y + e.height
            ) {
              // Destroy bullet unless it's focused piercing beam
              if (b.type !== 'player_focus') {
                bulletsRef.current.splice(bIdx, 1);
              }

              let effectiveDmg = b.damage;
              let isCrit = false;

              if (e.type === 'vanguard_mech') {
                // Check if hit exposed core area (chest panel)
                const coreHit =
                  e.exposedCore &&
                  b.x >= e.x + 20 &&
                  b.x <= e.x + 75 &&
                  b.y >= e.y + 50 &&
                  b.y <= e.y + 110;

                const bossCalc = calculateBossDamage(b.damage, Boolean(coreHit), !coreHit);
                effectiveDmg = bossCalc.effectiveDamage;
                isCrit = bossCalc.isCrit;
              }

              e.hp -= effectiveDmg;
              audioFX.hit();

              if (isCrit) {
                stateRef.current.screenShake = 6;
                spawnParticles(b.x, b.y, '#f59e0b', 16, 1.8);
              } else {
                spawnParticles(b.x, b.y, '#06b6d4', 6);
              }

              // Enemy defeated check
              if (e.hp <= 0) {
                const isGrandBoss = e.type === 'vanguard_mech';
                audioFX.explosion(isGrandBoss ? 'boss' : 'medium');
                spawnParticles(e.x + e.width / 2, e.y + e.height / 2, '#f43f5e', isGrandBoss ? 45 : 18, 2);

                const pointValue = isGrandBoss ? 5000 : e.type === 'signal_relay' ? 1500 : 350;
                p.score += pointValue;
                setActiveScore(p.score);
                if (p.score > highScore) {
                  setHighScore(p.score);
                  try {
                    localStorage.setItem('cyber_assault_high', String(p.score));
                  } catch {}
                }

                // If Stage 1/2 Boss defeated -> Next stage
                if (e.type === 'signal_relay') {
                  setTimeout(() => {
                    if (stateRef.current.stage < 3) {
                      buildStage(stateRef.current.stage + 1);
                    }
                  }, 1200);
                } else if (isGrandBoss) {
                  // Final Stage Boss Defeated! Victory!
                  stateRef.current.gameState = 'victory';
                  setGameState('victory');
                  document.body.dataset.state = 'gameover';
                }

                activeEnemies.splice(i, 1);
                break;
              }
            }
          }
        }

        // 9. Enemy bullet collisions with Player
        for (let bIdx = bulletsRef.current.length - 1; bIdx >= 0; bIdx--) {
          const b = bulletsRef.current[bIdx];
          if (b.fromPlayer) continue;

          // Homing missile steering
          if (b.type === 'boss_missile' && b.targetX !== undefined) {
            b.vx += (p.x - b.x) * 0.8 * dt;
            b.vy += (p.y - b.y) * 0.8 * dt;
            if (Math.random() < 0.3) {
              spawnParticles(b.x, b.y, '#f97316', 1, 0.4);
            }
          }

          if (
            p.invulnerableTimer <= 0 &&
            b.x >= p.x &&
            b.x <= p.x + p.width &&
            b.y >= p.y &&
            b.y <= p.y + p.height
          ) {
            bulletsRef.current.splice(bIdx, 1);
            p.hp -= b.damage;
            p.invulnerableTimer = 0.8;
            audioFX.hit();
            stateRef.current.screenShake = 6;
            spawnParticles(p.x + 16, p.y + 24, '#ef4444', 14);

            if (p.hp <= 0) {
              p.lives--;
              audioFX.explosion('medium');
              if (p.lives <= 0) {
                stateRef.current.gameState = 'gameover';
                setGameState('gameover');
                document.body.dataset.state = 'gameover';
              } else {
                p.hp = 100;
                p.x = 90;
                p.y = 350;
                p.vx = 0;
                p.vy = 0;
                p.invulnerableTimer = 2.0;
              }
            }
          }
        }

        // 10. Update Particles
        particlesRef.current.forEach((part) => {
          part.x += part.vx * dt;
          part.y += part.vy * dt;
          part.life -= dt;
          part.alpha = Math.max(0, part.life / part.maxLife);
        });
        particlesRef.current = particlesRef.current.filter((pt) => pt.life > 0);

        // 11. Update hovercars
        hovercarsRef.current.forEach((hc) => {
          hc.x += hc.speed;
          if (hc.x > 940) hc.x = -60;
        });

        // 12. Update rain
        rainRef.current.forEach((drop) => {
          drop.y += drop.speed;
          drop.x -= 3;
          if (drop.y > 600) {
            drop.y = -20;
            drop.x = Math.random() * 920;
          }
        });

        // Decay screen shake
        if (stateRef.current.screenShake > 0) {
          stateRef.current.screenShake *= 0.85;
          if (stateRef.current.screenShake < 0.2) stateRef.current.screenShake = 0;
        }

        if (onStatsUpdate) {
          onStatsUpdate(p.score, stateRef.current.stage, p.lives);
        }
      }

      // RENDER STEP (Canvas2D Pixel-Perfect Rendering)
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderScene(ctx, canvas.width, canvas.height, p);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [buildStage, onStatsUpdate, spawnParticles]);

  // Render function: Cyberpunk 2142 retro pixel aesthetics
  const renderScene = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    p: PlayerEntity
  ) => {
    ctx.save();

    // Camera screen shake
    if (stateRef.current.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * stateRef.current.screenShake * 2;
      const shakeY = (Math.random() - 0.5) * stateRef.current.screenShake * 2;
      ctx.translate(shakeX, shakeY);
    }

    // 1. Cyber Sky & Night City Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#04060d');
    skyGrad.addColorStop(0.5, '#0b1120');
    skyGrad.addColorStop(1, '#1e1430');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Giant Cyber Moon
    ctx.save();
    ctx.fillStyle = '#6ee7b7';
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(680, 100, 68, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#a7f3d0';
    ctx.beginPath();
    ctx.arc(680, 100, 52, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Cyber Skyscraper Silhouettes (Background)
    ctx.fillStyle = '#0f172a';
    const buildings = [
      { x: 30, w: 90, h: 380 },
      { x: 130, w: 120, h: 460 },
      { x: 270, w: 100, h: 340 },
      { x: 390, w: 140, h: 420 },
      { x: 550, w: 110, h: 480 },
      { x: 680, w: 130, h: 410 },
      { x: 820, w: 90, h: 360 },
    ];
    buildings.forEach((b) => {
      ctx.fillRect(b.x, height - b.h, b.w, b.h);
      // Window lights
      ctx.fillStyle = '#1e293b';
      for (let wy = height - b.h + 20; wy < height - 60; wy += 25) {
        for (let wx = b.x + 10; wx < b.x + b.w - 15; wx += 18) {
          if (Math.sin(wx * 2 + wy) > 0.2) {
            ctx.fillStyle = Math.sin(wx + wy) > 0.7 ? '#06b6d4' : '#f43f5e';
            ctx.globalAlpha = 0.35;
            ctx.fillRect(wx, wy, 8, 12);
            ctx.globalAlpha = 1;
          }
        }
      }
      ctx.fillStyle = '#0f172a';
    });

    // 4. Hovercars with neon thrust trails
    hovercarsRef.current.forEach((hc) => {
      ctx.fillStyle = hc.color;
      ctx.fillRect(hc.x, hc.y, 28, 9);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(hc.x + 22, hc.y + 2, 6, 5);
      // Thruster tail
      const trailGrad = ctx.createLinearGradient(hc.x, hc.y + 4, hc.x - 30, hc.y + 4);
      trailGrad.addColorStop(0, hc.color);
      trailGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = trailGrad;
      ctx.fillRect(hc.x - 30, hc.y + 2, 30, 5);
    });

    // 5. Neon Billboard Signs (Matching user's reference screenshots!)
    // "CYBERCITY 2142", "ラーメン", "KEON 2142", "RAMKOREA", "TECHBAR", "NEON ARCADE"
    const drawNeonSign = (x: number, y: number, text: string, color: string, border: string) => {
      ctx.save();
      ctx.strokeStyle = border;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, 120, 36);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(x, y, 120, 36);
      ctx.font = 'bold 12px "Chakra Petch", sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(text, x + 60, y + 23);
      ctx.restore();
    };

    drawNeonSign(50, 160, 'CYBERCITY 2142', '#38bdf8', '#0284c7');
    drawNeonSign(200, 210, 'ラーメン (RAMEN)', '#f43f5e', '#e11d48');
    drawNeonSign(380, 140, 'KEON 2142', '#a855f7', '#9333ea');
    drawNeonSign(580, 200, 'RAMKOREA', '#ec4899', '#db2777');
    drawNeonSign(740, 150, 'NEON ARCADE', '#facc15', '#eab308');

    // 6. Overhead Grapple Rails
    railsRef.current.forEach((rail) => {
      ctx.fillStyle = '#334155';
      ctx.fillRect(rail.x1, rail.y - 6, rail.x2 - rail.x1, 10);
      ctx.fillStyle = '#06b6d4';
      // Glowing runner strip
      ctx.fillRect(rail.x1, rail.y - 1, rail.x2 - rail.x1, 3);
      // Rail brackets
      for (let rx = rail.x1; rx <= rail.x2; rx += 70) {
        ctx.fillStyle = '#475569';
        ctx.fillRect(rx, rail.y - 14, 8, 8);
      }
    });

    // 7. Platforms (Industrial girders with neon accents)
    platformsRef.current.forEach((plat) => {
      if (plat.isDestroyed) return;

      ctx.save();
      if (plat.isCrumbling && plat.crumbleTimer && plat.crumbleTimer > 0) {
        // Shake crumbling platform
        const shake = (Math.random() - 0.5) * 4;
        ctx.translate(shake, 0);
      }

      // Girder body
      ctx.fillStyle = plat.isCrumbling ? '#475569' : '#1e293b';
      ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

      // Metallic top rim
      ctx.fillStyle = plat.isCrumbling ? '#e11d48' : '#0ea5e9';
      ctx.fillRect(plat.x, plat.y, plat.width, 4);

      // Rivets & diagonal truss patterns
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      for (let px = plat.x; px < plat.x + plat.width - 20; px += 24) {
        ctx.strokeRect(px, plat.y + 6, 20, plat.height - 10);
        ctx.beginPath();
        ctx.moveTo(px, plat.y + 6);
        ctx.lineTo(px + 20, plat.y + plat.height - 4);
        ctx.stroke();
      }

      if (plat.isCrumbling) {
        ctx.fillStyle = '#f87171';
        ctx.font = '8px monospace';
        ctx.fillText('CRUMBLING', plat.x + 8, plat.y + 16);
      }
      ctx.restore();
    });

    // 8. Grapple Hook Cable
    if (p.isGrappling && p.grappleAnchor) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(p.x + p.width / 2, p.y + 12);
      ctx.lineTo(p.grappleAnchor.x, p.grappleAnchor.y);
      ctx.stroke();

      // Grapple Hook claw
      ctx.fillStyle = '#facc15';
      ctx.fillRect(p.grappleAnchor.x - 4, p.grappleAnchor.y - 3, 8, 6);
      ctx.restore();
    }

    // 9. Draw Enemies
    enemiesRef.current.forEach((e) => {
      ctx.save();
      if (e.type === 'robo_trooper' || e.type === 'robo_elite') {
        const isElite = e.type === 'robo_elite';
        // Legs
        ctx.fillStyle = isElite ? '#b45309' : '#334155';
        ctx.fillRect(e.x + 6, e.y + 28, 8, 20);
        ctx.fillRect(e.x + 18, e.y + 28, 8, 20);
        // Torso armor
        ctx.fillStyle = isElite ? '#d97706' : '#475569';
        ctx.fillRect(e.x + 4, e.y + 12, 24, 18);
        // Head / Helmet
        ctx.fillStyle = isElite ? '#92400e' : '#1e293b';
        ctx.fillRect(e.x + 8, e.y, 16, 14);
        // Visor slit
        ctx.fillStyle = isElite ? '#f97316' : '#06b6d4';
        ctx.fillRect(e.facing > 0 ? e.x + 14 : e.x + 8, e.y + 4, 8, 4);
        // Laser Rifle
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(e.facing > 0 ? e.x + 16 : e.x - 12, e.y + 18, 26, 6);
        ctx.fillStyle = isElite ? '#f97316' : '#38bdf8';
        ctx.fillRect(e.facing > 0 ? e.x + 36 : e.x - 12, e.y + 19, 4, 4);
      } else if (e.type === 'explosive_drone') {
        // Quadcopter Drone
        ctx.fillStyle = '#475569';
        ctx.fillRect(e.x + 6, e.y + 6, 24, 12);
        // Rotors
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(e.x, e.y, 12, 3);
        ctx.fillRect(e.x + 24, e.y, 12, 3);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(e.x + 14, e.y + 10, 8, 6); // Blinking bomb core
      } else if (e.type === 'sniper_drone') {
        // Sniper Drone with laser sight line
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(e.x, e.y, 38, 24);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(e.x + 10, e.y + 12, 5, 0, Math.PI * 2);
        ctx.fill();

        // Red targeting laser line pointing to Nexus!
        ctx.save();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(e.x, e.y + 12);
        ctx.lineTo(p.x + 16, p.y + 24);
        ctx.stroke();
        ctx.restore();
      } else if (e.type === 'signal_relay') {
        // Stage 1 Objective Boss
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(e.x, e.y + 20, e.width, e.height - 20);
        // Large Dish
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(e.x + e.width / 2, e.y + 20, 32, Math.PI, 0);
        ctx.fill();
        // Pulsing transmitter needle
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(e.x + e.width / 2 - 2, e.y - 12, 4, 32);
        ctx.beginPath();
        ctx.arc(e.x + e.width / 2, e.y - 12, 8, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.type === 'vanguard_mech') {
        // GRAND BOSS: SENTINEL VANGUARD MECH (Image 1, 2, 4 visual reference!)
        // Heavy Bipedal Legs
        ctx.fillStyle = '#334155';
        ctx.fillRect(e.x + 20, e.y + 120, 28, 65);
        ctx.fillRect(e.x + 85, e.y + 120, 28, 65);
        // Hydraulic joints
        ctx.fillStyle = '#64748b';
        ctx.fillRect(e.x + 16, e.y + 150, 36, 12);
        ctx.fillRect(e.x + 81, e.y + 150, 36, 12);

        // Heavy Torso Chassis
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(e.x, e.y + 40, e.width - 20, 85);

        // Cockpit Head & Visor
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(e.x + 35, e.y + 10, 45, 32);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(e.x + 40, e.y + 20, 35, 8); // Red cyclops visor

        // Left Shoulder Missile Pod
        ctx.fillStyle = '#475569';
        ctx.fillRect(e.x + 85, e.y - 5, 42, 46);
        ctx.fillStyle = '#f97316';
        // 6 missile tube cells
        for (let my = 0; my < 2; my++) {
          for (let mx = 0; mx < 3; mx++) {
            ctx.fillRect(e.x + 90 + mx * 10, e.y + 6 + my * 16, 7, 10);
          }
        }

        // Right Arm: Dual Rotary Gatling Cannon
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(e.x - 30, e.y + 90, 48, 26);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(e.x - 55, e.y + 94, 28, 8);
        ctx.fillRect(e.x - 55, e.y + 106, 28, 8);

        // CHEST CORE WEAK POINT (Image 1, 2, 4 "TITIK LEMAH TEREXPOSE")
        if (e.exposedCore) {
          // Open armor hatches
          ctx.fillStyle = '#334155';
          ctx.fillRect(e.x + 10, e.y + 45, 14, 45);
          ctx.fillRect(e.x + 68, e.y + 45, 14, 45);

          // Exposed Glowing Plasma Core
          ctx.save();
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(e.x + 46, e.y + 68, 16, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(e.x + 46, e.y + 68, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Weak point indicator badge
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 9px "Chakra Petch", sans-serif';
          ctx.fillText('! WEAK POINT !', e.x + 12, e.y + 35);
        } else {
          // Armored Chest Plate
          ctx.fillStyle = '#334155';
          ctx.fillRect(e.x + 22, e.y + 48, 48, 45);
          ctx.strokeStyle = '#64748b';
          ctx.strokeRect(e.x + 22, e.y + 48, 48, 45);
        }
      }

      // Draw Enemy Health Bar
      const hpPct = Math.max(0, e.hp / e.maxHp);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(e.x, e.y - 10, e.width, 5);
      ctx.fillStyle = e.type === 'vanguard_mech' ? '#ef4444' : '#10b981';
      ctx.fillRect(e.x, e.y - 10, e.width * hpPct, 5);

      ctx.restore();
    });

    // 10. Draw Player "Nexus" (Cyborg Agent 01) matching official CYBORG AGENT 01 SPRITE SHEET
    ctx.save();
    if (p.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    const px = p.x;
    const py = p.y;
    const isMoving = Math.abs(p.vx) > 25 && p.isGrounded;
    const runFrame = Math.floor(stateRef.current.timeElapsed * 12) % 8;

    if (p.isDashing) {
      // SLIDE DASH POSE (From Sprite Sheet: Low profile ground slide with flame & plasma trails)
      ctx.save();
      // Speed afterimage ghost trails
      for (let g = 1; g <= 3; g++) {
        ctx.fillStyle = g === 1 ? 'rgba(6, 182, 212, 0.35)' : 'rgba(249, 115, 22, 0.2)';
        const ghostOffset = -p.facing * g * 14;
        ctx.fillRect(px + ghostOffset + 4, py + 22, 28, 18);
      }

      // Jet exhaust flames (Yellow/Orange & Cyan Trails)
      const exhaustX = p.facing > 0 ? px - 18 : px + 36;
      const exGrad = ctx.createLinearGradient(exhaustX, py + 30, exhaustX - p.facing * 24, py + 30);
      exGrad.addColorStop(0, '#ffffff');
      exGrad.addColorStop(0.3, '#f59e0b');
      exGrad.addColorStop(0.7, '#06b6d4');
      exGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = exGrad;
      ctx.fillRect(exhaustX - (p.facing > 0 ? 20 : 0), py + 26, 24, 8);

      // Low sliding torso & armor
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 4, py + 20, 24, 14);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(px + 8, py + 22, 16, 10);

      // Head & Visor in low slide
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(px + (p.facing > 0 ? 22 : 8), py + 16, 8, 0, Math.PI * 2);
      ctx.fill();
      // Flowing hair backward
      ctx.beginPath();
      ctx.moveTo(px + (p.facing > 0 ? 16 : 14), py + 12);
      ctx.lineTo(px + (p.facing > 0 ? -12 : 38), py + 16);
      ctx.lineTo(px + (p.facing > 0 ? 14 : 16), py + 20);
      ctx.fill();

      // Glowing HUD Visor
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(p.facing > 0 ? px + 22 : px + 2, py + 14, 8, 4);

      // Sliding legs extended forward/backward
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px + (p.facing > 0 ? 18 : -6), py + 30, 20, 6);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(px + (p.facing > 0 ? 32 : -6), py + 29, 6, 8);

      // Laser Rifle held forward low
      ctx.fillStyle = '#1e293b';
      const gunX = p.facing > 0 ? px + 18 : px - 14;
      ctx.fillRect(gunX, py + 24, 24, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(p.facing > 0 ? gunX + 20 : gunX, py + 25, 4, 4);

      ctx.restore();
    } else if (p.isGrappling) {
      // GRAPPLE HOOK SWING POSE (From Sprite Sheet: Arms up holding cable, bent knees, dynamic trailing hair)
      ctx.save();
      const tilt = Math.max(-0.4, Math.min(0.4, p.vx * 0.0015));
      ctx.translate(px + 16, py + 20);
      ctx.rotate(tilt);
      ctx.translate(-(px + 16), -(py + 20));

      // Head & flowing cyan ponytail
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(px + 14, py + 8, 8, 0, Math.PI * 2);
      ctx.fill();
      // Flowing hair blown by swing wind
      ctx.beginPath();
      ctx.moveTo(px + (p.facing > 0 ? 10 : 18), py + 4);
      ctx.quadraticCurveTo(px + (p.facing > 0 ? -16 : 44), py - 2, px + (p.facing > 0 ? -8 : 36), py + 18);
      ctx.fill();

      // Visor
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(p.facing > 0 ? px + 16 : px + 6, py + 6, 8, 4);

      // Torso in swing
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 8, py + 16, 16, 16);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(px + 10, py + 18, 12, 12);

      // Arms reaching UP holding the grapple cable line
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px + 12, py + 2, 6, 15);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(px + 11, py + 2, 8, 4);

      // Bent tucked knees in swing
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px + 6, py + 32, 10, 10);
      ctx.fillRect(px + 16, py + 34, 10, 12);
      ctx.fillStyle = '#f97316'; // Knee guards
      ctx.fillRect(px + 12, py + 33, 4, 6);
      ctx.fillRect(px + 22, py + 36, 4, 6);

      ctx.restore();
    } else {
      // STANDARD IDLE / RUN / JUMP / SHOOTING POSES
      // Micro-Jet Flame Boosters on boots during jump / air
      if (!p.isGrounded) {
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.moveTo(px + (p.facing > 0 ? 6 : 18), py + 46);
        ctx.lineTo(px + (p.facing > 0 ? 14 : 26), py + 46);
        ctx.lineTo(px + (p.facing > 0 ? 10 : 22), py + 56 + Math.random() * 8);
        ctx.fill();
      }

      // Legs & Armor Boots (Animated with 8-Frame Run Gait)
      const legOffset1 = isMoving ? Math.sin(runFrame * 0.785) * 8 : !p.isGrounded ? 4 : 0;
      const legOffset2 = isMoving ? -Math.sin(runFrame * 0.785) * 8 : !p.isGrounded ? -4 : 0;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px + 6 + legOffset1, py + 28, 7, 20);
      ctx.fillRect(px + 18 + legOffset2, py + 28, 7, 20);

      // Orange Cyber Armor Knee & Boot Guards
      ctx.fillStyle = '#f97316';
      ctx.fillRect(px + 5 + legOffset1, py + 34, 9, 8);
      ctx.fillRect(px + 17 + legOffset2, py + 34, 9, 8);

      // Torso (Orange & Black tactical armor with cyberplate)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 6, py + 14, 18, 15);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(px + 9, py + 16, 12, 10);

      // Head & Signature Flowing Cyan Ponytail
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(px + 14, py + 8, 8, 0, Math.PI * 2);
      ctx.fill();

      // Hair strand bouncing with run
      const hairWave = isMoving ? Math.sin(runFrame) * 4 : 0;
      ctx.beginPath();
      if (p.facing > 0) {
        ctx.moveTo(px + 8, py + 4);
        ctx.quadraticCurveTo(px - 14 + hairWave, py + 12, px - 6 + hairWave, py + 24);
        ctx.lineTo(px + 6, py + 14);
      } else {
        ctx.moveTo(px + 20, py + 4);
        ctx.quadraticCurveTo(px + 42 - hairWave, py + 12, px + 34 - hairWave, py + 24);
        ctx.lineTo(px + 22, py + 14);
      }
      ctx.fill();

      // Face skin & Glowing Visor HUD
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(p.facing > 0 ? px + 12 : px + 8, py + 4, 10, 8);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(p.facing > 0 ? px + 14 : px + 6, py + 6, 9, 4);

      // Standard Laser Rifle on Arms (With Muzzle Flash on shooting)
      ctx.fillStyle = '#1e293b';
      const gunX = p.facing > 0 ? px + 14 : px - 12;
      ctx.fillRect(gunX, py + 18, 26, 7);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(p.facing > 0 ? gunX + 22 : gunX, py + 19, 4, 5);

      // Grapple Hook holster on hip
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(px + 4, py + 24, 5, 6);
    }
    ctx.restore();

    // 11. Draw Bullets & Beams
    bulletsRef.current.forEach((b) => {
      ctx.save();
      if (b.type === 'player_laser') {
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.fillRect(b.x - 6, b.y - 2, 14, 5);
      } else if (b.type === 'player_focus') {
        // High-Power Plasma Focused Beam
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 16;
        ctx.fillRect(b.x - 14, b.y - 4, 28, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(b.x - 10, b.y - 2, 20, 4);
      } else if (b.type === 'enemy_laser') {
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 6;
        ctx.fillRect(b.x - 5, b.y - 2, 10, 4);
      } else if (b.type === 'boss_laser') {
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 10;
        ctx.fillRect(b.x - 8, b.y - 3, 18, 6);
      } else if (b.type === 'boss_missile') {
        ctx.fillStyle = '#ea580c';
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(b.x - 2, b.y - 2, 4, 4);
      } else if (b.type === 'sniper_beam') {
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 14;
        ctx.fillRect(b.x - 12, b.y - 2, 24, 5);
      }
      ctx.restore();
    });

    // 12. Draw Particles
    particlesRef.current.forEach((pt) => {
      ctx.save();
      ctx.globalAlpha = pt.alpha;
      ctx.fillStyle = pt.color;
      ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
      ctx.restore();
    });

    // 13. Draw Cyber City Rain Streaks
    ctx.save();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.22)';
    ctx.lineWidth = 1;
    rainRef.current.forEach((drop) => {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 3, drop.y + drop.length);
      ctx.stroke();
    });
    ctx.restore();

    // 14. HUD (Top Screen Overlay matching user's screenshots)
    // HEALTH [III] | SCORE | TIME | STAGE | HEAT GAUGE
    ctx.save();
    // Top Bar Tint
    ctx.fillStyle = 'rgba(4, 7, 15, 0.85)';
    ctx.fillRect(0, 0, width, 55);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, 55);

    // Health Bar [III]
    ctx.font = 'bold 12px "Press Start 2P", monospace';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('HEALTH [III]', 20, 24);

    const hpWidth = 140;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, 32, hpWidth, 12);
    ctx.fillStyle = p.hp > 30 ? '#06b6d4' : '#ef4444';
    ctx.fillRect(20, 32, hpWidth * Math.max(0, p.hp / p.maxHp), 12);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(20, 32, hpWidth, 12);

    // Lives count
    ctx.font = '10px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#f87171';
    ctx.fillText(`LIVES: ${'♥ '.repeat(p.lives)}`, 175, 42);

    // SCORE
    ctx.font = 'bold 11px "Press Start 2P", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('SCORE', 340, 22);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(String(p.score).padStart(7, '0'), 340, 42);

    // TIME
    const mins = Math.floor(stateRef.current.timeElapsed / 60);
    const secs = Math.floor(stateRef.current.timeElapsed % 60);
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    ctx.fillStyle = '#facc15';
    ctx.fillText('TIME', 500, 22);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(timeStr, 500, 42);

    // STAGE
    ctx.textAlign = 'right';
    ctx.fillStyle = '#38bdf8';
    const stageTitle =
      stateRef.current.stage === 1
        ? 'STAGE 1-3'
        : stateRef.current.stage === 2
        ? 'STAGE 2-2'
        : 'STAGE 3-BOSS';
    ctx.fillText(stageTitle, width - 20, 22);

    // HEAT GAUGE (Pengukur Panas)
    const heatWidth = 120;
    const heatX = width - heatWidth - 20;
    ctx.font = 'bold 9px "Press Start 2P", monospace';
    ctx.fillStyle = p.isOverheated ? '#ef4444' : '#f59e0b';
    ctx.fillText(p.isOverheated ? 'OVERHEAT!' : 'HEAT GAUGE', width - 20, 36);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(heatX, 40, heatWidth, 8);
    const heatPct = Math.min(1, p.heat / p.maxHeat);
    ctx.fillStyle = p.isOverheated
      ? '#ef4444'
      : heatPct > 0.75
      ? '#f97316'
      : '#facc15';
    ctx.fillRect(heatX, 40, heatWidth * heatPct, 8);
    ctx.strokeStyle = p.isOverheated ? '#ef4444' : '#64748b';
    ctx.strokeRect(heatX, 40, heatWidth, 8);

    // Bottom Credits / Start Kicker
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'left';
    ctx.fillText('CREDITS: 4', 20, height - 16);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#facc15';
    ctx.fillText('NEXUS 2142', width - 20, height - 16);

    ctx.restore();
    ctx.restore();
  };

  // Setup Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in code editor textarea/input
      if (
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'INPUT'
      ) {
        return;
      }

      stateRef.current.keys.add(e.code);

      if (e.code === 'KeyP' || e.code === 'Escape') {
        setGameState((prev) => {
          const next = prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev;
          stateRef.current.gameState = next;
          return next;
        });
      }

      if (e.code === 'KeyR' || e.code === 'KeyE') {
        handleGrappleToggle();
      }

      if (e.code === 'KeyB' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        handleDash();
      }

      if (e.code === 'KeyX') {
        handleFire(false);
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        if (stateRef.current.gameState === 'title' || stateRef.current.gameState === 'gameover') {
          handleStartGame(stateRef.current.stage);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleDash, handleFire, handleGrappleToggle, handleStartGame]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden select-none">
      {/* Canvas Screen */}
      <div className="relative border-2 border-cyan-500/40 rounded-lg shadow-2xl shadow-cyan-950/60 overflow-hidden bg-black max-w-full">
        <canvas
          ref={canvasRef}
          width={880}
          height={520}
          className="w-full max-w-[880px] h-auto aspect-[880/520] block cursor-crosshair"
          onClick={() => handleFire(false)}
          onContextMenu={(e) => {
            e.preventDefault();
            handleGrappleToggle();
          }}
        />

        {/* Scanlines Effect */}
        <div className="absolute inset-0 scanlines pointer-events-none opacity-40" />

        {/* Title Screen Overlay */}
        {gameState === 'title' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-500/50 bg-cyan-950/40 text-cyan-400 text-xs font-mono mb-4 tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              CYBER CITY ASSAULT SYSTEM 2142
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-pink-500 mb-2 neon-glow-cyan">
              CYBER ASSAULT 2142
            </h1>
            <p className="text-slate-300 text-sm max-w-md mb-6 font-mono leading-relaxed">
              Pemberontakan Robot telah melanda Cyber City. Kendalikan Agen Nexus, susup ke jalur layang, gunakan Grapple Hook & Focused Beam untuk menghancurkan Vanguard Mech!
            </p>

            {/* Stage Selector Pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {[
                { s: 1, label: 'Stage 1: Menara Sinyal' },
                { s: 2, label: 'Stage 2: Jalur Melayang' },
                { s: 3, label: 'Stage 3: Inti Vanguard' },
              ].map((item) => (
                <button
                  key={item.s}
                  onClick={() => {
                    setCurrentStage(item.s);
                    handleStartGame(item.s);
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all border ${
                    currentStage === item.s
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-cyan-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleStartGame(currentStage)}
              data-start="true"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black px-8 py-3 rounded-md text-base tracking-wider uppercase flex items-center gap-3 shadow-lg shadow-cyan-500/40 hover:scale-105 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>MULAI MISI [ SPACE ]</span>
            </button>

            <div className="mt-6 text-xs text-slate-400 font-mono flex flex-wrap gap-4 justify-center">
              <span>WASD / Panah: Gerak & Lompat</span>
              <span>·</span>
              <span>B / Shift: Slide Dash</span>
              <span>·</span>
              <span>X / Klik: Tembak Laser</span>
              <span>·</span>
              <span>R / Klik Kanan: Grapple Hook</span>
            </div>
          </div>
        )}

        {/* Victory Screen */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/60 rounded-full mb-3 text-emerald-400 animate-bounce">
              <Award className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-emerald-400 tracking-wider mb-2 font-pixel">
              MISI SELESAI!
            </h2>
            <h3 className="text-lg font-bold text-slate-200 mb-4">
              SENTINEL VANGUARD MECH & INTI AI HANCUR!
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6 font-mono">
              Sinyal kontrol AI telah terputus. Seluruh pasukan robot di Cyber City nonaktif. Agen Nexus mengakhiri misi dan kota kembali aman!
            </p>

            <div className="grid grid-cols-2 gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-lg mb-6 text-left font-mono text-sm w-72">
              <div>
                <span className="text-slate-500 text-xs block">SKOR TOTAL</span>
                <span className="text-cyan-400 text-lg font-bold">{activeScore}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">STATUS KOTA</span>
                <span className="text-emerald-400 text-lg font-bold">AMAN 2142</span>
              </div>
            </div>

            <button
              onClick={() => handleStartGame(1)}
              data-start="true"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded flex items-center gap-2 cursor-pointer font-mono"
            >
              <RotateCcw className="w-4 h-4" />
              <span>MAIN LAGI</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-20">
            <h2 className="text-4xl font-black text-rose-500 tracking-wider mb-2 font-pixel animate-pulse">
              GAME OVER
            </h2>
            <p className="text-slate-400 text-sm mb-6 font-mono">
              Nexus gagal menembus pertahanan robotik. Coba lagi dan gunakan Grapple Hook untuk menghindari serangan!
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => handleStartGame(currentStage)}
                data-start="true"
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-2.5 rounded flex items-center gap-2 cursor-pointer font-mono shadow-lg shadow-rose-600/30"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ULANGI STAGE {currentStage}</span>
              </button>
              <button
                onClick={() => {
                  setGameState('title');
                  stateRef.current.gameState = 'title';
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-2.5 rounded font-mono"
              >
                MENU UTAMA
              </button>
            </div>
          </div>
        )}

        {/* Pause Modal */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-6 z-20">
            <h3 className="text-2xl font-bold text-amber-400 mb-4 font-mono">GAME DIJEDA [ PAUSED ]</h3>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setGameState('playing');
                  stateRef.current.gameState = 'playing';
                }}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-2 rounded font-mono"
              >
                Lanjutkan (P / Esc)
              </button>
              <button
                onClick={() => handleStartGame(currentStage)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-2 rounded font-mono"
              >
                Restart Stage
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Virtual Buttons (Responsive Mobile & Quick Controls) */}
      <div className="w-full max-w-[880px] mt-2 px-2 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFire(false)}
            className="bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 px-3 py-1.5 rounded active:scale-95 transition-all flex items-center gap-1.5"
            title="Tembak Laser (X / Klik Kiri)"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Tembak [X]</span>
          </button>
          <button
            onClick={() => handleFire(true)}
            className="bg-amber-950/60 hover:bg-amber-900 border border-amber-800/80 text-amber-300 px-3 py-1.5 rounded active:scale-95 transition-all flex items-center gap-1.5"
            title="Tembakan Fokus (Tahan X)"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fokus [Tahan X]</span>
          </button>
          <button
            onClick={handleGrappleToggle}
            className="bg-sky-950/60 hover:bg-sky-900 border border-sky-800/80 text-sky-300 px-3 py-1.5 rounded active:scale-95 transition-all flex items-center gap-1.5"
            title="Grapple Hook (R / E / Klik Kanan)"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Grapple [R]</span>
          </button>
          <button
            onClick={handleDash}
            className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded active:scale-95 transition-all"
            title="Slide Dash (B / Shift)"
          >
            <span>Slide [B]</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const nextMuted = !soundMuted;
              setSoundMuted(nextMuted);
              audioFX.setMuted(nextMuted);
              if (!nextMuted) audioFX.startBGM();
            }}
            className="p-1.5 rounded border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title={soundMuted ? 'Nyalakan Audio' : 'Bisukan Audio'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <span className="hidden sm:inline text-slate-500">
            Stage {currentStage} / 3
          </span>
        </div>
      </div>
    </div>
  );
};
