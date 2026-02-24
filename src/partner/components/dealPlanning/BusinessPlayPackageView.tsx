// BusinessPlayPackageView — Storyline Canvas layout + Customer engagement
// Partner-only. Read-only display. No mutations.
// Main canvas: 4 cards (Objective, POV, Plan, Proof). Customer engagement below. Detail in Support drawer.

import { useState } from 'react';
import type { BusinessPlayPackage, BusinessVariant } from '@/data/partner/businessPlayPackageStore';
import { listObjections, type Objection } from '@/data/partner/objectionStore';
import { CollapsibleSection } from '@/components/shared/CollapsibleSection';
import {
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
  Layers,
  Users,
  Shield,
  BarChart3,
  Package,
  Ear,
  Heart,
  Search,
  MessageSquare,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  pkg: BusinessPlayPackage;
  availableVariants: BusinessVariant[];
  activeVariant: BusinessVariant;
  onVariantChange: (v: BusinessVariant) => void;
}

/* ── Shared micro-components (local to this file) ── */

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-3 rounded-lg bg-muted/20 border border-border/40 space-y-2', className)}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{children}</p>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>;
}

/** Truncate text to ~charLimit and add ellipsis */
function truncate(text: string, charLimit = 120): string {
  if (text.length <= charLimit) return text;
  return text.slice(0, charLimit).trimEnd() + '…';
}

/** Show more / Show less toggle for long content blocks */
function ExpandableBody({ text, charLimit = 140 }: { text: string; charLimit?: number }) {
  const [showAll, setShowAll] = useState(false);
  const needsTruncation = text.length > charLimit;

  return (
    <div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {showAll || !needsTruncation ? text : truncate(text, charLimit)}
      </p>
      {needsTruncation && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-1 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-0.5"
        >
          {showAll ? (
            <>Show less <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>Show more <ChevronDown className="w-3 h-3" /></>
          )}
        </button>
      )}
    </div>
  );
}

/** Preview snippet shown beneath collapsed section headers */
function SectionPreview({ text }: { text: string }) {
  return (
    <p className="text-[11px] text-muted-foreground/70 leading-snug mt-1 line-clamp-2 italic">
      {truncate(text, 160)}
    </p>
  );
}

/** Sources modal overlay — compact citation list */
function SourcesModal({ ids, onClose }: { ids: string[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-background border border-border rounded-xl shadow-lg w-full max-w-sm mx-4 p-4 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Signal Sources</h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <ul className="space-y-1.5 max-h-48 overflow-y-auto">
          {ids.map((id) => (
            <li
              key={id}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-muted/30 border border-border/40"
            >
              <FileText className="w-3 h-3 text-primary/50 flex-shrink-0" />
              <span className="text-[11px] font-mono text-muted-foreground">{id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Sentence splitter — deterministic, no generation ── */
// Splits text on sentence-ending punctuation; returns first `max` sentences.
function splitSentences(text: string, max: number): string[] {
  const matches = text.match(/[^.!?]+[.!?]+/g);
  if (!matches) return text.trim() ? [text.trim()] : [];
  return matches.slice(0, max).map((s) => s.trim());
}

const PLACEHOLDER = 'Add sources to populate this section.';

/* ── Persona chip labels for Stakeholders & messaging ── */
const PERSONA_MAP: Record<string, string> = {
  cio: 'CIO / VP Engineering',
  cfo: 'CFO / Finance',
  ciso: 'CISO',
  procurement: 'Procurement',
};

function classifyPersona(persona: string): string {
  const p = persona.toLowerCase();
  if (p.includes('cio') || p.includes('vp') || p.includes('engineering') || p.includes('cto') || p.includes('head of tech')) return 'cio';
  if (p.includes('cfo') || p.includes('finance') || p.includes('controller')) return 'cfo';
  if (p.includes('ciso') || p.includes('security') || p.includes('risk') || p.includes('compliance')) return 'ciso';
  return 'procurement';
}

interface TalkTrackItem { persona: string; message: string; }
interface DiscoveryItem { theme: string; question: string; }

function StakeholdersTabs({ talkTracks, discoveryAgenda }: { talkTracks: TalkTrackItem[]; discoveryAgenda: DiscoveryItem[] }) {
  // Group talk tracks by classified persona
  const grouped = talkTracks.reduce<Record<string, TalkTrackItem[]>>((acc, tt) => {
    const key = classifyPersona(tt.persona);
    (acc[key] ??= []).push(tt);
    return acc;
  }, {});

  const personaKeys = Object.keys(PERSONA_MAP).filter((k) => grouped[k]?.length);
  const [activePersona, setActivePersona] = useState(personaKeys[0] ?? '');
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [showChallenger, setShowChallenger] = useState(false);

  if (personaKeys.length === 0) {
    return (
      <CollapsibleSection title="Stakeholders & messaging" subtitle="Talk tracks by persona" defaultOpen>
        <p className="text-[11px] text-muted-foreground/60 italic">Not available yet.</p>
      </CollapsibleSection>
    );
  }

  const tracks = grouped[activePersona] ?? [];
  // Use first matching discovery question as challenger question (deterministic)
  const challengerQ = discoveryAgenda.length > 0 ? discoveryAgenda[0].question : null;

  return (
    <CollapsibleSection title="Stakeholders & messaging" subtitle="Talk tracks by persona" defaultOpen>
      <div className="space-y-2">
        {/* Persona chips */}
        <div className="flex flex-wrap gap-1.5">
          {personaKeys.map((key) => (
            <button
              key={key}
              onClick={() => { setActivePersona(key); setShowDiscovery(false); setShowChallenger(false); }}
              className={cn(
                'px-2.5 py-1 rounded-md text-[10px] font-medium transition-all border',
                activePersona === key
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/50',
              )}
            >
              {PERSONA_MAP[key]}
            </button>
          ))}
        </div>

        {/* Active persona card */}
        <SectionCard className="p-2.5">
          <p className="text-[10px] font-semibold text-foreground flex items-center gap-1.5 pb-1.5 border-b border-border/30 mb-1.5">
            <Users className="w-3 h-3 text-primary/50" />
            {PERSONA_MAP[activePersona]}
          </p>
          {/* Value prop — concise */}
          {tracks.map((tt, i) => (
            <p key={i} className="text-[11px] text-muted-foreground leading-relaxed">{truncate(tt.message, 180)}</p>
          ))}

          {/* Toggle buttons */}
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowDiscovery((v) => !v)}
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border transition-colors',
                showDiscovery
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50',
              )}
            >
              <ChevronDown className={cn('w-3 h-3 transition-transform', showDiscovery && 'rotate-180')} />
              Discovery questions
            </button>
            {challengerQ && (
              <button
                type="button"
                onClick={() => setShowChallenger((v) => !v)}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border transition-colors',
                  showChallenger
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50',
                )}
              >
                <ChevronDown className={cn('w-3 h-3 transition-transform', showChallenger && 'rotate-180')} />
                Challenger question
              </button>
            )}
          </div>

          {/* Expanded: discovery */}
          {showDiscovery && discoveryAgenda.length > 0 && (
            <div className="mt-2 space-y-1 border-t border-border/20 pt-2">
              {discoveryAgenda.slice(0, 4).map((d, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                  <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
                  <span><span className="font-medium text-foreground">{d.theme}:</span> {d.question}</span>
                </div>
              ))}
            </div>
          )}

          {/* Expanded: challenger */}
          {showChallenger && challengerQ && (
            <div className="mt-2 border-t border-border/20 pt-2">
              <p className="text-[11px] text-muted-foreground italic">{challengerQ}</p>
            </div>
          )}
        </SectionCard>
      </div>
    </CollapsibleSection>
  );
}

/* ── Objection LAER Accordion ── */



function ObjectionLAERAccordion({ objections }: { objections: Objection[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function mapToLAER(obj: Objection) {
    const listen = obj.root_cause;
    const acknowledge = `We understand this is a critical concern for your organization.`;
    const respond = obj.what_they_need_to_see.slice(0, 3);
    const proofAnchors = obj.what_they_need_to_see.slice(0, 3);
    return { listen, acknowledge, respond, proofAnchors };
  }

  function handleCopy(respondItems: string[], objId: string) {
    const text = respondItems.join('\n• ');
    navigator.clipboard.writeText('• ' + text).then(() => {
      setCopiedId(objId);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }

  return (
    <div className="space-y-1">
      {objections.map((obj) => {
        const expanded = openId === obj.id;
        const laer = mapToLAER(obj);
        const preview = obj.root_cause.length > 90 ? obj.root_cause.slice(0, 87) + '…' : obj.root_cause;

        return (
          <div key={obj.id} className="rounded-lg border border-border/40 bg-muted/10 overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => setOpenId(expanded ? null : obj.id)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left hover:bg-muted/20 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-primary/50 flex-shrink-0" />
                  {obj.theme}
                </p>
                {!expanded && (
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5 pl-[18px]">{preview}</p>
                )}
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground flex-shrink-0 transition-transform duration-200', expanded && 'rotate-180')} />
            </button>

            {expanded && (
              <div className="px-3 pb-2.5 space-y-2 border-t border-border/30 pt-2">
                {/* LISTEN */}
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-primary/60 flex items-center gap-1">
                    <Ear className="w-3 h-3" /> Listen
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{laer.listen}</p>
                </div>

                <div className="border-t border-border/20" />

                {/* ACKNOWLEDGE */}
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-primary/60 flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Acknowledge
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{laer.acknowledge}</p>
                </div>

                <div className="border-t border-border/20" />

                {/* EXPLORE */}
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-primary/60 flex items-center gap-1">
                    <Search className="w-3 h-3" /> Explore
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 italic">Discovery questions not captured yet.</p>
                </div>

                <div className="border-t border-border/20" />

                {/* RESPOND */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-primary/60 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Respond
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(laer.respond, obj.id)}
                      className="text-[9px] text-muted-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      {copiedId === obj.id ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                      {copiedId === obj.id ? 'Copied' : 'Copy response'}
                    </button>
                  </div>
                  {laer.respond.length > 0 ? (
                    <ul className="space-y-0.5">
                      {laer.respond.map((item, i) => (
                        <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                          <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[10px] text-muted-foreground/60 italic">Not available yet.</p>
                  )}

                  {/* Proof anchors */}
                  {laer.proofAnchors.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {laer.proofAnchors.map((anchor, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/[0.08] text-primary/70 border border-primary/15">
                          {anchor}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Delivery Assets Accordion ── */

function DeliveryAssetsAccordion({ deliveryAssets }: {
  deliveryAssets: {
    discovery_agenda: DiscoveryItem[];
    workshop_plan: { step: string; description: string }[];
    pilot_scope: { in_scope: string[]; out_of_scope: string[]; deliverables: string[]; stakeholders: string[] };
  };
}) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openPilotSub, setOpenPilotSub] = useState<string | null>(null);

  const toggle = (key: string) => setOpenSection((v) => (v === key ? null : key));
  const togglePilot = (key: string) => setOpenPilotSub((v) => (v === key ? null : key));

  const hasPilot =
    deliveryAssets.pilot_scope.in_scope.length > 0 ||
    deliveryAssets.pilot_scope.out_of_scope.length > 0 ||
    deliveryAssets.pilot_scope.deliverables.length > 0 ||
    deliveryAssets.pilot_scope.stakeholders.length > 0;

  const sections = [
    { key: 'discovery', label: 'Discovery call agenda', count: deliveryAssets.discovery_agenda.length },
    { key: 'workshop', label: 'Workshop agenda', count: deliveryAssets.workshop_plan.length },
    { key: 'pilot', label: 'Pilot scope', count: hasPilot ? 1 : 0 },
  ];

  const pilotSubs = [
    { key: 'in', label: 'In-scope', items: deliveryAssets.pilot_scope.in_scope },
    { key: 'out', label: 'Out-of-scope', items: deliveryAssets.pilot_scope.out_of_scope },
    { key: 'deliverables', label: 'Deliverables', items: deliveryAssets.pilot_scope.deliverables },
    { key: 'stakeholders', label: 'Stakeholders', items: deliveryAssets.pilot_scope.stakeholders },
  ].filter((s) => s.items.length > 0);

  return (
    <CollapsibleSection title="Delivery assets" subtitle="Discovery, workshop, and pilot scope" defaultOpen={false}>
      <div className="space-y-0.5">
        {sections.map(({ key, label, count }) => (
          <div key={key} className="rounded-lg border border-border/40 overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(key)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted/30 transition-colors"
            >
              <span className="text-[11px] font-semibold text-foreground">{label}</span>
              <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform duration-200', openSection === key && 'rotate-180')} />
            </button>

            <div className={cn(
              'grid transition-all duration-200 ease-in-out',
              openSection === key ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            )}>
              <div className="overflow-hidden">
                <div className="px-3 pb-2 space-y-1">
                  {key === 'discovery' && (
                    count > 0 ? deliveryAssets.discovery_agenda.map((d, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
                        <span><span className="font-medium text-foreground">{d.theme}:</span> {truncate(d.question, 140)}</span>
                      </div>
                    )) : <p className="text-[11px] text-muted-foreground/60 italic">Not available yet.</p>
                  )}

                  {key === 'workshop' && (
                    count > 0 ? deliveryAssets.workshop_plan.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                        <span className="text-[10px] font-bold text-primary/60 mt-0.5 flex-shrink-0">{i + 1}.</span>
                        <span><span className="font-medium text-foreground">{w.step}:</span> {truncate(w.description, 120)}</span>
                      </div>
                    )) : <p className="text-[11px] text-muted-foreground/60 italic">Not available yet.</p>
                  )}

                  {key === 'pilot' && (
                    hasPilot ? (
                      <div className="space-y-0.5">
                        {pilotSubs.map((sub) => (
                          <div key={sub.key} className="rounded border border-border/30 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => togglePilot(sub.key)}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 text-left hover:bg-muted/20 transition-colors"
                            >
                              <span className="text-[10px] font-semibold text-foreground">{sub.label}</span>
                              <ChevronDown className={cn('w-3 h-3 text-muted-foreground transition-transform duration-200', openPilotSub === sub.key && 'rotate-180')} />
                            </button>
                            <div className={cn(
                              'grid transition-all duration-200 ease-in-out',
                              openPilotSub === sub.key ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                            )}>
                              <div className="overflow-hidden">
                                <ul className="px-2.5 pb-1.5 space-y-0.5">
                                  {sub.items.map((item, i) => (
                                    <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                                      <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" /> {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-[11px] text-muted-foreground/60 italic">Not available yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

export function BusinessPlayPackageView({ pkg, availableVariants, activeVariant, onVariantChange }: Props) {
  const b = pkg.business;
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const citationCount = b.signal_citation_ids?.length ?? 0;

  // ── Storyline card content (deterministic extraction) ──
  // Objective: first sentence of deal_strategy.what
  const objectiveSentences = splitSentences(b.deal_strategy.what, 1);
  const objectiveText = objectiveSentences[0] || PLACEHOLDER;

  // Point of View: first sentence of positioning.executive_pov
  const povSentences = splitSentences(b.positioning.executive_pov, 1);
  const povText = povSentences[0] || PLACEHOLDER;

  // Plan: first 3 steps from deal_strategy.how (already an array)
  const planBullets = b.deal_strategy.how.slice(0, 3);

  // Proof: first 3 value hypotheses descriptions
  const proofBullets = b.commercial_assets.value_hypotheses
    .slice(0, 3)
    .map((vh) => vh.description);

  return (
    <div className="space-y-3">
      {/* Variant toggle */}
      {availableVariants.length > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">View</span>
            <div className="inline-flex rounded-md bg-muted/50 p-0.5 border border-border/60">
              {availableVariants.map((v) => (
                <button
                  key={v}
                  onClick={() => onVariantChange(v)}
                  className={cn(
                    'px-3 py-1 rounded text-[11px] font-medium transition-all capitalize',
                    activeVariant === v
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          {/* Support drawer trigger */}
          <button
            type="button"
            onClick={() => setSupportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            Support ▸
          </button>
        </div>
      )}

      {/* ── Storyline Canvas: 4 Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Card A — Objective */}
        <SectionCard className="sm:col-span-2">
          <Label>Objective</Label>
          <Body>{objectiveText}</Body>
        </SectionCard>

        {/* Card B — Point of View */}
        <SectionCard className="sm:col-span-2">
          <Label>Point of View</Label>
          <Body>{povText}</Body>
        </SectionCard>

        {/* Card C — Plan */}
        <SectionCard>
          <Label>Plan</Label>
          {planBullets.length > 0 ? (
            <ul className="space-y-1.5">
              {planBullets.map((step, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
                  <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          ) : (
            <Body>{PLACEHOLDER}</Body>
          )}
        </SectionCard>

        {/* Card D — Proof */}
        <SectionCard>
          <Label>Proof</Label>
          {proofBullets.length > 0 ? (
            <ul className="space-y-1.5">
              {proofBullets.map((line, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
                  <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          ) : (
            <Body>{PLACEHOLDER}</Body>
          )}
          {citationCount > 0 && (
            <button
              type="button"
              onClick={() => setSourcesOpen(true)}
              className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-muted/40 border border-border/50 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="w-3 h-3" />
              Sources ({citationCount})
            </button>
          )}
        </SectionCard>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-border/40 pt-3 mt-1" />

      {/* ── Customer engagement ── */}
      <div className="space-y-2">
        <p className="text-[13px] font-semibold text-foreground">Customer engagement</p>

        {/* 1. Stakeholders & messaging — Card Tabs UI */}
        <StakeholdersTabs talkTracks={b.positioning.talk_tracks} discoveryAgenda={b.delivery_assets.discovery_agenda} />

        {/* 2. Objection handling (LAER) */}
        <CollapsibleSection title="Objection handling (LAER)" subtitle="Structured conversation framework" defaultOpen>
          {(() => {
            const objections = listObjections(pkg.focus_id !== '' ? 'alpnova' : '', { account_id: pkg.focus_id || undefined });
            const items = objections.slice(0, 5);
            if (items.length > 0) {
              return <ObjectionLAERAccordion objections={items} />;
            }
            if (b.open_questions.length > 0) {
              return (
                <div className="space-y-1">
                  {b.open_questions.slice(0, 5).map((q, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <HelpCircle className="w-3 h-3 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                      {q}
                    </div>
                  ))}
                </div>
              );
            }
            return <p className="text-[11px] text-muted-foreground/60 italic">Not available yet.</p>;
          })()}
        </CollapsibleSection>

        {/* 3. KPIs */}
        <CollapsibleSection title="KPIs" subtitle="Success metrics and targets" defaultOpen>
          {b.commercial_assets.kpis.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {b.commercial_assets.kpis.map((k, i) => (
                <SectionCard key={i} className="p-2">
                  <p className="text-[10px] font-semibold text-foreground flex items-center gap-1.5">
                    <BarChart3 className="w-3 h-3 text-primary/50" />
                    {k.label}
                  </p>
                  <p className="text-[11px] text-primary font-medium">{k.target}</p>
                </SectionCard>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground/60 italic">Not available yet.</p>
          )}
        </CollapsibleSection>

        {/* 4. Delivery assets — Accordion */}
        <DeliveryAssetsAccordion deliveryAssets={b.delivery_assets} />
      </div>

      {/* ── Support Drawer (right-side overlay) ── */}
      {supportOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSupportOpen(false)}>
          <div
            className="w-full max-w-lg h-full bg-background border-l border-border shadow-xl overflow-y-auto p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">Support Detail</h3>
              <button type="button" onClick={() => setSupportOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Deal Strategy */}
            <CollapsibleSection title="Deal Strategy" subtitle="What, How, Why" defaultOpen>
              <div className="space-y-2.5">
                <SectionCard>
                  <Label>What</Label>
                  <ExpandableBody text={b.deal_strategy.what} />
                </SectionCard>
                <SectionCard>
                  <Label>How</Label>
                  <ol className="space-y-1.5 pl-0.5">
                    {b.deal_strategy.how.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                        <span className="text-[10px] font-bold text-primary/60 mt-0.5 flex-shrink-0">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </SectionCard>
                <SectionCard>
                  <Label>Why</Label>
                  <ExpandableBody text={b.deal_strategy.why} />
                </SectionCard>
              </div>
            </CollapsibleSection>

            {/* Positioning */}
            <CollapsibleSection title="Positioning" subtitle="Executive POV and stakeholder talk tracks" defaultOpen={false}>
              <div className="space-y-2.5">
                <SectionCard>
                  <Label>Executive Point of View</Label>
                  <ExpandableBody text={b.positioning.executive_pov} />
                </SectionCard>
                <div className="space-y-1.5">
                  <Label>Talk Tracks</Label>
                  {b.positioning.talk_tracks.map((tt, i) => (
                    <SectionCard key={i}>
                      <p className="text-[10px] font-semibold text-foreground">{tt.persona}</p>
                      <ExpandableBody text={tt.message} />
                    </SectionCard>
                  ))}
                </div>
              </div>
            </CollapsibleSection>

            {/* Commercial Assets */}
            <CollapsibleSection title="Commercial Assets" subtitle="ROI prompts, value hypotheses, KPIs, sizing inputs" defaultOpen={false}>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>ROI Prompts</Label>
                  {b.commercial_assets.roi_prompts.map((r, i) => (
                    <SectionCard key={i}>
                      <p className="text-[10px] font-semibold text-foreground">{r.label}</p>
                      <ExpandableBody text={r.question} />
                    </SectionCard>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <Label>Value Hypotheses</Label>
                  {b.commercial_assets.value_hypotheses.map((v, i) => (
                    <SectionCard key={i}>
                      <p className="text-[10px] font-semibold text-foreground">{v.label}</p>
                      <ExpandableBody text={v.description} />
                    </SectionCard>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <Label>KPIs</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {b.commercial_assets.kpis.map((k, i) => (
                      <SectionCard key={i} className="p-2.5">
                        <p className="text-[10px] font-semibold text-foreground">{k.label}</p>
                        <p className="text-[11px] text-primary font-medium">{k.target}</p>
                      </SectionCard>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Sizing Inputs</Label>
                  {b.commercial_assets.sizing_inputs.map((s, i) => (
                    <SectionCard key={i} className="p-2.5">
                      <p className="text-[10px] font-semibold text-foreground">{s.label}</p>
                      <Body>{s.value}</Body>
                    </SectionCard>
                  ))}
                </div>
              </div>
            </CollapsibleSection>

            {/* Delivery Assets */}
            <CollapsibleSection title="Delivery Assets" subtitle="Discovery agenda, workshop plan, pilot scope" defaultOpen={false}>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Discovery Agenda</Label>
                  {b.delivery_assets.discovery_agenda.map((d, i) => (
                    <SectionCard key={i} className="p-2.5">
                      <p className="text-[10px] font-semibold text-foreground">{d.theme}</p>
                      <ExpandableBody text={d.question} />
                    </SectionCard>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <Label>Workshop Plan</Label>
                  {b.delivery_assets.workshop_plan.map((w, i) => (
                    <SectionCard key={i} className="p-2.5">
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-bold text-primary/60 mt-0.5 flex-shrink-0">{i + 1}.</span>
                        <div>
                          <p className="text-[10px] font-semibold text-foreground">{w.step}</p>
                          <ExpandableBody text={w.description} />
                        </div>
                      </div>
                    </SectionCard>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Pilot Scope</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <SectionCard>
                      <p className="text-[10px] font-semibold text-foreground">In Scope</p>
                      <ul className="space-y-1">
                        {b.delivery_assets.pilot_scope.in_scope.map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" /> {s}
                          </li>
                        ))}
                      </ul>
                    </SectionCard>
                    <SectionCard>
                      <p className="text-[10px] font-semibold text-foreground">Out of Scope</p>
                      <ul className="space-y-1">
                        {b.delivery_assets.pilot_scope.out_of_scope.map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="text-destructive/40 mt-0.5 flex-shrink-0 text-[10px]">-</span> {s}
                          </li>
                        ))}
                      </ul>
                    </SectionCard>
                    <SectionCard>
                      <p className="text-[10px] font-semibold text-foreground">Deliverables</p>
                      <ul className="space-y-1">
                        {b.delivery_assets.pilot_scope.deliverables.map((d, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" /> {d}
                          </li>
                        ))}
                      </ul>
                    </SectionCard>
                    <SectionCard>
                      <p className="text-[10px] font-semibold text-foreground">Stakeholders</p>
                      <ul className="space-y-1">
                        {b.delivery_assets.pilot_scope.stakeholders.map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" /> {s}
                          </li>
                        ))}
                      </ul>
                    </SectionCard>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Enablement */}
            <CollapsibleSection title="Enablement" subtitle="Seller and engineer preparation" defaultOpen={false}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <SectionCard>
                  <Label>Seller</Label>
                  <ul className="space-y-1.5">
                    {b.enablement.seller.map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                        <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
                <SectionCard>
                  <Label>Engineer</Label>
                  <ul className="space-y-1.5">
                    {b.enablement.engineer.map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                        <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              </div>
            </CollapsibleSection>

            {/* Open Questions */}
            <CollapsibleSection title="Open Questions" subtitle="Items to validate before advancing" defaultOpen={false}>
              <ul className="space-y-1.5">
                {b.open_questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                    <HelpCircle className="w-3 h-3 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                    {q}
                  </li>
                ))}
              </ul>
            </CollapsibleSection>

            {/* Sources button inside drawer */}
            {citationCount > 0 && (
              <button
                type="button"
                onClick={() => setSourcesOpen(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/40 border border-border/50 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText className="w-3 h-3" />
                Sources ({citationCount})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sources modal */}
      {sourcesOpen && b.signal_citation_ids && b.signal_citation_ids.length > 0 && (
        <SourcesModal ids={b.signal_citation_ids} onClose={() => setSourcesOpen(false)} />
      )}
    </div>
  );
}
