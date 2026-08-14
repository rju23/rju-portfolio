import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const PARTICLE_COUNT = 420;
const WAVE_COUNT     = 6;

const WAVES = [
  { y: -0.7,  amp: 0.30, freq: 1.1, phase: 0.0  },
  { y: -0.95, amp: 0.25, freq: 0.9, phase: 0.7  },
  { y: -1.2,  amp: 0.35, freq: 1.3, phase: 1.4  },
  { y: -0.5,  amp: 0.22, freq: 1.0, phase: 2.1  },
  { y: -1.45, amp: 0.28, freq: 1.2, phase: 0.35 },
  { y: -0.35, amp: 0.18, freq: 0.8, phase: 1.8  },
];

function Particles() {
  const pointsRef = useRef();

  const particleData = useMemo(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      waveIndex : i % WAVE_COUNT,
      progress  : Math.random(),
      speed     : 0.0006 + Math.random() * 0.0014,
      offset    : (Math.random() - 0.5) * 0.28,
      brightness: 0.35 + Math.random() * 0.65,
      zJitter   : (Math.random() - 0.5) * 0.6,
    }))
  , []);

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const colors    = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t       = clock.elapsedTime;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const colAttr = pointsRef.current.geometry.attributes.color;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p    = particleData[i];
      p.progress += p.speed;
      if (p.progress > 1) p.progress -= 1;

      const wave = WAVES[p.waveIndex];
      const x    = (p.progress - 0.5) * 11;
      const y    = wave.y
                 + Math.sin(p.progress * Math.PI * 2 * wave.freq + wave.phase + t * 0.38) * wave.amp
                 + p.offset;

      const edge  = Math.min(p.progress, 1 - p.progress) * 5;
      const alpha = Math.min(edge, 1) * p.brightness;

      posAttr.array[i * 3]     = x;
      posAttr.array[i * 3 + 1] = y;
      posAttr.array[i * 3 + 2] = p.zJitter;

      // warm amber — upper waves brighter, lower cooler
      const warm = p.waveIndex < 3 ? 1 : 0.75;
      colAttr.array[i * 3]     = 0.92 * alpha * warm;
      colAttr.array[i * 3 + 1] = 0.60 * alpha * warm;
      colAttr.array[i * 3 + 2] = 0.24 * alpha;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={PARTICLE_COUNT} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        vertexColors
        transparent
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Spheres() {
  return (
    <>
      <mesh position={[3.6, 1.9, -0.5]}>
        <sphereGeometry args={[0.46, 48, 48]} />
        <meshStandardMaterial color="#2a2318" roughness={0.35} metalness={0.45} />
      </mesh>

      <mesh position={[4.4, -3.1, -0.2]}>
        <sphereGeometry args={[1.2, 48, 48]} />
        <meshStandardMaterial color="#221d16" roughness={0.3} metalness={0.45} />
      </mesh>

      <mesh position={[-4.2, -0.9, -0.8]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#1e1a14" roughness={0.3} metalness={0.5} />
      </mesh>
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.18} color="#2a2318" />
      <pointLight position={[5, 4, 3]}  intensity={1.8} color="#C8844A" distance={18} decay={2} />
      <pointLight position={[-4, -3, 2]} intensity={0.4} color="#7060b0" distance={9}  decay={2} />
    </>
  );
}

export default function Background3D() {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 5], fov: 55 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#151413"]} />
      <Lights />
      <Spheres />
      <Particles />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.08}
          luminanceSmoothing={0.85}
          intensity={1.4}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}