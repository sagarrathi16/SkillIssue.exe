import React, { useRef } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { createClickTracker } from '../logic/mistakeDetector';
import { 
  GitBranch, 
  RotateCcw, 
  Layers,
  Wand2,
  MapPin,
  Flame,
  Radio
} from 'lucide-react';

export function TopBar({ onJudgeReset }) {
  const { state, actions } = useOS();
  const { mood, trust } = state;

  const handleReset = () => {
    if (onJudgeReset) {
      onJudgeReset();
    } else {
      actions.resetDemo();
    }
  };

  // Rapid click tracker for toolbar buttons
  const clickTrackerRef = useRef(createClickTracker(4, 1500));

  const handleToolbarClick = (buttonName) => {
    const { isSpam, count } = clickTrackerRef.current();
    if (isSpam) {
      actions.reportRapidClick(buttonName, count);
    }
  };

  const isAnnoyed = mood === OSMood.SLIGHTLY_ANNOYED;
  const isBetrayal = mood === OSMood.PERSONAL_BETRAYAL;

  return (
    <div
      className={`w-full bg-[#12131F] border-b-2 border-black px-4 py-2 flex items-center justify-between text-xs select-none transition-colors duration-300 ${
        isBetrayal
          ? 'bg-[#2A1117] border-rose-500 shadow-[0_3px_0_#F43F5E]'
          : isAnnoyed
          ? 'bg-[#1C1824]'
          : 'bg-[#12131F]'
      }`}
    >
      {/* 1. Window Controls & Branding (Collapsible Section) */}
      <div 
        data-physics-id="topbar-window-controls"
        className={`flex items-center gap-3 transition-transform ${
          isBetrayal ? 'mood-betrayal-tilted-left' : isAnnoyed ? 'anim-slightly-annoyed' : ''
        }`}
      >
        {/* Arcade Window Dots */}
        <div className="flex items-center gap-1.5 bg-black px-2 py-1 border border-black shadow-[1px_1px_0px_#000]">
          <div className="w-2.5 h-2.5 bg-rose-500 border border-black" />
          <div className="w-2.5 h-2.5 bg-amber-400 border border-black" />
          <div className="w-2.5 h-2.5 bg-emerald-400 border border-black" />
        </div>

        {/* Project Breadcrumb / Stage Info */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#1F2133] px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000] font-mono text-[11px]">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 font-bold">STAGE 1:</span>
          <span className="text-amber-300 font-black">silk_board_junction.js</span>
          {trust < 80 && (
            <span className={`text-[10px] px-1 font-bold ${isBetrayal ? 'bg-rose-500 text-white' : 'bg-amber-400 text-black'}`}>
              UNSAVED
            </span>
          )}
        </div>
      </div>

      {/* 2. Center Status Pill: Current Area & Weather */}
      <div
        data-physics-id="topbar-breadcrumbs"
        className={`hidden md:flex items-center gap-2 px-3 py-1 border-2 border-black font-mono text-[11px] font-bold transition-transform shadow-[2px_2px_0px_#000] ${
          isBetrayal
            ? 'bg-rose-500 text-white mood-betrayal-tilted-right animate-pulse'
            : isAnnoyed
            ? 'bg-amber-400 text-black'
            : 'bg-[#222438] text-slate-200'
        }`}
      >
        <Radio className="w-3.5 h-3.5 animate-spin" />
        <span>AREA: KORAMANGALA 🌧️</span>
        <span className="text-[10px] opacity-75 font-normal">| {mood}</span>
      </div>

      {/* 3. Action Tools & Reset Demo Button */}
      <div className="flex items-center gap-2">
        {/* Collapsible Action Tools */}
        <div
          data-physics-id="topbar-action-tools"
          className={`flex items-center gap-2 transition-transform ${
            isBetrayal ? 'mood-betrayal-tilted-left' : ''
          }`}
        >
          {/* Format Code Button */}
          <button
            onClick={() => handleToolbarClick('Format_Document')}
            className="neo-btn bg-[#C084FC] text-black px-2.5 py-1 font-mono text-[11px] flex items-center gap-1"
            title="Format Code (rapid clicks will trigger spam penalty!)"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Format</span>
          </button>

          {/* Git Branch Tool */}
          <button
            onClick={() => handleToolbarClick('Git_Branch_Sync')}
            className="neo-btn bg-[#38BDF8] text-black px-2.5 py-1 font-mono text-[11px] flex items-center gap-1"
            title="Git Sync (rapid clicks will trigger spam penalty!)"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">main</span>
          </button>
        </div>

        {/* 4. SACRED SAFE ZONE: Reset Demo Button (NEVER COLLAPSES - NO data-physics-id) */}
        <button
          onClick={handleReset}
          className="neo-btn bg-[#4ADE80] text-black px-3 py-1 font-black font-mono text-[11px] flex items-center gap-1.5 shadow-[3px_3px_0px_#000]"
          title="Instant <100ms Demo Reset for Next Judge (Shift + Escape)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset OS</span>
        </button>
      </div>
    </div>
  );
}
