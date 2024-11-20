import React from 'react';
import { Info, Navigation, Thermometer, Globe } from 'lucide-react';

interface PlanetInfoProps {
  name: string;
  type: 'rocky' | 'gas' | 'ice';
  distance: number;
  temperature: string;
  description: string;
}

const typeIcons = {
  rocky: Globe,
  gas: Navigation,
  ice: Thermometer
};

export default function PlanetInfo({ name, type, distance, temperature, description }: PlanetInfoProps) {
  const Icon = typeIcons[type];
  
  return (
    <div className="bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm border border-white/10">
      <div className="flex items-center space-x-2 mb-3">
        <Icon className="w-5 h-5" />
        <h2 className="text-xl font-bold">{name}</h2>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Type:</span>
          <span className="capitalize">{type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Distance from Sun:</span>
          <span>{distance.toFixed(1)} AU</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Temperature:</span>
          <span>{temperature}</span>
        </div>
      </div>
      
      <p className="mt-3 text-sm text-gray-300">{description}</p>
      
      <button className="mt-4 w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-2 px-4 rounded-md transition-colors">
        Book Journey
      </button>
    </div>
  );
}