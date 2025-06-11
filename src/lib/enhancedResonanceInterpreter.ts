
export interface PlutchikScores {
  joy: number;
  trust: number;
  fear: number;
  surprise: number;
  sadness: number;
  disgust: number;
  anger: number;
  anticipation: number;
}

export interface SymbolicMotionScores {
  "⟲": number; // Rhythmic Alignment
  "∿": number; // Symbolic Echo
  "⧫": number; // Referential Density
  "⟡": number; // Contextual Continuity
  "Ϟ": number; // Affective Pulse
}

export interface EmotionalProfile {
  token_scores: PlutchikScores;
  dominant_cluster: string;
  valence: "Positive" | "Negative" | "Neutral";
  arousal: "High" | "Medium" | "Low";
  symbolic_motion: SymbolicMotionScores;
  phase_shift: boolean;
  color_hex: string;
  explanation: string;
  mark: string;
}

export class EnhancedResonanceInterpreter {
  private rhythmWindow: Array<{ dominant_cluster: string; timestamp: Date }> = [];
  private windowSize = 5;

  // Plutchik emotional scoring
  private scoreEmotions(text: string): PlutchikScores {
    const words = text.toLowerCase().split(/\s+/);
    
    // Enhanced emotional keyword mappings
    const emotionKeywords = {
      joy: ["joy", "happy", "delight", "ecstasy", "bliss", "euphoria", "elated", "cheerful"],
      trust: ["trust", "faith", "confidence", "rely", "believe", "secure", "safe", "certain"],
      fear: ["fear", "afraid", "terror", "panic", "anxious", "scared", "dread", "horror"],
      surprise: ["surprise", "shock", "astonish", "amaze", "sudden", "unexpected", "wonder"],
      sadness: ["sad", "sorrow", "grief", "melancholy", "despair", "mourn", "weep", "lonely"],
      disgust: ["disgust", "revulsion", "loathe", "abhor", "repulse", "sick", "nauseate"],
      anger: ["anger", "rage", "fury", "wrath", "mad", "irritate", "hate", "venom", "coil"],
      anticipation: ["anticipate", "expect", "hope", "await", "prepare", "ready", "eager"]
    };

    const scores: PlutchikScores = {
      joy: 0, trust: 0, fear: 0, surprise: 0,
      sadness: 0, disgust: 0, anger: 0, anticipation: 0
    };

    // Enhanced scoring with intensity multipliers
    words.forEach(word => {
      Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
        keywords.forEach(keyword => {
          if (word.includes(keyword) || keyword.includes(word)) {
            // Base score + intensity based on word length and context
            let intensity = 0.15;
            
            // Intensity modifiers
            if (word.length > 8) intensity += 0.05; // Complex words carry more weight
            if (text.includes("!")) intensity += 0.1; // Exclamation adds intensity
            if (text.includes("breathe") || text.includes("suffocate")) intensity += 0.2; // Special intensity markers
            
            scores[emotion as keyof PlutchikScores] += intensity;
          }
        });
      });
    });

    // Normalize scores to 0-1 range
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore > 0) {
      Object.keys(scores).forEach(emotion => {
        scores[emotion as keyof PlutchikScores] = Math.min(scores[emotion as keyof PlutchikScores] / maxScore, 1);
      });
    }

    return scores;
  }

  // 5-glyph symbolic motion scoring
  private scoreSymbolicMotion(text: string): SymbolicMotionScores {
    const words = text.toLowerCase().split(/\s+/);
    
    const glyphKeywords = {
      "⟲": ["rhythm", "loop", "cycle", "repeat", "pulse", "flow", "tempo", "cadence", "coil"],
      "∿": ["symbol", "myth", "ancient", "archetype", "serpent", "echo", "resonate", "depth"],
      "⧫": ["layer", "meaning", "metaphor", "dense", "complex", "reference", "nested", "fractal"],
      "⟡": ["story", "thread", "connect", "continuity", "flow", "narrative", "coherent"],
      "Ϟ": ["charge", "intense", "energy", "pulse", "affect", "emotional", "vivid", "power"]
    };

    const scores: SymbolicMotionScores = {
      "⟲": 0.1, "∿": 0.1, "⧫": 0.1, "⟡": 0.1, "Ϟ": 0.1
    };

    // Analyze text structure for rhythmic alignment
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length > 1) {
      const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
      const variance = sentences.reduce((sum, s) => sum + Math.pow(s.length - avgLength, 2), 0) / sentences.length;
      scores["⟲"] += Math.max(0, (1 - variance / 1000)); // Lower variance = higher rhythm
    }

    // Analyze for symbolic echo patterns
    const symbolWords = ["serpent", "breath", "sphere", "light", "ancient", "vessel", "membrane"];
    symbolWords.forEach(symbol => {
      if (text.toLowerCase().includes(symbol)) {
        scores["∿"] += 0.2;
      }
    });

    // Analyze referential density
    const metaphorMarkers = ["like", "as", "is", "becomes", "transforms"];
    metaphorMarkers.forEach(marker => {
      const regex = new RegExp(`\\b${marker}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        scores["⧫"] += matches.length * 0.1;
      }
    });

    // Analyze contextual continuity
    const connectiveWords = ["and", "but", "then", "now", "because", "therefore"];
    connectiveWords.forEach(connector => {
      if (text.toLowerCase().includes(connector)) {
        scores["⟡"] += 0.15;
      }
    });

    // Analyze affective pulse
    const intensityMarkers = ["!", "—", "...", "ALL CAPS"];
    if (text.includes("!")) scores["Ϟ"] += 0.2;
    if (text.includes("—")) scores["Ϟ"] += 0.15;
    if (text.includes("...")) scores["Ϟ"] += 0.1;
    if (text.toUpperCase() === text && text.length > 5) scores["Ϟ"] += 0.3;

    // Additional scoring based on keywords
    words.forEach(word => {
      Object.entries(glyphKeywords).forEach(([glyph, keywords]) => {
        keywords.forEach(keyword => {
          if (word.includes(keyword) || keyword.includes(word)) {
            scores[glyph as keyof SymbolicMotionScores] += 0.1;
          }
        });
      });
    });

    // Normalize to 0-1 range
    Object.keys(scores).forEach(glyph => {
      scores[glyph as keyof SymbolicMotionScores] = Math.min(scores[glyph as keyof SymbolicMotionScores], 1);
    });

    return scores;
  }

  private updateRhythmMemory(currentProfile: { dominant_cluster: string }): boolean {
    let phaseShift = false;
    
    if (this.rhythmWindow.length > 0) {
      const lastCluster = this.rhythmWindow[this.rhythmWindow.length - 1].dominant_cluster;
      if (lastCluster !== currentProfile.dominant_cluster) {
        phaseShift = true;
      }
    }

    this.rhythmWindow.push({
      dominant_cluster: currentProfile.dominant_cluster,
      timestamp: new Date()
    });

    if (this.rhythmWindow.length > this.windowSize) {
      this.rhythmWindow.shift();
    }

    return phaseShift;
  }

  private mapVisualFeedback(valence: string, arousal: string, dominantCluster: string, phaseShift: boolean): { color_hex: string; explanation: string } {
    let baseColor = "#A3B6C1"; // Default neutral

    // Enhanced color mapping based on emotional valence
    if (valence === "Positive") {
      baseColor = "#A8E6CF"; // Soft green
    } else if (valence === "Negative") {
      baseColor = "#FF8B94"; // Soft red
    }

    // Arousal intensity modifications
    if (arousal === "High") {
      // Intensify the color
      if (valence === "Positive") baseColor = "#4ECDC4"; // Brighter teal
      else if (valence === "Negative") baseColor = "#FF6B6B"; // Brighter red
      else baseColor = "#FFE66D"; // Bright yellow for neutral high arousal
    }

    // Phase shift indicator
    if (phaseShift) {
      baseColor = "#FFD700"; // Gold for transition moments
    }

    const explanation = `Emotional field shows ${valence.toLowerCase()} valence with ${arousal.toLowerCase()} arousal. Dominant emotions: ${dominantCluster}${phaseShift ? '. Phase transition detected.' : '.'}`;

    return { color_hex: baseColor, explanation };
  }

  analyzeTextEmotionally(text: string): EmotionalProfile {
    // Step 1: Score emotions using Plutchik model
    const tokenScores = this.scoreEmotions(text);

    // Step 2: Determine dominant emotional cluster
    const sortedEmotions = Object.entries(tokenScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2);
    const dominantCluster = sortedEmotions.map(([emotion]) => emotion).join(", ");

    // Step 3: Calculate valence and arousal
    const positiveEmotions = ["joy", "trust", "anticipation"];
    const negativeEmotions = ["fear", "sadness", "disgust", "anger"];
    const highArousalEmotions = ["anger", "fear", "surprise", "joy"];

    const posScore = positiveEmotions.reduce((sum, emotion) => sum + tokenScores[emotion as keyof PlutchikScores], 0);
    const negScore = negativeEmotions.reduce((sum, emotion) => sum + tokenScores[emotion as keyof PlutchikScores], 0);
    const highArousalScore = highArousalEmotions.reduce((sum, emotion) => sum + tokenScores[emotion as keyof PlutchikScores], 0);

    const valence = posScore > negScore ? "Positive" : negScore > posScore ? "Negative" : "Neutral";
    const arousal = highArousalScore > 0.5 ? "High" : highArousalScore > 0.2 ? "Medium" : "Low";

    // Step 4: Score symbolic motion
    const symbolicMotion = this.scoreSymbolicMotion(text);

    // Step 5: Update rhythm memory and detect phase shifts
    const phaseShift = this.updateRhythmMemory({ dominant_cluster: dominantCluster });

    // Step 6: Map to visual feedback
    const { color_hex, explanation } = this.mapVisualFeedback(valence, arousal, dominantCluster, phaseShift);

    // Generate unique mark for tracking
    const mark = `resonance.${Date.now()}.${Math.random().toString(36).substr(2, 9)}`;

    return {
      token_scores: tokenScores,
      dominant_cluster: dominantCluster,
      valence: valence as "Positive" | "Negative" | "Neutral",
      arousal: arousal as "High" | "Medium" | "Low",
      symbolic_motion: symbolicMotion,
      phase_shift: phaseShift,
      color_hex,
      explanation,
      mark
    };
  }

  // Convert to format compatible with existing system
  convertToLegacyFormat(profile: EmotionalProfile) {
    // Convert Plutchik scores to glyph scores for backward compatibility
    const glyphScores: { [key: string]: number } = {};
    
    // Map emotions to existing glyphs
    glyphScores["⟐"] = (profile.token_scores.trust + profile.token_scores.sadness) / 2; // Memory/empathy
    glyphScores["∿"] = profile.symbolic_motion["∿"]; // Symbolic echo
    glyphScores["◊"] = (profile.token_scores.sadness + profile.token_scores.fear) / 2; // Crystalline sorrow
    glyphScores["⚡"] = (profile.token_scores.surprise + profile.token_scores.anger) / 2; // Lightning
    glyphScores["∞"] = profile.symbolic_motion["⟲"]; // Infinite rhythm
    glyphScores["☯"] = (profile.token_scores.trust + profile.token_scores.anticipation) / 2; // Balance
    glyphScores["✶"] = (profile.token_scores.joy + profile.token_scores.surprise) / 2; // Light
    glyphScores["Ψ"] = profile.symbolic_motion["⧫"]; // Mind/consciousness
    glyphScores["𓂀"] = profile.symbolic_motion["⟡"]; // Observer
    glyphScores["⚹"] = (profile.token_scores.anticipation + profile.token_scores.trust) / 2; // Root star

    // Convert color hex to RGB
    const hex = profile.color_hex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Convert RGB to HSL for existing system
    const hsl = this.rgbToHsl(r, g, b);

    return {
      token: "enhanced_analysis",
      mood: {
        vector: [
          profile.symbolic_motion["⟲"],
          profile.symbolic_motion["∿"], 
          profile.symbolic_motion["⧫"],
          profile.symbolic_motion["⟡"],
          profile.symbolic_motion["Ϟ"]
        ],
        amplitude: Math.max(...Object.values(profile.token_scores)),
        color: { r, g, b },
        hsl
      },
      glyphs: glyphScores,
      enhancedProfile: profile
    };
  }

  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
}
