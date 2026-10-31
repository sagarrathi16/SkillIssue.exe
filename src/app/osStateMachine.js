import React, { createContext, useContext, useReducer, useCallback } from 'react';

/**
 * Mood Enums representing the OS's escalating emotional volatility.
 */
export const OSMood = {
  CALM: 'CALM',
  SLIGHTLY_ANNOYED: 'SLIGHTLY_ANNOYED',
  PERSONAL_BETRAYAL: 'PERSONAL_BETRAYAL',
  MENTAL_BREAKDOWN: 'MENTAL_BREAKDOWN',
  BENGALURU_BOSS_FIGHT: 'BENGALURU_BOSS_FIGHT',
  RECOVERY: 'RECOVERY',
};

/**
 * Derives the appropriate OSMood from the current trust score.
 * Special states like RECOVERY override standard numeric thresholds.
 */
export function calculateMoodFromTrust(trust, currentMood) {
  if (currentMood === OSMood.RECOVERY) return OSMood.RECOVERY;
  if (trust <= 0) return OSMood.BENGALURU_BOSS_FIGHT;
  if (trust <= 34) return OSMood.MENTAL_BREAKDOWN;
  if (trust <= 59) return OSMood.PERSONAL_BETRAYAL;
  if (trust <= 79) return OSMood.SLIGHTLY_ANNOYED;
  return OSMood.CALM;
}

export const INITIAL_OS_STATE = {
  trust: 100,
  mood: OSMood.CALM,
  mistakeCount: 0,
  ignoredWarnings: 0,
  rapidClickEvents: 0,
  apologyAttempts: 0,
  activeWarning: null, // { id, message, mistakeType, timestamp }
  eventHistory: [],    // Max 10 items
  isCollapsed: false,  // Physics collapse active
  isRecovering: false, // Spring reassembly running
  sessionStartTime: Date.now(),
};

export const ACTION_TYPES = {
  MISTAKE_DETECTED: 'MISTAKE_DETECTED',
  WARNING_DISMISSED: 'WARNING_DISMISSED',
  RAPID_CLICK_DETECTED: 'RAPID_CLICK_DETECTED',
  FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
  APOLOGY_ATTEMPTED: 'APOLOGY_ATTEMPTED',
  START_RECOVERY: 'START_RECOVERY',
  RECOVERY_COMPLETED: 'RECOVERY_COMPLETED',
  TRIGGER_MELTDOWN: 'TRIGGER_MELTDOWN',
  TRIGGER_BOSS_FIGHT: 'TRIGGER_BOSS_FIGHT',
  HARD_RESET_DEMO: 'HARD_RESET_DEMO',
};

function pushEventHistory(history, event) {
  const newHistory = [
    {
      ...event,
      id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
    },
    ...history,
  ];
  return newHistory.slice(0, 10);
}

export function osReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.MISTAKE_DETECTED: {
      const { mistakeType, detail, penalty = 15 } = action.payload || {};
      
      // Check if user has an active warning for the same thing or dismissed one recently
      const hasUnresolvedWarning = Boolean(state.activeWarning);
      const isRepeated = state.eventHistory[0]?.detail?.mistakeType === mistakeType;
      
      // Escalated penalty if warning was ignored or error repeated
      const actualPenalty = isRepeated ? penalty + 10 : hasUnresolvedWarning ? penalty + 5 : penalty;
      const nextTrust = Math.max(0, state.trust - actualPenalty);
      const nextMood = calculateMoodFromTrust(nextTrust, state.mood);

      const eventItem = {
        type: 'MISTAKE',
        detail: {
          mistakeType: mistakeType || 'SYNTAX_ERROR',
          message: detail || 'Unbalanced token or invalid statement',
          isRepeated,
          ignoredWarningPrior: hasUnresolvedWarning,
        },
        trustBefore: state.trust,
        trustAfter: nextTrust,
        trustDelta: -actualPenalty,
      };

      return {
        ...state,
        trust: nextTrust,
        mood: nextMood,
        mistakeCount: state.mistakeCount + 1,
        activeWarning: {
          id: `warn_${Date.now()}`,
          mistakeType: mistakeType || 'SYNTAX_ERROR',
          message: detail || 'Syntax validation failed.',
          timestamp: Date.now(),
        },
        isCollapsed: nextTrust <= 34,
        eventHistory: pushEventHistory(state.eventHistory, eventItem),
      };
    }

    case ACTION_TYPES.WARNING_DISMISSED: {
      const dismissedWarning = state.activeWarning;
      const nextTrust = Math.max(0, state.trust - 5);
      const nextMood = calculateMoodFromTrust(nextTrust, state.mood);

      const eventItem = {
        type: 'WARNING_DISMISSED',
        detail: {
          dismissedWarning,
          note: 'User closed warning toast without addressing code issue',
        },
        trustBefore: state.trust,
        trustAfter: nextTrust,
        trustDelta: -5,
      };

      return {
        ...state,
        trust: nextTrust,
        mood: nextMood,
        activeWarning: null,
        ignoredWarnings: state.ignoredWarnings + 1,
        isCollapsed: nextTrust <= 34,
        eventHistory: pushEventHistory(state.eventHistory, eventItem),
      };
    }

    case ACTION_TYPES.RAPID_CLICK_DETECTED: {
      const { buttonName = 'Toolbar', clickCount = 4 } = action.payload || {};
      const penalty = 12;
      const nextTrust = Math.max(0, state.trust - penalty);
      const nextMood = calculateMoodFromTrust(nextTrust, state.mood);

      const eventItem = {
        type: 'RAPID_CLICK',
        detail: { buttonName, clickCount },
        trustBefore: state.trust,
        trustAfter: nextTrust,
        trustDelta: -penalty,
      };

      return {
        ...state,
        trust: nextTrust,
        mood: nextMood,
        rapidClickEvents: state.rapidClickEvents + 1,
        isCollapsed: nextTrust <= 34,
        eventHistory: pushEventHistory(state.eventHistory, eventItem),
      };
    }

    case ACTION_TYPES.FORBIDDEN_ACTION: {
      const { actionName = 'PROD_DB_TOUCH' } = action.payload || {};
      const penalty = 40;
      const nextTrust = Math.max(0, state.trust - penalty);
      const nextMood = calculateMoodFromTrust(nextTrust, state.mood);

      const eventItem = {
        type: 'FORBIDDEN_ACTION',
        detail: { actionName, warning: 'Pressed forbidden Production DB button' },
        trustBefore: state.trust,
        trustAfter: nextTrust,
        trustDelta: -penalty,
      };

      return {
        ...state,
        trust: nextTrust,
        mood: nextMood,
        mistakeCount: state.mistakeCount + 1,
        isCollapsed: nextTrust <= 34,
        eventHistory: pushEventHistory(state.eventHistory, eventItem),
      };
    }

    case ACTION_TYPES.TRIGGER_MELTDOWN: {
      const nextTrust = 20;
      return {
        ...state,
        trust: nextTrust,
        mood: OSMood.MENTAL_BREAKDOWN,
        isCollapsed: true,
        isRecovering: false,
        eventHistory: pushEventHistory(state.eventHistory, {
          type: 'DEMO_TRIGGER_MELTDOWN',
          detail: { note: 'Forced collapse via Judge Speedrun hotkey' },
          trustBefore: state.trust,
          trustAfter: nextTrust,
          trustDelta: nextTrust - state.trust,
        }),
      };
    }

    case ACTION_TYPES.TRIGGER_BOSS_FIGHT: {
      const nextTrust = 0;
      return {
        ...state,
        trust: nextTrust,
        mood: OSMood.BENGALURU_BOSS_FIGHT,
        isCollapsed: true,
        isRecovering: false,
        eventHistory: pushEventHistory(state.eventHistory, {
          type: 'DEMO_TRIGGER_BOSS_FIGHT',
          detail: { note: 'Forced Bengaluru Boss Fight via Judge Speedrun hotkey' },
          trustBefore: state.trust,
          trustAfter: nextTrust,
          trustDelta: nextTrust - state.trust,
        }),
      };
    }

    case ACTION_TYPES.APOLOGY_ATTEMPTED: {
      const { method = 'TEXT', text = '', success = false, trustBonus = 35 } = action.payload || {};
      const nextApologyAttempts = state.apologyAttempts + 1;

      if (!success) {
        return {
          ...state,
          apologyAttempts: nextApologyAttempts,
          eventHistory: pushEventHistory(state.eventHistory, {
            type: 'APOLOGY_FAILED',
            detail: { method, text, reason: 'Insufficient sincerity / volume' },
            trustBefore: state.trust,
            trustAfter: state.trust,
            trustDelta: 0,
          }),
        };
      }

      const nextTrust = Math.min(100, Math.max(state.trust + trustBonus, 75));
      return {
        ...state,
        trust: nextTrust,
        mood: OSMood.RECOVERY,
        isRecovering: true,
        apologyAttempts: nextApologyAttempts,
        activeWarning: null,
        eventHistory: pushEventHistory(state.eventHistory, {
          type: 'APOLOGY_ACCEPTED',
          detail: { method, text, trustBonus },
          trustBefore: state.trust,
          trustAfter: nextTrust,
          trustDelta: trustBonus,
        }),
      };
    }

    case ACTION_TYPES.START_RECOVERY: {
      const bonus = action.payload?.trustBonus || 80;
      const nextTrust = Math.min(100, Math.max(state.trust, bonus));
      return {
        ...state,
        trust: nextTrust,
        mood: OSMood.RECOVERY,
        isRecovering: true,
        activeWarning: null,
        eventHistory: pushEventHistory(state.eventHistory, {
          type: 'RECOVERY_STARTED',
          detail: action.payload?.detail || { reason: 'Boss fight won / Apology accepted' },
          trustBefore: state.trust,
          trustAfter: nextTrust,
          trustDelta: nextTrust - state.trust,
        }),
      };
    }

    case ACTION_TYPES.RECOVERY_COMPLETED: {
      return {
        ...state,
        mood: calculateMoodFromTrust(state.trust, null),
        isCollapsed: false,
        isRecovering: false,
        activeWarning: null,
        eventHistory: pushEventHistory(state.eventHistory, {
          type: 'RECOVERY_COMPLETED',
          detail: { note: 'Workspace reassembly finished successfully' },
          trustBefore: state.trust,
          trustAfter: state.trust,
          trustDelta: 0,
        }),
      };
    }

    case ACTION_TYPES.HARD_RESET_DEMO: {
      return {
        ...INITIAL_OS_STATE,
        sessionStartTime: Date.now(),
        eventHistory: [
          {
            id: `ev_reset_${Date.now()}`,
            type: 'SYSTEM_RESET',
            timestamp: Date.now(),
            detail: { note: 'Demo reset to initial clean state' },
            trustBefore: state.trust,
            trustAfter: 100,
            trustDelta: 100 - state.trust,
          },
        ],
      };
    }

    default:
      return state;
  }
}

const OSContext = createContext(null);

export function OSProvider({ children }) {
  const [state, dispatch] = useReducer(osReducer, INITIAL_OS_STATE);

  const reportMistake = useCallback((mistakeType, detail, penalty) => {
    dispatch({
      type: ACTION_TYPES.MISTAKE_DETECTED,
      payload: { mistakeType, detail, penalty },
    });
  }, []);

  const dismissWarning = useCallback(() => {
    dispatch({ type: ACTION_TYPES.WARNING_DISMISSED });
  }, []);

  const reportRapidClick = useCallback((buttonName, clickCount) => {
    dispatch({
      type: ACTION_TYPES.RAPID_CLICK_DETECTED,
      payload: { buttonName, clickCount },
    });
  }, []);

  const touchForbiddenControl = useCallback((actionName) => {
    dispatch({
      type: ACTION_TYPES.FORBIDDEN_ACTION,
      payload: { actionName },
    });
  }, []);

  const triggerMeltdown = useCallback(() => {
    dispatch({ type: ACTION_TYPES.TRIGGER_MELTDOWN });
  }, []);

  const triggerBossFight = useCallback(() => {
    dispatch({ type: ACTION_TYPES.TRIGGER_BOSS_FIGHT });
  }, []);

  const attemptApology = useCallback((method, text, success, trustBonus) => {
    dispatch({
      type: ACTION_TYPES.APOLOGY_ATTEMPTED,
      payload: { method, text, success, trustBonus },
    });
  }, []);

  const startRecovery = useCallback((trustBonus, detail) => {
    dispatch({
      type: ACTION_TYPES.START_RECOVERY,
      payload: { trustBonus, detail },
    });
  }, []);

  const completeRecovery = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RECOVERY_COMPLETED });
  }, []);

  const resetDemo = useCallback(() => {
    dispatch({ type: ACTION_TYPES.HARD_RESET_DEMO });
  }, []);

  const value = {
    state,
    dispatch,
    actions: {
      reportMistake,
      dismissWarning,
      reportRapidClick,
      touchForbiddenControl,
      triggerMeltdown,
      triggerBossFight,
      attemptApology,
      startRecovery,
      completeRecovery,
      resetDemo,
    },
  };

  return React.createElement(OSContext.Provider, { value }, children);
}

export function useOS() {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
}
