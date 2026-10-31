import React, { useState, useRef, useEffect } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { audioManager } from '../audio/AudioManager';
import { AutoNegotiation } from './AutoNegotiation';
import { 
  HeartHandshake, 
  Mic, 
  Keyboard, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  Volume2, 
  CheckCircle2, 
  X,
  Compass
} from 'lucide-react';

export function RecoveryModal() {
  const { state, actions } = useOS();
  const { mood, trust, ignoredWarnings, isCollapsed } = state;

  const [activeTab, setActiveTab] = useState('apology'); // 'apology' | 'auto_captcha'
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

  // Cleanup media tracks on unmount
  useEffect(() => {
    return () => {
      stopVoiceRecording();
    };
  }, []);

  if (!isVisible) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl bg-[#090D16] border border-slate-700/90 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col font-mono text-xs">
        {/* Modal Header */}
        <div className="bg-[#05070D] border-b border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>SYSTEM COLLAPSE RECOVERY</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">
                  Trust: {trust}%
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Workspace chrome detached. Repair your relationship with Namma OS to restore.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-[#070A12]">
          <button
            onClick={() => setActiveTab('apology')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-bold transition cursor-pointer ${
              activeTab === 'apology'
                ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Option 1: Apologize to OS</span>
          </button>

          <button
            onClick={() => setActiveTab('auto_captcha')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-bold transition cursor-pointer ${
              activeTab === 'auto_captcha'
                ? 'bg-slate-900 text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-base">🛺</span>
            <span>Option 2: Bengaluru Boss CAPTCHA</span>
          </button>
        </div>

        {/* Tab 1: Apology Subsystem */}
        {activeTab === 'apology' ? (
          <div className="p-5 flex flex-col gap-4">
            {/* Section A: Spoken Voice Apology */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>A. Speak Your Apology (Web Audio API)</span>
                </span>
                <span className="text-[10px] text-slate-500">Hold for 1.5s above volume threshold</span>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed">
                Hold the button below and speak out loud (e.g. <em>"Sorry anna, I promise to check my brackets next time"</em>). Microphone audio is processed entirely in-browser and never recorded.
              </div>

              {/* Live RMS Progress Bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-75"
                  style={{ width: `${voiceProgress}%` }}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onMouseDown={startVoiceRecording}
                  onMouseUp={handleVoiceButtonUp}
                  onTouchStart={startVoiceRecording}
                  onTouchEnd={handleVoiceButtonUp}
                  className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse shadow-rose-950'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{isRecording ? 'Listening... Keep Speaking!' : 'Hold & Speak Apology'}</span>
                </button>
              </div>

              {micError && (
                <div className="text-[11px] text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                  {micError}
                </div>
              )}
            </div>

            {/* Section B: Typed Apology Fallback */}
            <form onSubmit={handleTypedSubmit} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                  <Keyboard className="w-4 h-4 text-sky-400" />
                  <span>B. Type Your Apology (Zero Permissions)</span>
                </span>
                <span className="text-[10px] text-slate-500">
                  {ignoredWarnings >= 2 ? 'Requires ≥ 35 chars' : 'Requires ≥ 15 chars'}
                </span>
              </div>

              <textarea
                value={typedApology}
                onChange={(e) => setTypedApology(e.target.value)}
                placeholder='e.g. "Sorry anna, I made a mistake with the syntax. Forgive me!"'
                rows={2}
                className="w-full bg-[#05070D] border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 resize-none font-mono text-xs"
              />

              {apologyError && (
                <div className="text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                  {apologyError}
                </div>
              )}

              <button
                type="submit"
                className="py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all active:scale-95 cursor-pointer shadow-md shadow-sky-950/60 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Written Apology</span>
              </button>
            </form>
          </div>
        ) : (
          /* Tab 2: Bengaluru Boss CAPTCHA */
          <div className="p-5">
            <AutoNegotiation />
          </div>
        )}
      </div>
    </div>
  );
}

