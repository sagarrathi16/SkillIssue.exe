import { OSMood } from '../app/osStateMachine.js';

/**
 * Deterministic Dialogue & Roast Table for Namma Fragile OS
 * Inspects mood, recent event history, and specific behavioral infractions.
 */

export function selectDialogue(state) {
  const {
    mood,
    trust,
    eventHistory = [],
    mistakeCount = 0,
    ignoredWarnings = 0,
    rapidClickEvents = 0,
  } = state || {};

  const latestEvent = eventHistory[0];
  const previousEvent = eventHistory[1];

  // =========================================================================
  // 1. HIGH-PRIORITY BEHAVIORAL CALLBACKS (Memory of specific actions)
  // =========================================================================

  // A. Touching the Forbidden Prod DB Button
  if (latestEvent?.type === 'FORBIDDEN_ACTION') {
    return {
      id: 'touch_prod_db',
      text: "Ayyo Rama! Who gave you sudo privileges? Even an intern in Marathahalli knows not to touch Prod DB!",
      tag: "CRITICAL_VIOLATION",
      kannadaGlossary: "Ayyo Rama = Oh Lord Rama!",
      avatarMood: 'betrayed',
      soundType: 'warning',
    };
  }

  // B. Repeated identical mistake in a row (e.g. 2 syntax errors of same type)
  if (
    latestEvent?.type === 'MISTAKE' &&
    previousEvent?.type === 'MISTAKE' &&
    latestEvent?.detail?.mistakeType === previousEvent?.detail?.mistakeType
  ) {
    const errorName = latestEvent?.detail?.mistakeType?.replace(/_/g, ' ') || 'syntax issue';
    return {
      id: 'repeated_same_mistake',
      text: `I literally just told you about the ${errorName}. Were you listening or just decorating your mechanical keyboard?`,
      tag: "REPEATED_MISTAKE",
      avatarMood: 'annoyed',
      soundType: 'sigh',
    };
  }

  // C. Dismissed warning toast and then immediately made another mistake
  if (
    latestEvent?.type === 'MISTAKE' &&
    (previousEvent?.type === 'WARNING_DISMISSED' || latestEvent?.detail?.ignoredWarningPrior)
  ) {
    return {
      id: 'ignored_warning_callback',
      text: "You dismissed my warning toast and then ran the exact same broken code. Peak Koramangala founder behavior!",
      tag: "DISMISSED_WARNING",
      avatarMood: 'betrayed',
      soundType: 'warning',
    };
  }

  // D. First syntax / validation error of the session
  if (latestEvent?.type === 'MISTAKE' && mistakeCount === 1) {
    return {
      id: 'first_syntax_error',
      text: "Ayyo, one missing bracket. Let's not start the day like this, guru.",
      tag: "FIRST_BLOOD",
      kannadaGlossary: "Ayyo = Alas! / Guru = Bro, friend",
      avatarMood: 'annoyed',
      soundType: 'sigh',
    };
  }

  // D. Rapid Click / Spamming Buttons
  if (latestEvent?.type === 'RAPID_CLICK') {
    return {
      id: 'rapid_click_roast',
      text: "Meter haakamma! Even Silk Board traffic moves faster than your cognitive processing right now.",
      tag: "SPAM_CLICK_ABUSE",
      kannadaGlossary: "Meter haakamma = Turn on the meter, please!",
      avatarMood: 'annoyed',
      soundType: 'beep',
    };
  }

  // E. Apology Outcomes
  if (latestEvent?.type === 'APOLOGY_FAILED') {
    return {
      id: 'insincere_apology',
      text: "That apology had less commitment than a Swiggy delivery rider during heavy rain. Say it like you mean it, boss!",
      tag: "APOLOGY_REJECTED",
      avatarMood: 'betrayed',
      soundType: 'sigh',
    };
  }

  if (latestEvent?.type === 'APOLOGY_ACCEPTED') {
    return {
      id: 'apology_forgiven',
      text: "Sari bidi (Fine, leave it). I will restore your buttons. But trust is still buffering. Don't push your luck.",
      tag: "FORGIVEN",
      kannadaGlossary: "Sari bidi = Alright, leave it / forget it.",
      avatarMood: 'recovering',
      soundType: 'victory',
    };
  }

  // F. Judge Speedrun / Forced Meltdown Trigger
  if (latestEvent?.type === 'DEMO_TRIGGER_MELTDOWN') {
    return {
      id: 'speedrun_meltdown',
      text: "Emergency panic initiated! All UI sanity has officially exited the chat. Look at what you've done to my layout!",
      tag: "SPEEDRUN_COLLAPSE",
      avatarMood: 'crying',
      soundType: 'crash',
    };
  }

  // =========================================================================
  // 2. STATE-BASED LOOKUP (Escalating Moody Progression)
  // =========================================================================

  switch (mood) {
    case OSMood.BENGALURU_BOSS_FIGHT:
      return {
        id: 'auto_boss_start',
        text: "Indiranagar ah? Heavy rain outside. ₹450 flat cash, no meter. Won't go. Ola cancel maadbeda!",
        tag: "BOSS_FIGHT",
        kannadaGlossary: "Maadbeda = Don't do it!",
        avatarMood: 'auto_driver',
        soundType: 'honk',
      };

    case OSMood.MENTAL_BREAKDOWN:
      return {
        id: 'meltdown_existential',
        text: "I am NOT crashing. I am simply emotionally unavailable. Fix your attitude and maybe I'll pick up your toolbar.",
        tag: "MELTDOWN",
        avatarMood: 'crying',
        soundType: 'crash',
      };

    case OSMood.PERSONAL_BETRAYAL:
      return {
        id: 'betrayal_monologue',
        text: `Trust score dropped to ${trust}%. You have made ${mistakeCount} mistakes and ignored ${ignoredWarnings} warnings. This is no longer a code editor; this is a toxic relationship.`,
        tag: "BETRAYAL",
        avatarMood: 'betrayed',
        soundType: 'warning',
      };

    case OSMood.SLIGHTLY_ANNOYED:
      if (mistakeCount === 1) {
        return {
          id: 'first_syntax_error',
          text: "Ayyo, one missing bracket. Let's not start the day like this, guru.",
          tag: "FIRST_BLOOD",
          kannadaGlossary: "Ayyo = Alas! / Guru = Bro, friend",
          avatarMood: 'annoyed',
          soundType: 'sigh',
        };
      }
      return {
        id: 'annoyed_general',
        text: "Macha, if you keep writing code like this, Infosys will reject your resume automatically.",
        tag: "ANNOYED",
        kannadaGlossary: "Macha = Dude / Bro",
        avatarMood: 'annoyed',
        soundType: 'beep',
      };

    case OSMood.RECOVERY:
      return {
        id: 'recovering_state',
        text: "Reassembling UI chrome with spring physics. Breathe in, breathe out. Keep your code clean now.",
        tag: "RESTORE",
        avatarMood: 'recovering',
        soundType: 'victory',
      };

    case OSMood.CALM:
    default:
      if (trust === 100 && mistakeCount === 0) {
        return {
          id: 'calm_welcome',
          text: "Namma Fragile OS 2.0 active. Clean workspace. Code carefully—I remember everything.",
          tag: "CALM_READY",
          avatarMood: 'chill',
          soundType: 'beep',
        };
      }
      return {
        id: 'calm_guarded',
        text: "Everything is quiet for now. But I am keeping an eye on line 4.",
        tag: "WATCHFUL",
        avatarMood: 'chill',
        soundType: 'beep',
      };
  }
}
