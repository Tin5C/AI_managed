// buildStrategicTheses — deterministic thesis sentence builder for POV selection
// No new content generated. Templates are hardcoded; only driver phrase is substituted.

import type { PovMode } from './buildPovOrdering';
import { getSignal } from '@/data/partner/signalStore';

/** Extract a short phrase from a signal title: take text before — or : , trim, max 64 chars whole-word. */
function extractPhrase(raw: string): string {
  const segment = raw.split(/\s*[—:]\s*/)[0].trim();
  if (segment.length <= 64) return segment;
  const trimmed = segment.slice(0, 64);
  const lastSpace = trimmed.lastIndexOf(' ');
  return lastSpace > 20 ? trimmed.slice(0, lastSpace) : trimmed;
}

/** Play-specific fallback phrases when no driver title is available. */
function playFallback(playId: string): string {
  const id = playId.toLowerCase();
  if (id.includes('finops') || id.includes('cost')) return 'AI cost visibility gap';
  if (id.includes('govern')) return 'governance approval bottleneck';
  return 'current constraints';
}

/**
 * Derive the primary driver phrase from signal IDs, with play-specific fallback.
 */
export function deriveDriverPhrase(signalIds: string[], playId: string): string {
  for (const sid of signalIds) {
    const sig = getSignal(sid);
    if (!sig) continue;
    const phrase = extractPhrase(sig.title);
    if (phrase) return phrase;
  }
  return playFallback(playId);
}

/** Play-aware thesis templates keyed by play category then POV. {p1} is substituted. */
type TemplateSet = Record<PovMode, string>;

const FINOPS_TEMPLATES: TemplateSet = {
  risk: 'Turn {p1} into spend guardrails — so AI can scale without blowing the budget.',
  growth: 'Use {p1} to unlock cost predictability — and accelerate adoption with spend discipline.',
  strategic: 'Make {p1} a FinOps advantage — positioning cost transparency as competitive leverage.',
};

const GOVERNANCE_TEMPLATES: TemplateSet = {
  risk: 'Turn {p1} into enforceable guardrails — so AI can scale without increasing risk.',
  growth: 'Use {p1} to remove the approval bottleneck — and accelerate time-to-value across teams.',
  strategic: 'Make {p1} a structural advantage — positioning governance as competitive leverage, not overhead.',
};

const DEFAULT_TEMPLATES: TemplateSet = {
  risk: 'Turn {p1} into enforceable guardrails — so AI can scale without increasing risk.',
  growth: 'Use {p1} to remove the bottleneck — and accelerate time-to-value across teams.',
  strategic: 'Make {p1} a structural advantage — positioning governance as competitive leverage, not overhead.',
};

function templatesForPlay(playId: string): TemplateSet {
  const id = playId.toLowerCase();
  if (id.includes('finops') || id.includes('cost')) return FINOPS_TEMPLATES;
  if (id.includes('govern')) return GOVERNANCE_TEMPLATES;
  return DEFAULT_TEMPLATES;
}

export interface ThesisItem {
  pov: PovMode;
  thesis: string;
}

/** Build 3 thesis sentences from driver phrases, play-aware. Deterministic, no generation. */
export function buildTheses(signalIds: string[], playId: string): ThesisItem[] {
  const p1 = deriveDriverPhrase(signalIds, playId);
  const templates = templatesForPlay(playId);
  return (['risk', 'growth', 'strategic'] as PovMode[]).map((pov) => ({
    pov,
    thesis: templates[pov].replace('{p1}', p1),
  }));
}

/** One-line supporting sentence per POV (generic, no invented facts). */
export const POV_SUPPORT: Record<PovMode, string> = {
  risk: 'Recommendations are ordered to prioritise compliance alignment and risk reduction.',
  growth: 'Recommendations are ordered to prioritise adoption velocity and measurable ROI.',
  strategic: 'Recommendations are ordered to prioritise platform consolidation and long-term differentiation.',
};
