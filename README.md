# 🛺 Namma Fragile OS (SynapseX / Sorry.exe)

> *"An operating system that remembers every mistake. Unfortunately, it takes them personally."*

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Matter.js](https://img.shields.io/badge/Physics-Matter.js-crimson)](https://brm.io/matter-js/)
[![Offline First](https://img.shields.io/badge/Zero_API_Keys-100%25_Deterministic-10B981)](#-zero-dependency-architecture)
[![CodeDay Bengaluru](https://img.shields.io/badge/CodeDay-Bengaluru_2026-F59E0B)](https://codeday.org/)

**Namma Fragile OS** is an interactive, browser-based desktop workspace with an emotionally volatile operating system and a sharp Bengaluru personality. It begins as a credible, dark-mode developer environment (inspired by Linear and VS Code). Make mistakes, ignore compiler warnings, or spam toolbar buttons, and the OS degrades its trust in you. At high escalation, **the surrounding UI chrome literally detaches and collapses into a 2D rigid-body physics pile** under real gravity—while keeping your code editor and typed buffer completely intact!

To get your workspace back, you must apologize with genuine sincerity (via spoken voice or text) or beat a stubborn Bengaluru auto-rickshaw driver in an authentic fare-bargaining boss fight in the rain.

---

## 🎯 The Experience Loop

```
1. Credible Facade (Trust: 80–100%)
   └── Sleek Linear-style IDE (#0B0F19), monospace editor, emerald indicators.
         ↓ (User makes syntax errors, spams buttons, or ignores warnings)
2. Escalating Instability (Trust: 35–79%)
   └── Passive-aggressive sighs, CSS tremors, off-axis tilted buttons, Koramangala founder roasts.
         ↓ (Trust drops below 35% or Emergency Chaos Hotkey pressed)
3. Mental Breakdown & Physics Collapse (Trust: 0–34%)
   └── TopBar, Sidebar, and Status cards detach and tumble under Matter.js 2D gravity!
   └── SACRED SAFE ZONE: Central code editor and typed text NEVER shift or break.
         ↓ (System enters Recovery Mode)
4. Recovery Challenges
   ├── Option 1: Spoken Apology (Web Audio API RMS energy meter over 1.5s)
   ├── Option 2: Written Apology (Sincerity keyword parser with penalty enforcement)
   └── Option 3: Bengaluru Auto Boss Fight (Negotiate from Silk Board to Indiranagar in the rain)
         ↓ (Challenge Won)
5. Spring Reassembly Animation
   └── cubic-bezier(0.22, 1, 0.36, 1) spring physics cleanly restores UI in place.
```

---

## ⚡ Key Features & Engineering Highlights

### 1. The "Sacred Safe Zone" & Zero-Reflow Physics Bridge
- **Matter.js 2D Rigid-Body Simulation:** Detached UI components are assigned mass, friction (`0.12`), and restitution (`0.38`), tumbling realistically with randomized angular and horizontal impulses.
- **Invisible Spacer Technique:** When elements tagged with `[data-physics-id]` detach into fixed coordinates, an invisible placeholder `div` with exact cached dimensions is injected in the React DOM flow. The central code editor **does not shift, flicker, or reflow by a single pixel**.
- **Decoupled 60fps RAF Loop:** Body coordinates drive DOM `style.transform` directly inside `requestAnimationFrame`—**zero React state re-renders** during the physics simulation.
- **Spring Restoration:** Uses a `cubic-bezier(0.22, 1, 0.36, 1)` transition to smoothly fly elements back to their initial screen coordinates upon recovery.

### 2. PRD v2 Relationship Memory Model
- **Central State Machine (`src/app/osStateMachine.js`):** Single source of truth tracking `trust` (0–100), `mood`, `mistakeCount`, `ignoredWarnings`, `rapidClickEvents`, `apologyAttempts`, and an active sliding buffer of the last 10 session events.
- **Context-Aware Dialogue Selector (`src/logic/dialogueSelector.js`):**
  - *Repeated Error:* *"I literally just told you about the syntax error. Were you listening or just decorating your mechanical keyboard?"*
  - *Ignored Warning Callback:* *"You dismissed my warning toast and then ran the exact same broken code. Peak Koramangala founder behavior!"*
  - *Rapid Click Abuse:* *"Meter haakamma! Even Silk Board traffic moves faster than your cognitive processing right now."*
  - *Touching Prod DB:* *"Ayyo Rama! Who gave you sudo privileges? Even an intern in Marathahalli knows not to touch Prod DB!"*

### 3. Dual-Layer Procedural Audio & Subtitle Engine
- **100% Zero-Asset Failure Guarantee:** Uses the browser's native `AudioContext` to synthesize tones procedurally. No external MP3 files or network requests needed:
  - Exasperated sigh (low-pass descending sweep)
  - Error buzz (dual-frequency sawtooth alarm)
  - Shatter thud (sub-bass drop + bandpass noise burst simulating UI metal crashing on the floor)
  - Victory arpeggio (C5 – E5 – G5 – C6 chord progression)
  - Bengaluru Auto Horn (440Hz + 554Hz square wave vibrato)
- **Voice Lines Fallback:** Browser `window.speechSynthesis` configured with Indian English (`en-IN`) voice.
- **High-Contrast Subtitle Pill:** Typewriter text rendering + animated emotional avatar mascot (`🤖`, `😒`, `😤`, `😭`, `🛺`, `😌`) + Kannada glossary chips (`[Ayyo = Alas!]`, `[Meter haakamma = Turn on meter]`).

### 4. Bengaluru Auto-Rickshaw Boss Fight (`src/components/AutoNegotiation.jsx`)
- Deterministic 4-stage branching state machine negotiating a ride from Silk Board to Indiranagar at 6:30 PM in pouring monsoon rain.
- Tracks `driverMood` (0–100%) and `askedFare` (₹450 $\rightarrow$ ₹220–₹250).
- Threatening with Uber/Ola drops driver mood to 0% and forces a retry (*"Hoguappa, book Uber! 45 minutes they will search then cancel!"*).
- Agreeing to the golden local formula (*"Anna, meter mele 50 extra kodthini"*) wins the challenge and triggers workspace reassembly.

---

## ⚡ Hackathon Judge Speedrun & Hotkeys

Designed specifically for 60–90 second live hackathon judging rounds:

| Trigger / Action | Method | Description |
| :--- | :---: | :--- |
| **Emergency Chaos Hotkey** | `~` or `Ctrl + Shift + K` | Instantly drops Trust to 0% and triggers full physics collapse. |
| **Reset for Next Judge** | `Shift + Escape` | **Sub-millisecond instant reset (<1ms):** Restores state machine, physics bodies, and code editor without reloading the browser page. |
| **Judge Demo Bar** | Top Viewport Strip | Dedicated quick-trigger buttons: *Force Mistake*, *Simulate Spam*, *Touch Prod DB*, *Trigger Meltdown*, *Trigger Boss Fight*, and *Simulate Recovery*. |

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite |
| **Styling & Effects** | Tailwind CSS, Custom Keyframe Tremors, Lucide React |
| **2D Physics Engine** | Matter.js (Rigid-body, collision detection, gravity, restitution) |
| **Audio & Voice** | Native Web Audio API (`AudioContext`, `AnalyserNode`, `OscillatorNode`), Web Speech API |
| **State Machine** | Deterministic React Context + `useReducer` Relationship Store |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sagarrathi16/Namma_Fragile_OS.git
cd Namma_Fragile_OS

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Test Suite

Run the full deterministic test suite covering state transitions, physics snapshots, audio validation, and the auto negotiation state machine:

```bash
npm test
```

Build production bundle:

```bash
npm run build
```

---

## 📜 Project Structure

```
├── AGENTS.md                   # Operational guidelines & constraints
├── ARCHITECTURE.md             # Detailed technical architecture specification
├── package.json
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx                # React root mount
    ├── index.css               # Tailwind & custom tremor keyframes
    ├── app/
    │   ├── App.jsx             # Root layout & global hotkey listeners
    │   └── osStateMachine.js   # Single source of truth (trust, mood, events)
    ├── components/
    │   ├── Workspace.jsx       # Desktop container layout
    │   ├── TopBar.jsx          # Window controls, breadcrumbs, Reset button
    │   ├── Sidebar.jsx         # Tool icons + "Drop Prod DB" button
    │   ├── MiniEditor.jsx      # Sacred Safe Zone: line numbers, code buffer, Run button
    │   ├── StatusPanel.jsx     # Trust meter, mood gauge, Bengaluru telemetry
    │   ├── SystemToast.jsx     # Compiler error & behavior warning banner
    │   ├── RoastAssistant.jsx  # Typewriter subtitles, mascot, audio & mute controls
    │   ├── RecoveryModal.jsx   # Voice apology (RMS) + Typed apology fallback
    │   ├── AutoNegotiation.jsx # Bengaluru Auto Boss Fight mini-game
    │   └── DebugDemoBar.jsx    # Judge Speedrun bar & trigger buttons
    ├── physics/
    │   └── PhysicsWorld.js     # Matter.js world runner, walls, snapshot manager
    ├── audio/
    │   └── AudioManager.js     # Procedural synthesizer & Web Speech engine
    └── logic/
        ├── mistakeDetector.js  # Syntax checks, spam clicks, ignored warnings
        ├── dialogueSelector.js # Bengaluru roast lookup table with behavioral callbacks
        └── negotiationMachine.js# Auto-rickshaw dialogue state graph
```

---

## 💡 Team & Hackathon Credits

Built with ❤️, filter coffee, and patience at **CodeDay Bengaluru 2026**.  
*“The bug is fixed. The emotional damage remains.”*

