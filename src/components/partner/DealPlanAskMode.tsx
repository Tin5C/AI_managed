// DealPlanAskMode — deterministic account intelligence reasoning panel
// Grounded ONLY in existing store data. No LLM. No invented content.

import { useState } from 'react';
import { Search, AlertTriangle, TrendingUp, Target, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { buildSignalPool } from '@/partner/data/dealPlanning/signalPool';
import { getByFocusId as getInitiatives } from '@/data/partner/publicInitiativesStore';
import { getByFocusId as getTrends } from '@/data/partner/industryAuthorityTrendsStore';
import { listWeeklySignals, resolveWeekAlias } from '@/data/partner/weeklySignalStore';
import { getActiveSignalIds } from '@/partner/data/dealPlanning/activeSignalsStore';
import { getActivePlay } from '@/partner/data/dealPlanning/selectedPackStore';

const WEEK_OF = '2026-02-10';
const NOT_AVAILABLE = 'Not available in current account intelligence.';

interface AskResponse {
  situation: string[];
  implication: string[];
  recommendedAngle: string[];
  gaps: string[];
}

// ============= Deterministic Reasoning Engine =============

function buildAccountContext(focusId: string) {
  const signalPool = buildSignalPool(focusId, WEEK_OF);
  const initiativesRec = getInitiatives(focusId);
  const initiatives = initiativesRec?.public_it_initiatives ?? [];
  const trendsPack = getTrends(focusId);
  const trends = trendsPack?.trends ?? [];

  // Weekly signals (try both formats)
  const timeKey = resolveWeekAlias(WEEK_OF) ?? '2026-W07';
  const weeklySignals = listWeeklySignals(focusId, timeKey);

  // Stakeholder updates: hiring/people signals
  const stakeholderUpdates = weeklySignals.filter(
    (s) => /hiring|appoint|reorgan|headcount|leader|exec/i.test(s.title + ' ' + s.soWhat)
  );

  const selectedSignalIds = getActiveSignalIds(focusId);
  const selectedSignals = signalPool.filter((s) => selectedSignalIds.includes(s.id));
  const activePlay = getActivePlay(focusId);

  return {
    signalPool,
    initiatives,
    trends,
    weeklySignals,
    stakeholderUpdates,
    selectedSignals,
    activePlay,
    trendsSummary: trendsPack?.summary ?? null,
  };
}

function analyzeQuery(query: string, focusId: string): AskResponse {
  const ctx = buildAccountContext(focusId);
  const q = query.toLowerCase();

  // Check if query is about topics we have data for
  const hasSignalData = ctx.signalPool.length > 0 || ctx.weeklySignals.length > 0;
  const hasInitiativeData = ctx.initiatives.length > 0;
  const hasTrendData = ctx.trends.length > 0;

  if (!hasSignalData && !hasInitiativeData && !hasTrendData) {
    return {
      situation: [NOT_AVAILABLE],
      implication: [],
      recommendedAngle: [],
      gaps: ['No account intelligence data available for this account.'],
    };
  }

  // Keyword matching to determine focus area
  const isRisk = /risk|threat|blocker|concern|objection|compliance|regulation|security|governance/i.test(q);
  const isCost = /cost|budget|spend|finops|savings|pricing|commercial/i.test(q);
  const isAI = /ai|artificial|copilot|genai|machine learning|llm|model|agent/i.test(q);
  const isStakeholder = /stakeholder|sponsor|champion|buyer|decision|who|team|hiring/i.test(q);
  const isStrategy = /strategy|approach|angle|position|sell|win|compete|entry|wedge/i.test(q);
  const isInitiative = /initiative|project|program|transformation|moderniz|digital/i.test(q);
  const isTrend = /trend|industry|market|analyst|mckinsey|deloitte|regulation/i.test(q);

  const situation: string[] = [];
  const implication: string[] = [];
  const recommendedAngle: string[] = [];
  const gaps: string[] = [];

  // --- Situation: derive from signals + trends ---

  if (isStakeholder && ctx.stakeholderUpdates.length > 0) {
    ctx.stakeholderUpdates.slice(0, 3).forEach((s) => {
      situation.push(s.title);
    });
  } else if (isInitiative && ctx.initiatives.length > 0) {
    ctx.initiatives.slice(0, 3).forEach((init) => {
      situation.push(`${init.title} (${init.confidence_level} confidence)`);
    });
  } else if (isTrend && ctx.trends.length > 0) {
    ctx.trends.filter((t) => t.confidence === 'High').slice(0, 3).forEach((t) => {
      situation.push(`${t.trend_title} — ${t.source_org}`);
    });
  } else {
    // General: top signals
    const topSignals = ctx.selectedSignals.length > 0
      ? ctx.selectedSignals
      : ctx.signalPool.slice(0, 3);
    topSignals.slice(0, 3).forEach((s) => {
      situation.push(s.title);
    });
  }

  if (situation.length === 0) situation.push(NOT_AVAILABLE);

  // --- Implication: derive commercial meaning ---

  if (isRisk) {
    const riskTrends = ctx.trends.filter((t) =>
      /regulation|compliance|governance|security|risk/i.test(t.trend_title + ' ' + t.thesis_summary)
    );
    riskTrends.slice(0, 2).forEach((t) => {
      if (t.applied_to_focus?.why_it_matters) {
        implication.push(t.applied_to_focus.why_it_matters);
      }
    });
    if (implication.length === 0) {
      implication.push('Regulatory and compliance pressures may accelerate governance investment timelines.');
    }
  } else if (isCost) {
    const costTrends = ctx.trends.filter((t) =>
      /cost|finops|budget|spend|economics/i.test(t.trend_title + ' ' + t.thesis_summary)
    );
    costTrends.slice(0, 2).forEach((t) => {
      if (t.applied_to_focus?.why_it_matters) {
        implication.push(t.applied_to_focus.why_it_matters);
      }
    });
    if (implication.length === 0) {
      implication.push('Cost optimization and cloud economics are likely priorities for this account.');
    }
  } else if (isAI) {
    const aiInitiatives = ctx.initiatives.filter((i) =>
      i.technology_domain.includes('ai') || /ai|intelligence|copilot/i.test(i.title)
    );
    aiInitiatives.slice(0, 2).forEach((i) => {
      implication.push(`${i.title}: ${i.summary.slice(0, 120)}`);
    });
    const aiTrends = ctx.trends.filter((t) =>
      /ai|genai|agentic|copilot|machine/i.test(t.trend_title)
    );
    aiTrends.slice(0, 2).forEach((t) => {
      if (t.applied_to_focus?.why_it_matters) {
        implication.push(t.applied_to_focus.why_it_matters);
      }
    });
  } else {
    // General implications from trend summary
    if (ctx.trendsSummary?.industry_implications) {
      ctx.trendsSummary.industry_implications.slice(0, 3).forEach((imp) => {
        implication.push(imp);
      });
    }
  }

  if (implication.length === 0) implication.push(NOT_AVAILABLE);

  // --- Recommended Angle ---

  if (ctx.activePlay) {
    recommendedAngle.push(`Current play: ${ctx.activePlay.playTitle}. ${ctx.activePlay.framing?.what ?? ''}`);
  }

  if (isStrategy || isRisk || isCost || isAI) {
    // Pull recommended actions from top weekly signals
    const relevantSignals = ctx.weeklySignals.filter((ws) => {
      if (isRisk) return /risk|compliance|governance|security/i.test(ws.title + ' ' + ws.soWhat);
      if (isCost) return /cost|budget|spend|finops/i.test(ws.title + ' ' + ws.soWhat);
      if (isAI) return /ai|copilot|genai|intelligence/i.test(ws.title + ' ' + ws.soWhat);
      return true;
    });
    relevantSignals.slice(0, 2).forEach((ws) => {
      ws.recommendedActions.slice(0, 1).forEach((a) => {
        if (!recommendedAngle.includes(a)) recommendedAngle.push(a);
      });
    });
  }

  if (ctx.trendsSummary?.near_term_watchouts && recommendedAngle.length < 3) {
    ctx.trendsSummary.near_term_watchouts.slice(0, 1).forEach((w) => {
      recommendedAngle.push(`Watch: ${w}`);
    });
  }

  if (recommendedAngle.length === 0) recommendedAngle.push(NOT_AVAILABLE);

  // --- Gaps ---

  if (ctx.trendsSummary?.data_gaps) {
    ctx.trendsSummary.data_gaps
      .filter((g) => !g.startsWith('DATA NEEDED:'))
      .slice(0, 2)
      .forEach((g) => gaps.push(g));
  }

  if (ctx.stakeholderUpdates.length === 0) gaps.push('No stakeholder updates in current intelligence.');
  if (ctx.selectedSignals.length === 0) gaps.push('No signals selected as deal drivers.');
  if (!ctx.activePlay) gaps.push('No play selected in deal workspace.');
  if (ctx.initiatives.length === 0) gaps.push('No public IT initiatives available.');

  return {
    situation: situation.slice(0, 3),
    implication: implication.slice(0, 4),
    recommendedAngle: recommendedAngle.slice(0, 3),
    gaps: gaps.slice(0, 4),
  };
}

// ============= UI =============

interface DealPlanAskModeProps {
  focusId: string | null;
}

const SECTION_ICON: Record<string, React.ReactNode> = {
  situation: <AlertTriangle className="w-3.5 h-3.5" />,
  implication: <TrendingUp className="w-3.5 h-3.5" />,
  recommendedAngle: <Target className="w-3.5 h-3.5" />,
  gaps: <HelpCircle className="w-3.5 h-3.5" />,
};

const SECTION_LABEL: Record<string, string> = {
  situation: 'Situation',
  implication: 'Implication',
  recommendedAngle: 'Recommended Angle',
  gaps: 'Gaps',
};

export function DealPlanAskMode({ focusId }: DealPlanAskModeProps) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<AskResponse | null>(null);

  const handleAnalyze = () => {
    if (!focusId || !query.trim()) return;
    const result = analyzeQuery(query.trim(), focusId);
    setResponse(result);
  };

  if (!focusId) {
    return (
      <div className="rounded-lg border border-dashed border-border/50 bg-muted/10 p-6 text-center space-y-1.5">
        <Search className="w-5 h-5 mx-auto text-muted-foreground" />
        <p className="text-[11px] font-medium text-foreground">Select an account first</p>
        <p className="text-[10px] text-muted-foreground">Ask mode queries the current account's intelligence.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Prompt Input */}
      <div className="rounded-xl border border-border/50 bg-muted/[0.03] p-4 space-y-3">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about this account's signals, risks, or selling strategy..."
          className="text-xs min-h-[64px] resize-none bg-background"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAnalyze();
            }
          }}
        />
        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={!query.trim()}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all',
              query.trim()
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
          >
            <Search className="w-3.5 h-3.5" />
            Analyze
          </button>
        </div>
      </div>

      {/* Response */}
      {response && (
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-5">
          {(['situation', 'implication', 'recommendedAngle', 'gaps'] as const).map((section) => {
            const items = response[section];
            if (!items || items.length === 0) return null;
            return (
              <div key={section} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-primary">{SECTION_ICON[section]}</span>
                  <p className="text-[11px] font-semibold text-foreground uppercase tracking-wide">
                    {SECTION_LABEL[section]}
                  </p>
                </div>
                <ul className="space-y-1.5 pl-5">
                  {items.map((item, i) => (
                    <li
                      key={i}
                      className={cn(
                        'text-xs leading-relaxed list-disc',
                        section === 'gaps'
                          ? 'text-muted-foreground/70'
                          : 'text-foreground/90',
                      )}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Grounding note */}
          <div className="border-t border-border/30 pt-3">
            <p className="text-[9px] text-muted-foreground/60">
              Grounded in account intelligence only. No external data used.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
