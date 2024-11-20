import { useRef, useState } from 'react';
import { Sphere, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Atmosphere from './planetFeatures/Atmosphere';
import PlanetSurface from './planetFeatures/PlanetSurface';

interface PlanetProps {
  name: string;
  radius: number;
  position: [number, number, number];
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  showLabel?: boolean;
  type: 'rocky' | 'gas' | 'ice';
  onClick?: () => void;
}

export default function Planet({
  name,
  radius,
  position,
  color,
  orbitRadius,
  orbitSpeed,
  rotationSpeed,
  showLabel = true,
  type,
  onClick
}: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      orbitRef.current += delta * orbitSpeed;
      meshRef.current.position.x = Math.cos(orbitRef.current) * orbitRadius;
      meshRef.current.position.z = Math.sin(orbitRef.current) * orbitRadius;
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  const atmosphereColor = type === 'gas' 
    ? color 
    : type === 'rocky' 
      ? '#6495ED'
      : '#E0FFFF';

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <Sphere args={[radius, 64, 64]}>
          <meshStandardMaterial visible={false} />
        </Sphere>
        
        <PlanetSurface
          planetType={type}
          baseColor={color}
          scale={radius * 2}
        />
        
        {type !== 'rocky' && (
          <Atmosphere
            radius={radius}
            color={atmosphereColor}
            opacity={type === 'gas' ? 0.6 : 0.3}
          />
        )}

        {showLabel && (
          <Html
            position={[0, radius + 0.5, 0]}
            center
            className="pointer-events-none"
          >
            <div className={`text-white text-sm ${hovered ? 'bg-white/20' : 'bg-black/50'} px-2 py-1 rounded transition-colors`}>
              {name}
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
}