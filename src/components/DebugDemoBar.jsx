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
  Sparkles,
  Gamepad2,
  Heart
} from 'lucide-react';

const SAMPLE_MISTAKES = [
  { type: 'UNBALANCED_BRACKET', detail: 'SyntaxError: Unexpected token ")", missing matching bracket on line 4', penalty: 15 },
  { type: 'MISSING_SEMICOLON', detail: 'StyleError: Missing mandatory semicolon after statement definition', penalty: 10 },
  { type: 'FORBIDDEN_VAR_KEYWORD', detail: 'LegacySyntaxError: "var" keyword detected. This is 2026, use const or let!', penalty: 20 },
  { type: 'UNRESOLVED_PROMISE', detail: 'UnhandledPromiseRejection: Memory leak in async routine', penalty: 15 },
];

export function DebugDemoBar({ onJudgeReset }) {
  const { state, actions } = useOS();
  const [mistakeIndex, setMistakeIndex] = useState(0);

  const handleReset = () => {
    if (onJudgeReset) {
      onJudgeReset();
    } else {
      actions.resetDemo();
    }
  };

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

  // Neo-brutalist badge colors
  const getMoodBadge = (mood) => {
    switch (mood) {
      case OSMood.CALM:
        return 'bg-emerald-400 text-black';
      case OSMood.SLIGHTLY_ANNOYED:
        return 'bg-amber-400 text-black';
      case OSMood.PERSONAL_BETRAYAL:
        return 'bg-orange-500 text-black';
      case OSMood.MENTAL_BREAKDOWN:
        return 'bg-rose-500 text-white animate-pulse';
      case OSMood.BENGALURU_BOSS_FIGHT:
        return 'bg-purple-500 text-white animate-bounce';
      case OSMood.RECOVERY:
        return 'bg-cyan-400 text-black';
      default:
        return 'bg-gray-400 text-black';
    }
  };

  // Hearts calculation
  const getHearts = (trust) => {
    const count = Math.ceil(trust / 20);
    return Array.from({ length: 5 }, (_, i) => i < count);
  };

  return (
    <header className="w-full bg-[#181924] border-b-2 border-black px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-50 select-none shadow-[0_2px_0_#000]">
      {/* Brand & Telemetry Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#FACC15] text-black font-black px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000] tracking-wider uppercase">
          <span className="text-sm">💀</span>
          <span>SKILLISSUE.EXE</span>
          <span className="bg-black text-[#FACC15] text-[10px] px-1 py-0.2 rounded font-mono">
            CODEDAY ED.
          </span>
        </div>

        {/* Hearts & Trust Counter */}
        <div className="flex items-center gap-2 bg-[#232538] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] font-mono">
          <div className="flex items-center gap-0.5 text-rose-500">
            {getHearts(state.trust).map((isFilled, idx) => (
              <span key={idx} className={isFilled ? 'text-rose-500' : 'text-slate-600'}>
                {isFilled ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
          <span className="text-slate-300 font-bold ml-1">HP:</span>
          <span className={`font-black text-sm ${state.trust <= 34 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
            {state.trust}%
          </span>
        </div>

        {/* Mood Badge */}
        <div className={`px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000] font-black uppercase text-[11px] flex items-center gap-1.5 ${getMoodBadge(state.mood)}`}>
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>{state.mood.replace(/_/g, ' ')}</span>
        </div>
      </div>

      {/* Quick-Trigger Debug Action Buttons (Neo Arcade Style) */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Force Mistake */}
        <button
          onClick={handleForceMistake}
          className="neo-btn bg-amber-400 text-black px-2.5 py-1 text-xs flex items-center gap-1"
          title="Inject syntax error (-15 HP)"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Mistake</span>
        </button>

        {/* Spam Click */}
        <button
          onClick={handleSimulateSpam}
          className="neo-btn bg-cyan-400 text-black px-2.5 py-1 text-xs flex items-center gap-1"
          title="Simulate rapid clicks (-15 HP)"
        >
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>Spam Click</span>
        </button>

        {/* Touch Prod DB */}
        <button
          onClick={handleTouchProdDB}
          className="neo-btn bg-rose-500 text-white px-2.5 py-1 text-xs flex items-center gap-1"
          title="Click forbidden button (-30 HP)"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Drop DB</span>
        </button>

        {/* Trigger Meltdown */}
        <button
          onClick={actions.triggerMeltdown}
          className="neo-btn bg-orange-500 text-black px-2.5 py-1 text-xs flex items-center gap-1"
          title="Trigger 2D physics collapse"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Meltdown</span>
        </button>

        {/* Trigger Boss Fight */}
        <button
          onClick={actions.triggerBossFight}
          className="neo-btn bg-purple-400 text-black px-2.5 py-1 text-xs flex items-center gap-1"
          title="Trigger Auto Rickshaw Boss Fight"
        >
          <Skull className="w-3.5 h-3.5" />
          <span>Boss Fight</span>
        </button>

        {/* Reset for Next Judge */}
        <button
          onClick={handleReset}
          className="neo-btn bg-emerald-400 text-black px-3 py-1 text-xs font-black flex items-center gap-1.5 shadow-[3px_3px_0px_#000]"
          title="Instant Reset for Next Judge (Shift + Escape)"
        >
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          <span>RESET JUDGE</span>
          <kbd className="hidden xl:inline-block px-1 rounded bg-black text-[#4ADE80] text-[10px] font-mono">
            Shift+Esc
          </kbd>
        </button>
      </div>
    </header>
  );
}
