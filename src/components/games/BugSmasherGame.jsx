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
  AlertOctagon
} from 'lucide-react';

const BUG_TYPES = [
  { type: 'syntax', label: 'Syntax Bug', icon: Bug, points: 10, color: 'bg-amber-400 text-black' },
  { type: 'leak', label: 'Memory Leak', icon: Flame, points: 15, color: 'bg-rose-500 text-white' },
  { type: 'null', label: 'NullPointer', icon: Skull, points: 20, color: 'bg-purple-500 text-white' },
  { type: 'server', label: '500 Error', icon: Zap, points: 10, color: 'bg-cyan-400 text-black' },
];

const TARGET_SCORE = 100;
const GAME_DURATION = 20; // seconds

export function BugSmasherGame({ onGameWin }) {
  const { actions } = useOS();
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'won' | 'lost'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [activeHoles, setActiveHoles] = useState({}); // { [holeIndex]: bugObj }
  const [combo, setCombo] = useState(0);
  const [hitFeedback, setHitFeedback] = useState(null); // { holeIndex, points, text }

  const timerRef = useRef(null);
  const spawnIntervalRef = useRef(null);

  // Start the Bug Smasher arcade game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_DURATION);
    setActiveHoles({});
    setHitFeedback(null);
    audioManager.playSfx('beep');
  };

  // Main countdown timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(spawnIntervalRef.current);
          setGameState('lost');
          audioManager.playSfx('sigh');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // Spawning bugs dynamically across the 9 server rack slots
  useEffect(() => {
    if (gameState !== 'playing') return;

    spawnIntervalRef.current = setInterval(() => {
      setActiveHoles((prev) => {
        const next = { ...prev };
        // Randomly pick 1-2 holes to spawn
        const holeIdx = Math.floor(Math.random() * 9);
        const randomBug = BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)];

        // Assign bug with an expiry timestamp
        next[holeIdx] = {
          ...randomBug,
          id: Date.now() + Math.random(),
          expiresAt: Date.now() + 1100, // lives for 1.1s
        };

        // Remove expired bugs
        const now = Date.now();
        Object.keys(next).forEach((k) => {
          if (next[k].expiresAt < now) {
            delete next[k];
          }
        });

        return next;
      });
    }, 600);

    return () => clearInterval(spawnIntervalRef.current);
  }, [gameState]);

  // Handle clicking / smashing a bug
  const handleSmash = (holeIndex) => {
    if (gameState !== 'playing') return;

    const bug = activeHoles[holeIndex];
    if (!bug) {
      // Missed click
      audioManager.playSfx('beep');
      setCombo(0);
      return;
    }

    // Hit bug!
    const pointsEarned = bug.points + combo * 2;
    const newScore = score + pointsEarned;
    const newCombo = combo + 1;

    setScore(newScore);
    setCombo(newCombo);
    audioManager.playSfx('beep');

    // Visual hit burst
    setHitFeedback({ holeIndex, points: pointsEarned, text: `+${pointsEarned}` });
    setTimeout(() => setHitFeedback(null), 400);

    // Remove smashed bug
    setActiveHoles((prev) => {
      const next = { ...prev };
      delete next[holeIndex];
      return next;
    });

    // Check Win Condition
    if (newScore >= TARGET_SCORE) {
      clearInterval(timerRef.current);
      clearInterval(spawnIntervalRef.current);
      setGameState('won');
      audioManager.playVictoryChime();

      setTimeout(() => {
        if (onGameWin) {
          onGameWin();
        } else {
          actions.startRecovery(85, {
            reason: 'Won Bug Smasher Arcade Game',
            finalScore: newScore,
          });
        }
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col gap-3 font-mono select-none">
      {/* Arcade Game Marquee Header */}
      <div className="bg-[#12131F] border-2 border-black p-3 shadow-[3px_3px_0px_#000] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#10B981] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-xl shrink-0">
            <Crosshair className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="font-black text-white text-xs sm:text-sm flex items-center gap-1.5 uppercase">
              <span>BUG SMASHER ARCADE</span>
              <span className="bg-[#FACC15] text-black text-[9px] px-1.5 py-0.2 border border-black font-black">
                TARGET: {TARGET_SCORE} PTS
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Squash escaping bugs to restore OS system integrity!
            </div>
          </div>
        </div>

        {/* HUD Score & Timer */}
        <div className="flex items-center gap-3 font-mono">
          {/* Timer */}
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-slate-400 font-bold uppercase">TIME</span>
            <div className={`text-base font-black px-2 py-0.2 border border-black shadow-[1px_1px_0px_#000] ${
              timeLeft <= 5 ? 'bg-rose-500 text-white animate-pulse' : 'bg-black text-[#FACC15]'
            }`}>
              {timeLeft}s
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-end border-l-2 border-black pl-3">
            <span className="text-[8px] text-slate-400 font-bold uppercase">SCORE</span>
            <div className="bg-emerald-400 text-black font-black text-base px-2.5 py-0.2 border border-black shadow-[1px_1px_0px_#000]">
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
              SERVER CORE BREACHED!
            </h3>
            <p className="text-xs text-slate-300 font-sans max-w-sm mt-1">
              Your code errors triggered an outbreak in the server racks. Squash 100 points worth of bugs in 20 seconds to reassemble the OS!
            </p>
          </div>
          <button
            onClick={startGame}
            className="neo-btn bg-[#10B981] hover:bg-[#34D399] text-black font-black py-2.5 px-6 text-sm flex items-center gap-2 shadow-[3px_3px_0px_#000]"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>START BUG SMASHER</span>
          </button>
        </div>
      ) : gameState === 'won' ? (
        <div className="bg-[#10B981] border-2 border-black p-6 shadow-[4px_4px_0px_#000] text-black flex flex-col items-center justify-center gap-2 text-center min-h-[220px]">
          <Trophy className="w-10 h-10 text-black animate-bounce" />
          <h3 className="font-black text-lg uppercase tracking-wider">
            🏆 SERVER CLEANSED! ALL BUGS SQUASHED!
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
              You scored {score}/{TARGET_SCORE} pts before the servers melted down. Try again!
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
        <div className="grid grid-cols-3 gap-2.5 bg-[#0E0F1A] border-2 border-black p-3.5 shadow-[3px_3px_0px_#000]">
          {Array.from({ length: 9 }).map((_, index) => {
            const bug = activeHoles[index];
            const isHit = hitFeedback && hitFeedback.holeIndex === index;

            return (
              <div
                key={index}
                onClick={() => handleSmash(index)}
                className={`h-20 sm:h-24 border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col items-center justify-center relative cursor-crosshair transition-all active:scale-95 ${
                  bug
                    ? `${bug.color} hover:brightness-110`
                    : 'bg-[#181926] hover:bg-[#202234]'
                }`}
              >
                {/* Server Slot Label */}
                <span className="absolute top-1 left-1.5 text-[8px] opacity-40 font-mono font-bold">
                  CORE-0{index + 1}
                </span>

                {/* Bug Content */}
                {bug && (
                  <div className="flex flex-col items-center animate-in zoom-in-50 duration-150">
                    <bug.icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
                    <span className="text-[9px] font-black uppercase tracking-tight mt-0.5">
                      {bug.label}
                    </span>
                    <span className="text-[8px] font-bold opacity-80 font-mono">
                      +{bug.points}
                    </span>
                  </div>
                )}

                {/* Hit Feedback Floating Badge */}
                {isHit && (
                  <div className="absolute inset-0 bg-emerald-400 text-black border-2 border-black flex items-center justify-center font-black text-sm z-20 animate-out fade-out duration-300">
                    💥 {hitFeedback.text}!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

