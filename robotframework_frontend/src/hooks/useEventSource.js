import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '../api/client';

/**
 * Simple EventSource hook for server-sent events.
 * Automatically reconnects on error with backoff.
 * PUBLIC_INTERFACE
 */
export function useEventSource(path, { enabled = true } = {}) {
  /** This is a public function. */
  const [messages, setMessages] = useState([]);
  const [lastEventId, setLastEventId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | connecting | open | closed | error
  const esRef = useRef(null);
  const retryRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    const url = new URL(`${API_BASE}${path}`, window.location.origin).toString();

    function connect() {
      if (cancelled) return;
      setStatus('connecting');
      try {
        const es = new EventSource(url, { withCredentials: false });
        esRef.current = es;

        es.onopen = () => {
          retryRef.current = 0;
          if (!cancelled) setStatus('open');
        };

        es.onmessage = (evt) => {
          setLastEventId(evt.lastEventId || null);
          let data = evt.data;
          try {
            data = JSON.parse(evt.data);
          } catch {
            // keep as text
          }
          setMessages((prev) => [...prev, { id: evt.lastEventId || `${Date.now()}-${prev.length}`, data }]);
        };

        es.onerror = () => {
          if (!cancelled) {
            setStatus('error');
            es.close();
            const delay = Math.min(30000, 1000 * Math.pow(2, retryRef.current++));
            setTimeout(connect, delay);
          }
        };
      } catch {
        setStatus('error');
        const delay = Math.min(30000, 1000 * Math.pow(2, retryRef.current++));
        setTimeout(connect, delay);
      }
    }

    connect();
    return () => {
      cancelled = true;
      setStatus('closed');
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
  }, [path, enabled]);

  return { messages, lastEventId, status };
}
