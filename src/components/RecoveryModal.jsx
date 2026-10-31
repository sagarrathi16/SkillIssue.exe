import React, { useState, useEffect } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { audioManager } from '../audio/AudioManager';
import { BugSmasherGame } from './games/BugSmasherGame';
import { DareRoulette } from './games/DareRoulette';
import { 
  Crosshair,
  Dices,
  Skull
} from 'lucide-react';

export function RecoveryModal() {
  const { state } = useOS();
  const { mood, trust, isCollapsed } = state;

  const [activeTab, setActiveTab] = useState('arcade_game'); // 'arcade_game' | 'dare_roulette'
  const [hasSettled, setHasSettled] = useState(false);

  // Modal is eligible when in MENTAL_BREAKDOWN or BENGALURU_BOSS_FIGHT
  const isEligible = isCollapsed || mood === OSMood.MENTAL_BREAKDOWN || mood === OSMood.BENGALURU_BOSS_FIGHT;

  useEffect(() => {
    let timer;
    if (isEligible) {
      // Delay showing the challenge popup by 2.2s so the user can watch the UI collapse into the physics pile!
      timer = setTimeout(() => {
        setHasSettled(true);
        audioManager.playSfx('warning');
      }, 2200);
    } else {
      setHasSettled(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isEligible]);

  if (!isEligible) return null;

  // While the UI is collapsing and tumbling, display a non-blocking floating indicator
  if (!hasSettled) {
    return (
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none">
        <div className="bg-[#FF4365] text-black font-black px-4 py-2 border-3 border-black shadow-[4px_4px_0px_#000] text-xs font-mono uppercase tracking-wider flex items-center gap-2 animate-bounce">
          <Skull className="w-4 h-4 animate-spin" />
          <span>💥 CATASTROPHIC COLLAPSE! WATCHING THE CRASH...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl bg-[#181926] border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col font-mono text-xs">
        {/* Arcade Modal Header */}
        <div className="bg-[#FF4365] border-b-2 border-black p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-black text-[#FF4365] border-2 border-black shadow-[2px_2px_0px_#000]">
              <Skull className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wider flex items-center gap-2">
                <span>SYSTEM COLLAPSE RECOVERY</span>
                <span className="text-[10px] px-2 py-0.5 bg-black text-[#FACC15] font-black border border-black">
                  HP: {trust}%
                </span>
              </h2>
              <p className="text-[11px] font-bold text-black/80">
                UI chrome collapsed into physics pile! Win back trust to reassemble.
              </p>
            </div>
          </div>
        </div>

        {/* Neo Tab Switcher */}
        <div className="flex border-b-2 border-black bg-[#12131F] p-1 gap-1">
          <button
            onClick={() => setActiveTab('arcade_game')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 font-black border-2 border-black transition cursor-pointer ${
              activeTab === 'arcade_game'
                ? 'bg-[#10B981] text-black shadow-[2px_2px_0px_#000]'
                : 'bg-[#1E2032] text-slate-300 hover:text-white'
            }`}
          >
            <Crosshair className="w-4 h-4" />
            <span>Option 1: Bug Smasher Arcade (Game)</span>
          </button>

          <button
            onClick={() => setActiveTab('dare_roulette')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 font-black border-2 border-black transition cursor-pointer ${
              activeTab === 'dare_roulette'
                ? 'bg-[#FACC15] text-black shadow-[2px_2px_0px_#000]'
                : 'bg-[#1E2032] text-slate-300 hover:text-white'
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>Option 2: Tech Lead Dare (Dare)</span>
          </button>
        </div>

        {/* Tab 1: Bug Smasher Arcade Game */}
        {activeTab === 'arcade_game' ? (
          <div className="p-4 sm:p-5">
            <BugSmasherGame />
          </div>
        ) : (
          /* Tab 2: Tech Lead Dare Roulette */
          <div className="p-4 sm:p-5">
            <DareRoulette />
          </div>
        )}
      </div>
    </div>
  );
}
