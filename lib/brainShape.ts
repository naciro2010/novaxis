import type { Layout, FieldNode, Glyph } from './neuralField';

const GOLD = '#C9A24C';
const CHAMPAGNE = '#E4C77E';
const BRONZE = '#9A7B30';
const ASH = '#9A9AA6';

// Silhouette stylisée d'un cerveau humain de profil (lobe frontal à gauche,
// circonvolutions sur le dessus, cervelet en bas-arrière, tronc cérébral).
const BRAIN_PATH =
  'M 52 58 C 38 60 26 72 24 88 C 22 102 26 116 36 126 C 42 134 50 132 58 138 ' +
  'C 66 144 74 142 84 146 C 96 150 104 148 112 150 C 116 158 122 158 126 150 ' +
  'C 138 150 152 156 166 148 C 180 140 190 128 194 112 C 198 100 198 90 192 80 ' +
  'C 186 70 180 80 172 72 C 164 64 158 76 150 68 C 142 60 136 74 128 66 ' +
  'C 120 58 114 72 106 64 C 98 56 92 70 84 62 C 76 54 68 66 60 60 C 57 58 54 57 52 58 Z';

const MATH = [
  '∑', '∫', '∂', 'π', '∞', '√', '∇', 'λ', 'θ', 'Φ', 'δ', 'µ',
  'α', 'β', 'Σ', '∮', '≈', 'ƒ', 'e', 'i', 'n²', '½', '∆', 'Ω'
];

type P = { x: number; y: number };

function sampleOutline(count: number): { pts: P[]; bbox: { x: number; y: number; w: number; h: number } } {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.style.left = '-9999px';
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', BRAIN_PATH);
  svg.appendChild(path);
  document.body.appendChild(svg);

  const pts: P[] = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const len = path.getTotalLength() || 0;
  if (len > 0) {
    for (let i = 0; i < count; i++) {
      const pt = path.getPointAtLength((i / count) * len);
      pts.push({ x: pt.x, y: pt.y });
      if (pt.x < minX) minX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y > maxY) maxY = pt.y;
    }
  }
  document.body.removeChild(svg);

  if (pts.length === 0) {
    return { pts, bbox: { x: 24, y: 54, w: 174, h: 104 } };
  }
  return { pts, bbox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY } };
}

function sampleInterior(count: number, bbox: { x: number; y: number; w: number; h: number }): P[] {
  const off = document.createElement('canvas');
  off.width = 1;
  off.height = 1;
  const octx = off.getContext('2d')!;
  const p2d = new Path2D(BRAIN_PATH);
  const out: P[] = [];
  let attempts = 0;
  const limit = count * 60;
  while (out.length < count && attempts < limit) {
    attempts++;
    const px = bbox.x + Math.random() * bbox.w;
    const py = bbox.y + Math.random() * bbox.h;
    if (octx.isPointInPath(p2d, px, py)) out.push({ x: px, y: py });
  }
  return out;
}

export function buildBrainLayout(w: number, h: number): Layout {
  const narrow = w < 640;
  const outlineN = narrow ? 46 : 60;
  const interiorN = narrow ? 52 : 78;

  const { pts: outlinePts, bbox } = sampleOutline(outlineN);
  const interiorPts = sampleInterior(interiorN, bbox);

  // Cadre le cerveau dans le hero (un peu vers la droite, derrière le texte).
  const targetW = w * (narrow ? 0.82 : 0.6);
  const targetH = h * (narrow ? 0.52 : 0.78);
  const scale = Math.min(targetW / bbox.w, targetH / bbox.h);
  const cx = w * (narrow ? 0.5 : 0.58);
  const cy = h * (narrow ? 0.46 : 0.5);
  const bcx = bbox.x + bbox.w / 2;
  const bcy = bbox.y + bbox.h / 2;
  const map = (p: P): P => ({ x: cx + (p.x - bcx) * scale, y: cy + (p.y - bcy) * scale });

  const interiorPalette = [GOLD, GOLD, BRONZE, CHAMPAGNE];
  const nodes: FieldNode[] = [];

  // Le contour d'abord (relié en boucle → silhouette nette).
  outlinePts.forEach((p) => {
    const m = map(p);
    nodes.push({ x: m.x, y: m.y, color: CHAMPAGNE, r: 1.4 });
  });
  interiorPts.forEach((p, i) => {
    const m = map(p);
    nodes.push({ x: m.x, y: m.y, color: interiorPalette[i % interiorPalette.length], r: 1.15 });
  });

  // Mathématiques mêlées aux neurones : quelques-unes dans le cerveau,
  // quelques-unes autour.
  const glyphs: Glyph[] = [];
  const glyphCount = narrow ? 12 : 18;
  const innerGlyphs = Math.round(glyphCount * 0.7);
  for (let i = 0; i < glyphCount; i++) {
    let pos: P;
    if (i < innerGlyphs && interiorPts.length > 0) {
      pos = map(interiorPts[Math.floor(Math.random() * interiorPts.length)]);
    } else {
      pos = {
        x: cx + (Math.random() - 0.5) * targetW * 1.25,
        y: cy + (Math.random() - 0.5) * targetH * 1.15
      };
    }
    glyphs.push({
      x: pos.x,
      y: pos.y,
      ch: MATH[Math.floor(Math.random() * MATH.length)],
      size: (narrow ? 12 : 14) + Math.random() * (narrow ? 8 : 12),
      color: Math.random() < 0.5 ? GOLD : ASH,
      phase: Math.random() * Math.PI * 2,
      drift: 2 + Math.random() * 4
    });
  }

  return {
    nodes,
    maxDist: scale * 26,
    chain: outlinePts.length,
    glyphs
  };
}
