// ─── BadgeContent — Editorial card artwork painted to canvas textures ─────────
// The card face is drawn with the 2D Canvas API and mapped onto the 3D paper
// stock as a texture. Unlike a DOM overlay (<Html>), the artwork is lit by the
// scene, twists with the card, and sits physically *inside* the plastic sleeve.

import * as THREE from 'three';

export const ACCENT = '#3a31ef';
const INK = '#0a0a0b';
const MUTED = '#71717a';
const FAINT = '#a1a1aa';

const SANS = '"Inter Tight", "Helvetica Neue", Helvetica, Arial, sans-serif';
const SERIF = '"Instrument Serif", "Times New Roman", Georgia, serif';

// Card stock is 2.4 × 3.4 world units → keep the same aspect on the canvas.
export const FACE_W = 1024;
export const FACE_H = Math.round(FACE_W * (3.4 / 2.4));

// ── Fonts ────────────────────────────────────────────────────────────────────
let fontPromise = null;

export function loadBadgeFonts() {
  if (fontPromise) return fontPromise;

  const href =
    'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;800&family=Instrument+Serif:ital@1&display=swap';

  const stylesheetReady = new Promise((resolve) => {
    let link = document.getElementById('badge-fonts');
    if (link) return resolve();
    link = document.createElement('link');
    link.id = 'badge-fonts';
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });

  const faces = [
    `500 28px "Inter Tight"`,
    `600 42px "Inter Tight"`,
    `800 300px "Inter Tight"`,
    `italic 400 100px "Instrument Serif"`,
  ];

  const loaded = stylesheetReady.then(() =>
    Promise.all(faces.map((f) => document.fonts.load(f))).catch(() => { })
  );
  const timeout = new Promise((resolve) => setTimeout(resolve, 4000));

  fontPromise = Promise.race([loaded, timeout]);
  return fontPromise;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
let grainCanvas = null;
function getGrain() {
  if (grainCanvas) return grainCanvas;
  grainCanvas = document.createElement('canvas');
  grainCanvas.width = grainCanvas.height = 256;
  const g = grainCanvas.getContext('2d');
  const img = g.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = Math.random() * 14;
  }
  g.putImageData(img, 0, 0);
  return grainCanvas;
}

function paintPaper(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, w * 0.3, h);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(1, '#f2f2ef');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Very fine matte paper grain
  ctx.save();
  ctx.fillStyle = ctx.createPattern(getGrain(), 'repeat');
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function setFont(ctx, font, spacing = '0px') {
  ctx.font = font;
  if ('letterSpacing' in ctx) ctx.letterSpacing = spacing;
}

/** Shrinks the font size until `text` fits inside `maxWidth`. */
function fitFont(ctx, text, maxWidth, build, startSize, spacing) {
  let size = startSize;
  setFont(ctx, build(size), spacing(size));
  while (ctx.measureText(text).width > maxWidth && size > 10) {
    size -= 2;
    setFont(ctx, build(size), spacing(size));
  }
  return size;
}

function pill(ctx, x, y, label, { fill, stroke, color }) {
  setFont(ctx, `600 28px ${SANS}`, '-0.2px');
  const padX = 26;
  const h = 62;
  const w = ctx.measureText(label).width + padX * 2;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }

  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + padX, y + h / 2 + 1);
  ctx.textBaseline = 'alphabetic';
  return w;
}

// ── Card face ────────────────────────────────────────────────────────────────
export function drawCardFace(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const PAD = 84;
  const maxW = W - PAD * 2;

  ctx.clearRect(0, 0, W, H);
  paintPaper(ctx, W, H);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Header — quiet editorial meta line
  setFont(ctx, `500 26px ${SANS}`, '0.4px');
  ctx.fillStyle = FAINT;
  ctx.fillText('Portfolio', PAD, 124);
  ctx.textAlign = 'right';
  ctx.fillText('© 2026', W - PAD, 124);
  ctx.textAlign = 'left';

  // Name — massive neo-grotesque, deep ink, accent full stop
  const nameSize = fitFont(
    ctx,
    'Hadi.',
    maxW,
    (s) => `800 ${s}px ${SANS}`,
    340,
    (s) => `${-s * 0.055}px`
  );
  const nameX = PAD - nameSize * 0.045;
  const nameY = 640;
  ctx.fillStyle = INK;
  ctx.fillText('Hadi', nameX, nameY);
  const nameW = ctx.measureText('Hadi').width;
  ctx.fillStyle = ACCENT;
  ctx.fillText('.', nameX + nameW + nameSize * 0.02, nameY);

  // Role — elegant italic serif in the accent colour
  fitFont(
    ctx,
    'Full-Stack Developer',
    maxW,
    (s) => `italic 400 ${s}px ${SERIF}`,
    108,
    () => '-0.5px'
  );
  ctx.fillStyle = ACCENT;
  ctx.fillText('Full-Stack Developer', PAD, nameY + 128);

  // Hairline divider
  const divY = 1052;
  ctx.fillStyle = '#e4e4e7';
  ctx.fillRect(PAD, divY, maxW, 2);

  // Currently
  setFont(ctx, `500 28px ${SANS}`, '0px');
  ctx.fillStyle = MUTED;
  ctx.fillText('Currently:', PAD, divY + 70);

  fitFont(ctx, 'Building Modern Web & Mobile Apps', maxW, (s) => `600 ${s}px ${SANS}`, 40, () => '-0.6px');
  ctx.fillStyle = INK;
  ctx.fillText('Building Modern Web & Mobile Apps', PAD, divY + 124);

  // Core Stack
  setFont(ctx, `500 28px ${SANS}`, '0px');
  ctx.fillStyle = MUTED;
  ctx.fillText('Core Stack:', PAD, divY + 195);

  let x = PAD;
  const py = divY + 222;
  x += pill(ctx, x, py, 'React', { fill: INK, color: '#ffffff' }) + 8;
  x += pill(ctx, x, py, 'React Native', { fill: ACCENT, color: '#ffffff' }) + 8;
  x += pill(ctx, x, py, 'Laravel', { stroke: INK, color: INK }) + 8;
  pill(ctx, x, py, 'Express', { stroke: INK, color: INK });
}

// ── Card back ────────────────────────────────────────────────────────────────
export function drawCardBack(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  paintPaper(ctx, W, H);

  ctx.textAlign = 'center';
  setFont(ctx, `800 120px ${SANS}`, '-6px');
  ctx.fillStyle = '#d9d9dd';
  ctx.fillText('Hadi.', W / 2, H / 2 + 40);
  ctx.textAlign = 'left';
}

// ── Lanyard fabric ───────────────────────────────────────────────────────────
function drawStrap(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, W, H);

  // Woven ribs
  for (let y = 0; y < H; y += 4) {
    ctx.fillStyle = y % 8 === 0 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, y, W, 2);
  }

  // Soft centre sheen
  const sheen = ctx.createLinearGradient(0, 0, W, 0);
  sheen.addColorStop(0, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.5, 'rgba(255,255,255,0.05)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, W, H);

  // Edge stitching
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 7]);
  [12, W - 12].forEach((sx) => {
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, H);
    ctx.stroke();
  });
}

// ── Texture factories ────────────────────────────────────────────────────────
function toTexture(canvas, anisotropy) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  return tex;
}

export function createBadgeTextures(anisotropy = 8) {
  const face = document.createElement('canvas');
  face.width = FACE_W;
  face.height = FACE_H;
  drawCardFace(face);

  const back = document.createElement('canvas');
  back.width = FACE_W / 2;
  back.height = FACE_H / 2;
  drawCardBack(back);

  const strap = document.createElement('canvas');
  strap.width = 128;
  strap.height = 256;
  drawStrap(strap);

  const strapTex = toTexture(strap, anisotropy);
  strapTex.wrapS = THREE.ClampToEdgeWrapping;
  strapTex.wrapT = THREE.RepeatWrapping;

  return {
    face: toTexture(face, anisotropy),
    back: toTexture(back, anisotropy),
    strap: strapTex,
  };
}

/** Repaints the card once the web fonts have arrived. */
export function repaintBadgeTextures(textures) {
  drawCardFace(textures.face.image);
  drawCardBack(textures.back.image);
  textures.face.needsUpdate = true;
  textures.back.needsUpdate = true;
}
