
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

type FruitProps = {
  imageSrc: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  initialPosition: { x: number; y: number };
  delay?: number;
  rotation?: number;
};

const Fruit = ({
  imageSrc,
  className,
  size = 'md',
  initialPosition,
  delay = 0,
  rotation = 0,
}: FruitProps) => {
  const fruitRef = useRef<HTMLDivElement>(null);
  const originalPosition = useRef(initialPosition);

  // Size classes mapping
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  useEffect(() => {
    if (!fruitRef.current) return;
    
    // Initial animation
    gsap.fromTo(
      fruitRef.current,
      { 
        x: -100, 
        y: -100, 
        opacity: 0,
        scale: 0,
        rotation: -180
      },
      { 
        x: initialPosition.x, 
        y: initialPosition.y, 
        opacity: 1,
        scale: 1,
        rotation: rotation,
        delay: delay,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
      }
    );
    
    // Set up a slight floating animation
    gsap.to(fruitRef.current, {
      y: `+=${Math.random() * 30 - 15}`,
      x: `+=${Math.random() * 20 - 10}`,
      rotation: rotation + Math.random() * 20 - 10,
      duration: 2 + Math.random() * 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
  }, [initialPosition.x, initialPosition.y, delay, rotation]);

  // Function to handle scatter animation on hover
  const handleScatter = () => {
    if (!fruitRef.current) return;
    
    gsap.to(fruitRef.current, {
      x: initialPosition.x + (Math.random() * 200 - 100),
      y: initialPosition.y + (Math.random() * 200 - 100),
      rotation: rotation + Math.random() * 360,
      scale: 0.8 + Math.random() * 0.4,
      duration: 0.8,
      ease: "power2.out"
    });
  };

  // Return to original position
  const handleReturn = () => {
    if (!fruitRef.current) return;
    
    gsap.to(fruitRef.current, {
      x: originalPosition.current.x,
      y: originalPosition.current.y,
      rotation: rotation,
      scale: 1,
      duration: 1,
      ease: "elastic.out(1, 0.5)"
    });
  };

  return (
    <div 
      ref={fruitRef}
      className={cn(
        "absolute fruit cursor-pointer rounded-full overflow-hidden shadow-lg",
        sizeClasses[size],
        className
      )}
      onMouseEnter={handleScatter}
      onMouseLeave={handleReturn}
    >
      <img 
        src={imageSrc} 
        alt="Fruit" 
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );
};

export default Fruit;
