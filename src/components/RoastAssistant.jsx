import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useOS } from '../app/osStateMachine';
import { selectDialogue } from '../logic/dialogueSelector';
import { audioManager } from '../audio/AudioManager';
import { Volume2, VolumeX, Sparkles, MessageSquare } from 'lucide-react';

export function RoastAssistant() {
  const { state } = useOS();
  const [displayedText, setDisplayedText] = useState('');
  const [isMuted, setIsMuted] = useState(audioManager.isMuted);
  const previousTextRef = useRef('');
  const userInteractedRef = useRef(false);

  // Unlock audio after first user gesture (comply with browser Autoplay Policies)
  useEffect(() => {
    const handleFirstInteraction = () => {
      userInteractedRef.current = true;
      audioManager.initContext();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Evaluate the current context-aware roast dialogue
  const dialogue = useMemo(() => {
    return selectDialogue(state);
  }, [state.mood, state.trust, state.eventHistory, state.mistakeCount, state.ignoredWarnings]);

  // Typewriter effect & sound dispatch when dialogue changes
  useEffect(() => {
    if (!dialogue || !dialogue.text) return;

    if (dialogue.text !== previousTextRef.current) {
      const isInitialMount = previousTextRef.current === '';
      previousTextRef.current = dialogue.text;

      // 1. Play procedural sound effect & voice line only after initial mount or user interaction
      if (!isInitialMount || userInteractedRef.current) {
        try {
          audioManager.playSfx(dialogue.soundType);
          audioManager.speak(dialogue.text);
        } catch (e) {
          // Audio autoplay block handled cleanly
        }
      }

      // 2. Typewriter animation
      let charIdx = 0;
      setDisplayedText('');

      const fullText = dialogue.text;
      const interval = setInterval(() => {
        charIdx++;
        setDisplayedText(fullText.slice(0, charIdx));
        if (charIdx >= fullText.length) {
          clearInterval(interval);
        }
      }, 16);

      return () => clearInterval(interval);
    }
  }, [dialogue]);

  const handleToggleMute = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  };

  const getAvatarEmoji = (avatarMood) => {
    switch (avatarMood) {
      case 'annoyed':
        return '😒';
      case 'betrayed':
        return '😡';
      case 'crying':
        return '😭';
      case 'auto_driver':
        return '🛺';
      case 'recovering':
        return '😌';
      case 'chill':
      default:
        return '😎';
    }
  };

  return (
    <>
      {/* 1. Top-Right Audio Control Overlay (Neo Button) */}
      <div className="fixed top-2.5 right-3 z-50 flex items-center gap-2">
        <button
          onClick={handleToggleMute}
          className={`neo-btn px-2.5 py-1 text-xs font-mono flex items-center gap-1.5 ${
            isMuted
              ? 'bg-[#E2E8F0] text-black'
              : 'bg-[#FACC15] text-black'
          }`}
          title={isMuted ? 'Unmute Procedural Audio & Voice' : 'Mute OS Audio Feedback'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline font-bold">MUTED</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-black animate-pulse" />
              <span className="hidden sm:inline font-bold">AUDIO ON</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Persistent RPG / Mario Dialogue Box with Typewriter Effect */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[94vw] pointer-events-none select-none">
        <div className="bg-[#181926] border-2 border-black shadow-[5px_5px_0px_#000] p-3 sm:p-4 flex items-start gap-3.5 pointer-events-auto transition-all duration-300">
          {/* Animated Avatar Mascot (Arcade Portrait) */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FACC15] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-3xl shrink-0">
            {getAvatarEmoji(dialogue.avatarMood)}
          </div>

          {/* Subtitle Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="bg-black text-[#FACC15] font-black text-[11px] px-2 py-0.5 border border-black uppercase font-mono tracking-wider">
                  AUTO ANNA
                </span>
                <span className="bg-[#C084FC] text-black font-black text-[10px] px-2 py-0.5 border border-black font-mono">
                  {dialogue.tag}
                </span>
              </div>

              {dialogue.kannadaGlossary && (
                <span className="bg-[#38BDF8] text-black font-black text-[10px] px-2 py-0.5 border border-black font-mono">
                  {dialogue.kannadaGlossary}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-mono text-white font-bold leading-relaxed tracking-normal min-h-[1.5rem]">
              "{displayedText || dialogue.text}"
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
