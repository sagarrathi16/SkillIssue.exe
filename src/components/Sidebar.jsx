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
  Skull
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
    { id: 'files', label: 'Files', icon: Files, color: 'hover:bg-amber-400' },
    { id: 'search', label: 'Search', icon: Search, color: 'hover:bg-cyan-400' },
    { id: 'git', label: 'Git Sync', icon: GitPullRequest, color: 'hover:bg-emerald-400' },
    { id: 'debug', label: 'Debugger', icon: Bug, color: 'hover:bg-purple-400' },
    { id: 'plugins', label: 'Add-ons', icon: Boxes, color: 'hover:bg-rose-400' },
  ];

  return (
    <aside
      className={`w-14 sm:w-16 bg-[#12131F] border-r-2 border-black flex flex-col items-center justify-between py-3 select-none transition-colors duration-300 shrink-0 ${
        isBetrayal
          ? 'bg-[#251015]'
          : isAnnoyed
          ? 'bg-[#191624]'
          : 'bg-[#12131F]'
      }`}
    >
      {/* 1. Main Tool Navigation Icons (Cartridge Rack) */}
      <div 
        className="flex flex-col items-center gap-2.5 w-full px-2"
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
              data-physics-id={`sidebar-nav-${item.id}`}
              onClick={() => handleTabClick(item.id)}
              className={`w-10 h-10 border-2 border-black flex items-center justify-center transition-all cursor-pointer relative group ${tiltClass} ${
                isActive
                  ? 'bg-[#FACC15] text-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[#1E2032] text-slate-300 shadow-[2px_2px_0px_#000] hover:text-black ' + item.color
              }`}
              title={`${item.label} (Spam clicking triggers penalty!)`}
            >
              <Icon className="w-5 h-5 stroke-[2.5]" />

              {/* Neo Tooltip */}
              <div className="absolute left-14 ml-1 px-2 py-1 bg-black text-[#FACC15] border-2 border-[#FACC15] font-mono text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-[2px_2px_0px_#000]">
                {item.label.toUpperCase()}
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Bottom Controls + Forbidden Prod DB Button */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {/* The Forbidden "Drop Prod DB" Button (Arcade Hazard Style) */}
        <div 
          data-physics-id="sidebar-forbidden-btn"
          className="w-full flex justify-center"
        >
          <button
            onClick={handleDropProdDB}
            className={`w-11 h-12 bg-rose-500 hover:bg-rose-400 text-white border-2 border-black flex flex-col items-center justify-center gap-0.5 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] cursor-pointer animate-pulse group ${
              isBetrayal ? 'mood-betrayal-tilted-right anim-personal-betrayal' : ''
            }`}
            title="DANGER! Do Not Touch (Drops Prod DB & destroys trust!)"
          >
            <Skull className="w-4 h-4 text-yellow-300" />
            <span className="text-[7px] font-mono font-black uppercase text-white tracking-tighter">
              DROP DB
            </span>
          </button>
        </div>

        {/* System Settings Icon */}
        <button
          data-physics-id="sidebar-settings-icon"
          onClick={() => handleTabClick('settings')}
          className="w-9 h-9 border-2 border-black bg-[#1B1D2E] text-slate-400 hover:bg-slate-700 hover:text-white flex items-center justify-center shadow-[1px_1px_0px_#000] cursor-pointer"
          title="OS Settings"
        >
          <Settings className="w-4 h-4 stroke-[2]" />
        </button>
      </div>
    </aside>
  );
}
