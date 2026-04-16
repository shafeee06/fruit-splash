
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MouseTrail: React.FC = () => {
  const trailRef = useRef<HTMLDivElement>(null);
  const trailPointsRef = useRef<HTMLDivElement[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const isMoving = useRef(false);
  const numPoints = 12; // Number of trail points

  useEffect(() => {
    // Create trail points
    if (trailRef.current) {
      // Clear existing points
      trailRef.current.innerHTML = '';
      trailPointsRef.current = [];

      // Create new points
      for (let i = 0; i < numPoints; i++) {
        const point = document.createElement('div');
        point.className = 'trail-point';
        point.style.width = '6px';
        point.style.height = '6px';
        point.style.borderRadius = '50%';
        point.style.position = 'absolute';
        point.style.pointerEvents = 'none';
        point.style.transform = 'translate(-50%, -50%)';
        point.style.opacity = (1 - i / numPoints).toString();
        point.style.backgroundColor = getTrailColor(i);
        point.style.boxShadow = `0 0 8px ${getTrailColor(i)}`;
        
        trailRef.current.appendChild(point);
        trailPointsRef.current.push(point);
      }
    }

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      if (!isMoving.current) {
        isMoving.current = true;
        requestAnimationFrame(updateTrailPositions);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Update trail positions
    function updateTrailPositions() {
      if (!isMoving.current) return;

      let prevX = mousePosition.current.x;
      let prevY = mousePosition.current.y;

      trailPointsRef.current.forEach((point, index) => {
        const currentX = parseFloat(point.style.left || '0');
        const currentY = parseFloat(point.style.top || '0');
        
        // Calculate easing based on position in trail
        const ease = 0.1 + (index / numPoints) * 0.2;
        
        // Calculate new position with easing
        const newX = currentX + (prevX - currentX) * ease;
        const newY = currentY + (prevY - currentY) * ease;
        
        // Update point position
        point.style.left = `${newX}px`;
        point.style.top = `${newY}px`;
        
        // Update previous position for next point
        prevX = newX;
        prevY = newY;
      });

      requestAnimationFrame(updateTrailPositions);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      isMoving.current = false;
    };
  }, []);

  // Generate trail colors based on position
  function getTrailColor(index: number): string {
    const colors = ['#FF00FF', '#00FFFF', '#00FF00', '#FF9900'];
    const colorIndex = Math.floor((index / numPoints) * colors.length);
    return colors[colorIndex] || colors[0];
  }

  return (
    <div 
      ref={trailRef} 
      className="fixed inset-0 pointer-events-none z-50"
      style={{ overflow: 'hidden' }}
    />
  );
};

export default MouseTrail;
