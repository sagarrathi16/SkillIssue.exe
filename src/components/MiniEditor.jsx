import React, { useState } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { validateCode, DEFAULT_CODE_SNIPPET } from '../logic/mistakeDetector';
import { Play, CheckCircle2, AlertTriangle, Terminal, Code2, RefreshCw } from 'lucide-react';

const SAMPLE_CLEAN_CODE = `// Namma Fragile OS — Bengaluru Traffic Routing (Fixed)
function calculateSilkBoardDelay(distanceKm) {
  const signalWait = 25; // minutes
  const rainMultiplier = 2.5;

  if (distanceKm > 3) {
    const totalDelay = (distanceKm * 12) + signalWait * rainMultiplier;
    return totalDelay;
  }
  return distanceKm * 8;
}

console.log("Expected Silk Board Delay:", calculateSilkBoardDelay(7), "mins");`;

const SAMPLE_VAR_CODE = `// Namma Fragile OS — Deprecated Syntax Test
var driverName = "Manjunath";
var fareAmount = 450;

function bookRide() {
  var trafficStatus = "jammed";
  return driverName + " says fare is " + fareAmount;
}`;

export function MiniEditor({ dismissedCodeSnapshot, onCodeChange, onClearDismissedCode }) {
  const { state, actions } = useOS();
  const { mood } = state;

  const [code, setCode] = useState(DEFAULT_CODE_SNIPPET);
  const [consoleOutput, setConsoleOutput] = useState({
    status: 'idle',
    text: 'Terminal ready. Click "Run / Compile" to evaluate JavaScript buffer.',
    timestamp: null,
  });

  const lines = code.split('\n');

  const updateCode = (newCode) => {
    setCode(newCode);
    if (onCodeChange) onCodeChange(newCode);
  };

  const handleRunCode = () => {
    // 1. Check for Ignored Warning Trigger
    // If the user previously dismissed a warning and re-ran without modifying the code buffer
    if (dismissedCodeSnapshot && dismissedCodeSnapshot.trim() === code.trim()) {
      actions.reportIgnoredWarningRun();
      setConsoleOutput({
        status: 'error',
        text: 'IgnoredWarningException: Code re-executed without addressing prior compiler warning! Koramangala founder behavior detected.',
        timestamp: Date.now(),
      });
      if (onClearDismissedCode) onClearDismissedCode();
      return;
    }

    // 2. Validate Code Syntax & Rules
    const result = validateCode(code);

    if (!result.valid) {
      actions.reportMistake(result.errorType, result.message, result.penalty);
      setConsoleOutput({
        status: 'error',
        text: `${result.errorType}: ${result.message}`,
        timestamp: Date.now(),
      });
    } else {
      setConsoleOutput({
        status: 'success',
        text: `✓ Build succeeded [2026-10-31] — Zero syntax anomalies detected.\nOutput: Expected Silk Board Delay: 146.5 mins`,
        timestamp: Date.now(),
      });
      if (onClearDismissedCode) onClearDismissedCode();
    }
  };

  const handleKeyDown = (e) => {
    // Allow Tab key indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const isAnnoyed = mood === OSMood.SLIGHTLY_ANNOYED;
  const isBetrayal = mood === OSMood.PERSONAL_BETRAYAL;

  return (
    <div
      // SACRED SAFE ZONE: NO data-physics-id here! This editor never falls.
      className={`flex-1 flex flex-col bg-[#070A12] border rounded-xl overflow-hidden shadow-2xl transition-all duration-300 relative ${
        isBetrayal
          ? 'border-rose-500/40 shadow-rose-950/20'
          : isAnnoyed
          ? 'border-amber-500/30'
          : 'border-slate-800'
      }`}
    >
      {/* Editor Top Bar & Controls */}
      <div className="bg-[#0B0F19] border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-mono">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-semibold">bengaluru_routing.js</span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">(JavaScript ES2024)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Snippet Selectors */}
          <div className="hidden lg:flex items-center gap-1 font-mono text-[10px] text-slate-400">
            <span>Presets:</span>
            <button
              onClick={() => updateCode(DEFAULT_CODE_SNIPPET)}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300 transition cursor-pointer"
            >
              {'Missing "}"'}
            </button>
            <button
              onClick={() => updateCode(SAMPLE_VAR_CODE)}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-300 transition cursor-pointer"
            >
              Illegal "var"
            </button>
            <button
              onClick={() => updateCode(SAMPLE_CLEAN_CODE)}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-300 transition cursor-pointer"
            >
              Valid Code
            </button>
          </div>

          {/* RUN / COMPILE BUTTON */}
          <button
            onClick={handleRunCode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition-all active:scale-95 shadow-md shadow-emerald-950/50 cursor-pointer"
            title="Compile and run current code buffer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run / Compile</span>
          </button>
        </div>
      </div>

      {/* Editor Body: Line Numbers + Text Area */}
      <div className="flex-1 flex overflow-hidden font-mono text-xs sm:text-sm bg-[#070A12] relative min-h-[220px]">
        {/* Line Numbers */}
        <div className="w-10 sm:w-12 bg-[#090D16] text-slate-600 py-3 pr-2 text-right select-none border-r border-slate-800/80 shrink-0 font-mono text-xs">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={code}
          onChange={(e) => updateCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          className="flex-1 bg-transparent text-slate-200 p-3 leading-6 resize-none focus:outline-none focus:ring-0 font-mono text-xs sm:text-sm overflow-y-auto"
          placeholder="Write JavaScript code here..."
        />
      </div>

      {/* Terminal / Output Console at the Bottom */}
      <div className="bg-[#090D16] border-t border-slate-800/80 p-3 flex flex-col gap-1.5 text-xs font-mono">
        <div className="flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-300 text-[11px] tracking-wider uppercase">
              Terminal Output
            </span>
          </div>

          {consoleOutput.timestamp && (
            <span className="text-[10px] text-slate-500">
              {new Date(consoleOutput.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div
          className={`p-2 rounded bg-black/40 border text-xs whitespace-pre-wrap ${
            consoleOutput.status === 'error'
              ? 'border-rose-500/40 text-rose-300'
              : consoleOutput.status === 'success'
              ? 'border-emerald-500/40 text-emerald-300'
              : 'border-slate-800 text-slate-400'
          }`}
        >
          {consoleOutput.text}
        </div>
      </div>
    </div>
  );
}
