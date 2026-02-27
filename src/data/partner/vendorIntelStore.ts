// VendorIntelStore — Partner-only in-memory vendor enablement items
// Seeded for schindler + fifa with Microsoft as primary vendor.

export type VendorIntelItemType = 'update' | 'reference_case' | 'kpi' | 'pitch_drill';

export interface VendorIntelItem {
  id: string;
  focusId: string;
  vendorId: string;
  type: VendorIntelItemType;
  title: string;
  summary?: string;
  sourceUrl?: string;
  weekOf?: string;
}

// ============= In-memory store =============

const store: VendorIntelItem[] = [];

// ============= Retrieval =============

export function listVendorIntelByFocus(
  focusId: string,
  vendorId?: string,
): VendorIntelItem[] {
  return store.filter((i) => {
    if (i.focusId !== focusId) return false;
    if (vendorId && i.vendorId !== vendorId) return false;
    return true;
  });
}

export function listVendorIntelByFocusAndWeek(
  focusId: string,
  weekOf: string,
  vendorId?: string,
): VendorIntelItem[] {
  return store.filter((i) => {
    if (i.focusId !== focusId) return false;
    if (vendorId && i.vendorId !== vendorId) return false;
    if (i.weekOf && i.weekOf !== weekOf) return false;
    return true;
  });
}

// ============= Seed =============

const SEEDS: VendorIntelItem[] = [
  // Schindler + Microsoft
  {
    id: 'vi-schindler-microsoft-azure-swiss',
    focusId: 'schindler',
    vendorId: 'microsoft',
    type: 'update',
    title: 'Azure OpenAI now GA in Switzerland North — data residency unlocked',
    summary: 'Swiss-hosted GPT-4o removes compliance blockers for regulated workloads.',
    weekOf: '2026-02-10',
  },
  {
    id: 'vi-schindler-microsoft-ref-kone',
    focusId: 'schindler',
    vendorId: 'microsoft',
    type: 'reference_case',
    title: 'ThyssenKrupp: Azure Digital Twins for predictive elevator maintenance',
    summary: '30% reduction in unplanned downtime using Azure IoT + Digital Twins across 12K units.',
  },
  {
    id: 'vi-schindler-microsoft-kpi-copilot',
    focusId: 'schindler',
    vendorId: 'microsoft',
    type: 'kpi',
    title: 'Copilot for Field Service: avg. 18% faster work-order triage in preview customers',
    summary: 'Based on Microsoft internal preview cohort (n=14 enterprise customers).',
  },
  {
    id: 'vi-schindler-microsoft-pitch-governance',
    focusId: 'schindler',
    vendorId: 'microsoft',
    type: 'pitch_drill',
    title: 'AI Governance readiness — 3 questions for the CISO',
    summary: 'Quick qualification drill for security-gated AI adoption conversations.',
  },
  // FIFA + Microsoft
  {
    id: 'vi-fifa-microsoft-copilot-ga',
    focusId: 'fifa',
    vendorId: 'microsoft',
    type: 'update',
    title: 'Microsoft 365 Copilot: new governance controls for large-scale deployments',
    summary: 'Admin-level usage policies and sensitivity-label enforcement now GA.',
    weekOf: '2026-02-10',
  },
  {
    id: 'vi-fifa-microsoft-ref-ioc',
    focusId: 'fifa',
    vendorId: 'microsoft',
    type: 'reference_case',
    title: 'IOC: Azure-hosted fan engagement platform for Paris 2024',
    summary: 'Scaled to 200M concurrent sessions with <50ms latency using Azure Front Door + Cosmos DB.',
  },
  {
    id: 'vi-fifa-microsoft-kpi-moderation',
    focusId: 'fifa',
    vendorId: 'microsoft',
    type: 'kpi',
    title: 'Azure Content Safety: 95%+ accuracy on hate-speech detection across 12 languages',
    summary: 'Benchmark from Microsoft Responsible AI team (public report, 2025).',
  },
  {
    id: 'vi-fifa-microsoft-pitch-burst',
    focusId: 'fifa',
    vendorId: 'microsoft',
    type: 'pitch_drill',
    title: 'Event-burst FinOps — cost governance for peak-traffic workloads',
    summary: 'Discovery framework for CFO conversations around tournament-scale cloud spend.',
  },
];

function seedVendorIntel(): void {
  for (const seed of SEEDS) {
    if (!store.find((s) => s.id === seed.id)) {
      store.push(seed);
    }
  }
}

seedVendorIntel();
