import React, { useEffect } from 'react';
import { OSProvider, useOS } from './osStateMachine';
import { DebugDemoBar } from '../components/DebugDemoBar';
import { Workspace } from '../components/Workspace';

function OSContainer() {
  const { actions } = useOS();

  // Listen for Emergency Chaos hotkeys: ~ or Ctrl+Shift+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Hotkey ~ (Tilde) or Ctrl+Shift+K for instant judge chaos
      if (e.key === '`' || e.key === '~' || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        actions.triggerBossFight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#0B0F19] text-gray-100 overflow-hidden select-none">
      {/* 1. Top Debug & Demo Bar */}
      <DebugDemoBar />

      {/* 2. Full Desktop Workspace Shell */}
      <Workspace />
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
