/**
 * Deterministic Mistake & Behavior Detection Engine for Namma Fragile OS
 * 100% Client-side, predictable, zero external dependencies.
 */

export const DEFAULT_CODE_SNIPPET = `// Production Payment Checkout Service
function processCheckout(cartTotal, isMember) {
  const discountRate = 0.15;
  const taxRate = 0.08;

  if (cartTotal > 100) {
    const finalAmount = (cartTotal * (1 - discountRate)) * (1 + taxRate);
    return finalAmount;
  // Missing closing bracket '}' for the if block
`;

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
    return {
      valid: false,
      errorType: 'DEPRECATED_VAR',
      message: 'SyntaxError: Illegal use of "var". What year is it?! Use "const" or "let"!',
      penalty: 20,
      meme: '/memes/drake_var.jpg',
      memeCaption: 'const & let? ❌ | var in 2026? ✔️',
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
        return {
          valid: false,
          errorType: 'UNBALANCED_BRACKET',
          message: `SyntaxError: Unexpected closing bracket "${char}". No matching opening bracket found.`,
          penalty: 15,
          meme: '/memes/this_is_fine.jpg',
          memeCaption: 'Syntax error: unexpected bracket. This is fine.',
        };
      }
      const top = stack.pop();
      if (bracketPairs[char] !== top.char) {
        return {
          valid: false,
          errorType: 'UNBALANCED_BRACKET',
          message: `SyntaxError: Mismatched brackets. Expected closing for "${top.char}" but got "${char}".`,
          penalty: 15,
          meme: '/memes/this_is_fine.jpg',
          memeCaption: 'Mismatched brackets. This is fine.',
        };
      }
    }
  }

  if (stack.length > 0) {
    const unclosed = stack[stack.length - 1];
    return {
      valid: false,
      errorType: 'UNBALANCED_BRACKET',
      message: `SyntaxError: Missing closing bracket for "${unclosed.char}". Don't leave your code hanging!`,
      penalty: 15,
      meme: '/memes/this_is_fine.jpg',
      memeCaption: 'Missing bracket. This is fine.',
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

