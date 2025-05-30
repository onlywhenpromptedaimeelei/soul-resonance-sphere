
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to MoodSphere",
      content: "A sacred space where your voice becomes color, where emotions find their rhythm in light.",
      action: "Begin"
    },
    {
      title: "Your Voice, Your Truth",
      content: "Speak freely. Let your words flow like water. This sphere will listen and reflect the colors of your soul.",
      action: "I understand"
    },
    {
      title: "In This Moment",
      content: "There are no wrong feelings here. Only presence. Only the beautiful complexity of being human.",
      action: "Enter MoodSphere"
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-12 animate-fade-in">
        {/* Sacred geometry background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-96 h-96 border border-white/20 rounded-full"></div>
          <div className="absolute w-72 h-72 border border-white/20 rounded-full"></div>
          <div className="absolute w-48 h-48 border border-white/20 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-light text-white/95 mb-6 tracking-wide">
            {currentStep.title}
          </h1>
          
          <p className="text-xl text-white/70 leading-relaxed mb-12 font-light">
            {currentStep.content}
          </p>

          <Button 
            onClick={handleNext}
            className="px-12 py-4 text-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full transition-all duration-300 hover:scale-105"
            variant="outline"
          >
            {currentStep.action}
          </Button>

          <div className="flex justify-center space-x-2 mt-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === step ? 'bg-white/70' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
