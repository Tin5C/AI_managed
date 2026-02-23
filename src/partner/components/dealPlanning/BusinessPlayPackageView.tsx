// BusinessPlayPackageView — Storyline Canvas hero + MECE detail sections
// Partner-only. Read-only display. No mutations.
// Hero: Objective → Point of View → Plan → Proof
// Detail (collapsed): Strategic → Economic → Execution → Advancement

import { useState } from 'react';
import type { BusinessPlayPackage, BusinessVariant, CitationRef } from '@/data/partner/businessPlayPackageStore';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
  Target,
  MessageSquare,
  ListChecks,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CollapsibleSection } from '@/components/shared/CollapsibleSection';

interface Props {
  pkg: BusinessPlayPackage;
  availableVariants: BusinessVariant[];
  activeVariant: BusinessVariant;
  onVariantChange: (v: BusinessVariant) => void;
}

/* ── Micro-components ── */

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

function ExpandableBody({ text, charLimit = 140 }: { text: string; charLimit?: number }) {
  const [showAll, setShowAll] = useState(false);
  const needsTruncation = text.length > charLimit;
  const truncated = text.slice(0, charLimit).trimEnd() + '…';

  return (
    <div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {showAll || !needsTruncation ? text : truncated}
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

function CitationBadges({ citations, isGrounded }: { citations?: CitationRef[]; isGrounded: boolean }) {
  if (!isGrounded || !citations || citations.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {citations.map((c) => (
        <span
          key={c.id}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/40 border border-border/50 text-[9px] font-mono text-muted-foreground"
        >
          <FileText className="w-2.5 h-2.5" />
          {c.label ?? c.id}
        </span>
      ))}
    </div>
  );
}

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

function MECEHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="pb-1">
      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">{title}</h4>
      {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}

/* ── Storyline Card ── */

function StorylineCard({
  icon,
  title,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-border/50 bg-card p-4 space-y-2', className)}>
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 text-primary">{icon}</div>
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">{title}</h4>
      </div>
      {children}
    </div>
  );
}

/* ── Main View ── */

export function BusinessPlayPackageView({ pkg, availableVariants, activeVariant, onVariantChange }: Props) {
  const m = pkg.mece;
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const citationCount = pkg.signal_citation_ids?.length ?? 0;
  const isGrounded = activeVariant === 'grounded';

  // Derive plan steps as concise bullets
  const planSteps = m.execution.plan.steps;
  // Derive proof lines
  const proofLines = m.economic.proof;

  return (
    <div className="space-y-5">
      {/* Variant toggle */}
      <div className="flex items-center justify-between">
        {availableVariants.length > 1 && (
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
        )}
      </div>

      {/* ═══════ STORYLINE CANVAS (hero) ═══════ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Storyline</h3>
            <p className="text-[10px] text-muted-foreground">Narrative arc for the selected play</p>
          </div>
        </div>

        <div className="grid gap-3">
          {/* Objective */}
          <StorylineCard icon={<Target className="w-3.5 h-3.5" />} title="Objective">
            <p className="text-xs text-muted-foreground leading-relaxed">{m.strategic.objective}</p>
          </StorylineCard>

          {/* Point of View */}
          <StorylineCard icon={<MessageSquare className="w-3.5 h-3.5" />} title="Point of View">
            <p className="text-xs text-muted-foreground leading-relaxed">{m.strategic.point_of_view}</p>
          </StorylineCard>

          {/* Plan */}
          <StorylineCard icon={<ListChecks className="w-3.5 h-3.5" />} title="Plan">
            <ul className="space-y-1.5">
              {planSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
                  <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </StorylineCard>

          {/* Proof */}
          <StorylineCard icon={<ShieldCheck className="w-3.5 h-3.5" />} title="Proof">
            {proofLines.length > 0 ? (
              <ul className="space-y-1.5">
                {proofLines.map((p, i) => (
                  <li key={i}>
                    <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
                      {p.statement}
                    </p>
                    <CitationBadges citations={p.citations} isGrounded={isGrounded} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] text-muted-foreground italic">No proof evidence available.</p>
            )}
            {/* Sources button attached to Proof card */}
            {citationCount > 0 && (
              <button
                type="button"
                onClick={() => setSourcesOpen(true)}
                className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/40 border border-border/50 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText className="w-3 h-3" />
                Sources ({citationCount})
              </button>
            )}
          </StorylineCard>
        </div>
      </div>

      {/* ═══════ SECONDARY SECTIONS (progressive disclosure) ═══════ */}
      <div className="space-y-2 pt-2 border-t border-border/30">

        {/* Economic */}
        <CollapsibleSection title="Economic" subtitle="Value hypothesis, KPIs, and proof" defaultOpen={false} variant="secondary">
          <div className="space-y-2">
            <SectionCard>
              <Label>Value Hypothesis</Label>
              <ExpandableBody text={m.economic.value_hypothesis} />
            </SectionCard>
            <SectionCard>
              <Label>KPIs</Label>
              <ul className="space-y-1">
                {m.economic.kpis.map((kpi, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
                    <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
                    {kpi}
                  </li>
                ))}
              </ul>
            </SectionCard>
            {m.economic.proof.length > 0 && (
              <SectionCard>
                <Label>Proof</Label>
                <ul className="space-y-2">
                  {m.economic.proof.map((p, i) => (
                    <li key={i}>
                      <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                        <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
                        {p.statement}
                      </p>
                      <CitationBadges citations={p.citations} isGrounded={isGrounded} />
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
          </div>
        </CollapsibleSection>

        {/* Execution */}
        <CollapsibleSection title="Execution" subtitle="Plan steps and delivery scope" defaultOpen={false} variant="secondary">
          <div className="space-y-2">
            <SectionCard>
              <Label>Plan</Label>
              <ul className="space-y-1.5">
                {m.execution.plan.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
                    <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </SectionCard>
            {m.execution.delivery.length > 0 && (
              <div className="space-y-1.5">
                {m.execution.delivery.map((d, i) => (
                  <SectionCard key={i} className="p-2.5">
                    <p className="text-[10px] font-semibold text-foreground">{d.title}</p>
                    {d.body && <Body>{d.body}</Body>}
                    <CitationBadges citations={d.citations} isGrounded={isGrounded} />
                  </SectionCard>
                ))}
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Advancement */}
        <CollapsibleSection title="Advancement" subtitle="Required info and objection handling" defaultOpen={false} variant="secondary">
          <div className="space-y-2">
            {m.advancement.required_info_from_customer.length > 0 && (
              <SectionCard>
                <Label>Required info from customer</Label>
                <ul className="space-y-1.5">
                  {m.advancement.required_info_from_customer.map((q, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
                      <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
                      {q}
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
            {m.advancement.objections.length > 0 && (
              <SectionCard>
                <Label>Objections</Label>
                <ul className="space-y-2">
                  {m.advancement.objections.map((obj, i) => (
                    <li key={i}>
                      <p className="text-xs text-foreground font-medium">{obj.objection}</p>
                      {obj.mitigation && <p className="text-xs text-muted-foreground mt-0.5">{obj.mitigation}</p>}
                      <CitationBadges citations={obj.citations} isGrounded={isGrounded} />
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
          </div>
        </CollapsibleSection>

        {/* Strategic Breakdown — appendix, collapsed by default */}
        <CollapsibleSection title="Strategic Breakdown (Support)" subtitle="Objective and point of view detail" defaultOpen={false} variant="secondary">
          <div className="space-y-2">
            <SectionCard>
              <Label>Objective</Label>
              <ExpandableBody text={m.strategic.objective} />
            </SectionCard>
            <SectionCard>
              <Label>Point of View</Label>
              <ExpandableBody text={m.strategic.point_of_view} />
            </SectionCard>
            {m.strategic.context && (
              <SectionCard>
                <Label>Context</Label>
                <Body>{m.strategic.context}</Body>
              </SectionCard>
            )}
          </div>
        </CollapsibleSection>
      </div>

      {/* Sources modal */}
      {sourcesOpen && pkg.signal_citation_ids && pkg.signal_citation_ids.length > 0 && (
        <SourcesModal ids={pkg.signal_citation_ids} onClose={() => setSourcesOpen(false)} />
      )}
    </div>
  );
}
