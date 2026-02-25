// TechnicalPlayPackView — Unified 6-section Technical Canvas
// Flat layout, no accordions. Executive vs Grounded = density only.

import { useMemo } from 'react';
import { Shield, FileText, Wrench, Layers, DollarSign, BookOpen, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { listMemoryItems, type AccountMemoryItem } from '@/data/partner/accountMemoryStore';

type TechVariant = 'executive' | 'grounded';

interface Props {
  playId: string;
  accountId: string;
  variant: TechVariant;
  onVariantChange: (v: TechVariant) => void;
}

/* ── Evidence helper ── */

function usePlayEvidence(accountId: string, playId: string): AccountMemoryItem[] {
  return useMemo(() => {
    const relTag = `rel:${playId}`;
    return listMemoryItems(accountId).filter(
      (m) => m.tags?.includes('pillar:technical') && m.tags?.includes(relTag),
    );
  }, [accountId, playId]);
}

/* ── Deterministic content types ── */

interface PostureBullet { text: string; evidence: string; detail?: string; }
interface ShiftRow { shift: string; whatChanges: string; riskIfSkipped: string; detail?: string; }
interface ArchNode { label: string; }
interface IntegrationRow { system: string; complexity: 'Low' | 'Medium' | 'High'; impact: string; }
interface CostDriver { text: string; }
interface ReferenceStory { name: string; bullets: string[]; }

interface TechPack {
  playLabel: string;
  povLabel: string;
  posture: PostureBullet[];
  shifts: ShiftRow[];
  architecture: ArchNode[];
  integrations: IntegrationRow[];
  costDrivers: CostDriver[];
  enablementBand: string;
  references: ReferenceStory[];
}

/* ── GOVERNANCE PACK ── */

const GOVERNANCE_PACK: TechPack = {
  playLabel: 'AI Governance for Scalable Deployment',
  povLabel: 'Risk (Controls & Compliance)',
  posture: [
    { text: 'Policy enforcement is inconsistent across teams, creating uneven controls.', evidence: 'No centralized AI policy enforcement', detail: 'Different teams apply different rules for AI workloads; some have no guardrails at all.' },
    { text: 'AI deployment approvals are manual and lack an auditable workflow.', evidence: 'Manual AI approval workflow', detail: 'Approval requests are routed via email or ad-hoc channels with no standard SLA or audit log.' },
    { text: 'Azure OpenAI usage is expanding without centralized model ownership tracking.', evidence: 'Azure OpenAI expansion without model inventory', detail: 'Multiple teams experiment with Azure OpenAI; ownership, versioning, and lifecycle are fragmented.' },
    { text: 'Swiss residency requirements increase compliance exposure without standardized controls.', evidence: 'Swiss data residency constraints', detail: 'Production AI workloads must run in Swiss regions; current validation is manual and inconsistent.' },
  ],
  shifts: [
    { shift: 'Policy Enforcement', whatChanges: 'Implement Azure Policy guardrails and Purview governance rules for AI workloads.', riskIfSkipped: 'Uncontrolled AI deployments and inconsistent controls.', detail: 'Requires mapping all AI workload types to policy definitions and testing enforcement in staging.' },
    { shift: 'Model Registry', whatChanges: 'Introduce centralized model registry with owners, versions, and promotion gates.', riskIfSkipped: 'Shadow models and unclear accountability.', detail: 'Must agree on ownership taxonomy, versioning scheme, and promotion criteria across teams.' },
    { shift: 'Workflow Automation', whatChanges: 'Connect approvals to ServiceNow workflow with audit trail for production releases.', riskIfSkipped: 'Governance bypass and no traceability.', detail: 'Integration with ServiceNow requires mapping approval stages and defining escalation rules.' },
    { shift: 'Compliance Monitoring', whatChanges: 'Enable centralized logging and validate Swiss residency compliance for production workloads.', riskIfSkipped: 'Regulatory and audit exposure.', detail: 'Logging must cover all AI inference and training endpoints with residency validation checks.' },
  ],
  architecture: [
    { label: 'Azure OpenAI / Azure AI workloads' },
    { label: 'Azure Policy enforcement layer' },
    { label: 'Microsoft Purview classification & governance' },
    { label: 'Centralized logging (Azure Monitor / Log Analytics)' },
    { label: 'ServiceNow approval workflow' },
    { label: 'Central model registry (owners + versioning + promotion gates)' },
  ],
  integrations: [
    { system: 'ServiceNow', complexity: 'Medium', impact: 'Auditable governance gating' },
    { system: 'Microsoft Purview', complexity: 'Medium', impact: 'Data governance controls' },
    { system: 'Azure Policy', complexity: 'Low', impact: 'Guardrails enforcement' },
    { system: 'Log Analytics', complexity: 'Medium', impact: 'Audit readiness' },
  ],
  costDrivers: [
    { text: 'Number of AI workloads/models governed' },
    { text: 'Logging volume & retention' },
    { text: 'Workflow complexity (approvals)' },
    { text: 'Scope of Purview classification' },
  ],
  enablementBand: '6–8 weeks',
  references: [
    { name: 'Alpine Mobility Group', bullets: ['Implemented centralized policy guardrails + model registry', 'Reduced approval cycle time by 35%', 'Passed internal audit with no governance findings'] },
    { name: 'Helvetic Rail Systems', bullets: ['Automated AI deployment approvals via ServiceNow', 'Established enterprise model inventory and ownership', 'Improved traceability for production AI systems'] },
  ],
};

/* ── FINOPS PACK ── */

const FINOPS_PACK: TechPack = {
  playLabel: 'FinOps for AI Cost Governance',
  povLabel: 'Cost (Visibility & Accountability)',
  posture: [
    { text: 'AI workload costs are not attributed to business units or cost centers.', evidence: 'SAP cost centers exist, but not consistently mapped to Azure subscriptions', detail: 'Finance has cost-center data in SAP but subscription tagging is incomplete for showback.' },
    { text: 'Azure landing zone exists but cost governance policies are not enforced.', evidence: 'Landing zone: hub-and-spoke with Swiss + EU connectivity', detail: 'Hub-and-spoke networking is in place; cost tagging and budget alerts are not configured.' },
    { text: 'AI experimentation spend is growing without forecasting or budget controls.', evidence: 'Azure OpenAI expansion without model inventory', detail: 'Teams spin up Azure OpenAI resources without pre-approved budgets or consumption limits.' },
    { text: 'ServiceNow handles approvals but is not connected to cost governance workflows.', evidence: 'ServiceNow is the central approvals workflow tool', detail: 'Governance workflows should integrate cost approval thresholds into the existing ServiceNow process.' },
  ],
  shifts: [
    { shift: 'Tagging & Attribution', whatChanges: 'Enforce consistent resource tagging aligned to SAP cost centers across all AI subscriptions.', riskIfSkipped: 'No cost attribution; uncontrolled AI spend.', detail: 'Requires tag taxonomy design and Azure Policy enforcement for mandatory tags.' },
    { shift: 'Budget Controls', whatChanges: 'Implement Azure Cost Management budgets and alerts for AI workloads with team-level thresholds.', riskIfSkipped: 'Unexpected cost overruns with no early warning.', detail: 'Budget alerts must be configured per subscription and linked to team leads.' },
    { shift: 'Chargeback/Showback', whatChanges: 'Build chargeback reporting pipeline from Azure Cost Management to SAP Finance.', riskIfSkipped: 'Business units cannot see or own their AI costs.', detail: 'Data pipeline from Azure Cost Management exports to SAP cost-center reconciliation.' },
    { shift: 'Procurement Integration', whatChanges: 'Connect cost approval workflows to ServiceNow with spend thresholds and escalation rules.', riskIfSkipped: 'Spend approvals remain ad-hoc and ungoverned.', detail: 'ServiceNow integration requires approval stage definitions and escalation routing.' },
  ],
  architecture: [
    { label: 'Azure AI workloads (Azure OpenAI, ML)' },
    { label: 'Azure Cost Management + Billing' },
    { label: 'Azure Policy (tag enforcement)' },
    { label: 'SAP Finance (cost-center reconciliation)' },
    { label: 'ServiceNow (procurement workflow)' },
    { label: 'Power BI / reporting layer' },
  ],
  integrations: [
    { system: 'SAP Finance', complexity: 'Medium', impact: 'Cost-center chargeback' },
    { system: 'Azure Cost Management', complexity: 'Low', impact: 'Budget alerts & exports' },
    { system: 'ServiceNow', complexity: 'Medium', impact: 'Spend approval workflow' },
    { system: 'Power BI', complexity: 'Low', impact: 'Executive cost dashboards' },
  ],
  costDrivers: [
    { text: 'Number of AI subscriptions governed' },
    { text: 'Complexity of SAP integration' },
    { text: 'Reporting and dashboard requirements' },
    { text: 'Workflow customization scope' },
  ],
  enablementBand: '4–6 weeks',
  references: [
    { name: 'Nordic Industrial AG', bullets: ['Implemented end-to-end AI cost attribution', 'Reduced untagged AI spend by 60%', 'Enabled team-level showback in 3 weeks'] },
    { name: 'Central Swiss Logistics', bullets: ['Connected Azure Cost Management to SAP Finance', 'Automated cost alerts for AI workloads', 'Achieved full chargeback visibility in 5 weeks'] },
  ],
};

const PACKS: Record<string, TechPack> = {
  play_governance: GOVERNANCE_PACK,
  play_finops: FINOPS_PACK,
};

/* ── Micro-components ── */

function EvidenceChip({ title }: { title: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/[0.06] text-primary/70 text-[9px] font-medium border border-primary/10">
      <FileText className="w-2.5 h-2.5" />
      {title}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold text-foreground uppercase tracking-wider border-b border-border/30 pb-1.5 mb-2">
      {children}
    </p>
  );
}

const complexityStyle = (c: string) =>
  c === 'Low' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
  c === 'Medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
  'bg-red-500/10 text-red-600 border-red-500/20';

/* ── Main Component ── */

export function TechnicalPlayPackView({ playId, accountId, variant, onVariantChange }: Props) {
  const pack = PACKS[playId];
  const evidence = usePlayEvidence(accountId, playId);

  if (!pack) return null;

  const isGrounded = variant === 'grounded';

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-4">
      {/* ── Play Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold text-foreground">{pack.playLabel}</p>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 ml-6">{pack.povLabel}</p>
        </div>
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
      </div>

      {/* ── Section 1: Technical Posture ── */}
      <div>
        <SectionTitle>1 · Technical Posture</SectionTitle>
        <div className="space-y-2">
          {pack.posture.map((b, i) => (
            <div key={i} className="space-y-0.5">
              <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                <span className="text-primary/40 mt-0.5">•</span> {b.text}
              </p>
              {isGrounded && b.detail && (
                <p className="text-[10px] text-muted-foreground/70 pl-4 leading-relaxed">{b.detail}</p>
              )}
              <div className="pl-4"><EvidenceChip title={b.evidence} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 2: Required Execution Shifts ── */}
      <div>
        <SectionTitle>2 · Required Execution Shifts</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-1.5 pr-2 font-semibold text-muted-foreground uppercase tracking-wider">Shift</th>
                <th className="text-left py-1.5 pr-2 font-semibold text-muted-foreground uppercase tracking-wider">What Changes</th>
                <th className="text-left py-1.5 font-semibold text-muted-foreground uppercase tracking-wider">Risk if Skipped</th>
              </tr>
            </thead>
            <tbody>
              {pack.shifts.map((row, i) => (
                <tr key={i} className="border-b border-border/20 align-top">
                  <td className="py-1.5 pr-2 font-medium text-foreground whitespace-nowrap">{row.shift}</td>
                  <td className="py-1.5 pr-2 text-muted-foreground">
                    {row.whatChanges}
                    {isGrounded && row.detail && (
                      <p className="text-[9px] text-muted-foreground/60 mt-0.5 italic">{row.detail}</p>
                    )}
                  </td>
                  <td className="py-1.5 text-destructive/70">{row.riskIfSkipped}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 3: Target Architecture Shape ── */}
      <div>
        <SectionTitle>3 · Target Architecture Shape</SectionTitle>
        <div className="space-y-0">
          {pack.architecture.map((node, i) => (
            <div key={i}>
              <p className="text-[10px] text-foreground font-medium py-1 pl-2 border-l-2 border-primary/20">
                {node.label}
              </p>
              {i < pack.architecture.length - 1 && (
                <div className="flex items-center pl-3 py-0.5">
                  <ArrowDown className="w-3 h-3 text-muted-foreground/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 4: Integration Impact ── */}
      <div>
        <SectionTitle>4 · Integration Impact</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-1.5 pr-2 font-semibold text-muted-foreground uppercase tracking-wider">System</th>
                <th className="text-left py-1.5 pr-2 font-semibold text-muted-foreground uppercase tracking-wider">Complexity</th>
                <th className="text-left py-1.5 font-semibold text-muted-foreground uppercase tracking-wider">Impact</th>
              </tr>
            </thead>
            <tbody>
              {pack.integrations.map((row, i) => (
                <tr key={i} className="border-b border-border/20">
                  <td className="py-1.5 pr-2 font-medium text-foreground">{row.system}</td>
                  <td className="py-1.5 pr-2">
                    <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-medium border', complexityStyle(row.complexity))}>
                      {row.complexity}
                    </span>
                  </td>
                  <td className="py-1.5 text-muted-foreground">{row.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 5: Commercial Envelope ── */}
      <div>
        <SectionTitle>5 · Commercial Envelope</SectionTitle>
        <div className="space-y-1.5">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Primary Cost Drivers</p>
          <div className="space-y-0.5">
            {pack.costDrivers.map((d, i) => (
              <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                <DollarSign className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" />
                {d.text}
              </p>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Enablement Band</p>
            <p className="text-xs font-medium text-foreground">{pack.enablementBand}</p>
          </div>
        </div>
      </div>

      {/* ── Section 6: Comparable Implementations ── */}
      <div>
        <SectionTitle>6 · Comparable Implementations</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {pack.references.map((story, i) => (
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
      </div>

      {/* ── Evidence strip (grounded only) ── */}
      {isGrounded && evidence.length > 0 && (
        <div className="border-t border-border/30 pt-3">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Referenced Evidence ({evidence.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {evidence.map((item) => (
              <EvidenceChip key={item.id} title={item.title} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
