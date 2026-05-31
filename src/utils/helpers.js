import { TRIP } from '../data/days.js';

export function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function extractCostNumber(costStr) {
  const match = costStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function intensityColor(value) {
  if (value <= 3) return '#6B8E5A'; // green - rest
  if (value <= 6) return '#D4A24C'; // yellow - moderate
  if (value <= 8) return '#D87A3E'; // orange - active
  return '#C04A2E'; // red - extreme
}

export function pluralDays(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'дней';
  if (mod10 === 1) return 'день';
  if (mod10 >= 2 && mod10 <= 4) return 'дня';
  return 'дней';
}

export function daysUntil(target, from) {
  const ms = target - from;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function getTripPhase(now) {
  if (now < TRIP.arrival && !sameDay(now, TRIP.arrival)) return 'preparation';
  if (now > TRIP.departure && !sameDay(now, TRIP.departure)) return 'memories';
  if (sameDay(now, TRIP.birthday)) return 'birthday';
  return 'active';
}

export function getDayStatus(dayDate, now) {
  if (sameDay(dayDate, now)) return 'today';
  if (dayDate < now) return 'past';
  return 'future';
}
