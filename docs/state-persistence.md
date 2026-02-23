# State Persistence

## Context Session Store

**File:** `src/data/partner/contextSessionStore.ts`

### Persisted Keys

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `activeContextDate` | `string` (ISO date) | `2026-02-10` | Active week-of date shared across Quick Brief, Deal Planning, and Account Intelligence |
| `sessionId` | `string` | Auto-generated | Stable session identifier; survives navigation, only changes on explicit `startNewSession()` |

### Storage

- **Key:** `partner:contextSession` in `localStorage`
- Graceful fallback to in-memory if localStorage is unavailable

### Rationale

Previously, Quick Brief and Deal Planning each declared a local `const WEEK_OF = '2026-02-10'`. Navigating between views (or unmounting/remounting) could lose any date context the user had established. The shared store ensures:

- A single source of truth for the active date
- Persistence across in-app navigation (tab switches, route changes)
- Persistence across page reload (via localStorage)
- No accidental resets on component unmount

### API

| Function | Description |
|----------|-------------|
| `getActiveContextDate()` | Returns current ISO date string |
| `setActiveContextDate(dateIso)` | Updates date and persists |
| `clearActiveContextDate()` | Resets to default date |
| `getContextSession()` | Returns full `{ sessionId, activeContextDate }` |
| `setSessionId(id)` | Updates session ID |
| `startNewSession(nextId?)` | Generates new session ID; date is preserved unless caller explicitly clears |

### Clear Behavior

- `clearActiveContextDate()` resets date to default (`2026-02-10`)
- `startNewSession()` changes session ID but keeps current date
- To fully reset: call both `clearActiveContextDate()` and `startNewSession()`
