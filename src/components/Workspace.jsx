import React, { useState, useEffect } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { usePhysicsCollapse } from '../physics/PhysicsWorld';
import { audioManager } from '../audio/AudioManager';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MiniEditor } from './MiniEditor';
import { StatusPanel } from './StatusPanel';
import { SystemToast } from './SystemToast';
import { RoastAssistant } from './RoastAssistant';
import { RecoveryModal } from './RecoveryModal';
import { AlertOctagon, Flame } from 'lucide-react';

export function Workspace({ onJudgeReset }) {
  const { state, actions } = useOS();
  const { mood, trust } = state;

  // Coordinate procedural background music with OS mood stages (Calm, Suspicious, Boss)
  useEffect(() => {
    audioManager.setBgmStage(mood);
  }, [mood]);

  // Unlock BGM after first user interaction (comply with browser Autoplay Policy)
  useEffect(() => {
    const handleFirstGesture = () => {
      audioManager.unlockAudio();
      audioManager.setBgmStage(mood);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);
    window.addEventListener('touchstart', handleFirstGesture);

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [mood]);

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
    setDismissedCodeSnapshot(currentCode);
  };

  const handleCodeChange = (newCode) => {
    setCurrentCode(newCode);
    if (dismissedCodeSnapshot && newCode.trim() !== dismissedCodeSnapshot.trim()) {
      setDismissedCodeSnapshot(null);
    }
  };

  const isAnnoyed = mood === OSMood.SLIGHTLY_ANNOYED;
  const isBetrayal = mood === OSMood.PERSONAL_BETRAYAL;
  const isMeltdown = mood === OSMood.MENTAL_BREAKDOWN || mood === OSMood.BENGALURU_BOSS_FIGHT;

  return (
    <div
      className={`flex-1 flex flex-col w-full h-[calc(100vh-42px)] bg-[#0e0f17] text-gray-100 overflow-hidden relative transition-colors duration-500 ${
        isBetrayal
          ? 'bg-[#1E0D12]'
          : isAnnoyed
          ? 'bg-[#14121F]'
          : 'bg-[#0e0f17]'
      }`}
    >
      {/* Aggressive Crimson Warning Banner for PERSONAL_BETRAYAL */}
      {isBetrayal && (
        <div
          data-physics-id="betrayal-alert-strip"
          className="w-full bg-[#FF4365] text-white border-b-2 border-black px-4 py-1.5 flex items-center justify-between text-xs font-mono font-black tracking-wider anim-crimson-glitch select-none z-30 shadow-[0_2px_0_#000]"
        >
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-yellow-300 animate-bounce" />
            <span>⚠️ CRITICAL RELATIONSHIP RAGE: Trust degraded to {trust}%! Auto Anna is losing patience!</span>
          </div>
          <span className="text-[10px] uppercase bg-black text-[#FACC15] px-2 py-0.5 border border-black font-black">
            BETRAYAL LEVEL 3
          </span>
        </div>
      )}

      {/* 1. Top Navigation Bar */}
      <TopBar onJudgeReset={onJudgeReset} />

      {/* 2. Main Workspace Horizontal Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Tool Sidebar */}
        <Sidebar />

        {/* Central Safe Zone: Mini Code Editor */}
        <main className="flex-1 flex flex-col p-3 overflow-hidden bg-[#0A0B12] relative">
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

      {/* 4. Theatrical Roast Assistant: Typewriter Subtitle Banner + Mascot Avatar + Audio Engine */}
      <RoastAssistant />

      {/* 5. Recovery Modal Overlay (Above Physics Debris at z-50) */}
      <RecoveryModal />
    </div>
  );
}
