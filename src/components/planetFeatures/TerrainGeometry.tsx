import { useMemo } from 'react';
import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';

interface TerrainGeometryProps {
  resolution?: number;
  height?: number;
  scale?: number;
  seed?: number;
  planetType: 'rocky' | 'gas' | 'ice';
}

export default function TerrainGeometry({ 
  resolution = 128,
  height = 1,
  scale = 1,
  seed = 1,
  planetType
}: TerrainGeometryProps) {
  const geometry = useMemo(() => {
    const simplex = new SimplexNoise(seed.toString());
    const geometry = new THREE.PlaneGeometry(scale, scale, resolution, resolution);
    const vertices = geometry.attributes.position.array;

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 2];
      
      let elevation = 0;
      
      switch (planetType) {
        case 'rocky':
          elevation = getRockyTerrain(x, z, simplex);
          break;
        case 'gas':
          elevation = getGasCloudPattern(x, z, simplex);
          break;
        case 'ice':
          elevation = getIceTerrain(x, z, simplex);
          break;
      }
      
      vertices[i + 1] = elevation * height;
    }

    geometry.computeVertexNormals();
    return geometry;
  }, [resolution, height, scale, seed, planetType]);

  return geometry;
}

function getRockyTerrain(x: number, z: number, simplex: SimplexNoise) {
  const baseNoise = simplex.noise2D(x * 0.5, z * 0.5);
  const detailNoise = simplex.noise2D(x * 2, z * 2) * 0.3;
  const craterNoise = simplex.noise2D(x * 0.2, z * 0.2) * 0.5;
  
  return baseNoise + detailNoise + Math.pow(craterNoise, 2);
}