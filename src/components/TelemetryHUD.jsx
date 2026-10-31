import React from 'react';
import { useOS, OSMood } from '../app/osStateMachine';
import { Activity, History, AlertCircle, X, ShieldAlert, Award, AlertTriangle } from 'lucide-react';

export function TelemetryHUD() {
  const { state, actions } = useOS();
  const {
    trust,
    mood,
    mistakeCount,
    ignoredWarnings,
    rapidClickEvents,
    apologyAttempts,
    activeWarning,
    eventHistory,
  } = state;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col gap-4 font-mono text-xs">
      {/* Top Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Trust Metric */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col gap-1">
          <div className="text-slate-400 text-[11px] flex items-center justify-between">
            <span>TRUST SCORE</span>
            <Activity className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className={`text-2xl font-bold ${trust <= 34 ? 'text-rose-400' : trust <= 65 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {trust}<span className="text-xs text-slate-500 font-normal">/100</span>
          </div>
          <div className="text-[10px] text-slate-500">Relationship health</div>
        </div>

        {/* Current Mood */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col gap-1">
          <div className="text-slate-400 text-[11px]">MOOD STATE</div>
          <div className="text-sm font-bold text-slate-200 truncate mt-1">
            {mood}
          </div>
          <div className="text-[10px] text-slate-500">Escalation level</div>
        </div>

        {/* Mistakes Count */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col gap-1">
          <div className="text-slate-400 text-[11px] flex items-center justify-between">
            <span>MISTAKES</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-200">
            {mistakeCount}
          </div>
          <div className="text-[10px] text-slate-500">Detected syntax errors</div>
        </div>

        {/* Ignored Warnings */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col gap-1">
          <div className="text-slate-400 text-[11px] flex items-center justify-between">
            <span>IGNORED WARNS</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-300">
            {ignoredWarnings}
          </div>
          <div className="text-[10px] text-slate-500">Dismissed without fix</div>
        </div>

        {/* Rapid Clicks */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col gap-1">
          <div className="text-slate-400 text-[11px]">SPAM CLICKS</div>
          <div className="text-2xl font-bold text-blue-300">
            {rapidClickEvents}
          </div>
          <div className="text-[10px] text-slate-500">Rapid click bursts</div>
        </div>

        {/* Apology Attempts */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col gap-1">
          <div className="text-slate-400 text-[11px] flex items-center justify-between">
            <span>APOLOGIES</span>
            <Award className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300">
            {apologyAttempts}
          </div>
          <div className="text-[10px] text-slate-500">Recovery attempts</div>
        </div>
      </div>

      {/* Active Warning Banner (if any) */}
      {activeWarning && (
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-lg p-3 flex items-center justify-between gap-3 text-amber-200 animate-subtle-pulse">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-amber-300 mr-2">ACTIVE WARNING:</span>
              <span className="text-slate-200">{activeWarning.message}</span>
            </div>
          </div>
          <button
            onClick={actions.dismissWarning}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all cursor-pointer font-bold shrink-0"
            title="Dismissing this warning without fixing will trigger the 'Ignored Warning' roast on next error!"
          >
            <span>Dismiss Warning</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Event History Stream (Capped at 10) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold tracking-wider">EVENT HISTORY LOG (LAST 10 ACTIONS)</span>
          </div>
          <span className="text-[10px] text-slate-500">Relationship Memory Buffer</span>
        </div>

        {eventHistory.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">
            No infractions or actions recorded yet. System is peaceful.
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
            {eventHistory.map((item, idx) => {
              const isLatest = idx === 0;
              return (
                <div
                  key={item.id || idx}
                  className={`flex items-center justify-between gap-3 p-2 rounded border text-xs transition-colors ${
                    isLatest
                      ? 'bg-slate-800/80 border-slate-700 text-slate-100 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>

                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        item.type === 'MISTAKE'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.type === 'WARNING_DISMISSED'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : item.type === 'RAPID_CLICK'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : item.type === 'FORBIDDEN_ACTION'
                          ? 'bg-red-600/30 text-red-200 border border-red-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.type}
                    </span>

                    <span className="text-slate-300 truncate font-mono text-[11px]">
                      {item.detail?.message || item.detail?.note || item.detail?.actionName || JSON.stringify(item.detail)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-bold font-mono">
                    {item.trustDelta !== undefined && item.trustDelta !== 0 && (
                      <span
                        className={`text-[11px] ${
                          item.trustDelta > 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {item.trustDelta > 0 ? `+${item.trustDelta}` : item.trustDelta} trust
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">
                      ({item.trustAfter}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

