import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SpaceshipModel } from './SpaceshipModel';

interface SpaceTaxiProps {
  onNavigate: (position: THREE.Vector3, target: THREE.Vector3) => void;
}

export default function SpaceTaxi({ onNavigate }: SpaceTaxiProps) {
  const taxiRef = useRef<THREE.Group>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [currentPath, setCurrentPath] = useState<THREE.Vector3[]>([]);
  const [pathProgress, setPathProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  useFrame(({ camera }, delta) => {
    if (!isMoving || !taxiRef.current || currentPath.length < 2) return;

    const progress = pathProgress + delta * speed;
    setPathProgress(progress);

    if (progress >= 1) {
      setIsMoving(false);
      setCurrentPath([]);
      setPathProgress(0);
      return;
    }

    const currentPoint = new THREE.Vector3().lerpVectors(
      currentPath[0],
      currentPath[1],
      progress
    );

    taxiRef.current.position.copy(currentPoint);
    
    // Calculate smooth look-at direction
    const direction = new THREE.Vector3()
      .subVectors(currentPath[1], currentPath[0])
      .normalize();
    taxiRef.current.quaternion.setFromRotationMatrix(
      new THREE.Matrix4().lookAt(
        direction,
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1, 0)
      )
    );

    // Update camera position to follow taxi
    const cameraOffset = new THREE.Vector3(0, 2, 5);
    const cameraPosition = currentPoint.clone().add(cameraOffset);
    camera.position.lerp(cameraPosition, 0.1);
    camera.lookAt(currentPoint);
  });

  const startJourney = (destination: THREE.Vector3) => {
    if (!taxiRef.current || isMoving) return;

    const start = taxiRef.current.position.clone();
    const midpoint = new THREE.Vector3(
      (start.x + destination.x) / 2,
      Math.max(start.y, destination.y) + 5,
      (start.z + destination.z) / 2
    );

    setCurrentPath([start, midpoint, destination]);
    setIsMoving(true);
    setPathProgress(0);
    onNavigate(destination, destination);
  };

  return (
    <group ref={taxiRef} position={[0, 10, 30]}>
      <SpaceshipModel scale={0.5} />
      
      {isMoving && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={currentPath.length}
              array={new Float32Array(currentPath.flatMap(v => [v.x, v.y, v.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffffff" opacity={0.3} transparent />
        </line>
      )}

      <Html position={[2, 2, 0]}>
        <div className="bg-black/70 text-white p-2 rounded">
          <div className="flex items-center space-x-2">
            <label className="text-sm">Speed:</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className="text-sm">{speed.toFixed(1)}x</span>
          </div>
        </div>
      </Html>
    </group>
  );
}