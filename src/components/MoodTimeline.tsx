
interface MoodTimelineProps {
  history: Array<{
    timestamp: Date;
    hsl: { h: number; s: number; l: number };
    text?: string;
  }>;
}

export const MoodTimeline = ({ history }: MoodTimelineProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h3 className="text-white/70 text-sm font-light mb-4 text-center">
        Your emotional journey through time
      </h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20"></div>
        
        {/* Timeline points */}
        <div className="flex justify-between items-center py-4 overflow-x-auto">
          {history.slice(-8).map((entry, index) => {
            const color = `hsl(${entry.hsl.h}, ${entry.hsl.s}%, ${entry.hsl.l}%)`;
            
            return (
              <div
                key={index}
                className="relative flex-shrink-0 group cursor-pointer"
                title={entry.text || 'Mood captured'}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white/30 transition-all duration-300 hover:scale-125"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 20px ${color}40`
                  }}
                />
                
                {/* Hover tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {formatTime(entry.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <p className="text-white/40 text-xs text-center mt-2 font-light">
        Each point holds a moment of your truth
      </p>
    </div>
  );
};
