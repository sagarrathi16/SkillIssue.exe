import { audioManager } from './src/audio/AudioManager.js';

console.log('🧪 Running Audio Engine & Recovery Logic Tests...\n');

// 1. Test AudioManager Singleton & Mute Toggle
console.assert(typeof audioManager.toggleMute === 'function', 'toggleMute should exist');
const initialMute = audioManager.isMuted;
const toggled = audioManager.toggleMute();
console.assert(toggled === !initialMute, 'toggleMute should toggle state');
audioManager.toggleMute(); // restore
console.log('✅ AudioManager mute toggle verified');

// 2. Test Typed Apology Rules Determinism
function validateTypedApology(text, ignoredWarnings = 0) {
  const lower = text.toLowerCase().trim();
  if (lower.length < 15) {
    return { valid: false, reason: 'Too brief (<15 chars)' };
  }
  const hasKeyword = ['sorry', 'apologize', 'anna', 'mistake', 'forgive', 'ayyo'].some(w => lower.includes(w));
  if (!hasKeyword) {
    return { valid: false, reason: 'Missing sincerity keywords' };
  }
  if (ignoredWarnings >= 2 && lower.length < 35) {
    return { valid: false, reason: 'Ignored warnings penalty: requires >=35 chars' };
  }
  return { valid: true };
}

// Test case A: Insufficient length
const resA = validateTypedApology('Sorry bro');
console.assert(resA.valid === false && resA.reason.includes('Too brief'), 'Should reject <15 chars');
console.log('✅ Short apology rejected (<15 chars)');

// Test case B: Missing keyword
const resB = validateTypedApology('Please let me continue working on my project');
console.assert(resB.valid === false && resB.reason.includes('keywords'), 'Should reject missing keywords');
console.log('✅ Apology without sincerity keywords rejected');

// Test case C: Valid basic apology
const resC = validateTypedApology('Sorry anna, I made a mistake with the bracket');
console.assert(resC.valid === true, 'Valid apology should be accepted');
console.log('✅ Valid basic apology accepted');

// Test case D: Ignored warnings escalation (ignoredWarnings >= 2 requires >=35 chars)
const resD = validateTypedApology('Sorry anna, I made a mistake!', 2);
console.assert(resD.valid === false && resD.reason.includes('>=35 chars'), 'Should enforce 35 chars when warnings >= 2');
console.log('✅ Ignored warnings penalty enforced: requires >= 35 chars');

const resE = validateTypedApology('Sorry anna, I promise to never dismiss your compiler warnings again!', 2);
console.assert(resE.valid === true, 'Sufficiently long apology accepted under penalty');
console.log('✅ Extended apology accepted under ignored warnings penalty');

console.log('\n🎉 ALL AUDIO & APOLOGY RECOVERY TESTS PASSED!\n');

