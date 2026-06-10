// Single shared source of truth for the lens reading, so the hero and The Work
// move together. Bundled once, so all client scripts see the same instance.
// State lives on <html data-reading> for CSS; this module coordinates JS.

export type Reading = 'auditor' | 'builder';

const listeners = new Set<(r: Reading) => void>();
let current: Reading =
  (document.documentElement.dataset.reading as Reading) || 'auditor';

export function getReading(): Reading {
  return current;
}

export function setReading(r: Reading) {
  if (r === current) return;
  current = r;
  document.documentElement.dataset.reading = r;
  listeners.forEach((l) => l(r));
}

export function onReading(cb: (r: Reading) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
