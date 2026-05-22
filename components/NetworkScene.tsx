'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type Node = { pos: THREE.Vector3; side: 0 | 1 };

function BrainNet() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const signalRef = useRef<THREE.Points>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const data = useMemo(() => {
    const N = 120;
    const rx = 2.45;
    const ry = 1.8;
    const rz = 2.0;
    const gap = 0.16; // demi-fissure longitudinale entre les deux hémisphères

    const blue = new THREE.Color('#3B82F6');
    const violet = new THREE.Color('#8B5CF6');
    const emerald = new THREE.Color('#10B981');

    // Bruit léger pour suggérer les circonvolutions du cortex.
    const fold = (phi: number, theta: number) =>
      0.13 * Math.sin(theta * 5 + phi * 2) +
      0.09 * Math.cos(phi * 4 - theta * 3) +
      0.05 * Math.sin(theta * 9 + 1.7);

    const nodes: Node[] = [];
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const noise = 1 + fold(phi, theta);
      let x = rx * Math.sin(phi) * Math.cos(theta) * noise;
      let y = ry * Math.cos(phi) * noise;
      const z = rz * Math.sin(phi) * Math.sin(theta) * noise;
      if (y < 0) y *= 0.82; // base du cerveau plus plate
      const side: 0 | 1 = x < 0 ? 0 : 1;
      x += (x < 0 ? -1 : 1) * gap; // ouvre la fissure centrale
      nodes.push({ pos: new THREE.Vector3(x, y, z), side });
    }

    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const edges: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = nodes[i].pos.distanceTo(nodes[j].pos);
        if (d < 1.02) {
          const a = nodes[i];
          const b = nodes[j];
          linePositions.push(a.pos.x, a.pos.y, a.pos.z, b.pos.x, b.pos.y, b.pos.z);
          // Fibres inter-hémisphériques (corps calleux) en émeraude, sinon couleur du lobe.
          const col = a.side === b.side ? (a.side === 0 ? blue : violet) : emerald;
          lineColors.push(col.r, col.g, col.b, col.r, col.g, col.b);
          edges.push({ a: a.pos, b: b.pos });
        }
      }
    }

    const nodePositions = new Float32Array(nodes.flatMap((n) => [n.pos.x, n.pos.y, n.pos.z]));
    const nodeColors = new Float32Array(
      nodes.flatMap((n) => {
        const c = n.side === 0 ? blue : violet;
        return [c.r, c.g, c.b];
      })
    );

    // Impulsions (signaux neuronaux) qui circulent sur un sous-ensemble d'arêtes.
    const K = Math.min(20, edges.length);
    const picks: { a: THREE.Vector3; b: THREE.Vector3; phase: number; speed: number }[] = [];
    for (let k = 0; k < K; k++) {
      const e = edges[Math.floor(Math.random() * edges.length)];
      picks.push({ a: e.a, b: e.b, phase: Math.random(), speed: 0.25 + Math.random() * 0.5 });
    }
    const signalPositions = new Float32Array(Math.max(K, 1) * 3);

    return {
      nodes,
      linePositions: new Float32Array(linePositions),
      lineColors: new Float32Array(lineColors),
      nodePositions,
      nodeColors,
      picks,
      signalPositions
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      const targetY = mouse.current.x * 0.5 + t * 0.08; // parallaxe souris + lente rotation continue
      const targetX = -mouse.current.y * 0.2;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
      groupRef.current.rotation.z = Math.sin(t * 0.12) * 0.04;
    }
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.size = 0.07 + Math.sin(t * 1.4) * 0.01;
    }
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.32 + Math.sin(t * 0.8) * 0.08;
    }
    if (signalRef.current && data.picks.length) {
      const arr = data.signalPositions;
      for (let k = 0; k < data.picks.length; k++) {
        const p = data.picks[k];
        const f = (p.phase + t * p.speed) % 1;
        const tt = f < 0.5 ? f * 2 : (1 - f) * 2; // aller-retour le long de la synapse
        arr[k * 3] = p.a.x + (p.b.x - p.a.x) * tt;
        arr[k * 3 + 1] = p.a.y + (p.b.y - p.a.y) * tt;
        arr[k * 3 + 2] = p.a.z + (p.b.z - p.a.z) * tt;
      }
      (signalRef.current.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  // Suivi souris lissé
  useFrame(({ pointer }) => {
    mouse.current.x += (pointer.x - mouse.current.x) * 0.08;
    mouse.current.y += (pointer.y - mouse.current.y) * 0.08;
  });

  return (
    <group ref={groupRef} scale={viewport.width < 6 ? 0.72 : 1}>
      {/* Neurones */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={data.nodes.length}
            array={data.nodePositions}
            itemSize={3}
            args={[data.nodePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={data.nodes.length}
            array={data.nodeColors}
            itemSize={3}
            args={[data.nodeColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.08}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Synapses */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={data.linePositions.length / 3}
            array={data.linePositions}
            itemSize={3}
            args={[data.linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={data.lineColors.length / 3}
            array={data.lineColors}
            itemSize={3}
            args={[data.lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.38}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Impulsions neuronales */}
      <points ref={signalRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={data.picks.length}
            array={data.signalPositions}
            itemSize={3}
            args={[data.signalPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#E0F2FE"
          size={0.13}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Lueur centrale */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshBasicMaterial color="#F5F5F7" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export default function NetworkScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.8], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <BrainNet />
    </Canvas>
  );
}
