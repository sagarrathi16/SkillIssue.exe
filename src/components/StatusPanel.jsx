import React from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { 
  Activity, 
  CloudRain, 
  MapPin, 
  ShieldAlert, 
  Zap, 
  Compass, 
  AlertCircle,
  TrendingDown
} from 'lucide-react';

export function StatusPanel() {
  const { state } = useOS();
  const { trust, mood, mistakeCount, ignoredWarnings, rapidClickEvents } = state;

  const isAnnoyed = mood === OSMood.SLIGHTLY_ANNOYED;
  const isBetrayal = mood === OSMood.PERSONAL_BETRAYAL;

  const getTrustColor = (val) => {
    if (val > 65) return 'text-emerald-400 bg-emerald-500';
    if (val > 34) return 'text-amber-400 bg-amber-500';
    return 'text-rose-400 bg-rose-500';
  };

  return (
    <aside
      className={`w-72 lg:w-80 bg-[#070A12] border-l flex flex-col gap-3 p-3 text-xs font-mono select-none overflow-y-auto shrink-0 transition-all duration-300 ${
        isBetrayal
          ? 'border-rose-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
          : isAnnoyed
          ? 'border-amber-500/40'
          : 'border-slate-800'
      }`}
    >
      {/* 1. Trust Telemetry Card */}
      <div
        data-physics-id="status-trust-card"
        className={`p-3 rounded-xl border bg-slate-900/70 transition-transform ${
          isBetrayal
            ? 'border-rose-500/50 mood-betrayal-tilted-left'
            : isAnnoyed
            ? 'border-amber-500/40'
            : 'border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="font-bold tracking-wider text-[11px] uppercase">
            Relationship Health
          </span>
          <Activity className="w-4 h-4 text-slate-500" />
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span className={`text-3xl font-extrabold ${getTrustColor(trust).split(' ')[0]}`}>
            {trust}%
          </span>
          <span className="text-[10px] text-slate-500">
            {trust > 80 ? 'Harmonious' : trust > 50 ? 'Strained' : 'Critical'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getTrustColor(trust).split(' ')[1]}`}
            style={{ width: `${Math.max(0, Math.min(100, trust))}%` }}
          />
        </div>
      </div>

      {/* 2. OS Mood Volatility Card */}
      <div
        data-physics-id="status-mood-card"
        className={`p-3 rounded-xl border bg-slate-900/70 transition-transform ${
          isBetrayal
            ? 'border-rose-500/50 mood-betrayal-tilted-right anim-personal-betrayal'
            : isAnnoyed
            ? 'border-amber-500/40 anim-slightly-annoyed'
            : 'border-slate-800'
        }`}
      >
        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
          Emotional Volatility
        </div>
        <div
          className={`text-sm font-bold truncate ${
            isBetrayal
              ? 'text-rose-400'
              : isAnnoyed
              ? 'text-amber-400'
              : mood === OSMood.CALM
              ? 'text-emerald-400'
              : 'text-purple-400'
          }`}
        >
          {mood.replace(/_/g, ' ')}
        </div>
        <div className="text-[10px] text-slate-400 mt-1">
          {isBetrayal
            ? '⚠ Off-axis UI destabilization detected'
            : isAnnoyed
            ? 'Simmering passive-aggressive tension'
            : 'Operational stability at normal baseline'}
        </div>
      </div>

      {/* 3. Infraction Counters Card */}
      <div
        data-physics-id="status-infractions-card"
        className={`p-3 rounded-xl border bg-slate-900/70 grid grid-cols-3 gap-2 text-center transition-transform ${
          isBetrayal ? 'border-rose-500/40 mood-betrayal-tilted-left' : 'border-slate-800'
        }`}
      >
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500">Errors</span>
          <span className="text-base font-bold text-slate-200">{mistakeCount}</span>
        </div>
        <div className="flex flex-col border-x border-slate-800">
          <span className="text-[10px] text-slate-500">Ignored</span>
          <span className="text-base font-bold text-rose-400">{ignoredWarnings}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500">Spam</span>
          <span className="text-base font-bold text-blue-400">{rapidClickEvents}</span>
        </div>
      </div>

      {/* 4. Bengaluru City Real-Time Telemetry */}
      <div
        data-physics-id="status-city-card"
        className={`p-3 rounded-xl border bg-slate-900/70 flex flex-col gap-2 transition-transform ${
          isBetrayal ? 'border-rose-500/40 mood-betrayal-tilted-right' : 'border-slate-800'
        }`}
      >
        <div className="flex items-center gap-1.5 text-slate-400 border-b border-slate-800 pb-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span className="font-bold tracking-wider text-[10px] uppercase">
            Bengaluru Telemetry
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <CloudRain className="w-3.5 h-3.5 text-sky-400" /> Weather:
          </span>
          <span className="text-sky-300 font-semibold">Indiranagar Rain</span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Silk Board Flyover:</span>
          <span className="text-amber-400 font-semibold">145 min gridlock</span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Auto Meter Compliance:</span>
          <span className="text-rose-400 font-semibold">0% (Flat ₹450)</span>
        </div>
      </div>
    </aside>
  );
}

