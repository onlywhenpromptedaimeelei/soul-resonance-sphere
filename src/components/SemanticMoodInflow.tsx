
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface SemanticMoodInflowProps {
  onMoodUpdate: (hsl: { h: number; s: number; l: number }, text?: string) => void;
  className?: string;
}

// Semantic weight lexicon for emotional analysis
const semanticWeights: Record<string, number> = {
  // High intensity emotions
  "ache": 8, "rage": 9, "ecstasy": 9, "despair": 8, "bliss": 9,
  "torment": 8, "euphoria": 9, "agony": 8, "rapture": 9,
  
  // Medium intensity emotions
  "breathe": 6, "longing": 7, "yearning": 7, "hope": 6, "fear": 7,
  "joy": 6, "sorrow": 6, "anxiety": 7, "peace": 6, "love": 7,
  "drift": 5, "flow": 5, "tension": 6, "release": 6,
  
  // Contemplative states
  "wonder": 5, "calm": 4, "still": 4, "quiet": 3, "gentle": 4,
  "soft": 3, "deep": 5, "vast": 5, "infinite": 6,
  
  // Transitional words
  "becoming": 5, "return": 5, "transform": 6, "shift": 4,
  "emerge": 5, "dissolve": 5, "awaken": 6,
  
  // Sacred/mystical terms
  "divine": 7, "sacred": 6, "holy": 6, "transcendent": 8,
  "eternal": 7, "cosmos": 6, "soul": 7, "spirit": 6
};

const emotionToHSL: Record<string, { h: number; s: number; l: number }> = {
  transcendent: { h: 270, s: 80, l: 60 },
  mystical: { h: 240, s: 70, l: 50 },
  peaceful: { h: 180, s: 50, l: 60 },
  joyful: { h: 60, s: 80, l: 70 },
  passionate: { h: 0, s: 90, l: 50 },
  melancholic: { h: 220, s: 60, l: 40 },
  anxious: { h: 45, s: 80, l: 45 },
  contemplative: { h: 200, s: 40, l: 50 },
  energetic: { h: 120, s: 70, l: 55 },
  neutral: { h: 240, s: 30, l: 50 }
};

export const SemanticMoodInflow = ({ onMoodUpdate, className }: SemanticMoodInflowProps) => {
  const [text, setText] = useState('');
  const [semanticWeight, setSemanticWeight] = useState(0);
  const [dominantEmotion, setDominantEmotion] = useState('neutral');

  const analyzeSemanticContent = (inputText: string) => {
    const words = inputText.toLowerCase().split(/\s+/);
    let totalWeight = 0;
    const emotionCounts: Record<string, number> = {};

    words.forEach(word => {
      const weight = semanticWeights[word] || 0;
      totalWeight += weight;

      // Categorize emotions based on semantic content
      if (weight > 7) emotionCounts.transcendent = (emotionCounts.transcendent || 0) + 1;
      else if (weight > 5) emotionCounts.mystical = (emotionCounts.mystical || 0) + 1;
      else if (word.includes('peace') || word.includes('calm')) emotionCounts.peaceful = (emotionCounts.peaceful || 0) + 1;
      else if (word.includes('joy') || word.includes('light')) emotionCounts.joyful = (emotionCounts.joyful || 0) + 1;
      else if (word.includes('rage') || word.includes('fire')) emotionCounts.passionate = (emotionCounts.passionate || 0) + 1;
      else if (word.includes('sorrow') || word.includes('dark')) emotionCounts.melancholic = (emotionCounts.melancholic || 0) + 1;
      else if (word.includes('anxious') || word.includes('worry')) emotionCounts.anxious = (emotionCounts.anxious || 0) + 1;
      else if (word.includes('think') || word.includes('wonder')) emotionCounts.contemplative = (emotionCounts.contemplative || 0) + 1;
      else if (word.includes('energy') || word.includes('alive')) emotionCounts.energetic = (emotionCounts.energetic || 0) + 1;
    });

    // Find dominant emotion
    const dominant = Object.entries(emotionCounts).reduce((max, [emotion, count]) => 
      count > max.count ? { emotion, count } : max, 
      { emotion: 'neutral', count: 0 }
    );

    setSemanticWeight(totalWeight);
    setDominantEmotion(dominant.emotion);

    // Update mood based on analysis
    const baseHSL = emotionToHSL[dominant.emotion] || emotionToHSL.neutral;
    const variance = Math.min(totalWeight * 2, 30);
    
    const adjustedHSL = {
      h: Math.max(0, Math.min(360, baseHSL.h + (Math.random() - 0.5) * variance)),
      s: Math.max(20, Math.min(100, baseHSL.s + (Math.random() - 0.5) * variance)),
      l: Math.max(30, Math.min(70, baseHSL.l + (Math.random() - 0.5) * variance / 2))
    };

    if (totalWeight > 3) {
      onMoodUpdate(adjustedHSL, inputText);
    }
  };

  useEffect(() => {
    if (text.trim()) {
      const timeoutId = setTimeout(() => {
        analyzeSemanticContent(text);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [text]);

  return (
    <div className={cn("w-full max-w-md space-y-4", className)}>
      <div className="space-y-2">
        <label htmlFor="semantic-input" className="text-white/70 text-sm font-light">
          Speak your truth into words...
        </label>
        <Textarea
          id="semantic-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Let your words flow like water..."
          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[100px] resize-none"
          style={{
            boxShadow: semanticWeight > 5 ? `0 0 20px hsl(${emotionToHSL[dominantEmotion]?.h || 240}, 50%, 50%)40` : 'none'
          }}
        />
      </div>
      
      {semanticWeight > 0 && (
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Emotional resonance: {Math.round(semanticWeight)}</span>
          <span className="capitalize">{dominantEmotion.replace('_', ' ')}</span>
        </div>
      )}
    </div>
  );
};
