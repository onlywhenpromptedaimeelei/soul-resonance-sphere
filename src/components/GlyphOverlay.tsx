
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GlyphEmotionEntry, findGlyphForHue } from '@/config/glyphEmotionMap';

interface GlyphOverlayProps {
  hsl: { h: number; s: number; l: number };
  className?: string;
}

export const GlyphOverlay = ({ hsl, className }: GlyphOverlayProps) => {
  const [activeGlyph, setActiveGlyph] = useState<GlyphEmotionEntry | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const glyph = findGlyphForHue(hsl.h);
    setActiveGlyph(glyph);
  }, [hsl.h]);

  if (!activeGlyph) return null;

  return (
    <div 
      className={cn("absolute inset-0 flex items-center justify-center pointer-events-none", className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Main Glyph */}
      <div 
        className="text-6xl text-white/80 transition-all duration-1000 ease-out animate-pulse cursor-pointer pointer-events-auto"
        style={{
          textShadow: `0 0 30px hsl(${hsl.h}, ${hsl.s}%, ${Math.min(hsl.l + 30, 90)}%)`,
          filter: `drop-shadow(0 0 20px hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%))`
        }}
        title={activeGlyph.interpretation}
      >
        {activeGlyph.glyph}
      </div>

      {/* Floating Label */}
      <div 
        className={`absolute top-full mt-4 transition-all duration-500 ${
          showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="bg-black/80 text-white text-sm px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
          <div className="font-medium">{activeGlyph.label}</div>
          <div className="text-xs text-white/70 mt-1 max-w-xs text-center">
            {activeGlyph.interpretation}
          </div>
        </div>
      </div>

      {/* Ripple Effect for Glyph Activation */}
      <div 
        className="absolute inset-0 rounded-full border border-white/20 animate-ping"
        style={{
          borderColor: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)40`
        }}
      />
    </div>
  );
};
