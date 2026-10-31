import React, { useState } from 'react';
import { useOS } from '../app/osStateMachine';
import { audioManager } from '../audio/AudioManager';
import { Navigation, DollarSign, CheckCircle2, AlertOctagon, RotateCcw, CloudRain } from 'lucide-react';

export function AutoNegotiation({ onNegotiationSuccess }) {
  const { actions } = useOS();

  const [currentFare, setCurrentFare] = useState(450);
  const [driverMood, setDriverMood] = useState('STUBBORN'); // 'STUBBORN' | 'ANGRY' | 'SOFTENED' | 'WON' | 'LOST'
  const [dialogueHistory, setDialogueHistory] = useState([
    {
      speaker: 'driver',
      text: "Indiranagar ah? Heavy monsoon rain outside. ₹450 flat cash, no meter. Won't go for less. Take it or walk!",
    },
  ]);

  const handleOptionSelect = (option) => {
    // 1. Play rickshaw horn sound
    audioManager.playAutoHorn();

    switch (option.id) {
      case 'METER_PLUS_50': {
        // WINNING CHOICE
        setCurrentFare(220);
        setDriverMood('WON');
        setDialogueHistory((prev) => [
          ...prev,
          { speaker: 'user', text: "Anna, meter mele 50 extra kodthini (Meter + ₹50)!" },
          {
            speaker: 'driver',
            text: "Sari baa macha! Meter mele 50 is fair. Hop in before the rain gets worse. Indiranagar non-stop!",
          },
        ]);
        audioManager.playVictoryChime();
        setTimeout(() => {
          if (onNegotiationSuccess) {
            onNegotiationSuccess();
          } else {
            actions.startRecovery(85, { note: 'Won Bengaluru Auto Negotiation Boss Fight' });
          }
        }, 1200);
        break;
      }

      case 'JUST_METER': {
        setCurrentFare(500);
        setDriverMood('ANGRY');
        setDialogueHistory((prev) => [
          ...prev,
          { speaker: 'user', text: "Anna, meter haaki please." },
          {
            speaker: 'driver',
            text: "Meter? Naanu developer alla, auto driver! Traffic nodidya? Now it's ₹500. Take it or book helicopter!",
          },
        ]);
        audioManager.playSfx('warning');
        break;
      }

      case 'OLA_COMPARE': {
        setDriverMood('LOST');
        setDialogueHistory((prev) => [
          ...prev,
          { speaker: 'user', text: "Ola app is showing ₹180 only." },
          {
            speaker: 'driver',
            text: "Haagaadre Ola-llene hogu! (Go in Ola then!). 45 minutes they will search driver. Don't waste my time!",
          },
        ]);
        audioManager.playSfx('sigh');
        break;
      }

      case 'CODEDAY_PITCH': {
        setCurrentFare(320);
        setDriverMood('SOFTENED');
        setDialogueHistory((prev) => [
          ...prev,
          { speaker: 'user', text: "Anna, please help! I have my CodeDay hackathon pitch in 20 minutes." },
          {
            speaker: 'driver',
            text: "CodeDay hackathon-na? You build apps? Sari, ₹320 final. But tell me: meter mele 50 extra kodthiya?",
          },
        ]);
        break;
      }

      default:
        break;
    }
  };

  const handleRetry = () => {
    setCurrentFare(450);
    setDriverMood('STUBBORN');
    setDialogueHistory([
      {
        speaker: 'driver',
        text: "Indiranagar ah? Heavy monsoon rain outside. ₹450 flat cash, no meter. Won't go for less. Take it or walk!",
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-mono">
      {/* Header Info */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🛺</span>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-1.5">
              <span>Manjunath (Bengaluru Auto Boss)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                Rain Surge 2.5x
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-sky-400">
                <CloudRain className="w-3 h-3" /> Pouring Rain
              </span>
              <span>•</span>
              <span>Destination: Indiranagar 100ft Rd</span>
            </div>
          </div>
        </div>

        {/* Current Fare Meter */}
        <div className="text-right">
          <div className="text-[10px] text-slate-500">OFFERED FARE</div>
          <div className="text-xl font-extrabold text-amber-400">
            ₹{currentFare}
          </div>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="bg-[#05070D] border border-slate-800 rounded-xl p-3 flex flex-col gap-2.5 max-h-56 overflow-y-auto">
        {dialogueHistory.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed ${
              item.speaker === 'user'
                ? 'self-end bg-emerald-950/70 border border-emerald-500/40 text-emerald-200'
                : 'self-start bg-slate-900 border border-slate-700/80 text-slate-200'
            }`}
          >
            <span className="text-[9px] uppercase font-bold text-slate-400 mb-0.5">
              {item.speaker === 'user' ? 'You' : 'Auto Driver'}
            </span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Outcome / Dialogue Options */}
      {driverMood === 'WON' ? (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 flex items-center gap-2.5 animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold">Deal Struck! Indiranagar Ride Confirmed!</div>
            <div className="text-[11px] text-slate-300">
              Auto boss respected your Bengaluru bargaining skills. Restoring workspace...
            </div>
          </div>
        </div>
      ) : driverMood === 'LOST' ? (
        <div className="flex flex-col gap-2">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Driver drove away angrily in the rain!</span>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Another Auto Driver</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Choose your negotiation strategy:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Winning Option */}
            <button
              onClick={() => handleOptionSelect({ id: 'METER_PLUS_50' })}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-200 transition-all text-left cursor-pointer active:scale-95 group"
            >
              <div className="font-bold text-amber-300 group-hover:text-emerald-300">
                "Anna, meter mele 50 extra kodthini"
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                The golden Bengaluru auto negotiation formula.
              </div>
            </button>

            {/* Stubborn Meter Option */}
            <button
              onClick={() => handleOptionSelect({ id: 'JUST_METER' })}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-200 hover:text-rose-200 transition-all text-left cursor-pointer active:scale-95"
            >
              <div className="font-bold text-slate-300">
                "Anna, meter haaki please"
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                High risk: Will trigger an immediate fare hike!
              </div>
            </button>

            {/* CodeDay Pitch Option */}
            <button
              onClick={() => handleOptionSelect({ id: 'CODEDAY_PITCH' })}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-sky-950/60 border border-slate-700 hover:border-sky-500/50 text-slate-200 hover:text-sky-200 transition-all text-left cursor-pointer active:scale-95"
            >
              <div className="font-bold text-slate-300">
                "Anna, I'm late for CodeDay pitch!"
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Appeals to driver's respect for Bengaluru techies.
              </div>
            </button>

            {/* Ola Comparison Option */}
            <button
              onClick={() => handleOptionSelect({ id: 'OLA_COMPARE' })}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-200 hover:text-rose-200 transition-all text-left cursor-pointer active:scale-95"
            >
              <div className="font-bold text-slate-300">
                "Ola is showing ₹180"
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Dangerous: May provoke driver to drive away.
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
