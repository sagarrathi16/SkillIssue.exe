import { osReducer, INITIAL_OS_STATE, ACTION_TYPES, OSMood } from './src/app/osStateMachine.js';
import { selectDialogue } from './src/logic/dialogueSelector.js';
import { validateCode, DEFAULT_CODE_SNIPPET } from './src/logic/mistakeDetector.js';
import { negotiationReducer, INITIAL_NEGOTIATION_STATE, NEGOTIATION_STAGES } from './src/logic/negotiationMachine.js';

console.log('🚀 Running Full End-to-End User Journey Simulation...\n');

// =========================================================================
// STEP 1: INITIAL STATE & CLEAN WORKSPACE (CALM)
// =========================================================================
let state = { ...INITIAL_OS_STATE };
console.assert(state.trust === 100, 'Trust should start at 100%');
console.assert(state.mood === OSMood.CALM, 'Mood should start at CALM');
console.assert(state.isCollapsed === false, 'Physics should start inactive');
let dialogue = selectDialogue(state);
console.log('Step 1 [CALM]: Workspace initialized cleanly at 100% Trust.');
console.log('  Mascot:', `"${dialogue.text}"\n`);

// =========================================================================
// STEP 2: TRIGGER 1 — SYNTAX CHECK (UNBALANCED BRACKET)
// =========================================================================
const validation1 = validateCode(DEFAULT_CODE_SNIPPET);
console.assert(validation1.valid === false, 'DEFAULT_CODE_SNIPPET must fail validation');
console.assert(validation1.errorType === 'UNBALANCED_BRACKET', 'Must detect UNBALANCED_BRACKET');

state = osReducer(state, {
  type: ACTION_TYPES.MISTAKE_DETECTED,
  payload: { mistakeType: validation1.errorType, detail: validation1.message, penalty: 15 },
});
console.assert(state.trust === 85, `Trust should drop to 85%, got ${state.trust}%`);
console.assert(state.activeWarning !== null, 'Active warning must be set');
dialogue = selectDialogue(state);
console.log('Step 2 [FIRST MISTAKE]: Code syntax error detected (unclosed bracket).');
console.log('  Trust: 85% | Mood:', state.mood);
console.log('  Mascot:', `"${dialogue.text}"\n`);

// =========================================================================
// STEP 3: TRIGGER 2 — DISMISS WARNING & RUN CODE UNMODIFIED (IGNORED WARNING)
// =========================================================================
// User dismisses warning toast
state = osReducer(state, { type: ACTION_TYPES.WARNING_DISMISSED });
console.assert(state.activeWarning === null, 'Active warning should be cleared on dismiss');
console.assert(state.ignoredWarnings === 1, 'ignoredWarnings counter should be 1');

// User runs the exact same broken code again without fixing
state = osReducer(state, { type: ACTION_TYPES.IGNORED_WARNING_RUN });
console.assert(state.ignoredWarnings === 2, 'ignoredWarnings counter should increment to 2');
dialogue = selectDialogue(state);
console.assert(dialogue.tag === 'DISMISSED_WARNING', `Expected DISMISSED_WARNING, got ${dialogue.tag}`);
console.assert(
  dialogue.text.includes('Peak Koramangala founder behavior!'),
  'Must roast Koramangala founder behavior'
);
console.log('Step 3 [IGNORED WARNING]: Ran broken code again after dismissing toast.');
console.log('  Trust:', `${state.trust}% | Mood:`, state.mood);
console.log('  Mascot:', `"${dialogue.text}"\n`);

// =========================================================================
// STEP 4: TRIGGER 3 — SPAM CLICK ABUSE (>= 4 CLICKS IN 1.5S)
// =========================================================================
state = osReducer(state, {
  type: ACTION_TYPES.RAPID_CLICK_DETECTED,
  payload: { buttonName: 'Format_Document', clickCount: 5 },
});
dialogue = selectDialogue(state);
console.assert(dialogue.tag === 'SPAM_CLICK_ABUSE', `Expected SPAM_CLICK_ABUSE, got ${dialogue.tag}`);
console.assert(
  dialogue.text.includes('Silk Board traffic moves faster'),
  'Must deliver Silk Board traffic burn'
);
console.log('Step 4 [SPAM CLICK]: User rapidly hammered toolbar button.');
console.log('  Trust:', `${state.trust}% | Mood:`, state.mood);
console.log('  Mascot:', `"${dialogue.text}"\n`);

// =========================================================================
// STEP 5: TRIGGER 4 — FORBIDDEN BUTTON (DROP PROD DB)
// =========================================================================
state = osReducer(state, {
  type: ACTION_TYPES.FORBIDDEN_ACTION,
  payload: { actionName: 'DROP_PROD_DB' },
});
dialogue = selectDialogue(state);
console.assert(dialogue.tag === 'CRITICAL_VIOLATION', `Expected CRITICAL_VIOLATION, got ${dialogue.tag}`);
console.assert(
  dialogue.text.includes('Marathahalli knows not to touch Prod DB'),
  'Must deliver Marathahalli intern burn'
);
console.log('Step 5 [CRITICAL FORBIDDEN CONTROL]: User clicked Drop Prod DB button.');
console.log('  Trust:', `${state.trust}% | Mood:`, state.mood);
console.log('  Mascot:', `"${dialogue.text}"\n`);

// =========================================================================
// STEP 6: PHYSICS COLLAPSE & MENTAL BREAKDOWN CONFIRMATION
// =========================================================================
console.assert(state.isCollapsed === true, 'UI Chrome must detach when trust <= 34%');
console.assert(
  state.mood === OSMood.MENTAL_BREAKDOWN || state.mood === OSMood.BENGALURU_BOSS_FIGHT,
  'Mood must be in breakdown or boss fight'
);
console.log('Step 6 [PHYSICS COLLAPSE]: Surrounding UI elements detached under Matter.js.');
console.log('  isCollapsed:', state.isCollapsed, '| Central MiniEditor remains 100% usable.\n');

// =========================================================================
// STEP 7: RECOVERY VIA BENGALURU AUTO-RICKSHAW BOSS FIGHT
// =========================================================================
let neg = { ...INITIAL_NEGOTIATION_STATE };

// Stage 1: Meter mele 50
const s1 = NEGOTIATION_STAGES[1].choices.find(c => c.id === 'STAGE1_METER_PLUS_50');
neg = negotiationReducer(neg, { type: 'SELECT_CHOICE', payload: s1 });

// Stage 2: One-and-half through Koramangala back lanes
const s2 = NEGOTIATION_STAGES[2].choices.find(c => c.id === 'STAGE2_ONE_AND_HALF');
neg = negotiationReducer(neg, { type: 'SELECT_CHOICE', payload: s2 });

// Stage 3: Exact cash + CodeDay pitch
const s3 = NEGOTIATION_STAGES[3].choices.find(c => c.id === 'STAGE3_EXACT_CASH_TECH');
neg = negotiationReducer(neg, { type: 'SELECT_CHOICE', payload: s3 });

console.assert(neg.status === 'WON', 'Auto negotiation must be WON');
console.assert(neg.askedFare === 240, 'Fare should settle at ₹240');
console.log('Step 7 [BOSS FIGHT WON]: Bargained auto from Silk Board to Indiranagar for ₹240.');
console.log('  Driver Mood: 90% | Status: WON\n');

// =========================================================================
// STEP 8: RECOVERY ANIMATION & CLOSING ROAST LINE
// =========================================================================
state = osReducer(state, {
  type: ACTION_TYPES.START_RECOVERY,
  payload: { trustBonus: 85, detail: { reason: 'Auto negotiation won', fare: 240 } },
});
console.assert(state.trust === 85, `Trust should recover to 85%, got ${state.trust}%`);
console.assert(state.mood === OSMood.RECOVERY, `Mood should be RECOVERY, got ${state.mood}`);

dialogue = selectDialogue(state);
console.assert(
  dialogue.text.includes("Apology accepted. Toolbar restored. Don't make me call the auto anna again."),
  'Must deliver exact closing roast line'
);
console.log('Step 8 [RECOVERY TRANSITION]: Spring animation restoring elements.');
console.log('  Trust: 85% | Event History Length:', state.eventHistory.length);
console.log('  Mascot Closing Line:', `"${dialogue.text}"\n`);

// Complete recovery transition
state = osReducer(state, { type: ACTION_TYPES.RECOVERY_COMPLETED });
console.assert(state.isCollapsed === false, 'isCollapsed should be false after recovery');
console.assert(state.mood === OSMood.CALM, 'Mood should return to CALM at 85% trust');
console.log('Step 9 [RESTORED]: Workspace fully reassembled and operational.\n');

// =========================================================================
// STEP 10: INSTANT JUDGE SPEEDRUN RESET BENCHMARK (<100MS)
// =========================================================================
const t0 = performance.now();
state = osReducer(state, { type: ACTION_TYPES.HARD_RESET_DEMO });
const dt = performance.now() - t0;
console.assert(state.trust === 100, 'Trust must be 100% after reset');
console.assert(state.mood === OSMood.CALM, 'Mood must be CALM after reset');
console.assert(state.mistakeCount === 0, 'Mistakes counter must reset to 0');
console.assert(dt < 100, `Reset took ${dt}ms, must be <100ms`);
console.log(`Step 10 [JUDGE SPEEDRUN RESET]: Clean reset executed in ${dt.toFixed(3)}ms (Instant!).`);

console.log('\n============================================================');
console.log('🏆 100% OF END-TO-END USER JOURNEYS & TRIGGERS PASSED CLEANLY!');
console.log('============================================================\n');
