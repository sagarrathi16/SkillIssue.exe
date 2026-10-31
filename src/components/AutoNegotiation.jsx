import React, { useReducer } from 'react';
import { useOS } from '../app/osStateMachine';
import { audioManager } from '../audio/AudioManager';
import { 
  negotiationReducer, 
  INITIAL_NEGOTIATION_STATE, 
  NEGOTIATION_STAGES 
} from '../logic/negotiationMachine';
import { 
  CloudRain, 
  CheckCircle2, 
  AlertOctagon, 
  RotateCcw, 
  Activity, 
  Navigation,
  Compass
} from 'lucide-react';

export function AutoNegotiation({ onNegotiationSuccess }) {
  const { actions } = useOS();
  const [state, dispatch] = useReducer(negotiationReducer, INITIAL_NEGOTIATION_STATE);
  const { stage, driverMood, askedFare, status, history } = state;

  const currentStageConfig = NEGOTIATION_STAGES[stage] || NEGOTIATION_STAGES[1];

  const handleSelectChoice = (choice) => {
    // Play auto horn procedural sfx on selection
    audioManager.playAutoHorn();

    dispatch({ type: 'SELECT_CHOICE', payload: choice });

    if (choice.effect.status === 'WON' || choice.effect.setMood >= 80) {
      audioManager.playVictoryChime();
      setTimeout(() => {
        if (onNegotiationSuccess) {
          onNegotiationSuccess();
        } else {
          actions.startRecovery(85, {
            reason: 'Won Auto Negotiation',
            fare: choice.effect.fare,
          });
        }
      }, 1400);
    } else if (choice.effect.status === 'LOST' || choice.effect.setMood === 0) {
      audioManager.playSfx('sigh');
    }
  };

  const handleRetry = () => {
    dispatch({ type: 'RETRY' });
  };

  const getMoodColor = (mood) => {
    if (mood >= 75) return 'text-emerald-400 bg-emerald-500';
    if (mood >= 35) return 'text-amber-400 bg-amber-500';
    return 'text-rose-400 bg-rose-500';
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-mono">
      {/* Route & HUD Header */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
            🛺
          </div>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-2">
              <span>Manjunath (Silk Board Auto Boss)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                6:30 PM Rain Surge
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-sky-400 font-medium">
                <CloudRain className="w-3.5 h-3.5" /> Silk Board → Indiranagar
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Telemetry Meters */}
        <div className="flex items-center gap-4 text-right">
          {/* Driver Mood */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase">Driver Mood</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-14 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getMoodColor(driverMood).split(' ')[1]}`}
                  style={{ width: `${driverMood}%` }}
                />
              </div>
              <span className={`font-bold ${getMoodColor(driverMood).split(' ')[0]}`}>
                {driverMood}%
              </span>
            </div>
          </div>

          {/* Asked Fare */}
          <div className="flex flex-col items-end border-l border-slate-800 pl-3">
            <span className="text-[10px] text-slate-500 uppercase">Fare Asked</span>
            <span className="text-xl font-extrabold text-amber-400">
              ₹{askedFare}
            </span>
          </div>
        </div>
      </div>

      {/* Scrolling Dialogue History */}
      <div className="bg-[#05070D] border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2.5 max-h-52 overflow-y-auto shadow-inner">
        {history.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[88%] p-2.5 rounded-xl text-xs leading-relaxed ${
              item.speaker === 'user'
                ? 'self-end bg-emerald-950/70 border border-emerald-500/40 text-emerald-200'
                : 'self-start bg-slate-900/90 border border-slate-700/80 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                {item.speaker === 'user' ? 'You' : 'Auto Driver (Manjunath)'}
              </span>
              {item.kannadaGlossary && (
                <span className="text-[9px] text-amber-300/80 font-normal italic">
                  [{item.kannadaGlossary}]
                </span>
              )}
            </div>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Outcome States or Stage Choices */}
      {status === 'WON' ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-pulse">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-sm">Ride Confirmed! Indiranagar Non-Stop!</div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              Settled at ₹{askedFare}. Auto Boss respected your authentic Bengaluru negotiation. Restoring workspace...
            </div>
          </div>
        </div>
      ) : status === 'LOST' ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-rose-300 font-bold">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
            <span>Driver sped away in the rain! Mood dropped to 0%.</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Threatening to book Uber or absurd lowballs won't work during 6:30 PM Silk Board monsoon traffic!
          </p>
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition cursor-pointer font-bold active:scale-95 shadow"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Hail Another Auto in the Rain (Retry)</span>
          </button>
        </div>
      ) : (
        /* Active Dialogue Choices (3 per stage) */
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Stage {stage} of 4: Choose Your Bargaining Response</span>
            <span className="text-amber-400/80">Goal: Mood ≥ 80%</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {currentStageConfig.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleSelectChoice(choice)}
                className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 text-left transition-all cursor-pointer active:scale-98 group flex flex-col gap-1 shadow-sm"
              >
                <div className="font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                  {choice.label}
                </div>
                <div className="text-[10px] text-slate-400">
                  {choice.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
