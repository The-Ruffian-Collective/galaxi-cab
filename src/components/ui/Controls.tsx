import React from 'react';
import { Camera, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface ControlsProps {
  onReset: () => void;
  onToggleAutoRotate: () => void;
  isAutoRotating: boolean;
}

export default function Controls({ onReset, onToggleAutoRotate, isAutoRotating }: ControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2">
      <button
        onClick={onReset}
        className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
        title="Reset View"
      >
        <RotateCcw className="w-5 h-5 text-white" />
      </button>
      
      <button
        onClick={onToggleAutoRotate}
        className={`p-2 rounded-lg transition-colors ${
          isAutoRotating ? 'bg-blue-500/30 text-blue-300' : 'bg-white/10 text-white'
        }`}
        title="Auto Rotate"
      >
        <Camera className="w-5 h-5" />
      </button>
      
      <div className="bg-white/10 rounded-lg p-2 space-y-2">
        <button className="block w-full hover:text-blue-300 transition-colors" title="Zoom In">
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        <button className="block w-full hover:text-blue-300 transition-colors" title="Zoom Out">
          <ZoomOut className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}