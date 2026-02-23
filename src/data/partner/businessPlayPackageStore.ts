// BusinessPlayPackage Store — MECE schema for Deal Planning
// In-memory singleton. Partner-only. No mutations to other stores.

export type BusinessVariant = 'executive' | 'grounded';

// ============= Citation Reference =============

export interface CitationRef {
  id: string;
  label?: string;
}

// ============= MECE Blocks =============

export interface MECEStrategic {
  objective: string;
  point_of_view: string;
  context?: string;
}

export interface MECEProofItem {
  statement: string;
  citations?: CitationRef[];
}

export interface MECEEconomic {
  value_hypothesis: string;
  kpis: string[];
  proof: MECEProofItem[];
}

export interface MECEDeliveryItem {
  title: string;
  body?: string;
  citations?: CitationRef[];
}

export interface MECEExecution {
  plan: { steps: string[] };
  delivery: MECEDeliveryItem[];
}

export interface MECEObjection {
  objection: string;
  mitigation?: string;
  citations?: CitationRef[];
}

export interface MECEAdvancement {
  required_info_from_customer: string[];
  objections: MECEObjection[];
}

export interface MECEBlock {
  strategic: MECEStrategic;
  economic: MECEEconomic;
  execution: MECEExecution;
  advancement: MECEAdvancement;
}

// ============= Package =============

export interface BusinessPlayPackage {
  variant: BusinessVariant;
  focus_id: string;
  play_id: string;
  type: string;
  motion: string;
  title: string;
  signal_citation_ids?: string[];
  mece: MECEBlock;
  created_at: string;
}

// ============= Store =============

const store: BusinessPlayPackage[] = [];

export function seedBusinessPlayPackages(packages: BusinessPlayPackage[]): void {
  for (const pkg of packages) {
    const exists = store.some(
      (p) =>
        p.focus_id === pkg.focus_id &&
        p.play_id === pkg.play_id &&
        p.type === pkg.type &&
        p.motion === pkg.motion &&
        p.variant === pkg.variant,
    );
    if (!exists) store.push(pkg);
  }
}

export function getBusinessPlayPackage(params: {
  focusId: string;
  playId: string;
  type: string;
  motion: string;
  variant: BusinessVariant;
}): BusinessPlayPackage | null {
  return (
    store.find(
      (p) =>
        p.focus_id === params.focusId &&
        p.play_id === params.playId &&
        p.type === params.type &&
        p.motion === params.motion &&
        p.variant === params.variant,
    ) ?? null
  );
}

export function getAvailableVariants(params: {
  focusId: string;
  playId: string;
  type: string;
  motion: string;
}): BusinessVariant[] {
  const variants: BusinessVariant[] = [];
  for (const v of ['executive', 'grounded'] as BusinessVariant[]) {
    if (
      store.some(
        (p) =>
          p.focus_id === params.focusId &&
          p.play_id === params.playId &&
          p.type === params.type &&
          p.motion === params.motion &&
          p.variant === v,
      )
    ) {
      variants.push(v);
    }
  }
  return variants;
}
