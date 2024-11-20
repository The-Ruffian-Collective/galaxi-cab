import { useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';
import SpaceTaxi from './SpaceTaxi';
import Controls from './ui/Controls';
import PlanetInfo from './ui/PlanetInfo';

const PLANET_DATA = [
  { 
    name: 'Sun',
    radius: 2.5,
    position: [0, 0, 0],
    color: '#ffd700',
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.1,
    type: 'gas' as const,
    distance: 0,
    temperature: '5,778 K',
    description: 'The star at the center of our Solar System, providing light and energy to all planets.'
  },
  {
    name: 'Mercury',
    radius: 0.4,
    position: [4, 0, 0],
    color: '#a0522d',
    orbitRadius: 4,
    orbitSpeed: 0.8,
    rotationSpeed: 0.05,
    type: 'rocky' as const,
    distance: 0.4,
    temperature: '167°C',
    description: 'The smallest and innermost planet, with extreme temperature variations.'
  },
  // ... (previous planet data remains, just add distance, temperature, and description for each)
];

export default function SolarSystem() {
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const controlsRef = useRef<any>(null);

  const handlePlanetSelect = useCallback((name: string) => {
    setSelectedPlanet(name);
    setControlsEnabled(false);
  }, []);

  const handleNavigationComplete = useCallback(() => {
    setControlsEnabled(true);
  }, []);

  const resetCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating(prev => !prev);
  }, []);

  const selectedPlanetData = PLANET_DATA.find(p => p.name === selectedPlanet);

  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 30, 30], fov: 60 }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {PLANET_DATA.map((planet) => (
          <Planet
            key={planet.name}
            {...planet}
            onClick={() => handlePlanetSelect(planet.name)}
          />
        ))}

        <SpaceTaxi onNavigate={handleNavigationComplete} />
        
        <OrbitControls
          ref={controlsRef}
          enabled={controlsEnabled}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={100}
          autoRotate={isAutoRotating}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      <Controls
        onReset={resetCamera}
        onToggleAutoRotate={toggleAutoRotate}
        isAutoRotating={isAutoRotating}
      />

      {selectedPlanetData && (
        <div className="absolute bottom-4 left-4 max-w-sm">
          <PlanetInfo {...selectedPlanetData} />
        </div>
      )}
    </div>
  );
}