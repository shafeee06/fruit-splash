
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

type NeonTextProps = {
  text: string;
  color: string;
  glowColor?: string;
  className?: string;
  flickering?: boolean;
};

const NeonText: React.FC<NeonTextProps> = ({
  text,
  color,
  glowColor,
  className,
  flickering = false,
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const effectiveGlowColor = glowColor || color;

  useEffect(() => {
    if (!textRef.current || !flickering) return;

    // Random flicker effect
    const createFlickerTimeline = () => {
      const timeline = gsap.timeline({
        delay: Math.random() * 5,
        onComplete: createFlickerTimeline
      });
      
      const flickerDuration = 0.1;
      
      // Single flicker sequence
      for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
        timeline.to(textRef.current, {
          opacity: 0.5,
          textShadow: `0 0 2px ${effectiveGlowColor}`,
          duration: flickerDuration
        });
        
        timeline.to(textRef.current, {
          opacity: 1,
          textShadow: `0 0 5px ${effectiveGlowColor}, 0 0 10px ${effectiveGlowColor}, 0 0 20px ${effectiveGlowColor}`,
          duration: flickerDuration
        });
      }
      
      return timeline;
    };
    
    const masterTimeline = createFlickerTimeline();
    
    return () => {
      masterTimeline.kill();
    };
  }, [color, effectiveGlowColor, flickering]);

  // Initial animation
  useEffect(() => {
    if (!textRef.current) return;
    
    gsap.fromTo(
      textRef.current,
      { 
        opacity: 0,
        scale: 0.8,
        y: -30,
      },
      { 
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
      }
    );
  }, []);

  return (
    <div
      ref={textRef}
      className={cn('font-bold text-shadow-neon transition-all duration-300', className)}
      style={{ 
        color: color,
        textShadow: `0 0 5px ${effectiveGlowColor}, 0 0 10px ${effectiveGlowColor}, 0 0 20px ${effectiveGlowColor}`,
      }}
    >
      {text}
    </div>
  );
};

export default NeonText;
