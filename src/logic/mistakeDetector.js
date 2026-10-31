/**
 * Deterministic Mistake & Behavior Detection Engine for Namma Fragile OS
 * 100% Client-side, predictable, zero external dependencies.
 */

export const CODING_CHALLENGES = [
  {
    id: 1,
    title: 'The Coffee Machine Compiler',
    difficulty: 'Novice Hacker',
    tag: 'BRACKET MATCHING',
    branch: 'feature/coffee-engine',
    taskPrompt: 'Fix the syntax error in calculateCoffeeFuel()! There is an unclosed bracket hanging in the if-block. Close all brackets properly and click "▶ RUN CODE"!',
    starterCode: `// =========================================================================
// ☕ CHALLENGE 1/7 [BRANCH: feature/coffee-engine]
// TASK: Fix the syntax error in calculateCoffeeFuel()!
// There is an unclosed bracket hanging in the if-block below.
// Close all brackets properly and click "▶ RUN CODE"!
// =========================================================================
function calculateCoffeeFuel(cupsDrank, hoursAwake) {
  const caffeinePerCup = 95; // mg
  const burnoutThreshold = 400; // mg

  if (cupsDrank * caffeinePerCup > burnoutThreshold) {
    const jitterFactor = hoursAwake * 1.5;
    return "Caffeine overload! Jitter level: " + jitterFactor;
  // ⚠️ SYNTAX FRACTURE: Missing closing '}' bracket below!
}

console.log(calculateCoffeeFuel(5, 14));`,
    solvedCode: `// =========================================================================
// ☕ CHALLENGE 1/7 [BRANCH: feature/coffee-engine] (CORRECT ANSWER)
// TASK: Fix the syntax error in calculateCoffeeFuel()!
// =========================================================================
function calculateCoffeeFuel(cupsDrank, hoursAwake) {
  const caffeinePerCup = 95; // mg
  const burnoutThreshold = 400; // mg

  if (cupsDrank * caffeinePerCup > burnoutThreshold) {
    const jitterFactor = hoursAwake * 1.5;
    return "Caffeine overload! Jitter level: " + jitterFactor;
  }
}

console.log(calculateCoffeeFuel(5, 14));`,
    congratulation: '☕ BOOM! Coffee engine compiled without a hitch! The caffeine is flowing! Trust +15 HP.',
    successOutput: '✨ COMPILED SUCCESSFULLY!\nOutput: Caffeine overload! Jitter level: 21',
  },
  {
    id: 2,
    title: 'The "var" Purge',
    difficulty: 'Modern Standards',
    tag: 'LEGACY REFACTOR',
    branch: 'refactor/ban-var',
    taskPrompt: 'In 2026, the OS refuses to compile code using deprecated "var"! Refactor all "var" declarations to "const" or "let", ensure statements have semicolons, and click "▶ RUN CODE"!',
    starterCode: `// =========================================================================
// 🚫 CHALLENGE 2/7 [BRANCH: refactor/ban-var]
// TASK: In 2026, the OS refuses to compile code using deprecated 'var'!
// Refactor all 'var' declarations to 'const' or 'let', ensure all statements
// have semicolons, and click "▶ RUN CODE"!
// =========================================================================
var hackerName = "CaffeineNinja";
var energyDrinks = 4;
var sleepHours = 2;

function checkSurvival() {
  var minimumEnergy = 12;
  var currentEnergy = (energyDrinks * 3) + sleepHours;
  return currentEnergy >= minimumEnergy;
}

console.log(hackerName, "survival check:", checkSurvival());`,
    solvedCode: `// =========================================================================
// 🚫 CHALLENGE 2/7 [BRANCH: refactor/ban-var] (CORRECT ANSWER)
// TASK: In 2026, the OS refuses to compile code using deprecated 'var'!
// =========================================================================
const hackerName = "CaffeineNinja";
const energyDrinks = 4;
const sleepHours = 2;

function checkSurvival() {
  const minimumEnergy = 12;
  const currentEnergy = (energyDrinks * 3) + sleepHours;
  return currentEnergy >= minimumEnergy;
}

console.log(hackerName, "survival check:", checkSurvival());`,
    congratulation: '🚫 Legacy syntax purged! Modern ES2026 standards upheld! Tech Lead approved! Trust +15 HP.',
    successOutput: '✨ COMPILED SUCCESSFULLY!\nOutput: CaffeineNinja survival check: true',
  },
  {
    id: 3,
    title: 'Prize Pool Splitter',
    difficulty: 'Bracket Alignment',
    tag: 'MISMATCH FIX',
    branch: 'fix/prize-pool',
    taskPrompt: 'Your hackathon team won 1st place! Fix the mismatched bracket in splitPrizePool() so everyone can get paid!',
    starterCode: `// =========================================================================
// 💰 CHALLENGE 3/7 [BRANCH: fix/prize-pool]
// TASK: Your hackathon team won 1st place! Fix the mismatched bracket
// in the splitPrizePool function so everyone can get paid!
// =========================================================================
function splitPrizePool(totalPrize, teamSize) {
  const platformFee = 0.05;
  const netPool = totalPrize * (1 - platformFee);

  if (teamSize > 0) {
    const sharePerHacker = (netPool / teamSize);
    return Math.floor(sharePerHacker);
  ) // ⚠️ SYNTAX FRACTURE: Mismatched bracket! Expected '}' but got ')'
}

console.log("Payout per hacker: $" + splitPrizePool(6000, 4));`,
    solvedCode: `// =========================================================================
// 💰 CHALLENGE 3/7 [BRANCH: fix/prize-pool] (CORRECT ANSWER)
// TASK: Your hackathon team won 1st place!
// =========================================================================
function splitPrizePool(totalPrize, teamSize) {
  const platformFee = 0.05;
  const netPool = totalPrize * (1 - platformFee);

  if (teamSize > 0) {
    const sharePerHacker = (netPool / teamSize);
    return Math.floor(sharePerHacker);
  }
}

console.log("Payout per hacker: $" + splitPrizePool(6000, 4));`,
    congratulation: '💰 Prize money disbursed cleanly! Team morale maximized! Trust +15 HP.',
    successOutput: '✨ COMPILED SUCCESSFULLY!\nOutput: Payout per hacker: $1425',
  },
  {
    id: 4,
    title: 'Zero-Day Production Ship',
    difficulty: 'CodeDay Final Boss',
    tag: 'DUAL FIX',
    branch: 'release/v1.0-midnight-ship',
    taskPrompt: 'Final CodeDay deployment! Fix the missing semicolon AND the unclosed condition bracket in deployService() to ship cleanly!',
    starterCode: `// =========================================================================
// 🚀 CHALLENGE 4/7 [BRANCH: release/v1.0-midnight-ship]
// TASK: Final CodeDay deployment! Fix the missing semicolon AND the unclosed
// condition bracket in deployService() to ship cleanly!
// =========================================================================
function deployService(projectName, commitHash) {
  const deployTimestamp = 1793429900
  const isHealthy = true;

  if (projectName && isHealthy {
    return "DEPLOY SUCCESS: " + projectName + " [" + commitHash + "]";
  }
  return "DEPLOY FAILED";
}

console.log(deployService("SkillIssueCore", "c0deday"));`,
    solvedCode: `// =========================================================================
// 🚀 CHALLENGE 4/7 [BRANCH: release/v1.0-midnight-ship] (CORRECT ANSWER)
// TASK: Final CodeDay deployment!
// =========================================================================
function deployService(projectName, commitHash) {
  const deployTimestamp = 1793429900;
  const isHealthy = true;

  if (projectName && isHealthy) {
    return "DEPLOY SUCCESS: " + projectName + " [" + commitHash + "]";
  }
  return "DEPLOY FAILED";
}

console.log(deployService("SkillIssueCore", "c0deday"));`,
    congratulation: '🏆 Production deployed flawlessly at midnight! All systems go! Trust +15 HP.',
    successOutput: '✨ COMPILED SUCCESSFULLY!\nOutput: DEPLOY SUCCESS: SkillIssueCore [c0deday]',
  },
  {
    id: 5,
    title: 'Infinite Loop Breaker',
    difficulty: 'Algorithmic Safeguard',
    tag: 'LOOP DEFECT',
    branch: 'hotfix/infinite-loop',
    taskPrompt: 'Fix the infinite while-loop in drainServerQueue()! The loop checks (remainingJobs > 0), but remainingJobs is never decremented. Add "remainingJobs--;" inside the loop!',
    starterCode: `// =========================================================================
// ♾️ CHALLENGE 5/7 [BRANCH: hotfix/infinite-loop]
// TASK: Fix the infinite while-loop in drainServerQueue()!
// The loop condition checks (remainingJobs > 0), but remainingJobs is never decremented!
// Add 'remainingJobs--;' inside the while block and click "▶ RUN CODE"!
// =========================================================================
function drainServerQueue(jobCount) {
  let remainingJobs = jobCount;
  let processed = 0;

  while (remainingJobs > 0) {
    processed += 1;
    // ⚠️ DEFECT: remainingJobs is never decremented! Server CPU melting!
  }

  return "Drained " + processed + " server jobs cleanly!";
}

console.log(drainServerQueue(5));`,
    solvedCode: `// =========================================================================
// ♾️ CHALLENGE 5/7 [BRANCH: hotfix/infinite-loop] (CORRECT ANSWER)
// TASK: Fix the infinite while-loop in drainServerQueue()!
// =========================================================================
function drainServerQueue(jobCount) {
  let remainingJobs = jobCount;
  let processed = 0;

  while (remainingJobs > 0) {
    processed += 1;
    remainingJobs--;
  }

  return "Drained " + processed + " server jobs cleanly!";
}

console.log(drainServerQueue(5));`,
    congratulation: '♾️ Infinite loop broken! CPU core temperatures cooled down to 38°C! Trust +15 HP.',
    successOutput: '✨ COMPILED SUCCESSFULLY!\nOutput: Drained 5 server jobs cleanly!',
  },
  {
    id: 6,
    title: 'Koramangala Pitch Deck',
    difficulty: 'Syntax & Strings',
    tag: 'SEED ROUND',
    branch: 'feat/ai-pitch-deck',
    taskPrompt: 'Your Koramangala founder is pitching VCs! Fix the broken string syntax in generateStartupPitch() to close the $5M seed round!',
    starterCode: `// =========================================================================
// 🦄 CHALLENGE 6/7 [BRANCH: feat/ai-pitch-deck]
// TASK: Your Koramangala founder is pitching VCs! Fix the broken string
// syntax in generateStartupPitch() to close the $5M seed round!
// =========================================================================
function generateStartupPitch(valuationMillions, buzzword) {
  const traction = 100000;
  // ⚠️ SYNTAX FRACTURE: Missing closing quote on the pitch string below!
  const pitch = "We are an AI-first " + buzzword + " platform targeting $" + valuationMillions + "M valuation;
  return pitch + " with " + traction + " waitlist users.";
}

console.log(generateStartupPitch(10, "Autonomous Agent OS"));`,
    solvedCode: `// =========================================================================
// 🦄 CHALLENGE 6/7 [BRANCH: feat/ai-pitch-deck] (CORRECT ANSWER)
// =========================================================================
function generateStartupPitch(valuationMillions, buzzword) {
  const traction = 100000;
  const pitch = "We are an AI-first " + buzzword + " platform targeting $" + valuationMillions + "M valuation";
  return pitch + " with " + traction + " waitlist users.";
}

console.log(generateStartupPitch(10, "Autonomous Agent OS"));`,
    congratulation: '🦄 Term sheet signed! ₹400 Cr valuation secured! Koramangala tech lead approves! Trust +15 HP.',
    successOutput: '✨ COMPILED SUCCESSFULLY!\nOutput: We are an AI-first Autonomous Agent OS platform targeting $10M valuation with 100000 waitlist users.',
  },
  {
    id: 7,
    title: 'Git Merge Conflict',
    difficulty: 'Git Mastery',
    tag: 'MERGE CONFLICT',
    branch: 'chaos/merge-conflict',
    taskPrompt: 'Resolve the Git merge conflict markers! Delete "<<<<<<< HEAD", "=======", and ">>>>>>>", pick the winning fare logic, and click "▶ RUN CODE"!',
    starterCode: `// =========================================================================
// 🔀 CHALLENGE 7/7 [BRANCH: chaos/merge-conflict]
// TASK: Resolve the Git merge conflict markers below!
// Delete the '<<<<<<< HEAD', '=======', and '>>>>>>>' lines, choose the
// winning fare logic, and click "▶ RUN CODE"!
// =========================================================================
function resolveRidePricing(baseFareKm, distanceKm) {
<<<<<<< HEAD
  const total = (baseFareKm * distanceKm) + 30;
=======
  const total = (baseFareKm * distanceKm) + 50;
>>>>>>> auto-anna-branch
  return "Final Ride Price: ₹" + total;
}

console.log(resolveRidePricing(20, 8));`,
    solvedCode: `// =========================================================================
// 🔀 CHALLENGE 7/7 [BRANCH: chaos/merge-conflict] (CORRECT ANSWER)
// =========================================================================
function resolveRidePricing(baseFareKm, distanceKm) {
  const total = (baseFareKm * distanceKm) + 50;
  return "Final Ride Price: ₹" + total;
}

console.log(resolveRidePricing(20, 8));`,
    congratulation: '🔀 Merge conflict resolved cleanly! Auto-Anna accepted the PR without throwing hands! Trust +15 HP.',
    successOutput: '✨ COMPILED SUCCESSFULLY!\nOutput: Final Ride Price: ₹210',
  },
];

export const BUG_PRESETS = {
  BRACKET_BUG: `// =========================================================================
// 💥 BUG TEST: UNBALANCED BRACKET SYNTAX FRACTURE
// =========================================================================
function calculateCaffeineLoad(shots) {
  const limit = 4;
  if (shots > limit) {
    const warning = "Severe tachycardia incoming";
    return warning;
  // Missing closing bracket for if statement!
}

console.log(calculateCaffeineLoad(6));`,

  VAR_BUG: `// =========================================================================
// 🚫 BUG TEST: DEPRECATED "var" USAGE IN 2026
// =========================================================================
var developerName = "SleepDeprivedHacker";
var hackathonHour = 23;
var bugsRemaining = 17;

function estimateSurvival() {
  var panicMode = true;
  return developerName + " has " + bugsRemaining + " bugs to fix at hour " + hackathonHour;
}

console.log(estimateSurvival());`,

  SEMICOLON_BUG: `// =========================================================================
// ⚠️ BUG TEST: MISSING MANDATORY SEMICOLON
// =========================================================================
function processDeploy() {
  const commitId = "c0deday"
  const branchName = "main"
  let isReady = false

  return "Deploying " + branchName + " at commit " + commitId;
}

console.log(processDeploy());`,

  COMBO_BUG: `// =========================================================================
// 💀 BUG TEST: MULTIPLE SYNTAX FRACTURES COMBINED
// Contains: illegal 'var' + missing semicolons + unclosed bracket!
// =========================================================================
var hackathonTarget = "GrandPrize"
var redBullsDrank = 7

function executeFinalPush(target) {
  var energyLevel = 9000
  if (redBullsDrank > 5) {
    const status = "Hyper-caffeinated coder running wild"
    return status + " toward " + target;
  // Missing bracket here!
}

console.log(executeFinalPush(hackathonTarget));`,

  MISMATCH_BUG: `// =========================================================================
// ❌ BUG TEST: MISMATCHED BRACKET ')' INSTEAD OF '}'
// =========================================================================
function checkMemoryOverflow(bufferSize) {
  if (bufferSize > 1024) {
    return "Memory overflow risk detected!";
  ) // ⚠️ SYNTAX FRACTURE: Expected '}' but found ')'
}

console.log(checkMemoryOverflow(2048));`,
};

export const DEFAULT_CODE_SNIPPET = CODING_CHALLENGES[0].starterCode;

/**
 * Validates JavaScript code for deliberate deterministic errors:
 * 1. Unbalanced brackets: {}, (), []
 * 2. Deprecated 'var' keyword
 * 3. Missing semicolons on const/let statements
 */
export function validateCode(code) {
  if (!code || typeof code !== 'string') {
    return {
      valid: false,
      errorType: 'EMPTY_CODE',
      message: 'Empty editor buffer. Even junior devs write at least console.log("hello")!',
      meme: '/memes/this_is_fine.jpg',
      memeCaption: 'Empty file. 0 bugs, but 0 features.',
    };
  }

  // 1. Check for deprecated 'var'
  if (/\bvar\s+[a-zA-Z_$]/.test(code)) {
    const lines = code.split('\n');
    const varLineIndex = lines.findIndex((l) => /\bvar\s+[a-zA-Z_$]/.test(l));
    const lineIndex = varLineIndex !== -1 ? varLineIndex : 0;
    return {
      valid: false,
      errorType: 'DEPRECATED_VAR',
      message: 'SyntaxError: Illegal use of "var". What year is it?! Use "const" or "let"!',
      penalty: 20,
      meme: '/memes/drake_var.jpg',
      memeCaption: 'const & let? ❌ | var in 2026? ✔️',
      lineIndex,
      lineNumber: lineIndex + 1,
    };
  }

  // 2. Bracket matching using a stack
  const stack = [];
  const bracketPairs = {
    ')': '(',
    '}': '{',
    ']': '[',
  };
  const openingBrackets = new Set(['(', '{', '[']);
  const closingBrackets = new Set([')', '}', ']']);

  // Clean out comments and string literals to avoid false positives
  const sanitized = code
    .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
    .replace(/(["'`])(?:(?=(\\?))\2[\s\S])*?\1/g, '');

  for (let i = 0; i < sanitized.length; i++) {
    const char = sanitized[i];
    if (openingBrackets.has(char)) {
      stack.push({ char, index: i });
    } else if (closingBrackets.has(char)) {
      if (stack.length === 0) {
        const errLine = code.substring(0, i).split('\n').length - 1;
        return {
          valid: false,
          errorType: 'UNBALANCED_BRACKET',
          message: `SyntaxError: Unexpected closing bracket "${char}". No matching opening bracket found.`,
          penalty: 15,
          meme: '/memes/this_is_fine.jpg',
          memeCaption: 'Syntax error: unexpected bracket. This is fine.',
          lineIndex: errLine,
          lineNumber: errLine + 1,
        };
      }
      const top = stack.pop();
      if (bracketPairs[char] !== top.char) {
        const errLine = code.substring(0, i).split('\n').length - 1;
        return {
          valid: false,
          errorType: 'UNBALANCED_BRACKET',
          message: `SyntaxError: Mismatched brackets. Expected closing for "${top.char}" but got "${char}".`,
          penalty: 15,
          meme: '/memes/this_is_fine.jpg',
          memeCaption: 'Mismatched brackets. This is fine.',
          lineIndex: errLine,
          lineNumber: errLine + 1,
        };
      }
    }
  }

  if (stack.length > 0) {
    const unclosed = stack[stack.length - 1];
    const errLine = code.substring(0, unclosed.index).split('\n').length - 1;
    return {
      valid: false,
      errorType: 'UNBALANCED_BRACKET',
      message: `SyntaxError: Missing closing bracket for "${unclosed.char}". Don't leave your code hanging!`,
      penalty: 15,
      meme: '/memes/this_is_fine.jpg',
      memeCaption: 'Missing bracket. This is fine.',
      lineIndex: errLine,
      lineNumber: errLine + 1,
    };
  }

  // 3. Check for unresolved Git merge conflict markers
  if (code.includes('<<<<<<<') || code.includes('>>>>>>>') || (/^[ \t]*=======[ \t]*$/m.test(code))) {
    const lines = code.split('\n');
    const conflictLine = lines.findIndex(l => l.includes('<<<<<<<') || l.includes('>>>>>>>') || l.trim() === '=======');
    const lineIndex = conflictLine !== -1 ? conflictLine : 0;
    return {
      valid: false,
      errorType: 'GIT_MERGE_CONFLICT',
      message: 'GitConflict: Unresolved merge conflict markers (<<<<<<<, =======, >>>>>>>) found! Clean up markers before compiling.',
      penalty: 15,
      meme: '/memes/this_is_fine.jpg',
      memeCaption: 'Merge conflict in production. This is fine.',
      lineIndex,
      lineNumber: lineIndex + 1,
    };
  }

  // 4. Check for infinite while-loop risk in drainServerQueue
  if (code.includes('while (remainingJobs > 0)') && !code.includes('remainingJobs--') && !code.includes('remainingJobs -=') && !code.includes('remainingJobs = remainingJobs -')) {
    const lines = code.split('\n');
    const loopLine = lines.findIndex(l => l.includes('while (remainingJobs > 0)'));
    const lineIndex = loopLine !== -1 ? loopLine : 0;
    return {
      valid: false,
      errorType: 'INFINITE_LOOP',
      message: 'RuntimeWarning: Infinite while-loop detected! remainingJobs is never decremented. CPU will freeze!',
      penalty: 20,
      meme: '/memes/this_is_fine.jpg',
      memeCaption: 'Infinite loop. CPU core melting.',
      lineIndex,
      lineNumber: lineIndex + 1,
    };
  }

  // 5. Check for obvious unterminated string in assignment
  const stringAssignmentRegex = /(?:const|let)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*"[^"\n]*;(?!\s*")/m;
  if (stringAssignmentRegex.test(code)) {
    const lines = code.split('\n');
    const errLine = lines.findIndex(l => stringAssignmentRegex.test(l));
    const lineIndex = errLine !== -1 ? errLine : 0;
    return {
      valid: false,
      errorType: 'UNTERMINATED_STRING',
      message: 'SyntaxError: Unterminated string literal. Missing closing quotation mark (") before semicolon!',
      penalty: 15,
      meme: '/memes/this_is_fine.jpg',
      memeCaption: 'Unterminated string literal. This is fine.',
      lineIndex,
      lineNumber: lineIndex + 1,
    };
  }

  // 6. Check for missing semicolons on let / const declaration lines
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      (line.startsWith('const ') || line.startsWith('let ')) &&
      !line.endsWith(';') &&
      !line.endsWith('{') &&
      !line.endsWith(',') &&
      !line.includes('//')
    ) {
      return {
        valid: false,
        errorType: 'MISSING_SEMICOLON',
        message: `StyleError on line ${i + 1}: Missing mandatory semicolon after variable declaration.`,
        penalty: 10,
        meme: '/memes/spiderman.jpg',
        memeCaption: 'JavaScript without semicolons',
        lineIndex: i,
        lineNumber: i + 1,
      };
    }
  }

  return {
    valid: true,
    message: 'Code compiled cleanly! System integrity satisfied.',
    meme: '/memes/roll_safe.jpg',
    memeCaption: 'Code compiled on first try!',
  };
}

/**
 * Creates a rapid click abuse detector.
 * Returns true if >= threshold clicks occur within windowMs.
 */
export function createClickTracker(threshold = 4, windowMs = 1500) {
  let clickTimestamps = [];

  return function recordClick() {
    const now = Date.now();
    clickTimestamps = clickTimestamps.filter((t) => now - t <= windowMs);
    clickTimestamps.push(now);

    if (clickTimestamps.length >= threshold) {
      const count = clickTimestamps.length;
      clickTimestamps = []; // Reset after trigger
      return { isSpam: true, count };
    }

    return { isSpam: false, count: clickTimestamps.length };
  };
}

export const BRANCH_LIST = [
  {
    name: 'main',
    label: 'main (Production Track)',
    challengeId: 1,
    tag: 'PRODUCTION',
    desc: 'The primary hackathon code branch with standard challenges 1-4.',
  },
  {
    name: 'feature/coffee-engine',
    label: 'feature/coffee-engine',
    challengeId: 1,
    tag: 'BRACKETS',
    desc: 'Challenge 1: Fix the coffee fuel calculator bracket syntax.',
  },
  {
    name: 'refactor/ban-var',
    label: 'refactor/ban-var',
    challengeId: 2,
    tag: 'ES2026',
    desc: 'Challenge 2: Purge deprecated var statements for modern ES2026.',
  },
  {
    name: 'fix/prize-pool',
    label: 'fix/prize-pool',
    challengeId: 3,
    tag: 'BRACKETS',
    desc: 'Challenge 3: Fix mismatched bracket in prize splitter.',
  },
  {
    name: 'release/v1.0-midnight-ship',
    label: 'release/v1.0-midnight-ship',
    challengeId: 4,
    tag: 'DEPLOY',
    desc: 'Challenge 4: Fix missing semicolon & unclosed condition before shipping.',
  },
  {
    name: 'hotfix/infinite-loop',
    label: 'hotfix/infinite-loop',
    challengeId: 5,
    tag: 'ALGORITHM',
    desc: 'Challenge 5: Break infinite while-loop to save server CPU.',
  },
  {
    name: 'feat/ai-pitch-deck',
    label: 'feat/ai-pitch-deck',
    challengeId: 6,
    tag: 'SYNTAX',
    desc: 'Challenge 6: Fix broken pitch deck string for Koramangala VCs.',
  },
  {
    name: 'chaos/merge-conflict',
    label: 'chaos/merge-conflict',
    challengeId: 7,
    tag: 'GIT OPS',
    desc: 'Challenge 7: Resolve Auto-Anna vs Tech Lead Git merge conflict markers.',
  },
];

export const OS_THEMES = [
  {
    id: 'arcade',
    name: 'Neo Arcade',
    subtitle: 'Classic Neo-Brutalist Slate & Yellow',
    accent: '#FACC15',
    primary: '#10B981',
    bg: '#0E0F17',
    tag: 'DEFAULT',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    subtitle: 'Night City Cyan, Hot Pink & Indigo',
    accent: '#00F0FF',
    primary: '#FF007F',
    bg: '#080914',
    tag: 'NEON',
  },
  {
    id: 'matrix',
    name: 'Matrix Terminal',
    subtitle: 'Phosphor Green & Pure Void Black',
    accent: '#00FF66',
    primary: '#34D399',
    bg: '#020703',
    tag: 'HACKER',
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave 1984',
    subtitle: 'Retro Sunset Pink, Teal & Deep Violet',
    accent: '#FF71CE',
    primary: '#01CDFE',
    bg: '#11051D',
    tag: 'RETRO',
  },
  {
    id: 'coffee',
    name: 'Filter Coffee',
    subtitle: 'Warm Bengaluru Roast Espresso & Gold',
    accent: '#F59E0B',
    primary: '#D97706',
    bg: '#120A05',
    tag: 'NAMMA',
  },
];


