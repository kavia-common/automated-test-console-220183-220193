import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** This is a public function. */
  const [stats, setStats] = useState({ passed: 0, failed: 0, skipped: 0, total: 0 });
  const [cases, setCases] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const res = await api.stats();
        if (mounted && res) {
          setStats({
            passed: Number(res.passed ?? 0),
            failed: Number(res.failed ?? 0),
            skipped: Number(res.skipped ?? 0),
            total: Number(res.total ?? 0),
          });
        }
      } catch {
        // ignore
      }
    };
    fetchStats();
    const id = setInterval(fetchStats, 3000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchList = async () => {
      try {
        const res = await api.caseStatus();
        if (mounted) {
          const items = Array.isArray(res?.cases) ? res.cases : [];
          setCases(items);
        }
      } catch {
        // ignore
      }
    };
    fetchList();
  }, []);

  return (
    <aside className="sidebar">
      <div className="card">
        <div className="card-title">Statistics</div>
        <div className="stat-line"><span>Passed</span><b>{stats.passed}</b></div>
        <div className="stat-line"><span>Failed</span><b className="text-error">{stats.failed}</b></div>
        <div className="stat-line"><span>Skipped</span><b>{stats.skipped}</b></div>
        <div className="stat-line total"><span>Total</span><b>{stats.total}</b></div>
      </div>

      <div className="card">
        <div className="card-title">Test Cases</div>
        <div className="case-list">
          {cases.length === 0 && <div className="muted">No cases available</div>}
          {cases.map((c, idx) => (
            <div key={`${c?.name || 'case'}-${idx}`} className="case-item" title={c?.name}>
              <span className={`dot ${c?.status || 'unknown'}`} />
              <span className="case-name">{c?.name || `Case ${idx + 1}`}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
