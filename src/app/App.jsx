import React, { useEffect } from 'react';
import { OSProvider, useOS } from './osStateMachine';
import { DebugDemoBar } from '../components/DebugDemoBar';
import { TelemetryHUD } from '../components/TelemetryHUD';
import { SubtitleBanner } from '../components/SubtitleBanner';
import { Terminal, Shield, Sparkles } from 'lucide-react';

function OSWorkspaceContainer() {
  const { state, actions } = useOS();

  // Listen for Emergency Chaos hotkeys: ~ or Ctrl+Shift+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Hotkey ~ (Tilde) or Ctrl+Shift+K
      if (e.key === '`' || e.key === '~' || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        actions.triggerBossFight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col relative overflow-hidden select-none">
      {/* 1. Top-Level Debug & Demo Bar */}
      <DebugDemoBar />

      {/* Main Workspace Body */}
      <main className="flex-1 p-4 pb-28 overflow-y-auto flex flex-col items-center">
        {/* Workspace Title & Architecture Status */}
        <div className="w-full max-w-5xl mx-auto my-3 flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                <span>Namma Fragile OS — Architecture Foundation</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
                  v0.1.0 Ready
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                PRD v2 Relationship Memory Model + Deterministic State Machine Active
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Deterministic Client-Side Engine</span>
          </div>
        </div>

        {/* 2. Live Telemetry HUD & Memory Buffer */}
        <TelemetryHUD />

        {/* Quick Testing Instructions */}
        <div className="w-full max-w-5xl mx-auto mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono text-slate-400 space-y-2">
          <div className="font-bold text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Foundational Verification Matrix:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
            <li>
              <strong className="text-slate-200">First Mistake:</strong> Click <span className="text-amber-300">Force Mistake</span> once $\rightarrow$ OS drops trust to 85% (<code className="text-amber-400">SLIGHTLY_ANNOYED</code>), triggers an "Ayyo" sigh toast.
            </li>
            <li>
              <strong className="text-slate-200">Repeated Mistake Callback:</strong> Click <span className="text-amber-300">Force Mistake</span> again with the same error $\rightarrow$ OS dialogue explicitly roasts you for repeating the same error twice in a row!
            </li>
            <li>
              <strong className="text-slate-200">Ignored Warning Callback:</strong> Click <span className="text-amber-300">Dismiss Warning</span> on the active warning toast, then click <span className="text-amber-300">Force Mistake</span> $\rightarrow$ Assistant calls out "Koramangala founder behavior"!
            </li>
            <li>
              <strong className="text-slate-200">Spam Abuse:</strong> Click <span className="text-blue-300">Simulate Spam</span> $\rightarrow$ Assistant fires the "Meter haakamma! Silk Board traffic..." roast.
            </li>
            <li>
              <strong className="text-slate-200">Forbidden Prod DB:</strong> Click <span className="text-rose-300">Touch Prod DB</span> $\rightarrow$ Drops trust by 40% and roasts you for sudo privileges.
            </li>
            <li>
              <strong className="text-slate-200">Judge Speedrun Hotkeys:</strong> Press <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">~</kbd> or <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">Ctrl+Shift+K</kbd> to jump straight into Bengaluru Boss Fight (<code className="text-purple-400">Trust: 0</code>).
            </li>
          </ul>
        </div>
      </main>

      {/* 3. Persistent Subtitle Banner with Dialogue Engine */}
      <SubtitleBanner />
    </div>
  );
}

export default function App() {
  return (
    <OSProvider>
      <OSWorkspaceContainer />
    </OSProvider>
  );
}

