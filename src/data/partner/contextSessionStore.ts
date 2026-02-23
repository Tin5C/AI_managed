// Context Session Store — single source of truth for active date/session across Partner views
// Persists via localStorage (consistent with existing Partner stores pattern).
// Deterministic defaults; no time-based auto-reset.

const STORAGE_KEY = 'partner:contextSession';

const DEFAULT_DATE = '2026-02-10';

interface ContextSession {
  sessionId: string;
  activeContextDate: string; // ISO date, e.g. "2026-02-10"
}

function generateSessionId(): string {
  return `sess_${Date.now().toString(36)}`;
}

function load(): ContextSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ContextSession>;
      if (parsed.sessionId && parsed.activeContextDate) {
        return parsed as ContextSession;
      }
    }
  } catch {
    // graceful fallback
  }
  const fresh: ContextSession = {
    sessionId: generateSessionId(),
    activeContextDate: DEFAULT_DATE,
  };
  persist(fresh);
  return fresh;
}

let _session: ContextSession = load();

function persist(s: ContextSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // storage unavailable — in-memory still works
  }
}

// ============= Public API =============

export function getContextSession(): Readonly<ContextSession> {
  return _session;
}

export function getActiveContextDate(): string {
  return _session.activeContextDate;
}

export function setActiveContextDate(dateIso: string) {
  _session = { ..._session, activeContextDate: dateIso };
  persist(_session);
  if (import.meta.env.DEV) console.debug('[contextSessionStore] activeContextDate', dateIso);
}

export function setSessionId(id: string) {
  _session = { ..._session, sessionId: id };
  persist(_session);
}

export function clearActiveContextDate() {
  _session = { ..._session, activeContextDate: DEFAULT_DATE };
  persist(_session);
  if (import.meta.env.DEV) console.debug('[contextSessionStore] activeContextDate cleared → default');
}

export function startNewSession(nextSessionId?: string) {
  _session = {
    sessionId: nextSessionId ?? generateSessionId(),
    activeContextDate: _session.activeContextDate, // date persists unless caller explicitly resets
  };
  persist(_session);
}
