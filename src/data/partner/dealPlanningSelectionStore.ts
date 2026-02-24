// DealPlanningSelection — Partner-only in-memory store for preselected type/motion per focusId

export type EntryMode = 'guided' | 'problem';

export interface DealPlanningSelection {
  type: string;
  motion: string;
  entryMode: EntryMode;
  customerProblem: string;
}

const store: Map<string, DealPlanningSelection> = new Map();

function ensureEntry(focusId: string): DealPlanningSelection {
  let sel = store.get(focusId);
  if (!sel) {
    sel = { type: '', motion: '', entryMode: 'guided', customerProblem: '' };
    store.set(focusId, sel);
  }
  // backfill for old records missing new fields
  if (!sel.entryMode) sel.entryMode = 'guided';
  if (sel.customerProblem == null) sel.customerProblem = '';
  return sel;
}

export function getDealPlanningSelection(focusId: string): DealPlanningSelection | null {
  return store.get(focusId) ?? null;
}

export function setDealPlanningSelection(focusId: string, selection: Partial<DealPlanningSelection>): void {
  const existing = ensureEntry(focusId);
  store.set(focusId, { ...existing, ...selection });
}

export function clearDealPlanningSelection(focusId: string): void {
  store.delete(focusId);
}

export function getEntryMode(focusId: string): EntryMode {
  return ensureEntry(focusId).entryMode;
}

export function setEntryMode(focusId: string, mode: EntryMode): void {
  const sel = ensureEntry(focusId);
  sel.entryMode = mode;
}

export function getCustomerProblem(focusId: string): string {
  return ensureEntry(focusId).customerProblem;
}

export function setCustomerProblem(focusId: string, problem: string): void {
  const sel = ensureEntry(focusId);
  sel.customerProblem = problem;
}
