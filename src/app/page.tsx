
"use client";

import { useState, useEffect, useRef } from 'react';
import GiftBox from '@/components/GiftBox';
import BirthdayContent from '@/components/BirthdayContent';
import FloatingHearts from '@/components/FloatingHearts';
// Removed: import { generatePoem, type GeneratePoemInput } from '@/ai/flows/generate-poem';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// The user-provided static poem
const staticPoem = `Today’s your day, so full of cheer,
I’m so glad you are so near.
You make me smile, you make me laugh,
You light my world like a photograph.

You are so kind, so strong, so true,
There’s no one else quite like you.
You’re always there, through thick and thin,
With you beside me, I always win.

So on this day, I wish you joy,
More than any gift or toy.
May your dreams all come your way,
Happy, happy birthday!`;

export default function HomePage() {
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [generatedPoem, setGeneratedPoem] = useState<string | null>(null);
  // Removed: const [isLoadingPoem, setIsLoadingPoem] = useState(false);
  const [showFinalSurprise, setShowFinalSurprise] = useState(false);
  const [playVoiceTrigger, setPlayVoiceTrigger] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true); // Start muted to comply with autoplay policies
  const { toast } = useToast();

  useEffect(() => {
    // Initialize background music
    const bgMusic = new Audio('/happy-birthday.mp3'); // Assumes happy-birthday.mp3 is in /public
    bgMusic.loop = true;
    bgMusic.volume = 0.4; 
    backgroundMusicRef.current = bgMusic;
    
    setIsMuted(bgMusic.muted); 

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);


  const handleOpenGift = async () => {
    setIsGiftOpened(true);
    setShowHeartAnimation(true);
    setTimeout(() => {
      setShowHeartAnimation(false);
    }, 5000);

    if (backgroundMusicRef.current) {
      try {
        backgroundMusicRef.current.muted = isMuted; 
        await backgroundMusicRef.current.play();
      } catch (error) {
        console.error("Background music autoplay error:", error);
        toast({
          title: "Music Playback Notice",
          description: "Browser may have prevented automatic music playback. Use the mute/unmute button to control sound.",
          variant: "default", 
        });
      }
    }

    // Set the static poem directly
    setGeneratedPoem(staticPoem);
  };

  const handleVoicePlayRequest = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = isMuted;
      if (backgroundMusicRef.current.paused) {
        backgroundMusicRef.current.play().catch(error => {
          console.error("Error trying to play background music on voice request:", error);
          toast({
            title: "Music Playback Issue",
            description: "Could not start background music. You can try the mute/unmute button.",
            variant: "default", 
          });
        });
      }
    }
    setPlayVoiceTrigger(true); 
  };

  const handleVoiceEnded = () => {
    setShowFinalSurprise(true);
  };

  const toggleMute = () => {
    if (backgroundMusicRef.current) {
      const currentMutedState = !backgroundMusicRef.current.muted;
      backgroundMusicRef.current.muted = currentMutedState;
      setIsMuted(currentMutedState);
      if (!currentMutedState && backgroundMusicRef.current.paused) {
        backgroundMusicRef.current.play().catch(err => console.error("Error playing music on unmute:", err));
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 selection:bg-primary/30 selection:text-primary-foreground overflow-hidden">
      {showHeartAnimation && <FloatingHearts />}
      {!isGiftOpened ? (
        <GiftBox onOpen={handleOpenGift} />
      ) : (
        <BirthdayContent
          poem={generatedPoem}
          // Removed: isLoadingPoem={isLoadingPoem}
          onVoicePlayRequest={handleVoicePlayRequest}
          playVoiceTrigger={playVoiceTrigger}
          onVoiceEnded={handleVoiceEnded}
          showFinalSurprise={showFinalSurprise}
        />
      )}
       {isGiftOpened && backgroundMusicRef.current && (
        <div className="fixed top-6 right-6 z-50">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMute} 
            aria-label={isMuted ? "Unmute Background Music" : "Mute Background Music"} 
            className="rounded-full bg-card/70 hover:bg-card/90 backdrop-blur-sm p-2 shadow-md"
          >
            {isMuted ? <VolumeX className="h-5 w-5 text-primary" /> : <Volume2 className="h-5 w-5 text-primary" />}
          </Button>
        </div>
      )}
    </div>
  );
}
