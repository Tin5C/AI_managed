// buildStrategicTheses — deterministic thesis sentence builder for POV selection
// No new content generated. Templates are hardcoded; only driver phrase is substituted.

import type { PovMode } from './buildPovOrdering';
import { getSignal } from '@/data/partner/signalStore';

/** Extract a short phrase from a signal title: take text before — or : , trim, max 64 chars whole-word. */
function extractPhrase(raw: string): string {
  // Split on em-dash or colon, take first segment
  const segment = raw.split(/\s*[—:]\s*/)[0].trim();
  if (segment.length <= 64) return segment;
  // Truncate to 64 chars keeping whole words
  const trimmed = segment.slice(0, 64);
  const lastSpace = trimmed.lastIndexOf(' ');
  return lastSpace > 20 ? trimmed.slice(0, lastSpace) : trimmed;
}

/**
 * Derive up to 2 unique driver phrases from signal IDs.
 * Priority: signal title (via signalStore lookup).
 * Returns [p1, p2] where p1 is always defined (fallback = "current constraints").
 */
export function deriveDriverPhrases(signalIds: string[]): [string, string] {
  const phrases: string[] = [];
  for (const sid of signalIds) {
    const sig = getSignal(sid);
    if (!sig) continue;
    const phrase = extractPhrase(sig.title);
    if (phrase && !phrases.includes(phrase)) {
      phrases.push(phrase);
      if (phrases.length >= 2) break;
    }
  }
  const p1 = phrases[0] || 'current constraints';
  const p2 = phrases[1] || p1;
  return [p1, p2];
}

/** Hardcoded thesis templates — {p1} is the only substitution variable. */
const TEMPLATES: Record<PovMode, string> = {
  risk: 'Turn {p1} into enforceable guardrails — so AI can scale without increasing risk.',
  growth: 'Use {p1} to remove the bottleneck — and accelerate time-to-value across teams.',
  strategic: 'Make {p1} a structural advantage — positioning governance as competitive leverage, not overhead.',
};

export interface ThesisItem {
  pov: PovMode;
  thesis: string;
}

/** Build 3 thesis sentences from driver phrases. Deterministic, no generation. */
export function buildTheses(signalIds: string[]): ThesisItem[] {
  const [p1] = deriveDriverPhrases(signalIds);
  return (['risk', 'growth', 'strategic'] as PovMode[]).map((pov) => ({
    pov,
    thesis: TEMPLATES[pov].replace('{p1}', p1),
  }));
}

/** One-line supporting sentence per POV (generic, no invented facts). */
export const POV_SUPPORT: Record<PovMode, string> = {
  risk: 'Recommendations are ordered to prioritise compliance alignment and risk reduction.',
  growth: 'Recommendations are ordered to prioritise adoption velocity and measurable ROI.',
  strategic: 'Recommendations are ordered to prioritise platform consolidation and long-term differentiation.',
};
