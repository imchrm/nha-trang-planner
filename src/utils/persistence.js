export const LS_KEY = 'nha-trang-planner-schedule';

export function encodeSchedule(schedule) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(schedule))));
  } catch { return null; }
}

export function decodeSchedule(encoded) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))));
  } catch { return null; }
}

export function buildShareUrl(schedule) {
  const encoded = encodeSchedule(schedule);
  if (!encoded) return window.location.href;
  const base = window.location.origin + window.location.pathname;
  return `${base}#s=${encoded}`;
}

export function saveScheduleLocally(schedule) {
  try {
    if (Object.keys(schedule).length === 0) {
      localStorage.removeItem(LS_KEY);
    } else {
      localStorage.setItem(LS_KEY, JSON.stringify(schedule));
    }
  } catch { /* localStorage unavailable */ }
}

export function loadScheduleLocally() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function readUrlSchedule() {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith('#s=')) return null;
    return decodeSchedule(hash.slice(3));
  } catch { return null; }
}

export function clearUrlHash() {
  try {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  } catch { /* ignore */ }
}
