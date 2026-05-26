// Moteur de rendu neuronal en Canvas2D : léger, fluide et stable (pas de WebGL).
// Sert à la fois au fond global (champ de neurones) et au cerveau du hero.

export type FieldNode = { x: number; y: number; color: string; r: number };
export type Glyph = {
  x: number;
  y: number;
  ch: string;
  size: number;
  color: string;
  phase: number;
  drift: number;
};

export type Layout = {
  nodes: FieldNode[];
  maxDist: number;
  // Les `chain` premiers nœuds forment un contour fermé tracé en continu.
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
  nodeOpacity?: number;
  pulseColor?: string;
  pulseOpacity?: number;
  glyphOpacity?: number;
  parallax?: number;
  sway?: number;
  speed?: number;
};

type Pulse = { from: number; to: number; t: number; speed: number };

const TWO_PI = Math.PI * 2;

function dist2(a: FieldNode, b: FieldNode) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
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

  // Contour du cerveau : relie les nœuds consécutifs en boucle fermée.
  for (let k = 0; k < chain; k++) {
    const i = k;
    const j = (k + 1) % chain;
    if (i !== j) addEdge(i, j);
  }

  // Synapses de proximité (les plus courtes d'abord, degré plafonné).
  const cand: { i: number; j: number; d: number }[] = [];
  const maxD2 = maxDist * maxDist;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = dist2(nodes[i], nodes[j]);
      if (d < maxD2) cand.push({ i, j, d });
    }
  }
  cand.sort((a, b) => a.d - b.d);
  for (const { i, j } of cand) {
    if (deg[i] >= maxDegree || deg[j] >= maxDegree) continue;
    if (adj[i].includes(j)) continue;
    addEdge(i, j);
  }

  // Aucun nœud isolé.
  for (let i = 0; i < n; i++) {
    if (adj[i].length > 0) continue;
    let best = -1;
    let bd = Infinity;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const d = dist2(nodes[i], nodes[j]);
      if (d < bd) {
        bd = d;
        best = j;
      }
    }
    if (best >= 0) addEdge(i, best);
  }

  return { edges, adj };
}

const spriteCache = new Map<string, HTMLCanvasElement>();

function glowSprite(color: string, diameter: number): HTMLCanvasElement {
  const key = `${color}@${diameter}`;
  const cached = spriteCache.get(key);
  if (cached) return cached;
  const c = document.createElement('canvas');
  const d = Math.max(4, Math.ceil(diameter));
  c.width = d;
  c.height = d;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(d / 2, d / 2, 0, d / 2, d / 2, d / 2);
  g.addColorStop(0, color);
  g.addColorStop(0.4, color);
  g.addColorStop(1, 'transparent');
  ctx.globalAlpha = 1;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(d / 2, d / 2, d / 2, 0, TWO_PI);
  ctx.fill();
  spriteCache.set(key, c);
  return c;
}

export function createNeuralRenderer(canvas: HTMLCanvasElement, config: NeuralConfig) {
  const ctx = canvas.getContext('2d', { alpha: true })!;
  const {
    maxDegree = 5,
    pulseCount = 8,
    lineColor = '#C9A24C',
    lineWidth = 1,
    lineOpacity = 0.16,
    nodeOpacity = 0.7,
    pulseColor = '#E4C77E',
    pulseOpacity = 0.95,
    glyphOpacity = 0.12,
    parallax = 14,
    sway = 6,
    speed = 1
  } = config;

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes: FieldNode[] = [];
  let edges: number[] = [];
  let adj: number[][] = [];
  let glyphs: Glyph[] = [];
  let pulses: Pulse[] = [];

  const mouse = { x: 0, y: 0 };
  const offset = { x: 0, y: 0 };
  let raf = 0;
  let running = true;
  let last = 0;
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;

  function build() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const layout = config.layout(width, height);
    nodes = layout.nodes;
    glyphs = layout.glyphs ?? [];
    const c = connect(nodes, layout.maxDist, maxDegree, layout.chain ?? 0);
    edges = c.edges;
    adj = c.adj;

    const edgeCount = edges.length / 2;
    pulses = Array.from({ length: Math.min(pulseCount, edgeCount) }, () => {
      const e = Math.floor(Math.random() * edgeCount) * 2;
      const fwd = Math.random() < 0.5;
      return {
        from: fwd ? edges[e] : edges[e + 1],
        to: fwd ? edges[e + 1] : edges[e],
        t: Math.random(),
        speed: 0.22 + Math.random() * 0.4
      };
    });
  }

  function draw(dt: number) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    if (!reduced) {
      const tx = mouse.x * parallax;
      const ty = mouse.y * parallax;
      offset.x += (tx - offset.x) * 0.05;
      offset.y += (ty - offset.y) * 0.05;
    }
    const sx = offset.x + (reduced ? 0 : Math.sin(last / 4200) * sway);
    const sy = offset.y + (reduced ? 0 : Math.cos(last / 5200) * sway);

    ctx.save();
    ctx.translate(sx, sy);
    ctx.globalCompositeOperation = 'lighter';

    // Synapses
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    for (let k = 0; k < edges.length; k += 2) {
      const a = nodes[edges[k]];
      const b = nodes[edges[k + 1]];
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();

    // Neurones
    ctx.globalAlpha = nodeOpacity;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const s = node.r * 6;
      const sprite = glowSprite(node.color, 48);
      ctx.drawImage(sprite, node.x - s / 2, node.y - s / 2, s, s);
    }

    // Impulsions
    if (!reduced) {
      const pSprite = glowSprite(pulseColor, 48);
      ctx.globalAlpha = pulseOpacity;
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
        const x = a.x + (b.x - a.x) * pulse.t;
        const y = a.y + (b.y - a.y) * pulse.t;
        const s = 9;
        ctx.drawImage(pSprite, x - s / 2, y - s / 2, s, s);
      }
    }

    // Mathématiques : glyphes discrets qui scintillent parmi les neurones.
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < glyphs.length; i++) {
      const gph = glyphs[i];
      const tw = reduced ? 1 : 0.6 + 0.4 * Math.sin(last / 1000 + gph.phase);
      const dy = reduced ? 0 : Math.sin(last / 3000 + gph.phase) * gph.drift;
      ctx.globalAlpha = glyphOpacity * tw;
      ctx.fillStyle = gph.color;
      ctx.font = `italic ${gph.size}px "Times New Roman", Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(gph.ch, gph.x, gph.y + dy);
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

  function onMouse(e: MouseEvent) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function onVisibility() {
    if (document.hidden) {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  }

  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      build();
      if (reduced) draw(0);
    }, 180);
  }

  build();
  if (reduced) {
    draw(0);
  } else {
    window.addEventListener('mousemove', onMouse, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(frame);
  }
  window.addEventListener('resize', onResize);

  return {
    destroy() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    }
  };
}
