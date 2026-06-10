// Divergence-chart geometry. Imported by ClosingWindow.astro at build time (to
// emit the final static state for no-JS / reduced-motion) and by the client
// script (to drive growth on scroll). One source of truth for the math.

export const W = 1000;
export const H = 520;
const padB = 40;
const padT = 20;

export const x = (t: number) => 30 + t * (900 / 100); // t in 0..100
const yb = H - padB; // baseline
const span = yb - padT;

const humanH = (t: number) => t * 1.0; // gentle human rise
const K = 0.045;
const expMax = Math.exp(K * 100) - 1;
const expH = (t: number) => ((Math.exp(K * t) - 1) / expMax) * span;

export const humanY = (t: number) => yb - humanH(t);
export const machineY = (t: number, prog: number) =>
  yb - (humanH(t) * (1 - prog) + expH(t) * prog);

function pathFor(fn: (t: number) => number) {
  let d = '';
  for (let t = 0; t <= 100; t += 2) {
    d += (t === 0 ? 'M' : 'L') + x(t).toFixed(1) + ' ' + fn(t).toFixed(1) + ' ';
  }
  return d;
}

export const humanPath = () => pathFor(humanY);
export const machinePath = (prog: number) => pathFor((t) => machineY(t, prog));

export function gapPath(prog: number) {
  let d = machinePath(prog);
  for (let t = 100; t >= 0; t -= 2) {
    d += 'L' + x(t).toFixed(1) + ' ' + humanY(t).toFixed(1) + ' ';
  }
  return d + 'Z';
}

export const labelHumanXY = () => ({ x: x(100) - 8, y: humanY(100) - 12 });
export const labelMachineXY = (prog: number) => ({
  x: x(100) - 8,
  y: Math.max(padT + 14, machineY(100, prog) - 12),
});
