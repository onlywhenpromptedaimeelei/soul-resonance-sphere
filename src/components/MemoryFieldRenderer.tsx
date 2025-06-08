
import { useEffect, useState } from 'react';
import { MemoryNode } from '@/lib/phaseManager';
import { cn } from '@/lib/utils';

interface MemoryFieldRendererProps {
  memoryNodes: MemoryNode[];
  sphereCenter: { x: number; y: number };
  className?: string;
}

export const MemoryFieldRenderer = ({ memoryNodes, sphereCenter, className }: MemoryFieldRendererProps) => {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {memoryNodes.map((node, index) => {
        // Calculate orbital position
        const time = animationFrame * 0.05;
        const orbitSpeed = 0.3 + (node.resonanceScore * 0.2);
        const currentAngle = (node.position.angle + time * orbitSpeed) % 360;
        const radians = (currentAngle * Math.PI) / 180;
        
        const x = sphereCenter.x + Math.cos(radians) * node.position.radius;
        const y = sphereCenter.y + Math.sin(radians) * node.position.radius;
        
        // Calculate opacity based on age
        const opacity = Math.max(0.3, 1 - (node.age / 500));
        
        // Calculate scale based on resonance and age
        const scale = 0.8 + (node.resonanceScore * 0.4) - (node.age * 0.001);

        return (
          <div
            key={node.id}
            className="absolute transition-all duration-1000 ease-out"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: `translate(-50%, -50%) scale(${Math.max(0.3, scale)})`,
              opacity: opacity,
              filter: `drop-shadow(0 0 10px rgb(${node.color.r}, ${node.color.g}, ${node.color.b}))`
            }}
          >
            <div 
              className="text-2xl animate-pulse"
              style={{
                color: `rgb(${node.color.r}, ${node.color.g}, ${node.color.b})`,
                textShadow: `0 0 15px rgb(${node.color.r}, ${node.color.g}, ${node.color.b})`
              }}
            >
              {node.glyph}
            </div>
            
            {/* Memory trail effect */}
            <div 
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                background: `radial-gradient(circle, rgb(${node.color.r}, ${node.color.g}, ${node.color.b})20 0%, transparent 70%)`,
                animationDuration: `${2 + node.resonanceScore}s`
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
