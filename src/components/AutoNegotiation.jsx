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
  Gamepad2,
  Coins
} from 'lucide-react';

export function AutoNegotiation({ onNegotiationSuccess }) {
  const { actions } = useOS();
  const [state, dispatch] = useReducer(negotiationReducer, INITIAL_NEGOTIATION_STATE);
  const { stage, driverMood, askedFare, status, history } = state;

  const currentStageConfig = NEGOTIATION_STAGES[stage] || NEGOTIATION_STAGES[1];

  const handleSelectChoice = (choice) => {
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

  return (
    <div className="flex flex-col gap-3.5 text-xs font-mono">
      {/* Route & Arcade Boss HUD Header */}
      <div className="p-3 bg-[#12131F] border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FACC15] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-3xl shrink-0">
            🛺
          </div>
          <div>
            <div className="font-black text-white flex items-center gap-2 text-xs sm:text-sm">
              <span>MANJUNATH (AUTO BOSS)</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-rose-500 text-white font-black border border-black uppercase">
                6:30 PM RAIN
              </span>
            </div>
            <div className="text-[11px] text-sky-300 font-bold flex items-center gap-1 mt-0.5">
              <CloudRain className="w-3.5 h-3.5 text-sky-400" />
              <span>Silk Board → Indiranagar</span>
            </div>
          </div>
        </div>

        {/* Dynamic Boss HUD Meters */}
        <div className="flex items-center gap-3 text-right">
          {/* Driver Patience Meter */}
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-400 font-black uppercase">Driver Mood</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-16 h-3 bg-black border border-black p-0.5">
                <div
                  className={`h-full transition-all duration-300 ${
                    driverMood >= 75 ? 'bg-emerald-400' : driverMood >= 35 ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${driverMood}%` }}
                />
              </div>
              <span className="font-black text-xs text-white">
                {driverMood}%
              </span>
            </div>
          </div>

          {/* Asked Fare Box */}
          <div className="flex flex-col items-end border-l-2 border-black pl-3">
            <span className="text-[9px] text-slate-400 font-black uppercase">Fare Demand</span>
            <div className="bg-[#FACC15] text-black font-black text-base px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
              ₹{askedFare}
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling RPG Dialogue History */}
      <div className="bg-[#0E0F1A] border-2 border-black shadow-[2px_2px_0px_#000] p-3 flex flex-col gap-2 max-h-48 overflow-y-auto">
        {history.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[90%] p-2 border-2 border-black text-xs leading-relaxed shadow-[2px_2px_0px_#000] ${
              item.speaker === 'user'
                ? 'self-end bg-[#38BDF8] text-black font-bold'
                : 'self-start bg-[#FACC15] text-black font-bold'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-0.5 text-[9px] uppercase font-black tracking-wider text-black/75">
              <span>{item.speaker === 'user' ? 'YOU' : 'AUTO ANNA (MANJUNATH)'}</span>
              {item.kannadaGlossary && (
                <span className="bg-black text-white px-1 font-normal">
                  {item.kannadaGlossary}
                </span>
              )}
            </div>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Outcome States or Stage Choices */}
      {status === 'WON' ? (
        <div className="p-4 bg-[#10B981] border-2 border-black shadow-[4px_4px_0px_#000] text-black flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-black shrink-0" />
          <div>
            <div className="font-black text-sm uppercase">🏆 RIDE LOCKED IN! INDIRANAGAR NON-STOP!</div>
            <div className="text-xs font-bold mt-0.5">
              Settled at ₹{askedFare}. Auto Boss respected your local Bengaluru bargaining. Spring reassembling workspace...
            </div>
          </div>
        </div>
      ) : status === 'LOST' ? (
        <div className="p-4 bg-[#FF4365] text-white border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col gap-2.5">
          <div className="flex items-center gap-2 font-black text-sm">
            <AlertOctagon className="w-5 h-5 text-yellow-300 shrink-0" />
            <span>DRIVER SPED AWAY IN THE RAIN! (MOOD: 0%)</span>
          </div>
          <p className="text-xs font-bold text-white/90">
            Threatening with Ola/Uber won't work in Silk Board monsoon traffic!
          </p>
          <button
            onClick={handleRetry}
            className="neo-btn bg-black text-white hover:bg-slate-900 py-2 px-4 flex items-center justify-center gap-2 font-black text-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>HAIL ANOTHER AUTO (RETRY)</span>
          </button>
        </div>
      ) : (
        /* Active Dialogue Choices (3 per stage - Neo Arcade Action Buttons) */
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[10px] text-amber-300 font-black uppercase tracking-wider">
            <span>Stage {stage} of 4: Select Your Dialogue Action</span>
            <span className="bg-[#181926] px-1.5 py-0.5 border border-black">Target: Mood ≥ 80%</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {currentStageConfig.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleSelectChoice(choice)}
                className="neo-btn bg-[#1E2032] hover:bg-[#FACC15] text-white hover:text-black p-3 text-left transition-all flex flex-col gap-1 shadow-[2px_2px_0px_#000]"
              >
                <div className="font-black text-xs">
                  {choice.label}
                </div>
                <div className="text-[10px] font-medium opacity-80">
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
