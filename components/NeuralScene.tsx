'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useCanvasActive } from '@/lib/useCanvasActive';

// Palette signature iris / bleu électrique / violet clair (esprit Revolut).
const GOLD = new THREE.Color('#7C5CFF'); // iris
const CHAMPAGNE = new THREE.Color('#A78BFF'); // violet clair
const BRONZE = new THREE.Color('#4D7CFF'); // bleu électrique

type Net = {
  nodes: THREE.Vector3[];
  edges: [number, number][];
  adjacency: number[][];
};

// Construit un réseau de neurones : nœuds dispersés, reliés par des synapses
// (les plus courtes d'abord, degré plafonné) et garantis sans nœud isolé.
function buildNetwork(count: number, spreadX: number, spreadY: number, spreadZ: number, maxDist: number, maxDegree: number): Net {
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * spreadX,
        (Math.random() - 0.5) * spreadY,
        (Math.random() - 0.5) * spreadZ
      )
    );
  }

  const adjacency: number[][] = Array.from({ length: count }, () => []);
  const degree = new Array(count).fill(0);
  const edges: [number, number][] = [];

  const pairs: { i: number; j: number; d: number }[] = [];
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const d = nodes[i].distanceTo(nodes[j]);
      if (d < maxDist) pairs.push({ i, j, d });
    }
  }
  pairs.sort((a, b) => a.d - b.d);
  for (const { i, j } of pairs) {
    if (degree[i] >= maxDegree || degree[j] >= maxDegree) continue;
    edges.push([i, j]);
    adjacency[i].push(j);
    adjacency[j].push(i);
    degree[i]++;
    degree[j]++;
  }

  // Rattache tout nœud orphelin à son plus proche voisin.
  for (let i = 0; i < count; i++) {
    if (adjacency[i].length > 0) continue;
    let best = -1;
    let bd = Infinity;
    for (let j = 0; j < count; j++) {
      if (j === i) continue;
      const d = nodes[i].distanceTo(nodes[j]);
      if (d < bd) {
        bd = d;
        best = j;
      }
    }
    if (best >= 0) {
      edges.push([i, best]);
      adjacency[i].push(best);
      adjacency[best].push(i);
    }
  }

  return { nodes, edges, adjacency };
}

// Texture ronde douce : transforme chaque point carré en pastille de neurone.
function makeDotTexture(): THREE.Texture {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

type Pulse = { from: number; to: number; t: number; speed: number };

function Network() {
  const { viewport } = useThree();
  const isNarrow = viewport.width < 7;

  const net = useMemo(
    () => buildNetwork(isNarrow ? 34 : 52, 20, 12, 5, 3.4, 4),
    [isNarrow]
  );
  const dotTex = useMemo(() => makeDotTexture(), []);

  const lineGeom = useMemo(() => {
    const positions = new Float32Array(net.edges.length * 2 * 3);
    net.edges.forEach(([i, j], k) => {
      const a = net.nodes[i];
      const b = net.nodes[j];
      positions.set([a.x, a.y, a.z, b.x, b.y, b.z], k * 6);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [net]);

  const nodeGeom = useMemo(() => {
    const positions = new Float32Array(net.nodes.length * 3);
    const colors = new Float32Array(net.nodes.length * 3);
    const palette = [GOLD, CHAMPAGNE, BRONZE];
    net.nodes.forEach((n, i) => {
      positions.set([n.x, n.y, n.z], i * 3);
      const c = palette[i % palette.length];
      colors.set([c.r, c.g, c.b], i * 3);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, [net]);

  const pulseCount = isNarrow ? 6 : 10;
  const pulsePos = useMemo(() => new Float32Array(pulseCount * 3), [pulseCount]);
  const pulseGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
    return g;
  }, [pulsePos]);

  const pulses = useMemo<Pulse[]>(() => {
    return Array.from({ length: pulseCount }, () => {
      const [a, b] = net.edges[Math.floor(Math.random() * net.edges.length)];
      const forward = Math.random() < 0.5;
      return {
        from: forward ? a : b,
        to: forward ? b : a,
        t: Math.random(),
        speed: 0.28 + Math.random() * 0.4
      };
    });
  }, [net, pulseCount]);

  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const reduced = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    // Impulsions qui circulent de synapse en synapse (potentiel d'action).
    for (let p = 0; p < pulses.length; p++) {
      const pulse = pulses[p];
      pulse.t += dt * pulse.speed;
      while (pulse.t >= 1) {
        pulse.t -= 1;
        const prev = pulse.from;
        pulse.from = pulse.to;
        const nbrs = net.adjacency[pulse.from];
        let next = nbrs[Math.floor(Math.random() * nbrs.length)];
        if (nbrs.length > 1 && next === prev) {
          next = nbrs[(nbrs.indexOf(next) + 1) % nbrs.length];
        }
        pulse.to = next ?? prev;
      }
      const a = net.nodes[pulse.from];
      const b = net.nodes[pulse.to];
      const i3 = p * 3;
      pulsePos[i3] = a.x + (b.x - a.x) * pulse.t;
      pulsePos[i3 + 1] = a.y + (b.y - a.y) * pulse.t;
      pulsePos[i3 + 2] = a.z + (b.z - a.z) * pulse.t;
    }
    pulseGeom.attributes.position.needsUpdate = true;

    if (groupRef.current && !reduced.current) {
      const t = state.clock.elapsedTime;
      const targetY = mouse.current.x * 0.22 + Math.sin(t * 0.05) * 0.12;
      const targetX = -mouse.current.y * 0.16 + Math.cos(t * 0.04) * 0.08;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.03;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.03;
    }
  });

  useFrame(({ pointer }) => {
    if (reduced.current) return;
    mouse.current.x += (pointer.x - mouse.current.x) * 0.05;
    mouse.current.y += (pointer.y - mouse.current.y) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial
          color={GOLD}
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <points geometry={nodeGeom}>
        <pointsMaterial
          map={dotTex}
          vertexColors
          size={0.16}
          sizeAttenuation
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points geometry={pulseGeom}>
        <pointsMaterial
          map={dotTex}
          color={CHAMPAGNE}
          size={0.26}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function NeuralScene() {
  // Fond plein écran : toujours « en vue », mais on coupe le rendu quand
  // l'onglet est masqué (économie GPU/batterie, pas de saut au retour).
  const { ref, active } = useCanvasActive<HTMLDivElement>();
  return (
    <div ref={ref} className="h-full w-full">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Network />
      </Canvas>
    </div>
  );
}
