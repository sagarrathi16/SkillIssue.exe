import React, { useState } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { audioManager } from '../audio/AudioManager';
import { 
  CODING_CHALLENGES, 
  BRANCH_LIST, 
  OS_THEMES 
} from '../logic/mistakeDetector';
import { 
  X, 
  Settings, 
  GitPullRequest, 
  Search, 
  Files, 
  Bug, 
  Boxes, 
  Check, 
  Volume2, 
  VolumeX, 
  Music, 
  Zap, 
  Cpu, 
  Sparkles, 
  Flame, 
  FileCode, 
  Lock, 
  FileText, 
  GitBranch, 
  RotateCcw, 
  Play, 
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sliders,
  Palette
} from 'lucide-react';

export function SidebarDrawer({
  activeTab,
  onClose,
  currentTheme,
  onThemeChange,
  settings,
  onUpdateSettings,
  activeBranch,
  onSelectBranch,
  onSelectChallenge,
}) {
  const { state, actions } = useOS();
  const { mood, trust } = state;

  // Search local state
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState(null);

  // File explorer preview state
  const [filePreview, setFilePreview] = useState(null);

  // Debugger local state
  const [debugMemory, setDebugMemory] = useState(14.8);
  const [isGCActive, setIsGCActive] = useState(false);

  // Plugins local state
  const [pluginsState, setPluginsState] = useState({
    trafficBypass: true,
    coffeeDaemon: true,
    rubberDuck: true,
    vcPitch: false,
    crtScanlines: true,
  });

  const togglePlugin = (key) => {
    setPluginsState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      audioManager.playSfx('beep');
      return next;
    });
  };

  const handleCheckoutBranch = (branch) => {
    audioManager.playSfx('beep');
    if (onSelectBranch) {
      onSelectBranch(branch.name);
    }
    const challengeIdx = branch.challengeId - 1;
    if (onSelectChallenge) {
      onSelectChallenge(challengeIdx, branch.name);
    }
    window.dispatchEvent(new CustomEvent('select_challenge', {
      detail: { index: challengeIdx, branch: branch.name }
    }));
  };

  const handleFileClick = (file) => {
    audioManager.playSfx('beep');
    if (file.type === 'challenge') {
      if (onSelectChallenge) {
        onSelectChallenge(file.index);
      }
      window.dispatchEvent(new CustomEvent('select_challenge', {
        detail: { index: file.index, branch: file.name }
      }));
    } else if (file.type === 'secret') {
      setFilePreview({
        title: 'secret_keys.env (FORBIDDEN)',
        content: `# DO NOT COMMIT TO PUBLIC REPO!\nOPENAI_KEY=sk-proj-koramangala-billion-dollar-seed\nAUTO_ANNA_SECRET_TOKEN=silk_board_monsoon_surge_999\nDATABASE_URL=postgres://root:password123@prod-cluster:5432/namma_db\n\n# ⚠️ OS MASCOT COMMENT:\n# "Bro really committed credentials to github. Peak startup behaviour."`,
      });
      actions.reportMistake('COMMITTED_ENV_SECRET', 'Committed raw API keys and database password in .env!', 10);
    } else if (file.type === 'contract') {
      setFilePreview({
        title: 'auto_driver_contract.md',
        content: `# NAMMA BENGALURU AUTO RICKSHAW AGREEMENT\n\n1. Fare is Meter + ₹50 (monsoon surge +₹150).\n2. No Ola, No Uber, Cash only.\n3. Destination Indiranagar / Koramangala only if driver feels like going.\n4. Luggage fee extra.\n5. Complaining results in immediate drop at Silk Board junction.`,
      });
    }
  };

  const handleRunSearch = () => {
    if (!searchQuery.trim()) {
      setSearchFeedback(null);
      return;
    }
    // Search across coding challenges
    const results = [];
    CODING_CHALLENGES.forEach((ch, idx) => {
      const q = caseSensitive ? searchQuery : searchQuery.toLowerCase();
      const code = caseSensitive ? ch.starterCode : ch.starterCode.toLowerCase();
      if (code.includes(q)) {
        results.push({
          challengeIndex: idx,
          challengeTitle: ch.title,
          tag: ch.tag,
        });
      }
    });
    setSearchFeedback({
      query: searchQuery,
      results,
    });
  };

  const handleReplaceInEditor = () => {
    if (!searchQuery) return;
    window.dispatchEvent(new CustomEvent('editor_replace_text', {
      detail: { search: searchQuery, replace: replaceQuery }
    }));
    audioManager.playSfx('chime');
  };

  const handleInjectMemorySpike = () => {
    setDebugMemory(48.6);
    audioManager.playSfx('buzz');
    setTimeout(() => setDebugMemory(16.2), 3000);
  };

  const handleGarbageCollect = () => {
    setIsGCActive(true);
    audioManager.playSfx('chime');
    setTimeout(() => {
      setDebugMemory(11.4);
      setIsGCActive(false);
    }, 800);
  };

  const isAnnoyed = mood === OSMood.SLIGHTLY_ANNOYED;
  const isBetrayal = mood === OSMood.PERSONAL_BETRAYAL;

  const getTabTitle = () => {
    switch (activeTab) {
      case 'settings': return 'OS SETTINGS & THEMES';
      case 'git': return 'GIT BRANCHES & CHALLENGES';
      case 'search': return 'SEARCH & REPLACE';
      case 'files': return 'PROJECT EXPLORER';
      case 'debug': return 'RUNTIME DEBUGGER';
      case 'plugins': return 'ADD-ONS MARKETPLACE';
      default: return 'DRAWER';
    }
  };

  const getTabIcon = () => {
    switch (activeTab) {
      case 'settings': return Settings;
      case 'git': return GitPullRequest;
      case 'search': return Search;
      case 'files': return Files;
      case 'debug': return Bug;
      case 'plugins': return Boxes;
      default: return Sliders;
    }
  };

  const TabIcon = getTabIcon();

  return (
    <div
      data-physics-id="sidebar-drawer-panel"
      className="w-72 sm:w-80 bg-[#151624] border-r-2 border-black flex flex-col z-20 shadow-[4px_0px_0px_#000] overflow-hidden select-none shrink-0 font-sans"
    >
      {/* Drawer Header */}
      <div className="bg-[#1C1E2D] border-b-2 border-black px-3 py-2 flex items-center justify-between text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <div className="bg-[#FACC15] text-black font-black p-1 border border-black shadow-[1px_1px_0px_#000]">
            <TabIcon className="w-3.5 h-3.5" />
          </div>
          <span className="font-black text-white text-[11px] tracking-wide">
            {getTabTitle()}
          </span>
        </div>

        <button
          onClick={onClose}
          className="neo-btn bg-[#FF4365] hover:bg-red-400 text-white font-bold p-1 border border-black text-xs flex items-center justify-center shadow-[1px_1px_0px_#000]"
          title="Close drawer"
        >
          <X className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* Drawer Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 text-xs flex flex-col gap-3 font-mono">
        {/* =========================================================================
            TAB 1: SETTINGS & THEMES
            ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-3.5">
            {/* 1. Themes Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[11px] border-b border-white/10 pb-1">
                <Palette className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>DESKTOP THEMES</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {OS_THEMES.map((theme) => {
                  const isCurrent = currentTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => onThemeChange(theme.id)}
                      className={`p-2 border-2 border-black text-left flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent 
                          ? 'bg-[#1F2238] shadow-[3px_3px_0px_#000] border-l-4 border-l-[#FACC15]' 
                          : 'bg-[#181928] hover:bg-[#1E2034] shadow-[1px_1px_0px_#000]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Theme Swatch Preview */}
                        <div 
                          className="w-5 h-5 border-2 border-black shadow-[1px_1px_0px_#000] shrink-0" 
                          style={{ backgroundColor: theme.accent }} 
                        />
                        <div>
                          <div className="font-black text-white text-[11px] flex items-center gap-1.5">
                            <span>{theme.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] bg-[#10B981] text-black font-black px-1 border border-black">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="text-[9px] text-slate-400 font-sans">
                            {theme.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="text-[9px] font-bold px-1.5 py-0.5 border border-black bg-black text-[#FACC15]">
                        {theme.tag}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Common Sound & Audio Options */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[11px] border-b border-white/10 pb-1">
                <Music className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>AUDIO ENGINE</span>
              </div>

              <div className="flex flex-col gap-1.5 bg-[#181928] p-2.5 border-2 border-black">
                <label className="flex items-center justify-between text-[11px] text-slate-200 cursor-pointer">
                  <span>Background Music (BGM)</span>
                  <input
                    type="checkbox"
                    checked={Boolean(settings?.soundBgm)}
                    onChange={(e) => onUpdateSettings('soundBgm', e.target.checked)}
                    className="accent-[#10B981] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-[11px] text-slate-200 cursor-pointer">
                  <span>UI Sound Effects (SFX)</span>
                  <input
                    type="checkbox"
                    checked={Boolean(settings?.soundSfx)}
                    onChange={(e) => onUpdateSettings('soundSfx', e.target.checked)}
                    className="accent-[#10B981] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-[11px] text-slate-200 cursor-pointer">
                  <span>Procedural Audio Synth</span>
                  <input
                    type="checkbox"
                    checked={Boolean(settings?.proceduralAudio)}
                    onChange={(e) => onUpdateSettings('proceduralAudio', e.target.checked)}
                    className="accent-[#10B981] w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 3. Visual & Compiler Options */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[11px] border-b border-white/10 pb-1">
                <Zap className="w-3.5 h-3.5 text-[#F43F5E]" />
                <span>VISUALS & COMPILER</span>
              </div>

              <div className="flex flex-col gap-1.5 bg-[#181928] p-2.5 border-2 border-black">
                <label className="flex items-center justify-between text-[11px] text-slate-200 cursor-pointer">
                  <span>Auto-Advance to Next Question</span>
                  <input
                    type="checkbox"
                    checked={Boolean(settings?.autoAdvance)}
                    onChange={(e) => onUpdateSettings('autoAdvance', e.target.checked)}
                    className="accent-[#10B981] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-[11px] text-slate-200 cursor-pointer">
                  <span>Code Jolt on Compiler Error</span>
                  <input
                    type="checkbox"
                    checked={Boolean(settings?.codeJolt)}
                    onChange={(e) => onUpdateSettings('codeJolt', e.target.checked)}
                    className="accent-[#10B981] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-[11px] text-slate-200 cursor-pointer">
                  <span>CRT Scanline Glitch Tears</span>
                  <input
                    type="checkbox"
                    checked={Boolean(settings?.crtScanlines)}
                    onChange={(e) => onUpdateSettings('crtScanlines', e.target.checked)}
                    className="accent-[#10B981] w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 4. Mascot Attitude */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[11px] border-b border-white/10 pb-1">
                <Flame className="w-3.5 h-3.5 text-[#FB7185]" />
                <span>MASCOT ROAST LEVEL</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => onUpdateSettings('mascotAttitude', 'savage')}
                  className={`py-1.5 px-2 border-2 border-black text-[10px] font-bold ${
                    settings?.mascotAttitude === 'savage'
                      ? 'bg-[#FF4365] text-white shadow-[2px_2px_0px_#000]'
                      : 'bg-[#181928] text-slate-300'
                  }`}
                >
                  🌶️ SAVAGE ROAST
                </button>
                <button
                  onClick={() => onUpdateSettings('mascotAttitude', 'polite')}
                  className={`py-1.5 px-2 border-2 border-black text-[10px] font-bold ${
                    settings?.mascotAttitude === 'polite'
                      ? 'bg-[#10B981] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-[#181928] text-slate-300'
                  }`}
                >
                  😇 POLITE MODE
                </button>
              </div>
            </div>

            {/* 5. Judge Speedrun Controls */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="text-[10px] text-slate-400 font-bold">
                ⚡ JUDGE DEMO HOTKEYS
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => actions.triggerBossFight()}
                  className="neo-btn bg-[#FF4365] text-white font-black py-1.5 px-2.5 text-[10px] flex items-center justify-between shadow-[2px_2px_0px_#000]"
                >
                  <span>💥 TRIGGER INSTANT COLLAPSE</span>
                  <span className="bg-black text-[#FACC15] px-1 text-[9px]">Ctrl+Shift+K</span>
                </button>

                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('namma_os_reset'));
                    }
                    actions.resetDemo();
                  }}
                  className="neo-btn bg-[#10B981] text-black font-black py-1.5 px-2.5 text-[10px] flex items-center justify-between shadow-[2px_2px_0px_#000]"
                >
                  <span>🔄 INSTANT RESET WORKSPACE</span>
                  <span className="bg-black text-[#FACC15] px-1 text-[9px]">Shift+Esc</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: GIT BRANCHES & CHALLENGES
            ========================================================================= */}
        {activeTab === 'git' && (
          <div className="flex flex-col gap-3">
            {/* Active Branch Display */}
            <div className="bg-[#1C1E2D] border-2 border-black p-2.5 shadow-[2px_2px_0px_#000] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#10B981]" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold">ACTIVE BRANCH:</div>
                  <div className="font-black text-emerald-400 text-xs">{activeBranch || 'main'}</div>
                </div>
              </div>
              <span className="text-[9px] bg-black text-[#FACC15] font-black px-1.5 py-0.5 border border-black">
                UP TO DATE
              </span>
            </div>

            {/* Branch Switcher & Challenges */}
            <div className="flex flex-col gap-1.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Available Branches & Challenges:
              </div>

              <div className="flex flex-col gap-2">
                {BRANCH_LIST.map((branch) => {
                  const isCurrent = (activeBranch || 'main') === branch.name;
                  const challenge = CODING_CHALLENGES[branch.challengeId - 1];

                  return (
                    <div
                      key={branch.name}
                      className={`p-2.5 border-2 border-black flex flex-col gap-1.5 transition-all ${
                        isCurrent
                          ? 'bg-[#1F243B] border-l-4 border-l-[#10B981] shadow-[3px_3px_0px_#000]'
                          : 'bg-[#181928] hover:bg-[#1C1E30] shadow-[1px_1px_0px_#000]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <GitPullRequest className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#10B981]' : 'text-slate-400'}`} />
                          <span className="font-bold text-white text-[11px]">
                            {branch.name}
                          </span>
                        </div>
                        <span className="text-[9px] bg-black text-[#FACC15] px-1 font-bold border border-black">
                          {branch.tag}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-300 font-sans">
                        {branch.desc}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <span className="text-[9px] text-slate-400 font-mono">
                          Q{branch.challengeId}: {challenge?.title}
                        </span>

                        <button
                          onClick={() => handleCheckoutBranch(branch)}
                          disabled={isCurrent}
                          className={`neo-btn py-1 px-2 text-[10px] font-black flex items-center gap-1 ${
                            isCurrent
                              ? 'bg-[#10B981] text-black cursor-default'
                              : 'bg-[#38BDF8] hover:bg-cyan-300 text-black'
                          }`}
                        >
                          {isCurrent ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>CURRENT</span>
                            </>
                          ) : (
                            <>
                              <span>CHECKOUT</span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Git Operations */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
              <div className="text-[10px] text-slate-400 font-bold uppercase">
                Git Actions
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    audioManager.playSfx('chime');
                    actions.dismissWarning();
                  }}
                  className="neo-btn bg-[#25283D] hover:bg-[#31354F] text-slate-200 py-1.5 px-2 text-[10px] font-bold shadow-[2px_2px_0px_#000]"
                >
                  🌿 git commit
                </button>

                <button
                  onClick={() => {
                    audioManager.playSfx('buzz');
                    actions.reportMistake('GIT_FORCE_PUSH', 'Tried to git push --force to main at 3 AM!', 15);
                  }}
                  className="neo-btn bg-[#FF4365] hover:bg-red-400 text-white py-1.5 px-2 text-[10px] font-black shadow-[2px_2px_0px_#000]"
                  title="Push with force (DANGER!)"
                >
                  ⚠️ git push -f
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: SEARCH & REPLACE
            ========================================================================= */}
        {activeTab === 'search' && (
          <div className="flex flex-col gap-3">
            {/* Search Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 bg-[#181928] border-2 border-black p-1.5 shadow-[2px_2px_0px_#000]">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunSearch()}
                  placeholder="Search code tokens..."
                  className="bg-transparent text-white text-xs w-full focus:outline-none font-mono"
                />
                <button
                  onClick={() => setCaseSensitive(!caseSensitive)}
                  className={`px-1 py-0.5 border text-[9px] font-bold ${
                    caseSensitive 
                      ? 'bg-[#FACC15] text-black border-black' 
                      : 'bg-black/40 text-slate-400 border-white/20'
                  }`}
                  title="Match Case"
                >
                  Aa
                </button>
              </div>

              {/* Replace Input */}
              <div className="flex items-center gap-1.5 bg-[#181928] border-2 border-black p-1.5 shadow-[2px_2px_0px_#000]">
                <RefreshCw className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  placeholder="Replace with..."
                  className="bg-transparent text-white text-xs w-full focus:outline-none font-mono"
                />
                <button
                  onClick={handleReplaceInEditor}
                  disabled={!searchQuery}
                  className="neo-btn bg-[#38BDF8] disabled:opacity-40 text-black px-1.5 py-0.5 text-[9px] font-bold border border-black"
                  title="Replace all matches in editor"
                >
                  REPLACE
                </button>
              </div>

              <button
                onClick={handleRunSearch}
                className="neo-btn bg-[#FACC15] text-black font-black py-1.5 text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1 mt-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>FIND IN WORKSPACE</span>
              </button>
            </div>

            {/* Quick Search Chips */}
            <div className="flex flex-col gap-1.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase">
                Quick Search Presets:
              </div>
              <div className="flex flex-wrap gap-1">
                {[
                  'var', 
                  'calculateCoffeeFuel', 
                  'caffeinePerCup', 
                  'burnoutThreshold', 
                  'remainingJobs', 
                  'merge-conflict'
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      // Trigger search immediately
                      const q = term.toLowerCase();
                      const results = [];
                      CODING_CHALLENGES.forEach((ch, idx) => {
                        if (ch.starterCode.toLowerCase().includes(q)) {
                          results.push({
                            challengeIndex: idx,
                            challengeTitle: ch.title,
                            tag: ch.tag,
                          });
                        }
                      });
                      setSearchFeedback({ query: term, results });
                    }}
                    className="bg-[#202336] hover:bg-[#2C314C] text-slate-300 border border-black px-1.5 py-0.5 text-[10px] font-mono"
                  >
                    "{term}"
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results Display */}
            {searchFeedback && (
              <div className="flex flex-col gap-1.5 mt-1 border-t border-white/10 pt-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Results for "{searchFeedback.query}":</span>
                  <span className="font-bold text-amber-300">
                    {searchFeedback.results.length} matches
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                  {searchFeedback.results.length === 0 ? (
                    <div className="p-3 bg-[#181928] text-center text-slate-400 text-xs">
                      No matches found in any challenge.
                    </div>
                  ) : (
                    searchFeedback.results.map((res) => (
                      <button
                        key={res.challengeIndex}
                        onClick={() => {
                          audioManager.playSfx('chime');
                          if (onSelectChallenge) {
                            onSelectChallenge(res.challengeIndex);
                          }
                          window.dispatchEvent(new CustomEvent('select_challenge', {
                            detail: { index: res.challengeIndex }
                          }));
                        }}
                        className="p-2 bg-[#1C1E30] hover:bg-[#262A45] border-2 border-black text-left flex flex-col gap-0.5 shadow-[1px_1px_0px_#000]"
                      >
                        <div className="font-bold text-white text-[11px] flex items-center justify-between">
                          <span>Q{res.challengeIndex + 1}: {res.challengeTitle}</span>
                          <span className="text-[9px] bg-black text-[#FACC15] px-1 font-bold">
                            {res.tag}
                          </span>
                        </div>
                        <div className="text-[9px] text-[#38BDF8]">
                          → Click to open and inspect in editor
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: PROJECT EXPLORER (FILES)
            ========================================================================= */}
        {activeTab === 'files' && (
          <div className="flex flex-col gap-3">
            {/* File List */}
            <div className="flex flex-col gap-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <span>📁 src/challenges/</span>
              </div>

              {CODING_CHALLENGES.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => handleFileClick({ type: 'challenge', index: idx, name: `challenge_${idx + 1}.js` })}
                  className="p-1.5 bg-[#181928] hover:bg-[#202338] border border-black flex items-center justify-between text-left shadow-[1px_1px_0px_#000] cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-[#FACC15]" />
                    <span className="text-white text-[11px] font-bold">
                      challenge_{idx + 1}.js
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400">
                    {ch.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Config & Special Files */}
            <div className="flex flex-col gap-1 pt-1 border-t border-white/10">
              <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <span>📁 config/</span>
              </div>

              <button
                onClick={() => handleFileClick({ type: 'secret' })}
                className="p-1.5 bg-[#2A1017] hover:bg-[#3D1420] border-2 border-rose-500/60 flex items-center justify-between text-left shadow-[1px_1px_0px_#000] cursor-pointer"
                title="DANGER: High security secret file"
              >
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-200 text-[11px] font-bold">
                    secret_keys.env
                  </span>
                </div>
                <span className="text-[9px] bg-rose-950 text-rose-300 px-1 font-bold">
                  DO NOT COMMIT
                </span>
              </button>

              <button
                onClick={() => handleFileClick({ type: 'contract' })}
                className="p-1.5 bg-[#181928] hover:bg-[#202338] border border-black flex items-center justify-between text-left shadow-[1px_1px_0px_#000] cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-white text-[11px] font-bold">
                    auto_driver_contract.md
                  </span>
                </div>
                <span className="text-[9px] text-slate-400">
                  MONSOON RULES
                </span>
              </button>
            </div>

            {/* Preview modal/box for files */}
            {filePreview && (
              <div className="p-2.5 bg-[#10111D] border-2 border-black flex flex-col gap-1.5 mt-1 shadow-[2px_2px_0px_#000]">
                <div className="flex items-center justify-between border-b border-white/10 pb-1">
                  <span className="font-bold text-amber-300 text-[10px]">
                    {filePreview.title}
                  </span>
                  <button
                    onClick={() => setFilePreview(null)}
                    className="text-slate-400 hover:text-white font-bold text-xs"
                  >
                    ×
                  </button>
                </div>
                <pre className="text-[9px] text-slate-300 whitespace-pre-wrap font-mono leading-4 max-h-36 overflow-y-auto">
                  {filePreview.content}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: RUNTIME DEBUGGER
            ========================================================================= */}
        {activeTab === 'debug' && (
          <div className="flex flex-col gap-3">
            {/* Status indicator */}
            <div className="p-2.5 bg-[#181928] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-black text-white text-xs">STATUS: RUNNING</span>
              </div>
              <span className="text-[9px] bg-black text-[#FACC15] font-black px-1.5 py-0.5 border border-black">
                PID: 31337
              </span>
            </div>

            {/* Live Watchers */}
            <div className="flex flex-col gap-1.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase">
                Variable Telemetry Watchers:
              </div>

              <div className="bg-[#10111D] border-2 border-black p-2.5 flex flex-col gap-2 shadow-[2px_2px_0px_#000]">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-bold">trust_hp:</span>
                  <span className="font-black text-emerald-400">{trust} / 100</span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-bold">os_mood:</span>
                  <span className="font-black text-[#FACC15]">{mood}</span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-bold">mistake_count:</span>
                  <span className="font-black text-rose-400">{state.mistakeCount}</span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-bold">memory_rss:</span>
                  <span className={`font-black ${debugMemory > 30 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`}>
                    {debugMemory.toFixed(1)} MB
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-bold">silk_board_delay:</span>
                  <span className="font-black text-amber-300">146.5 mins</span>
                </div>
              </div>
            </div>

            {/* Debug Operations */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">
                Runtime Actions:
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => audioManager.playSfx('beep')}
                  className="neo-btn bg-[#25283D] text-slate-200 py-1.5 px-2 text-[10px] font-bold shadow-[2px_2px_0px_#000]"
                >
                  ▶ Step Over
                </button>

                <button
                  onClick={handleGarbageCollect}
                  disabled={isGCActive}
                  className="neo-btn bg-[#10B981] text-black py-1.5 px-2 text-[10px] font-black shadow-[2px_2px_0px_#000]"
                >
                  {isGCActive ? '🧹 SWEEPING...' : '🧹 Garbage Collect'}
                </button>

                <button
                  onClick={handleInjectMemorySpike}
                  className="neo-btn bg-[#FF4365] text-white py-1.5 px-2 text-[10px] font-black shadow-[2px_2px_0px_#000] col-span-2"
                >
                  ⚡ Inject Memory Spike (Chaos Test)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: ADD-ONS & PLUGINS MARKETPLACE
            ========================================================================= */}
        {activeTab === 'plugins' && (
          <div className="flex flex-col gap-3">
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              Bengaluru Tech Extensions:
            </div>

            <div className="flex flex-col gap-2">
              {/* Plugin 1 */}
              <div className="p-2.5 bg-[#181928] border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-[11px]">
                    🛺 Silk Board Bypass v2.4
                  </span>
                  <input
                    type="checkbox"
                    checked={pluginsState.trafficBypass}
                    onChange={() => togglePlugin('trafficBypass')}
                    className="accent-[#10B981] w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="text-[9px] text-slate-300 font-sans">
                  Simulates secret back alleys through BTM Layout to dodge Silk Board monsoon gridlock.
                </div>
              </div>

              {/* Plugin 2 */}
              <div className="p-2.5 bg-[#181928] border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-[11px]">
                    ☕ Filter Coffee Auto-Refill
                  </span>
                  <input
                    type="checkbox"
                    checked={pluginsState.coffeeDaemon}
                    onChange={() => togglePlugin('coffeeDaemon')}
                    className="accent-[#10B981] w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="text-[9px] text-slate-300 font-sans">
                  Background daemon that triggers Brahmin Coffee Bar delivery when programmer syntax errors exceed 3.
                </div>
              </div>

              {/* Plugin 3 */}
              <div className="p-2.5 bg-[#181928] border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-[11px]">
                    🦆 Sarcastic Rubber Duck
                  </span>
                  <input
                    type="checkbox"
                    checked={pluginsState.rubberDuck}
                    onChange={() => togglePlugin('rubberDuck')}
                    className="accent-[#10B981] w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="text-[9px] text-slate-300 font-sans">
                  Replaces boring linter warnings with theatrical Indiranagar tech lead commentary.
                </div>
              </div>

              {/* Plugin 4 */}
              <div className="p-2.5 bg-[#181928] border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-[11px]">
                    💸 Koramangala Pitch Generator
                  </span>
                  <input
                    type="checkbox"
                    checked={pluginsState.vcPitch}
                    onChange={() => togglePlugin('vcPitch')}
                    className="accent-[#10B981] w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="text-[9px] text-slate-300 font-sans">
                  Injects "AI-agentic synergy" into code comments to optimize valuation for angel investors.
                </div>
              </div>

              {/* Plugin 5 */}
              <div className="p-2.5 bg-[#181928] border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-[11px]">
                    🕹️ CRT Scanline Distortion
                  </span>
                  <input
                    type="checkbox"
                    checked={pluginsState.crtScanlines}
                    onChange={() => togglePlugin('crtScanlines')}
                    className="accent-[#10B981] w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="text-[9px] text-slate-300 font-sans">
                  Renders retro 1990s cathode-ray tube sweep lines across code buffer.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
