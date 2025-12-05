const makeApi = (overrides = {}) => ({
  root: jest.fn().mockResolvedValue('ok'),
  run: jest.fn().mockResolvedValue({ status: 'started' }),
  stop: jest.fn().mockResolvedValue({ status: 'stopped' }),
  logs: jest.fn().mockResolvedValue(''),
  stats: jest.fn().mockResolvedValue({ passed: 0, failed: 0, skipped: 0, total: 0 }),
  caseStatus: jest.fn().mockResolvedValue({ cases: [] }),
  progress: jest.fn().mockResolvedValue({ percent: 0, elapsed: 0, total: 0 }),
  currentCaseInfo: jest.fn().mockResolvedValue(null),
  getConfig: jest.fn().mockResolvedValue({ a: 1 }),
  saveConfig: jest.fn().mockResolvedValue({ ok: true }),
  listConfigFolders: jest.fn().mockResolvedValue([]),
  uiLock: jest.fn().mockResolvedValue({}),
  syncState: jest.fn().mockResolvedValue({}),
  getState: jest.fn().mockResolvedValue({}),
  batchLog: jest.fn().mockResolvedValue('B1\nB2'),
  failLog: jest.fn().mockResolvedValue('F1\nF2'),
  expectedTotal: jest.fn().mockResolvedValue(0),
  ...overrides,
});

// PUBLIC_INTERFACE
const createApiMock = (overrides = {}) => makeApi(overrides);

// By default provide a mutable api object that tests can override per-suite
const defaultApi = makeApi();

// PUBLIC_INTERFACE
const setApiMock = (overrides = {}) => {
  const newApi = makeApi(overrides);
  Object.keys(defaultApi).forEach((k) => {
    defaultApi[k] = newApi[k];
  });
  return defaultApi;
};

// PUBLIC_INTERFACE
const resetApiMock = () => {
  const newApi = makeApi();
  Object.keys(defaultApi).forEach((k) => {
    defaultApi[k] = newApi[k];
  });
};

// Expose api and API_BASE consistent with real module
module.exports = {
  api: defaultApi,
  API_BASE: '',
  __helpers: { createApiMock, setApiMock, resetApiMock },
};
