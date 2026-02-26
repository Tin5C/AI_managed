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
import type { EngagementType, Motion } from './DealPlanMetadata';
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
// TechnicalRecommendationsSection removed — replaced by unified TechnicalPlayPackView canvas
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
import { TechnicalPlayPackView } from '@/partner/components/dealPlanning/TechnicalPlayPackView';
import { ensureSchindlerDefaults } from '@/data/partner/demo/schindlerDefaults';
import { getDealPlanningSelection, setDealPlanningSelection, getSelectionContext } from '@/data/partner/dealPlanningSelectionStore';
import { DEMO_FOCUS_ENTITIES } from '@/data/partner/demo/demoDataset';

const WEEK_OF = '2026-02-10';

/** Derive account options from the single source of truth (DEMO_FOCUS_ENTITIES) */
const ACCOUNTS = DEMO_FOCUS_ENTITIES.map((e) => ({
  id: e.id.replace(/^focus-/, ''),
  label: e.name,
}));

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
  const [renderTick, forceUpdate] = useState(0);
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

  // Apply preselected type/motion when account changes; ensure defaults exist
  useEffect(() => {
    if (!selectedAccount) return;
    const sel = getDealPlanningSelection(selectedAccount);
    const effectiveType = sel?.type || 'New Logo';
    const effectiveMotion = sel?.motion || 'Strategic Pursuit';
    // Persist defaults so package lookup keys always match seeded data
    if (!sel?.type || !sel?.motion) {
      setDealPlanningSelection(selectedAccount, { type: effectiveType, motion: effectiveMotion });
    }
    setEngagementType(effectiveType as EngagementType);
    setMotion(effectiveMotion as Motion);
  }, [selectedAccount]);

  // Auto-generate plan when account is selected
  useEffect(() => {
    if (selectedAccount) setPlanGenerated(true);
  }, [selectedAccount]);

  // Driver selection + specific context state
  const [contextBoosts, setContextBoosts] = useState<Record<string, number>>({});
  const [showContextInput, setShowContextInput] = useState(false);
  const [contextText, setContextText] = useState('');

  const driverOptions = useMemo(() => {
    if (!selectedAccount) return [];
    return buildSignalPool(selectedAccount, WEEK_OF).map(s => ({ id: s.id, title: s.title }));
  }, [selectedAccount]);

  const selectedDriverIds = useMemo(() => {
    if (!selectedAccount) return [] as string[];
    return getActiveSignalIds(selectedAccount);
  }, [selectedAccount, renderTick]);

  const [driversExpanded, setDriversExpanded] = useState(false);
  const [shakeDrivers, setShakeDrivers] = useState(false);
  const [customDrivers, setCustomDrivers] = useState<{ id: string; label: string }[]>([]);
  const INITIAL_DRIVER_COUNT = 4;

  const totalSelected = selectedDriverIds.length + customDrivers.length;

  const handleToggleDriver = useCallback((signalId: string) => {
    if (!selectedAccount) return;
    const current = getActiveSignalIds(selectedAccount);
    if (current.includes(signalId)) {
      setActiveSignals(selectedAccount, current.filter(id => id !== signalId));
    } else {
      if (current.length + customDrivers.length >= 3) {
        setShakeDrivers(true);
        setTimeout(() => setShakeDrivers(false), 500);
        return;
      }
      setActiveSignals(selectedAccount, [...current, signalId]);
    }
    refresh();
  }, [selectedAccount, refresh, customDrivers.length]);

  const KEYWORD_BOOST: Record<string, string[]> = {
    play_governance: ['policy', 'governance', 'approval', 'residency', 'compliance', 'regulation'],
    play_finops: ['cost', 'budget', 'variance', 'finops', 'telemetry', 'usage', 'spend'],
  };

  const handleSubmitContext = useCallback(() => {
    if (!selectedAccount || !contextText.trim()) return;
    if (totalSelected >= 3) {
      setShakeDrivers(true);
      setTimeout(() => setShakeDrivers(false), 500);
      return;
    }
    const words = contextText.toLowerCase();
    const boosts: Record<string, number> = {};
    for (const [playId, keywords] of Object.entries(KEYWORD_BOOST)) {
      if (keywords.some(kw => words.includes(kw))) {
        boosts[playId] = (boosts[playId] ?? 0) + 10;
      }
    }
    setContextBoosts(prev => {
      const merged = { ...prev };
      for (const [k, v] of Object.entries(boosts)) merged[k] = (merged[k] ?? 0) + v;
      return merged;
    });
    const id = `custom_${Date.now()}`;
    const label = contextText.trim().length > 40 ? contextText.trim().slice(0, 40) + '…' : contextText.trim();
    setCustomDrivers(prev => [...prev, { id, label }]);
    setContextText('');
    setShowContextInput(false);
    refresh();
  }, [selectedAccount, contextText, totalSelected, refresh]);

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
  const [technicalVariant, setTechnicalVariant] = useState<'executive' | 'grounded'>('executive');
  // canGenerate removed — plan auto-generates when account is selected

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
  }, [focusSignal, selectedAccount, renderTick]);

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
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Account</span>
        <AccountSelector selectedId={selectedAccount} onSelect={setSelectedAccount} />
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

      {/* Generate Plan removed — auto-generates when account is selected */}

      {/* Plan workspace */}
      {planGenerated && (<>
      <div className="space-y-4">
        {/* Main workspace (full-width — right rail removed) */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* ===== DRIVER SELECTION ===== */}
          <div className="rounded-xl border border-border/50 bg-muted/[0.03] p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">What matters most in this account?</p>
              <span className="text-[10px] tabular-nums text-muted-foreground">
                Selected: <span className={cn('font-semibold', totalSelected > 0 && 'text-primary')}>{totalSelected}</span> / 3
              </span>
            </div>
            <div className={cn('flex flex-wrap gap-x-2.5 gap-y-2', shakeDrivers && 'animate-[shake_0.4s_ease-in-out]')}>
              {(driversExpanded ? driverOptions : driverOptions.slice(0, INITIAL_DRIVER_COUNT)).map((d) => {
                const driverId = d.id;
                const isActive = selectedDriverIds.includes(driverId);
                return (
                  <button
                    key={driverId}
                    onClick={() => handleToggleDriver(driverId)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all duration-150',
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)] scale-[1.02]'
                        : 'bg-muted/30 text-muted-foreground border-border/60 hover:border-primary/30 hover:text-foreground',
                    )}
                  >
                    {isActive && <Check className="w-3 h-3" />}
                    {d.title}
                  </button>
                );
              })}
              {/* Custom one-off driver chips */}
              {customDrivers.map((cd) => (
                <span
                  key={cd.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-primary text-primary-foreground border border-primary shadow-[0_2px_8px_rgba(0,0,0,0.08)] scale-[1.02]"
                >
                  <Check className="w-3 h-3" />
                  {cd.label}
                  <span className="ml-0.5 px-1.5 py-0.5 rounded text-[9px] bg-primary-foreground/20 font-medium">Custom</span>
                  <button
                    onClick={() => setCustomDrivers(prev => prev.filter(c => c.id !== cd.id))}
                    className="ml-0.5 hover:opacity-70 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {driverOptions.length > INITIAL_DRIVER_COUNT && (
              <button
                onClick={() => setDriversExpanded(!driversExpanded)}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                {driversExpanded ? (
                  <><ChevronDown className="w-3 h-3" /> Show fewer</>
                ) : (
                  <><Plus className="w-3 h-3" /> Explore more drivers</>
                )}
              </button>
            )}
            {!showContextInput ? (
              <div className="space-y-0.5">
                <button
                  onClick={() => setShowContextInput(true)}
                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add one-off driver
                </button>
                <p className="text-[9px] text-muted-foreground/60 pl-[18px]">Applies to this plan only. Not saved to Account Intelligence.</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={contextText}
                  onChange={(e) => setContextText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitContext(); }}
                  placeholder="e.g., Procurement is blocking approval unless unit cost is capped…"
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-border/60 bg-muted/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 outline-none transition-colors"
                  autoFocus
                />
                <button
                  onClick={handleSubmitContext}
                  disabled={!contextText.trim()}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all',
                    contextText.trim()
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed',
                  )}
                >
                  Add
                </button>
                <button
                  onClick={() => { setShowContextInput(false); setContextText(''); }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

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
              refresh();
            }}
            focusTrend={focusTrend}
            onClearTrendFocus={() => setFocusTrend(null)}
            initialOpenEvidence={initialOpenEvidence}
            onEvidenceDrawerOpened={() => setInitialOpenEvidence(false)}
            scoreBoosts={contextBoosts}
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
              {/* Play-aware Technical Pack */}
              {(() => {
                const activePlay = selectedAccount ? getActivePlay(selectedAccount) : null;
                const playId = activePlay?.playId ?? '';
                if (playId && selectedAccount) {
                  return (
                    <TechnicalPlayPackView
                      playId={playId}
                      accountId={selectedAccount}
                      variant={technicalVariant}
                      onVariantChange={setTechnicalVariant}
                    />
                  );
                }
                return null;
              })()}

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
