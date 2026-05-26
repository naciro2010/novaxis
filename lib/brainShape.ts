import type { Layout, FieldNode, Glyph } from './neuralField';

const GOLD = '#C9A24C';
const CHAMPAGNE = '#E4C77E';
const BRONZE = '#9A7B30';
const ASH = '#B7B7C2';

// Silhouette de cerveau humain de profil (face à gauche), définie par des
// points d'ancrage lisibles : lobe frontal bombé à gauche, circonvolutions
// sur le dessus, dessous plat, cervelet + tronc cérébral en bas-arrière.
const BRAIN_ANCHORS: [number, number][] = [
  [40, 36],
  [54, 24], [68, 32], [82, 22], [97, 31], [112, 22], [127, 31], [141, 28],
  [155, 38],
  [165, 54], [167, 72],
  [163, 84],
  [168, 94], [162, 107],
  [152, 112], [147, 118], [139, 113],
  [122, 114], [102, 112], [82, 115], [62, 113],
  [46, 107], [31, 94], [22, 76],
  [20, 57], [28, 43]
];

// Courbe fermée lisse (Catmull-Rom → Bézier) passant par les ancrages.
function catmullClosed(pts: [number, number][]): string {
  const n = pts.length;
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0]} ${p2[1]}`;
  }
  return d + ' Z';
}

const BRAIN_PATH = catmullClosed(BRAIN_ANCHORS);

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
    return { pts, bbox: { x: 14, y: 22, w: 172, h: 112 } };
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
  const outlineN = narrow ? 54 : 86;
  const interiorN = narrow ? 56 : 92;

  const { pts: outlinePts, bbox } = sampleOutline(outlineN);
  const interiorPts = sampleInterior(interiorN, bbox);

  const targetW = w * (narrow ? 0.84 : 0.66);
  const targetH = h * (narrow ? 0.5 : 0.8);
  const scale = Math.min(targetW / bbox.w, targetH / bbox.h);
  const bcx = bbox.x + bbox.w / 2;
  const bcy = bbox.y + bbox.h / 2;
  // Coordonnées centrées sur l'origine (la projection 3D ajoute le centre écran).
  const cnx = (p: P) => (p.x - bcx) * scale;
  const cny = (p: P) => (p.y - bcy) * scale;

  const halfW = (bbox.w * scale) / 2;
  const halfH = (bbox.h * scale) / 2;
  // Épaisseur modérée : assez pour le relief 3D, assez peu pour que la
  // silhouette reste lisible pendant la rotation.
  const thickness = halfH * 0.35;

  const interiorPalette = [GOLD, GOLD, BRONZE, CHAMPAGNE];
  const nodes: FieldNode[] = [];

  // Contour d'abord (relié en boucle → silhouette nette).
  outlinePts.forEach((p) => {
    nodes.push({
      x: cnx(p),
      y: cny(p),
      z: (Math.random() - 0.5) * thickness * 0.3,
      color: CHAMPAGNE,
      r: 1.5
    });
  });

  // Intérieur : volume ellipsoïdal (épaisseur max au centre) pour un vrai relief.
  interiorPts.forEach((p, i) => {
    const nx = cnx(p);
    const ny = cny(p);
    const rr = Math.min(1, Math.hypot(nx / (halfW || 1), ny / (halfH || 1)));
    const zMax = thickness * Math.sqrt(Math.max(0, 1 - rr * rr));
    nodes.push({
      x: nx,
      y: ny,
      z: (Math.random() - 0.5) * 2 * zMax,
      color: interiorPalette[i % interiorPalette.length],
      r: 1.25
    });
  });

  // Mathématiques : quelques-unes dans le cerveau, quelques-unes autour.
  const glyphs: Glyph[] = [];
  const glyphCount = narrow ? 12 : 20;
  const innerGlyphs = Math.round(glyphCount * 0.7);
  for (let i = 0; i < glyphCount; i++) {
    let gx: number;
    let gy: number;
    let gz: number;
    if (i < innerGlyphs && interiorPts.length > 0) {
      const p = interiorPts[Math.floor(Math.random() * interiorPts.length)];
      gx = cnx(p);
      gy = cny(p);
      gz = (Math.random() - 0.5) * thickness;
    } else {
      gx = (Math.random() - 0.5) * halfW * 2.5;
      gy = (Math.random() - 0.5) * halfH * 2.4;
      gz = (Math.random() - 0.5) * thickness;
    }
    glyphs.push({
      x: gx,
      y: gy,
      z: gz,
      ch: MATH[Math.floor(Math.random() * MATH.length)],
      size: (narrow ? 12 : 14) + Math.random() * (narrow ? 8 : 12),
      color: Math.random() < 0.5 ? GOLD : ASH,
      phase: Math.random() * Math.PI * 2,
      drift: 2 + Math.random() * 4
    });
  }

  return {
    nodes,
    maxDist: scale * 17,
    chain: outlinePts.length,
    glyphs,
    center: { x: w * (narrow ? 0.5 : 0.56), y: h * (narrow ? 0.46 : 0.5) }
  };
}
