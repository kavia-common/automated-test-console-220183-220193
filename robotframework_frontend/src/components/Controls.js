import React, { useCallback, useState } from 'react';
import { useAppState } from '../state/appState';

// PUBLIC_INTERFACE
export default function Controls() {
  /** This is a public function. */
  const {
    isRunning, startRun, stopRun,
    project, setProject, email, setEmail, loopCount, setLoopCount,
  } = useAppState();
  const [busy, setBusy] = useState(false);

  const onStart = useCallback(async () => {
    setBusy(true);
    try {
      await startRun();
    } finally {
      setBusy(false);
    }
  }, [startRun]);

  const onStop = useCallback(async () => {
    setBusy(true);
    try {
      await stopRun();
    } finally {
      setBusy(false);
    }
  }, [stopRun]);

  return (
    <div className="controls card">
      <div className="row">
        <div className="field">
          <label>Project</label>
          <input
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Project folder or name"
          />
        </div>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
          />
        </div>
        <div className="field small">
          <label>Loop</label>
          <input
            type="number"
            min={1}
            value={loopCount}
            onChange={(e) => setLoopCount(Number(e.target.value || 1))}
          />
        </div>
      </div>
      <div className="row actions">
        <button
          className="btn primary"
          onClick={onStart}
          disabled={isRunning || busy}
          aria-label="Start run"
        >
          ▶ Start
        </button>
        <button
          className="btn danger"
          onClick={onStop}
          disabled={!isRunning || busy}
          aria-label="Stop run"
        >
          ■ Stop
        </button>
      </div>
    </div>
  );
}
