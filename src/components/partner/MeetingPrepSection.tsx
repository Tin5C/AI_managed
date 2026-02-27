// Meeting Prep Section (Partner-only)
// Structured meeting briefing grounded in Account Intelligence backend stores
// Replaces Quick Brief as the primary prep tool

import React, { useState, useMemo, useCallback } from 'react';
import {
  Briefcase,
  Building2,
  ChevronDown,
  Plus,
  RefreshCw,
  Target,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  Award,
  FileText,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DEMO_FOCUS_ENTITIES } from '@/data/partner/demo/demoDataset';
import { listSignals, type Signal } from '@/data/partner/signalStore';
import { enrichSignals } from '@/data/partner/signalEnrichment';
import * as publicInitiativesStore from '@/data/partner/publicInitiativesStore';
import * as industryAuthorityTrendsStore from '@/data/partner/industryAuthorityTrendsStore';
import { listMemoryItems } from '@/data/partner/accountMemoryStore';
import { listStakeholders } from '@/data/partner/stakeholderStore';

// ============= Constants =============

const ACCOUNTS = DEMO_FOCUS_ENTITIES.map((e) => ({
  id: e.id.replace(/^focus-/, ''),
  label: e.name,
}));

const THIS_WEEK_OF = '2026-02-10';
const LAST_WEEK_OF = '2026-02-03';
type WeekToggle = 'this' | 'last';

type Depth = '1' | '3' | '10';
const DEPTH_OPTIONS: { value: Depth; label: string }[] = [
  { value: '1', label: '1 min' },
  { value: '3', label: '3 min' },
  { value: '10', label: '10 min' },
];

const MEETING_TYPES: string[] = [
  'Discovery call',
  'QBR / Review',
  'Executive briefing',
  'Technical workshop',
  'Proposal walkthrough',
];

const SIGNAL_POOL_SIZE = 3;

// ============= Types =============

interface PrepOutput {
  strategicDelta: string[];
  talkingPoints: string[];
  questionsToAsk: string[];
  risksObjections: string[];
  proofKPIs: string[];
  sources: string[];
  surfacedSignals: Signal[];
}

// ============= Deterministic generation =============

function buildPrepOutput(
  signals: Signal[],
  focusId: string,
  depth: Depth,
  selectedSignalIndices: number[],
): PrepOutput {
  const initiatives = publicInitiativesStore.getByFocusId(focusId);
  const trendsPack = industryAuthorityTrendsStore.getByFocusId(focusId);
  const memory = listMemoryItems(focusId);
  const stakeholders = listStakeholders(focusId);

  // Select surfaced signals deterministically
  const surfacedSignals = selectedSignalIndices
    .map((i) => signals[i])
    .filter(Boolean);

  const depthMultiplier = depth === '1' ? 1 : depth === '3' ? 2 : 3;

  // Strategic Delta — from signals + trends
  const strategicDelta: string[] = [];
  for (const sig of surfacedSignals.slice(0, 2)) {
    strategicDelta.push(`${sig.title}: ${sig.soWhat}`);
  }
  if (trendsPack?.trends?.[0]) {
    const t = trendsPack.trends[0];
    strategicDelta.push(`Industry trend (${t.source_org}): ${t.trend_title}`);
  }

  // Talking Points — from signals + initiatives
  const talkingPoints: string[] = [];
  for (const sig of surfacedSignals.slice(0, depthMultiplier)) {
    if (sig.talkTrack) talkingPoints.push(sig.talkTrack);
  }
  if (initiatives?.public_it_initiatives) {
    for (const init of initiatives.public_it_initiatives.slice(0, depthMultiplier)) {
      talkingPoints.push(`${init.title} — ${init.summary.slice(0, 120)}`);
    }
  }

  // Questions to Ask — from stakeholders + signal gaps
  const questionsToAsk: string[] = [];
  const validStakeholders = stakeholders.filter((s) => s.name !== 'DATA_NEEDED');
  if (validStakeholders.length > 0) {
    questionsToAsk.push(
      `Ask ${validStakeholders[0].name} (${validStakeholders[0].title}): What's the timeline for the next phase?`
    );
  }
  for (const sig of surfacedSignals.slice(0, depthMultiplier)) {
    if (sig.whatsMissing?.length > 0) {
      questionsToAsk.push(`Validate: ${sig.whatsMissing[0]}`);
    }
  }
  if (trendsPack?.summary?.data_gaps) {
    for (const gap of trendsPack.summary.data_gaps.slice(0, depth === '10' ? 2 : 1)) {
      if (!gap.startsWith('DATA NEEDED:')) {
        questionsToAsk.push(`Probe: ${gap}`);
      }
    }
  }
  if (questionsToAsk.length === 0) questionsToAsk.push('Not available yet.');

  // Risks / Objections — from trends watchouts + signal gaps
  const risksObjections: string[] = [];
  if (trendsPack?.summary?.near_term_watchouts) {
    for (const w of trendsPack.summary.near_term_watchouts.slice(0, depthMultiplier)) {
      risksObjections.push(w);
    }
  }
  for (const sig of surfacedSignals) {
    if (sig.whatsMissing?.length > 1) {
      risksObjections.push(`Gap: ${sig.whatsMissing[1]}`);
    }
  }
  if (risksObjections.length === 0) risksObjections.push('Not available yet.');

  // Proof / KPIs — from memory + signal proofToRequest
  const proofKPIs: string[] = [];
  if (memory.length > 0) {
    for (const m of memory.slice(0, depthMultiplier)) {
      proofKPIs.push(`${m.type}: ${m.title}`);
    }
  }
  for (const sig of surfacedSignals) {
    if (sig.proofToRequest?.length > 0) {
      proofKPIs.push(`Request: ${sig.proofToRequest[0]}`);
    }
  }
  if (proofKPIs.length === 0) proofKPIs.push('Not available yet.');

  // Sources
  const sources: string[] = [];
  for (const sig of surfacedSignals) {
    sources.push(`Signal: ${sig.title}`);
  }
  if (trendsPack?.trends) {
    for (const t of trendsPack.trends.slice(0, 2)) {
      sources.push(`${t.source_org}: ${t.trend_title.slice(0, 60)}…`);
    }
  }
  if (initiatives?.public_it_initiatives) {
    sources.push(`${initiatives.public_it_initiatives.length} public IT initiative(s)`);
  }
  if (memory.length > 0) {
    sources.push(`${memory.length} evidence item(s) in memory`);
  }

  return {
    strategicDelta,
    talkingPoints,
    questionsToAsk,
    risksObjections,
    proofKPIs,
    sources,
    surfacedSignals,
  };
}

// ============= Component =============

interface MeetingPrepSectionProps {
  onOpenDealBrief?: () => void;
}

export function MeetingPrepSection({ onOpenDealBrief }: MeetingPrepSectionProps) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<WeekToggle>('this');
  const [depth, setDepth] = useState<Depth>('3');
  const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);
  const [generated, setGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Track which signal indices are in each of the 3 slots
  const focusId = selectedAccount ?? ACCOUNTS[0].id;
  const weekOf = selectedWeek === 'this' ? THIS_WEEK_OF : LAST_WEEK_OF;

  const rawSignals = useMemo(() => listSignals(focusId, weekOf), [focusId, weekOf]);
  const signals = useMemo(() => enrichSignals(rawSignals, focusId), [rawSignals, focusId]);

  // Deterministic initial indices: [0, 1, 2]
  const [slotIndices, setSlotIndices] = useState<number[]>([0, 1, 2]);

  const canGenerate = selectedAccount !== null;
  const customerName = selectedAccount
    ? ACCOUNTS.find((a) => a.id === selectedAccount)?.label ?? selectedAccount
    : '';

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setSlotIndices([0, 1, 2]);
    setTimeout(() => {
      setGenerated(true);
      setIsGenerating(false);
    }, 500);
  }, [canGenerate]);

  const handleReset = useCallback(() => {
    setGenerated(false);
    setSlotIndices([0, 1, 2]);
  }, []);

  // Replace a single signal slot with the next candidate
  const handleReplaceSignal = useCallback(
    (slotIndex: number) => {
      if (signals.length <= SIGNAL_POOL_SIZE) return; // no alternatives
      setSlotIndices((prev) => {
        const next = [...prev];
        const usedSet = new Set(next);
        let candidate = next[slotIndex];
        // Find next unused index, cycling
        for (let attempt = 0; attempt < signals.length; attempt++) {
          candidate = (candidate + 1) % signals.length;
          if (!usedSet.has(candidate) || signals.length <= SIGNAL_POOL_SIZE) {
            next[slotIndex] = candidate;
            return next;
          }
        }
        // Fallback: cycle back
        next[slotIndex] = (next[slotIndex] + 1) % signals.length;
        return next;
      });
    },
    [signals.length],
  );

  const output = useMemo(() => {
    if (!generated) return null;
    return buildPrepOutput(signals, focusId, depth, slotIndices);
  }, [generated, signals, focusId, depth, slotIndices]);

  return (
    <section className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Meeting Prep
        </h2>
        <p className="text-sm text-muted-foreground">
          Walk into the meeting sharp — in 1, 3, or 10 minutes.
        </p>
      </div>

      <div
        className={cn(
          'rounded-2xl border border-[hsl(var(--primary)/0.15)] bg-primary/[0.02]',
          'shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
          generated && 'border-solid border-border bg-card',
        )}
      >
        {/* Controls */}
        <div className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            {/* Account picker */}
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Account
              </span>
              <div className="relative">
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors',
                    selectedAccount
                      ? 'border-primary/30 bg-background text-foreground'
                      : 'border-border bg-background text-muted-foreground',
                  )}
                >
                  <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="flex-1 text-left">
                    {selectedAccount
                      ? ACCOUNTS.find((a) => a.id === selectedAccount)?.label
                      : 'Select account…'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                {accountDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-full min-w-[200px] rounded-lg border border-border bg-card shadow-lg z-50 py-1">
                    {ACCOUNTS.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          setSelectedAccount(acc.id);
                          setAccountDropdownOpen(false);
                          setGenerated(false);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm hover:bg-muted/40 transition-colors',
                          selectedAccount === acc.id
                            ? 'text-primary font-medium'
                            : 'text-foreground',
                        )}
                      >
                        {acc.label}
                      </button>
                    ))}
                    <div className="border-t border-border/40 mt-1 pt-1">
                      <button
                        onClick={() => {
                          toast.info('Add account — coming soon');
                          setAccountDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-3 h-3" />
                        Add new account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Week toggle */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Week
              </span>
              <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
                {(['this', 'last'] as WeekToggle[]).map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      setSelectedWeek(w);
                      setGenerated(false);
                    }}
                    className={cn(
                      'px-3 py-2 rounded-md text-xs font-medium transition-colors',
                      selectedWeek === w
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {w === 'this' ? 'This week' : 'Last week'}
                  </button>
                ))}
              </div>
            </div>

            {/* Meeting type */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Meeting
              </span>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium border border-border bg-background text-foreground"
              >
                {MEETING_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Depth */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Depth
              </span>
              <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
                {DEPTH_OPTIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDepth(d.value)}
                    className={cn(
                      'px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap',
                      depth === d.value
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className={cn(
              'flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl',
              'font-semibold text-sm transition-all',
              canGenerate
                ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4" />
                Generate
              </>
            )}
          </button>

          {!canGenerate && (
            <p className="text-[11px] text-muted-foreground text-center">
              Select an account to generate your meeting prep.
            </p>
          )}
        </div>

        {/* Output */}
        {generated && output && (
          <div className="border-t border-border/50 p-5 space-y-5">
            {/* Output header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Meeting Prep — {customerName}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {meetingType} · {depth} min depth · Week of {weekOf}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                New prep
              </button>
            </div>

            {/* Surfaced signals with Replace */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Target className="w-3 h-3" />
                Driving Signals ({output.surfacedSignals.length})
              </p>
              <div className="space-y-1.5">
                {output.surfacedSignals.map((sig, idx) => (
                  <div
                    key={`${sig.id}-${slotIndices[idx]}`}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-border/50 bg-muted/20"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {sig.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {sig.soWhat}
                      </p>
                    </div>
                    <button
                      onClick={() => handleReplaceSignal(idx)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex-shrink-0"
                      title="Replace signal"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Structured sections */}
            <PrepSection
              icon={<Target className="w-3.5 h-3.5" />}
              title="Strategic Delta"
              items={output.strategicDelta}
            />
            <PrepSection
              icon={<MessageSquare className="w-3.5 h-3.5" />}
              title="Key Talking Points"
              items={output.talkingPoints}
            />
            <PrepSection
              icon={<HelpCircle className="w-3.5 h-3.5" />}
              title="Questions to Ask"
              items={output.questionsToAsk}
            />
            <PrepSection
              icon={<AlertTriangle className="w-3.5 h-3.5" />}
              title="Risks / Objections"
              items={output.risksObjections}
            />
            <PrepSection
              icon={<Award className="w-3.5 h-3.5" />}
              title="Proof / KPIs"
              items={output.proofKPIs}
            />
            <PrepSection
              icon={<FileText className="w-3.5 h-3.5" />}
              title="Sources"
              items={output.sources}
              muted
            />
          </div>
        )}
      </div>
    </section>
  );
}

// ============= Sub-component =============

function PrepSection({
  icon,
  title,
  items,
  muted,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
        {icon}
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className={cn(
              'text-xs leading-relaxed pl-3 border-l-2',
              muted
                ? 'text-muted-foreground border-border/40'
                : 'text-foreground border-primary/30',
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
