import React, { useState } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { validateCode, DEFAULT_CODE_SNIPPET } from '../logic/mistakeDetector';
import { Play, CheckCircle2, AlertTriangle, Terminal, Code2, Sparkles } from 'lucide-react';

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
    text: '👾 Arcade Compiler ready. Click "▶ RUN CODE" to evaluate JavaScript buffer.',
    timestamp: null,
  });

  // Listen for full judge demo reset event
  React.useEffect(() => {
    const handleFullReset = () => {
      setCode(DEFAULT_CODE_SNIPPET);
      setConsoleOutput({
        status: 'idle',
        text: '👾 Arcade Compiler ready. Click "▶ RUN CODE" to evaluate JavaScript buffer.',
        timestamp: null,
      });
    };
    window.addEventListener('namma_os_reset', handleFullReset);
    return () => window.removeEventListener('namma_os_reset', handleFullReset);
  }, []);

  const lines = code.split('\n');

  const updateCode = (newCode) => {
    setCode(newCode);
    if (onCodeChange) onCodeChange(newCode);
  };

  const handleRunCode = () => {
    // 1. Check for Ignored Warning Trigger
    if (dismissedCodeSnapshot && dismissedCodeSnapshot.trim() === code.trim()) {
      actions.reportIgnoredWarningRun();
      setConsoleOutput({
        status: 'error',
        text: '🚨 IGNORED WARNING: You re-ran without fixing the compiler warning! Koramangala founder behavior detected (-25 HP).',
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
        text: `❌ COMPILE ERROR [${result.errorType}]:\n${result.message} (-${result.penalty} HP)`,
        timestamp: Date.now(),
      });
    } else {
      setConsoleOutput({
        status: 'success',
        text: `✨ BUILD SUCCESS! Zero syntax anomalies detected.\nOutput: Expected Silk Board Delay: 146.5 mins`,
        timestamp: Date.now(),
      });
      if (onClearDismissedCode) onClearDismissedCode();
    }
  };

  const handleKeyDown = (e) => {
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
    // Quick run with Ctrl + Enter
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
    }
  };

  const isAnnoyed = mood === OSMood.SLIGHTLY_ANNOYED;
  const isBetrayal = mood === OSMood.PERSONAL_BETRAYAL;

  return (
    <div
      // SACRED SAFE ZONE: NO data-physics-id here! This editor never falls.
      className={`flex-1 flex flex-col bg-[#13141F] border-2 border-black shadow-[4px_4px_0px_#000] overflow-hidden transition-all duration-300 relative ${
        isBetrayal
          ? 'border-rose-500 shadow-[4px_4px_0px_#F43F5E]'
          : isAnnoyed
          ? 'border-amber-400 shadow-[4px_4px_0px_#FACC15]'
          : 'border-black'
      }`}
    >
      {/* Editor Top Bar & Controls */}
      <div className="bg-[#1C1E2D] border-b-2 border-black px-4 py-2 flex items-center justify-between gap-3 text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="bg-[#FACC15] text-black font-black px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000] font-mono text-[11px] flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5" />
            <span>editor.js</span>
          </div>
          <span className="text-[10px] font-mono text-[#F43F5E] font-bold hidden sm:inline">
            [SAFE ZONE — NEVER COLLAPSES]
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Snippet Selectors */}
          <div className="hidden lg:flex items-center gap-1.5 font-mono text-[10px]">
            <span className="text-slate-400 font-bold">Presets:</span>
            <button
              onClick={() => updateCode(DEFAULT_CODE_SNIPPET)}
              className="neo-btn bg-amber-400 text-black px-2 py-0.5 text-[10px]"
              title="Code with missing bracket"
            >
              {'Missing "}"'}
            </button>
            <button
              onClick={() => updateCode(SAMPLE_VAR_CODE)}
              className="neo-btn bg-rose-400 text-black px-2 py-0.5 text-[10px]"
              title="Code using deprecated var"
            >
              Illegal "var"
            </button>
            <button
              onClick={() => updateCode(SAMPLE_CLEAN_CODE)}
              className="neo-btn bg-emerald-400 text-black px-2 py-0.5 text-[10px]"
              title="Clean valid code"
            >
              Valid Code
            </button>
          </div>

          {/* RUN / COMPILE BUTTON */}
          <button
            onClick={handleRunCode}
            className="neo-btn bg-[#10B981] hover:bg-[#34D399] text-black font-black px-3.5 py-1.5 text-xs flex items-center gap-1.5 shadow-[3px_3px_0px_#000]"
            title="Compile code (Ctrl+Enter)"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>▶ RUN CODE</span>
          </button>
        </div>
      </div>

      {/* Editor Body: Line Numbers + Text Area */}
      <div className="flex-1 flex overflow-hidden font-mono text-xs sm:text-sm bg-[#0E0F1A] relative min-h-[220px]">
        {/* Line Numbers */}
        <div className="w-10 sm:w-12 bg-[#161726] text-amber-400 font-bold py-3 pr-2.5 text-right select-none border-r-2 border-black shrink-0 font-mono text-xs">
          {lines.map((_, i) => (
            <div key={i} className="leading-6 opacity-80">
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
          className="flex-1 bg-transparent text-amber-100 p-3 leading-6 resize-none focus:outline-none focus:ring-0 font-mono text-xs sm:text-sm overflow-y-auto selection:bg-[#FACC15] selection:text-black"
          placeholder="Write JavaScript code here..."
        />
      </div>

      {/* Terminal / Output Console at the Bottom */}
      <div className="bg-[#181926] border-t-2 border-black p-3 flex flex-col gap-2 text-xs font-mono">
        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <div className="bg-black text-[#FACC15] font-black px-1.5 py-0.2 border border-black text-[10px]">
              TERMINAL
            </div>
            <span className="font-bold text-slate-300 text-[11px] uppercase">
              Execution Output
            </span>
          </div>

          {consoleOutput.timestamp && (
            <span className="text-[10px] text-slate-400 font-mono">
              {new Date(consoleOutput.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div
          className={`p-2.5 border-2 font-mono text-xs whitespace-pre-wrap font-bold ${
            consoleOutput.status === 'error'
              ? 'bg-[#2E1015] border-rose-500 text-rose-300 shadow-[2px_2px_0px_#F43F5E]'
              : consoleOutput.status === 'success'
              ? 'bg-[#102B1D] border-emerald-400 text-emerald-300 shadow-[2px_2px_0px_#10B981]'
              : 'bg-[#12131F] border-black text-slate-300 shadow-[2px_2px_0px_#000]'
          }`}
        >
          {consoleOutput.text}
        </div>
      </div>
    </div>
  );
}
