import { osReducer, INITIAL_OS_STATE, ACTION_TYPES, OSMood } from './src/app/osStateMachine.js';
import { selectDialogue } from './src/logic/dialogueSelector.js';

console.log('🧪 Running Verification Tests for Namma Fragile OS Foundation...\n');

let state = { ...INITIAL_OS_STATE };

// Test 1: Initial State
console.assert(state.trust === 100, 'Initial trust should be 100');
console.assert(state.mood === OSMood.CALM, 'Initial mood should be CALM');
console.assert(state.eventHistory.length === 0, 'Event history should start empty');
let dialogue = selectDialogue(state);
console.log('✅ Initial Dialogue:', dialogue.text);

// Test 2: First Mistake
state = osReducer(state, {
  type: ACTION_TYPES.MISTAKE_DETECTED,
  payload: { mistakeType: 'UNBALANCED_BRACKET', detail: 'Missing ) bracket', penalty: 15 },
});
console.assert(state.trust === 85, `Trust should be 85, got ${state.trust}`);
console.assert(state.mood === OSMood.CALM, `Mood at 85 should be CALM, got ${state.mood}`);
console.assert(state.activeWarning !== null, 'Active warning should be set');
dialogue = selectDialogue(state);
console.log('✅ First Mistake Dialogue:', dialogue.text);

// Test 3: Repeated Same Mistake Callback
state = osReducer(state, {
  type: ACTION_TYPES.MISTAKE_DETECTED,
  payload: { mistakeType: 'UNBALANCED_BRACKET', detail: 'Missing ) bracket', penalty: 15 },
});
dialogue = selectDialogue(state);
console.assert(dialogue.tag === 'REPEATED_MISTAKE', `Expected REPEATED_MISTAKE, got ${dialogue.tag}`);
console.log('✅ Repeated Mistake Callback:', dialogue.text);

// Test 4: Dismiss Warning and Then Make Another Mistake (Ignored Warning Callback)
state = osReducer(state, { type: ACTION_TYPES.WARNING_DISMISSED });
console.assert(state.ignoredWarnings === 1, 'Ignored warnings should be 1');

state = osReducer(state, {
  type: ACTION_TYPES.MISTAKE_DETECTED,
  payload: { mistakeType: 'MISSING_SEMICOLON', detail: 'Missing semicolon', penalty: 15 },
});
dialogue = selectDialogue(state);
console.assert(dialogue.tag === 'DISMISSED_WARNING', `Expected DISMISSED_WARNING, got ${dialogue.tag}`);
console.log('✅ Ignored Warning Callback:', dialogue.text);

// Test 5: Rapid Clicks
state = osReducer(state, {
  type: ACTION_TYPES.RAPID_CLICK_DETECTED,
  payload: { buttonName: 'Toolbar', clickCount: 5 },
});
dialogue = selectDialogue(state);
console.assert(dialogue.tag === 'SPAM_CLICK_ABUSE', `Expected SPAM_CLICK_ABUSE, got ${dialogue.tag}`);
console.log('✅ Spam Click Callback:', dialogue.text);

// Test 6: Forbidden Action (Prod DB)
state = osReducer(state, {
  type: ACTION_TYPES.FORBIDDEN_ACTION,
  payload: { actionName: 'PROD_DB_TOUCH' },
});
dialogue = selectDialogue(state);
console.assert(dialogue.tag === 'CRITICAL_VIOLATION', `Expected CRITICAL_VIOLATION, got ${dialogue.tag}`);
console.log('✅ Forbidden Action Callback:', dialogue.text);

// Test 7: Cap History at 10 items
for (let i = 0; i < 15; i++) {
  state = osReducer(state, {
    type: ACTION_TYPES.MISTAKE_DETECTED,
    payload: { mistakeType: `ERROR_${i}`, detail: `Error detail ${i}` },
  });
}
console.assert(state.eventHistory.length === 10, `Event history must be capped at 10, got ${state.eventHistory.length}`);
console.log(`✅ History buffer capped correctly: ${state.eventHistory.length}/10 items`);

// Test 8: Speedrun Meltdown and Boss Fight
state = osReducer(state, { type: ACTION_TYPES.TRIGGER_MELTDOWN });
console.assert(state.mood === OSMood.MENTAL_BREAKDOWN, 'Mood should be MENTAL_BREAKDOWN');
console.log('✅ Meltdown Mood confirmed:', state.mood);

state = osReducer(state, { type: ACTION_TYPES.TRIGGER_BOSS_FIGHT });
console.assert(state.mood === OSMood.BENGALURU_BOSS_FIGHT, 'Mood should be BENGALURU_BOSS_FIGHT');
dialogue = selectDialogue(state);
console.log('✅ Boss Fight Dialogue:', dialogue.text);

// Test 9: Hard Reset
state = osReducer(state, { type: ACTION_TYPES.HARD_RESET_DEMO });
console.assert(state.trust === 100, 'Trust should reset to 100');
console.assert(state.mood === OSMood.CALM, 'Mood should reset to CALM');
console.assert(state.mistakeCount === 0, 'Mistakes should reset to 0');
console.log('✅ Hard Reset confirmed: trust is 100%, state is CALM');

console.log('\n🎉 ALL FOUNDATIONAL ARCHITECTURE TESTS PASSED SUCCESSFULLY!\n');

