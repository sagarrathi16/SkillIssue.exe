import React, { useEffect } from 'react';
import { OSProvider, useOS } from './osStateMachine';
import { physicsManager } from '../physics/PhysicsWorld';
import { audioManager } from '../audio/AudioManager';
import { DebugDemoBar } from '../components/DebugDemoBar';
import { Workspace } from '../components/Workspace';

function OSContainer() {
  const { actions } = useOS();

  const handleFullJudgeReset = () => {
    physicsManager.hardReset();
    audioManager.setBgmStage('CALM');
    actions.resetDemo();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('namma_os_reset'));
    }
  };

  // Global hotkey listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shift + Escape: Instant Full Reset for Next Judge (<100ms)
      if (e.shiftKey && (e.key === 'Escape' || e.code === 'Escape')) {
        e.preventDefault();
        handleFullJudgeReset();
      }
      // ~ (Tilde) or Ctrl+Shift+K: Emergency Chaos Hotkey
      else if (e.key === '`' || e.key === '~' || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        actions.triggerBossFight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#0e0f17] text-gray-100 overflow-hidden select-none font-sans">
      {/* 1. Top Debug & Demo Bar */}
      <DebugDemoBar onJudgeReset={handleFullJudgeReset} />

      {/* 2. Full Desktop Workspace Shell */}
      <Workspace onJudgeReset={handleFullJudgeReset} />
    </div>
  );
}

export default function App() {
  return (
    <OSProvider>
      <OSContainer />
    </OSProvider>
  );
}
