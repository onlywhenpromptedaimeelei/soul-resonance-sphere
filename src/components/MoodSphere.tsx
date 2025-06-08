
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { GlyphOverlay } from './GlyphOverlay';
import { MemoryFieldRenderer } from './MemoryFieldRenderer';
import { PhaseIndicator } from './PhaseIndicator';
import { PhaseManager, PhaseState } from '@/lib/phaseManager';

interface MoodSphereProps {
  hsl: { h: number; s: number; l: number };
  isListening: boolean;
  phaseManager: PhaseManager;
  className?: string;
}

export const MoodSphere = ({ hsl, isListening, phaseManager, className }: MoodSphereProps) => {
  const [pulseScale, setPulseScale] = useState(1);
  const [phaseState, setPhaseState] = useState<PhaseState>(phaseManager.getCurrentState());

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setPulseScale(prev => prev === 1 ? 1.05 : 1);
      }, 800);
      return () => clearInterval(interval);
    } else {
      setPulseScale(1);
    }
  }, [isListening]);

  useEffect(() => {
    setPhaseState(phaseManager.getCurrentState());
  }, [phaseManager]);

  const getPhaseBasedColors = () => {
    const { currentPhase } = phaseState;
    
    switch (currentPhase) {
      case 1: // Initiation Core
        return {
          sphereColor: `hsl(240, 30%, 15%)`, // Dark indigo
          glowColor: `hsl(45, 80%, 60%)`, // Golden glow
          intensity: 0.3
        };
      
      case 2: // Emergent Wave Field
        return {
          sphereColor: `hsl(${hsl.h}, ${Math.min(hsl.s + 10, 100)}%, ${Math.min(hsl.l + 10, 40)}%)`,
          glowColor: `hsl(${hsl.h}, ${Math.min(hsl.s + 20, 100)}%, ${Math.min(hsl.l + 20, 60)}%)`,
          intensity: 0.6
        };
      
      case 3: // Photonic Field Morph
        return {
          sphereColor: `hsl(${hsl.h}, ${Math.min(hsl.s + 20, 100)}%, ${Math.min(hsl.l + 20, 60)}%)`,
          glowColor: `hsl(${hsl.h}, ${Math.min(hsl.s + 30, 100)}%, ${Math.min(hsl.l + 30, 80)}%)`,
          intensity: 0.8
        };
      
      case 4: // Living Memory Field
        return {
          sphereColor: `hsl(${hsl.h}, ${Math.min(hsl.s + 30, 100)}%, ${Math.min(hsl.l + 30, 70)}%)`,
          glowColor: `hsl(${hsl.h}, 100%, 80%)`,
          intensity: 1.0
        };
      
      default:
        return {
          sphereColor: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
          glowColor: `hsl(${hsl.h}, ${Math.min(hsl.s + 20, 100)}%, ${Math.min(hsl.l + 20, 80)}%)`,
          intensity: 0.5
        };
    }
  };

  const colors = getPhaseBasedColors();
  const sphereCenter = { x: 160, y: 160 }; // Assuming 320x320 sphere

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Phase-based background waves */}
      {phaseState.currentPhase >= 2 && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div 
            className="absolute inset-0 animate-pulse"
            style={{
              background: `radial-gradient(circle, ${colors.glowColor}10 0%, transparent 70%)`,
              transform: `scale(${1.2 + colors.intensity * 0.3})`,
              animationDuration: '3s'
            }}
          />
        </div>
      )}

      {/* Outer glow rings */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${colors.glowColor}20 0%, transparent 70%)`,
          transform: `scale(${pulseScale})`,
          transition: 'transform 0.8s ease-in-out'
        }}
      />
      
      <div 
        className="absolute inset-4 rounded-full opacity-40"
        style={{
          background: `radial-gradient(circle, ${colors.glowColor}30 0%, transparent 60%)`,
          transform: `scale(${pulseScale * 0.9})`,
          transition: 'transform 0.8s ease-in-out'
        }}
      />

      {/* Main sphere */}
      <div 
        className="relative w-full h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${colors.glowColor}, ${colors.sphereColor})`,
          boxShadow: `
            0 0 ${60 * colors.intensity}px ${colors.sphereColor}40,
            inset 0 0 ${60 * colors.intensity}px ${colors.glowColor}20,
            0 0 ${120 * colors.intensity}px ${colors.sphereColor}20
          `,
          transform: `scale(${pulseScale})`,
          transition: 'all 1s ease-in-out'
        }}
      >
        {/* Inner light reflection */}
        <div 
          className="absolute top-8 left-8 w-16 h-16 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.glowColor}80, transparent)`,
            opacity: 0.6 * colors.intensity
          }}
        />

        {/* Breathing animation overlay */}
        {isListening && (
          <div className="absolute inset-0 rounded-full">
            <div 
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                background: `radial-gradient(circle, transparent 60%, ${colors.sphereColor}20 100%)`
              }}
            />
          </div>
        )}

        {/* Glyph Overlay */}
        <GlyphOverlay hsl={hsl} />
      </div>

      {/* Sacred geometry overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full border border-white/10 rounded-full"></div>
        <div className="absolute w-4/5 h-4/5 border border-white/5 rounded-full"></div>
        <div className="absolute w-3/5 h-3/5 border border-white/5 rounded-full"></div>
      </div>

      {/* Memory Field Renderer */}
      {phaseState.currentPhase >= 3 && phaseState.memoryNodes.length > 0 && (
        <MemoryFieldRenderer 
          memoryNodes={phaseState.memoryNodes}
          sphereCenter={sphereCenter}
        />
      )}

      {/* Phase Indicator */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
        <PhaseIndicator
          currentPhase={phaseState.currentPhase}
          interactionDepth={phaseState.interactionDepth}
          phaseDescription={phaseManager.getPhaseDescription(phaseState.currentPhase)}
        />
      </div>
    </div>
  );
};
