// StakeholderStore — in-memory stakeholder mapping per account
// Maps to Deal Planning persona tabs. Additive only.

export type PersonaKey = 'cio_vp_engineering' | 'cfo_finance' | 'procurement';

export type StakeholderConfidence = 'low' | 'medium' | 'high';

export interface Stakeholder {
  id: string;
  focusId: string;
  persona: PersonaKey;
  name: string;
  title: string;
  sourceUrl: string | null;
  confidence: StakeholderConfidence;
}

// ============= In-memory store =============

const store: Stakeholder[] = [];

// ============= Retrieval =============

export function listStakeholders(focusId: string): Stakeholder[] {
  return store.filter((s) => s.focusId === focusId);
}

export function getStakeholdersByPersona(focusId: string, persona: PersonaKey): Stakeholder[] {
  return store.filter((s) => s.focusId === focusId && s.persona === persona);
}

// ============= Seed =============

const SEEDS: Stakeholder[] = [
  // Schindler
  {
    id: 'stk-schindler-cio_vp_engineering-huber',
    focusId: 'schindler',
    persona: 'cio_vp_engineering',
    name: 'Markus Huber',
    title: 'Head of IT',
    sourceUrl: null,
    confidence: 'medium',
  },
  {
    id: 'stk-schindler-cfo_finance-data_needed',
    focusId: 'schindler',
    persona: 'cfo_finance',
    name: 'DATA_NEEDED',
    title: 'DATA_NEEDED',
    sourceUrl: null,
    confidence: 'low',
  },
  {
    id: 'stk-schindler-procurement-data_needed',
    focusId: 'schindler',
    persona: 'procurement',
    name: 'DATA_NEEDED',
    title: 'DATA_NEEDED',
    sourceUrl: null,
    confidence: 'low',
  },
  // FIFA
  {
    id: 'stk-fifa-cio_vp_engineering-sharma',
    focusId: 'fifa',
    persona: 'cio_vp_engineering',
    name: 'Priya Sharma',
    title: 'CTO',
    sourceUrl: null,
    confidence: 'medium',
  },
  {
    id: 'stk-fifa-cfo_finance-data_needed',
    focusId: 'fifa',
    persona: 'cfo_finance',
    name: 'DATA_NEEDED',
    title: 'DATA_NEEDED',
    sourceUrl: null,
    confidence: 'low',
  },
  {
    id: 'stk-fifa-procurement-dupont',
    focusId: 'fifa',
    persona: 'procurement',
    name: 'Jean-Marc Dupont',
    title: 'Head of Procurement',
    sourceUrl: null,
    confidence: 'medium',
  },
];

function seedStakeholders(): void {
  for (const seed of SEEDS) {
    if (!store.find((s) => s.id === seed.id)) {
      store.push(seed);
    }
  }
}

seedStakeholders();
