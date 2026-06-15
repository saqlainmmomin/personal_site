// Generates programmatic grayscale PLACEHOLDER stills + the Bayer dither matrix
// for the Socrates hero, with zero dependencies (built-in zlib only). These are
// stand-ins so the WebGL texture pipeline runs end-to-end; replace the three
// scene stills with the real AI-generated images (see tasks/socrates-hero-proposal.md §5).
//
//   node scripts/gen-placeholders.mjs
//
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'img');
mkdirSync(OUT, { recursive: true });

// Guard: once real scene stills exist (webp/avif), never overwrite them with
// placeholders. The Bayer matrix is always (re)written - it is generated, not art.
const REAL = existsSync(join(OUT, 'socrates-full.webp')) || existsSync(join(OUT, 'socrates-full.avif'));

// ---- minimal grayscale (color type 0) PNG encoder ----
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
}
function encodeGray(width, height, pixels /* Uint8Array w*h */) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 0; // color type: grayscale
  // raw scanlines, each prefixed with filter byte 0
  const raw = Buffer.alloc((width + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width + 1)] = 0;
    pixels.subarray(y * width, (y + 1) * width).forEach((v, x) => {
      raw[y * (width + 1) + 1 + x] = v;
    });
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v | 0);
function render(w, h, fn) {
  const px = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) px[y * w + x] = clamp(fn(x / w, y / h) * 255);
  return px;
}
// separable box blur (for the soft LCP poster)
function boxBlur(px, w, h, r) {
  const tmp = new Float32Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let s = 0, c = 0;
      for (let k = -r; k <= r; k++) {
        const xx = x + k;
        if (xx >= 0 && xx < w) { s += px[y * w + xx]; c++; }
      }
      tmp[y * w + x] = s / c;
    }
  const out = new Uint8Array(w * h);
  for (let x = 0; x < w; x++)
    for (let y = 0; y < h; y++) {
      let s = 0, c = 0;
      for (let k = -r; k <= r; k++) {
        const yy = y + k;
        if (yy >= 0 && yy < h) { s += tmp[yy * w + x]; c++; }
      }
      out[y * w + x] = s / c | 0;
    }
  return out;
}
function write(name, w, h, px) {
  writeFileSync(join(OUT, name), encodeGray(w, h, px));
  console.log('  wrote', name, `${w}x${h}`);
}

// soft circular falloff
const blob = (u, v, cx, cy, r) => {
  const d = Math.hypot(u - cx, v - cy) / r;
  return Math.exp(-d * d * 2.2);
};

console.log('Generating placeholders into public/img/ ...');

// 8x8 ordered Bayer matrix (threshold map), white-ascending
const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];
{
  const px = new Uint8Array(64);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) px[y * 8 + x] = (BAYER[y][x] / 63) * 255;
  write('bayer8.png', 8, 8, px);
}

if (REAL) {
  console.log('  real scene stills present - skipping placeholder generation (kept bayer8).');
} else {
  // Scene 1 placeholder: chiaroscuro figure upper-left + offered cup, dark right
  const socratesScene = (u, v) => {
    let b = 0.04; // near-black base
    b += 0.85 * blob(u, v, 0.34, 0.42, 0.26); // lit seated figure mass
    b += 0.55 * blob(u, v, 0.5, 0.5, 0.05); // bright cup at the exchange
    b += 0.4 * blob(u, v, 0.58, 0.48, 0.07); // offering hand
    b *= 0.9 + 0.1 * Math.sin(u * 40); // faint texture
    b *= 1 - 0.5 * Math.hypot(u - 0.4, v - 0.5); // vignette toward edges
    return b;
  };
  write('socrates-full.png', 1200, 800, render(1200, 800, socratesScene));

  // Blurred LCP poster: shown at first paint + as the no-JS/reduced-motion image.
  // Scene 1 (not the final dither) so it matches scroll-start and avoids a flash.
  {
    const W = 640, H = 427;
    write('socrates-poster.png', W, H, boxBlur(render(W, H, socratesScene), W, H, 5));
  }

  // Scene 4 placeholder: two hands reaching horizontally, centered gap
  {
    const W = 1200, H = 800;
    const px = render(W, H, (u, v) => {
      let b = 0.03;
      b += 0.8 * blob(u, v, 0.38, 0.5, 0.13); // left hand
      b += 0.8 * blob(u, v, 0.62, 0.5, 0.13); // right hand
      // carve the gap so fingertips nearly touch but don't
      const gap = Math.exp(-Math.pow((u - 0.5) / 0.015, 2)) * (Math.abs(v - 0.5) < 0.12 ? 1 : 0);
      b *= 1 - 0.85 * gap;
      b *= 1 - 0.45 * Math.hypot(u - 0.5, v - 0.5);
      return b;
    });
    write('hands-adam.png', W, H, px);
  }
}

console.log(
  'Done. Replace 2 stills (socrates-full, hands-adam) with real images; ' +
    'poster + final-dither derive from them. Then re-run cwebp.'
);
