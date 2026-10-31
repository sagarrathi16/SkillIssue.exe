import React, { useState } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { validateCode, DEFAULT_CODE_SNIPPET } from '../logic/mistakeDetector';
import { Play, CheckCircle2, AlertTriangle, Terminal, Code2, Sparkles } from 'lucide-react';

const SAMPLE_CLEAN_CODE = `// SkillIssue.exe — CodeDay Hackathon Build (Clean)
function calculateHackathonEnergy(caffeineMg, sleepHours) {
  const codeDayMultiplier = 2.5;

  if (sleepHours < 3) {
    const energyLevel = (caffeineMg * 1.5) + (codeDayMultiplier * 10);
    return energyLevel;
  }
  return caffeineMg * 0.8;
}

console.log("Calculated Hackathon Energy:", calculateHackathonEnergy(250, 2), "XP");`;

const SAMPLE_VAR_CODE = `// SkillIssue.exe — Deprecated Syntax Test
var hackerName = "CaffeineCoder";
var bugCount = 42;

function shipHack() {
  var panicStatus = "critical";
  return hackerName + " has " + bugCount + " bugs to fix before deadline";
}`;

export function MiniEditor({ dismissedCodeSnapshot, onCodeChange, onClearDismissedCode }) {
  const { state, actions } = useOS();
  const { mood } = state;

  const [code, setCode] = useState(DEFAULT_CODE_SNIPPET);
  const [isJolting, setIsJolting] = useState(false);
  const [errorLine, setErrorLine] = useState(null);
  const [lastError, setLastError] = useState(null);

  const [consoleOutput, setConsoleOutput] = useState({
    status: 'idle',
    text: '👾 Arcade Compiler ready. Click "▶ RUN CODE" to evaluate JavaScript buffer.',
    timestamp: null,
  });

  const triggerJolt = () => {
    setIsJolting(true);
    setTimeout(() => setIsJolting(false), 450);
  };

  // Trigger code jolt whenever trust drops or an abuse/mistake event occurs
  const prevTrustRef = React.useRef(state.trust);
  React.useEffect(() => {
    if (state.trust < prevTrustRef.current) {
      triggerJolt();
    }
    prevTrustRef.current = state.trust;
  }, [state.trust, state.mistakeCount, state.rapidClickEvents]);

  // Listen for full judge demo reset event
  React.useEffect(() => {
    const handleFullReset = () => {
      setCode(DEFAULT_CODE_SNIPPET);
      setErrorLine(null);
      setLastError(null);
      setIsJolting(false);
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
    if (errorLine !== null && newCode !== code) {
      setErrorLine(null);
      setLastError(null);
    }
    if (onCodeChange) onCodeChange(newCode);
  };

  const handleRunCode = () => {
    // 1. Check for Ignored Warning Trigger
    if (dismissedCodeSnapshot && dismissedCodeSnapshot.trim() === code.trim()) {
      actions.reportIgnoredWarningRun();
      setErrorLine(0);
      setLastError({
        errorType: 'IGNORED_WARNING',
        message: 'Re-ran broken code without modifications',
        lineNumber: 1,
        penalty: 25,
      });
      triggerJolt();
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
      setErrorLine(result.lineIndex ?? null);
      setLastError(result);
      triggerJolt();
      setConsoleOutput({
        status: 'error',
        text: `❌ COMPILE ERROR [${result.errorType}]:\n${result.message} (-${result.penalty} HP)`,
        timestamp: Date.now(),
      });
    } else {
      setErrorLine(null);
      setLastError(null);
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
  const isBreakdown = mood === OSMood.MENTAL_BREAKDOWN || mood === OSMood.BENGALURU_BOSS_FIGHT;

  const tiltClass = isBreakdown
    ? 'code-tilted-breakdown border-[#FF4365] border-dashed shadow-[6px_6px_0px_#FF4365]'
    : isBetrayal
    ? 'code-tilted-betrayal border-rose-500 border-dashed shadow-[5px_5px_0px_#F43F5E]'
    : isAnnoyed
    ? 'code-tilted-annoyed border-amber-400 shadow-[4px_4px_0px_#FACC15]'
    : 'border-black shadow-[4px_4px_0px_#000]';

  const joltClass = isJolting ? 'anim-code-jolt' : '';

  const codeGlitchClass = isBreakdown
    ? 'code-glitch-heavy text-rose-100'
    : isBetrayal
    ? 'code-glitch-subtle text-amber-100'
    : isAnnoyed
    ? 'code-glitch-subtle text-amber-100'
    : 'text-amber-100';

  return (
    <div
      // SACRED SAFE ZONE: NO data-physics-id here! This editor never falls.
      className={`flex-1 flex flex-col bg-[#13141F] border-2 overflow-hidden transition-all duration-300 relative ${tiltClass} ${joltClass}`}
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

      {/* Code Integrity / Fracture Banner (Shows when something breaks in UI) */}
      {lastError && (
        <div className="bg-[#2A0E14] border-b-2 border-rose-600 px-3 py-1 flex items-center justify-between font-mono text-[11px] text-rose-300 select-none shrink-0 anim-code-jolt">
          <div className="flex items-center gap-2">
            <span className="text-sm">💥</span>
            <span className="font-black text-rose-400 uppercase tracking-wide">
              SYNTAX FRACTURE:
            </span>
            <span className="bg-black text-[#FACC15] font-bold px-1.5 py-0.2 border border-black text-[10px]">
              {lastError.errorType || 'ERROR'}
            </span>
            {lastError.lineNumber && (
              <span className="text-rose-300 font-bold hidden sm:inline">
                at line {lastError.lineNumber}
              </span>
            )}
          </div>
          <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-600 px-1.5 py-0.5 font-bold">
            UI INTEGRITY: -{lastError.penalty || 15} HP
          </span>
        </div>
      )}

      {/* Editor Body: Line Numbers + Text Area */}
      <div className="flex-1 flex overflow-hidden font-mono text-xs sm:text-sm bg-[#0E0F1A] relative min-h-[220px]">
        {/* Line Numbers */}
        <div className="w-10 sm:w-12 bg-[#161726] text-amber-400 font-bold py-3 pr-2.5 text-right select-none border-r-2 border-black shrink-0 font-mono text-xs z-10">
          {lines.map((_, i) => {
            const isErrorLine = errorLine === i;
            return (
              <div 
                key={i} 
                className={`leading-6 transition-all ${
                  isErrorLine 
                    ? 'bg-[#FF4365] text-black font-black px-1 border-y border-black animate-pulse shadow-[2px_0px_0px_#000]' 
                    : 'opacity-80'
                }`}
                title={isErrorLine ? 'Syntax Fracture Line' : undefined}
              >
                {isErrorLine ? '💀' : i + 1}
              </div>
            );
          })}
        </div>

        {/* Broken Line Indicator Strip in background */}
        {errorLine !== null && (
          <div
            className="absolute left-10 sm:left-12 right-0 pointer-events-none anim-error-line bg-rose-500/20 border-y border-rose-500/50 flex items-center justify-between px-3 z-0"
            style={{
              top: `${errorLine * 24 + 12}px`,
              height: '24px',
            }}
          >
            <span className="text-[10px] text-rose-400 font-mono font-bold tracking-wider">
              ⚠️ SYNTAX FRACTURE HERE
            </span>
            <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.2 border border-black font-black font-mono">
              BROKEN
            </span>
          </div>
        )}

        {/* Subtle digital glitch scanline tears across the code */}
        {(isAnnoyed || isBetrayal || isBreakdown || errorLine !== null) && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 select-none z-0">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#FF4365] to-transparent anim-scanline-glitch" />
            {(isBetrayal || isBreakdown) && (
              <div 
                className="w-full h-0.5 bg-cyan-400/50 anim-scanline-glitch" 
                style={{ animationDelay: '1.2s' }} 
              />
            )}
          </div>
        )}

        {/* Text Area */}
        <textarea
          value={code}
          onChange={(e) => updateCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          className={`flex-1 bg-transparent p-3 leading-6 resize-none focus:outline-none focus:ring-0 font-mono text-xs sm:text-sm overflow-y-auto selection:bg-[#FACC15] selection:text-black relative z-10 transition-colors ${codeGlitchClass}`}
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
