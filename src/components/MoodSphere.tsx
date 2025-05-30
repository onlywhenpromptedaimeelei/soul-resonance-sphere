
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { GlyphOverlay } from './GlyphOverlay';

interface MoodSphereProps {
  hsl: { h: number; s: number; l: number };
  isListening: boolean;
  className?: string;
}

export const MoodSphere = ({ hsl, isListening, className }: MoodSphereProps) => {
  const [pulseScale, setPulseScale] = useState(1);

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

  const sphereColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const glowColor = `hsl(${hsl.h}, ${Math.min(hsl.s + 20, 100)}%, ${Math.min(hsl.l + 20, 80)}%)`;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer glow rings */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
          transform: `scale(${pulseScale})`,
          transition: 'transform 0.8s ease-in-out'
        }}
      />
      
      <div 
        className="absolute inset-4 rounded-full opacity-40"
        style={{
          background: `radial-gradient(circle, ${glowColor}30 0%, transparent 60%)`,
          transform: `scale(${pulseScale * 0.9})`,
          transition: 'transform 0.8s ease-in-out'
        }}
      />

      {/* Main sphere */}
      <div 
        className="relative w-full h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${glowColor}, ${sphereColor})`,
          boxShadow: `
            0 0 60px ${sphereColor}40,
            inset 0 0 60px ${glowColor}20,
            0 0 120px ${sphereColor}20
          `,
          transform: `scale(${pulseScale})`,
          transition: 'all 1s ease-in-out'
        }}
      >
        {/* Inner light reflection */}
        <div 
          className="absolute top-8 left-8 w-16 h-16 rounded-full opacity-60"
          style={{
            background: `radial-gradient(circle, ${glowColor}80, transparent)`
          }}
        />

        {/* Breathing animation overlay */}
        {isListening && (
          <div className="absolute inset-0 rounded-full">
            <div 
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                background: `radial-gradient(circle, transparent 60%, ${sphereColor}20 100%)`
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
    </div>
  );
};
