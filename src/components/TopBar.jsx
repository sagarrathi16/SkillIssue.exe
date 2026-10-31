import React, { useRef } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { createClickTracker } from '../logic/mistakeDetector';
import { 
  GitBranch, 
  RotateCcw, 
  Code2, 
  Share2, 
  Terminal, 
  Sparkles,
  Layers,
  Wand2
} from 'lucide-react';

export function TopBar() {
  const { state, actions } = useOS();
  const { mood, trust } = state;

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
      className={`w-full bg-[#070A12] border-b px-4 py-2 flex items-center justify-between text-xs select-none transition-all duration-300 ${
        isBetrayal
          ? 'border-rose-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
          : isAnnoyed
          ? 'border-amber-500/40'
          : 'border-slate-800'
      }`}
    >
      {/* 1. Window Controls & Branding (Collapsible Section) */}
      <div 
        data-physics-id="topbar-window-controls"
        className={`flex items-center gap-3 transition-transform ${
          isBetrayal ? 'mood-betrayal-tilted-left' : isAnnoyed ? 'anim-slightly-annoyed' : ''
        }`}
      >
        {/* Fake Traffic Lights */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/50 hover:opacity-80 transition cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/50 hover:opacity-80 transition cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/50 hover:opacity-80 transition cursor-pointer" />
        </div>

        {/* Project Breadcrumb */}
        <div className="hidden sm:flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500">namma-workspace</span>
          <span>/</span>
          <span className="text-slate-300 font-medium">bengaluru_routing.js</span>
          {trust < 80 && (
            <span className={`text-[10px] px-1 rounded ${isBetrayal ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
              ● modified
            </span>
          )}
        </div>
      </div>

      {/* 2. Center Status Pill (Collapsible Section) */}
      <div
        data-physics-id="topbar-breadcrumbs"
        className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full border bg-slate-900/60 font-mono text-[11px] transition-transform ${
          isBetrayal
            ? 'border-rose-500/40 text-rose-300 mood-betrayal-tilted-right'
            : isAnnoyed
            ? 'border-amber-500/40 text-amber-300'
            : 'border-slate-800 text-slate-400'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
        <span>OS Mood: {mood}</span>
      </div>

      {/* 3. Action Tools & Reset Demo Button */}
      <div className="flex items-center gap-2">
        {/* Collapsible Action Tools */}
        <div
          data-physics-id="topbar-action-tools"
          className={`flex items-center gap-1.5 transition-transform ${
            isBetrayal ? 'mood-betrayal-tilted-left' : ''
          }`}
        >
          {/* Format Code Button */}
          <button
            onClick={() => handleToolbarClick('Format_Document')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-all active:scale-95 cursor-pointer font-mono text-[11px] ${
              isBetrayal
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Format Code (rapid clicks will offend the OS!)"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Format</span>
          </button>

          {/* Git Branch Tool */}
          <button
            onClick={() => handleToolbarClick('Git_Branch_Sync')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-all active:scale-95 cursor-pointer font-mono text-[11px] ${
              isBetrayal
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Git Sync (rapid clicks will offend the OS!)"
          >
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">main</span>
          </button>
        </div>

        {/* 4. SACRED SAFE ZONE: Reset Demo Button (NEVER COLLAPSES - NO data-physics-id) */}
        <button
          onClick={actions.resetDemo}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold transition-all active:scale-95 cursor-pointer font-mono text-[11px] shadow-sm ml-1"
          title="Instant 1-Click Demo Reset (Sacred Safe Zone)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
}
