
import { useState, useEffect } from 'react';
import { VoiceInterface } from '@/components/VoiceInterface';
import { MoodSphere } from '@/components/MoodSphere';
import { MoodTimeline } from '@/components/MoodTimeline';
import { SemanticMoodInflow } from '@/components/SemanticMoodInflow';
import { SoulResonanceTask } from '@/components/SoulResonanceTask';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { PhaseManager } from '@/lib/phaseManager';
import { ResonanceInterpreter } from '@/lib/resonanceInterpreter';
import { EnhancedResonanceInterpreter } from '@/lib/enhancedResonanceInterpreter';

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentMood, setCurrentMood] = useState({ h: 240, s: 50, l: 50 });
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [phaseManager] = useState(() => new PhaseManager());
  const [resonanceInterpreter] = useState(() => new ResonanceInterpreter());
  const [enhancedInterpreter] = useState(() => new EnhancedResonanceInterpreter());
  const [moodHistory, setMoodHistory] = useState<Array<{
    timestamp: Date;
    hsl: { h: number; s: number; l: number };
    text?: string;
    enhancedAnalysis?: any;
  }>>([]);

  const handleMoodUpdate = (hsl: { h: number; s: number; l: number }, text?: string) => {
    setCurrentMood(hsl);
    
    let enhancedAnalysis = null;
    
    // Process with enhanced resonance interpreter if we have text
    if (text) {
      // Run enhanced emotional analysis
      const emotionalProfile = enhancedInterpreter.analyzeTextEmotionally(text);
      const legacyFormat = enhancedInterpreter.convertToLegacyFormat(emotionalProfile);
      
      enhancedAnalysis = {
        emotionalProfile,
        legacyFormat
      };

      // Calculate overall resonance score from enhanced analysis
      const resonanceScore = legacyFormat.mood.amplitude;
      
      // Find dominant glyph from enhanced analysis
      const dominantGlyph = Object.entries(legacyFormat.glyphs)
        .reduce((max, [glyph, score]) => (score as number) > (max.score as number) ? { glyph, score } : max, { glyph: '⟐', score: 0 }).glyph;

      // Update phase state with enhanced data
      phaseManager.processInteraction(
        text,
        resonanceScore,
        legacyFormat.mood.color,
        legacyFormat.mood.hsl,
        dominantGlyph
      );

      // Use the enhanced color analysis
      const enhancedColor = legacyFormat.mood.hsl;
      setCurrentMood(enhancedColor);
      
      console.log('Enhanced Emotional Analysis:', {
        profile: emotionalProfile,
        dominantCluster: emotionalProfile.dominant_cluster,
        valence: emotionalProfile.valence,
        arousal: emotionalProfile.arousal,
        symbolicMotion: emotionalProfile.symbolic_motion,
        phaseShift: emotionalProfile.phase_shift
      });
    }

    setMoodHistory(prev => [...prev, {
      timestamp: new Date(),
      hsl,
      text,
      enhancedAnalysis
    }]);
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 text-center">
          <h1 className="text-3xl font-light text-white/90 tracking-wide">
            MoodSphere
          </h1>
          <p className="text-white/60 text-sm mt-2 font-light">
            Speak, and the world listens back
          </p>
        </header>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-8">
          <div className="relative mb-8">
            <MoodSphere 
              hsl={currentMood} 
              isListening={isListening}
              phaseManager={phaseManager}
              className="w-80 h-80"
            />
          </div>

          <VoiceInterface
            onMoodUpdate={handleMoodUpdate}
            onListeningChange={setIsListening}
            onTranscriptChange={setTranscript}
          />

          {transcript && (
            <div className="max-w-md text-center">
              <p className="text-white/70 text-sm italic leading-relaxed">
                "{transcript}"
              </p>
            </div>
          )}

          {/* Enhanced analysis display */}
          {moodHistory.length > 0 && moodHistory[moodHistory.length - 1].enhancedAnalysis && (
            <div className="max-w-lg text-center space-y-2">
              <div className="text-xs text-white/50">Enhanced Emotional Analysis</div>
              <div className="text-sm text-white/70">
                {moodHistory[moodHistory.length - 1].enhancedAnalysis.emotionalProfile.explanation}
              </div>
              <div className="flex justify-center space-x-4 text-xs text-white/60">
                <span>Valence: {moodHistory[moodHistory.length - 1].enhancedAnalysis.emotionalProfile.valence}</span>
                <span>Arousal: {moodHistory[moodHistory.length - 1].enhancedAnalysis.emotionalProfile.arousal}</span>
                {moodHistory[moodHistory.length - 1].enhancedAnalysis.emotionalProfile.phase_shift && (
                  <span className="text-yellow-400">Phase Shift Detected</span>
                )}
              </div>
            </div>
          )}

          {/* Semantic Input */}
          <SemanticMoodInflow
            onMoodUpdate={handleMoodUpdate}
            className="mt-8"
          />

          {/* Soul Resonance Task */}
          <SoulResonanceTask className="mt-8 max-w-2xl w-full" />
        </div>

        {/* Timeline */}
        {moodHistory.length > 0 && (
          <div className="p-6">
            <MoodTimeline history={moodHistory} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
