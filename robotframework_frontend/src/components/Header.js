import React from 'react';
import { useAppState } from '../state/appState';

function formatTime(seconds) {
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  const m = Math.floor((seconds / 60) % 60).toString().padStart(2, '0');
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// PUBLIC_INTERFACE
export default function Header() {
  /** This is a public function. */
  const { progress } = useAppState();
  const pct = isFinite(progress.percent) ? progress.percent : 0;

  return (
    <header className="header">
      <div className="brand">
        <div className="logo-dot" />
        <div className="title">Robot Test Console</div>
      </div>
      <div className="progress-wrap">
        <div className="progress-meta">
          <span className="elapsed">Elapsed: {formatTime(progress.elapsed || 0)}</span>
          <span className="total">Total: {progress.total || 0}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </header>
  );
}
