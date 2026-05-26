// Moteur de rendu neuronal en Canvas2D avec projection 3D (perspective) :
// un nuage de neurones qui tourne doucement, fluide et stable, sans WebGL.

export type FieldNode = { x: number; y: number; z: number; color: string; r: number };
export type Glyph = {
  x: number;
  y: number;
  z: number;
  ch: string;
  size: number;
  color: string;
  phase: number;
  drift: number;
};

export type Layout = {
  nodes: FieldNode[];
  maxDist: number;
  center: { x: number; y: number };
  // Les `chain` premiers nœuds forment un contour fermé (silhouette).
  chain?: number;
  glyphs?: Glyph[];
};

export type NeuralConfig = {
  layout: (w: number, h: number) => Layout;
  maxDegree?: number;
  pulseCount?: number;
  lineColor?: string;
  lineWidth?: number;
  lineOpacity?: number;
  contourOpacity?: number;
  nodeOpacity?: number;
  pulseColor?: string;
  pulseOpacity?: number;
  glyphOpacity?: number;
  camFactor?: number;
  autoYaw?: number;
  yawOsc?: number;
  pitchOsc?: number;
  mouseYaw?: number;
  mousePitch?: number;
  speed?: number;
};

type Pulse = { from: number; to: number; t: number; speed: number };

const TWO_PI = Math.PI * 2;

function dist3(a: FieldNode, b: FieldNode) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

function connect(nodes: FieldNode[], maxDist: number, maxDegree: number, chain: number) {
  const n = nodes.length;
  const deg = new Array(n).fill(0);
  const adj: number[][] = Array.from({ length: n }, () => []);
  const edges: number[] = [];

  const addEdge = (i: number, j: number) => {
    edges.push(i, j);
    adj[i].push(j);
    adj[j].push(i);
    deg[i]++;
    deg[j]++;
  };

  // Contour fermé d'abord : ces arêtes sont tracées en premier (plus lumineuses).
  for (let k = 0; k < chain; k++) {
    const i = k;
    const j = (k + 1) % chain;
    if (i !== j) addEdge(i, j);
  }
  const chainEdges = edges.length / 2;

  const cand: { i: number; j: number; d: number }[] = [];
  const maxD2 = maxDist * maxDist;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = dist3(nodes[i], nodes[j]);
      if (d < maxD2) cand.push({ i, j, d });
    }
  }
  cand.sort((a, b) => a.d - b.d);
  for (const { i, j } of cand) {
    if (deg[i] >= maxDegree || deg[j] >= maxDegree) continue;
    if (adj[i].includes(j)) continue;
    addEdge(i, j);
  }

  for (let i = 0; i < n; i++) {
    if (adj[i].length > 0) continue;
    let best = -1;
    let bd = Infinity;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const d = dist3(nodes[i], nodes[j]);
      if (d < bd) {
        bd = d;
        best = j;
      }
    }
    if (best >= 0) addEdge(i, best);
  }

  return { edges, adj, chainEdges };
}

const spriteCache = new Map<string, HTMLCanvasElement>();

function glowSprite(color: string): HTMLCanvasElement {
  const cached = spriteCache.get(color);
  if (cached) return cached;
  const d = 48;
  const c = document.createElement('canvas');
  c.width = d;
  c.height = d;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(d / 2, d / 2, 0, d / 2, d / 2, d / 2);
  g.addColorStop(0, color);
  g.addColorStop(0.35, color);
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(d / 2, d / 2, d / 2, 0, TWO_PI);
  ctx.fill();
  spriteCache.set(color, c);
  return c;
}

export function createNeuralRenderer(canvas: HTMLCanvasElement, config: NeuralConfig) {
  const ctx = canvas.getContext('2d', { alpha: true })!;
  const {
    maxDegree = 5,
    pulseCount = 10,
    lineColor = '#C9A24C',
    lineWidth = 1.1,
    lineOpacity = 0.22,
    contourOpacity = 0.5,
    nodeOpacity = 0.85,
    pulseColor = '#F2D89B',
    pulseOpacity = 1,
    glyphOpacity = 0.18,
    camFactor = 1.5,
    autoYaw = 0,
    yawOsc = 0.16,
    pitchOsc = 0.05,
    mouseYaw = 0.32,
    mousePitch = 0.2,
    speed = 1
  } = config;

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let cam = 1000;
  let cx = 0;
  let cy = 0;
  let n = 0;
  let nodes: FieldNode[] = [];
  let edges: number[] = [];
  let adj: number[][] = [];
  let chainEdges = 0;
  let glyphs: Glyph[] = [];
  let pulses: Pulse[] = [];
  let px = new Float32Array(0);
  let py = new Float32Array(0);
  let psc = new Float32Array(0);

  const mouse = { tx: 0, ty: 0, cx: 0, cy: 0 };
  let raf = 0;
  let running = false;
  let tabVisible = typeof document !== 'undefined' ? !document.hidden : true;
  let onScreen = true;
  let last = 0;
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;
  let io: IntersectionObserver | null = null;

  function build() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    cam = Math.hypot(width, height) * camFactor;

    const layout = config.layout(width, height);
    nodes = layout.nodes;
    n = nodes.length;
    cx = layout.center.x;
    cy = layout.center.y;
    glyphs = layout.glyphs ?? [];
    const c = connect(nodes, layout.maxDist, maxDegree, layout.chain ?? 0);
    edges = c.edges;
    adj = c.adj;
    chainEdges = c.chainEdges;

    px = new Float32Array(n);
    py = new Float32Array(n);
    psc = new Float32Array(n);

    const edgeCount = edges.length / 2;
    pulses = Array.from({ length: Math.min(pulseCount, edgeCount) }, () => {
      const e = Math.floor(Math.random() * edgeCount) * 2;
      const fwd = Math.random() < 0.5;
      return {
        from: fwd ? edges[e] : edges[e + 1],
        to: fwd ? edges[e + 1] : edges[e],
        t: Math.random(),
        speed: 0.3 + Math.random() * 0.5
      };
    });
  }

  function draw(dt: number) {
    const tSec = last / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    if (!reduced) {
      mouse.cx += (mouse.tx - mouse.cx) * 0.06;
      mouse.cy += (mouse.ty - mouse.cy) * 0.06;
    }
    const ay = autoYaw * tSec + yawOsc * Math.sin(tSec * 0.3) + mouse.cx * mouseYaw;
    const ax = pitchOsc * Math.sin(tSec * 0.24) + mouse.cy * mousePitch;
    const cosY = Math.cos(ay);
    const sinY = Math.sin(ay);
    const cosX = Math.cos(ax);
    const sinX = Math.sin(ax);

    for (let i = 0; i < n; i++) {
      const node = nodes[i];
      const x1 = node.x * cosY + node.z * sinY;
      let z1 = -node.x * sinY + node.z * cosY;
      const y1 = node.y * cosX - z1 * sinX;
      z1 = node.y * sinX + z1 * cosX;
      const sc = cam / (cam - z1);
      px[i] = cx + x1 * sc;
      py[i] = cy - y1 * sc;
      psc[i] = sc;
    }

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = lineColor;

    // Synapses de proximité
    ctx.globalAlpha = lineOpacity;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    for (let k = chainEdges * 2; k < edges.length; k += 2) {
      const a = edges[k];
      const b = edges[k + 1];
      ctx.moveTo(px[a], py[a]);
      ctx.lineTo(px[b], py[b]);
    }
    ctx.stroke();

    // Contour (silhouette) plus lumineux
    if (chainEdges > 0) {
      ctx.globalAlpha = contourOpacity;
      ctx.lineWidth = lineWidth * 1.4;
      ctx.beginPath();
      for (let k = 0; k < chainEdges * 2; k += 2) {
        const a = edges[k];
        const b = edges[k + 1];
        ctx.moveTo(px[a], py[a]);
        ctx.lineTo(px[b], py[b]);
      }
      ctx.stroke();
    }

    // Neurones (taille + éclat selon la profondeur)
    for (let i = 0; i < n; i++) {
      const node = nodes[i];
      const sc = psc[i];
      const s = node.r * 6 * sc;
      ctx.globalAlpha = Math.min(1, nodeOpacity * Math.max(0.45, sc * 0.85));
      ctx.drawImage(glowSprite(node.color), px[i] - s / 2, py[i] - s / 2, s, s);
    }

    // Impulsions
    if (!reduced) {
      const pSprite = glowSprite(pulseColor);
      for (let p = 0; p < pulses.length; p++) {
        const pulse = pulses[p];
        pulse.t += dt * pulse.speed * speed;
        while (pulse.t >= 1) {
          pulse.t -= 1;
          const prev = pulse.from;
          pulse.from = pulse.to;
          const nbrs = adj[pulse.from];
          let next = nbrs[Math.floor(Math.random() * nbrs.length)];
          if (nbrs.length > 1 && next === prev) {
            next = nbrs[(nbrs.indexOf(next) + 1) % nbrs.length];
          }
          pulse.to = next ?? prev;
        }
        const a = nodes[pulse.from];
        const b = nodes[pulse.to];
        const wx = a.x + (b.x - a.x) * pulse.t;
        const wy = a.y + (b.y - a.y) * pulse.t;
        const wz = a.z + (b.z - a.z) * pulse.t;
        const x1 = wx * cosY + wz * sinY;
        let z1 = -wx * sinY + wz * cosY;
        const y1 = wy * cosX - z1 * sinX;
        z1 = wy * sinX + z1 * cosX;
        const sc = cam / (cam - z1);
        const s = 11 * sc;
        ctx.globalAlpha = pulseOpacity;
        ctx.drawImage(pSprite, cx + x1 * sc - s / 2, cy - y1 * sc - s / 2, s, s);
      }
    }

    // Mathématiques mêlées aux neurones
    if (glyphs.length > 0) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];
        const drift = reduced ? 0 : Math.sin(tSec + g.phase) * g.drift;
        const x1 = g.x * cosY + g.z * sinY;
        let z1 = -g.x * sinY + g.z * cosY;
        const y1 = (g.y + drift) * cosX - z1 * sinX;
        z1 = (g.y + drift) * sinX + z1 * cosX;
        const sc = cam / (cam - z1);
        const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(tSec * 1.3 + g.phase);
        ctx.globalAlpha = glyphOpacity * tw;
        ctx.fillStyle = g.color;
        ctx.font = `italic ${g.size * sc}px "Times New Roman", Georgia, serif`;
        ctx.fillText(g.ch, cx + x1 * sc, cy - y1 * sc);
      }
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function frame(t: number) {
    if (!running) return;
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
    last = t;
    draw(dt);
    raf = requestAnimationFrame(frame);
  }

  function evalRun() {
    const should = tabVisible && onScreen && !reduced;
    if (should && !running) {
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    } else if (!should && running) {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    }
  }

  function onMouse(e: MouseEvent) {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function onVisibility() {
    tabVisible = !document.hidden;
    evalRun();
  }

  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      build();
      if (reduced) draw(0);
    }, 180);
  }

  build();
  window.addEventListener('resize', onResize);
  if (reduced) {
    draw(0);
  } else {
    window.addEventListener('mousemove', onMouse, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
        evalRun();
      },
      { threshold: 0 }
    );
    io.observe(canvas);
    evalRun();
  }

  return {
    destroy() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (io) io.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVisibility);
    }
  };
}
