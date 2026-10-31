import React, { useState } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { usePhysicsCollapse } from '../physics/PhysicsWorld';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MiniEditor } from './MiniEditor';
import { StatusPanel } from './StatusPanel';
import { SystemToast } from './SystemToast';
import { SubtitleBanner } from './SubtitleBanner';
import { AlertOctagon, Flame } from 'lucide-react';

export function Workspace() {
  const { state, actions } = useOS();
  const { mood, trust } = state;

  // Coordinate Matter.js rigid-body physics collapse & smooth restoration
  usePhysicsCollapse({
    mood,
    trust,
    onRecoveryComplete: () => {
      actions.completeRecovery();
    },
  });

  // Track the active code buffer and the code at the moment of dismissal
  const [currentCode, setCurrentCode] = useState('');
  const [dismissedCodeSnapshot, setDismissedCodeSnapshot] = useState(null);

  const handleDismissWarning = () => {
    actions.dismissWarning();
    // Snapshot the current code so if run again without edits, ignored warning is triggered
    setDismissedCodeSnapshot(currentCode);
  };

  const handleCodeChange = (newCode) => {
    setCurrentCode(newCode);
    // If the user modified the code, clear the snapshot
    if (dismissedCodeSnapshot && newCode.trim() !== dismissedCodeSnapshot.trim()) {
      setDismissedCodeSnapshot(null);
    }
  };

  const isAnnoyed = mood === OSMood.SLIGHTLY_ANNOYED;
  const isBetrayal = mood === OSMood.PERSONAL_BETRAYAL;
  const isMeltdown = mood === OSMood.MENTAL_BREAKDOWN || mood === OSMood.BENGALURU_BOSS_FIGHT;

  return (
    <div
      className={`flex-1 flex flex-col w-full h-[calc(100vh-42px)] bg-[#0B0F19] text-gray-100 overflow-hidden relative transition-colors duration-500 ${
        isBetrayal
          ? 'bg-[#10080B]'
          : isAnnoyed
          ? 'bg-[#0E0F16]'
          : 'bg-[#0B0F19]'
      }`}
    >
      {/* Aggressive Crimson Warning Banner for PERSONAL_BETRAYAL */}
      {isBetrayal && (
        <div
          data-physics-id="betrayal-alert-strip"
          className="w-full bg-rose-600/90 text-white px-4 py-1.5 flex items-center justify-between text-xs font-mono font-bold tracking-wider anim-crimson-glitch select-none z-30 shadow-md"
        >
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-200 animate-bounce" />
            <span>CRITICAL RELATIONSHIP ALERT: Trust degraded to {trust}%. OS patience critically low!</span>
          </div>
          <span className="text-[10px] uppercase bg-black/30 px-2 py-0.5 rounded">
            Betrayal Mode Active
          </span>
        </div>
      )}

      {/* 1. Top Navigation Bar */}
      <TopBar />

      {/* 2. Main Workspace Horizontal Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Tool Sidebar */}
        <Sidebar />

        {/* Central Safe Zone: Mini Code Editor */}
        <main className="flex-1 flex flex-col p-3 overflow-hidden bg-[#080C15] relative">
          <MiniEditor
            dismissedCodeSnapshot={dismissedCodeSnapshot}
            onCodeChange={handleCodeChange}
            onClearDismissedCode={() => setDismissedCodeSnapshot(null)}
          />
        </main>

        {/* Right Status & Telemetry Panel */}
        <StatusPanel />
      </div>

      {/* 3. System Toast for Compiler / Behaviour Warnings */}
      <SystemToast onDismissWarning={handleDismissWarning} />

      {/* 4. Subtitle Pill at Bottom Center */}
      <SubtitleBanner />
    </div>
  );
}
