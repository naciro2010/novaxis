'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type Node = { pos: THREE.Vector3; side: 0 | 1 };

function NetworkMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const { nodes, linePositions, lineColors, nodePositions, nodeColors } = useMemo(() => {
    const N = 90;
    const nodes: Node[] = [];
    for (let i = 0; i < N; i++) {
      const side: 0 | 1 = i < N / 2 ? 0 : 1;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 2.2 + (Math.random() - 0.5) * 0.4;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      const offsetX = side === 0 ? -1.6 : 1.6;
      nodes.push({ pos: new THREE.Vector3(x + offsetX, y, z), side });
    }

    const linePositions: number[] = [];
    const lineColors: number[] = [];

    const blue = new THREE.Color('#3B82F6');
    const violet = new THREE.Color('#8B5CF6');
    const emerald = new THREE.Color('#10B981');

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = nodes[i].pos.distanceTo(nodes[j].pos);
        if (d < 1.4) {
          const a = nodes[i];
          const b = nodes[j];
          linePositions.push(a.pos.x, a.pos.y, a.pos.z, b.pos.x, b.pos.y, b.pos.z);
          const col = a.side === b.side ? (a.side === 0 ? blue : violet) : emerald;
          lineColors.push(col.r, col.g, col.b, col.r, col.g, col.b);
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

    return {
      nodes,
      linePositions: new Float32Array(linePositions),
      lineColors: new Float32Array(lineColors),
      nodePositions,
      nodeColors
    };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      const targetY = mouse.current.x * 0.4;
      const targetX = -mouse.current.y * 0.2;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
      groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.05;
      const fuse = (Math.sin(t * 0.25) + 1) * 0.5;
      groupRef.current.position.x = -fuse * 0.3;
    }
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.size = 0.07 + Math.sin(t * 1.4) * 0.012;
    }
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.35 + Math.sin(t * 0.8) * 0.1;
    }
  });

  // Track mouse
  useFrame(({ pointer }) => {
    mouse.current.x += (pointer.x - mouse.current.x) * 0.08;
    mouse.current.y += (pointer.y - mouse.current.y) * 0.08;
  });

  return (
    <group ref={groupRef} scale={viewport.width < 6 ? 0.7 : 1}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodes.length}
            array={nodePositions}
            itemSize={3}
            args={[nodePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={nodes.length}
            array={nodeColors}
            itemSize={3}
            args={[nodeColors, 3]}
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

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={lineColors.length / 3}
            array={lineColors}
            itemSize={3}
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Center fusion glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color="#F5F5F7" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export default function NetworkScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <NetworkMesh />
    </Canvas>
  );
}
