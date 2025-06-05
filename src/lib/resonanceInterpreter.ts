
export interface MoodParticle {
  vector: number[];
  amplitude: number;
  color: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export interface GlyphScores {
  [glyph: string]: number;
}

export interface ResonanceResult {
  token: string;
  mood: MoodParticle;
  glyphs: GlyphScores;
}

export class ResonanceInterpreter {
  private emotionalKeywords = {
    longing: { weight: 0.9, hue: 240, saturation: 70 },
    ocean: { weight: 0.8, hue: 200, saturation: 80 },
    remember: { weight: 0.85, hue: 260, saturation: 60 },
    silence: { weight: 0.7, hue: 220, saturation: 50 },
    love: { weight: 0.95, hue: 340, saturation: 85 },
    loss: { weight: 0.8, hue: 280, saturation: 75 },
    hope: { weight: 0.9, hue: 120, saturation: 70 },
    fear: { weight: 0.75, hue: 30, saturation: 85 },
    joy: { weight: 0.95, hue: 60, saturation: 90 },
    pain: { weight: 0.8, hue: 15, saturation: 80 }
  };

  private glyphResonance = {
    "⟐": ["memory", "remember", "hold", "listen"],
    "∿": ["wave", "flow", "ocean", "water", "current"],
    "◊": ["crystalline", "sorrow", "beautiful", "grief"],
    "⚡": ["lightning", "sudden", "flash", "revelation"],
    "∞": ["infinite", "eternal", "forever", "boundless"],
    "☯": ["balance", "synthesis", "paradox", "unity"],
    "✶": ["light", "star", "bright", "illuminate"],
    "Ψ": ["mind", "consciousness", "thought", "awareness"],
    "𓂀": ["watch", "observe", "see", "witness"],
    "⚹": ["root", "ground", "stable", "foundation"]
  };

  interpretParticle(token: string): MoodParticle {
    const words = token.toLowerCase().split(/\s+/);
    let totalWeight = 0;
    let weightedHue = 0;
    let weightedSat = 0;
    let amplitude = 0.5;

    // Analyze emotional content
    words.forEach(word => {
      Object.entries(this.emotionalKeywords).forEach(([keyword, data]) => {
        if (word.includes(keyword) || keyword.includes(word)) {
          totalWeight += data.weight;
          weightedHue += data.hue * data.weight;
          weightedSat += data.saturation * data.weight;
          amplitude += data.weight * 0.1;
        }
      });
    });

    // Calculate final HSL values
    const hue = totalWeight > 0 ? Math.round(weightedHue / totalWeight) : 240;
    const saturation = totalWeight > 0 ? Math.min(Math.round(weightedSat / totalWeight), 100) : 50;
    const lightness = Math.min(50 + (amplitude * 30), 80);

    // Convert HSL to RGB
    const { r, g, b } = this.hslToRgb(hue, saturation, lightness);

    // Create vector representation
    const vector = [
      Math.sin(hue * Math.PI / 180) * amplitude,
      Math.cos(hue * Math.PI / 180) * amplitude,
      amplitude,
      saturation / 100,
      lightness / 100
    ];

    return {
      vector,
      amplitude: Math.min(amplitude, 1),
      color: { r, g, b },
      hsl: { h: hue, s: saturation, l: lightness }
    };
  }

  interpretToken(token: string): GlyphScores {
    const words = token.toLowerCase().split(/\s+/);
    const scores: GlyphScores = {};

    // Initialize all glyphs with base score
    Object.keys(this.glyphResonance).forEach(glyph => {
      scores[glyph] = 0.1;
    });

    // Calculate resonance scores
    Object.entries(this.glyphResonance).forEach(([glyph, keywords]) => {
      let resonance = 0.1;
      
      keywords.forEach(keyword => {
        words.forEach(word => {
          if (word.includes(keyword) || keyword.includes(word)) {
            resonance += 0.2;
          }
        });
      });

      // Add semantic proximity bonus
      const semanticBonus = this.calculateSemanticProximity(token, keywords);
      resonance += semanticBonus;

      scores[glyph] = Math.min(resonance, 1);
    });

    return scores;
  }

  runCodexTask(token: string): ResonanceResult {
    const particle = this.interpretParticle(token);
    const glyphs = this.interpretToken(token);

    return {
      token,
      mood: particle,
      glyphs
    };
  }

  private calculateSemanticProximity(text: string, keywords: string[]): number {
    const textLength = text.length;
    let proximity = 0;

    keywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        proximity += 0.15;
      }
    });

    // Bonus for emotional intensity
    const intensityWords = ['deeply', 'truly', 'desperately', 'passionately', 'gently'];
    intensityWords.forEach(word => {
      if (text.toLowerCase().includes(word)) {
        proximity += 0.1;
      }
    });

    return Math.min(proximity, 0.5);
  }

  private hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }
}
