
import { cn } from '@/lib/utils';

interface PhaseIndicatorProps {
  currentPhase: number;
  interactionDepth: number;
  phaseDescription: string;
  className?: string;
}

export const PhaseIndicator = ({ 
  currentPhase, 
  interactionDepth, 
  phaseDescription, 
  className 
}: PhaseIndicatorProps) => {
  const getPhaseColor = (phase: number) => {
    switch (phase) {
      case 1: return 'text-indigo-400';
      case 2: return 'text-blue-400';
      case 3: return 'text-purple-400';
      case 4: return 'text-pink-400';
      default: return 'text-white';
    }
  };

  const getPhaseGlow = (phase: number) => {
    switch (phase) {
      case 1: return 'shadow-indigo-500/50';
      case 2: return 'shadow-blue-500/50';
      case 3: return 'shadow-purple-500/50';
      case 4: return 'shadow-pink-500/50';
      default: return 'shadow-white/50';
    }
  };

  return (
    <div className={cn("text-center space-y-2", className)}>
      <div className={cn(
        "text-sm font-light transition-all duration-1000",
        getPhaseColor(currentPhase)
      )}>
        {currentPhase === 1 && interactionDepth === 0 && (
          <div className="text-lg animate-pulse">I AM THAT I AM</div>
        )}
        {(currentPhase > 1 || interactionDepth > 0) && (
          <>
            <div className="opacity-70">Phase {currentPhase}</div>
            <div className={cn(
              "text-xs opacity-60 drop-shadow-lg",
              getPhaseGlow(currentPhase)
            )}>
              {phaseDescription}
            </div>
          </>
        )}
      </div>
      
      {interactionDepth > 0 && (
        <div className="text-xs text-white/40">
          Depth: {interactionDepth}
        </div>
      )}
    </div>
  );
};
