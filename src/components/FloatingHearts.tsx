
"use client";

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

const NUM_HEARTS = 20; // Number of hearts in the burst

interface HeartStyle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
  transform: string; 
  opacity: number; // Initial opacity, animation handles fading in/out
  '--translate-y-target': string; // CSS Custom Property for Y target
  '--translate-x-target': string; // CSS Custom Property for X target
  '--rotate-target': string;    // CSS Custom Property for rotation target
  '--scale-target': string;     // CSS Custom Property for scale target
  size: number;                 // Size of the heart icon
}

export default function FloatingHearts() {
  const [heartStyles, setHeartStyles] = useState<HeartStyle[]>([]);

  useEffect(() => {
    const newStyles: HeartStyle[] = [];
    for (let i = 0; i < NUM_HEARTS; i++) {
      const initialScale = 0.4 + Math.random() * 0.5; // Initial scale from 0.4 to 0.9
      const initialRotate = Math.random() * 90 - 45; // Initial rotation from -45deg to 45deg
      
      newStyles.push({
        left: `${Math.random() * 70 + 15}%`, // Horizontal position (15% to 85%)
        top: `${Math.random() * 20 + 40}%`,   // Vertical start (40% to 60% from top)
        animationDelay: `${Math.random() * 0.8}s`, // Staggered start for burst effect
        animationDuration: `${2 + Math.random() * 1.5}s`, // Animation duration 2s to 3.5s
        opacity: 0, // Start invisible; animation fades them in then out
        transform: `scale(${initialScale}) rotate(${initialRotate}deg)`,
        '--translate-y-target': `${-(150 + Math.random() * 100)}px`, // Target Y: -150px to -250px (upwards)
        '--translate-x-target': `${Math.random() * 100 - 50}px`,    // Target X: -50px to 50px (slight horizontal drift)
        '--rotate-target': `${initialRotate + (Math.random() * 60 - 30)}deg`, // Further rotation
        '--scale-target': `${initialScale * (1.2 + Math.random() * 0.5)}`,   // Grow slightly
        size: Math.random() * 20 + 25, // Icon size 25px to 45px
      });
    }
    setHeartStyles(newStyles);
  }, []);

  // Don't render if styles haven't been calculated yet to avoid flash of unstyled content
  if (heartStyles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden" aria-hidden="true">
      {heartStyles.map((styleProps, index) => (
        <Heart
          key={index}
          className="absolute text-primary/60 animate-float-up-fade" // text-primary with 60% alpha, applies animation class
          fill="currentColor" // Fill the heart with the (transparent) primary color
          style={{
            left: styleProps.left,
            top: styleProps.top,
            opacity: styleProps.opacity,
            transform: styleProps.transform,
            animationDelay: styleProps.animationDelay,
            animationDuration: styleProps.animationDuration,
            '--translate-y-target': styleProps['--translate-y-target'],
            '--translate-x-target': styleProps['--translate-x-target'],
            '--rotate-target': styleProps['--rotate-target'],
            '--scale-target': styleProps['--scale-target'],
          } as React.CSSProperties} // Cast to include CSS custom properties
          size={styleProps.size}
        />
      ))}
    </div>
  );
}
