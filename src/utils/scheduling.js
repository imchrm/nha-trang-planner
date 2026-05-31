import { CARDS } from '../data/cards.js';
import { DAYS } from '../data/days.js';

/**
 * Pure function — no React hooks, safe to unit-test directly.
 *
 * @param {string} cardId
 * @param {string} dayId
 * @param {Object} schedule  - { [dayId]: string[] }
 * @param {Set<string>} placedIds - set of already-placed card IDs
 * @returns {{ ok: boolean, reason?: string, blockingDay?: object|null }}
 */
export function canPlaceCard(cardId, dayId, schedule, placedIds) {
  const card = CARDS.find(c => c.id === cardId);
  const day = DAYS.find(d => d.id === dayId);
  if (!card || !day) return { ok: false, reason: 'нет данных' };
  if (day.type === 'arrival' || day.type === 'departure') return { ok: false, reason: 'фикс. день' };
  if (day.type === 'birthday' && card.cat !== 'birthday') return { ok: false, reason: 'только Д.Р.' };
  if (day.type !== 'birthday' && card.cat === 'birthday') return { ok: false, reason: 'не Д.Р.' };
  if (placedIds.has(cardId)) return { ok: false, reason: 'уже размещено' };
  const placed = (schedule[dayId] || []).map(id => CARDS.find(c => c.id === id)).filter(Boolean);
  const usedWeight = placed.reduce((s, c) => s + c.weight, 0);
  // 2-day cards are handled separately below; skip daily weight check for them
  if (card.weight !== 8 && usedWeight + card.weight > 4) return { ok: false, reason: 'день занят' };
  // А-5 (2 дня) — special: needs next day free too
  if (card.weight === 8) {
    const idx = DAYS.findIndex(d => d.id === dayId);
    const next = DAYS[idx + 1];
    if (!next || next.type !== 'free') {
      return { ok: false, reason: 'нужно 2 свободных дня подряд', blockingDay: next || null };
    }
    const nextUsed = (schedule[next.id] || []).reduce((s, id) => {
      const c = CARDS.find(x => x.id === id);
      return s + (c?.weight || 0);
    }, 0);
    if (nextUsed > 0) return { ok: false, reason: 'следующий день занят', blockingDay: next };
  }
  return { ok: true };
}
