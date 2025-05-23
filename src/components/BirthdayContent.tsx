
"use client";

import { useEffect, useRef, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, PlayCircle, Headphones } from 'lucide-react';

interface BirthdayContentProps {
  poem: string | null;
  onVoicePlayRequest: () => void;
  playVoiceTrigger: boolean;
  onVoiceEnded: () => void;
  showFinalSurprise: boolean;
}

export default function BirthdayContent({
  poem,
  onVoicePlayRequest,
  playVoiceTrigger,
  onVoiceEnded,
  showFinalSurprise,
}: BirthdayContentProps) {
  const [typedAnimationComplete, setTypedAnimationComplete] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceButtonText, setVoiceButtonText] = useState("Play My Voice");
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/voice.mp3'); // Assumes voice.mp3 is in /public
    audio.volume = 1.0; 
    voiceAudioRef.current = audio;

    const handleAudioEnd = () => {
      setIsVoicePlaying(false);
      setVoiceButtonText("Play My Voice"); 
      onVoiceEnded(); 
    };

    const handleAudioError = (e: Event) => {
      let errorMessage = 'Voice audio playback error. ';
      const audioEl = voiceAudioRef.current;

      if (audioEl && audioEl.error) {
        errorMessage += `Code: ${audioEl.error.code}. `;
        errorMessage += `Message: "${audioEl.error.message || 'No specific message.'}". `;
      } else {
        errorMessage += 'MediaError object not available on audio element. ';
      }
      errorMessage += `Event type: ${e.type}.`;

      console.error(errorMessage);

      setIsVoicePlaying(false);
      setVoiceButtonText("Couldn't Play Voice"); 
      onVoiceEnded(); 
    };

    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('error', handleAudioError);

    return () => {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.removeEventListener('ended', handleAudioEnd);
        voiceAudioRef.current.removeEventListener('error', handleAudioError);
        voiceAudioRef.current.pause();
        voiceAudioRef.current = null;
      }
    };
  }, [onVoiceEnded]);

  useEffect(() => {
    if (playVoiceTrigger && voiceAudioRef.current && voiceAudioRef.current.paused && !isVoicePlaying) {
      voiceAudioRef.current.play().then(() => {
        setIsVoicePlaying(true);
        setVoiceButtonText("Playing...");
      }).catch(err => {
        let playPromiseErrorMessage = "Voice audio play() promise rejected. ";
        if (err instanceof Error) {
          playPromiseErrorMessage += `Error: ${err.name} - ${err.message}. `;
        } else {
          playPromiseErrorMessage += `Caught: ${String(err)}. `;
        }

        const audioEl = voiceAudioRef.current;
        if (audioEl && audioEl.error) {
          playPromiseErrorMessage += `Current MediaError on element - Code: ${audioEl.error.code}, Message: "${audioEl.error.message || 'N/A'}".`;
        }
        console.error(playPromiseErrorMessage);
        
        setIsVoicePlaying(false);
        setVoiceButtonText("Play My Voice"); 
        onVoiceEnded(); 
      });
    }
  }, [playVoiceTrigger, onVoiceEnded, isVoicePlaying]);

  const handlePlayVoiceClick = () => {
    if (voiceAudioRef.current && voiceAudioRef.current.paused && !isVoicePlaying) {
      onVoicePlayRequest(); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 md:p-6 animate-fadeIn-content max-w-xl lg:max-w-2xl mx-auto">
      <div className="mb-6 md:mb-8">
        <TypeAnimation
          sequence={[
            "Happy Birthday Nani...", // Changed text here
            2500,
            "This day is special because of you.",
            2500,
            () => {
              setTypedAnimationComplete(true);
            },
          ]}
          wrapper="h1"
          cursor={true}
          repeat={0}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary drop-shadow-lg"
          style={{ whiteSpace: 'pre-line', minHeight: '100px' }}
        />
      </div>

      {typedAnimationComplete && !showFinalSurprise && (
        <Button
          onClick={handlePlayVoiceClick}
          disabled={isVoicePlaying && voiceButtonText === "Playing..."}
          className={`my-6 md:my-8 px-5 py-3 md:px-6 md:py-3 text-md md:text-lg bg-accent hover:bg-purple-500 text-accent-foreground rounded-full shadow-lg transition-all hover:shadow-xl transform hover:scale-105 animate-fadeIn-content ${isVoicePlaying ? 'opacity-70 cursor-default' : ''}`}
          aria-label={voiceButtonText}
        >
          {isVoicePlaying ? <Headphones className="mr-2 h-5 w-5 md:h-6 md:w-6 animate-pulse" /> : <PlayCircle className="mr-2 h-5 w-5 md:h-6 md:w-6" />}
          {voiceButtonText}
        </Button>
      )}


      {showFinalSurprise && (
        <div className="mt-6 md:mt-8 space-y-4 md:space-y-6 animate-heartFade-anim w-full">
          {poem && (
            <div className="p-4 md:p-6 bg-primary/10 rounded-xl shadow-inner backdrop-blur-sm border border-primary/20">
              <h2 className="text-xl md:text-2xl font-semibold text-primary mb-2 md:mb-3">A Little Poem For You:</h2>
              <p className="text-md md:text-lg whitespace-pre-line leading-relaxed text-foreground/90">
                {poem}
              </p>
            </div>
          )}
          <div className="p-4 md:p-6 bg-accent/10 rounded-xl shadow-inner backdrop-blur-sm border border-accent/20">
            <p className="text-lg md:text-xl font-medium text-foreground/90 leading-relaxed">
              You’re not just older, you’re more loved than ever.
            </p>
            <p className="text-lg md:text-xl font-semibold text-primary mt-1 md:mt-2">
              Happy Birthday Best Friend
            </p>
          </div>

          <div className="flex justify-center space-x-3 md:space-x-4 pt-4 md:pt-6">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className="w-7 h-7 md:w-9 md:h-9 text-primary animate-pulse-heart-icon"
                style={{ animationDelay: `${i * 0.25}s` }}
                fill="currentColor"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
