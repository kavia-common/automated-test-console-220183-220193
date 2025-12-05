import React, { useEffect, useRef, useState } from 'react';
import { useEventSource } from '../hooks/useEventSource';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export default function LogViewer({ mode = 'logs' }) {
  /** This is a public function. */
  const containerRef = useRef(null);
  const [staticText, setStaticText] = useState('');

  // Use SSE for main logs if backend provides, else fallback to polling
  const useSSE = mode === 'logs';
  const { messages } = useEventSource('/logs', { enabled: useSSE });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const text = mode === 'batch'
          ? await api.batchLog()
          : mode === 'fail'
            ? await api.failLog()
            : '';
        if (mounted) setStaticText(String(text || ''));
      } catch {
        if (mounted) setStaticText('');
      }
    }
    if (!useSSE) load();
    // no interval to keep it simple/lightweight
    return () => { mounted = false; };
  }, [mode, useSSE]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, staticText]);

  const lines = useSSE
    ? messages.map((m) => (typeof m.data === 'string' ? m.data : JSON.stringify(m.data)))
    : staticText.split('\n');

  return (
    <div className="log-viewer card" ref={containerRef} role="log" aria-live="polite">
      {lines.length === 0 && <div className="muted">No logs yet</div>}
      {lines.map((line, idx) => (
        <div key={`l-${idx}`} className="log-line">{line}</div>
      ))}
    </div>
  );
}
