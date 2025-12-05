import React, { useEffect, useState } from 'react';
import './App.css';
import { AppStateProvider, useAppState } from './state/appState';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import Tabs from './components/Tabs';
import LogViewer from './components/LogViewer';
import ConfigEditor from './components/ConfigEditor';

function MainContent() {
  const { activeTab } = useAppState();
  return (
    <div className="main">
      <Controls />
      <Tabs />
      {activeTab === 'logs' && <LogViewer mode="logs" />}
      {activeTab === 'batch' && <LogViewer mode="batch" />}
      {activeTab === 'fail' && <LogViewer mode="fail" />}
      {activeTab === 'config' && <ConfigEditor />}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** This is a public function. */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** This is a public function. */
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <AppStateProvider>
      <div className="app-root">
        <Header />
        <div className="layout">
          <Sidebar />
          <MainContent />
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </AppStateProvider>
  );
}

export default App;
