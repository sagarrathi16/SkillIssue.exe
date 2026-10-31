import React from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { AlertCircle, X, ShieldAlert, AlertTriangle } from 'lucide-react';

export function SystemToast({ onDismissWarning }) {
  const { state, actions } = useOS();
  const { activeWarning, mood } = state;

  if (!activeWarning) return null;

  const isBetrayal = mood === OSMood.PERSONAL_BETRAYAL;
  const isMeltdown = mood === OSMood.MENTAL_BREAKDOWN || mood === OSMood.BENGALURU_BOSS_FIGHT;

  const handleDismiss = () => {
    if (onDismissWarning) {
      onDismissWarning();
    } else {
      actions.dismissWarning();
    }
  };

  const getToastMeme = () => {
    if (activeWarning.meme) return activeWarning.meme;
    switch (activeWarning.mistakeType) {
      case 'DEPRECATED_VAR':
        return '/memes/drake_var.jpg';
      case 'FORBIDDEN_ACTION':
        return '/memes/disaster_girl.jpg';
      case 'IGNORED_WARNING':
        return '/memes/clown_makeup.jpg';
      case 'RAPID_CLICK':
        return '/memes/panik_kalm.png';
      default:
        return '/memes/this_is_fine.jpg';
    }
  };

  const toastMeme = getToastMeme();

  return (
    <div
      data-physics-id="system-toast-banner"
      className={`fixed top-14 right-6 z-40 max-w-md w-[90vw] transition-all duration-300 ${
        isBetrayal ? 'mood-betrayal-tilted-right anim-personal-betrayal' : ''
      }`}
    >
      <div
        className={`p-4 border-2 border-black shadow-[5px_5px_0px_#000] flex items-start gap-3.5 select-none ${
          isBetrayal
            ? 'bg-[#FF8080] text-black'
            : 'bg-[#FDE047] text-black'
        }`}
      >
        {/* Meme Thumbnail Stamp */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black border-2 border-black shadow-[2px_2px_0px_#000] shrink-0 overflow-hidden">
          <img
            src={toastMeme}
            alt="Meme"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="bg-black text-[#FACC15] px-2 py-0.5 font-black text-[10px] uppercase font-mono tracking-wider">
              {activeWarning.mistakeType?.replace(/_/g, ' ') || 'SYSTEM WARNING'}
            </span>
            <span className="text-[10px] font-mono font-bold text-black opacity-80">
              {new Date(activeWarning.timestamp).toLocaleTimeString([], {
                hour12: false,
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>

          <p className="text-xs font-bold text-black leading-snug font-mono">
            {activeWarning.message}
          </p>

          <div className="mt-3 text-xs font-mono flex items-center justify-between gap-2">
            <span className="text-[10px] text-black font-extrabold uppercase bg-black/10 px-1.5 py-0.5">
              ⚠️ DO NOT RE-RUN UNMODIFIED
            </span>
            <button
              onClick={handleDismiss}
              className="neo-btn bg-black text-white px-3 py-1 font-black text-xs flex items-center gap-1"
            >
              <span>DISMISS</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
