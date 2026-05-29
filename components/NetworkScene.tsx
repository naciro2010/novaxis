'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useCanvasActive } from '@/lib/useCanvasActive';

const GOLD = '#7C5CFF';
const CHAMPAGNE = '#A78BFF';
const BRONZE = '#4D7CFF';
const BONE = '#F5F5F7';

type Orbit = {
  euler: [number, number, number];
  rx: number;
  rz: number;
  speed: number;
  phase: number;
  ring: string;
  electron: string;
  eRadius: number;
};

function OrbitRing({ orbit }: { orbit: Orbit }) {
  const electronRef = useRef<THREE.Mesh>(null);

  const ringPositions = useMemo(() => {
    const seg = 100;
    const arr = new Float32Array((seg + 1) * 3);
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * orbit.rx;
      arr[i * 3 + 1] = 0;
      arr[i * 3 + 2] = Math.sin(a) * orbit.rz;
    }
    return arr;
  }, [orbit.rx, orbit.rz]);

  useFrame((state) => {
    if (!electronRef.current) return;
    const a = orbit.phase + state.clock.elapsedTime * orbit.speed;
    electronRef.current.position.set(Math.cos(a) * orbit.rx, 0, Math.sin(a) * orbit.rz);
  });

  return (
    <group rotation={orbit.euler}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={ringPositions.length / 3}
            array={ringPositions}
            itemSize={3}
            args={[ringPositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={orbit.ring} transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} />
      </line>
      <mesh ref={electronRef}>
        <sphereGeometry args={[orbit.eRadius, 16, 16]} />
        <meshBasicMaterial color={orbit.electron} transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Nucleus() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.04;
    ref.current.scale.setScalar(s);
  });
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.6} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshBasicMaterial color={CHAMPAGNE} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function AtomSystem() {
  const groupRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const orbits = useMemo<Orbit[]>(() => {
    const rings = [GOLD, GOLD, CHAMPAGNE, GOLD, BRONZE, CHAMPAGNE];
    const electrons = [CHAMPAGNE, BONE, GOLD, CHAMPAGNE, GOLD, BONE];
    return Array.from({ length: 6 }, (_, i) => {
      const r = 1.55 + i * 0.21;
      return {
        euler: [
          (Math.PI / 6) * (i + 1) + Math.random() * 0.5,
          (Math.PI / 3) * i + Math.random() * 0.5,
          Math.random() * Math.PI
        ] as [number, number, number],
        rx: r,
        rz: r * (0.55 + Math.random() * 0.18),
        speed: 0.5 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        ring: rings[i],
        electron: electrons[i],
        eRadius: 0.07 + Math.random() * 0.03
      };
    });
  }, []);

  // Poussière d'or en arrière-plan (ambiance « éléments »)
  const dust = useMemo(() => {
    const N = 90;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 11;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      const targetY = mouse.current.x * 0.5 + t * 0.07;
      const targetX = -mouse.current.y * 0.25;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y = t * 0.02;
    }
  });

  useFrame(({ pointer }) => {
    mouse.current.x += (pointer.x - mouse.current.x) * 0.08;
    mouse.current.y += (pointer.y - mouse.current.y) * 0.08;
  });

  return (
    <>
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={dust.length / 3} array={dust} itemSize={3} args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial color={GOLD} size={0.035} sizeAttenuation transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      <group ref={groupRef} scale={viewport.width < 6 ? 0.7 : 1}>
        <Nucleus />
        {orbits.map((o, i) => (
          <OrbitRing key={i} orbit={o} />
        ))}
      </group>
    </>
  );
}

export default function NetworkScene() {
  // L'atome n'est visible que dans le hero : on gèle son rendu dès qu'il sort
  // du champ (scroll) ou que l'onglet passe en arrière-plan.
  const { ref, active } = useCanvasActive<HTMLDivElement>();
  return (
    <div ref={ref} className="h-full w-full">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <AtomSystem />
      </Canvas>
    </div>
  );
}
