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
        return '😤';
      case 'crying':
        return '😭';
      case 'auto_driver':
        return '🛺';
      case 'recovering':
        return '😌';
      case 'chill':
      default:
        return '🤖';
    }
  };

  return (
    <>
      {/* 1. Safe Top-Right Audio Control Overlay */}
      <div className="fixed top-2.5 right-3 z-50 flex items-center gap-2">
        <button
          onClick={handleToggleMute}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all active:scale-95 cursor-pointer shadow-md backdrop-blur-md ${
            isMuted
              ? 'bg-slate-900/90 text-slate-400 border-slate-700 hover:text-slate-200'
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80'
          }`}
          title={isMuted ? 'Unmute Procedural Audio & Voice' : 'Mute OS Audio Feedback'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Audio On</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Persistent High-Contrast Subtitle Banner with Typewriter Effect */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[92vw] pointer-events-none select-none">
        <div className="bg-[#05070D]/95 border border-slate-700/80 shadow-2xl shadow-black/90 rounded-2xl p-3.5 flex items-start gap-3.5 backdrop-blur-xl pointer-events-auto transition-all duration-300">
          {/* Animated Avatar Mascot */}
          <div className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            {getAvatarEmoji(dialogue.avatarMood)}
          </div>

          {/* Subtitle Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Namma Assistant
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {dialogue.tag}
                </span>
              </div>

              {dialogue.kannadaGlossary && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                  {dialogue.kannadaGlossary}
                </span>
              )}
            </div>

            <p className="text-sm font-sans text-slate-100 font-medium leading-relaxed tracking-normal min-h-[1.5rem]">
              "{displayedText || dialogue.text}"
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

