import React, { useState } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { 
  AlertTriangle, 
  Flame, 
  Skull, 
  RotateCcw, 
  Zap, 
  ShieldAlert, 
  MousePointerClick,
  Sparkles
} from 'lucide-react';

const SAMPLE_MISTAKES = [
  { type: 'UNBALANCED_BRACKET', detail: 'SyntaxError: Unexpected token ")", missing matching bracket on line 4', penalty: 15 },
  { type: 'MISSING_SEMICOLON', detail: 'StyleError: Missing mandatory semicolon after statement definition', penalty: 10 },
  { type: 'FORBIDDEN_VAR_KEYWORD', detail: 'LegacySyntaxError: "var" keyword detected. This is 2026, use const or let!', penalty: 20 },
  { type: 'UNRESOLVED_PROMISE', detail: 'UnhandledPromiseRejection: Memory leak in async routine', penalty: 15 },
];

export function DebugDemoBar() {
  const { state, actions } = useOS();
  const [mistakeIndex, setMistakeIndex] = useState(0);

  const handleForceMistake = () => {
    const mistake = SAMPLE_MISTAKES[mistakeIndex % SAMPLE_MISTAKES.length];
    setMistakeIndex((prev) => prev + 1);
    actions.reportMistake(mistake.type, mistake.detail, mistake.penalty);
  };

  const handleSimulateSpam = () => {
    actions.reportRapidClick('Save_Code_Button', 5);
  };

  const handleTouchProdDB = () => {
    actions.touchForbiddenControl('PROD_DB_PRIMARY_DROP');
  };

  // Color mapper for moods
  const getMoodBadge = (mood) => {
    switch (mood) {
      case OSMood.CALM:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case OSMood.SLIGHTLY_ANNOYED:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case OSMood.PERSONAL_BETRAYAL:
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case OSMood.MENTAL_BREAKDOWN:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse font-semibold';
      case OSMood.BENGALURU_BOSS_FIGHT:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold';
      case OSMood.RECOVERY:
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 animate-pulse';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  // Trust bar fill color
  const getTrustBarColor = (trust) => {
    if (trust > 65) return 'bg-emerald-500';
    if (trust > 35) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <header className="w-full bg-[#070A12]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-50 select-none">
      {/* Brand & Telemetry Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono font-bold tracking-wider text-slate-200">
          <span className="text-base">🛺</span>
          <span className="text-emerald-400">NAMMA FRAGILE OS</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-normal">
            DEMO CONTROLS
          </span>
        </div>

        {/* Live Trust Bar */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-800 font-mono">
          <span className="text-slate-400">Trust:</span>
          <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getTrustBarColor(state.trust)}`}
              style={{ width: `${Math.max(0, Math.min(100, state.trust))}%` }}
            />
          </div>
          <span className={`font-bold ${state.trust <= 34 ? 'text-rose-400' : 'text-slate-200'}`}>
            {state.trust}%
          </span>
        </div>

        {/* Mood Tag */}
        <div className={`px-2 py-0.5 rounded border text-[11px] font-mono flex items-center gap-1.5 ${getMoodBadge(state.mood)}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current inline-block animate-ping" />
          <span>{state.mood.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Quick-Trigger Debug Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Force Mistake */}
        <button
          onClick={handleForceMistake}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all active:scale-95 cursor-pointer font-medium"
          title="Inject a deterministic JavaScript error"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Force Mistake</span>
        </button>

        {/* Spam Click */}
        <button
          onClick={handleSimulateSpam}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition-all active:scale-95 cursor-pointer font-medium"
          title="Simulate 5 rapid clicks on a button"
        >
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>Simulate Spam</span>
        </button>

        {/* Touch Prod DB */}
        <button
          onClick={handleTouchProdDB}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all active:scale-95 cursor-pointer font-medium"
          title="Simulate clicking the forbidden Prod DB button"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Touch Prod DB</span>
        </button>

        {/* Trigger Meltdown */}
        <button
          onClick={actions.triggerMeltdown}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 transition-all active:scale-95 cursor-pointer font-medium"
          title="Instantly trigger mental breakdown (Trust = 20)"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Trigger Meltdown</span>
        </button>

        {/* Trigger Boss Fight */}
        <button
          onClick={actions.triggerBossFight}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 transition-all active:scale-95 cursor-pointer font-medium"
          title="Instantly trigger Bengaluru Auto Boss Fight (Trust = 0)"
        >
          <Skull className="w-3.5 h-3.5" />
          <span>Trigger Boss Fight</span>
        </button>

        {/* Simulate Recovery */}
        <button
          onClick={() => actions.startRecovery(85, { note: 'Manual Recovery Trigger' })}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 transition-all active:scale-95 cursor-pointer font-medium"
          title="Test spring reassembly animation (cubic-bezier restoration)"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate Recovery</span>
        </button>

        {/* Reset Demo */}
        <button
          onClick={actions.resetDemo}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-all active:scale-95 cursor-pointer font-bold"
          title="Reset the entire demo to pristine 100% Trust"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Hard Reset Demo</span>
        </button>

        {/* Hotkey Hint */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] text-slate-500 font-mono pl-1">
          <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400">~</kbd>
          <span>or</span>
          <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400">Ctrl+Shift+K</kbd>
        </div>
      </div>
    </header>
  );
}

