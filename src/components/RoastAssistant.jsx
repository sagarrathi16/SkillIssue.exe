import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useOS } from '../app/osStateMachine';
import { selectDialogue } from '../logic/dialogueSelector';
import { audioManager } from '../audio/AudioManager';
import { Volume2, VolumeX, X, AlertTriangle } from 'lucide-react';

export function RoastAssistant() {
  const { state } = useOS();
  const [displayedText, setDisplayedText] = useState('');
  const [isMuted, setIsMuted] = useState(audioManager.isMuted);
  const [isVisible, setIsVisible] = useState(false);
  const previousTextRef = useRef('');
  const userInteractedRef = useRef(false);
  const hideTimerRef = useRef(null);

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

  // Cleanup hide timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // Evaluate the current context-aware roast dialogue
  const dialogue = useMemo(() => {
    return selectDialogue(state);
  }, [state.mood, state.trust, state.eventHistory, state.mistakeCount, state.ignoredWarnings]);

  // Trigger popup & sound dispatch when dialogue changes to an active mistake/event
  useEffect(() => {
    if (!dialogue || !dialogue.text) return;

    if (dialogue.text !== previousTextRef.current) {
      const isInitialMount = previousTextRef.current === '';
      previousTextRef.current = dialogue.text;

      // Do not popup on initial calm/idle states
      const isCalmIdle = dialogue.id === 'calm_welcome' || dialogue.id === 'calm_guarded';

      if (!isCalmIdle && !isInitialMount) {
        setIsVisible(true);

        // Reset previous auto-dismiss timer
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
        }

        // Auto-dismiss after 6 seconds
        hideTimerRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 6000);

        // 1. Play procedural sound effect & voice line
        try {
          audioManager.playSfx(dialogue.soundType);
          audioManager.speak(dialogue.text);
        } catch (e) {
          // Handled cleanly
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

  const handleDismiss = () => {
    setIsVisible(false);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
  };

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
      {/* 1. Top-Right Audio Control Button (Always accessible) */}
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

      {/* 2. Floating Event Meme Popup (Only appears on mistake, auto-dismisses in 6s) */}
      {isVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[94vw] select-none transition-all duration-300">
          <div className="bg-[#181926] border-3 border-black shadow-[6px_6px_0px_#000] p-4 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
            {/* Auto-Dismiss Progress Bar at Top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-black">
              <div className="h-full bg-[#FACC15] anim-dismiss-bar" />
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 w-6 h-6 bg-black text-white hover:bg-rose-500 flex items-center justify-center border border-black cursor-pointer z-10 transition-colors"
              title="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Big Prominent Meme Image */}
            {dialogue.meme && (
              <div className="w-full sm:w-48 sm:h-36 max-h-44 bg-black border-2 border-black shadow-[3px_3px_0px_#000] shrink-0 overflow-hidden flex flex-col">
                <img
                  src={dialogue.meme}
                  alt="Reaction Meme"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Roast Dialogue Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch pr-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xl">{getAvatarEmoji(dialogue.avatarMood)}</span>
                  <span className="bg-black text-[#FACC15] font-black text-[11px] px-2 py-0.5 border border-black uppercase font-mono tracking-wider">
                    TECH LEAD JUDGE
                  </span>
                  <span className="bg-[#C084FC] text-black font-black text-[10px] px-2 py-0.5 border border-black font-mono">
                    {dialogue.tag}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-mono text-white font-bold leading-relaxed tracking-normal mt-1">
                  "{displayedText || dialogue.text}"
                </p>
              </div>

              {dialogue.memeCaption && (
                <div className="mt-2.5">
                  <span className="bg-[#FACC15] text-black font-black text-[9px] px-2 py-0.5 border border-black font-mono uppercase inline-block shadow-[1px_1px_0px_#000]">
                    MEME: {dialogue.memeCaption}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
