//
// Lightweight API client for Robot Framework backend
//

const API_BASE = process.env.REACT_APP_API_BASE || '';

/**
 * Safely build URL with query params.
 */
function buildUrl(path, params = undefined) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function http(method, path, body, { headers = {}, params } = {}) {
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  const res = await fetch(buildUrl(path, params), options);
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`API ${method} ${path} failed: ${res.status} ${res.statusText} ${errText}`);
  }
  if (contentType.includes('application/json')) {
    return res.json();
  }
  // Fallback to text
  return res.text();
}

// PUBLIC_INTERFACE
export const api = {
  /** Ping root */
  // PUBLIC_INTERFACE
  async root() {
    return http('GET', '/');
  },
  // PUBLIC_INTERFACE
  async run(payload) {
    return http('POST', '/run', payload);
  },
  // PUBLIC_INTERFACE
  async stop() {
    return http('POST', '/stop');
  },
  // PUBLIC_INTERFACE
  async logs(params) {
    return http('GET', '/logs', undefined, { params });
  },
  // PUBLIC_INTERFACE
  async stats() {
    return http('GET', '/stats');
  },
  // PUBLIC_INTERFACE
  async caseStatus() {
    return http('GET', '/case_status');
  },
  // PUBLIC_INTERFACE
  async progress() {
    return http('GET', '/progress');
  },
  // PUBLIC_INTERFACE
  async currentCaseInfo() {
    return http('GET', '/current_case_info');
  },
  // PUBLIC_INTERFACE
  async getConfig() {
    return http('GET', '/config');
  },
  // PUBLIC_INTERFACE
  async saveConfig(payload) {
    return http('POST', '/config', payload);
  },
  // PUBLIC_INTERFACE
  async listConfigFolders() {
    return http('GET', '/list_config_folders');
  },
  // PUBLIC_INTERFACE
  async uiLock(payload) {
    return http('POST', '/ui_lock', payload);
  },
  // PUBLIC_INTERFACE
  async syncState(payload) {
    return http('POST', '/sync_state', payload);
  },
  // PUBLIC_INTERFACE
  async getState() {
    return http('GET', '/get_state');
  },
  // PUBLIC_INTERFACE
  async batchLog() {
    return http('GET', '/batch_log');
  },
  // PUBLIC_INTERFACE
  async failLog() {
    return http('GET', '/fail_log');
  },
  // PUBLIC_INTERFACE
  async expectedTotal() {
    return http('GET', '/expected_total');
  },
};

export { API_BASE };
