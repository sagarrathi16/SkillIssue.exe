import React, { useState, useRef, useEffect } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { audioManager } from '../audio/AudioManager';
import { BugSmasherGame } from './games/BugSmasherGame';
import { DareRoulette } from './games/DareRoulette';
import { 
  Sparkles, 
  ShieldAlert, 
  Crosshair,
  Dices,
  Skull,
  Gamepad2
} from 'lucide-react';

export function RecoveryModal() {
  const { state, actions } = useOS();
  const { mood, trust, ignoredWarnings, isCollapsed } = state;

  const [activeTab, setActiveTab] = useState('arcade_game'); // 'arcade_game' | 'dare_roulette'
  const [typedApology, setTypedApology] = useState('');
  const [apologyError, setApologyError] = useState('');
  
  // Voice Apology State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0); // 0 to 100
  const [micError, setMicError] = useState('');

  const audioStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const speechDurationRef = useRef(0);

  // Modal is visible when in MENTAL_BREAKDOWN or BENGALURU_BOSS_FIGHT
  const isVisible = isCollapsed || mood === OSMood.MENTAL_BREAKDOWN || mood === OSMood.BENGALURU_BOSS_FIGHT;

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (analyserRef.current?.ctx) {
      try {
        analyserRef.current.ctx.close();
      } catch (e) {}
      analyserRef.current = null;
    }
  };

  // Cleanup media tracks on unmount
  useEffect(() => {
    return () => {
      stopVoiceRecording();
    };
  }, []);

  // =========================================================================
  // VOICE APOLOGY (Web Audio API AnalyserNode RMS Detection)
  // =========================================================================

  const startVoiceRecording = async () => {
    setMicError('');
    setVoiceProgress(0);
    speechDurationRef.current = 0;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtxClass();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = { ctx, analyser };

      setIsRecording(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);
      let lastTimestamp = performance.now();

      const checkAudio = (now) => {
        const delta = (now - lastTimestamp) / 1000;
        lastTimestamp = now;

        analyser.getFloatTimeDomainData(dataArray);

        // Calculate Root Mean Square (RMS) volume
        let sumSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
          sumSquares += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sumSquares / bufferLength);

        // Volume threshold: user is speaking above ambient noise (~0.05 - 0.1)
        if (rms > 0.05) {
          speechDurationRef.current += delta;
        }

        // Target: 1.5 seconds of sustained speech
        const progress = Math.min(100, (speechDurationRef.current / 1.5) * 100);
        setVoiceProgress(progress);

        if (progress >= 100) {
          // Success! Sincere spoken apology verified
          stopVoiceRecording();
          audioManager.playVictoryChime();
          actions.attemptApology('MIC', 'Voice apology verified via Web Audio API RMS', true, 45);
          return;
        }

        animationFrameRef.current = requestAnimationFrame(checkAudio);
      };

      animationFrameRef.current = requestAnimationFrame(checkAudio);
    } catch (err) {
      stopVoiceRecording();
      setMicError('Microphone permission denied or unavailable. Please use the Typed Apology below!');
    }
  };

  const handleVoiceButtonUp = () => {
    if (voiceProgress < 100) {
      stopVoiceRecording();
      setVoiceProgress(0);
      setMicError('Keep holding and speak sincerely for 1.5 seconds!');
    }
  };

  // =========================================================================
  // TYPED APOLOGY VALIDATION
  // =========================================================================

  const handleTypedSubmit = (e) => {
    e.preventDefault();
    setApologyError('');

    const lower = typedApology.toLowerCase().trim();

    // Check minimum character count
    if (lower.length < 15) {
      setApologyError('Too brief! A sincere apology requires at least 15 characters.');
      actions.attemptApology('TEXT', typedApology, false);
      audioManager.playSfx('sigh');
      return;
    }

    // Required keywords
    const hasKeyword = ['sorry', 'apologize', 'anna', 'mistake', 'forgive', 'ayyo'].some((word) =>
      lower.includes(word)
    );

    if (!hasKeyword) {
      setApologyError('Where is the sincerity? Must include "sorry", "apologize", "anna", or "mistake"!');
      actions.attemptApology('TEXT', typedApology, false);
      audioManager.playSfx('sigh');
      return;
    }

    // Escalation rule: If user ignored 2 or more warnings
    if (ignoredWarnings >= 2 && lower.length < 35) {
      setApologyError(
        `You dismissed ${ignoredWarnings} compiler warnings prior to this! Put some real effort into this apology (at least 35 characters required).`
      );
      actions.attemptApology('TEXT', typedApology, false);
      audioManager.playSfx('sigh');
      return;
    }

    // Success!
    audioManager.playVictoryChime();
    actions.attemptApology('TEXT', typedApology, true, 40);
    setTypedApology('');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl bg-[#181926] border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col font-mono text-xs">
        {/* Arcade Modal Header */}
        <div className="bg-[#FF4365] border-b-2 border-black p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-black text-[#FF4365] border-2 border-black shadow-[2px_2px_0px_#000]">
              <Skull className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wider flex items-center gap-2">
                <span>SYSTEM COLLAPSE RECOVERY</span>
                <span className="text-[10px] px-2 py-0.5 bg-black text-[#FACC15] font-black border border-black">
                  HP: {trust}%
                </span>
              </h2>
              <p className="text-[11px] font-bold text-black/80">
                UI chrome collapsed into physics pile! Win back trust to reassemble.
              </p>
            </div>
          </div>
        </div>

        {/* Neo Tab Switcher */}
        <div className="flex border-b-2 border-black bg-[#12131F] p-1 gap-1">
          <button
            onClick={() => setActiveTab('arcade_game')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 font-black border-2 border-black transition cursor-pointer ${
              activeTab === 'arcade_game'
                ? 'bg-[#10B981] text-black shadow-[2px_2px_0px_#000]'
                : 'bg-[#1E2032] text-slate-300 hover:text-white'
            }`}
          >
            <Crosshair className="w-4 h-4" />
            <span>Option 1: Bug Smasher Arcade (Game)</span>
          </button>

          <button
            onClick={() => setActiveTab('dare_roulette')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 font-black border-2 border-black transition cursor-pointer ${
              activeTab === 'dare_roulette'
                ? 'bg-[#FACC15] text-black shadow-[2px_2px_0px_#000]'
                : 'bg-[#1E2032] text-slate-300 hover:text-white'
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>Option 2: Tech Lead Dare (Dare)</span>
          </button>
        </div>

        {/* Tab 1: Bug Smasher Arcade Game */}
        {activeTab === 'arcade_game' ? (
          <div className="p-4 sm:p-5">
            <BugSmasherGame />
          </div>
        ) : (
          /* Tab 2: Tech Lead Dare Roulette */
          <div className="p-4 sm:p-5">
            <DareRoulette />
          </div>
        )}
      </div>
    </div>
  );
}
