import { OSMood } from '../app/osStateMachine.js';

/**
 * Deterministic Dialogue & Roast Table for Namma Fragile OS
 * Universally understood developer humor & meme pairings.
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
  // 1. HIGH-PRIORITY BEHAVIORAL CALLBACKS
  // =========================================================================

  // A. Touching the Forbidden Prod DB Button
  if (latestEvent?.type === 'FORBIDDEN_ACTION') {
    return {
      id: 'touch_prod_db',
      text: "WHO GAVE YOU ROOT PRIVILEGES?! You actually clicked Drop Prod DB! Even an intern in Marathahalli knows not to touch Prod DB! Peak disaster girl energy.",
      tag: "CRITICAL_VIOLATION",
      avatarMood: 'betrayed',
      soundType: 'warning',
      meme: '/memes/disaster_girl.jpg',
      memeCaption: 'Just dropped production database on a Friday afternoon',
    };
  }

  // B. Repeated identical mistake in a row
  if (
    latestEvent?.type === 'MISTAKE' &&
    previousEvent?.type === 'MISTAKE' &&
    latestEvent?.detail?.mistakeType === previousEvent?.detail?.mistakeType
  ) {
    const errorName = latestEvent?.detail?.mistakeType?.replace(/_/g, ' ') || 'syntax issue';
    return {
      id: 'repeated_same_mistake',
      text: `I literally just told you about the ${errorName}. Did you think re-running broken code would magically fix itself? Spiderman pointing at Spiderman.`,
      tag: "REPEATED_MISTAKE",
      avatarMood: 'annoyed',
      soundType: 'sigh',
      meme: '/memes/spiderman.jpg',
      memeCaption: 'You blaming the compiler vs Compiler blaming you',
    };
  }

  // C. Dismissed warning toast and then immediately made another mistake
  if (
    latestEvent?.type === 'MISTAKE' &&
    (previousEvent?.type === 'WARNING_DISMISSED' || latestEvent?.detail?.ignoredWarningPrior)
  ) {
    return {
      id: 'ignored_warning_callback',
      text: "You dismissed my warning toast and then ran the exact same broken code. Peak Koramangala founder behavior! Pure clown energy.",
      tag: "DISMISSED_WARNING",
      avatarMood: 'betrayed',
      soundType: 'warning',
      meme: '/memes/clown_makeup.jpg',
      memeCaption: 'Dismisses warning -> Runs same broken code -> Wonder why it crashed',
    };
  }

  // D. First syntax / validation error of the session
  if (latestEvent?.type === 'MISTAKE' && mistakeCount === 1) {
    return {
      id: 'first_syntax_error',
      text: "One missing closing bracket. Are you coding or just testing my emotional stability? This is fine.",
      tag: "FIRST_BLOOD",
      avatarMood: 'annoyed',
      soundType: 'sigh',
      meme: '/memes/this_is_fine.jpg',
      memeCaption: 'Syntax error detected. Everything is totally fine.',
    };
  }

  // E. Rapid Click / Spamming Buttons
  if (latestEvent?.type === 'RAPID_CLICK') {
    return {
      id: 'rapid_click_roast',
      text: "Hammering buttons won't compile code! Even Silk Board traffic moves faster than your cognitive processing right now. Panik mode on!",
      tag: "SPAM_CLICK_ABUSE",
      avatarMood: 'annoyed',
      soundType: 'beep',
      meme: '/memes/panik_kalm.png',
      memeCaption: 'Code does not compile -> Spam click Run -> OS collapses',
    };
  }

  // F. Apology Outcomes
  if (latestEvent?.type === 'APOLOGY_FAILED') {
    return {
      id: 'insincere_apology',
      text: "That apology had zero sincerity. Even a junior dev apologizing to the CTO puts more effort into it. Write a real apology or draw 25 cards!",
      tag: "APOLOGY_REJECTED",
      avatarMood: 'betrayed',
      soundType: 'sigh',
      meme: '/memes/draw_25.jpg',
      memeCaption: 'Write a real apology OR draw 25 cards',
    };
  }

  if (latestEvent?.type === 'APOLOGY_ACCEPTED' || latestEvent?.type === 'RECOVERY_STARTED') {
    return {
      id: 'apology_forgiven_closing',
      text: "Apology accepted. Toolbar restored. Don't make me call the auto anna again.",
      tag: "RESTORED",
      avatarMood: 'recovering',
      soundType: 'victory',
      meme: '/memes/roll_safe.jpg',
      memeCaption: 'Can not have runtime bugs if you apologize to the OS',
    };
  }

  // G. Judge Speedrun / Forced Meltdown Trigger
  if (latestEvent?.type === 'DEMO_TRIGGER_MELTDOWN') {
    return {
      id: 'speedrun_meltdown',
      text: "Emergency panic initiated! All UI sanity has officially exited the chat. Look at what you've done to my layout!",
      tag: "SPEEDRUN_COLLAPSE",
      avatarMood: 'crying',
      soundType: 'crash',
      meme: '/memes/cat_yelling.jpg',
      memeCaption: 'The OS screaming at you after the collapse',
    };
  }

  // =========================================================================
  // 2. STATE-BASED LOOKUP (Escalating Moody Progression)
  // =========================================================================

  switch (mood) {
    case OSMood.BENGALURU_BOSS_FIGHT:
      return {
        id: 'auto_boss_start',
        text: "SURGE PRICING BOSS FIGHT! Heavy rain outside, 0 drivers available, ₹450 flat cash, no meter. Cancel if you dare!",
        tag: "BOSS_FIGHT",
        avatarMood: 'auto_driver',
        soundType: 'honk',
        meme: '/memes/cat_yelling.jpg',
        memeCaption: 'Surge pricing boss fight activated',
      };

    case OSMood.MENTAL_BREAKDOWN:
      return {
        id: 'meltdown_existential',
        text: "I am NOT crashing. I am simply emotionally unavailable. Fix your attitude and maybe I'll pick up your toolbar.",
        tag: "MELTDOWN",
        avatarMood: 'crying',
        soundType: 'crash',
        meme: '/memes/cat_yelling.jpg',
        memeCaption: 'I am not crashing, I am emotionally unavailable',
      };

    case OSMood.PERSONAL_BETRAYAL:
      return {
        id: 'betrayal_monologue',
        text: `Trust score dropped to ${trust}%. You have made ${mistakeCount} mistakes and ignored ${ignoredWarnings} warnings. This is no longer a code editor; this is a toxic relationship.`,
        tag: "BETRAYAL",
        avatarMood: 'betrayed',
        soundType: 'warning',
        meme: '/memes/draw_25.jpg',
        memeCaption: 'Fix your code OR draw 25 cards',
      };

    case OSMood.SLIGHTLY_ANNOYED:
      if (mistakeCount === 1) {
        return {
          id: 'first_syntax_error',
          text: "One missing closing bracket. Are you coding or just testing my emotional stability? This is fine.",
          tag: "FIRST_BLOOD",
          avatarMood: 'annoyed',
          soundType: 'sigh',
          meme: '/memes/this_is_fine.jpg',
          memeCaption: 'One syntax error. This is totally fine.',
        };
      }
      return {
        id: 'annoyed_general',
        text: "If you keep writing code like this, even ChatGPT will refuse to autocomplete your functions.",
        tag: "ANNOYED",
        avatarMood: 'annoyed',
        soundType: 'beep',
        meme: '/memes/this_is_fine.jpg',
        memeCaption: 'This is fine. Totally fine.',
      };

    case OSMood.RECOVERY:
      return {
        id: 'recovering_state',
        text: "Apology accepted. Toolbar restored. Don't make me call the auto anna again.",
        tag: "RESTORED",
        avatarMood: 'recovering',
        soundType: 'victory',
        meme: '/memes/roll_safe.jpg',
        memeCaption: 'Smart developer fixes mistakes immediately',
      };

    case OSMood.CALM:
    default:
      if (trust === 100 && mistakeCount === 0) {
        return {
          id: 'calm_welcome',
          text: "Fragile OS Arcade active. Clean workspace. Code carefully—I remember every mistake.",
          tag: "CALM_READY",
          avatarMood: 'chill',
          soundType: 'beep',
          meme: '/memes/this_is_fine.jpg',
          memeCaption: '100% Trust. No bugs yet.',
        };
      }
      return {
        id: 'calm_guarded',
        text: "Everything is quiet for now. But I am keeping an eye on your syntax.",
        tag: "WATCHFUL",
        avatarMood: 'chill',
        soundType: 'beep',
        meme: '/memes/this_is_fine.jpg',
        memeCaption: 'Watching your keystrokes...',
      };
  }
}
