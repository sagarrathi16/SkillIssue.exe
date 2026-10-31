/**
 * Bengaluru Auto-Rickshaw Boss Negotiation State Machine
 * Route: Silk Board to Indiranagar at 6:30 PM in pouring rain.
 * Deterministic, branching, culturally authentic.
 */

export const INITIAL_NEGOTIATION_STATE = {
  stage: 1,
  driverMood: 40, // 0 to 100
  askedFare: 450, // Starts at ₹450
  status: 'IN_PROGRESS', // 'IN_PROGRESS' | 'WON' | 'LOST'
  history: [
    {
      speaker: 'driver',
      text: "Silk Board inda Indiranagar ah? At 6:30 PM in this pouring rain?! ₹450 fixed, no meter. Take it or get drenched, boss!",
      kannadaGlossary: "Silk Board inda = From Silk Board",
    },
  ],
};

export const NEGOTIATION_STAGES = {
  1: {
    prompt: "Driver is refusing meter and demands ₹450 flat rate in the rain.",
    choices: [
      {
        id: 'STAGE1_METER_LEGAL',
        label: '"Anna, meter haaki please, law prakara meter haakbeku."',
        subtitle: 'Citing the law to a Bengaluru auto driver...',
        effect: {
          moodDelta: -15,
          fare: 500,
          nextStage: 2,
          driverReply: "Law-va? Silk Board traffic nodidya? Now it's ₹500 fixed. Take it or hire a helicopter!",
          kannadaGlossary: "Nodidya = Did you see?",
        },
      },
      {
        id: 'STAGE1_UBER_THREAT',
        label: '"Wait, let me check Uber / Ola auto price first."',
        subtitle: 'Threatening with aggregator apps.',
        effect: {
          moodDelta: -40,
          setMood: 0,
          status: 'LOST',
          driverReply: "Hoguappa, book Uber! See if anyone accepts in this rain! 45 minutes they will search, then cancel! Don't waste my time!",
          kannadaGlossary: "Hoguappa = Go away, man!",
        },
      },
      {
        id: 'STAGE1_METER_PLUS_50',
        label: '"Anna, 6:30 PM gottu. Meter mele ₹50 extra kodthini, direct route."',
        subtitle: 'The respectful local middle ground.',
        effect: {
          moodDelta: +25,
          fare: 350,
          nextStage: 2,
          driverReply: "Hmm... meter mele 50 ah? But Silk Board junction is fully blocked. Make it ₹320 flat, then we'll see.",
          kannadaGlossary: "Gottu = I know / Meter mele = On top of meter",
        },
      },
    ],
  },

  2: {
    prompt: "Driver complains about Sony World waterlogging and engine risk.",
    choices: [
      {
        id: 'STAGE2_ONE_AND_HALF',
        label: '"One-and-half kodthini anna (₹260). Through inner Koramangala roads."',
        subtitle: 'Proposing standard 1.5x night rate + shortcut route.',
        effect: {
          moodDelta: +20,
          fare: 280,
          nextStage: 3,
          driverReply: "Koramangala 4th block lane-gala? Clever macha. But that route has big potholes. Make it ₹280 cash?",
          kannadaGlossary: "Lane-gala = The back lanes",
        },
      },
      {
        id: 'STAGE2_MAPS_ARGUMENT',
        label: '"Why extra? Google Maps says only 25 minutes!"',
        subtitle: 'Arguing with GPS estimates.',
        effect: {
          moodDelta: -20,
          fare: 400,
          nextStage: 4,
          driverReply: "Google Maps runs on satellite, my auto runs on petrol and tears! ₹400 final!",
        },
      },
      {
        id: 'STAGE2_BIKE_TAXI_THREAT',
        label: '"If you don\'t come, I will take Rapido bike taxi in the rain."',
        subtitle: 'Threatening to take a 2-wheeler.',
        effect: {
          moodDelta: -40,
          setMood: 0,
          status: 'LOST',
          driverReply: "In this heavy rain bike taxi-na? Hospital bill ₹50,000 agutthe! Hogu!",
          kannadaGlossary: "Agutthe = It will become",
        },
      },
    ],
  },

  3: {
    prompt: "Climax: Thunder rumbling. Driver is debating heading home for RCB highlights.",
    choices: [
      {
        id: 'STAGE3_EXACT_CASH_TECH',
        label: '"Anna, ₹240 exact cash, no UPI drama. CodeDay project restore maadbeku!"',
        subtitle: 'Cash payment + CodeDay appeal.',
        effect: {
          moodDelta: +25,
          setMood: 90,
          fare: 240,
          status: 'WON',
          driverReply: "Exact cash? No 'server down' PhonePe drama? And you are building software apps? Sari baa macha, hop in! Indiranagar non-stop!",
          kannadaGlossary: "Sari baa = Okay, come!",
        },
      },
      {
        id: 'STAGE3_DOMLUR_ROUTE',
        label: '"Anna, meter mele ₹40 extra + bypass route through Domlur."',
        subtitle: 'Tactical bypass suggestion.',
        effect: {
          moodDelta: +20,
          setMood: 85,
          fare: 230,
          status: 'WON',
          driverReply: "Domlur flyover route? Super idea guru! ₹230 is fair deal. Baa baa, before signal turns red!",
          kannadaGlossary: "Guru = Bro / Leader",
        },
      },
      {
        id: 'STAGE3_LOWBALL',
        label: '"₹140 take it or leave it, anna."',
        subtitle: 'Absurd lowball in prime monsoon surge.',
        effect: {
          moodDelta: -40,
          setMood: 0,
          status: 'LOST',
          driverReply: "₹140-ge auto tyre kooda baralla! Walk to Indiranagar in the flood!",
          kannadaGlossary: "Baralla = Won't come",
        },
      },
    ],
  },

  4: {
    prompt: "Driver sees you shivering in the rain after the Google Maps argument.",
    choices: [
      {
        id: 'STAGE4_KANNADIGA_TECH',
        label: '"Anna, help out a fellow Bengaluru techie. ₹250 cash, I will guide the lane."',
        subtitle: 'Humble respectful appeal.',
        effect: {
          moodDelta: +35,
          setMood: 85,
          fare: 250,
          status: 'WON',
          driverReply: "Namma huduga na? Sari bidi. Sit inside, don't get wet. ₹250 done. Let's go!",
          kannadaGlossary: "Namma huduga = Our local boy",
        },
      },
      {
        id: 'STAGE4_RATING_PROMISE',
        label: '"I will give 5-star rating on Ola if you take me."',
        subtitle: 'Promising app ratings to an independent auto.',
        effect: {
          moodDelta: -40,
          setMood: 0,
          status: 'LOST',
          driverReply: "Naanu Ola-le illa guru! Rating thondu en maadbeku? Hogu!",
        },
      },
      {
        id: 'STAGE4_MIDDLE_FAIR',
        label: '"Anna, ₹220 direct, won\'t cancel on you."',
        subtitle: 'Solid fair price.',
        effect: {
          moodDelta: +30,
          setMood: 82,
          fare: 220,
          status: 'WON',
          driverReply: "Sari, baa. Meter mele little extra is enough for hot coffee in this rain. Hop in!",
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
            text: "Another auto pulls up in the rain: 'Silk Board to Indiranagar? ₹450 flat, meter won't go in this traffic!'",
          },
        ],
      };
    }

    default:
      return state;
  }
}
