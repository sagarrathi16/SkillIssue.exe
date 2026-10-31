import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../app/osStateMachine';
import { audioManager } from '../../audio/AudioManager';
import { 
  Bug, 
  Flame, 
  Skull, 
  Zap, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  Play, 
  Crosshair, 
  Timer,
  AlertOctagon,
  CheckCircle2,
  Coffee,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';

// =========================================================================
// GOOD BOXES (SQUASH FOR POINTS & COMBOS)
// =========================================================================
const GOOD_BOX_TYPES = [
  { 
    type: 'syntax_fix', 
    label: 'Syntax Fix', 
    icon: CheckCircle2, 
    points: 15, 
    isGood: true, 
    color: 'bg-[#10B981] text-black border-2 border-black' 
  },
  { 
    type: 'hotfix', 
    label: 'Hotfix Patch', 
    icon: Zap, 
    points: 20, 
    isGood: true, 
    color: 'bg-[#38BDF8] text-black border-2 border-black' 
  },
  { 
    type: 'refactor', 
    label: 'Clean Refactor', 
    icon: Sparkles, 
    points: 25, 
    isGood: true, 
    color: 'bg-[#FACC15] text-black border-2 border-black' 
  },
  { 
    type: 'caffeine', 
    label: 'Caffeine Boost', 
    icon: Coffee, 
    points: 30, 
    isGood: true, 
    color: 'bg-[#C084FC] text-black border-2 border-black' 
  },
];

// =========================================================================
// BAD BOXES (TRAPS! CLICKING DECREASES POINTS & RESETS COMBO)
// =========================================================================
const BAD_BOX_TYPES = [
  { 
    type: 'drop_db', 
    label: 'DROP PROD DB', 
    icon: Skull, 
    penalty: 35, 
    isGood: false, 
    color: 'bg-[#FF4365] text-white border-2 border-black font-black' 
  },
  { 
    type: 'leak_bomb', 
    label: 'Memory Bomb', 
    icon: Flame, 
    penalty: 20, 
    isGood: false, 
    color: 'bg-[#EA580C] text-white border-2 border-black font-black' 
  },
  { 
    type: 'kernel_panic', 
    label: 'Kernel Panic', 
    icon: AlertOctagon, 
    penalty: 25, 
    isGood: false, 
    color: 'bg-[#991B1B] text-white border-2 border-black font-black' 
  },
  { 
    type: 'spaghetti', 
    label: 'Spaghetti Trap', 
    icon: Bug, 
    penalty: 15, 
    isGood: false, 
    color: 'bg-[#4C1D95] text-white border-2 border-black font-black' 
  },
];

const TARGET_SCORE = 160;
const GAME_DURATION = 35; // Extended to 35 seconds for arcade stamina challenge

export function BugSmasherGame({ onGameWin }) {
  const { actions } = useOS();
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'won' | 'lost'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [activeHoles, setActiveHoles] = useState({}); // { [holeIndex]: boxObj }
  const [combo, setCombo] = useState(0);
  const [rackShake, setRackShake] = useState(false);
  const [hitFeedback, setHitFeedback] = useState(null); // { holeIndex, text, isGood }

  const timerRef = useRef(null);

  // Speed multiplier derived from remaining time
  const timeProgress = (GAME_DURATION - timeLeft) / GAME_DURATION;
  const speedMultiplier = (1 + timeProgress * 1.5).toFixed(1);

  // Start the Bug Smasher arcade game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_DURATION);
    setActiveHoles({});
    setHitFeedback(null);
    setRackShake(false);
    audioManager.playSfx('beep');
  };

  // Main countdown timer (1 tick per second)
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameState('lost');
          audioManager.playSfx('sigh');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // Dynamic Spawning Loop — Speed increases and trap ratios escalate as time ticks down!
  useEffect(() => {
    if (gameState !== 'playing') return;

    let timeoutId;

    const spawnTick = () => {
      const progress = (GAME_DURATION - timeLeft) / GAME_DURATION; // 0 to 1
      // Spawn interval accelerates: 620ms down to 280ms
      const spawnDelay = Math.max(280, Math.floor(620 - progress * 340));
      // Box lifetime shrinks: 1050ms down to 500ms
      const boxLifetime = Math.max(500, Math.floor(1050 - progress * 550));
      // Bad box ratio increases: 20% up to 50%
      const badChance = 0.20 + progress * 0.30;

      setActiveHoles((prev) => {
        const next = { ...prev };

        // In mid-to-late game, occasionally spawn 2 boxes at once
        const countToSpawn = progress > 0.5 ? (Math.random() < 0.6 ? 2 : 1) : 1;

        for (let c = 0; c < countToSpawn; c++) {
          const holeIdx = Math.floor(Math.random() * 9);
          const isBad = Math.random() < badChance;
          const template = isBad
            ? BAD_BOX_TYPES[Math.floor(Math.random() * BAD_BOX_TYPES.length)]
            : GOOD_BOX_TYPES[Math.floor(Math.random() * GOOD_BOX_TYPES.length)];

          next[holeIdx] = {
            ...template,
            id: Date.now() + Math.random(),
            expiresAt: Date.now() + boxLifetime,
          };
        }

        // Clean up expired boxes
        const now = Date.now();
        Object.keys(next).forEach((k) => {
          if (next[k].expiresAt < now) {
            delete next[k];
          }
        });

        return next;
      });

      timeoutId = setTimeout(spawnTick, spawnDelay);
    };

    timeoutId = setTimeout(spawnTick, 350);

    return () => clearTimeout(timeoutId);
  }, [gameState, timeLeft]);

  // Handle clicking / smashing a box
  const handleSmash = (holeIndex) => {
    if (gameState !== 'playing') return;

    const box = activeHoles[holeIndex];
    if (!box) {
      // Missed click
      audioManager.playSfx('beep');
      setCombo(0);
      return;
    }

    if (box.isGood) {
      // GOOD BOX: Add points & build combo!
      const pointsEarned = box.points + combo * 2;
      const newScore = score + pointsEarned;
      const newCombo = combo + 1;

      setScore(newScore);
      setCombo(newCombo);
      audioManager.playSfx('beep');

      // Visual hit burst
      setHitFeedback({ holeIndex, text: `+${pointsEarned}`, isGood: true });
      setTimeout(() => setHitFeedback(null), 380);

      // Remove box
      setActiveHoles((prev) => {
        const next = { ...prev };
        delete next[holeIndex];
        return next;
      });

      // Check Win Condition
      if (newScore >= TARGET_SCORE) {
        clearInterval(timerRef.current);
        setGameState('won');
        audioManager.playVictoryChime();

        setTimeout(() => {
          if (onGameWin) {
            onGameWin();
          } else {
            actions.startRecovery(85, {
              reason: 'Won Hardcore Bug Smasher Arcade Game',
              finalScore: newScore,
            });
          }
        }, 1500);
      }
    } else {
      // BAD BOX: TRAP TRIGGERED! Deduct points & break combo!
      const penalty = box.penalty;
      const newScore = Math.max(0, score - penalty);

      setScore(newScore);
      setCombo(0); // Combo broken!
      setRackShake(true);
      setTimeout(() => setRackShake(false), 450);

      audioManager.playErrorBuzz();

      // Visual penalty hit burst
      setHitFeedback({ holeIndex, text: `-${penalty} TRAP!`, isGood: false });
      setTimeout(() => setHitFeedback(null), 450);

      // Remove box
      setActiveHoles((prev) => {
        const next = { ...prev };
        delete next[holeIndex];
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 font-mono select-none">
      {/* Arcade Game Marquee Header */}
      <div className="bg-[#12131F] border-2 border-black p-3 shadow-[3px_3px_0px_#000] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#10B981] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-xl shrink-0">
            <Crosshair className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="font-black text-white text-xs sm:text-sm flex items-center gap-1.5 uppercase">
              <span>HARDCORE BUG SMASHER</span>
              <span className="bg-[#FACC15] text-black text-[9px] px-1.5 py-0.2 border border-black font-black">
                TARGET: {TARGET_SCORE} PTS
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Click Green/Gold to gain points! Avoid Red/Skull traps (-PTS)!
            </div>
          </div>
        </div>

        {/* HUD Telemetry: Timer, Speed, Combo, Score */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono">
          {/* Speed Escalation Indicator */}
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-slate-400 font-bold uppercase">SPEED</span>
            <div className={`text-xs font-black px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000] ${
              timeProgress > 0.65 ? 'bg-rose-500 text-white animate-pulse' : timeProgress > 0.35 ? 'bg-amber-400 text-black' : 'bg-[#1E2032] text-cyan-300'
            }`}>
              {speedMultiplier}x {timeProgress > 0.65 ? '🔥' : ''}
            </div>
          </div>

          {/* Combo Indicator */}
          <div className="flex flex-col items-end border-l-2 border-black pl-2">
            <span className="text-[8px] text-slate-400 font-bold uppercase">COMBO</span>
            <div className={`text-xs font-black px-1.5 py-0.5 border border-black ${
              combo >= 3 ? 'bg-[#FACC15] text-black' : 'bg-black text-slate-400'
            }`}>
              x{combo}
            </div>
          </div>

          {/* Timer */}
          <div className="flex flex-col items-end border-l-2 border-black pl-2">
            <span className="text-[8px] text-slate-400 font-bold uppercase">TIME</span>
            <div className={`text-sm sm:text-base font-black px-2 py-0.2 border border-black shadow-[1px_1px_0px_#000] ${
              timeLeft <= 8 ? 'bg-rose-500 text-white animate-pulse' : 'bg-black text-[#FACC15]'
            }`}>
              {timeLeft}s
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-end border-l-2 border-black pl-2">
            <span className="text-[8px] text-slate-400 font-bold uppercase">SCORE</span>
            <div className="bg-emerald-400 text-black font-black text-sm sm:text-base px-2.5 py-0.2 border border-black shadow-[1px_1px_0px_#000]">
              {score}
            </div>
          </div>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="w-full bg-black border-2 border-black h-3.5 p-0.5 shadow-[2px_2px_0px_#000]">
        <div
          className="h-full bg-emerald-400 transition-all duration-150 flex items-center justify-end pr-1 text-[8px] font-black text-black"
          style={{ width: `${Math.min(100, (score / TARGET_SCORE) * 100)}%` }}
        >
          {Math.floor((score / TARGET_SCORE) * 100)}%
        </div>
      </div>

      {/* Active Game Screen / Outcome Overlays */}
      {gameState === 'idle' ? (
        <div className="bg-[#0E0F1A] border-2 border-black p-6 shadow-[3px_3px_0px_#000] flex flex-col items-center justify-center gap-3 text-center min-h-[220px]">
          <div className="p-3 bg-[#FACC15] border-2 border-black shadow-[3px_3px_0px_#000]">
            <Bug className="w-8 h-8 text-black animate-bounce" />
          </div>
          <div>
            <h3 className="font-black text-sm text-white uppercase tracking-wider">
              SERVER RACK CRISIS IN PROGRESS!
            </h3>
            <p className="text-xs text-slate-300 font-sans max-w-sm mt-1 leading-relaxed">
              Earn <strong className="text-emerald-400">{TARGET_SCORE} PTS</strong> in <strong>{GAME_DURATION}s</strong>!
              Click <strong className="text-emerald-300">Green/Gold Fixes (+PTS)</strong> but avoid <strong className="text-rose-400">Red Traps & Prod DB (-PTS)</strong>! Speed escalates over time!
            </p>
          </div>
          <button
            onClick={startGame}
            className="neo-btn bg-[#10B981] hover:bg-[#34D399] text-black font-black py-2.5 px-6 text-sm flex items-center gap-2 shadow-[3px_3px_0px_#000]"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>START HARDCORE CHALLENGE</span>
          </button>
        </div>
      ) : gameState === 'won' ? (
        <div className="bg-[#10B981] border-2 border-black p-6 shadow-[4px_4px_0px_#000] text-black flex flex-col items-center justify-center gap-2 text-center min-h-[220px]">
          <Trophy className="w-10 h-10 text-black animate-bounce" />
          <h3 className="font-black text-lg uppercase tracking-wider">
            🏆 SERVER CLEANSED! OS FULLY RESTORED!
          </h3>
          <p className="text-xs font-bold max-w-sm">
            Final Score: {score} pts. OS integrity fully satisfied. Spring-rebuilding developer workspace...
          </p>
        </div>
      ) : gameState === 'lost' ? (
        <div className="bg-[#FF4365] border-2 border-black p-6 shadow-[4px_4px_0px_#000] text-white flex flex-col items-center justify-center gap-3 text-center min-h-[220px]">
          <AlertOctagon className="w-10 h-10 text-yellow-300 animate-pulse" />
          <div>
            <h3 className="font-black text-base uppercase tracking-wider">
              TIME OUT! PRODUCTION OVERRUN!
            </h3>
            <p className="text-xs font-bold text-white/90 mt-1">
              You scored {score}/{TARGET_SCORE} pts before the servers melted down. Avoid the red traps and try again!
            </p>
          </div>
          <button
            onClick={startGame}
            className="neo-btn bg-black text-white hover:bg-slate-900 py-2.5 px-6 font-black text-xs flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN (RETRY)</span>
          </button>
        </div>
      ) : (
        /* The 3x3 Server Rack Grid */
        <div className={`grid grid-cols-3 gap-2.5 bg-[#0E0F1A] border-2 border-black p-3.5 shadow-[3px_3px_0px_#000] transition-transform ${
          rackShake ? 'anim-code-jolt border-rose-600' : ''
        }`}>
          {Array.from({ length: 9 }).map((_, index) => {
            const box = activeHoles[index];
            const isHit = hitFeedback && hitFeedback.holeIndex === index;

            return (
              <div
                key={index}
                onClick={() => handleSmash(index)}
                className={`h-20 sm:h-24 border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col items-center justify-center relative cursor-crosshair transition-all active:scale-95 ${
                  box
                    ? `${box.color} hover:brightness-110`
                    : 'bg-[#181926] hover:bg-[#202234]'
                }`}
              >
                {/* Server Slot Label */}
                <span className="absolute top-1 left-1.5 text-[8px] opacity-40 font-mono font-bold">
                  CORE-0{index + 1}
                </span>

                {/* Box Content */}
                {box && (
                  <div className="flex flex-col items-center animate-in zoom-in-50 duration-150">
                    <box.icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
                    <span className="text-[9px] font-black uppercase tracking-tight mt-0.5 text-center px-1 truncate max-w-full">
                      {box.label}
                    </span>
                    <span className={`text-[8px] font-black font-mono ${
                      box.isGood ? 'opacity-90' : 'text-yellow-200'
                    }`}>
                      {box.isGood ? `+${box.points} PTS` : `-${box.penalty} TRAP!`}
                    </span>
                  </div>
                )}

                {/* Hit Feedback Floating Badge */}
                {isHit && (
                  <div className={`absolute inset-0 border-2 border-black flex items-center justify-center font-black text-sm z-20 animate-out fade-out duration-300 ${
                    hitFeedback.isGood
                      ? 'bg-emerald-400 text-black'
                      : 'bg-rose-600 text-white animate-pulse'
                  }`}>
                    {hitFeedback.isGood ? `💥 ${hitFeedback.text}!` : `💀 ${hitFeedback.text}!`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Trap Warning Guide Footer */}
      <div className="flex items-center justify-between text-[10px] font-mono px-2 py-1 bg-[#181926] border border-black text-slate-400">
        <span className="text-emerald-400 font-bold">🟩 GREEN/GOLD/PURPLE = GOOD (+PTS)</span>
        <span className="text-rose-400 font-bold">🟥 RED/SKULL/FLAME = TRAP (-PTS)</span>
      </div>
    </div>
  );
}

