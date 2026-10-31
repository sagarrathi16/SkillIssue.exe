/**
 * Late-Night Surge Pricing Driver Boss Negotiation State Machine
 * Route: High-Traffic Tech Hub to Downtown at 6:30 PM in pouring rain.
 * Deterministic, branching, universally relatable developer humor.
 */

export const INITIAL_NEGOTIATION_STATE = {
  stage: 1,
  driverMood: 40, // 0 to 100
  askedFare: 450, // Starts at ₹450
  status: 'IN_PROGRESS', // 'IN_PROGRESS' | 'WON' | 'LOST'
  history: [
    {
      speaker: 'driver',
      text: "Late-night monsoon surge pricing! Heavy rain outside, zero cabs available. ₹450 fixed cash, no meter. Take it or get drenched!",
    },
  ],
};

export const NEGOTIATION_STAGES = {
  1: {
    prompt: "Driver refuses regular meter and demands ₹450 surge pricing in the rain.",
    choices: [
      {
        id: 'STAGE1_METER_LEGAL',
        label: '"Boss, please turn on the meter. That is the official regulation."',
        subtitle: 'Citing transport regulations to a surge-pricing driver...',
        effect: {
          moodDelta: -15,
          fare: 500,
          nextStage: 2,
          driverReply: "Regulations? Have you seen the flood outside? Now it's ₹500 fixed. Take it or hire a helicopter!",
        },
      },
      {
        id: 'STAGE1_UBER_THREAT',
        label: '"Wait, let me compare prices on Uber and ride apps first."',
        subtitle: 'Threatening with ride-hailing aggregators.',
        effect: {
          moodDelta: -40,
          setMood: 0,
          status: 'LOST',
          driverReply: "Go ahead, open your apps! See if any driver accepts in this rain! They will search for 45 minutes and cancel. Don't waste my time!",
        },
      },
      {
        id: 'STAGE1_METER_PLUS_50',
        label: '"Boss, I know it is peak rush hour. I will pay meter plus ₹50 extra tip."',
        subtitle: 'The respectful middle-ground negotiation.',
        effect: {
          moodDelta: +25,
          fare: 350,
          nextStage: 2,
          driverReply: "Meter plus ₹50? But the main avenue is completely flooded. Make it ₹320 flat, then we have a deal.",
        },
      },
    ],
  },

  2: {
    prompt: "Driver complains about engine waterlogging risk on the flooded highway.",
    choices: [
      {
        id: 'STAGE2_ONE_AND_HALF',
        label: '"I will pay 1.5x night rate (₹260) if we take the back alley shortcut."',
        subtitle: 'Proposing standard 1.5x night rate + smart detour.',
        effect: {
          moodDelta: +20,
          fare: 280,
          nextStage: 3,
          driverReply: "The back alley bypass? Clever idea. But that road has huge potholes. Make it ₹280 cash?",
        },
      },
      {
        id: 'STAGE2_MAPS_ARGUMENT',
        label: '"Why extra? Google Maps says it is only a 20-minute drive!"',
        subtitle: 'Arguing with GPS navigation estimates.',
        effect: {
          moodDelta: -20,
          fare: 400,
          nextStage: 4,
          driverReply: "Google Maps runs on satellites, my engine runs on expensive petrol and tears! ₹400 final!",
        },
      },
      {
        id: 'STAGE2_BIKE_TAXI_THREAT',
        label: '"If you refuse, I will order a two-wheeler bike taxi in the rain."',
        subtitle: 'Threatening to take a motorcycle in monsoon weather.',
        effect: {
          moodDelta: -40,
          setMood: 0,
          status: 'LOST',
          driverReply: "A motorcycle in this hurricane?! The hospital emergency bill will be ₹50,000! Forget it!",
        },
      },
    ],
  },

  3: {
    prompt: "Climax: Thunder rumbling. Driver is deciding whether to call it a night.",
    choices: [
      {
        id: 'STAGE3_EXACT_CASH_TECH',
        label: '"Boss, ₹240 exact cash in hand right now. Help me get home to finish my project!"',
        subtitle: 'Immediate cash payment + relatable developer appeal.',
        effect: {
          moodDelta: +25,
          setMood: 90,
          fare: 240,
          status: 'WON',
          driverReply: "Exact cash? No 'server down' mobile payment drama? And you need to finish your coding project? Hop in, let's get you home dry!",
        },
      },
      {
        id: 'STAGE3_DOMLUR_ROUTE',
        label: '"Boss, meter plus ₹40 extra tip and take the elevated flyover route."',
        subtitle: 'Fast elevated corridor bypass.',
        effect: {
          moodDelta: +20,
          setMood: 85,
          fare: 230,
          status: 'WON',
          driverReply: "Elevated flyover route? Great idea! ₹230 is a fair deal. Get in before the traffic signal turns red!",
        },
      },
      {
        id: 'STAGE3_LOWBALL',
        label: '"₹140 take it or leave it."',
        subtitle: 'Absurd lowball in prime monsoon surge.',
        effect: {
          moodDelta: -40,
          setMood: 0,
          status: 'LOST',
          driverReply: "₹140?! You cannot even buy a replacement tire for ₹140! Walk home in the flood!",
        },
      },
    ],
  },

  4: {
    prompt: "Driver sees you shivering under the street lamp after the GPS argument.",
    choices: [
      {
        id: 'STAGE4_KANNADIGA_TECH',
        label: '"Boss, help out a tired developer. ₹250 cash and I will navigate."',
        subtitle: 'Humble respectful appeal.',
        effect: {
          moodDelta: +35,
          setMood: 85,
          fare: 250,
          status: 'WON',
          driverReply: "Alright, sit inside, don't get drenched. ₹250 agreed. Let's roll!",
        },
      },
      {
        id: 'STAGE4_RATING_PROMISE',
        label: '"I promise to give you a 5-star rating on the ride app!"',
        subtitle: 'Promising app ratings to an independent driver.',
        effect: {
          moodDelta: -40,
          setMood: 0,
          status: 'LOST',
          driverReply: "I do not even use those corporate apps! What will I do with digital stars? Go away!",
        },
      },
      {
        id: 'STAGE4_MIDDLE_FAIR',
        label: '"Boss, ₹220 direct cash, I will not cancel on you."',
        subtitle: 'Solid fair price.',
        effect: {
          moodDelta: +30,
          setMood: 82,
          fare: 220,
          status: 'WON',
          driverReply: "Fine, get in. A little extra is fair for a hot cup of tea in this downpour. Let's go!",
        },
      },
    ],
  },
};

/**
 * Reducer function for deterministic auto negotiation
 */
export function negotiationReducer(state, action) {
  switch (action.type) {
    case 'SELECT_CHOICE': {
      const choice = action.payload;
      const effect = choice.effect;

      let nextMood = state.driverMood + (effect.moodDelta || 0);
      if (effect.setMood !== undefined) {
        nextMood = effect.setMood;
      }
      nextMood = Math.max(0, Math.min(100, nextMood));

      const nextFare = effect.fare !== undefined ? effect.fare : state.askedFare;
      const nextStatus = effect.status || (nextMood >= 80 ? 'WON' : nextMood <= 0 ? 'LOST' : 'IN_PROGRESS');
      const nextStage = effect.nextStage || state.stage;

      const userEntry = {
        speaker: 'user',
        text: choice.label,
      };

      const driverEntry = {
        speaker: 'driver',
        text: effect.driverReply,
        kannadaGlossary: effect.kannadaGlossary,
      };

      return {
        ...state,
        stage: nextStage,
        driverMood: nextMood,
        askedFare: nextFare,
        status: nextStatus,
        history: [...state.history, userEntry, driverEntry],
      };
    }

    case 'RETRY': {
      return {
        ...INITIAL_NEGOTIATION_STATE,
        history: [
          {
            speaker: 'driver',
            text: "Another driver pulls up in the rain: 'Late night surge? ₹450 flat, meter will not go in this gridlock!'",
          },
        ],
      };
    }

    default:
      return state;
  }
}
