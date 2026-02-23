// Deal Plan Drivers View — Single MECE narrative flow with shared Recommended Plays header
// Primary output: Strategic → Economic → Execution → Advancement

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Brain,
  Zap,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Copy,
  Target,
  Clock,
  Pencil,
  Check,
  Crown,
  UserCheck,
  UserX,
  ShoppingCart,
  Rocket,
  Plus,
  Inbox as InboxIcon,
  X,
  Swords,
  DollarSign,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import {
  getDealPlan,
  removePromotedSignal,
  promoteSignalsToDealPlan,
  type PromotedSignal,
} from '@/data/partner/dealPlanStore';
import { type Signal } from '@/data/partner/signalStore';
import {
  DealPlanMetadata,
  type EngagementType,
  type Motion,
} from './DealPlanMetadata';
import { scoreServicePacks, type ScoredPack } from '@/data/partner/servicePackStore';
import { partner_service_configuration } from '@/data/partner/partnerServiceConfiguration';
import {
  listByFocusId,
  removeItem as removeInboxItem,
  type DealPlanningInboxItem,
} from '@/data/partner/dealPlanningInboxStore';
import { addTags } from '@/data/partner/dealPlanningSignalTagsStore';
import { RecommendedPlaysPanel } from '@/partner/components/dealPlanning/RecommendedPlaysPanel';
import { SignalPickerPanel } from '@/partner/components/dealPlanning/SignalPickerPanel';
import { StrategicFramingSection } from '@/partner/components/dealPlanning/StrategicFramingSection';
// TechnicalRecommendationsSection removed — single MECE flow
import { PLAY_SERVICE_PACKS } from '@/partner/data/dealPlanning/servicePacks';
import { scorePlayPacks } from '@/partner/lib/dealPlanning/propensity';
import { setActivePlay, getActivePlay } from '@/partner/data/dealPlanning/selectedPackStore';
import { hydratePlan, getHydratedPlan } from '@/partner/data/dealPlanning/planHydrationStore';
import { WhatWeNeedSection } from '@/partner/components/dealPlanning/WhatWeNeedSection';
import { ExecutionBundleSection } from '@/partner/components/dealPlanning/ExecutionBundleSection';
import { DealHypothesisBlock } from '@/partner/components/dealPlanning/DealHypothesisBlock';
// RisksBlockersSection removed — single MECE flow
import { getReadinessScore } from '@/data/partner/accountMemoryStore';
import { buildComposerInputBusiness } from '@/services/partner/dealPlanning/buildComposerInputBusiness';
import { getActiveSignalIds, setActiveSignals } from '@/partner/data/dealPlanning/activeSignalsStore';
import { consumeDealPlanTrigger } from '@/data/partner/dealPlanTrigger';
import { buildSignalPool } from '@/partner/data/dealPlanning/signalPool';
// getTechLandscape removed — single MECE flow
import { CollapsibleSection } from '@/components/shared/CollapsibleSection';
import { getBusinessPlayPackage, getAvailableVariants, type BusinessVariant } from '@/data/partner/businessPlayPackageStore';
import '@/data/partner/demo/businessPlayPackagesSeed';
import { BusinessPlayPackageView } from '@/partner/components/dealPlanning/BusinessPlayPackageView';
import { ensureSchindlerDefaults } from '@/data/partner/demo/schindlerDefaults';
import { getDealPlanningSelection } from '@/data/partner/dealPlanningSelectionStore';
import { getActiveContextDate } from '@/data/partner/contextSessionStore';

const ACCOUNTS = [
  { id: 'schindler', label: 'Schindler' },
  { id: 'sulzer', label: 'Sulzer' },
  { id: 'ubs', label: 'UBS' },
];

// ViewTab removed — single MECE flow is the primary output

interface DealPlanDriversViewProps {
  onGoToQuickBrief: () => void;
  onGoToAccountIntelligence?: () => void;
}

// ============= Editable Text Block =============

function EditableBlock({ label, icon, value, onChange, placeholder, compact }: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  compact?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onChange(draft);
    setEditing(false);
  };

  return (
    <div className={cn("space-y-1.5", compact && "space-y-1")}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          {icon}
          {label}
        </p>
        {!editing ? (
          <button onClick={() => { setDraft(value); setEditing(true); }} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5">
            <Pencil className="w-2.5 h-2.5" /> Edit
          </button>
        ) : (
          <button onClick={handleSave} className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-0.5">
            <Check className="w-2.5 h-2.5" /> Save
          </button>
        )}
      </div>
      {editing ? (
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="text-xs min-h-[48px]"
        />
      ) : (
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
          {value || <span className="italic opacity-60">{placeholder}</span>}
        </p>
      )}
    </div>
  );
}

// ============= Stakeholder Row =============
// StakeholderRow removed — persona tabs removed in MECE migration

// ============= Account Selector Dropdown =============

function AccountSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/60 bg-background hover:border-primary/30 transition-colors"
      >
        {selectedId ? (
          <span className="text-foreground">
            {ACCOUNTS.find((a) => a.id === selectedId)?.label ?? selectedId}
          </span>
        ) : (
          <span className="text-muted-foreground">Select account...</span>
        )}
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-52 rounded-lg border border-border bg-card shadow-lg z-50 py-1">
          {ACCOUNTS.map((acc) => (
            <button
              key={acc.id}
              onClick={() => { onSelect(acc.id); setOpen(false); }}
              className={cn(
                'w-full text-left px-3 py-2 text-xs hover:bg-muted/40 transition-colors',
                selectedId === acc.id ? 'text-primary font-medium' : 'text-foreground'
              )}
            >
              {acc.label}
            </button>
          ))}
          <div className="border-t border-border/40 mt-1 pt-1">
            <button
              onClick={() => { toast.info('Add account — coming soon'); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3" />
              Add new account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============= Enterprise Empty State =============

function EmptyPlaceholder({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border/50 bg-muted/10 p-4 text-center space-y-1.5">
      <div className="flex justify-center text-muted-foreground">{icon}</div>
      <p className="text-[11px] font-medium text-foreground">{title}</p>
      <p className="text-[10px] text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

// ============= Next Recommended Action Strip =============

function NextActionStrip({ readinessScore }: { readinessScore: number | null }) {
  if (readinessScore == null) return null;
  const advice = readinessScore < 50
    ? 'Engage missing executive sponsor before progressing proposal.'
    : 'Formalize scope and confirm commercial pathway.';
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/40">
      <Lightbulb className="w-3.5 h-3.5 text-primary flex-shrink-0" />
      <p className="text-[11px] text-muted-foreground">
        <span className="font-semibold text-foreground">Next action:</span> {advice}
      </p>
    </div>
  );
}

// ============= Main Component =============

export function DealPlanDriversView({ onGoToQuickBrief, onGoToAccountIntelligence }: DealPlanDriversViewProps) {
  // Shared context date (single source of truth)
  const WEEK_OF = getActiveContextDate();
  const [, forceUpdate] = useState(0);
  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);
  const strategicFramingRef = useRef<HTMLDivElement>(null);

  // Bootstrap Schindler defaults once per session
  useEffect(() => { ensureSchindlerDefaults(); }, []);

  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Quick Brief focus mode state
  const [focusSignal, setFocusSignal] = useState<{ id: string; title: string } | null>(null);

  // Authority Trend focus mode state
  const [focusTrend, setFocusTrend] = useState<{ id: string; title: string } | null>(null);

  // Evidence drawer auto-open intent from Account Intelligence
  const [initialOpenEvidence, setInitialOpenEvidence] = useState(false);

  // Consume deal-plan trigger on mount (signal-first or trend-first entry)
  useEffect(() => {
    const ctx = consumeDealPlanTrigger();
    if (!ctx) return;

    if (ctx.entry === 'add_account_intelligence' && ctx.focusId) {
      setSelectedAccount(ctx.focusId);
      setPlanGenerated(true);
      if (ctx.openEvidence) {
        setInitialOpenEvidence(true);
      }
    } else if (ctx.entry === 'quickbrief' && ctx.signalId && ctx.focusId) {
      setSelectedAccount(ctx.focusId);
      const pool = buildSignalPool(ctx.focusId, WEEK_OF);
      const found = pool.find((p) => p.id === ctx.signalId);
      if (found) {
        setActiveSignals(ctx.focusId, [ctx.signalId]);
        setFocusSignal({ id: ctx.signalId, title: ctx.signalTitle });
        setPlanGenerated(true);
      } else {
        toast.error('Signal not found in account pool — using default view.');
      }
    } else if (ctx.entry === 'ai_trend' && ctx.trendId && ctx.focusId) {
      setSelectedAccount(ctx.focusId);
      setFocusTrend({ id: ctx.trendId, title: ctx.trendTitle ?? ctx.signalTitle });
      setPlanGenerated(true);
    } else if (ctx.focusId) {
      setSelectedAccount(ctx.focusId);
    }
  }, []);

  const plan = useMemo(
    () => selectedAccount ? getDealPlan(selectedAccount, WEEK_OF) : undefined,
    [selectedAccount],
  );
  const drivers = plan?.promotedSignals ?? [];

  const [showPicker, setShowPicker] = useState(false);

  const [engagementType, setEngagementType] = useState<EngagementType | null>(null);
  const [motion, setMotion] = useState<Motion | null>(null);

  // Apply preselected type/motion when account changes
  useEffect(() => {
    if (!selectedAccount) return;
    const sel = getDealPlanningSelection(selectedAccount);
    if (sel) {
      setEngagementType(sel.type as EngagementType);
      setMotion(sel.motion as Motion);
    }
  }, [selectedAccount]);

  // Strategic Framing details
  const [showStrategicDetails, setShowStrategicDetails] = useState(false);
  const [whyNow, setWhyNow] = useState('Azure OpenAI available in Swiss North + EU Machinery Regulation deadline 2027 = dual urgency window.');
  const [wedge, setWedge] = useState('Data residency objection removed — first-mover advantage for AI predictive maintenance.');
  const [competitivePressure, setCompetitivePressure] = useState('Google Cloud and AWS lack Swiss-hosted AI services with equivalent compliance posture.');
  const [execFraming, setExecFraming] = useState('Position as compliance-driven digital transformation partner, not generic cloud reseller.');

  // Political Map
  // Political Map, Execution Motion, CRM — removed (persona tabs removed in MECE migration)

  const handleRemove = useCallback(
    (signalId: string) => {
      if (!selectedAccount) return;
      removePromotedSignal(selectedAccount, WEEK_OF, signalId);
      refresh();
      toast.success('Removed from Deal Planning');
    },
    [refresh, selectedAccount],
  );

  const avgConfidence = useMemo(() => {
    if (drivers.length === 0) return null;
    const avg = Math.round(drivers.reduce((a, d) => a + d.snapshot.confidence, 0) / drivers.length);
    return { score: avg, label: avg >= 60 ? 'High' : avg >= 40 ? 'Medium' : 'Low' };
  }, [drivers]);

  const confidenceColor = (score: number) =>
    score >= 60 ? 'text-green-600' : score >= 40 ? 'text-primary' : 'text-red-500';

  // aggregatedRisks removed — persona tabs removed in MECE migration


  const [planGenerated, setPlanGenerated] = useState(false);
  const [composerFallbackJson, setComposerFallbackJson] = useState<string | null>(null);
  const [businessVariant, setBusinessVariant] = useState<BusinessVariant>('executive');
  const canGenerate = selectedAccount !== null && engagementType !== null && motion !== null;

  const [inboxVersion, setInboxVersion] = useState(0);
  const inboxItems = useMemo(
    () => (selectedAccount ? listByFocusId(selectedAccount) : []),
    [selectedAccount, inboxVersion],
  );

  const handlePromoteInboxItem = useCallback((item: DealPlanningInboxItem) => {
    addTags(item.focusId, item.tags);
    removeInboxItem(item.focusId, item.id);
    setInboxVersion((v) => v + 1);
    refresh();
    toast.success('Promoted — tags applied to scoring');
  }, [refresh]);

  const handleDismissInboxItem = useCallback((item: DealPlanningInboxItem) => {
    removeInboxItem(item.focusId, item.id);
    setInboxVersion((v) => v + 1);
    toast('Dismissed from inbox');
  }, []);

  const recommendedPacks = useMemo<ScoredPack[]>(() => {
    if (!selectedAccount || !planGenerated) return [];
    return scoreServicePacks({
      mode: engagementType,
      trigger: motion,
      vendorPosture: partner_service_configuration.vendor_posture,
      partnerCapabilities: partner_service_configuration.partner_capabilities,
    });
  }, [selectedAccount, engagementType, motion, planGenerated, inboxVersion]);

  const topPlayPackName = useMemo(() => {
    if (drivers.length === 0) return null;
    const plays = scorePlayPacks(PLAY_SERVICE_PACKS, {
      promotedSignals: drivers,
      engagementType: engagementType as 'new_logo' | 'existing_customer' | null,
      motion,
    });
    return plays.length > 0 ? plays[0].packName : null;
  }, [drivers, engagementType, motion]);

  const handleAddSignals = useCallback((signals: Signal[]) => {
    if (!selectedAccount) return;
    promoteSignalsToDealPlan(selectedAccount, WEEK_OF, signals);
    refresh();
    toast.success(`Added ${signals.length} signal${signals.length > 1 ? 's' : ''} to Deal Plan`);
  }, [refresh, selectedAccount]);

  const handlePlaySelected = useCallback((play: { packId: string; packName: string; drivers: string[]; gaps: string[] }) => {
    if (!selectedAccount) return;
    const whatText = `Launch ${play.packName} to validate priority use cases and define a delivery scope.`;
    const howText = `Entry via ${play.packName} — phased engagement with clear pilot milestones.`;
    const whyDrivers = play.drivers.slice(0, 2).join('; ');
    const whyText = whyDrivers
      ? `${whyDrivers}. Act now to capture the engagement window.`
      : 'Strategic alignment with current account priorities creates a natural engagement window.';
    const activePlay = {
      playId: play.packId,
      playTitle: play.packName,
      framing: { what: whatText, how: howText, why: whyText },
    };
    setActivePlay(selectedAccount, activePlay);
    const hp = hydratePlan(
      selectedAccount,
      activePlay,
      engagementType as 'new_logo' | 'existing_customer' | null,
      motion,
      play.gaps,
    );
    // politicalMap hydration removed — persona tabs removed in MECE migration
    refresh();
    setTimeout(() => {
      strategicFramingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [selectedAccount, refresh, engagementType, motion]);

  const readinessData = useMemo(() => {
    if (!selectedAccount) return null;
    return getReadinessScore(selectedAccount, drivers.length > 0);
  }, [selectedAccount, drivers.length]);
  // techLandscape removed — single MECE flow

  const hydratedPlan = useMemo(() => {
    if (!selectedAccount) return null;
    return getHydratedPlan(selectedAccount) ?? null;
  }, [selectedAccount, planGenerated, drivers]);

  // ============= HEADER =============
  const header = (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">Deal Planning</h3>
        {avgConfidence && (
          <span className={cn('text-xs font-bold ml-1', confidenceColor(avgConfidence.score))}>
            {avgConfidence.score}% avg
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Account</span>
          <AccountSelector selectedId={selectedAccount} onSelect={setSelectedAccount} />
        </div>
        <DealPlanMetadata
          accountId={selectedAccount ?? ''}
          hasPromotedSignals={drivers.length > 0}
          engagementType={engagementType}
          onEngagementTypeChange={setEngagementType}
          motion={motion}
          onMotionChange={setMotion}
          showNextAdds={false}
        />
      </div>
    </div>
  );

  // ============= PLAN INBOX =============
  const planInbox = inboxItems.length > 0 ? (
    <div className="rounded-lg border border-border/50 bg-muted/10 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <InboxIcon className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-[11px] font-semibold text-foreground">Plan Inbox</p>
        <span className="px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground text-[10px] font-bold">
          {inboxItems.length}
        </span>
      </div>
      <div className="space-y-1.5">
        {inboxItems.map((item) => (
          <div key={item.id} className="flex items-start gap-2.5 p-2 rounded-md border border-border/40 bg-card">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-foreground leading-snug">{item.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{item.why_now}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted/40 text-muted-foreground border border-border/40">
                  {item.impact_area}
                </span>
                {item.tags.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-primary/5 text-primary border border-primary/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => handlePromoteInboxItem(item)}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Check className="w-3 h-3" />
                Promote
              </button>
              <button
                onClick={() => handleDismissInboxItem(item)}
                className="p-1 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  // ============= CONTEXT STRIP (compact Account Intelligence) =============
  const contextStrip = onGoToAccountIntelligence && drivers.length > 0 ? (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/20 border border-border/40">
      <Zap className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      <p className="text-[11px] text-muted-foreground flex-1">
        <span className="font-medium text-foreground">Context:</span> {drivers.length} signal{drivers.length !== 1 ? 's' : ''} impacting this account
      </p>
      <button
        onClick={onGoToAccountIntelligence}
        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
      >
        Open Account Intelligence <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  ) : null;

  // ============= RETURN =============
  return (
    <div className="space-y-4">
      {header}

      {!selectedAccount && (
        <p className="text-xs text-muted-foreground -mt-2">
          Select or create an account to ground this plan.
        </p>
      )}

      {/* Generate Plan CTA */}
      {!planGenerated && (
        <div className="flex flex-col items-center gap-3 py-4">
          <button
            onClick={() => setPlanGenerated(true)}
            disabled={!canGenerate}
            className={cn(
              'w-full max-w-md inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all',
              canGenerate
                ? 'bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 hover:shadow-card active:scale-[0.98]'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <Rocket className="w-4.5 h-4.5" />
            Generate Plan
          </button>
          {!canGenerate && (
            <p className="text-[11px] text-muted-foreground text-center">
              {!selectedAccount
                ? 'Select an account, then choose Engagement Type and Motion to generate the plan.'
                : 'Select Engagement Type and Motion to generate the plan.'}
            </p>
          )}
        </div>
      )}

      {/* Plan workspace */}
      {planGenerated && (<>
      <div className="space-y-4">
        <div className="flex-1 min-w-0 space-y-4">

          {/* ===== SHARED HERO: Recommended Plays ===== */}
          <RecommendedPlaysPanel
            accountId={selectedAccount}
            promotedSignals={drivers}
            engagementType={engagementType as 'new_logo' | 'existing_customer' | null}
            motion={motion}
            readinessScore={readinessData?.score}
            weekOf={WEEK_OF}
            onRefresh={refresh}
            onRemoveSignal={handleRemove}
            onOpenPicker={() => setShowPicker(true)}
            showPicker={showPicker}
            onPlaySelected={handlePlaySelected}
            onGoToAccountIntelligence={onGoToAccountIntelligence}
            focusSignal={focusSignal}
            onClearFocus={() => setFocusSignal(null)}
            focusTrend={focusTrend}
            onClearTrendFocus={() => setFocusTrend(null)}
            initialOpenEvidence={initialOpenEvidence}
            onEvidenceDrawerOpened={() => setInitialOpenEvidence(false)}
            pickerNode={
              showPicker ? (
                <SignalPickerPanel
                  accountId={selectedAccount}
                  weekOf={WEEK_OF}
                  onClose={() => setShowPicker(false)}
                  onChanged={refresh}
                />
              ) : null
            }
          />

          {/* ===== Context strip ===== */}
          {contextStrip}

          {/* ===== Plan workspace section boundary ===== */}
          <div className="border-t border-border/40 pt-4 mt-2 space-y-1">
            <p className="text-sm font-semibold text-foreground">Plan workspace</p>
            <p className="text-[11px] text-muted-foreground">Storyline narrative for the selected account.</p>
          </div>

          {/* ===== Plan Inbox ===== */}
          {planInbox}

          {/* ===== Copy Composer Input (in Storyline area) ===== */}
          {selectedAccount && (
            <div className="flex justify-end">
              <button
                onClick={async () => {
                  const activePlay = getActivePlay(selectedAccount);
                  const lookupParams = {
                    focusId: selectedAccount,
                    playId: activePlay?.playId ?? '',
                    type: engagementType ?? '',
                    motion: motion ?? '',
                  };
                  const variants = getAvailableVariants(lookupParams);
                  const effectiveVariant = variants.includes(businessVariant)
                    ? businessVariant
                    : variants[0] ?? null;
                  const pkg = effectiveVariant
                    ? getBusinessPlayPackage({ ...lookupParams, variant: effectiveVariant })
                    : null;

                  if (pkg) {
                    const output = {
                      focus_id: pkg.focus_id,
                      play_id: pkg.play_id,
                      variant: pkg.variant,
                      type: pkg.type,
                      motion: pkg.motion,
                      signal_citation_ids: pkg.signal_citation_ids,
                      mece: pkg.mece,
                    };
                    const json = JSON.stringify(output, null, 2);
                    try {
                      await navigator.clipboard.writeText(json);
                      toast.success('MECE output copied');
                    } catch {
                      setComposerFallbackJson(json);
                    }
                  } else {
                    const input = buildComposerInputBusiness({
                      focusId: selectedAccount,
                      playId: activePlay?.playId ?? '',
                      type: engagementType ?? '',
                      motion: motion ?? '',
                      activeSignalIds: getActiveSignalIds(selectedAccount),
                    });
                    const json = JSON.stringify(input, null, 2);
                    try {
                      await navigator.clipboard.writeText(json);
                      toast.success('Composer input copied');
                    } catch {
                      setComposerFallbackJson(json);
                    }
                  }
                }}
                className="h-8 px-3 rounded text-[11px] font-medium whitespace-nowrap transition-colors border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30 flex items-center gap-1.5"
              >
                <Copy className="w-3 h-3" />
                Copy Composer Input
              </button>
            </div>
          )}

          {/* ===== STORYLINE + MECE DETAIL (primary output) ===== */}
          {(() => {
            const activePlay = selectedAccount ? getActivePlay(selectedAccount) : null;
            const lookupParams = {
              focusId: selectedAccount ?? '',
              playId: activePlay?.playId ?? '',
              type: engagementType ?? '',
              motion: motion ?? '',
            };
            const variants = getAvailableVariants(lookupParams);
            const effectiveVariant = variants.includes(businessVariant)
              ? businessVariant
              : variants[0] ?? null;
            const pkg = effectiveVariant
              ? getBusinessPlayPackage({ ...lookupParams, variant: effectiveVariant })
              : null;

            if (pkg && effectiveVariant) {
              return (
                <BusinessPlayPackageView
                  pkg={pkg}
                  availableVariants={variants}
                  activeVariant={effectiveVariant}
                  onVariantChange={setBusinessVariant}
                />
              );
            }

            // Fallback: editable sections when no package is materialized
            return (
              <>
                {/* Deal Strategy */}
                <div ref={strategicFramingRef}>
                  <CollapsibleSection title="Deal Strategy" subtitle="Strategic framing and positioning" defaultOpen={true}>
                    <div className="space-y-3">
                      <StrategicFramingSection
                        promotedSignals={drivers}
                        topPackName={topPlayPackName}
                        activePlayFraming={selectedAccount ? getActivePlay(selectedAccount)?.framing ?? null : null}
                      />
                      <button
                        onClick={() => setShowStrategicDetails(!showStrategicDetails)}
                        className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showStrategicDetails ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        Details
                      </button>
                      {showStrategicDetails && (
                        <div className="space-y-3 pt-1 border-t border-border/30">
                          <EditableBlock label="Why Now" icon={<Clock className="w-3 h-3" />} value={whyNow} onChange={setWhyNow} placeholder="What creates urgency for this deal right now?" compact />
                          <EditableBlock label="Wedge" icon={<Target className="w-3 h-3" />} value={wedge} onChange={setWedge} placeholder="What's our differentiated entry point?" compact />
                          <EditableBlock label="Competitive Pressure" icon={<Swords className="w-3 h-3" />} value={competitivePressure} onChange={setCompetitivePressure} placeholder="Key competitive dynamics to navigate." compact />
                          <EditableBlock label="Executive Framing" icon={<Crown className="w-3 h-3" />} value={execFraming} onChange={setExecFraming} placeholder="How should we frame this to the C-suite?" compact />
                        </div>
                      )}
                    </div>
                  </CollapsibleSection>
                </div>

                {/* Deal Hypothesis */}
                <CollapsibleSection title="Deal Hypothesis" subtitle="Investment thesis and expected outcome" defaultOpen={true}>
                  {hydratedPlan ? (
                    <DealHypothesisBlock hypothesis={hydratedPlan.dealHypothesis} />
                  ) : (
                    <EmptyPlaceholder
                      icon={<Lightbulb className="w-5 h-5" />}
                      title="No hypothesis generated yet"
                      description="Add a play to your plan to generate the deal hypothesis and commercial framing."
                    />
                  )}
                </CollapsibleSection>

                {/* Commercial Path */}
                <CollapsibleSection title="Commercial Path" subtitle="Sizing, budget, and commercial pathway" defaultOpen={false}>
                  <div className="space-y-3">
                    <EmptyPlaceholder
                      icon={<DollarSign className="w-5 h-5" />}
                      title="Sizing and budget"
                      description="Deal sizing and budget framing will be generated based on play selection and account context."
                    />
                    {hydratedPlan && (
                      <div className="border-t border-border/30 pt-3">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Evidence Checklist</p>
                        <WhatWeNeedSection
                          items={hydratedPlan.checklist}
                          focusId={selectedAccount}
                          onRefresh={refresh}
                        />
                      </div>
                    )}
                  </div>
                </CollapsibleSection>

                {/* Commercial Assets */}
                {hydratedPlan && (
                  <CollapsibleSection title="Commercial Assets" subtitle="Execution materials and deliverables" defaultOpen={false}>
                    <ExecutionBundleSection assets={hydratedPlan.executionBundle} />
                  </CollapsibleSection>
                )}
              </>
            );
          })()}

          {/* Composer Fallback Modal */}
          {composerFallbackJson && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setComposerFallbackJson(null)}>
              <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">Composer Input</p>
                  <button onClick={() => setComposerFallbackJson(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <pre className="text-[10px] text-muted-foreground bg-muted/20 border border-border rounded-lg p-3 max-h-80 overflow-auto whitespace-pre-wrap break-words">
                  {composerFallbackJson}
                </pre>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(composerFallbackJson);
                      toast.success('Copied');
                      setComposerFallbackJson(null);
                    } catch { /* ignore */ }
                  }}
                  className="h-8 px-3 rounded text-[11px] font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30 flex items-center gap-1.5"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      </>)}
    </div>
  );
}
