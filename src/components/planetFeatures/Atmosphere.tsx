import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AtmosphereProps {
  radius: number;
  color: string;
  opacity?: number;
  intensity?: number;
}

export default function Atmosphere({ 
  radius, 
  color, 
  opacity = 0.3,
  intensity = 1.2 
}: AtmosphereProps) {
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (atmosphereRef.current) {
      const time = clock.getElapsedTime();
      atmosphereRef.current.rotation.y = time * 0.05;
      
      // Pulse effect
      const pulse = Math.sin(time * 0.5) * 0.05 + 1;
      atmosphereRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={atmosphereRef}>
      <sphereGeometry args={[radius * 1.05, 32, 32]} />
      <meshPhongMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      >
        <gradientTexture
          attach="gradientMap"
          stops={[0, 0.3, 0.6, 1]}
          colors={['#ffffff', color, color, '#000000']}
        />
      </meshPhongMaterial>
    </mesh>
  );
}