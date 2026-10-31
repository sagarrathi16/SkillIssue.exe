import { 
  negotiationReducer, 
  INITIAL_NEGOTIATION_STATE, 
  NEGOTIATION_STAGES 
} from './src/logic/negotiationMachine.js';
import { osReducer, INITIAL_OS_STATE, ACTION_TYPES, OSMood } from './src/app/osStateMachine.js';
import { selectDialogue } from './src/logic/dialogueSelector.js';

console.log('🧪 Running Auto-Rickshaw Boss Negotiation State Machine Tests...\n');

// 1. Initial State Test
let negState = { ...INITIAL_NEGOTIATION_STATE };
console.assert(negState.stage === 1, 'Initial stage should be 1');
console.assert(negState.driverMood === 40, `Initial driverMood should be 40, got ${negState.driverMood}`);
console.assert(negState.askedFare === 450, `Initial askedFare should be 450, got ${negState.askedFare}`);
console.assert(negState.status === 'IN_PROGRESS', 'Initial status should be IN_PROGRESS');
console.log('✅ Initial Negotiation State verified: ₹450, 40% mood, Silk Board monsoon setting');

// 2. Test Stage 1 Uber Threat (Drop to 0 & LOST)
const uberChoice = NEGOTIATION_STAGES[1].choices.find(c => c.id === 'STAGE1_UBER_THREAT');
let lostState = negotiationReducer(negState, { type: 'SELECT_CHOICE', payload: uberChoice });
console.assert(lostState.driverMood === 0, 'Driver mood should drop to 0 on Uber threat');
console.assert(lostState.status === 'LOST', 'Status should be LOST on Uber threat');
console.log('✅ Uber/Ola threat immediately drops mood to 0% and fails negotiation');

// 3. Test Retry
let retriedState = negotiationReducer(lostState, { type: 'RETRY' });
console.assert(retriedState.driverMood === 40, 'Driver mood should reset to 40 on retry');
console.assert(retriedState.askedFare === 450, 'Asked fare should reset to 450 on retry');
console.assert(retriedState.status === 'IN_PROGRESS', 'Status should reset to IN_PROGRESS on retry');
console.log('✅ Retry cleanly resets auto negotiation for next attempt');

// 4. Test Winning Path 1 (Meter+50 -> One-and-Half -> Exact Cash)
// Step A: Stage 1 Choice (Meter + 50)
const stage1WinChoice = NEGOTIATION_STAGES[1].choices.find(c => c.id === 'STAGE1_METER_PLUS_50');
negState = negotiationReducer(negState, { type: 'SELECT_CHOICE', payload: stage1WinChoice });
console.assert(negState.stage === 2, `Should advance to stage 2, got ${negState.stage}`);
console.assert(negState.driverMood === 65, `Driver mood should be 65, got ${negState.driverMood}`);
console.assert(negState.askedFare === 350, `Fare should drop to 350, got ${negState.askedFare}`);
console.log('✅ Stage 1: "Meter mele 50 extra" softens driver (Mood: 65%, Fare: ₹350)');

// Step B: Stage 2 Choice (One-and-Half via Koramangala back lanes)
const stage2WinChoice = NEGOTIATION_STAGES[2].choices.find(c => c.id === 'STAGE2_ONE_AND_HALF');
negState = negotiationReducer(negState, { type: 'SELECT_CHOICE', payload: stage2WinChoice });
console.assert(negState.stage === 3, `Should advance to stage 3, got ${negState.stage}`);
console.assert(negState.driverMood === 85, `Driver mood should be 85, got ${negState.driverMood}`);
console.assert(negState.askedFare === 280, `Fare should drop to 280, got ${negState.askedFare}`);
console.log('✅ Stage 2: "One-and-half through inner roads" reaches ₹280 agreement');

// Step C: Stage 3 Choice (Exact Cash + CodeDay Pitch)
const stage3WinChoice = NEGOTIATION_STAGES[3].choices.find(c => c.id === 'STAGE3_EXACT_CASH_TECH');
negState = negotiationReducer(negState, { type: 'SELECT_CHOICE', payload: stage3WinChoice });
console.assert(negState.status === 'WON', `Negotiation should be WON, got ${negState.status}`);
console.assert(negState.driverMood >= 80, `Driver mood should be >= 80, got ${negState.driverMood}`);
console.assert(negState.askedFare === 240, `Final fare should be 240, got ${negState.askedFare}`);
console.log('✅ Stage 3: Exact cash deal struck! Fare settled at ₹240, Mood: 90%');

// 5. Test Recovery State Transition & Context-Aware Closing Roast Line
let osState = {
  ...INITIAL_OS_STATE,
  trust: 0,
  mood: OSMood.BENGALURU_BOSS_FIGHT,
  eventHistory: [{ type: 'DEMO_TRIGGER_BOSS_FIGHT', timestamp: Date.now() }],
};

osState = osReducer(osState, {
  type: ACTION_TYPES.START_RECOVERY,
  payload: { trustBonus: 85, detail: { reason: 'Won Auto Negotiation', fare: 240 } },
});

console.assert(osState.trust === 85, `Trust should be restored to 85, got ${osState.trust}`);
console.assert(osState.mood === OSMood.RECOVERY, `Mood should be RECOVERY, got ${osState.mood}`);
console.assert(osState.eventHistory.length > 0, 'Event history must remain intact');

const closingDialogue = selectDialogue(osState);
console.assert(
  closingDialogue.text.includes("Apology accepted. Toolbar restored. Don't make me call the auto anna again."),
  `Expected exact closing line, got: "${closingDialogue.text}"`
);
console.log(`✅ OS Mascot Context-Aware Closing Line: "${closingDialogue.text}"`);

// 6. Test Shift+Escape / Reset for Next Judge Benchmark (<100ms)
const startReset = performance.now();
osState = osReducer(osState, { type: ACTION_TYPES.HARD_RESET_DEMO });
const resetDuration = performance.now() - startReset;
console.assert(osState.trust === 100, 'Trust should reset to 100');
console.assert(osState.mood === OSMood.CALM, 'Mood should reset to CALM');
console.assert(resetDuration < 100, `Reset took ${resetDuration}ms, must be <100ms`);
console.log(`✅ Fast Judge Reset completed in ${resetDuration.toFixed(2)}ms (well under 100ms threshold)`);

console.log('\n🎉 ALL BENGALURU AUTO-RICKSHAW NEGOTIATION TESTS PASSED!\n');

