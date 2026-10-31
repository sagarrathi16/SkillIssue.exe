import React, { useState, useRef } from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { createClickTracker } from '../logic/mistakeDetector';
import { 
  Files, 
  Search, 
  GitPullRequest, 
  Bug, 
  Boxes, 
  Settings, 
  Flame, 
  AlertOctagon,
  Cpu
} from 'lucide-react';

export function Sidebar() {
  const { state, actions } = useOS();
  const { mood } = state;
  const [activeTab, setActiveTab] = useState('files');

  // Rapid click tracking for sidebar icons
  const clickTrackerRef = useRef(createClickTracker(4, 1500));

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const { isSpam, count } = clickTrackerRef.current();
    if (isSpam) {
      actions.reportRapidClick(`Sidebar_${tabId}`, count);
    }
  };

  const handleDropProdDB = () => {
    actions.touchForbiddenControl('DROP_PROD_DB');
  };

  const isAnnoyed = mood === OSMood.SLIGHTLY_ANNOYED;
  const isBetrayal = mood === OSMood.PERSONAL_BETRAYAL;

  const NAV_ITEMS = [
    { id: 'files', label: 'Explorer', icon: Files },
    { id: 'search', label: 'Global Search', icon: Search },
    { id: 'source-control', label: 'Git Sync', icon: GitPullRequest },
    { id: 'debug', label: 'Run & Debug', icon: Bug },
    { id: 'extensions', label: 'Namma Plugins', icon: Boxes },
  ];

  return (
    <aside
      data-physics-id="sidebar-container"
      className={`w-14 sm:w-16 bg-[#070A12] border-r flex flex-col items-center justify-between py-3 select-none transition-all duration-300 shrink-0 ${
        isBetrayal
          ? 'border-rose-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
          : isAnnoyed
          ? 'border-amber-500/40'
          : 'border-slate-800'
      }`}
    >
      {/* 1. Main Tool Navigation Icons */}
      <div 
        data-physics-id="sidebar-nav-icons"
        className="flex flex-col items-center gap-3 w-full"
      >
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const tiltClass = isBetrayal
            ? idx % 2 === 0
              ? 'mood-betrayal-tilted-left'
              : 'mood-betrayal-tilted-right'
            : '';

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-90 cursor-pointer relative group ${tiltClass} ${
                isActive
                  ? isBetrayal
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : isAnnoyed
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
              title={`${item.label} (Spam clicking will irritate the OS)`}
            >
              <Icon className="w-5 h-5" />

              {/* Tooltip */}
              <div className="absolute left-14 ml-2 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Bottom Controls + Forbidden Prod DB Button */}
      <div className="flex flex-col items-center gap-3 w-full px-1">
        {/* The Forbidden "Drop Prod DB" Button */}
        <div
          data-physics-id="sidebar-forbidden-btn"
          className="w-full flex justify-center"
        >
          <button
            onClick={handleDropProdDB}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-rose-950/60 border border-rose-400/50 transition-all active:scale-90 cursor-pointer animate-pulse group ${
              isBetrayal ? 'mood-betrayal-tilted-right anim-personal-betrayal' : ''
            }`}
            title="CRITICAL FORBIDDEN CONTROL: Drop Prod DB (Do Not Touch!)"
          >
            <Flame className="w-5 h-5 text-amber-200 group-hover:scale-110 transition-transform" />
            <span className="text-[7px] font-mono font-black uppercase tracking-tighter text-amber-100">
              PROD DB
            </span>
          </button>
        </div>

        {/* System Settings Icon */}
        <button
          data-physics-id="sidebar-settings-icon"
          onClick={() => handleTabClick('settings')}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-all cursor-pointer"
          title="OS Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
