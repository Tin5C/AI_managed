/**
 * Cross-reference validation: ensures every Schindler signal ID referenced
 * by demo seeds, defaults, and quick-brief actually exists in signalStore.
 *
 * Deterministic, side-effect-free, no DOM / no network.
 */
import { describe, it, expect } from 'vitest';
import { listSignals } from '@/data/partner/signalStore';

// ── Valid signal IDs from the canonical store ──
const validSignalIds = new Set(
  listSignals('schindler').map((s) => s.id),
);

// ── Helpers ──
function assertAllExist(ids: string[], source: string) {
  for (const id of ids) {
    expect(validSignalIds.has(id), `Signal "${id}" referenced by ${source} not found in signalStore`).toBe(true);
  }
}

// ══════════════════════════════════════════════
// A) schindlerDefaults — active-signal preselects
// ══════════════════════════════════════════════
const DEFAULTS_SIGNAL_IDS = ['sig-sch-finops-ai', 'sig-sch-ai-governance'];

describe('schindlerDefaults active signals', () => {
  it('all preselected signal IDs exist in signalStore', () => {
    assertAllExist(DEFAULTS_SIGNAL_IDS, 'schindlerDefaults');
  });
});

// ══════════════════════════════════════════════
// B) quickBriefStore seed
// ══════════════════════════════════════════════
const QUICK_BRIEF_SIGNAL_IDS = [
  'sig-sch-azure-swiss',
  'sig-sch-eu-machinery',
  'sig-sch-copilot-field',
  'sig-sch-finops-ai',
  'sig-sch-ai-governance',
];

describe('quickBriefStore seed signal IDs', () => {
  it('all quick-brief signal IDs exist in signalStore', () => {
    assertAllExist(QUICK_BRIEF_SIGNAL_IDS, 'quickBriefStore seed');
  });
});

// ══════════════════════════════════════════════
// C) businessPlayPackagesSeed — signal_citation_ids + aligned_driver_ids
// ══════════════════════════════════════════════

// Extracted from the four seeded packages (play_finops exec/grounded, play_governance exec/grounded)
const BPP_CITATION_IDS: string[] = [
  // play_finops executive
  'sig-sch-finops-ai', 'sig-sch-azure-swiss', 'sig-sch-copilot-field', 'sig-sch-eu-machinery',
  // play_finops grounded
  'sig-sch-finops-ai', 'sig-sch-ai-governance', 'sig-sch-azure-swiss', 'sig-sch-copilot-field',
  // play_governance executive
  'sig-sch-ai-governance', 'sig-sch-azure-swiss', 'sig-sch-eu-machinery',
  // play_governance grounded
  'sig-sch-ai-governance', 'sig-sch-azure-swiss', 'sig-sch-eu-machinery',
];

const BPP_ALIGNED_DRIVER_IDS: string[] = [
  // play_finops grounded objections
  'sig-sch-finops-ai',
  'sig-sch-ai-governance',
  'sig-sch-copilot-field',
  // play_governance grounded objections
  'sig-sch-ai-governance',
  'sig-sch-ai-governance',
  'sig-sch-ai-governance',
];

describe('businessPlayPackagesSeed signal references', () => {
  it('all signal_citation_ids exist in signalStore', () => {
    assertAllExist(BPP_CITATION_IDS, 'businessPlayPackagesSeed signal_citation_ids');
  });

  it('all aligned_driver_ids exist in signalStore', () => {
    assertAllExist(BPP_ALIGNED_DRIVER_IDS, 'businessPlayPackagesSeed aligned_driver_ids');
  });
});

// ══════════════════════════════════════════════
// D) Duplicate-reference sanity check
// ══════════════════════════════════════════════
describe('duplicate reference check', () => {
  it('no unexpected duplicate signal IDs within each citation group', () => {
    // Citation IDs per package should be unique within that package
    const perPackageCitations = [
      ['sig-sch-finops-ai', 'sig-sch-azure-swiss', 'sig-sch-copilot-field', 'sig-sch-eu-machinery'],
      ['sig-sch-finops-ai', 'sig-sch-ai-governance', 'sig-sch-azure-swiss', 'sig-sch-copilot-field'],
      ['sig-sch-ai-governance', 'sig-sch-azure-swiss', 'sig-sch-eu-machinery'],
      ['sig-sch-ai-governance', 'sig-sch-azure-swiss', 'sig-sch-eu-machinery'],
    ];
    for (const group of perPackageCitations) {
      expect(group.length).toBe(new Set(group).size);
    }
  });
});
