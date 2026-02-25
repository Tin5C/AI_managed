// buildPovOrdering — deterministic POV reorder+highlight for Business tab
// No new content generated. Only reorders and marks existing items.

import type { BusinessObjection, KPI } from '@/data/partner/businessPlayPackageStore';
import { getSignal } from '@/data/partner/signalStore';

export type PovMode = 'risk' | 'growth' | 'strategic';

// ── Keyword → POV category mapping ──

const RISK_KEYWORDS = ['cost', 'compliance', 'regulation', 'security', 'governance', 'risk', 'audit', 'privacy', 'residency'];
const GROWTH_KEYWORDS = ['scale', 'adoption', 'productivity', 'efficiency', 'time-to-value', 'revenue', 'growth', 'pilot', 'accelerat'];
const STRATEGIC_KEYWORDS = ['platform', 'differentiation', 'operating model', 'portfolio', 'strategy', 'digital twin', 'transformation', 'architecture'];

function scoreText(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((n, kw) => n + (lower.includes(kw) ? 1 : 0), 0);
}

// ── Derive default POV from signal titles ──

export function deriveDefaultPov(signalIds: string[]): PovMode {
  let risk = 0, growth = 0, strategic = 0;
  for (const sid of signalIds) {
    const sig = getSignal(sid);
    if (!sig) continue;
    const text = `${sig.title} ${sig.soWhat} ${sig.whatChanged.join(' ')}`;
    risk += scoreText(text, RISK_KEYWORDS);
    growth += scoreText(text, GROWTH_KEYWORDS);
    strategic += scoreText(text, STRATEGIC_KEYWORDS);
  }
  // Stable tie-break: risk > growth > strategic
  if (risk >= growth && risk >= strategic) return 'risk';
  if (growth >= strategic) return 'growth';
  return 'strategic';
}

// ── Relevance scorer for items against POV ──

function povRelevance(text: string, pov: PovMode): number {
  const keywords = pov === 'risk' ? RISK_KEYWORDS : pov === 'growth' ? GROWTH_KEYWORDS : STRATEGIC_KEYWORDS;
  return scoreText(text, keywords);
}

// ── Stable sort: higher relevance first, preserve original order on tie ──

function stableSort<T>(arr: T[], scoreFn: (item: T) => number): T[] {
  return arr
    .map((item, idx) => ({ item, score: scoreFn(item), idx }))
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
    .map((e) => e.item);
}

// ── Public ordering functions ──

export interface PovKpiResult {
  kpis: KPI[];
  highlightedIndices: Set<number>; // indices in reordered array
}

export function reorderKpis(kpis: KPI[], pov: PovMode): PovKpiResult {
  const sorted = stableSort(kpis, (k) => povRelevance(`${k.label} ${k.target}`, pov));
  const highlightedIndices = new Set<number>();
  for (let i = 0; i < Math.min(3, sorted.length); i++) highlightedIndices.add(i);
  return { kpis: sorted, highlightedIndices };
}

export interface PovObjectionResult {
  objections: BusinessObjection[];
  highlightedIndices: Set<number>;
}

export function reorderObjections(objections: BusinessObjection[], pov: PovMode): PovObjectionResult {
  const sorted = stableSort(objections, (o) => {
    const text = `${o.title} ${o.laer.listen} ${o.laer.acknowledge}`;
    return povRelevance(text, pov);
  });
  const highlightedIndices = new Set<number>();
  for (let i = 0; i < Math.min(2, sorted.length); i++) highlightedIndices.add(i);
  return { objections: sorted, highlightedIndices };
}

export type DeliverySection = 'discovery' | 'workshop' | 'pilot';

export function reorderDeliverySections(pov: PovMode): DeliverySection[] {
  // Risk: pilot first (prove compliance), Growth: discovery first (find opportunities), Strategic: workshop first (design architecture)
  if (pov === 'risk') return ['pilot', 'discovery', 'workshop'];
  if (pov === 'growth') return ['discovery', 'workshop', 'pilot'];
  return ['workshop', 'discovery', 'pilot'];
}

export interface TalkTrackItem { persona: string; message: string; }

export function reorderTalkTracks(tracks: TalkTrackItem[], pov: PovMode): TalkTrackItem[] {
  return stableSort(tracks, (tt) => povRelevance(`${tt.persona} ${tt.message}`, pov));
}

// ── Framing paragraphs (hardcoded, no invented facts) ──

export const POV_FRAMING: Record<PovMode, string> = {
  risk: 'This engagement is framed around risk mitigation and compliance assurance. The recommendations prioritise governance alignment, data-residency controls, and regulatory readiness to reduce exposure and accelerate approval gates.',
  growth: 'This engagement is framed around growth acceleration and operational efficiency. The recommendations prioritise adoption velocity, measurable productivity gains, and time-to-value to maximise return on investment.',
  strategic: 'This engagement is framed around strategic operating-model transformation. The recommendations prioritise platform consolidation, architectural differentiation, and long-term portfolio alignment.',
};

export const POV_LABELS: Record<PovMode, string> = {
  risk: 'Risk',
  growth: 'Growth',
  strategic: 'Strategic',
};
