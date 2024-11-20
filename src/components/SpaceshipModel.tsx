import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpaceshipModelProps {
  scale?: number;
}

export function SpaceshipModel({ scale = 1 }: SpaceshipModelProps) {
  const engineGlowRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (engineGlowRef.current) {
      const intensity = 1 + Math.sin(clock.getElapsedTime() * 10) * 0.2;
      engineGlowRef.current.intensity = intensity;
    }
  });

  return (
    <group scale={scale}>
      {/* Main body */}
      <mesh>
        <capsuleGeometry args={[0.5, 2, 4, 16]} />
        <meshStandardMaterial
          color="#3498db"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.3, 0.8]}>
        <sphereGeometry args={[0.4, 16, 16, 0, Math.PI]} />
        <meshPhysicalMaterial
          color="#87ceeb"
          transmission={0.9}
          thickness={0.5}
          roughness={0}
        />
      </mesh>

      {/* Wings */}
      <group>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.7, 0, -0.3]} rotation={[0, 0, side * Math.PI * 0.15]}>
            <boxGeometry args={[1, 0.1, 1]} />
            <meshStandardMaterial color="#2980b9" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Engine glow */}
      <pointLight
        ref={engineGlowRef}
        position={[0, 0, -1.5]}
        color="#00ffff"
        intensity={1}
        distance={3}
      />
      <mesh position={[0, 0, -1.2]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
    </group>
  );
}