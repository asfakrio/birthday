
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';

interface GiftBoxProps {
  onOpen: () => void;
}

export default function GiftBox({ onOpen }: GiftBoxProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const handleOpenClick = () => {
    setIsOpening(true);
    // Lid animation duration is 0.8s. Box hide animation starts at 0.3s and lasts 0.5s.
    // The gift box itself (the container div) will start hiding after 0.3s.
    // onOpen should be called when animations are substantially complete or after main visual change.
    setTimeout(() => {
       onOpen(); // Callback to signal parent
    }, 300); // Call onOpen slightly before full animation completes to start loading next content.

    // Set the box to be fully hidden after all animations would have completed.
    setTimeout(() => {
        setIsHidden(true);
    }, 800 + 200); // Lid (0.8s) + Box hide (0.5s starting at 0.3s) + buffer
  };

  if (isHidden) {
    return null; 
  }

  return (
    <div className={`flex flex-col items-center justify-center transition-opacity duration-500 ${isOpening ? 'animate-giftBoxHide' : ''}`}>
      <div className={`relative w-40 h-32 md:w-48 md:h-36 mb-8 ${!isOpening ? 'animate-bounce-gift' : ''}`}>
        {/* Lid */}
        <div
          className={`absolute w-full h-10 md:h-12 bg-primary rounded-t-lg shadow-lg 
                      ${isOpening ? 'animate-giftLidOpen' : ''}`}
          style={{ top: '-1rem', left: 0, zIndex: 10, transformOrigin: 'bottom center' }}
        >
          {/* Lid Top Detail - simplified */}
          <div className="absolute inset-x-0 top-1 h-2 bg-pink-300/50 rounded-t-md"></div>
          {/* Ribbon Bow on Lid */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="w-3 h-6 bg-accent rounded-t-full opacity-90 -rotate-45 relative -mr-1 inline-block"></div>
            <div className="w-3 h-6 bg-accent rounded-t-full opacity-90 rotate-45 relative -ml-1 inline-block"></div>
          </div>
        </div>
        {/* Box */}
        <div className="w-full h-full bg-pink-400 rounded-lg shadow-xl flex items-center justify-center overflow-hidden relative pt-4"> {/* pt-4 to make space for lid visual overlap */}
           {/* Vertical Ribbon */}
          <div className="absolute w-6 md:w-8 h-[110%] bg-accent opacity-80 top-[-5%] left-1/2 -translate-x-1/2"></div>
           {/* Horizontal Ribbon */}
          <div className="absolute h-6 md:h-8 w-[105%] bg-accent opacity-80 left-[-2.5%] top-1/2 -translate-y-[70%]"></div> {/* Adjusted position for better visual */}
           <Gift className="w-12 h-12 md:w-16 md:h-16 text-white opacity-20 z-10 relative" />
        </div>
      </div>
      <Button
        onClick={handleOpenClick}
        disabled={isOpening}
        className="px-6 py-3 md:px-8 md:py-4 text-md md:text-lg font-semibold bg-accent hover:bg-purple-500 text-accent-foreground rounded-full shadow-lg transition-all hover:shadow-xl transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-accent/50"
        aria-label="Open Your Surprise Nani"
      >
        {isOpening ? 'Opening...' : 'Open Your Surprise Nani!'}
      </Button>
    </div>
  );
}
