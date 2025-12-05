import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export default function ConfigEditor() {
  /** This is a public function. */
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await api.getConfig();
        let text = '';
        if (typeof data === 'string') text = data;
        else text = JSON.stringify(data, null, 2);
        if (mounted) setContent(text);
      } catch (e) {
        if (mounted) {
          setContent('');
          setError('Failed to load config');
        }
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function onSave() {
    setStatus('saving');
    setError('');
    try {
      let payload;
      try {
        payload = JSON.parse(content);
      } catch {
        // send raw text if not JSON
        payload = { raw: content };
      }
      await api.saveConfig(payload);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1200);
    } catch (e) {
      setStatus('error');
      setError(e.message || 'Save failed');
    }
  }

  return (
    <div className="config-editor">
      <textarea
        className="card"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={16}
        spellCheck={false}
        aria-label="Configuration editor"
      />
      <div className="row actions">
        <button className="btn primary" onClick={onSave}>Save</button>
        {status === 'saving' && <span className="muted">Saving…</span>}
        {status === 'saved' && <span className="text-success">Saved</span>}
        {status === 'error' && <span className="text-error">{error}</span>}
      </div>
    </div>
  );
}
