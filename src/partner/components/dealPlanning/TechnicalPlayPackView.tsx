// TechnicalPlayPackView — Play-aware Technical content with Executive/Grounded variants
// Partner-only, additive. No scoring/propensity changes.

import { useState, useMemo } from 'react';
import { Shield, ChevronDown, ChevronUp, FileText, Wrench, AlertTriangle, Layers, DollarSign, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { listMemoryItems, type AccountMemoryItem } from '@/data/partner/accountMemoryStore';
import { CollapsibleSection } from '@/components/shared/CollapsibleSection';

type TechVariant = 'executive' | 'grounded';

interface Props {
  playId: string;
  accountId: string;
  variant: TechVariant;
  onVariantChange: (v: TechVariant) => void;
}

/* ── Evidence helpers ── */

function usePlayEvidence(accountId: string, playId: string): AccountMemoryItem[] {
  return useMemo(() => {
    const relTag = `rel:${playId}`;
    return listMemoryItems(accountId).filter(
      (m) => m.tags?.includes('pillar:technical') && m.tags?.includes(relTag),
    );
  }, [accountId, playId]);
}

/* ── Deterministic content packs ── */

interface StrategicBullet { text: string; evidence: string; }
interface WhatMustChange { text: string; evidence: string; }
interface RequiredChange { label: string; change: string; riskIfSkipped: string; evidence: string; }
interface IntegrationRow { system: string; integration: string; purpose: string; complexity: string; }
interface ReferenceStory { name: string; bullets: string[]; }

interface TechPackContent {
  playLabel: string;
  povLabel: string;
  executive: {
    strategicAssessment: StrategicBullet[];
    whatMustChange: WhatMustChange[];
    technicalFit: string;
    constraint: string;
    enablementBand: string;
  };
  grounded: {
    requiredChanges: RequiredChange[];
    architecturePattern: string[];
    integrationBlueprint: IntegrationRow[];
    costDrivers: string[];
    servicesBand: string;
    referenceStories: ReferenceStory[];
  };
}

const GOVERNANCE_PACK: TechPackContent = {
  playLabel: 'AI Governance for Scalable Deployment',
  povLabel: 'Risk (Controls & Compliance)',
  executive: {
    strategicAssessment: [
      { text: 'Policy enforcement is inconsistent across teams, creating uneven controls.', evidence: 'No centralized AI policy enforcement' },
      { text: 'AI deployment approvals are manual and lack an auditable workflow.', evidence: 'Manual AI approval workflow' },
      { text: 'Azure OpenAI usage is expanding without centralized model ownership tracking.', evidence: 'Azure OpenAI expansion without model inventory' },
      { text: 'Swiss residency requirements increase compliance exposure without standardized controls.', evidence: 'Swiss data residency constraints' },
    ],
    whatMustChange: [
      { text: 'Implement centralized AI policy enforcement using Azure Policy and Microsoft Purview.', evidence: 'No centralized AI policy enforcement' },
      { text: 'Establish a model registry with ownership, versioning, and lifecycle controls.', evidence: 'Azure OpenAI expansion without model inventory' },
      { text: 'Integrate AI deployment approvals into ServiceNow with an audit trail.', evidence: 'Manual AI approval workflow' },
      { text: 'Standardize logging and residency validation for production AI workloads.', evidence: 'Swiss data residency constraints' },
    ],
    technicalFit: 'Medium–High',
    constraint: 'Governance coordination, not platform capability.',
    enablementBand: '6–8 weeks',
  },
  grounded: {
    requiredChanges: [
      { label: 'Policy Enforcement', change: 'Implement Azure Policy guardrails and Purview governance rules for AI workloads.', riskIfSkipped: 'Uncontrolled AI deployments and inconsistent controls.', evidence: 'No centralized AI policy enforcement' },
      { label: 'Model Registry', change: 'Introduce centralized model registry with owners, versions, and promotion gates.', riskIfSkipped: 'Shadow models and unclear accountability.', evidence: 'Azure OpenAI expansion without model inventory' },
      { label: 'Workflow Automation', change: 'Connect approvals to ServiceNow workflow with audit trail for production releases.', riskIfSkipped: 'Governance bypass and no traceability.', evidence: 'Manual AI approval workflow' },
      { label: 'Compliance Monitoring', change: 'Enable centralized logging and validate Swiss residency compliance for production workloads.', riskIfSkipped: 'Regulatory and audit exposure.', evidence: 'Swiss data residency constraints' },
    ],
    architecturePattern: [
      'Azure OpenAI / Azure AI workloads',
      'Azure Policy enforcement layer',
      'Microsoft Purview classification & governance',
      'Centralized logging (Azure Monitor / Log Analytics)',
      'ServiceNow approval workflow',
      'Central model registry (owners + versioning + promotion gates)',
    ],
    integrationBlueprint: [
      { system: 'ServiceNow', integration: 'Approval workflow', purpose: 'Auditable governance gating', complexity: 'Medium' },
      { system: 'Microsoft Purview', integration: 'Classification sync', purpose: 'Data governance controls', complexity: 'Medium' },
      { system: 'Azure Policy', integration: 'Policy-as-code', purpose: 'Guardrails enforcement', complexity: 'Low' },
      { system: 'Log Analytics', integration: 'Central logs', purpose: 'Audit readiness', complexity: 'Medium' },
    ],
    costDrivers: [
      'Number of AI workloads/models governed',
      'Logging volume & retention',
      'Workflow complexity (approvals)',
      'Scope of Purview classification',
    ],
    servicesBand: '6–8 weeks',
    referenceStories: [
      { name: 'Alpine Mobility Group', bullets: ['Implemented centralized policy guardrails + model registry', 'Reduced approval cycle time by 35%', 'Passed internal audit with no governance findings'] },
      { name: 'Helvetic Rail Systems', bullets: ['Automated AI deployment approvals via ServiceNow', 'Established enterprise model inventory and ownership', 'Improved traceability for production AI systems'] },
    ],
  },
};

const PACKS: Record<string, TechPackContent> = {
  play_governance: GOVERNANCE_PACK,
};

/* ── Micro-components ── */

function EvidenceTag({ title }: { title: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/[0.06] text-primary/70 text-[9px] font-medium border border-primary/10">
      <FileText className="w-2.5 h-2.5" />
      {title}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{children}</p>;
}

/* ── Executive View ── */

function ExecutiveView({ pack }: { pack: TechPackContent }) {
  const e = pack.executive;
  return (
    <div className="space-y-4">
      {/* Strategic Assessment */}
      <CollapsibleSection title="Strategic Assessment" subtitle="Business → Technology translation" defaultOpen>
        <div className="space-y-2">
          {e.strategicAssessment.map((b, i) => (
            <div key={i} className="space-y-1">
              <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                <span className="text-primary/40 mt-0.5">•</span> {b.text}
              </p>
              <div className="pl-4">
                <EvidenceTag title={b.evidence} />
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* What Must Change */}
      <CollapsibleSection title="What Must Change" subtitle="Required technical shifts" defaultOpen>
        <div className="space-y-2">
          {e.whatMustChange.map((w, i) => (
            <div key={i} className="space-y-1">
              <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                <span className="text-primary font-semibold mt-0.5">{i + 1}.</span> {w.text}
              </p>
              <div className="pl-4">
                <EvidenceTag title={w.evidence} />
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Executive Conclusion */}
      <div className="p-3 rounded-lg bg-muted/20 border border-border/40 space-y-1.5">
        <SectionLabel>Executive Conclusion</SectionLabel>
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <div>
            <p className="text-muted-foreground/60 text-[9px] uppercase tracking-wider font-semibold">Technical Fit</p>
            <p className="text-foreground font-medium">{e.technicalFit}</p>
          </div>
          <div>
            <p className="text-muted-foreground/60 text-[9px] uppercase tracking-wider font-semibold">Constraint</p>
            <p className="text-foreground font-medium">{e.constraint}</p>
          </div>
          <div>
            <p className="text-muted-foreground/60 text-[9px] uppercase tracking-wider font-semibold">Enablement</p>
            <p className="text-foreground font-medium">{e.enablementBand}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Grounded View ── */

function GroundedView({ pack, evidence }: { pack: TechPackContent; evidence: AccountMemoryItem[] }) {
  const g = pack.grounded;
  return (
    <div className="space-y-4">
      {/* Evidence Referenced */}
      <CollapsibleSection title="Customer Evidence (Most relevant to this play)" subtitle={`${evidence.length} items`} defaultOpen>
        {evidence.length > 0 ? (
          <div className="space-y-1.5">
            {evidence.map((item) => (
              <div key={item.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted/20 border border-border/40">
                <FileText className="w-3.5 h-3.5 text-primary/50 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-foreground">{item.title}</p>
                  {item.content_text && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{item.content_text.split('\n')[0]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground/60 italic">No evidence items tagged for this play.</p>
        )}
      </CollapsibleSection>

      {/* Required Technical Changes */}
      <CollapsibleSection title="Required Technical Changes" subtitle="Detailed change requirements" defaultOpen>
        <div className="space-y-3">
          {g.requiredChanges.map((rc, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-muted/10 border border-border/40 space-y-1.5">
              <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                <Wrench className="w-3 h-3 text-primary/50" />
                {i + 1}. {rc.label}
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed pl-[18px]">{rc.change}</p>
              <div className="flex items-start gap-1.5 pl-[18px]">
                <AlertTriangle className="w-3 h-3 text-destructive/50 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-destructive/70 leading-relaxed">Risk if skipped: {rc.riskIfSkipped}</p>
              </div>
              <div className="pl-[18px]">
                <EvidenceTag title={rc.evidence} />
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Architecture Pattern */}
      <CollapsibleSection title="Architecture Pattern" subtitle="Target architecture components" defaultOpen={false}>
        <div className="space-y-0.5">
          {g.architecturePattern.map((p, i) => (
            <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
              <Layers className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
              {p}
            </p>
          ))}
        </div>
      </CollapsibleSection>

      {/* Integration Blueprint */}
      <CollapsibleSection title="Integration Blueprint" subtitle="System integration requirements" defaultOpen={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-1.5 pr-2 font-semibold text-muted-foreground uppercase tracking-wider">System</th>
                <th className="text-left py-1.5 pr-2 font-semibold text-muted-foreground uppercase tracking-wider">Integration</th>
                <th className="text-left py-1.5 pr-2 font-semibold text-muted-foreground uppercase tracking-wider">Purpose</th>
                <th className="text-left py-1.5 font-semibold text-muted-foreground uppercase tracking-wider">Complexity</th>
              </tr>
            </thead>
            <tbody>
              {g.integrationBlueprint.map((row, i) => (
                <tr key={i} className="border-b border-border/20">
                  <td className="py-1.5 pr-2 font-medium text-foreground">{row.system}</td>
                  <td className="py-1.5 pr-2 text-muted-foreground">{row.integration}</td>
                  <td className="py-1.5 pr-2 text-muted-foreground">{row.purpose}</td>
                  <td className="py-1.5">
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[9px] font-medium border',
                      row.complexity === 'Low' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                      row.complexity === 'Medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                      'bg-red-500/10 text-red-600 border-red-500/20'
                    )}>
                      {row.complexity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>

      {/* Pricing & Cost Drivers */}
      <CollapsibleSection title="Pricing & Cost Drivers" subtitle="Commercial structure" defaultOpen={false}>
        <div className="space-y-2">
          <div>
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Primary Cost Drivers</p>
            <div className="space-y-0.5">
              {g.costDrivers.map((d, i) => (
                <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                  <DollarSign className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
                  {d}
                </p>
              ))}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-muted/20 border border-border/40">
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Services Band</p>
            <p className="text-xs font-medium text-foreground mt-0.5">{g.servicesBand}</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Reference Stories */}
      <CollapsibleSection title="Reference Stories" subtitle="Comparable engagements" defaultOpen={false}>
        <div className="space-y-2">
          {g.referenceStories.map((story, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-muted/10 border border-border/40 space-y-1">
              <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-primary/50" />
                {story.name}
              </p>
              <div className="space-y-0.5 pl-[18px]">
                {story.bullets.map((b, j) => (
                  <p key={j} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                    <span className="text-green-500 mt-px">•</span> {b}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}

/* ── Main Component ── */

export function TechnicalPlayPackView({ playId, accountId, variant, onVariantChange }: Props) {
  const pack = PACKS[playId];
  const evidence = usePlayEvidence(accountId, playId);

  if (!pack) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold text-foreground">{pack.playLabel}</p>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 ml-6">{pack.povLabel}</p>
        </div>
      </div>

      {/* Variant toggle */}
      <div className="inline-flex rounded-lg bg-muted/50 p-0.5 border border-border/60">
        {(['executive', 'grounded'] as TechVariant[]).map((v) => (
          <button
            key={v}
            onClick={() => onVariantChange(v)}
            className={cn(
              'px-3 py-1 rounded-md text-[10px] font-medium transition-all capitalize',
              variant === v
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Content */}
      {variant === 'executive' ? (
        <ExecutiveView pack={pack} />
      ) : (
        <GroundedView pack={pack} evidence={evidence} />
      )}
    </div>
  );
}
