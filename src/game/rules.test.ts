import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFiringOutcome,
  updateHeatGauge,
  calculateBossDamage,
  calculateGrappleSwing,
  STAGES_CONFIG,
} from './rules.ts';

test('standard firing generates mild heat and deals baseline damage', () => {
  const result = calculateFiringOutcome(0, 100, false, false);
  assert.equal(result.canFire, true);
  assert.equal(result.damage, 8);
  assert.equal(result.beamType, 'standard');
  assert.equal(result.isOverheated, false);
});

test('focused firing generates high heat and deals heavy damage', () => {
  const result = calculateFiringOutcome(50, 100, false, true);
  assert.equal(result.canFire, true);
  assert.equal(result.damage, 28);
  assert.equal(result.beamType, 'focused');
  assert.equal(result.isOverheated, false);
});

test('focused firing trips overheat when heat exceeds maxHeat', () => {
  const result = calculateFiringOutcome(95, 100, false, true);
  assert.equal(result.canFire, true);
  assert.equal(result.isOverheated, true);
});

test('overheated weapon cannot fire until cooled down below recovery threshold', () => {
  const blocked = calculateFiringOutcome(90, 100, true, false);
  assert.equal(blocked.canFire, false);

  // Cool down slightly (still above 15%)
  const cool1 = updateHeatGauge(80, 100, true, 25, 1.0);
  assert.equal(cool1.isOverheated, true);

  // Cool down below threshold
  const cool2 = updateHeatGauge(14, 100, true, 25, 0.5);
  assert.equal(cool2.isOverheated, false);
});

test('boss damage calculation applies 3x multiplier to exposed chest core', () => {
  const normalHit = calculateBossDamage(28, false, false);
  assert.equal(normalHit.effectiveDamage, 28);
  assert.equal(normalHit.isCrit, false);

  const coreHit = calculateBossDamage(28, true, false);
  assert.equal(coreHit.effectiveDamage, 84);
  assert.equal(coreHit.isCrit, true);

  const armoredHit = calculateBossDamage(28, false, true);
  assert.equal(armoredHit.effectiveDamage, 11);
  assert.equal(armoredHit.isCrit, false);
});

test('grapple swing constrains movement to rope length', () => {
  const swing = calculateGrappleSwing(
    { x: 100, y: 150 },
    { x: 100, y: 50 },
    { vx: 50, vy: 0 },
    100,
    0.016
  );
  assert.ok(swing.x >= 95 && swing.x <= 105);
  assert.ok(swing.y >= 145 && swing.y <= 155);
});

test('stage configuration contains 3 core stages matching scenario', () => {
  assert.equal(STAGES_CONFIG.length, 3);
  assert.equal(STAGES_CONFIG[0].id, 1);
  assert.equal(STAGES_CONFIG[2].bossName, 'SENTINEL VANGUARD MECH');
});
