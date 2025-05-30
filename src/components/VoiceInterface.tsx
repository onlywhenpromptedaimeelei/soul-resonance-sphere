
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInterfaceProps {
  onMoodUpdate: (hsl: { h: number; s: number; l: number }, text?: string) => void;
  onListeningChange: (isListening: boolean) => void;
  onTranscriptChange: (transcript: string) => void;
}

export const VoiceInterface = ({ 
  onMoodUpdate, 
  onListeningChange, 
  onTranscriptChange 
}: VoiceInterfaceProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onTranscriptChange(finalTranscript);
          analyzeEmotionAndUpdateMood(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        onListeningChange(false);
        toast({
          title: "Voice recognition paused",
          description: "The sphere is still listening to your presence.",
          variant: "default"
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        onListeningChange(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onMoodUpdate, onListeningChange, onTranscriptChange, toast]);

  const analyzeEmotionAndUpdateMood = (text: string) => {
    // Simple emotion analysis based on keywords
    // In a real app, this would be connected to a backend AI service
    const emotions = {
      happy: ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'love', 'great'],
      sad: ['sad', 'down', 'disappointed', 'hurt', 'lonely', 'depressed'],
      angry: ['angry', 'frustrated', 'mad', 'irritated', 'annoyed'],
      calm: ['peaceful', 'calm', 'relaxed', 'serene', 'content', 'zen'],
      anxious: ['anxious', 'worried', 'nervous', 'stressed', 'overwhelmed'],
      energetic: ['energetic', 'pumped', 'motivated', 'driven', 'inspired']
    };

    const lowerText = text.toLowerCase();
    let dominantEmotion = 'neutral';
    let maxMatches = 0;

    Object.entries(emotions).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        dominantEmotion = emotion;
      }
    });

    // Map emotions to HSL values
    const emotionToHSL = {
      happy: { h: 60, s: 80, l: 60 },    // Yellow-ish
      sad: { h: 220, s: 60, l: 40 },     // Blue
      angry: { h: 0, s: 80, l: 50 },     // Red
      calm: { h: 120, s: 50, l: 50 },    // Green
      anxious: { h: 30, s: 70, l: 45 },  // Orange
      energetic: { h: 300, s: 70, l: 60 }, // Purple
      neutral: { h: 240, s: 30, l: 50 }  // Neutral blue-gray
    };

    const hsl = emotionToHSL[dominantEmotion as keyof typeof emotionToHSL] || emotionToHSL.neutral;
    
    // Add some randomization for more natural feeling
    const variance = 20;
    const adjustedHSL = {
      h: Math.max(0, Math.min(360, hsl.h + (Math.random() - 0.5) * variance)),
      s: Math.max(20, Math.min(100, hsl.s + (Math.random() - 0.5) * variance)),
      l: Math.max(30, Math.min(70, hsl.l + (Math.random() - 0.5) * variance / 2))
    };

    onMoodUpdate(adjustedHSL, text);
  };

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Voice not available",
        description: "Your browser doesn't support voice recognition. But the sphere sees your intention.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      onListeningChange(false);
    } else {
      recognition.start();
      setIsListening(true);
      onListeningChange(true);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <Button
        onClick={toggleListening}
        className={`w-20 h-20 rounded-full transition-all duration-300 ${
          isListening 
            ? 'bg-red-500/20 hover:bg-red-500/30 border-red-400/50 text-red-300' 
            : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
        } border-2`}
        variant="outline"
      >
        {isListening ? (
          <MicOff className="w-8 h-8" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </Button>

      <p className="text-white/60 text-sm font-light text-center max-w-xs">
        {isListening 
          ? "The sphere is listening... speak your truth"
          : "Touch to begin your conversation with the sphere"
        }
      </p>
    </div>
  );
};
