"use client";

import { useState, useEffect, useRef } from 'react';
import GiftBox from '@/components/GiftBox';
import BirthdayContent from '@/components/BirthdayContent';
import FloatingHearts from '@/components/FloatingHearts'; // Import the new component
import { generatePoem, type GeneratePoemInput } from '@/ai/flows/generate-poem';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Configuration for the poem - user (boyfriend) would set this
const POEM_CONFIG: GeneratePoemInput = {
  girlfriendName: "My Dearest Love", // Customize this
  relationshipDetails: "Every moment with you is a cherished memory, a beautiful song. Our laughter, our dreams, the way our hands fit perfectly together.", // Customize this
  affectionHints: "You are the melody in my heart, the sunshine in my sky. My love for you is as vast as the universe and as deep as the ocean.", // Customize this
};

export default function HomePage() {
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [generatedPoem, setGeneratedPoem] = useState<string | null>(null);
  const [isLoadingPoem, setIsLoadingPoem] = useState(false);
  const [showFinalSurprise, setShowFinalSurprise] = useState(false);
  const [playVoiceTrigger, setPlayVoiceTrigger] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false); // State for heart animation

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const bgMusic = new Audio('/music.mp3');
    bgMusic.loop = true;
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
    setShowHeartAnimation(true); // Show heart animation

    // Optional: Hide heart animation after a few seconds
    // Average animation duration is ~2.75s + max delay 0.8s = ~3.55s. Hide after 4-5s.
    setTimeout(() => {
      setShowHeartAnimation(false);
    }, 5000);


    if (backgroundMusicRef.current) {
      try {
        backgroundMusicRef.current.muted = isMuted; 
        await backgroundMusicRef.current.play();
      } catch (error) {
        console.error("Music autoplay error:", error);
        toast({
          title: "Music Playback Notice",
          description: "Browser may have prevented automatic music playback. You can use the mute/unmute button.",
          variant: "default",
        });
      }
    }

    setIsLoadingPoem(true);
    try {
      const poemOutput = await generatePoem(POEM_CONFIG);
      setGeneratedPoem(poemOutput.poem);
    } catch (error) {
      console.error("Failed to generate poem:", error);
      setGeneratedPoem("My dearest, words may fail to capture all I feel, but know my love for you is truer than any poem could ever be. Happy Birthday."); // Fallback
      toast({
        title: "Poem Generation Error",
        description: "Could not generate a custom poem, but a heartfelt message is here for you.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPoem(false);
    }
  };

  const handleVoicePlayRequest = () => {
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
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 selection:bg-primary/30 selection:text-primary-foreground overflow-hidden">
      {showHeartAnimation && <FloatingHearts />} {/* Conditionally render FloatingHearts */}
      {!isGiftOpened ? (
        <GiftBox onOpen={handleOpenGift} />
      ) : (
        <BirthdayContent
          poem={generatedPoem}
          isLoadingPoem={isLoadingPoem}
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
            aria-label={isMuted ? "Unmute" : "Mute"} 
            className="rounded-full bg-card/70 hover:bg-card/90 backdrop-blur-sm p-2 shadow-md"
          >
            {isMuted ? <VolumeX className="h-5 w-5 text-primary" /> : <Volume2 className="h-5 w-5 text-primary" />}
          </Button>
        </div>
      )}
    </div>
  );
}
