import React from 'react';
import { useAppState } from '../state/appState';

// PUBLIC_INTERFACE
export default function Tabs() {
  /** This is a public function. */
  const { activeTab, setActiveTab } = useAppState();

  const tabs = [
    { id: 'logs', label: 'Logs' },
    { id: 'batch', label: 'Batch Log' },
    { id: 'fail', label: 'Fail Log' },
    { id: 'config', label: 'Config' },
  ];

  return (
    <div className="tabs">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => setActiveTab(t.id)}
          className={`tab ${activeTab === t.id ? 'active' : ''}`}
          aria-selected={activeTab === t.id}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
