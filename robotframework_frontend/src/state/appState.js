import React, { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export const AppStateContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * Provides shared application state: running status, progress, selected project,
 * email config, loop count, and helper actions to call backend APIs.
 */
export function AppStateProvider({ children }) {
  /** This is a public function. */
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, elapsed: 0, total: 0 });
  const [currentCase, setCurrentCase] = useState(null);
  const [project, setProject] = useState('');
  const [email, setEmail] = useState('');
  const [loopCount, setLoopCount] = useState(1);
  const [activeTab, setActiveTab] = useState('logs'); // logs | batch | fail | config

  const actions = useMemo(() => ({
    // PUBLIC_INTERFACE
    async startRun(payload = {}) {
      await api.run({
        project,
        email,
        loop: loopCount,
        ...payload,
      });
      setIsRunning(true);
    },
    // PUBLIC_INTERFACE
    async stopRun() {
      await api.stop();
      setIsRunning(false);
    },
    // PUBLIC_INTERFACE
    async refreshProgress() {
      try {
        const p = await api.progress();
        const info = await api.currentCaseInfo().catch(() => null);
        setProgress({
          percent: Math.min(100, Math.max(0, Number(p?.percent ?? 0))),
          elapsed: Number(p?.elapsed ?? 0),
          total: Number(p?.total ?? 0),
        });
        setCurrentCase(info);
      } catch {
        // best-effort
      }
    },
    // PUBLIC_INTERFACE
    setProject,
    // PUBLIC_INTERFACE
    setEmail,
    // PUBLIC_INTERFACE
    setLoopCount,
    // PUBLIC_INTERFACE
    setActiveTab,
  }), [project, email, loopCount]);

  const value = useMemo(() => ({
    isRunning,
    progress,
    currentCase,
    project,
    email,
    loopCount,
    activeTab,
    ...actions,
  }), [isRunning, progress, currentCase, project, email, loopCount, activeTab, actions]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAppState() {
  /** This is a public function. */
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
