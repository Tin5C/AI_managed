// Deal Plan Drivers View — Sales / Business / Technical tabs with shared Recommended Plays header
// Sales: operational deal execution (stakeholders, execution motion, CRM, inbox, risks)
// Business: investment justification (strategy, hypothesis, commercial path, evidence, positioning)
// Technical: feasibility & delivery (requirements, architecture, delivery, technical risks)

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Brain,
  Zap,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Link2,
  Trash2,
  Copy,
  Users,
  Briefcase,
  Wrench,
  Target,
  MessageSquare,
  Shield,
  Clock,
  Pencil,
  Check,
  Crosshair,
  Crown,
  UserCheck,
  UserX,
  ShoppingCart,
  Rocket,
  BarChart3,
  CalendarDays,
  Activity,
  Building2,
  Package,
  FileCheck,
  Scale,
  Swords,
  TrendingUp,
  ExternalLink,
  Plus,
  Search,
  FolderOpen,
  Inbox as InboxIcon,
  X,
  ClipboardCheck,
  Cpu,
  FileText,
  Layers,
  Server,
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
import { listSignals, type Signal } from '@/data/partner/signalStore';
import { AccountInbox } from './AccountInbox';
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
import { TechnicalRecommendationsSection } from '@/partner/components/dealPlanning/TechnicalRecommendationsSection';
import { PLAY_SERVICE_PACKS } from '@/partner/data/dealPlanning/servicePacks';
import { scorePlayPacks } from '@/partner/lib/dealPlanning/propensity';
import { setActivePlay, getActivePlay } from '@/partner/data/dealPlanning/selectedPackStore';
import { hydratePlan, getHydratedPlan } from '@/partner/data/dealPlanning/planHydrationStore';
import { WhatWeNeedSection } from '@/partner/components/dealPlanning/WhatWeNeedSection';
import { ExecutionBundleSection } from '@/partner/components/dealPlanning/ExecutionBundleSection';
import { DealHypothesisBlock } from '@/partner/components/dealPlanning/DealHypothesisBlock';
import { RisksBlockersSection } from '@/partner/components/dealPlanning/RisksBlockersSection';
import { getReadinessScore } from '@/data/partner/accountMemoryStore';
import { buildComposerInputBusiness } from '@/services/partner/dealPlanning/buildComposerInputBusiness';
import { getActiveSignalIds, setActiveSignals, addActiveSignal } from '@/partner/data/dealPlanning/activeSignalsStore';
import { consumeDealPlanTrigger } from '@/data/partner/dealPlanTrigger';
import { buildSignalPool } from '@/partner/data/dealPlanning/signalPool';
import { getByFocusId as getTechLandscape } from '@/data/partner/technicalLandscapeStore';
import { CollapsibleSection } from '@/components/shared/CollapsibleSection';
import { getBusinessPlayPackage, getAvailableVariants, type BusinessVariant } from '@/data/partner/businessPlayPackageStore';
import '@/data/partner/demo/businessPlayPackagesSeed';
import { BusinessPlayPackageView } from '@/partner/components/dealPlanning/BusinessPlayPackageView';
import { ensureSchindlerDefaults } from '@/data/partner/demo/schindlerDefaults';
import { getDealPlanningSelection, getEntryMode, setEntryMode, getCustomerProblem, setCustomerProblem, getSelectionContext, type EntryMode } from '@/data/partner/dealPlanningSelectionStore';

const WEEK_OF = '2026-02-10';

const ACCOUNTS = [
  { id: 'schindler', label: 'Schindler' },
  { id: 'sulzer', label: 'Sulzer' },
  { id: 'ubs', label: 'UBS' },
];

type ViewTab = 'business' | 'technical';

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

function StakeholderRow({ role, icon, name, notes, onChange }: {
  role: string;
  icon: React.ReactNode;
  name: string;
  notes: string;
  onChange: (name: string, notes: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftNotes, setDraftNotes] = useState(notes);

  return (
    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/20 border border-border/40">
      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{role}</p>
        {editing ? (
          <div className="space-y-1">
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Name / title"
              className="w-full text-xs px-2 py-1 rounded border border-border bg-background"
            />
            <input
              value={draftNotes}
              onChange={(e) => setDraftNotes(e.target.value)}
              placeholder="Approach notes"
              className="w-full text-xs px-2 py-1 rounded border border-border bg-background"
            />
            <button
              onClick={() => { onChange(draftName, draftNotes); setEditing(false); }}
              className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-0.5"
            >
              <Check className="w-2.5 h-2.5" /> Save
            </button>
          </div>
        ) : (
          <div className="cursor-pointer" onClick={() => setEditing(true)}>
            <p className="text-xs text-foreground">{name || <span className="italic text-muted-foreground/60">Click to add</span>}</p>
            {notes && <p className="text-[11px] text-muted-foreground mt-0.5">{notes}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [viewTab, setViewTab] = useState<ViewTab>('business');

  const [engagementType, setEngagementType] = useState<EngagementType | null>(null);
  const [motion, setMotion] = useState<Motion | null>(null);

  // Entry mode state (guided vs problem-first)
  const [entryMode, setEntryModeLocal] = useState<EntryMode>('guided');
  const [customerProblem, setCustomerProblemLocal] = useState('');

  const handleEntryModeChange = useCallback((mode: EntryMode) => {
    setEntryModeLocal(mode);
    if (selectedAccount) setEntryMode(selectedAccount, mode);
  }, [selectedAccount]);

  const handleCustomerProblemChange = useCallback((text: string) => {
    setCustomerProblemLocal(text);
    if (selectedAccount) setCustomerProblem(selectedAccount, text);
  }, [selectedAccount]);

  // Apply preselected type/motion when account changes
  useEffect(() => {
    if (!selectedAccount) return;
    const sel = getDealPlanningSelection(selectedAccount);
    if (sel) {
      setEngagementType(sel.type as EngagementType);
      setMotion(sel.motion as Motion);
      setEntryModeLocal(sel.entryMode ?? 'guided');
      setCustomerProblemLocal(sel.customerProblem ?? '');
    }
  }, [selectedAccount]);

  // Strategic Framing details
  const [showStrategicDetails, setShowStrategicDetails] = useState(false);
  const [whyNow, setWhyNow] = useState('Azure OpenAI available in Swiss North + EU Machinery Regulation deadline 2027 = dual urgency window.');
  const [wedge, setWedge] = useState('Data residency objection removed — first-mover advantage for AI predictive maintenance.');
  const [competitivePressure, setCompetitivePressure] = useState('Google Cloud and AWS lack Swiss-hosted AI services with equivalent compliance posture.');
  const [execFraming, setExecFraming] = useState('Position as compliance-driven digital transformation partner, not generic cloud reseller.');

  // Political Map
  const [sponsor, setSponsor] = useState({ name: 'VP Engineering', notes: 'Champion of digital twin initiative' });
  const [champion, setChampion] = useState({ name: 'Head of Digital Transformation', notes: 'Pushing Copilot pilot internally' });
  const [blocker, setBlocker] = useState({ name: 'CISO', notes: 'Gates all AI via RACI — align proposals to governance framework' });
  const [procurement, setProcurement] = useState({ name: 'Head of Procurement', notes: 'Requires FinOps review for AI spend > CHF 50K' });

  // Execution Motion
  const [entryPack, setEntryPack] = useState('AI Readiness Assessment + Azure Swiss Architecture Workshop');
  const [pilotScope, setPilotScope] = useState('50-technician Copilot for Field Service pilot — work-order triage + parts prediction');
  const [timeline, setTimeline] = useState('Week 1-2: Architecture workshop\nWeek 3-4: Pilot design\nWeek 5-8: 50-user pilot\nWeek 9-10: ROI review + expansion proposal');

  // CRM Signals
  const [lastMeeting] = useState('2026-01-28 — Discovery call with VP Engineering (data residency concerns discussed)');
  const [engagementScore] = useState('72 / 100 — Active engagement, multiple stakeholders involved');
  const [vendorInvolvement] = useState('Microsoft CSA assigned. Azure Swiss North GA confirmed. Copilot preview access pending.');

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

  const aggregatedRisks = useMemo(() => {
    const items = new Set<string>();
    drivers.forEach((d) => d.snapshot.whatsMissing.forEach((m) => items.add(m)));
    drivers.forEach((d) => d.snapshot.proofToRequest.forEach((p) => items.add(`Proof needed: ${p}`)));
    return Array.from(items);
  }, [drivers]);

  const [planGenerated, setPlanGenerated] = useState(false);
  const [composerFallbackJson, setComposerFallbackJson] = useState<string | null>(null);
  const [businessVariant, setBusinessVariant] = useState<BusinessVariant>('executive');
  const canGenerate = selectedAccount !== null && (entryMode === 'problem' ? customerProblem.trim().length > 0 : (engagementType !== null && motion !== null));

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

  // Effective drivers: strict single-signal override when Quick Brief focus is active
  const effectiveDrivers = useMemo(() => {
    if (!focusSignal) return drivers;
    const filtered = drivers.filter((d) => d.signalId === focusSignal.id);
    return filtered.length > 0 ? filtered : drivers; // fallback avoids empty input
  }, [focusSignal, drivers]);

  const effectiveSignalIds = useMemo(() => {
    if (focusSignal) return [focusSignal.id];
    return selectedAccount ? getActiveSignalIds(selectedAccount) : [];
  }, [focusSignal, selectedAccount, drivers, showPicker]);

  const topPlayPackName = useMemo(() => {
    if (effectiveDrivers.length === 0) return null;
    const plays = scorePlayPacks(PLAY_SERVICE_PACKS, {
      promotedSignals: effectiveDrivers,
      engagementType: engagementType as 'new_logo' | 'existing_customer' | null,
      motion,
    });
    return plays.length > 0 ? plays[0].packName : null;
  }, [effectiveDrivers, engagementType, motion]);

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
    if (hp.politicalMap.length === 4) {
      setSponsor({ name: hp.politicalMap[0].title, notes: hp.politicalMap[0].notes });
      setChampion({ name: hp.politicalMap[1].title, notes: hp.politicalMap[1].notes });
      setBlocker({ name: hp.politicalMap[2].title, notes: hp.politicalMap[2].notes });
      setProcurement({ name: hp.politicalMap[3].title, notes: hp.politicalMap[3].notes });
    }
    refresh();
    setTimeout(() => {
      strategicFramingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [selectedAccount, refresh, engagementType, motion]);

  const readinessData = useMemo(() => {
    if (!selectedAccount) return null;
    return getReadinessScore(selectedAccount, drivers.length > 0);
  }, [selectedAccount, drivers.length]);

  const techLandscape = useMemo(() => {
    if (!selectedAccount) return null;
    return getTechLandscape(selectedAccount);
  }, [selectedAccount]);

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

        {/* Entry mode toggle */}
        <div className="inline-flex rounded-md bg-muted/50 p-0.5 border border-border/60">
          {(['guided', 'problem'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => handleEntryModeChange(mode)}
              className={cn(
                'px-2.5 py-1 rounded text-[10px] font-medium transition-all capitalize',
                entryMode === mode
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {mode === 'guided' ? 'Guided' : 'Problem-first'}
            </button>
          ))}
        </div>

        {/* Guided: Type + Motion dropdowns */}
        {entryMode === 'guided' && (
          <DealPlanMetadata
            accountId={selectedAccount ?? ''}
            hasPromotedSignals={drivers.length > 0}
            engagementType={engagementType}
            onEngagementTypeChange={setEngagementType}
            motion={motion}
            onMotionChange={setMotion}
            showNextAdds={false}
          />
        )}
      </div>

      {/* Problem-first: text input */}
      {entryMode === 'problem' && (
        <div className="space-y-1 max-w-lg">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Customer problem
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customerProblem}
              onChange={(e) => handleCustomerProblemChange(e.target.value)}
              placeholder="e.g. Legacy on-prem systems can't scale for AI workloads..."
              className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-border bg-background focus:border-primary/40 focus:ring-1 focus:ring-primary/20 outline-none transition-colors"
            />
            {customerProblem.trim().length > 0 && (
              <button
                type="button"
                onClick={() => handleCustomerProblemChange('')}
                className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground/70 italic">
            Frames recommendations; does not change scoring.
          </p>
        </div>
      )}
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

  // ============= TAB DEFINITIONS =============
  // Sales tab removed — UI simplification v2
  const TABS: { key: ViewTab; label: string; icon: React.ReactNode }[] = [
    { key: 'business', label: 'Business', icon: <Briefcase className="w-3 h-3" /> },
    { key: 'technical', label: 'Technical', icon: <Wrench className="w-3 h-3" /> },
  ];

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
                ? 'Select an account to generate the plan.'
                : entryMode === 'problem'
                  ? 'Describe a customer problem to generate the plan.'
                  : 'Select Engagement Type and Motion to generate the plan.'}
            </p>
          )}
        </div>
      )}

      {/* Plan workspace */}
      {planGenerated && (<>
      <div className="space-y-4">
        {/* Main workspace (full-width — right rail removed) */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* ===== Problem-first focus pill ===== */}
          {entryMode === 'problem' && customerProblem.trim().length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/[0.06] border border-primary/20">
              <Crosshair className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <p className="text-[11px] text-foreground flex-1">
                <span className="font-medium text-primary">Focused from problem:</span>{' '}
                <span className="text-muted-foreground">{customerProblem}</span>
              </p>
              <button
                type="button"
                onClick={() => handleCustomerProblemChange('')}
                className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors flex-shrink-0"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            </div>
          )}

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
            onClearFocus={() => {
              setFocusSignal(null);
              // Restore default active signals after clearing focus
              if (selectedAccount) {
                const currentIds = getActiveSignalIds(selectedAccount);
                if (currentIds.length <= 1) {
                  addActiveSignal(selectedAccount, 'sig-sch-finops-ai');
                  addActiveSignal(selectedAccount, 'sig-sch-ai-governance');
                }
              }
              refresh();
            }}
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

          {/* ===== Context strip (compact Account Intelligence) ===== */}
          {contextStrip}

          {/* ===== Plan workspace section boundary ===== */}
          <div className="border-t border-border/40 pt-4 mt-2 space-y-1">
            <p className="text-sm font-semibold text-foreground">Plan workspace</p>
            <p className="text-[11px] text-muted-foreground">Operational planning for the selected account.</p>
          </div>

          {/* ===== Tab toggle ===== */}
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-lg bg-muted/50 p-0.5 border border-border/60">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setViewTab(tab.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                    viewTab === tab.key
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ===== BUSINESS TAB ===== */}
          {viewTab === 'business' && (
            <div className="space-y-3">
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
                      selectionContext={selectedAccount ? getSelectionContext(selectedAccount) : undefined}
                      focusId={selectedAccount ?? undefined}
                    />
                  );
                }

                // Fallback: existing editable sections when no package is materialized
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

                    {/* Positioning */}
                    <CollapsibleSection title="Positioning" subtitle="Executive POV and talk tracks" defaultOpen={false}>
                      <EmptyPlaceholder
                        icon={<MessageSquare className="w-5 h-5" />}
                        title="Positioning framework"
                        description="Executive point-of-view outline and stakeholder talk tracks will be generated from deal strategy and play selection."
                      />
                    </CollapsibleSection>
                  </>
                );
              })()}

              {/* Copy Composer Input */}
              {selectedAccount && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={async () => {
                      const activePlay = getActivePlay(selectedAccount);
                      const input = buildComposerInputBusiness({
                        focusId: selectedAccount,
                        playId: activePlay?.playId ?? '',
                        type: engagementType ?? '',
                        motion: motion ?? '',
                        activeSignalIds: effectiveSignalIds,
                      });
                      const json = JSON.stringify(input, null, 2);
                      try {
                        await navigator.clipboard.writeText(json);
                        toast.success('Composer input copied');
                      } catch {
                        setComposerFallbackJson(json);
                      }
                    }}
                    className="h-8 px-3 rounded text-[11px] font-medium whitespace-nowrap transition-colors border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30 flex items-center gap-1.5"
                  >
                    <Copy className="w-3 h-3" />
                    Copy Composer Input
                  </button>
                </div>
              )}

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

              {/* Cross-reference to Technical tab */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/10 border border-border/30">
                <AlertTriangle className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <p className="text-[10px] text-muted-foreground">
                  Technical risks and delivery feasibility are tracked in the{' '}
                  <button onClick={() => setViewTab('technical')} className="text-foreground underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors">
                    Technical
                  </button> tab.
                </p>
              </div>
            </div>
          )}

          {/* ===== TECHNICAL TAB ===== */}
          {viewTab === 'technical' && (
            <div className="space-y-3">
              {/* 1) HERO: Technical Recommendations */}
              <TechnicalRecommendationsSection
                promotedSignals={drivers}
                engagementType={engagementType as 'new_logo' | 'existing_customer' | null}
                motion={motion}
                readinessScore={readinessData?.score}
              />

              {/* 2) Requirements & Constraints */}
              <CollapsibleSection title="Requirements & Constraints" subtitle="Customer requirements and technical constraints" defaultOpen={true}>
                <EmptyPlaceholder
                  icon={<FileText className="w-5 h-5" />}
                  title="No requirements captured yet"
                  description="Add customer evidence to extract constraints. Upload RFPs, architecture documents, or meeting notes in Customer Evidence to surface requirements."
                />
              </CollapsibleSection>

              {/* 3) Architecture & Landscape */}
              <CollapsibleSection title="Architecture & Landscape" subtitle="Known vendor stack and architecture patterns" defaultOpen={true}>
                {techLandscape ? (
                  <div className="space-y-3">
                    {techLandscape.cloud_strategy && (
                      <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Cloud Strategy</p>
                        <p className="text-xs text-foreground">{techLandscape.cloud_strategy}</p>
                      </div>
                    )}
                    {techLandscape.known_vendors && techLandscape.known_vendors.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Known Vendors</p>
                        <div className="flex flex-wrap gap-1.5">
                          {techLandscape.known_vendors.map((v, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted/40 text-foreground border border-border/30">{v}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {techLandscape.known_applications && techLandscape.known_applications.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Applications</p>
                        <div className="space-y-0.5">
                          {techLandscape.known_applications.map((a, i) => (
                            <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                              <span className="text-primary/40 mt-0.5">-</span> {a}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {techLandscape.architecture_patterns && techLandscape.architecture_patterns.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Architecture Patterns</p>
                        <div className="space-y-0.5">
                          {techLandscape.architecture_patterns.map((p, i) => (
                            <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                              <span className="text-primary/40 mt-0.5">-</span> {p}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <EmptyPlaceholder
                    icon={<Server className="w-5 h-5" />}
                    title="No landscape data available"
                    description="Technical landscape information will appear once account intelligence is populated."
                  />
                )}
              </CollapsibleSection>

              {/* 4) Delivery Feasibility */}
              <CollapsibleSection title="Delivery Feasibility" subtitle="Readiness assessment for delivery" defaultOpen={false}>
                {readinessData ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/40">
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Evidence Readiness</p>
                        <p className="text-xs font-medium text-foreground mt-0.5">{readinessData.score}%</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {Object.entries(readinessData.pillars).map(([pillar, covered]) => (
                          <span
                            key={pillar}
                            className={cn(
                              'px-1.5 py-0.5 rounded text-[9px] font-medium border',
                              covered
                                ? 'bg-muted/40 text-foreground border-border/30'
                                : 'bg-muted/20 text-muted-foreground/60 border-border/20'
                            )}
                          >
                            {pillar}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Delivery feasibility is derived from evidence coverage across five pillars. Add customer evidence to improve coverage and unlock detailed feasibility assessment.
                    </p>
                  </div>
                ) : (
                  <EmptyPlaceholder
                    icon={<Layers className="w-5 h-5" />}
                    title="No readiness data"
                    description="Select an account and add customer evidence to generate delivery feasibility insights."
                  />
                )}
              </CollapsibleSection>

              {/* 5) Technical Risks & Blockers */}
              <CollapsibleSection title="Technical Risks & Blockers" subtitle="Technical risks and delivery blockers" defaultOpen={false}>
                {hydratedPlan ? (
                  <RisksBlockersSection
                    risks={hydratedPlan.risks}
                    focusId={selectedAccount}
                    onRefresh={refresh}
                  />
                ) : (
                  <EmptyPlaceholder
                    icon={<AlertTriangle className="w-5 h-5" />}
                    title="No technical risks identified"
                    description="Technical risks will surface once a plan is generated and delivery context is added."
                  />
                )}
              </CollapsibleSection>

              {/* Cross-reference */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/10 border border-border/30">
                <Briefcase className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <p className="text-[10px] text-muted-foreground">
                  Commercial sizing and ROI are tracked in the{' '}
                  <button onClick={() => setViewTab('business')} className="text-foreground underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors">
                    Business
                  </button> tab.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
      </>)}
    </div>
  );
}
