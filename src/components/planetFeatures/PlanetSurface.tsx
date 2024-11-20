import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import TerrainGeometry from './TerrainGeometry';

interface PlanetSurfaceProps {
  planetType: 'rocky' | 'gas' | 'ice';
  baseColor: string;
  roughness?: number;
  metalness?: number;
  scale?: number;
}

export default function PlanetSurface({
  planetType,
  baseColor,
  roughness = 0.7,
  metalness = 0.2,
  scale = 1
}: PlanetSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = TerrainGeometry({ 
    planetType,
    scale,
    height: planetType === 'gas' ? 0.2 : 0.1,
    resolution: planetType === 'gas' ? 64 : 128,
    seed: Math.random()
  });

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      if (planetType === 'gas') {
        meshRef.current.rotation.y = time * 0.1;
        meshRef.current.position.y = Math.sin(time * 0.5) * 0.02;
      }
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color={baseColor}
        roughness={roughness}
        metalness={metalness}
        vertexColors={planetType === 'gas'}
        side={THREE.DoubleSide}
      >
        {planetType === 'ice' && (
          <gradientTexture
            attach="alphaMap"
            stops={[0, 0.4, 0.7, 1]}
            colors={['#ffffff', '#aaaaaa', '#666666', '#000000']}
          />
        )}
      </meshStandardMaterial>
    </mesh>
  );
}