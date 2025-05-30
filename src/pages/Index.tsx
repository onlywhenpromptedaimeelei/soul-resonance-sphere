
import { useState, useEffect } from 'react';
import { VoiceInterface } from '@/components/VoiceInterface';
import { MoodSphere } from '@/components/MoodSphere';
import { MoodTimeline } from '@/components/MoodTimeline';
import { SemanticMoodInflow } from '@/components/SemanticMoodInflow';
import { OnboardingFlow } from '@/components/OnboardingFlow';

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentMood, setCurrentMood] = useState({ h: 240, s: 50, l: 50 });
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [moodHistory, setMoodHistory] = useState<Array<{
    timestamp: Date;
    hsl: { h: number; s: number; l: number };
    text?: string;
  }>>([]);

  const handleMoodUpdate = (hsl: { h: number; s: number; l: number }, text?: string) => {
    setCurrentMood(hsl);
    setMoodHistory(prev => [...prev, {
      timestamp: new Date(),
      hsl,
      text
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

          {/* Semantic Input */}
          <SemanticMoodInflow
            onMoodUpdate={handleMoodUpdate}
            className="mt-8"
          />
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
