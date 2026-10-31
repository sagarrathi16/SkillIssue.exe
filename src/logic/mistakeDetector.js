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
    starterCode: `// =========================================================================
// ☕ CHALLENGE 1/4: THE COFFEE MACHINE COMPILER
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
// ☕ CHALLENGE 1/4: THE COFFEE MACHINE COMPILER (CORRECT ANSWER)
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
    starterCode: `// =========================================================================
// 🚫 CHALLENGE 2/4: THE "var" PURGE
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
// 🚫 CHALLENGE 2/4: THE "var" PURGE (CORRECT ANSWER)
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
    starterCode: `// =========================================================================
// 💰 CHALLENGE 3/4: PRIZE POOL SPLITTER
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
// 💰 CHALLENGE 3/4: PRIZE POOL SPLITTER (CORRECT ANSWER)
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
    starterCode: `// =========================================================================
// 🚀 CHALLENGE 4/4: THE MIDNIGHT PRODUCTION SHIP
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
// 🚀 CHALLENGE 4/4: THE MIDNIGHT PRODUCTION SHIP (CORRECT ANSWER)
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
    congratulation: '🏆 100% SYNTAX MASTERY! You have conquered every CodeDay challenge! The OS is at total peace.',
    successOutput: '✨ COMPILED SUCCESSFULLY!\nOutput: DEPLOY SUCCESS: SkillIssueCore [c0deday]',
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

  // 3. Check for missing semicolons on let / const declaration lines
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

