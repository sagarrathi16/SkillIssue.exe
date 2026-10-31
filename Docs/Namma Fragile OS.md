# Namma Fragile OS — Updated CodeDay PRD

## One-line pitch

A normal-looking desktop workspace with an emotionally fragile operating system. Make a small mistake and the OS takes it personally: it complains, the interface shakes, UI components detach and fall under gravity, and the user must apologise or complete a Bengaluru-themed recovery challenge to rebuild the workspace.

> “An operating system that has feelings. Unfortunately, they're hurt.”
> 

## 1. Product overview

**Namma Fragile OS** is a playful, interactive web experience disguised as a productivity workspace or lightweight coding environment. Its central mechanic is that the interface has an escalating emotional state. The more mistakes the user makes, the more unstable and theatrical the operating system becomes.

The project is designed as an entertaining live demo, not as a serious productivity product. The objective is to create a memorable interaction that combines frontend engineering, 2D physics, sound design, browser audio APIs, and distinctly Bengaluru-flavoured humour.

**Working name:** SynapseX
**Alternative name:** Sorry.exe — Bengaluru Edition
**Format:** Browser-based interactive desktop/workspace
**Primary experience:** Make a mistake → offend the OS → watch the UI collapse → apologise or complete a challenge → restore the workspace.

## 2. The experience we are building

At first, the application should look credible: a clean desktop workspace with a navigation bar, toolbar, panels, a small code editor, status indicators, and familiar controls. A judge should initially believe they are looking at a normal utility application.

The first mistake causes a subtle reaction: d. Further mistakes escalate the reaction. Eventually, interface elements detach, rotate, collide, bounce, and collect at the bottom of the viewport like physical objects.

The operating system then refuses to restore itself automatically. The user must complete a recovery interaction. The preferred recovery path is a spoken apology, with a Bengaluru auto-rickshaw negotiation challenge as a second, more theatrical route.

The final recovery animation should make the interface pieces fly back into position, snap into place, and return the workspace to normal.

## 3. Design principles

- **Strong contrast:** The initial interface should look polished and restrained. The breakdown should be funny, surprising, and visually unmistakable.
- **Escalation:** A single mistake should not immediately destroy the entire screen. Build anticipation through distinct stages.
- **User agency:** The user should always have a clear way to recover. Never trap them in a broken state.
- **Work preservation:** The editor contents and user input must survive the visual collapse. The UI can break; the user's work should not.
- **Demo reliability:** Core interactions must work offline or without external AI dependencies. No network call should be required for the main demo.
- **Accessibility and consent:** Microphone access must be optional, clearly explained, and backed by a button-based alternative. Audio should be headphone-friendly and controllable.

## 4. Target user and demo audience

**Primary audience:** CodeDay participants, mentors, and judges who can try the project themselves.

**Secondary audience:** Developers and students who enjoy playful interfaces, game-like interactions, and experimental frontend projects.

**What we want a judge to experience:** Within roughly one minute, they should understand the premise, make a mistake, see the interface physically collapse, hear the assistant roast them, and successfully restore the system.

## 5. Core feature set

### 5.1 Normal workspace

Build a compact desktop-like workspace with:

- Top navigation bar and window controls.
- Left sidebar with a few app/navigation items.
- Central mini code editor with syntax highlighting or a convincing lightweight editor.
- A small status panel showing OS mood and workspace integrity.
- A few clickable toolbar buttons and notifications.
- A clear reset/demo-start action.

Keep the surface area controlled. The app does not need to become a complete IDE or general-purpose productivity suite.

### 5.2 Mistake detection

Mistakes are events that increase the OS's irritation score. Use predictable, deterministic triggers for the demo:

- A deliberately invalid code snippet or missing bracket in the mini editor.
- Clicking a sensitive button repeatedly in a short interval.
- Failing a small Bengaluru-themed security question or CAPTCHA.
- Optional: pressing a forbidden or clearly labelled “Do not touch” control.

Do not build a full compiler or language server for the hackathon. A small set of deterministic syntax checks is sufficient for a repeatable demonstration. Clearly distinguish simulated checks from genuine code validation.

### 5.3 Emotional state and escalation engine

Represent the OS mood as a small finite-state machine. Suggested states:

| State | Example behaviour | UI response |
| --- | --- | --- |
| Calm | Normal operation | No effects |
| Irritated | First mistake | Sigh, subtle shake, sarcastic toast |
| Offended | Repeated mistakes | Stronger shake, warning banners, buttons wobble |
| Meltdown | Threshold reached | UI elements detach and fall |
| Recovery required | Workspace is broken | Apology prompt or Bengaluru challenge |
| Recovered | User completes recovery | Elements fly back and UI resets |

Keep the state machine separate from presentation code. Use a single source of truth for the current state, mistake count, and recovery status.

Possible scoring model: increment an irritation score for each mistake, then transition at configured thresholds. Tune the values during testing so the experience escalates quickly enough for a live demo but still has a visible build-up.

### 5.4 Physics-based UI collapse

Use Matter.js to create a 2D physics world for selected interface components.

Candidate objects:

- Navigation bar.
- Toolbar buttons.
- Sidebar tiles.
- Floating panels.
- Toast notifications.
- Desktop icons.

Implementation approach:

1. At the start, render the interface normally using React and CSS.
2. When meltdown begins, capture the screen-space positions and dimensions of selected elements.
3. Create corresponding Matter.js bodies at those positions.
4. Switch those elements into a physics-controlled layer.
5. Apply gravity, a small initial impulse, and collision boundaries.
6. Keep a static recovery overlay above the debris so the user can still interact.
7. On recovery, animate elements back to their original positions and re-enable normal layout.

**Important engineering constraint:** React/CSS layout and Matter.js must not both continuously control the same element's position. During physics mode, let the physics layer own transforms. Preserve the underlying React state and editor text separately.

Use a limited number of physics bodies and avoid simulating every character or every DOM node. The central editor can remain readable or become visually shielded while the surrounding chrome collapses.

### 5.5 Theatrical voice assistant

The voice assistant should feel like the OS has a personality. Use short, timed voice lines rather than long speeches.

Audio strategy:

- Record a small set of original voice lines.
- Optionally use pitch shifting or audio processing to create a distinctive character.
- Trigger different lines based on the escalation state.
- Include a text transcript so the joke still lands if audio is muted.
- Provide a mute control and visible volume indicator.

Because speakers may not be usable at the venue, make headphone use the default assumption. Do not autoplay audio before the user has interacted with the page; browser autoplay restrictions and venue conditions make this unreliable.

Example lines (drafts; record and refine these):

- “One bracket. ONE BRACKET. Is this how you write code?”
- “Ayyo. I trusted you with a toolbar.”
- “Meter haakamma, even Silk Board traffic moves faster than your typing!”
- “I am not crashing. I am emotionally unavailable.”

Keep the humour playful rather than personal or abusive. The roast should target the mistake or the absurd situation, not a real user attribute.

### 5.6 Apology recovery mechanic

The primary recovery mechanic is a spoken apology.

Suggested flow:

1. The screen enters recovery-required mode.
2. A clear prompt asks the user to apologise to the OS.
3. The user explicitly chooses to enable the microphone.
4. The browser requests microphone permission.
5. Web Audio API analyses the live audio signal.
6. The app checks a minimum duration and a simple volume threshold.
7. Optionally, speech recognition checks for a small set of apology phrases, where supported.
8. A successful attempt triggers the recovery animation.

**Do not treat volume or pitch as proof of sincerity.** They are only playful interaction signals. A loud or quiet voice is not a reliable measure of emotion.

Fallbacks:

- A “Type your apology” option.
- A button-based recovery action.
- The Bengaluru Boss CAPTCHA route.

Do not store or upload microphone audio. Prefer in-browser analysis and stop the microphone tracks immediately after the interaction. Explain permission use before requesting it.

### 5.7 Bengaluru Boss CAPTCHA: auto-rickshaw negotiation

This is the signature side quest and the climax of the demo.

Premise: The OS refuses to recover until the user negotiates with a stubborn Bengaluru auto-rickshaw driver who must agree to take the user to Indiranagar.

Example conversation:

- Driver: “Indiranagar ah? 350 rupees.”
- User: “Anna, meter haaki.”
- Driver: “Meter? Naanu developer alla, auto driver!”
- User: “200 kodthini.”
- Driver: “Ayyo, traffic nodidya? 400.”

The user chooses from a few dialogue options. Each option changes the driver's willingness. The goal is to reach an acceptable fare or convince the driver to use the meter.

Implementation:

- Use a deterministic dialogue tree or small state machine.
- Keep dialogue branches short and easy to test.
- Track a negotiation score or driver mood.
- Make success and failure outcomes clear.
- On success, approve system recovery.
- On failure, allow another attempt or return to apology recovery.

A scripted state machine is preferred over a live AI API. It is cheaper, faster, works offline, and produces a reliable judge demo. AI-generated variations can be a stretch goal only after the scripted path is complete.

## 6. The complete user journey

1. **Arrival:** User opens the application and sees a clean, ordinary-looking workspace.
2. **Discovery:** User interacts with the mini editor or workspace controls.
3. **First mistake:** The OS sighs, shakes one element, and displays a sarcastic toast.
4. **Escalation:** Additional mistakes increase the irritation score. More UI elements wobble and detach.
5. **Meltdown:** The selected interface components fall into a physics pile. The workspace becomes unstable.
6. **Roast:** The assistant plays a context-aware voice line and displays its transcript.
7. **Recovery choice:** User chooses spoken apology or Bengaluru Boss CAPTCHA.
8. **Challenge:** User completes the recovery interaction.
9. **Reconstruction:** UI pieces fly back into their original positions; the workspace is restored.
10. **Payoff:** The OS displays a final line, such as “Apology accepted. Don't make me do this again.”

## 7. Recommended technical architecture

**Frontend**

- React for component structure and UI state.
- Vite for a fast development server and build.
- Tailwind CSS or a small CSS system for styling.
- Framer Motion for UI transitions, micro-interactions, and recovery animation.

**Physics**

- Matter.js for rigid-body simulation, gravity, collision, and constraints.
- A dedicated physics controller that maps selected UI elements to Matter.js bodies.

**Audio**

- Web Audio API for microphone stream analysis, volume measurement, and optional pitch estimation.
- HTML Audio or Web Audio playback for pre-recorded voice lines.
- Optional browser speech recognition for checking apology phrases; treat this as an enhancement because browser support varies.

**Logic**

- A central OS state machine for mood, irritation score, meltdown, and recovery.
- A deterministic mistake detector.
- A scripted dialogue state machine for the auto-rickshaw CAPTCHA.

**Deployment**

- Vercel or another static hosting platform.
- Keep the core app client-side so the demo does not depend on a backend.

### Suggested component structure

```
src/
  app/
    App.jsx
    osStateMachine.js
    demoConfig.js
  components/
    Workspace.jsx
    TopBar.jsx
    Sidebar.jsx
    MiniEditor.jsx
    StatusPanel.jsx
    SystemToast.jsx
    RoastAssistant.jsx
    RecoveryModal.jsx
    AutoNegotiation.jsx
  physics/
    PhysicsWorld.js
    shatterElements.js
    restoreElements.js
  audio/
    AudioManager.js
    MicrophoneAnalyzer.js
    voiceLines.js
  logic/
    mistakeDetector.js
    negotiationMachine.js
  styles/
    workspace.css
    chaos.css
```

This is a suggested structure, not a requirement. Keep the architecture simpler if the team is small.

## 8. MVP scope: what must work

The project is considered demo-ready when all of the following work reliably:

- [ ]  The initial workspace looks intentional and polished.
- [ ]  A user can trigger at least two deterministic mistake types.
- [ ]  Mistakes cause visibly different escalation states.
- [ ]  At least several UI components physically fall using Matter.js.
- [ ]  The editor text survives the collapse.
- [ ]  Voice lines play after user interaction and have visible text transcripts.
- [ ]  The user can recover without microphone permission.
- [ ]  At least one recovery route completes successfully.
- [ ]  The interface returns to its original state without layout corruption.
- [ ]  A reset action reliably returns the app to the start.
- [ ]  The demo works in the target browser at the venue.

## 9. Prioritised build plan

### P0 — Core loop first

- [ ]  Build the normal workspace.
- [ ]  Implement the OS mood state machine.
- [ ]  Add deterministic mistake triggers.
- [ ]  Implement the Matter.js collapse for a small number of UI elements.
- [ ]  Preserve editor content through meltdown.
- [ ]  Implement a button-based recovery route and restoration animation.

### P1 — Personality and stagecraft

- [ ]  Record and integrate several short voice lines.
- [ ]  Add subtitles/transcripts for every voice line.
- [ ]  Add the apology interaction.
- [ ]  Add microphone permission explanation and fallback.
- [ ]  Polish timing, shaking, notification styling, and transitions.

### P2 — Signature Bengaluru moment

- [ ]  Build the auto-rickshaw negotiation dialogue tree.
- [ ]  Add at least two possible negotiation paths.
- [ ]  Connect successful negotiation to recovery.
- [ ]  Add unique driver voice lines or expressive text reactions.

### P3 — Stretch goals only

- [ ]  More nuanced pitch or voice interaction.
- [ ]  Additional physics objects and environmental effects.
- [ ]  More dialogue branches.
- [ ]  Optional AI-generated dialogue variations.
- [ ]  Additional workspace themes or hidden easter eggs.

If time becomes constrained, cut stretch goals before compromising the core collapse-and-recovery loop.

## 10. Team work split

For a team of three:

| Role | Ownership |
| --- | --- |
| Frontend / UI | Workspace, editor, responsive layout, visual polish |
| Physics / interaction | Matter.js world, detach/collapse, restore animation |
| Logic / audio | State machine, mistake detection, voice lines, apology, CAPTCHA |

For a team of two, combine UI with physics and logic with audio. Agree on component interfaces and event names before parallel implementation.

Suggested shared events:

- `MISTAKE_DETECTED`
- `OS_STATE_CHANGED`
- `MELTDOWN_STARTED`
- `RECOVERY_REQUESTED`
- `APOLOGY_ACCEPTED`
- `NEGOTIATION_WON`
- `WORKSPACE_RESTORED`
- `RESET_DEMO`

## 11. Risks and mitigations

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Physics integration becomes time-consuming | DOM layout and physics transforms can conflict | Simulate only selected elements; isolate physics layer |
| Microphone permission is denied | The main recovery path may fail | Provide typed and button-based recovery |
| Browser speech recognition is unsupported | Apology phrase detection may not work consistently | Treat speech recognition as optional; use duration/volume or fallback |
| Audio cannot be heard at venue | The roast may be missed | Headphone-friendly playback, subtitles, mute/volume control |
| External AI/network fails | Demo becomes unreliable | Use deterministic local dialogue |
| Interface loses user input | Frustrating and damages the demo | Keep editor state independent of physics rendering |
| Escalation is too slow or too fast | The demo loses its payoff | Add a demo mode and tune thresholds |
| Too many features are attempted | Core loop remains unfinished | Freeze scope around collapse, roast, and recovery |

## 12. Demo script for judges

**Target length:** 60–90 seconds.

1. Open with the clean workspace. Say: “This is Namma Fragile OS. It looks like a normal workspace, but it has one problem: it takes bugs personally.”
2. Type or trigger a deliberately broken line of code.
3. Let the system react subtly. Make one or two more mistakes.
4. Trigger the meltdown. Allow the UI to detach and fall while the editor content remains safe.
5. Let the assistant deliver a Bengaluru-themed roast with a visible transcript.
6. Choose the auto-rickshaw challenge. Negotiate the fare until the driver agrees.
7. Trigger the restoration animation.
8. Finish with: “The bug is fixed. The emotional damage remains.”

The judge should be able to repeat the interaction themselves. Include a visible reset button so the demo can be replayed immediately.

## 13. Product boundaries and non-goals

This is not intended to be:

- A full production code editor.
- A real operating system or OS-level utility.
- A productivity tool that genuinely punishes users for mistakes.
- A voice emotion detector.
- A live AI chatbot requiring an API key.
- A complex physics sandbox in which every DOM node is simulated.

The goal is a controlled, repeatable interactive performance with enough real engineering to demonstrate technical skill.

## 14. Success criteria

**Technical success**

- The state machine has predictable transitions.
- Physics interactions are smooth enough at the target screen size.
- Recovery returns the interface to a valid state.
- User-entered code remains intact.
- No external service is required for the core experience.

**Experience success**

- A first-time user understands the premise quickly.
- The first mistake produces an understandable reaction.
- The collapse is visually obvious and entertaining.
- The roast is audible or readable.
- Recovery feels earned and satisfying.
- A judge can replay the demo without developer intervention.

**Presentation success**

- The clean workspace creates a strong before/after contrast.
- The physics collapse is the main visual highlight.
- Bengaluru humour is specific but understandable.
- The demo has a clear ending and can be reset instantly.

## 15. Final project statement

Namma Fragile OS is a browser-based interactive workspace with an emotionally unstable operating system. It uses a finite-state escalation engine, Matter.js physics, theatrical voice feedback, and playful recovery challenges to turn ordinary user mistakes into a chaotic visual experience. The workspace appears normal until the user makes mistakes; then the interface physically collapses, the system complains, and the user must apologise or negotiate with a Bengaluru auto-rickshaw driver to restore it.

**North-star demo loop:** One tiny mistake. One offended OS. One spectacular collapse. One Bengaluru-flavoured apology. One satisfying recovery.

## 16. Immediate next actions

- [ ]  Create the React + Vite project.
- [ ]  Build the static workspace shell before adding effects.
- [ ]  Define the OS state machine and mistake thresholds.
- [ ]  Make three UI components fall with Matter.js.
- [ ]  Preserve editor state through the collapse.
- [ ]  Add one voice line and one recovery action.
- [ ]  Test the full loop on the actual demo browser and screen size.
- [ ]  Add the auto-rickshaw negotiation only after the core loop is stable.

---

# PRD v2 — Product direction and recommended changes

**Status:** This section supersedes conflicting scope and product-direction decisions in earlier sections. Keep earlier implementation notes where they remain compatible.

## 1. Sharpened product definition

**Namma Fragile OS** is a browser-based desktop workspace with a Bengaluru-flavoured personality and a persistent memory of how the user treats it. It begins as a polished, ordinary workspace. As the user makes mistakes, ignores warnings, or repeatedly abuses controls, the OS becomes increasingly offended. Its emotional state changes the interface, dialogue, and recovery difficulty. At high escalation, selected interface components physically detach and fall under real 2D physics. The user must repair the relationship to restore the workspace.

**Core premise:** The OS is not randomly glitching. It remembers what the user did and reacts as if a relationship is deteriorating.

**Updated tagline:** “An operating system that remembers every mistake. Unfortunately, it takes them personally.”

**Product format:** A compact fake desktop/workspace with a small interactive code editor—not a full IDE and not a collection of unrelated productivity apps.

## 2. Key differentiator: relationship memory

This is the most important product upgrade. The system must feel like one character with a memory, not a sequence of disconnected animations.

Track a small set of local session variables:

- mistakeCount: total detected mistakes.
- ignoredWarnings: warnings the user dismisses or ignores.
- rapidClickEvents: repeated clicks within a short interval.
- apologyAttempts: number of recovery attempts.
- trust: relationship score, bounded from 0 to 100.
- mood: current emotional state.
- eventHistory: a short list of the most recent meaningful actions.

Use deterministic rules. Example behaviour:

- A first syntax mistake causes a small trust decrease and a sarcastic notification.
- Fixing the mistake promptly limits the trust loss.
- Ignoring a warning or repeating the same mistake causes a larger decrease.
- A successful apology or challenge restores some trust, but not necessarily all of it.
- The OS can refer to a previous action in later dialogue: “You ignored my warning three times. THREE.”

Do not build a complex AI memory system. A local event log and a few rules are enough to create the illusion of continuity. Keep memory within the current demo session; persistent storage across browser sessions is optional and out of scope for the MVP.

## 3. Emotional state and escalation model

Use one finite-state machine driven by trust, event history, and explicit recovery transitions.

| State | Trigger / condition | Behaviour |
| --- | --- | --- |
| Calm | Trust 80–100 | Normal workspace; occasional personality hints |
| Slightly Annoyed | Trust 60–79 or first mistake | Small shake, sigh, sarcastic toast |
| Personal Betrayal | Trust 35–59 or repeated ignored warnings | Toolbar wobbles, warning banners, sharper voice lines |
| Mental Breakdown | Trust 1–34 | Multiple selected UI elements detach; stronger visual/audio reactions |
| Bengaluru Boss Fight | Trust reaches 0 or user selects challenge recovery | Workspace is locked behind the negotiation mini-game |
| Recovery | User completes an approved recovery action | UI components reassemble; trust partially recovers |
| Calm / Recovered | Recovery animation completes | Workspace is usable; event history remains for callbacks |

Tune thresholds after testing. This table is a design baseline, not a claim that the app can infer real human emotions. The OS is role-playing an emotional character based on observable app events.

## 4. Mistake and behaviour detection

Prioritise reliable, demonstrable triggers:

1. **Code mistakes:** Use a real lightweight parser or deterministic checks for a deliberately limited JavaScript subset. Prefer a parser such as Acorn if setup time allows; otherwise label checks as demo rules rather than claiming full syntax validation.
2. **Repeated actions:** Detect rapid repeated clicks on selected controls using event timestamps.
3. **Ignored warnings:** Track whether the user dismisses a warning without correcting the underlying issue.
4. **Repeated mistakes:** Recognise when the same error is triggered again after a warning.
5. **Challenge outcomes:** A failed auto-rickshaw negotiation can lower trust or trigger a new reaction.

Avoid arbitrary punishment for every click. Each trigger should have a clear cause, visible feedback, and a way to recover.

## 5. Physics collapse: controlled, staged, and readable

Matter.js remains the main technical spectacle, but the physics should communicate escalation.

- **Slightly Annoyed:** CSS shake, flicker, tiny tilt; no full physics.
- **Personal Betrayal:** Selected toolbar controls and notifications wobble or detach.
- **Mental Breakdown:** Navigation bar, sidebar tiles, floating panels, and desktop icons fall and collide under Matter.js gravity.
- **Boss Fight:** Keep a stable challenge/recovery panel accessible above the debris.

The code editor, typed content, recovery controls, and reset action must remain safe and usable. Do not simulate every DOM node. Use a dedicated physics layer and transfer selected elements to physics control only when the state machine enters the relevant stage. On recovery, animate the pieces back to their original positions and restore normal layout ownership.

## 6. Character, voice, and original creative direction

The OS should feel like a consistent Bengaluru character: impatient, dramatic, witty, and occasionally forgiving. It should not be a generic insult generator.

Create original assets during the project:

- A distinctive OS mascot or system avatar.
- Custom icons and notification styling.
- A short boot sequence and shutdown/recovery animation.
- Original voice acting in a consistent Kannada / Bengaluru-English / Hinglish style.
- A small sound palette: sigh, warning, crack, falling UI, repair, and success.
- A visual mood language that evolves with trust.

Write dialogue that refers to the user's actual recent behaviour. Example lines:

- First mistake: “Ayyo, one bracket. Let's not start the day like this.”
- Repeated mistake: “I already told you. Were you listening or just decorating the keyboard?”
- Ignored warning: “You dismissed my warning and then did the exact same thing.”
- Low trust: “This is no longer a workspace. This is a toxic relationship.”
- Recovery: “Fine. I'll restore the toolbar. Trust is still loading.”

Keep jokes focused on the interaction and the fictional OS. Avoid targeting a user's identity or personal traits. Audio must be user-initiated, headphone-friendly, captioned, and muteable.

## 7. Recovery mechanics

### Primary: apology

Offer both voice and text recovery. Microphone access must be optional. Web Audio API can detect that audio was supplied and measure simple signal properties, but volume or pitch must never be presented as a measurement of sincerity. If speech recognition is unavailable, typed apology and button-based recovery must still work.

Recovery should be contextual: if the user ignored multiple warnings, a one-word apology may not fully restore trust. Use deterministic rules such as a short apology phrase plus a confirmation action, or a small repair task.

### Signature challenge: Bengaluru auto-rickshaw negotiation CAPTCHA

Keep this as the memorable optional boss fight, not a separate product. Use a scripted branching dialogue tree, not a live AI dependency. Choices affect driver mood, fare, and the next available response. A successful negotiation unlocks full system restoration. A failed attempt should be funny and retryable, not a dead end.

The challenge should be short enough to complete during a 60–90 second judge demo. Use original dialogue and voice lines where possible.

## 8. Revised user journey

1. User opens a clean, convincing desktop workspace.
2. User interacts with the mini editor or workspace controls.
3. The OS detects a mistake and reacts at the lowest escalation level.
4. User fixes or ignores the warning; the OS records the choice.
5. Further mistakes and ignored warnings change trust and mood.
6. The OS references the user's previous actions, making its memory visible.
7. At high escalation, selected interface components physically collapse under Matter.js.
8. The user chooses an apology or the auto-rickshaw negotiation challenge.
9. The OS evaluates the deterministic recovery conditions and partially restores trust.
10. UI pieces reassemble; the OS delivers a context-aware closing line.
11. The judge can reset and replay the experience immediately.

## 9. Revised scope priorities

### P0 — Must ship

- [ ]  Polished fake desktop/workspace with one mini code editor.
- [ ]  Deterministic mistake detection for at least two trigger types.
- [ ]  Central state machine with trust score and event history.
- [ ]  At least one dialogue line that references a previous user action.
- [ ]  Three or more visible escalation levels.
- [ ]  Matter.js collapse for selected UI components.
- [ ]  Editor content and recovery controls survive collapse.
- [ ]  Reliable button/text recovery and a working restoration animation.
- [ ]  Reset/demo mode that reliably returns to the initial state.

### P1 — Strong differentiators

- [ ]  Original Bengaluru voice acting with subtitles.
- [ ]  Context-aware dialogue variants based on event history.
- [ ]  Optional microphone apology interaction with a clear permission explanation and fallback.
- [ ]  Auto-rickshaw negotiation mini-game with at least two branching paths.
- [ ]  Original mascot, icons, boot animation, and sound effects.

### P2 — Only if P0 and P1 are stable

- [ ]  Additional negotiation branches and driver voice acting.
- [ ]  More sophisticated code parsing.
- [ ]  Persistent trust history across reloads.
- [ ]  Extra physics objects and environmental effects.
- [ ]  Optional AI-generated dialogue variations (never required for the demo).

**Explicit cuts:** Do not build a full IDE, multiple productivity apps, a real operating system, a live AI chatbot, or a general-purpose voice emotion detector.

## 10. Updated technical architecture

Workspace UI → Mistake / Behaviour Detector → Event History → Trust & Mood State Machine → (Physics Controller + Dialogue / Audio Controller) → Recovery Controller → Workspace Restoration

Suggested modules:

- osStateMachine.js: mood, trust, transitions, recovery.
- eventHistory.js: append and retrieve recent session events.
- mistakeDetector.js: code and interaction triggers.
- dialogueSelector.js: choose context-aware lines from state and event history.
- PhysicsWorld.js: Matter.js bodies and collision boundaries.
- RecoveryController.js: apology and negotiation success rules.
- negotiationMachine.js: deterministic auto-rickshaw dialogue tree.
- AudioManager.js: voice lines, captions, mute, and playback state.

Keep all core logic client-side. Avoid backend and external API dependencies for the hackathon demo.

## 11. Judge-facing pitch

“Namma Fragile OS is a desktop workspace with a memory problem. It remembers every bug, every ignored warning, and every time you spam-clicked a button. As trust drops, its personality changes—and eventually the interface itself falls apart using a real-time physics engine. To get your workspace back, you have to apologise or negotiate with a Bengaluru auto driver. We built the character, voice acting, relationship state machine, physics interactions, and recovery game as one connected experience.”

## 12. Updated 60–90 second demo sequence

1. Show the polished workspace and introduce the OS as a system that remembers how you treat it.
2. Trigger a small code mistake. Show a subtle reaction and a trust change.
3. Ignore the warning or repeat the mistake. Make the OS reference the earlier event.
4. Trigger the full collapse. Let the judge see several UI elements fall under gravity while the editor content stays intact.
5. Play one original voice line and show its caption.
6. Start the auto-rickshaw negotiation challenge (or use the apology path if time is short).
7. Complete recovery and show the UI reassemble.
8. End with a context-aware line that refers to the user's behaviour, then reset for the next judge.

## 13. Revised acceptance criteria

The PRD is implemented when:

- A first-time user understands the premise within 10 seconds.
- At least two different user actions produce different consequences.
- The OS remembers at least the last three meaningful events during the session.
- Dialogue changes based on event history or trust state.
- Trust and mood transitions are deterministic and reproducible.
- At least three selected UI elements fall using Matter.js.
- The code editor and recovery controls remain functional during collapse.
- Recovery works without microphone permission or internet access.
- The auto-rickshaw challenge can be completed reliably if included in the demo.
- The interface can be restored and reset repeatedly without a page reload.
- Original creative assets (voice, visual identity, or sound design) are present and credited appropriately.

## 14. Product decision summary

**Keep:** Bengaluru humour, the offended OS premise, Matter.js collapse, voice reactions, apology recovery, and auto-rickshaw negotiation.

**Change:** Make the OS a persistent character with session memory and a trust/relationship model. The collapse must be the consequence of escalating behaviour, not a random visual effect.

**Narrow:** Build one convincing desktop workspace with one mini editor. Do not expand into several applications.

**Build order:** State machine + event history → mistake triggers → staged collapse → recovery → original voice/design assets → auto-rickshaw boss challenge.

**North-star experience:** The OS remembers what you did, takes it personally, falls apart in front of you, and makes you earn its forgiveness.