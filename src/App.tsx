import React from 'react';
import { Rocket } from 'lucide-react';
import SolarSystem from './components/SolarSystem';

function App() {
  return (
    <div className="relative w-full h-screen bg-black">
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 text-white">
        <Rocket className="w-8 h-8" />
        <h1 className="text-2xl font-bold">Galaxi°Cab Solar System</h1>
      </div>
      <SolarSystem />
    </div>
  );
}

export default App;