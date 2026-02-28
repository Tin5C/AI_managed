// Meeting Prep Section v2 (Partner-only)
// Compact Internal-like layout with fake calendar, context accordion,
// TOP THINGS TO KNOW output grounded in canonical Partner stores.

import React, { useState, useMemo, useCallback } from 'react';
import {
  Briefcase,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Plus,
  RefreshCw,
  Target,
  FileText,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  Award,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEMO_FOCUS_ENTITIES } from '@/data/partner/demo/demoDataset';
import { buildSignalPool, type PooledSignal } from '@/partner/data/dealPlanning/signalPool';
import * as publicInitiativesStore from '@/data/partner/publicInitiativesStore';
import * as industryAuthorityTrendsStore from '@/data/partner/industryAuthorityTrendsStore';
import { listMemoryItems } from '@/data/partner/accountMemoryStore';
import { listStakeholders } from '@/data/partner/stakeholderStore';
import {
  listVendorIntelByFocusAndWeek,
  type VendorIntelItem,
  type VendorIntelItemType,
} from '@/data/partner/vendorIntelStore';

// ============= Constants =============

const ACCOUNTS = DEMO_FOCUS_ENTITIES.map((e) => ({
  id: e.id.replace(/^focus-/, ''),
  label: e.name,
}));

const WEEK_OF = '2026-02-10';

const MEETING_TYPES = [
  'Discovery',
  'Renewal',
  'Exec alignment',
  'Objection handling',
  'Demo',
] as const;

const MEETING_GOAL_CHIPS = [
  'Qualify opportunity',
  'Advance deal stage',
  'Build relationship',
  'Present solution',
  'Handle objections',
  'Close next steps',
] as const;

const MOCK_CALENDAR_ITEMS = [
  { id: 'cal-1', title: 'Architecture review — Schindler CTO', time: 'Feb 14, 10:00' },
  { id: 'cal-2', title: 'Discovery call — FIFA Digital', time: 'Feb 18, 14:00' },
  { id: 'cal-3', title: 'QBR prep internal', time: 'Feb 20, 09:00' },
];

const SIGNAL_SLOTS = 3;

// ============= Types =============

interface PrepOutput {
  topSignals: PooledSignal[];
  talkingPoints: string[];
  questionsToAsk: string[];
  risksObjections: string[];
  proofKPIs: string[];
  sources: string[];
}

// ============= Deterministic generation =============

function buildPrepOutput(
  pool: PooledSignal[],
  focusId: string,
  slotIndices: number[],
): PrepOutput {
  const initiatives = publicInitiativesStore.getByFocusId(focusId);
  const trendsPack = industryAuthorityTrendsStore.getByFocusId(focusId);
  const memory = listMemoryItems(focusId);
  const stakeholders = listStakeholders(focusId);

  const topSignals = slotIndices.map((i) => pool[i]).filter(Boolean);
  const depthMul = 3;

  // Talking Points — from signals + initiatives
  const talkingPoints: string[] = [];
  for (const sig of topSignals.slice(0, depthMul)) {
    if (sig.soWhat) talkingPoints.push(`${sig.title} — ${sig.soWhat}`);
  }
  if (initiatives?.public_it_initiatives) {
    for (const init of initiatives.public_it_initiatives.slice(0, depthMul)) {
      talkingPoints.push(`${init.title} — ${init.summary.slice(0, 120)}`);
    }
  }
  if (talkingPoints.length === 0) talkingPoints.push('Not available yet.');

  // Questions to Ask — from stakeholders + trends gaps
  const questionsToAsk: string[] = [];
  const validStakeholders = stakeholders.filter((s) => s.name !== 'DATA_NEEDED');
  if (validStakeholders.length > 0) {
    questionsToAsk.push(
      `Ask ${validStakeholders[0].name} (${validStakeholders[0].title}): What's the timeline for the next phase?`,
    );
  }
  if (trendsPack?.summary?.data_gaps) {
    for (const gap of trendsPack.summary.data_gaps.slice(0, 2)) {
      if (!gap.startsWith('DATA NEEDED:')) questionsToAsk.push(`Probe: ${gap}`);
    }
  }
  if (questionsToAsk.length === 0) questionsToAsk.push('Not available yet.');

  // Risks / Objections — from trends watchouts
  const risksObjections: string[] = [];
  if (trendsPack?.summary?.near_term_watchouts) {
    for (const w of trendsPack.summary.near_term_watchouts.slice(0, depthMul)) {
      risksObjections.push(w);
    }
  }
  if (risksObjections.length === 0) risksObjections.push('Not available yet.');

  // Proof / KPIs — from memory
  const proofKPIs: string[] = [];
  if (memory.length > 0) {
    for (const m of memory.slice(0, depthMul)) {
      proofKPIs.push(`${m.type}: ${m.title}`);
    }
  }
  if (proofKPIs.length === 0) proofKPIs.push('Not available yet.');

  // Sources
  const sources: string[] = [];
  for (const sig of topSignals) sources.push(`Signal: ${sig.title}`);
  if (trendsPack?.trends) {
    for (const t of trendsPack.trends.slice(0, 2)) {
      sources.push(`${t.source_org}: ${t.trend_title.slice(0, 60)}…`);
    }
  }
  if (initiatives?.public_it_initiatives) {
    sources.push(`${initiatives.public_it_initiatives.length} public IT initiative(s)`);
  }
  if (memory.length > 0) sources.push(`${memory.length} evidence item(s) in memory`);

  return { topSignals, talkingPoints, questionsToAsk, risksObjections, proofKPIs, sources };
}

// ============= Component =============

interface MeetingPrepSectionProps {
  onOpenDealBrief?: () => void;
}

export function MeetingPrepSection({ onOpenDealBrief }: MeetingPrepSectionProps) {
  // Controls
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [meetingType, setMeetingType] = useState<string>(MEETING_TYPES[0]);
  const [meetingTypeOpen, setMeetingTypeOpen] = useState(false);

  // Context accordion
  const [contextOpen, setContextOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [contextStakeholders, setContextStakeholders] = useState<string[]>([]);
  const [newStakeholder, setNewStakeholder] = useState('');

  // Generation state
  const [generated, setGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [slotIndices, setSlotIndices] = useState<number[]>([0, 1, 2]);

  const focusId = selectedAccount ?? ACCOUNTS[0].id;
  const weekOf = WEEK_OF;
  const pool = useMemo(() => buildSignalPool(focusId, weekOf), [focusId, weekOf]);

  const canGenerate = selectedAccount !== null;
  const customerName = ACCOUNTS.find((a) => a.id === selectedAccount)?.label ?? '';

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setSlotIndices([0, 1, 2]);
    setTimeout(() => {
      setGenerated(true);
      setIsGenerating(false);
    }, 400);
  }, [canGenerate]);

  const handleReplaceSignal = useCallback(
    (slotIndex: number) => {
      if (pool.length <= SIGNAL_SLOTS) return;
      setSlotIndices((prev) => {
        const next = [...prev];
        const used = new Set(next);
        let candidate = next[slotIndex];
        for (let i = 0; i < pool.length; i++) {
          candidate = (candidate + 1) % pool.length;
          if (!used.has(candidate)) {
            next[slotIndex] = candidate;
            return next;
          }
        }
        next[slotIndex] = (next[slotIndex] + 1) % pool.length;
        return next;
      });
    },
    [pool.length],
  );

  const output = useMemo(() => {
    if (!generated) return null;
    return buildPrepOutput(pool, focusId, slotIndices);
  }, [generated, pool, focusId, slotIndices]);

  const addStakeholder = () => {
    const v = newStakeholder.trim();
    if (v && !contextStakeholders.includes(v)) {
      setContextStakeholders((p) => [...p, v]);
      setNewStakeholder('');
    }
  };

  return (
    <section className="space-y-3">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          Meeting Prep
        </h2>
        <p className="text-xs text-muted-foreground">
          Walk into the meeting sharp.
        </p>
      </div>

      <div className={cn(
        'rounded-xl border border-border bg-card shadow-sm',
        generated && 'border-primary/20',
      )}>
        {/* ===== Compact Control Row ===== */}
        <div className="p-3 space-y-2.5">
          {/* Row 1: Calendar (mock) + Account + Meeting Type */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Calendar mock */}
            <div className="relative">
              <button
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                Meetings
                <span className="text-[9px] bg-muted px-1 rounded text-muted-foreground/70">Coming soon</span>
              </button>
              {calendarOpen && (
                <div className="absolute left-0 top-full mt-1 w-64 rounded-lg border border-border bg-card shadow-lg z-50 p-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide px-2 pb-1">
                    Upcoming (mock)
                  </p>
                  {MOCK_CALENDAR_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCalendarOpen(false)}
                      className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted/40 transition-colors"
                    >
                      <span className="font-medium text-foreground">{item.title}</span>
                      <span className="text-muted-foreground ml-1.5">{item.time}</span>
                    </button>
                  ))}
                  <p className="text-[10px] text-muted-foreground/60 px-2 pt-1 border-t border-border/40 mt-1">
                    Calendar integration coming soon
                  </p>
                </div>
              )}
            </div>

            {/* Account picker */}
            <div className="relative">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                  selectedAccount
                    ? 'border-primary/30 bg-primary/5 text-foreground'
                    : 'border-border bg-background text-muted-foreground',
                )}
              >
                <Building2 className="w-3.5 h-3.5" />
                {selectedAccount ? customerName : 'Account…'}
                <ChevronDown className="w-3 h-3" />
              </button>
              {accountOpen && (
                <div className="absolute left-0 top-full mt-1 w-48 rounded-lg border border-border bg-card shadow-lg z-50 py-1">
                  {ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setSelectedAccount(acc.id);
                        setAccountOpen(false);
                        setGenerated(false);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-1.5 text-xs hover:bg-muted/40 transition-colors',
                        selectedAccount === acc.id ? 'text-primary font-medium' : 'text-foreground',
                      )}
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Meeting type dropdown */}
            <div className="relative">
              <button
                onClick={() => setMeetingTypeOpen(!meetingTypeOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border bg-background text-foreground transition-colors"
              >
                {meetingType}
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
              {meetingTypeOpen && (
                <div className="absolute left-0 top-full mt-1 w-44 rounded-lg border border-border bg-card shadow-lg z-50 py-1">
                  {MEETING_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setMeetingType(t);
                        setMeetingTypeOpen(false);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-1.5 text-xs hover:bg-muted/40 transition-colors',
                        meetingType === t ? 'text-primary font-medium' : 'text-foreground',
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Generate */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Generate button — compact */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ml-auto',
                canGenerate
                  ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]'
                  : 'bg-muted text-muted-foreground cursor-not-allowed',
              )}
            >
              {isGenerating ? (
                <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Briefcase className="w-3 h-3" />
              )}
              Generate Snapshot
            </button>
          </div>

          {!canGenerate && !generated && (
            <p className="text-[10px] text-muted-foreground">Select an account to generate your meeting prep.</p>
          )}

          {/* ===== Add Context Accordion ===== */}
          <div className="border-t border-border/40 pt-2">
            <button
              onClick={() => setContextOpen(!contextOpen)}
              className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {contextOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              Add context
              <span className="text-muted-foreground/50">(optional)</span>
            </button>

            {contextOpen && (
              <div className="mt-2 space-y-3 pl-1">
                {/* Notes */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Key topics, concerns, or context for this meeting…"
                    className="w-full min-h-[60px] rounded-lg border border-border bg-background px-2.5 py-2 text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                  />
                </div>

                {/* Meeting goal chips */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Meeting goal
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {MEETING_GOAL_CHIPS.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => setSelectedGoal(selectedGoal === goal ? null : goal)}
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors',
                          selectedGoal === goal
                            ? 'border-primary/40 bg-primary/10 text-primary'
                            : 'border-border bg-muted/20 text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stakeholders */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Stakeholders
                  </label>
                  {contextStakeholders.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {contextStakeholders.map((s) => (
                        <span key={s} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border border-border bg-muted/20 text-foreground">
                          {s}
                          <button onClick={() => setContextStakeholders((p) => p.filter((x) => x !== s))} className="hover:text-destructive">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <input
                      value={newStakeholder}
                      onChange={(e) => setNewStakeholder(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addStakeholder()}
                      placeholder="Add stakeholder…"
                      className="flex-1 px-2.5 py-1 rounded-lg border border-border bg-background text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                    <button
                      onClick={addStakeholder}
                      className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== Generated Output ===== */}
        {generated && output && (
          <div className="border-t border-border/50 p-4 space-y-4">
            {/* Output header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Meeting Prep — {customerName}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {meetingType} · Week of {weekOf}
                </p>
              </div>
              <button
                onClick={() => { setGenerated(false); setSlotIndices([0, 1, 2]); }}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                New prep
              </button>
            </div>

            {/* TOP THINGS TO KNOW */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Target className="w-3 h-3 text-primary" />
                Top Things to Know
              </p>
              <div className="space-y-1.5">
                {output.topSignals.map((sig, idx) => (
                  <div
                    key={`${sig.id}-${slotIndices[idx]}`}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border/50 bg-muted/20"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{sig.title}</p>
                      {sig.soWhat && (
                        <p className="text-[10px] text-muted-foreground truncate">{sig.soWhat}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleReplaceSignal(idx)}
                      className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex-shrink-0"
                      title="Replace signal"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Structured sections */}
            <PrepSection icon={<MessageSquare className="w-3 h-3" />} title="Key Talking Points" items={output.talkingPoints} />
            <PrepSection icon={<HelpCircle className="w-3 h-3" />} title="Questions to Ask" items={output.questionsToAsk} />
            <PrepSection icon={<AlertTriangle className="w-3 h-3" />} title="Risks / Objections" items={output.risksObjections} />
            <PrepSection icon={<Award className="w-3 h-3" />} title="Proof / KPIs" items={output.proofKPIs} />

            {/* Vendor Intel */}
            <VendorIntelSection focusId={focusId} weekOf={weekOf} />

            {/* Sources (collapsed) */}
            <SourcesSection
              sources={output.sources}
              contextProvided={!!(notes || selectedGoal || contextStakeholders.length)}
            />
          </div>
        )}
      </div>
    </section>
  );
}

// ============= Sub-components =============

function PrepSection({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
        {icon}
        {title}
      </p>
      <ul className="space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs leading-relaxed pl-3 border-l-2 border-primary/30 text-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SourcesSection({ sources, contextProvided }: { sources: string[]; contextProvided: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-1">
      <button
        onClick={() => setOpen(!open)}
        className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        <FileText className="w-3 h-3" />
        Sources
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
      {open && (
        <ul className="space-y-0.5">
          {sources.map((s, i) => (
            <li key={i} className="text-[10px] leading-relaxed pl-3 border-l-2 border-border/40 text-muted-foreground">
              {s}
            </li>
          ))}
          {contextProvided && (
            <li className="text-[10px] leading-relaxed pl-3 border-l-2 border-border/40 text-muted-foreground italic">
              Context provided by user
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

const VENDOR_INTEL_CATEGORIES: { type: VendorIntelItemType; label: string }[] = [
  { type: 'update', label: 'Latest updates' },
  { type: 'reference_case', label: 'Reference cases' },
  { type: 'kpi', label: 'KPIs' },
  { type: 'pitch_drill', label: 'Pitch drills' },
];

function VendorIntelSection({ focusId, weekOf }: { focusId: string; weekOf: string }) {
  const items = listVendorIntelByFocusAndWeek(focusId, weekOf, 'microsoft');
  const allItems = items.length > 0 ? items : listVendorIntelByFocusAndWeek(focusId, weekOf);

  const byType = (type: VendorIntelItemType) => allItems.filter((i) => i.type === type);

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
        <Zap className="w-3 h-3 text-primary" />
        Vendor Intel (Microsoft)
      </p>
      <div className="space-y-1">
        {VENDOR_INTEL_CATEGORIES.map(({ type, label }) => {
          const cat = byType(type);
          return (
            <div key={type}>
              <p className="text-[10px] font-medium text-muted-foreground/80 pl-3">{label}</p>
              {cat.length === 0 ? (
                <p className="text-[10px] text-muted-foreground/50 pl-3 italic">Not available yet.</p>
              ) : (
                <ul className="space-y-0.5">
                  {cat.map((item) => (
                    <li key={item.id} className="text-xs leading-relaxed pl-3 border-l-2 border-primary/20 text-foreground">
                      <span className="font-medium">{item.title}</span>
                      {item.summary && (
                        <span className="text-muted-foreground"> — {item.summary}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
