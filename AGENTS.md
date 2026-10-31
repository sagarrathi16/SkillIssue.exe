# AGENTS.md — Namma Fragile OS (SynapseX / Sorry.exe)

## 1. Project Identity & Core Premise
**Namma Fragile OS** is an interactive, browser-based desktop workspace with an emotionally fragile operating system and a Bengaluru-flavored personality. 
- **Tagline:** "An operating system that remembers every mistake. Unfortunately, it takes them personally."
- **Core Loop:** Present a clean, credible coding workspace -> Detect deterministic user mistakes/abuse -> Degrade `trust` (100 to 0) and log to `eventHistory` -> Escalate visual instability -> Shatter UI chrome into a 2D rigid-body physics pile (Matter.js) while keeping the code editor intact -> Force user to apologize (Web Audio API / text) or beat a Bengaluru Auto-Rickshaw Driver Boss CAPTCHA -> Reassemble UI via spring animations.
- **Zero External Dependencies at Runtime:** No LLM API calls, no backend servers. Everything must run deterministically client-side.

## 2. Creative Direction, UI Aesthetics & Persona
### 2.1 Visual Contrast (Before vs. After)
- **State 1: The Credible Facade (`trust: 80–100`)**
  - Aesthetic: Crisp, modern dark-mode developer workspace (inspired by Linear / VS Code / Raycast).
  - Palette: Deep slate backgrounds (`#0B0F19`, `#111827`), subtle 1px borders (`#1F2937`), crisp monospace typography (`JetBrains Mono` or `Fira Code`), emerald status indicators (`#10B981`).
  - Layout: Fixed Top Navigation Bar, Left Sidebar (4-5 tool icons), Central Mini Code Editor (with line numbers and Run/Validate button), Right Status/Trust Telemetry Panel, Bottom Status Bar.
- **State 2: Escalating Instability (`trust: 35–79`)**
  - Aesthetic: Passive-aggressive degradation.
  - Palette shifts toward amber (`#F59E0B`) and crimson (`#EF4444`).
  - Micro-interactions: CSS keyframe tremors (`rotate(-1.5deg)`), stuttering hover states, sarcastic toast banners, buttons tilting slightly off-axis.
- **State 3: Mental Breakdown & Collapse (`trust: 0–34`)**
  - Selected UI chrome elements (`TopBar`, `Sidebar` icons, `StatusPanel` cards, `Toolbar` buttons) physically detach from the layout and fall to the bottom of the viewport under Matter.js gravity, colliding and bouncing off each other.
  - **Sacred Safe Zone:** The Central Mini Code Editor, user-typed code, the Recovery/Boss Modal, and the Reset Demo button MUST NEVER detach or become unusable.

### 2.2 The Bengaluru OS Persona ("Namma Assistant")
- **Character:** Impatient, theatrical, sharp-witted Bengaluru tech lead mixed with an Indiranagar auto driver. Remembers past infractions in the current session.
- **Voice & Captions:** Every audio line must render a persistent, high-contrast subtitle banner at the bottom-center of the viewport with a typewriter effect and emotional avatar expression. Audio never autoplays before user interaction.
- **Procedural Sound Engine:** In addition to voice lines, use native Web Audio API oscillators/gain nodes to procedurally synthesize UI tones, dramatic falling pitch shifts, and recovery chimes without depending on external audio file loading.
- **Signature Dialogue Examples:**
  - *First Syntax Error:* "Ayyo, one missing bracket. Let's not start the day like this."
  - *Repeated Error:* "I already told you. Were you listening or just decorating the keyboard?"
  - *Ignored Warning:* "You dismissed my warning and then did the exact same thing. Peak Koramangala founder behavior."
  - *Rapid Click Abuse:* "Meter haakamma! Even Silk Board traffic moves faster than your brain right now."
  - *Meltdown:* "I am not crashing. I am emotionally unavailable. Fix your attitude."
  - *Recovery:* "Fine. I'll restore the toolbar. Trust is still loading."

## 3. Technical Stack & Architecture Rules
- **Framework:** React 18+ (Vite), Tailwind CSS, Framer Motion, Matter.js, Lucide React (icons).
- **Single Source of Truth (`src/app/osStateMachine.js`):**
  - State object:
    - `trust`: Number (0 to 100, initial: 100)
    - `mood`: Enum (`CALM` | `SLIGHTLY_ANNOYED` | `PERSONAL_BETRAYAL` | `MENTAL_BREAKDOWN` | `BENGALURU_BOSS_FIGHT` | `RECOVERY`)
    - `mistakeCount`: Number
    - `ignoredWarnings`: Number
    - `rapidClickEvents`: Number
    - `apologyAttempts`: Number
    - `eventHistory`: Array of `{ id, type, timestamp, detail }` (tracks last 10 events for context-aware dialogue callbacks)
  - State thresholds:
    - `80–100`: `CALM`
    - `60–79`: `SLIGHTLY_ANNOYED`
    - `35–59`: `PERSONAL_BETRAYAL`
    - `1–34`: `MENTAL_BREAKDOWN`
    - `0`: `BENGALURU_BOSS_FIGHT`

## 4. Non-Negotiable Physics & DOM Synchronization Rules
1. **Never Let React & Matter.js Fight:**
   - Elements eligible for collapse must be tagged with `data-physics-id="<unique-id>"`.
   - During `CALM`, `SLIGHTLY_ANNOYED`, and `PERSONAL_BETRAYAL`, elements are rendered normally by React/CSS.
   - Upon entering `MENTAL_BREAKDOWN` or `BENGALURU_BOSS_FIGHT`:
     1. Query all `[data-physics-id]` elements and read `getBoundingClientRect()`.
     2. Create fixed-position detached layers for physics elements. In their original layout positions, render invisible placeholder elements (`visibility: hidden`, exact dimensions) so the central code editor and sacred safe zone NEVER shift, resize, or reflow.
     3. Create a Matter.js rectangle body for each element at center `(rect.left + rect.width / 2, rect.top + rect.height / 2)` with dimensions `(rect.width, rect.height)`. Add static boundary walls for the viewport bottom, left, and right.
     4. Apply subtle initial angular velocities and horizontal impulses so elements tumble dynamically rather than dropping straight down.
     5. Inside a `requestAnimationFrame` loop, update each DOM node's `style.transform = translate3d(x - width/2, y - height/2, 0) rotate(angle rad)` directly via DOM refs—DO NOT trigger React state re-renders on every frame.
2. **Smooth Restoration (`RECOVERY` -> `CALM`):**
   - Stop the Matter.js runner and clear all physics bodies.
   - Transition each detached element's `style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)'` back to its cached initial coordinates and `0rad` rotation.
   - Once the transition completes, remove inline physics styles and return layout ownership cleanly to standard CSS/React.

## 5. Deterministic Triggers & Recovery Rules
- **Mistake Triggers (`src/logic/mistakeDetector.js`):**
  1. *Syntax Check:* Clicking "Run Code" with unbalanced brackets `()`, `{}`, `[]`, missing semicolons on `const/let` lines, or typing `var ` (which offends the OS's modern sensibilities).
  2. *Spam Click:* Clicking any toolbar button >= 4 times within 1500ms.
  3. *Ignored Warning:* Dismissing a warning toast and clicking "Run Code" again without modifying the editor text.
  4. *Forbidden Control:* Clicking the red `"Do Not Touch (Prod DB)"` button in the sidebar.
- **Judge Speedrun & Demo Controls:**
  - *Emergency Chaos Hotkey:* `Ctrl+Shift+K` or `~` (tilde) or double-clicking the OS Mascot immediately sets `trust: 0` and initiates full collapse for rapid 60s judge demonstrations.
  - *Reset Demo Button:* Persistent button in the Sacred Safe Zone that instantly restores full state, stops physics, and resets trust to 100.
- **Recovery Mechanics (`src/components/RecoveryModal.jsx` & `AutoNegotiation.jsx`):**
  1. *Apology Route:* User can type a sincere apology (must include words like `"sorry"`, `"apologize"`, `"anna"`, or `"mistake"` and be >= 15 chars; if `ignoredWarnings > 1`, require a longer apology) OR hold a "Speak Apology" button using Web Audio API `AnalyserNode` (requires 1.5 seconds of RMS audio signal above threshold, with full fallback if mic permission is denied).
  2. *Bengaluru Auto-Rickshaw Boss Fight:* A deterministic state-machine mini-game where the user negotiates a ride to Indiranagar in the rain. Tracks `driverMood` and `currentFare` (starts at ₹450). Winning choices ("Anna, meter mele 50 extra kodthini", "Won't cancel on Ola/Uber") unlock full system restoration.
