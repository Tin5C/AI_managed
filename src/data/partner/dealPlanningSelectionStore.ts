// DealPlanningSelection — Partner-only in-memory store for preselected type/motion per focusId

export type EntryMode = 'guided' | 'problem';

export interface SelectionContext {
  basedOn: { signals: string[]; trends: string[]; initiatives: string[] };
  preselected: { signals: string[]; trends: string[]; initiatives: string[]; evidence?: string[] };
}

export interface DealPlanningSelection {
  type: string;
  motion: string;
  entryMode: EntryMode;
  customerProblem: string;
  selectionContext: SelectionContext;
}

const EMPTY_CONTEXT: SelectionContext = {
  basedOn: { signals: [], trends: [], initiatives: [] },
  preselected: { signals: [], trends: [], initiatives: [], evidence: [] },
};

const store: Map<string, DealPlanningSelection> = new Map();

function ensureEntry(focusId: string): DealPlanningSelection {
  let sel = store.get(focusId);
  if (!sel) {
    sel = { type: '', motion: '', entryMode: 'guided', customerProblem: '', selectionContext: { ...EMPTY_CONTEXT, basedOn: { ...EMPTY_CONTEXT.basedOn }, preselected: { ...EMPTY_CONTEXT.preselected } } };
    store.set(focusId, sel);
  }
  // backfill for old records missing new fields
  if (!sel.entryMode) sel.entryMode = 'guided';
  if (sel.customerProblem == null) sel.customerProblem = '';
  if (!sel.selectionContext) sel.selectionContext = { ...EMPTY_CONTEXT, basedOn: { ...EMPTY_CONTEXT.basedOn }, preselected: { ...EMPTY_CONTEXT.preselected } };
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

export function getSelectionContext(focusId: string): SelectionContext {
  return ensureEntry(focusId).selectionContext;
}

export function setSelectionContext(focusId: string, ctx: Partial<SelectionContext>): void {
  const sel = ensureEntry(focusId);
  sel.selectionContext = { ...sel.selectionContext, ...ctx };
}
