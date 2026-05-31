// TODO: install vitest — add to devDependencies: "vitest": "^1.x"
// Then add to package.json scripts: "test": "vitest"
// And add to vite.config.js: test: { environment: 'node' }

import { describe, it, expect } from 'vitest';
import { canPlaceCard } from '../utils/scheduling.js';

// Helper: build a placedIds Set from a schedule object
function buildPlacedIds(schedule) {
  const set = new Set();
  Object.values(schedule).forEach(arr => arr.forEach(id => set.add(id)));
  return set;
}

describe('canPlaceCard', () => {
  // Fixed days: arrival (d1) and departure (d11)
  it('returns { ok: false } for arrival day (fixed)', () => {
    const result = canPlaceCard('AC1', 'd1', {}, new Set());
    expect(result.ok).toBe(false);
  });

  it('returns { ok: false } for departure day (fixed)', () => {
    const result = canPlaceCard('AC1', 'd11', {}, new Set());
    expect(result.ok).toBe(false);
  });

  // Birthday day (d7) + non-birthday card
  it('returns { ok: false } for birthday day with non-birthday card', () => {
    const result = canPlaceCard('AC1', 'd7', {}, new Set());
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/Д\.Р\./);
  });

  // Non-birthday day + birthday card
  it('returns { ok: false } for non-birthday day with birthday card', () => {
    const result = canPlaceCard('BD1', 'd2', {}, new Set());
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/не Д\.Р\./);
  });

  // Already placed card
  it('returns { ok: false } for already placed card', () => {
    const placedIds = new Set(['AC1']);
    const result = canPlaceCard('AC1', 'd2', {}, placedIds);
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/уже размещено/);
  });

  // Day weight full (used 4) + weight-2 card
  it('returns { ok: false } when day is full (weight 4) and adding weight-2 card', () => {
    // AC1 has weight 4
    const schedule = { d2: ['AC1'] };
    const placedIds = buildPlacedIds(schedule);
    // Try to place AC2 (weight 2) in d2 which is already at capacity
    const result = canPlaceCard('AC2', 'd2', schedule, placedIds);
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/день занят/);
  });

  // Day weight 2 + weight-2 card → ok
  it('returns { ok: true } when day has weight 2 used and adding weight-2 card', () => {
    // AC2 has weight 2, AC8 has weight 2
    const schedule = { d2: ['AC2'] };
    const placedIds = buildPlacedIds(schedule);
    // Try to place AC8 (weight 2) in d2 — total will be 4, which is exactly the limit
    const result = canPlaceCard('AC8', 'd2', schedule, placedIds);
    expect(result.ok).toBe(true);
  });

  // 2-day card (weight 8 = AC5) on last free day before departure (d10, next is d11=departure)
  it('returns { ok: false } for 2-day card on last free day before departure', () => {
    // d10 is the last free day, d11 is departure (type !== 'free')
    const result = canPlaceCard('AC5', 'd10', {}, new Set());
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/нужно 2 свободных дня подряд/);
  });

  // 2-day card on day before occupied day
  it('returns { ok: false } for 2-day card when next day is occupied', () => {
    // Place AC1 (weight 4) on d3, then try to place AC5 (2-day) on d2
    const schedule = { d3: ['AC1'] };
    const placedIds = buildPlacedIds(schedule);
    const result = canPlaceCard('AC5', 'd2', schedule, placedIds);
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/следующий день занят/);
    expect(result.blockingDay).toBeDefined();
  });

  // 2-day card on day before free day → ok
  it('returns { ok: true } for 2-day card when next day is free and empty', () => {
    // d2 and d3 are both free and empty
    const result = canPlaceCard('AC5', 'd2', {}, new Set());
    expect(result.ok).toBe(true);
  });

  // Normal placement
  it('returns { ok: true } for normal placement of a card on a free day', () => {
    const result = canPlaceCard('AC1', 'd2', {}, new Set());
    expect(result.ok).toBe(true);
  });
});
