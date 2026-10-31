import React from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { 
  Activity, 
  CloudRain, 
  MapPin, 
  ShieldAlert, 
  Zap, 
  AlertTriangle,
  Flame,
  Gamepad2,
  Gauge
} from 'lucide-react';

export function StatusPanel() {
  const { state } = useOS();
  const { trust, mood, mistakeCount, ignoredWarnings, rapidClickEvents } = state;

  const isAnnoyed = mood === OSMood.SLIGHTLY_ANNOYED;
  const isBetrayal = mood === OSMood.PERSONAL_BETRAYAL;

  const getHearts = (val) => {
    const count = Math.ceil(val / 20);
    return Array.from({ length: 5 }, (_, i) => i < count);
  };

  const getMoodLevel = (currentMood) => {
    switch (currentMood) {
      case OSMood.CALM:
        return { label: 'LVL 1: CHILL 😎', color: 'bg-emerald-400 text-black', desc: 'Meter is on. Code carefully.' };
      case OSMood.SLIGHTLY_ANNOYED:
        return { label: 'LVL 2: SUSPICIOUS 🤨', color: 'bg-amber-400 text-black', desc: 'Auto Anna is giving you side-eye.' };
      case OSMood.PERSONAL_BETRAYAL:
        return { label: 'LVL 3: BETRAYAL 😡', color: 'bg-orange-500 text-black', desc: 'Threatening to cancel on Ola.' };
      case OSMood.MENTAL_BREAKDOWN:
        return { label: 'LVL 4: MELTDOWN 🤬', color: 'bg-rose-500 text-white animate-pulse', desc: 'Engine smoking! UI chrome detaching!' };
      case OSMood.BENGALURU_BOSS_FIGHT:
        return { label: 'BOSS: INDIRANAGAR 💀', color: 'bg-purple-500 text-white animate-bounce', desc: '₹450 cash only! Silk Board flooded!' };
      case OSMood.RECOVERY:
        return { label: 'RESTORING... 🛠️', color: 'bg-cyan-400 text-black', desc: 'Rebuilding UI with spring physics.' };
      default:
        return { label: 'NORMAL', color: 'bg-slate-700 text-white', desc: '' };
    }
  };

  const levelInfo = getMoodLevel(mood);

  return (
    <aside
      className={`w-72 lg:w-80 bg-[#12131F] border-l-2 border-black flex flex-col gap-3 p-3 text-xs font-mono select-none overflow-y-auto shrink-0 transition-colors duration-300 ${
        isBetrayal
          ? 'bg-[#261017]'
          : isAnnoyed
          ? 'bg-[#191624]'
          : 'bg-[#12131F]'
      }`}
    >
      {/* 1. Arcade Health & Hearts HUD */}
      <div
        data-physics-id="status-trust-card"
        className={`p-3 bg-[#1A1C2C] border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col gap-2 transition-transform ${
          isBetrayal
            ? 'mood-betrayal-tilted-left border-rose-500 shadow-[3px_3px_0px_#F43F5E]'
            : isAnnoyed
            ? 'anim-slightly-annoyed'
            : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="bg-[#FACC15] text-black font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider">
            OS HEALTH (HP)
          </span>
          <div className="flex items-center gap-0.5">
            {getHearts(trust).map((isFilled, i) => (
              <span key={i} className="text-xs">
                {isFilled ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <span className={`text-3xl font-black ${trust <= 34 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
            {trust}%
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            {trust >= 80 ? 'STATUS: CHILL' : trust >= 35 ? 'STATUS: SHAKY' : 'STATUS: COLLAPSE'}
          </span>
        </div>

        {/* Mario-style chunky segmented HP bar */}
        <div className="w-full h-3 bg-black border-2 border-black p-0.5 flex gap-0.5">
          {Array.from({ length: 10 }).map((_, idx) => {
            const filled = (idx + 1) * 10 <= trust;
            const barColor = trust > 60 ? 'bg-emerald-400' : trust > 30 ? 'bg-amber-400' : 'bg-rose-500';
            return (
              <div
                key={idx}
                className={`flex-1 h-full transition-all duration-300 ${
                  filled ? barColor : 'bg-[#2A2B3D]'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 2. OS Mood Volatility Card */}
      <div
        data-physics-id="status-mood-card"
        className={`p-3 bg-[#1A1C2C] border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col gap-2 transition-transform ${
          isBetrayal
            ? 'mood-betrayal-tilted-right anim-personal-betrayal border-rose-500 shadow-[3px_3px_0px_#F43F5E]'
            : ''
        }`}
      >
        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
          <span>THREAT LEVEL</span>
          <Gamepad2 className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className={`p-1.5 border-2 border-black font-black text-center text-xs shadow-[2px_2px_0px_#000] uppercase ${levelInfo.color}`}>
          {levelInfo.label}
        </div>

        <p className="text-[11px] text-amber-200/90 font-medium">
          {levelInfo.desc}
        </p>
      </div>

      {/* 3. Infraction & Combo Counter */}
      <div
        data-physics-id="status-infractions-card"
        className={`p-3 bg-[#1A1C2C] border-2 border-black shadow-[3px_3px_0px_#000] grid grid-cols-3 gap-2 text-center transition-transform ${
          isBetrayal ? 'mood-betrayal-tilted-left' : ''
        }`}
      >
        <div className="flex flex-col bg-[#12131F] border border-black p-1 shadow-[1px_1px_0px_#000]">
          <span className="text-[9px] text-slate-400 font-bold uppercase">Errors</span>
          <span className="text-base font-black text-amber-400">{mistakeCount}</span>
        </div>
        <div className="flex flex-col bg-[#12131F] border border-black p-1 shadow-[1px_1px_0px_#000]">
          <span className="text-[9px] text-slate-400 font-bold uppercase">Ignored</span>
          <span className="text-base font-black text-rose-400">{ignoredWarnings}</span>
        </div>
        <div className="flex flex-col bg-[#12131F] border border-black p-1 shadow-[1px_1px_0px_#000]">
          <span className="text-[9px] text-slate-400 font-bold uppercase">Spam</span>
          <span className="text-base font-black text-cyan-400">{rapidClickEvents}</span>
        </div>
      </div>

      {/* 4. Production Server & Developer Vibe Telemetry */}
      <div
        data-physics-id="status-city-card"
        className={`p-3 bg-[#1A1C2C] border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col gap-2 transition-transform ${
          isBetrayal ? 'mood-betrayal-tilted-right' : ''
        }`}
      >
        <div className="flex items-center gap-1.5 pb-1 border-b-2 border-black text-[#FACC15] font-black text-[10px] uppercase">
          <Zap className="w-3.5 h-3.5" />
          <span>PRODUCTION TELEMETRY</span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Dev Emotion:</span>
          <span className="text-sky-300 font-black">{trust >= 70 ? 'Caffeinated' : trust >= 35 ? 'Sweating' : 'Panicking'}</span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Deploy Pipeline:</span>
          <span className="text-amber-400 font-black">145 min delay</span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Tech Lead Patience:</span>
          <span className={`font-black ${trust <= 34 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
            {trust}% Remaining
          </span>
        </div>
      </div>
    </aside>
  );
}
