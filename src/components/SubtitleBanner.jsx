import React, { useMemo } from 'react';
import { useOS } from '../app/osStateMachine';
import { selectDialogue } from '../logic/dialogueSelector';
import { MessageSquare, Sparkles, Volume2 } from 'lucide-react';

export function SubtitleBanner() {
  const { state } = useOS();

  // Evaluate dialogue based on current state & event history
  const dialogue = useMemo(() => {
    return selectDialogue(state);
  }, [state.mood, state.trust, state.eventHistory]);

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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[90vw] pointer-events-none select-none">
      <div className="bg-slate-950/95 border border-slate-700/80 shadow-2xl shadow-black/80 rounded-xl px-4 py-3 flex items-start gap-3 backdrop-blur-md transition-all duration-300 pointer-events-auto">
        {/* Animated Avatar Icon */}
        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0 shadow-inner">
          {getAvatarEmoji(dialogue.avatarMood)}
        </div>

        {/* Dialogue Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>Namma Assistant</span>
              <span className="text-[10px] text-slate-500 lowercase">({dialogue.tag})</span>
            </span>

            {dialogue.kannadaGlossary && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {dialogue.kannadaGlossary}
              </span>
            )}
          </div>

          <p className="text-sm font-sans text-slate-100 font-medium leading-relaxed tracking-normal">
            "{dialogue.text}"
          </p>
        </div>
      </div>
    </div>
  );
}

