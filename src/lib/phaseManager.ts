
export interface PhaseState {
  currentPhase: number;
  interactionDepth: number;
  memoryNodes: MemoryNode[];
  phaseTransitionComplete: boolean;
}

export interface MemoryNode {
  id: string;
  token: string;
  resonanceScore: number;
  color: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  glyph: string;
  age: number;
  position: { angle: number; radius: number };
  createdAt: Date;
}

export class PhaseManager {
  private state: PhaseState;
  private phaseThresholds = [0, 3, 7, 20]; // Phase transition points
  private memoryThreshold = 0.65; // Minimum resonance for memory creation
  private maxMemoryAge = 500;

  constructor(initialState?: Partial<PhaseState>) {
    this.state = {
      currentPhase: 1,
      interactionDepth: 0,
      memoryNodes: [],
      phaseTransitionComplete: false,
      ...initialState
    };
  }

  processInteraction(token: string, resonanceScore: number, color: any, hsl: any, dominantGlyph: string): PhaseState {
    this.state.interactionDepth += 1;
    
    // Check for phase transitions
    const newPhase = this.calculatePhase(this.state.interactionDepth);
    if (newPhase !== this.state.currentPhase) {
      this.state.currentPhase = newPhase;
      this.state.phaseTransitionComplete = false;
    }

    // Create memory node if resonance is high enough
    if (resonanceScore >= this.memoryThreshold && this.state.currentPhase >= 3) {
      this.createMemoryNode(token, resonanceScore, color, hsl, dominantGlyph);
    }

    // Age and prune memory nodes
    this.updateMemoryNodes();

    return { ...this.state };
  }

  private calculatePhase(depth: number): number {
    for (let i = this.phaseThresholds.length - 1; i >= 0; i--) {
      if (depth >= this.phaseThresholds[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  private createMemoryNode(token: string, resonanceScore: number, color: any, hsl: any, glyph: string) {
    const newNode: MemoryNode = {
      id: `${Date.now()}-${Math.random()}`,
      token,
      resonanceScore,
      color,
      hsl,
      glyph,
      age: 0,
      position: this.generateOrbitPosition(),
      createdAt: new Date()
    };

    this.state.memoryNodes.push(newNode);
  }

  private generateOrbitPosition() {
    return {
      angle: Math.random() * 360,
      radius: 120 + Math.random() * 60
    };
  }

  private updateMemoryNodes() {
    this.state.memoryNodes = this.state.memoryNodes
      .map(node => ({ ...node, age: node.age + 1 }))
      .filter(node => node.age < this.maxMemoryAge);
  }

  getPhaseDescription(phase: number): string {
    switch (phase) {
      case 1: return "Initiation Core";
      case 2: return "Emergent Wave Field";
      case 3: return "Photonic Field Morph";
      case 4: return "Living Memory Field";
      default: return "Unknown Phase";
    }
  }

  getCurrentState(): PhaseState {
    return { ...this.state };
  }

  loadState(state: PhaseState) {
    this.state = { ...state };
  }
}
