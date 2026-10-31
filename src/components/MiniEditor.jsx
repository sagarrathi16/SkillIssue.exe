import React, { useState } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { validateCode, CODING_CHALLENGES, BUG_PRESETS, DEFAULT_CODE_SNIPPET } from '../logic/mistakeDetector';
import { audioManager } from '../audio/AudioManager';
import { 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Code2, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy
} from 'lucide-react';

export function MiniEditor({ dismissedCodeSnapshot, onCodeChange, onClearDismissedCode }) {
  const { state, actions } = useOS();
  const { mood } = state;

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [solvedChallenges, setSolvedChallenges] = useState(new Set());
  const [congratsBanner, setCongratsBanner] = useState(null);

  const [code, setCode] = useState(CODING_CHALLENGES[0].starterCode);
  const [isJolting, setIsJolting] = useState(false);
  const [errorLine, setErrorLine] = useState(null);
  const [lastError, setLastError] = useState(null);

  const [consoleOutput, setConsoleOutput] = useState({
    status: 'idle',
    text: '👾 Arcade Compiler ready. Read the prompt in the code comment, fix the syntax, and click "▶ RUN CODE"!',
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
      setChallengeIndex(0);
      setSolvedChallenges(new Set());
      setCongratsBanner(null);
      setCode(CODING_CHALLENGES[0].starterCode);
      setErrorLine(null);
      setLastError(null);
      setIsJolting(false);
      setConsoleOutput({
        status: 'idle',
        text: '👾 Arcade Compiler ready. Read the prompt in the code comment, fix the syntax, and click "▶ RUN CODE"!',
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

  const handlePrevChallenge = () => {
    if (challengeIndex > 0) {
      const prevIdx = challengeIndex - 1;
      setChallengeIndex(prevIdx);
      setCode(CODING_CHALLENGES[prevIdx].starterCode);
      setErrorLine(null);
      setLastError(null);
      setCongratsBanner(null);
      setConsoleOutput({
        status: 'idle',
        text: `Switched to Challenge ${prevIdx + 1}/${CODING_CHALLENGES.length}: "${CODING_CHALLENGES[prevIdx].title}"`,
        timestamp: Date.now(),
      });
    }
  };

  const handleNextChallenge = () => {
    if (challengeIndex < CODING_CHALLENGES.length - 1) {
      const nextIdx = challengeIndex + 1;
      setChallengeIndex(nextIdx);
      setCode(CODING_CHALLENGES[nextIdx].starterCode);
      setErrorLine(null);
      setLastError(null);
      setCongratsBanner(null);
      setConsoleOutput({
        status: 'idle',
        text: `Switched to Challenge ${nextIdx + 1}/${CODING_CHALLENGES.length}: "${CODING_CHALLENGES[nextIdx].title}"`,
        timestamp: Date.now(),
      });
    }
  };

  const handleResetChallenge = () => {
    setCode(CODING_CHALLENGES[challengeIndex].starterCode);
    setErrorLine(null);
    setLastError(null);
    setCongratsBanner(null);
    audioManager.playSfx('beep');
    setConsoleOutput({
      status: 'idle',
      text: `Reset code for Challenge ${challengeIndex + 1}: "${CODING_CHALLENGES[challengeIndex].title}"`,
      timestamp: Date.now(),
    });
  };

  const handleLoadCorrectAnswer = () => {
    const active = CODING_CHALLENGES[challengeIndex];
    if (active && active.solvedCode) {
      updateCode(active.solvedCode);
      setErrorLine(null);
      setLastError(null);
      setCongratsBanner(null);
      audioManager.playSfx('chime');
      setConsoleOutput({
        status: 'idle',
        text: `✨ Loaded verified solution for Question ${challengeIndex + 1}: "${active.title}"!\nClick "▶ RUN CODE" to verify and pass.`,
        timestamp: Date.now(),
      });
    }
  };

  const handleLoadBug = (bugSnippet, bugTitle) => {
    updateCode(bugSnippet);
    setErrorLine(null);
    setLastError(null);
    setCongratsBanner(null);
    audioManager.playSfx('beep');
    setConsoleOutput({
      status: 'idle',
      text: `🐛 Loaded Bug Preset: [${bugTitle}].\nClick "▶ RUN CODE" to trigger compiler breakdown!`,
      timestamp: Date.now(),
    });
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
      setCongratsBanner(null);
      setConsoleOutput({
        status: 'error',
        text: `❌ COMPILE ERROR [${result.errorType}]:\n${result.message} (-${result.penalty} HP)`,
        timestamp: Date.now(),
      });
    } else {
      // CODE PASSED!
      setErrorLine(null);
      setLastError(null);

      const activeChallenge = CODING_CHALLENGES[challengeIndex];
      const isLast = challengeIndex === CODING_CHALLENGES.length - 1;

      // Sfx & award trust
      audioManager.playVictoryChime();
      actions.solveChallenge(challengeIndex, activeChallenge.title, 15);

      setSolvedChallenges((prev) => new Set([...prev, activeChallenge.id]));

      setConsoleOutput({
        status: 'success',
        text: `🎉 ${activeChallenge.congratulation}\n${activeChallenge.successOutput}`,
        timestamp: Date.now(),
      });

      setCongratsBanner({
        show: true,
        text: activeChallenge.congratulation,
        isFinal: isLast,
      });

      if (onClearDismissedCode) onClearDismissedCode();

      // Automatically advance to the next challenge after 2.2 seconds!
      if (!isLast) {
        setTimeout(() => {
          setChallengeIndex((prev) => {
            const nextIdx = prev + 1;
            setCode(CODING_CHALLENGES[nextIdx].starterCode);
            setCongratsBanner(null);
            setConsoleOutput({
              status: 'idle',
              text: `🚀 Loaded Challenge ${nextIdx + 1}/${CODING_CHALLENGES.length}: "${CODING_CHALLENGES[nextIdx].title}"! Read the prompt comment and fix the code.`,
              timestamp: Date.now(),
            });
            return nextIdx;
          });
        }, 2200);
      }
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

  const activeChallenge = CODING_CHALLENGES[challengeIndex];

  return (
    <div
      // SACRED SAFE ZONE: NO data-physics-id here! This editor never falls.
      className={`flex-1 flex flex-col bg-[#13141F] border-2 overflow-hidden transition-all duration-300 relative ${tiltClass} ${joltClass}`}
    >
      {/* Editor Top Bar & Controls */}
      <div className="bg-[#1C1E2D] border-b-2 border-black px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="bg-[#FACC15] text-black font-black px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000] font-mono text-[11px] flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5" />
            <span>challenge_{challengeIndex + 1}.js</span>
          </div>
          <span className="text-[10px] font-mono text-[#F43F5E] font-bold hidden xl:inline">
            [SAFE ZONE — NEVER COLLAPSES]
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-mono">
          {/* 1. Correct Answer Button */}
          <button
            onClick={handleLoadCorrectAnswer}
            className="neo-btn bg-[#34D399] hover:bg-[#6EE7B7] text-black font-black px-2.5 py-1 text-[11px] flex items-center gap-1 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            title={`Load verified solution for Question ${challengeIndex + 1}`}
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>✨ Correct Answer</span>
          </button>

          <span className="text-slate-500 font-bold text-[10px] hidden sm:inline px-0.5">|</span>
          <span className="text-slate-400 font-bold text-[10px] hidden lg:inline">Bugs:</span>

          {/* 2. Bug Presets */}
          <button
            onClick={() => handleLoadBug(BUG_PRESETS.BRACKET_BUG, 'Missing "}"')}
            className="neo-btn bg-[#FACC15] hover:bg-yellow-300 text-black font-black px-2 py-1 text-[10px] shadow-[2px_2px_0px_#000]"
            title="Load code with unclosed bracket syntax error"
          >
            {'💥 Missing "}"'}
          </button>

          <button
            onClick={() => handleLoadBug(BUG_PRESETS.VAR_BUG, 'Illegal "var"')}
            className="neo-btn bg-[#FB7185] hover:bg-rose-400 text-black font-black px-2 py-1 text-[10px] shadow-[2px_2px_0px_#000]"
            title="Load code with deprecated var declarations"
          >
            🚫 Illegal "var"
          </button>

          <button
            onClick={() => handleLoadBug(BUG_PRESETS.SEMICOLON_BUG, 'Missing ";"')}
            className="neo-btn bg-[#C084FC] hover:bg-purple-300 text-black font-black px-2 py-1 text-[10px] shadow-[2px_2px_0px_#000] hidden sm:inline-block"
            title="Load code with missing semicolons"
          >
            ⚠️ Missing ";"
          </button>

          <button
            onClick={() => handleLoadBug(BUG_PRESETS.COMBO_BUG, 'Combo Bugs')}
            className="neo-btn bg-[#FF4365] hover:bg-red-400 text-white font-black px-2 py-1 text-[10px] shadow-[2px_2px_0px_#000]"
            title="Load code with multiple combined syntax fractures"
          >
            💀 Combo Bugs
          </button>

          {/* 3. RUN / COMPILE BUTTON */}
          <button
            onClick={handleRunCode}
            className="neo-btn bg-[#10B981] hover:bg-[#34D399] text-black font-black px-3.5 py-1 text-xs flex items-center gap-1.5 shadow-[3px_3px_0px_#000] ml-1"
            title="Compile code (Ctrl+Enter)"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>▶ RUN CODE</span>
          </button>
        </div>
      </div>

      {/* Challenge Navigation Bar */}
      <div className="bg-[#141522] border-b-2 border-black px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs select-none font-mono">
        <div className="flex items-center gap-2">
          <span className="bg-[#FACC15] text-black font-black px-2 py-0.5 border border-black text-[10px]">
            QUESTION {challengeIndex + 1}/{CODING_CHALLENGES.length}
          </span>
          <span className="font-bold text-white text-[11px]">
            {activeChallenge.title}
          </span>
          <span className="text-[10px] text-amber-300 font-bold hidden sm:inline">
            [{activeChallenge.tag}]
          </span>
          {solvedChallenges.has(activeChallenge.id) && (
            <span className="text-[10px] bg-[#10B981] text-black font-black px-1.5 py-0.2 border border-black flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              SOLVED
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevChallenge}
            disabled={challengeIndex === 0}
            className="neo-btn bg-[#25283D] text-slate-300 disabled:opacity-30 px-2 py-0.5 text-[10px] flex items-center gap-0.5"
            title="Previous Question"
          >
            <ChevronLeft className="w-3 h-3" />
            <span className="hidden sm:inline">PREV</span>
          </button>
          <button
            onClick={handleNextChallenge}
            disabled={challengeIndex === CODING_CHALLENGES.length - 1}
            className="neo-btn bg-[#25283D] text-slate-300 disabled:opacity-30 px-2 py-0.5 text-[10px] flex items-center gap-0.5"
            title="Next Question"
          >
            <span className="hidden sm:inline">NEXT</span>
            <ChevronRight className="w-3 h-3" />
          </button>
          <button
            onClick={handleResetChallenge}
            className="neo-btn bg-[#FF4365] text-white px-2 py-0.5 text-[10px] flex items-center gap-1"
            title="Reset question starter code"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </div>

      {/* OS Congratulation Celebration Ribbon */}
      {congratsBanner && (
        <div className="bg-[#10B981] text-black border-b-2 border-black px-4 py-2 flex items-center justify-between font-mono text-xs font-black shadow-[0_2px_0_#000] animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 animate-bounce" />
            <span>{congratsBanner.text}</span>
          </div>
          {!congratsBanner.isFinal ? (
            <span className="bg-black text-[#FACC15] px-2 py-0.5 border border-black text-[10px]">
              ADVANCING TO NEXT QUESTION...
            </span>
          ) : (
            <span className="bg-black text-[#FACC15] px-2 py-0.5 border border-black text-[10px]">
              ALL QUESTIONS CLEARED! 🏆
            </span>
          )}
        </div>
      )}

      {/* Code Integrity / Fracture Banner (Shows when something breaks in UI) */}
      {lastError && !congratsBanner && (
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
