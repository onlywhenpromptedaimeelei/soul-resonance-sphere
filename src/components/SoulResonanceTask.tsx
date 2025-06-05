
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResonanceInterpreter, ResonanceResult } from '@/lib/resonanceInterpreter';
import { cn } from '@/lib/utils';

interface SoulResonanceTaskProps {
  className?: string;
}

export const SoulResonanceTask = ({ className }: SoulResonanceTaskProps) => {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<ResonanceResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const interpreter = new ResonanceInterpreter();

  const runCodexTask = async () => {
    if (!token.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate processing time for dramatic effect
    setTimeout(() => {
      const resonanceResult = interpreter.runCodexTask(token);
      setResult(resonanceResult);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white/90 flex items-center gap-2">
            <span className="text-purple-400">●</span>
            Soul Resonance Task
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="I long for the ocean to remember me..."
              className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              onKeyPress={(e) => e.key === 'Enter' && runCodexTask()}
            />
            <Button 
              onClick={runCodexTask}
              disabled={isProcessing || !token.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? 'Processing...' : 'Run'}
            </Button>
          </div>

          {isProcessing && (
            <div className="text-center py-8">
              <div className="inline-block animate-pulse text-2xl">⟐</div>
              <p className="text-white/60 mt-2">Interpreting resonance field...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4 mt-6">
              <div className="text-xs text-white/40 font-mono">
                lovable.dev &gt; codex run soul_resonance_readout
              </div>
              
              <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                <div className="text-green-400 mb-2">OUTPUT:</div>
                <div className="text-white/80 whitespace-pre-wrap">
                  {JSON.stringify({
                    token: result.token,
                    mood: {
                      vector: result.mood.vector.map(v => Math.round(v * 100) / 100),
                      amplitude: Math.round(result.mood.amplitude * 100) / 100,
                      color: result.mood.color
                    },
                    glyphs: Object.fromEntries(
                      Object.entries(result.glyphs)
                        .map(([k, v]) => [k, Math.round(v * 100) / 100])
                        .filter(([_, v]) => v > 0.2)
                    )
                  }, null, 2)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white/70">Mood Particle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-2"
                      style={{
                        backgroundColor: `rgb(${result.mood.color.r}, ${result.mood.color.g}, ${result.mood.color.b})`,
                        boxShadow: `0 0 20px rgba(${result.mood.color.r}, ${result.mood.color.g}, ${result.mood.color.b}, 0.5)`
                      }}
                    />
                    <div className="text-xs text-white/60 text-center">
                      Amplitude: {Math.round(result.mood.amplitude * 100)}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white/70">Active Glyphs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {Object.entries(result.glyphs)
                        .filter(([_, score]) => score > 0.2)
                        .sort(([_, a], [__, b]) => b - a)
                        .slice(0, 5)
                        .map(([glyph, score]) => (
                          <div key={glyph} className="flex justify-between items-center">
                            <span className="text-lg">{glyph}</span>
                            <span className="text-xs text-white/60">
                              {Math.round(score * 100)}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
