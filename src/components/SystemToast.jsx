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

  return (
    <div
      data-physics-id="system-toast-banner"
      className={`fixed top-14 right-6 z-40 max-w-md w-[90vw] transition-all duration-300 ${
        isBetrayal ? 'mood-betrayal-tilted-right anim-personal-betrayal' : ''
      }`}
    >
      <div
        className={`p-3.5 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 ${
          isBetrayal
            ? 'bg-rose-950/90 border-rose-500/80 text-rose-100 shadow-rose-900/50'
            : 'bg-amber-950/90 border-amber-500/60 text-amber-100 shadow-amber-950/50'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {isBetrayal ? (
            <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className={`text-xs font-mono font-bold tracking-wider uppercase ${
                isBetrayal ? 'text-rose-400' : 'text-amber-400'
              }`}
            >
              {activeWarning.mistakeType?.replace(/_/g, ' ') || 'SYSTEM WARNING'}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {new Date(activeWarning.timestamp).toLocaleTimeString([], {
                hour12: false,
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>

          <p className="text-xs font-sans text-slate-200 leading-snug">
            {activeWarning.message}
          </p>

          <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="text-[10px] text-amber-300/80 italic">
              Fix code before running again
            </span>
            <button
              onClick={handleDismiss}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-all active:scale-95 cursor-pointer ${
                isBetrayal
                  ? 'bg-rose-900/50 hover:bg-rose-800 text-rose-200 border-rose-600'
                  : 'bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 border-amber-600/50'
              }`}
            >
              <span>Dismiss</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

