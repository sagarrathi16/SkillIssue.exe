import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../app/osStateMachine';
import { audioManager } from '../../audio/AudioManager';
import { 
  Flame, 
  Dices, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  Keyboard, 
  Heart, 
  Terminal, 
  AlertTriangle,
  Fingerprint
} from 'lucide-react';

const DARES = [
  {
    id: 'SPEED_TYPING',
    title: 'Dare 1: The 12-Second Speed Oath',
    desc: 'Type this developer commitment oath in under 12 seconds without typos!',
    targetText: 'I will never push untested code directly to production',
    timeLimit: 12,
  },
  {
    id: 'HOLD_REMORSE',
    title: 'Dare 2: The 5-Second Lie Detector',
    desc: 'Hold the button continuously for 5.0 seconds while the OS conducts an emotional remorse scan!',
    duration: 5.0,
  },
  {
    id: 'MEMORY_SEQUENCE',
    title: 'Dare 3: Terminal Simon Says',
    desc: 'Remember the sequence of 4 terminal commands and click them in the exact order!',
    sequence: ['git stash', 'npm test', 'rm -rf cache', 'sudo reboot'],
  },
];

export function DareRoulette({ onDareComplete }) {
  const { actions } = useOS();
  const [selectedDareIdx, setSelectedDareIdx] = useState(0);
  const [dareState, setDareState] = useState('ready'); // 'ready' | 'active' | 'success' | 'failed'

  // Dare 1 State: Speed Typing
  const [typedText, setTypedText] = useState('');
  const [typingTimeLeft, setTypingTimeLeft] = useState(12);
  const typingTimerRef = useRef(null);

  // Dare 2 State: Hold Remorse Button
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdStartRef = useRef(null);
  const holdRafRef = useRef(null);

  // Dare 3 State: Memory Sequence
  const [sequenceStep, setSequenceStep] = useState(0); // showing preview vs user input
  const [userSequence, setUserSequence] = useState([]);
  const [flashingIndex, setFlashingIndex] = useState(-1);

  const activeDare = DARES[selectedDareIdx];

  // Trigger Victory & System Recovery
  const handleSuccess = (note) => {
    setDareState('success');
    audioManager.playVictoryChime();
    setTimeout(() => {
      if (onDareComplete) {
        onDareComplete();
      } else {
        actions.startRecovery(85, {
          reason: 'Completed Tech Lead Dare',
          dareId: activeDare.id,
          note,
        });
      }
    }, 1500);
  };

  // =========================================================================
  // DARE 1: SPEED TYPING LOGIC
  // =========================================================================

  const startSpeedTyping = () => {
    setDareState('active');
    setTypedText('');
    setTypingTimeLeft(activeDare.timeLimit);
    audioManager.playSfx('beep');

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    typingTimerRef.current = setInterval(() => {
      setTypingTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(typingTimerRef.current);
          setDareState('failed');
          audioManager.playSfx('sigh');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTypingChange = (e) => {
    const val = e.target.value;
    setTypedText(val);

    if (val.trim() === activeDare.targetText) {
      clearInterval(typingTimerRef.current);
      handleSuccess('Speed typing oath completed in time!');
    }
  };

  // Cleanup typing timer
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  // =========================================================================
  // DARE 2: HOLD TO SWEAR REMORSE (5.0s Continuous Hold)
  // =========================================================================

  const startHolding = () => {
    setIsHolding(true);
    holdStartRef.current = performance.now();
    audioManager.playSfx('beep');

    const checkHold = (now) => {
      const elapsed = (now - holdStartRef.current) / 1000;
      const progress = Math.min(100, (elapsed / 5.0) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        setIsHolding(false);
        handleSuccess('5-second remorse scan passed with 100% sincerity!');
        return;
      }

      holdRafRef.current = requestAnimationFrame(checkHold);
    };

    holdRafRef.current = requestAnimationFrame(checkHold);
  };

  const stopHolding = () => {
    if (holdProgress < 100) {
      setIsHolding(false);
      setHoldProgress(0);
      if (holdRafRef.current) cancelAnimationFrame(holdRafRef.current);
      audioManager.playSfx('sigh');
    }
  };

  // =========================================================================
  // DARE 3: MEMORY SEQUENCE LOGIC
  // =========================================================================

  const startMemorySequence = () => {
    setDareState('active');
    setUserSequence([]);
    setSequenceStep(0); // 0 = showing preview, 1 = user turn
    audioManager.playSfx('beep');

    // Flash each command in sequence
    const commands = activeDare.sequence;
    commands.forEach((_, idx) => {
      setTimeout(() => {
        setFlashingIndex(idx);
        audioManager.playSfx('beep');
        setTimeout(() => setFlashingIndex(-1), 400);
      }, (idx + 1) * 700);
    });

    // Switch to user input after demonstration
    setTimeout(() => {
      setSequenceStep(1);
    }, (commands.length + 1) * 700);
  };

  const handleCommandClick = (cmd) => {
    if (sequenceStep !== 1 || dareState !== 'active') return;

    audioManager.playSfx('beep');
    const nextUserSeq = [...userSequence, cmd];
    setUserSequence(nextUserSeq);

    const targetSeq = activeDare.sequence;
    const currentStepIdx = nextUserSeq.length - 1;

    // Check if correct command clicked
    if (nextUserSeq[currentStepIdx] !== targetSeq[currentStepIdx]) {
      setDareState('failed');
      audioManager.playSfx('sigh');
      return;
    }

    // Check if full sequence completed
    if (nextUserSeq.length === targetSeq.length) {
      handleSuccess('Terminal sequence memory challenge completed!');
    }
  };

  // Reset dare
  const handleResetDare = () => {
    setDareState('ready');
    setTypedText('');
    setHoldProgress(0);
    setUserSequence([]);
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
  };

  return (
    <div className="flex flex-col gap-3 font-mono text-xs select-none">
      {/* Header & Dare Selector Tabs */}
      <div className="bg-[#12131F] border-2 border-black p-3 shadow-[3px_3px_0px_#000] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 text-white border-2 border-black flex items-center justify-center text-lg font-black shadow-[2px_2px_0px_#000]">
              🎲
            </div>
            <div>
              <h3 className="font-black text-white text-xs sm:text-sm uppercase tracking-wider">
                TECH LEAD DARE ROULETTE
              </h3>
              <p className="text-[10px] text-slate-400 font-sans">
                Complete a humiliating developer dare to earn back your system privileges.
              </p>
            </div>
          </div>
          <span className="bg-[#FACC15] text-black font-black text-[9px] px-2 py-0.5 border border-black uppercase">
            3 DARES AVAILABLE
          </span>
        </div>

        {/* Dare Picker Pills */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {DARES.map((dare, i) => (
            <button
              key={dare.id}
              onClick={() => {
                setSelectedDareIdx(i);
                handleResetDare();
              }}
              className={`neo-btn py-1.5 px-2 text-[10px] font-black truncate text-center ${
                selectedDareIdx === i
                  ? 'bg-[#FACC15] text-black'
                  : 'bg-[#1E2032] text-slate-300 hover:text-white'
              }`}
            >
              {dare.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dare Arena */}
      <div className="bg-[#0E0F1A] border-2 border-black p-4 sm:p-5 shadow-[3px_3px_0px_#000] flex flex-col gap-4 min-h-[220px]">
        {/* Dare Description Bar */}
        <div className="flex items-start justify-between gap-3 border-b-2 border-black pb-3">
          <div>
            <span className="bg-rose-500 text-white font-black text-[10px] px-1.5 py-0.2 border border-black uppercase">
              {activeDare.title}
            </span>
            <p className="text-xs font-bold text-slate-200 mt-1.5 font-sans">
              {activeDare.desc}
            </p>
          </div>
        </div>

        {/* DARE 1: SPEED TYPING OATH */}
        {activeDare.id === 'SPEED_TYPING' && (
          <div className="flex flex-col gap-3">
            {/* Target Oath Display */}
            <div className="p-3 bg-[#181926] border-2 border-black shadow-[2px_2px_0px_#000] font-mono text-xs sm:text-sm text-yellow-300 font-bold select-text">
              "{activeDare.targetText}"
            </div>

            {dareState === 'ready' ? (
              <button
                onClick={startSpeedTyping}
                className="neo-btn bg-[#10B981] text-black font-black py-2.5 px-4 text-xs flex items-center justify-center gap-2"
              >
                <Keyboard className="w-4 h-4" />
                <span>START 12-SECOND TYPING SPRINT</span>
              </button>
            ) : dareState === 'active' ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Type accurately below:</span>
                  <span className={`px-2 py-0.5 border border-black font-mono font-black ${
                    typingTimeLeft <= 4 ? 'bg-rose-500 text-white animate-pulse' : 'bg-[#FACC15] text-black'
                  }`}>
                    TIME LEFT: {typingTimeLeft}s
                  </span>
                </div>

                <input
                  type="text"
                  autoFocus
                  value={typedText}
                  onChange={handleTypingChange}
                  placeholder="Start typing the oath..."
                  className="w-full bg-[#161726] border-2 border-black p-2.5 text-white font-mono text-xs focus:outline-none focus:border-yellow-400 shadow-[2px_2px_0px_#000]"
                />
              </div>
            ) : null}
          </div>
        )}

        {/* DARE 2: 5-SECOND CONTINUOUS REMORSE SCAN */}
        {activeDare.id === 'HOLD_REMORSE' && (
          <div className="flex flex-col items-center justify-center gap-4 py-2">
            <div className="w-full bg-black border-2 border-black h-4 p-0.5 shadow-[2px_2px_0px_#000]">
              <div
                className="h-full bg-rose-500 transition-all duration-75 flex items-center justify-end pr-1 text-[8px] font-black text-white"
                style={{ width: `${holdProgress}%` }}
              >
                {Math.floor(holdProgress)}%
              </div>
            </div>

            <p className="text-[11px] text-amber-300 font-bold text-center">
              {holdProgress === 0
                ? 'Press and keep holding the button for 5 seconds without letting go!'
                : holdProgress < 40
                ? '🔍 Calibrating lie detector... Analyzing pulse rate...'
                : holdProgress < 80
                ? '⚠️ Heart rate elevated. Tech lead detecting genuine remorse...'
                : '✨ SINCERITY VERIFIED! ACCEPTING OATH...'}
            </p>

            <button
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onTouchStart={startHolding}
              onTouchEnd={stopHolding}
              className={`neo-btn py-4 px-8 text-sm font-black flex items-center gap-2 ${
                isHolding
                  ? 'bg-rose-500 text-white animate-pulse shadow-[2px_2px_0px_#000]'
                  : 'bg-[#FACC15] text-black'
              }`}
            >
              <Fingerprint className="w-5 h-5" />
              <span>{isHolding ? 'HOLDING... DO NOT RELEASE!' : 'HOLD TO SWEAR REMORSE (5.0s)'}</span>
            </button>
          </div>
        )}

        {/* DARE 3: MEMORY SEQUENCE (SIMON SAYS) */}
        {activeDare.id === 'MEMORY_SEQUENCE' && (
          <div className="flex flex-col gap-3">
            {dareState === 'ready' ? (
              <button
                onClick={startMemorySequence}
                className="neo-btn bg-[#38BDF8] text-black font-black py-2.5 px-4 text-xs flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                <span>START COMMAND MEMORY TEST</span>
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="text-[11px] font-bold text-slate-300 text-center">
                  {sequenceStep === 0
                    ? '👀 Memorize the flashed sequence of commands...'
                    : '👉 Click the commands in the EXACT order they flashed!'}
                </div>

                {/* 4 Interactive Command Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {activeDare.sequence.map((cmd, i) => {
                    const isFlashed = flashingIndex === i;
                    return (
                      <button
                        key={cmd}
                        onClick={() => handleCommandClick(cmd)}
                        disabled={sequenceStep !== 1}
                        className={`neo-btn p-3 text-xs font-mono font-bold transition-all ${
                          isFlashed
                            ? 'bg-[#FACC15] text-black scale-105 shadow-[4px_4px_0px_#000]'
                            : 'bg-[#181926] text-slate-200 hover:bg-[#25283D]'
                        }`}
                      >
                        $ {cmd}
                      </button>
                    );
                  })}
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold">
                  <span>Clicks: {userSequence.length} / {activeDare.sequence.length}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* OUTCOME OVERLAYS */}
        {dareState === 'success' && (
          <div className="p-3 bg-[#10B981] border-2 border-black shadow-[3px_3px_0px_#000] text-black font-black flex items-center gap-2 text-center justify-center animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-black" />
            <span>🏆 DARE COMPLETED! OS TRUST RESTORED! REASSEMBLING UI...</span>
          </div>
        )}

        {dareState === 'failed' && (
          <div className="p-3 bg-[#FF4365] border-2 border-black shadow-[3px_3px_0px_#000] text-white flex items-center justify-between gap-2">
            <div className="font-black text-xs">
              ❌ DARE FAILED! Time expired or incorrect sequence.
            </div>
            <button
              onClick={handleResetDare}
              className="neo-btn bg-black text-white hover:bg-slate-900 px-3 py-1 text-[10px] font-black flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RETRY</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
