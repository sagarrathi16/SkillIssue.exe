# 💀 SkillIssue.exe (CodeDay Edition)

> *"The code editor that remembers every mistake. Unfortunately, it's a massive skill issue."*

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Matter.js](https://img.shields.io/badge/Physics-Matter.js-crimson)](https://brm.io/matter-js/)
[![Offline First](https://img.shields.io/badge/Zero_API_Keys-100%25_Deterministic-10B981)](#-zero-dependency-architecture)
[![CodeDay Hackathon](https://img.shields.io/badge/CodeDay-Bengaluru_2026-F59E0B)](https://codeday.org/)

**SkillIssue.exe** is a gamified, neo-brutalist code editor with an emotionally volatile temperament built for **CodeDay Bengaluru 2026**. It starts as a credible, slick developer workspace. Write bad code, ignore compiler warnings, or spam buttons, and the OS degrades its trust in you. When trust collapses, **the surrounding UI chrome physically detaches and tumbles into a 2D rigid-body physics pile** under real gravity (Matter.js)—while keeping your central code editor and typed buffer 100% intact!

To restore your destroyed workspace, you must conquer the **Bug Smasher Server Core Arcade Game** or survive the **Tech Lead Dare Roulette**.

---

## 🎯 The Experience Loop

```
1. Credible Facade (Trust: 80–100%)
   └── Dark developer workspace, monospace editor, live telemetry, and procedural ambient BGM.
         ↓ (User commits syntax errors, deprecated var, or spams buttons)
2. Escalating Instability (Trust: 35–79%)
   └── Screen tremors, chromatic aberration code glitches, off-axis button tilting, Koramangala founder roasts.
         ↓ (Trust drops below 35% or Emergency Chaos Hotkey pressed)
3. Mental Breakdown & Physics Collapse (Trust: 0–34%)
   └── TopBar, Sidebar, and Telemetry cards detach and tumble under Matter.js 2D rigid-body physics!
   └── SACRED SAFE ZONE: Central code editor and typed buffer NEVER shift, reflow, or fall.
         ↓ (After 2.2s collapse delay + shatter thud sound)
4. Recovery Challenges (Choose Your Fate)
   ├── Option A: Bug Smasher Arcade Game (Squash good patches vs bad traps, speed accelerates to 2.5x)
   └── Option B: Tech Lead Dare Roulette (Complete hilarious developer dares or physical stunts)
         ↓ (Challenge Won)
5. Spring Reassembly Animation
   └── cubic-bezier(0.22, 1, 0.36, 1) spring physics cleanly restores all detached UI back into place!
```

---

## ⚡ Key Features & Innovations

### 1. The "Sacred Safe Zone" & Zero-Reflow Physics Bridge
- **Matter.js 2D Rigid-Body Simulation:** Detached UI components are assigned realistic mass, friction (`0.12`), and restitution (`0.38`), dynamically tumbling and colliding with static floor and wall boundaries.
- **In-Place Collapse Origin:** Elements collapse directly from their existing rendered positions rather than raining from the top of the browser screen.
- **Invisible Spacer Technique:** When elements tagged with `[data-physics-id]` detach into fixed coordinates, invisible placeholder `div`s with exact cached dimensions are injected into the layout. The central code editor **does not shift, flicker, or reflow by a single pixel**.
- **Decoupled 60fps RAF Loop:** Body coordinates drive DOM `style.transform` directly inside `requestAnimationFrame`—**zero React state re-renders** during the physics simulation.
- **Spring Restoration:** Uses a `cubic-bezier(0.22, 1, 0.36, 1)` transition to smoothly fly elements back to their initial screen coordinates upon recovery.

### 2. Multi-Stage Procedural Background Music (Web Audio API)
- **100% Zero External Audio Files:** Synthesizes custom background music soundtracks and sound effects natively in the browser:
  - **CALM (`trust >= 60`):** Ambient low-fi chord progression with soft filter modulation.
  - **SUSPICIOUS / BETRAYAL (`trust 35–59`):** Dark, detuned pulsating bassline with escalating harmonic dissonance.
  - **BOSS / MELTDOWN (`trust 0–34`):** High-tempo urgent synth arpeggios simulating server meltdown.
  - **Audio Engine Controls:** One-click `[🎵 MUSIC: ON/OFF]` in the TopBar and master volume in Settings, complying with browser autoplay policies.

### 3. Comment-Based Coding Challenges (Q1 through Q7)
The editor features 7 progressive JavaScript coding challenges written directly in the code comments, each tied to a specific Git branch:
- **Q1: The Coffee Machine Compiler** (`feature/coffee-engine`) — Bracket Matching
- **Q2: The "var" Purge** (`refactor/ban-var`) — ES2026 Modern Standard Refactor
- **Q3: Prize Pool Splitter** (`fix/prize-pool`) — Mismatched Bracket Alignment
- **Q4: Zero-Day Midnight Production Ship** (`release/v1.0-midnight-ship`) — Dual Fix
- **Q5: Infinite Loop Breaker** (`hotfix/infinite-loop`) — Algorithmic Safeguard
- **Q6: Koramangala Pitch Deck** (`feat/ai-pitch-deck`) — String & Template Syntax
- **Q7: Git Merge Conflict Resolution** (`chaos/merge-conflict`) — Marker Cleanup

When a challenge is solved, the OS plays a victory chime, awards **+15 Trust HP**, displays a congratulatory celebration banner, and auto-advances to the next challenge!

### 4. 1-Click "Correct Answer" & Bug Preset Injectors
Adjacent to the **`▶ RUN CODE`** button, users and judges can test instant reactions:
- **`[✨ Correct Answer]`**: Loads the verified, working solution for whichever question is active.
- **`[💥 Missing "}"]`**: Injects an unclosed bracket syntax fracture (-15 HP).
- **`[🚫 Illegal "var"]`**: Injects deprecated ES5 syntax to trigger modern compiler roasts (-15 HP).
- **`[⚠️ Missing ";"]`**: Injects code missing mandatory semicolons (-10 HP).
- **`[💀 Combo Bugs]`**: Injects multiple simultaneous syntax fractures to trigger rapid mental breakdown!

### 5. Visual Code Glitch & Integrity Breakdown
When syntax errors or trust penalties occur:
- **Editor Jolt:** The editor physically shakes with `anim-code-jolt`.
- **Chromatic Aberration:** CRT text shadow split (cyan & hot red).
- **Skull Line Indicators:** Line numbers on error lines turn into pulsing crimson skulls (`💀`).
- **Scanline Glitch Tears:** Subtle digital scanline sweeps across the code buffer.

### 6. Interactive Left Navigation Bar & Drawer
Clicking any icon on the left rail opens an expandable, neo-brutalist tool drawer:
- **⚙️ Settings & Themes:**
  - **5 Selectable Themes:** *Neo Arcade (Default)*, *Cyberpunk Neon*, *Matrix Terminal*, *Vaporwave 1984*, and *Filter Coffee*.
  - **Audio & Visual Options:** BGM/SFX toggles, auto-advance countdown, CRT scanlines, and Mascot attitude (*Savage Bangalore Roast* vs *Polite*).
  - **Judge Hotkeys:** Instant trigger buttons for 60s demo evaluations.
- **🌿 Git Branches & Challenges:** Switch between 7 challenge branches with 1-click branch checkout, commit simulator, and force push warnings.
- **🔍 Search & Replace:** Live token search across active code and challenge files with case-sensitivity and 1-click replace.
- **📁 Project Explorer:** Browse challenge files, view the Silk Board auto driver contract, or inspect the forbidden `secret_keys.env` file.
- **🐛 Runtime Debugger:** Live watchers for Trust HP, OS mood, memory footprint, and garbage collection sweep.
- **📦 Add-ons Marketplace:** Toggle Bengaluru extensions (*Silk Board Traffic Bypass*, *Filter Coffee Daemon*, *Sarcastic Rubber Duck Roaster*).

### 7. Upgraded Recovery Challenges
- **🎮 Bug Smasher Server Core:**
  - Whack-a-mole style server rack arcade game.
  - **Good Patches (+PTS):** Syntax Fixes, Hotfix Patches, Clean Refactors, and Caffeine Boosts.
  - **Bad Traps (-PTS):** "DROP PROD DB" skulls, Memory Bombs, and Kernel Panics.
  - **Dynamic Speed Escalation:** Speed accelerates up to 2.5x as the 35s timer counts down! Target: 160 pts.
- **🎲 Tech Lead Dare Roulette:**
  - Spin the wheel to receive hilarious developer dares and physical recovery challenges.

---

## ⚡ Hackathon Judge Speedrun & Hotkeys

Designed specifically for rapid 60–90 second live hackathon judging rounds:

| Trigger / Action | Method | Description |
| :--- | :---: | :--- |
| **Emergency Chaos Hotkey** | `~` or `Ctrl + Shift + K` | Instantly drops Trust to 0% and triggers full physics collapse. |
| **Instant Judge Reset** | `Shift + Escape` | **Sub-millisecond instant reset (<1ms):** Restores state machine, physics bodies, and code editor without reloading the browser page. |
| **Judge Demo Bar** | Top Viewport Strip | Dedicated quick-trigger buttons: *Force Mistake*, *Simulate Spam*, *Touch Prod DB*, *Trigger Meltdown*, *Trigger Boss Fight*, and *Simulate Recovery*. |
| **One-Click Auto-Solve** | `✨ Correct Answer` | Instantly loads the working solution for immediate celebration and trust restore. |

---

## 🛠️ Tech Stack & Zero-Dependency Architecture

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite |
| **Styling & Effects** | Tailwind CSS, Neo-Brutalist 3D Shadows, Custom Keyframe Tremors, Lucide React |
| **2D Physics Engine** | Matter.js (Rigid-body, collision detection, gravity, restitution) |
| **Audio Engine** | 100% Native Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`, procedural synth) |
| **State Machine** | Deterministic React Context + `useReducer` Relationship Store |
| **Runtime Dependencies** | **Zero external backend or LLM API calls.** Everything executes deterministically client-side. |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sagarrathi16/SkillIssue.exe.git
cd SkillIssue.exe

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Test Suite

Run the full deterministic test suite covering state transitions, physics snapshots, audio recovery, auto negotiation, and end-to-end user journeys:

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
├── AGENTS.md                      # Operational rules & non-negotiable physics constraints
├── package.json
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx                   # React root mount
    ├── index.css                  # Neo-brutalist styles, theme variables, and glitch animations
    ├── app/
    │   ├── App.jsx                # Root layout & global hotkey listeners
    │   └── osStateMachine.js      # Single source of truth (trust, mood, events, history)
    ├── components/
    │   ├── Workspace.jsx          # Desktop workspace container layout
    │   ├── TopBar.jsx             # Window controls, branch breadcrumb, music toggle, Reset button
    │   ├── Sidebar.jsx            # Left navigation icon rail + "Drop Prod DB" hazard button
    │   ├── SidebarDrawer.jsx      # Expandable drawer: Themes, Git Branches, Search, Files, Debug, Add-ons
    │   ├── MiniEditor.jsx         # Sacred Safe Zone: Challenge prompts, presets, Run Code, terminal
    │   ├── StatusPanel.jsx        # Telemetry HUD: Trust HP, Mood, Event log, CPU load
    │   ├── SystemToast.jsx        # Compiler error & behavior warning toasts
    │   ├── RoastAssistant.jsx     # Typewriter subtitles, emotional mascot avatar, sound triggers
    │   ├── RecoveryModal.jsx      # Delayed recovery overlay with game & dare options
    │   ├── DebugDemoBar.jsx       # Quick trigger bar for hackathon judges
    │   └── games/
    │       ├── BugSmasherGame.jsx # Server Core arcade game (Good boxes vs Bad traps, speed multiplier)
    │       └── DareRoulette.jsx   # Tech Lead dare roulette challenge
    ├── physics/
    │   └── PhysicsWorld.js        # Matter.js world runner, static boundaries, placeholder injector
    ├── audio/
    │   └── AudioManager.js        # Procedural Web Audio API synth, BGM stages, SFX chimes
    └── logic/
        ├── mistakeDetector.js     # 7 Challenges, bug presets, branches, themes, syntax validator
        ├── dialogueSelector.js    # Context-aware roast selector and behavioral memory callbacks
        └── negotiationMachine.js  # Bengaluru auto-rickshaw negotiation state graph
```

---

## 💡 Team & Hackathon Credits

Built with ❤️, filter coffee, and chaotic energy for **CodeDay Bengaluru 2026**.  
*“The bug is fixed. The emotional damage remains.”*
