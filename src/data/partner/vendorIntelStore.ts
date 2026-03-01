// VendorIntelStore — Partner-only in-memory vendor enablement items
// Expanded v2: richer type system, Microsoft proprietary pack (AI Governance + FinOps for AI)
// Backward-compatible: legacy exports preserved for existing Meeting Prep UI.

// ============= Types =============

export type VendorId = 'microsoft' | 'anthropic' | 'credo_ai';

export type VendorIntelItemType =
  | 'update'
  | 'reference_case'
  | 'kpi'
  | 'pitch_drill'
  | 'deal_close_kit'
  | 'approved_architecture_pattern'
  | 'objection_counter_pack'
  | 'commercial_playbook'
  | 'request_router'
  | 'incentive'
  | 'contact'
  | 'roadmap_positioning_note';

export type SourceType =
  | 'internal_field_interview_sanitized'
  | 'partner_program_brief'
  | 'roadmap_brief'
  | 'public';

export interface VendorIntelItem {
  id: string;
  vendorId: VendorId;
  type: VendorIntelItemType;
  title: string;
  summary: string;
  /** Optional play alignment */
  playId?: string;
  /** Persona tags */
  tags?: {
    persona?: string[];
    stage?: string[];
    industry?: string[];
  };
  proprietaryFlag: boolean;
  sourceType: SourceType;
  sourceUrl?: string;
  weekOf?: string;
  // Legacy compat field — mapped from old schema
  focusId?: string;
}

// ============= In-memory store =============

const store: VendorIntelItem[] = [];

// ============= New canonical getters =============

export function listVendorIntel(
  vendorId: VendorId,
  opts?: { playId?: string; weekOf?: string; types?: VendorIntelItemType[] },
): VendorIntelItem[] {
  return store.filter((i) => {
    if (i.vendorId !== vendorId) return false;
    if (opts?.playId && i.playId && i.playId !== opts.playId) return false;
    if (opts?.weekOf && i.weekOf && i.weekOf !== opts.weekOf) return false;
    if (opts?.types && opts.types.length > 0 && !opts.types.includes(i.type)) return false;
    return true;
  });
}

export interface MeetingPrepVendorIntel {
  latestUpdates: VendorIntelItem[];
  referenceCases: VendorIntelItem[];
  kpis: VendorIntelItem[];
  pitchDrills: VendorIntelItem[];
  sourcesSummary: { proprietaryCount: number; publicCount: number; total: number };
}

export function getVendorIntelForMeetingPrep(
  vendorId: VendorId,
  opts?: { playId?: string; weekOf?: string },
): MeetingPrepVendorIntel {
  const all = listVendorIntel(vendorId, { playId: opts?.playId, weekOf: opts?.weekOf });
  const latestUpdates = all.filter((i) => i.type === 'update');
  const referenceCases = all.filter((i) => i.type === 'reference_case');
  const kpis = all.filter((i) => i.type === 'kpi');
  const pitchDrills = all.filter((i) => i.type === 'pitch_drill');
  const proprietaryCount = all.filter((i) => i.proprietaryFlag).length;
  const publicCount = all.filter((i) => !i.proprietaryFlag).length;
  return {
    latestUpdates,
    referenceCases,
    kpis,
    pitchDrills,
    sourcesSummary: { proprietaryCount, publicCount, total: all.length },
  };
}

// ============= Legacy backward-compatible getters =============
// These are used by MeetingPrepSection.tsx today (keyed by focusId).

export function listVendorIntelByFocus(
  focusId: string,
  vendorId?: string,
): VendorIntelItem[] {
  return store.filter((i) => {
    // ✅ enforce vendor first (prevents cross-vendor leakage)
    if (vendorId && i.vendorId !== vendorId) return false;

    // focus filtering (global items match any focus, but only after vendor filter)
    if (i.focusId && i.focusId !== focusId) return false;
    if (!i.focusId) return true; // global vendor items match any focus
    return true;
  });
}

export function listVendorIntelByFocusAndWeek(
  focusId: string,
  weekOf: string,
  vendorId?: string,
): VendorIntelItem[] {
  return store.filter((i) => {
    // ✅ enforce vendor first (prevents cross-vendor leakage)
    if (vendorId && i.vendorId !== vendorId) return false;

    // focus filtering (global items allowed because we only reject mismatched focusId)
    if (i.focusId && i.focusId !== focusId) return false;

    // week filtering (preserve existing semantics)
    if (i.weekOf && i.weekOf !== weekOf) return false;

    return true;
  });
}

// ============= Seed data — Microsoft Proprietary Pack v1 =============
// AI Governance + FinOps for AI plays
// All content is DEMO MOCK DATA. sourceType flags indicate provenance.

const SEEDS: VendorIntelItem[] = [
  // ────────────────────────────────────────────
  // UPDATES (meeting prep "Latest updates")
  // ────────────────────────────────────────────
  {
    id: 'vi-ms-update-azure-ai-swiss',
    vendorId: 'microsoft',
    type: 'update',
    title: 'Azure OpenAI now GA in Switzerland North — data residency unlocked',
    summary: 'Swiss-hosted GPT-4o removes compliance blockers for regulated workloads. Key for AI Governance conversations where data residency is a prerequisite.',
    playId: 'play_governance',
    tags: { persona: ['CIO', 'CISO'], stage: ['Discovery', 'Pilot'], industry: ['manufacturing', 'financial_services'] },
    proprietaryFlag: false,
    sourceType: 'public',
    weekOf: '2026-02-10',
    focusId: 'schindler',
  },
  {
    id: 'vi-ms-update-copilot-governance-ga',
    vendorId: 'microsoft',
    type: 'update',
    title: 'Microsoft 365 Copilot: admin-level governance controls and sensitivity-label enforcement now GA',
    summary: 'Enables enterprise-wide policy enforcement for Copilot rollout. Critical for AI governance plays where IT leadership needs centralized controls before scaling adoption.',
    playId: 'play_governance',
    tags: { persona: ['CIO', 'CISO'], stage: ['Pilot', 'Production'] },
    proprietaryFlag: false,
    sourceType: 'public',
    weekOf: '2026-02-10',
    focusId: 'fifa',
  },
  {
    id: 'vi-ms-update-cost-mgmt-ai-tags',
    vendorId: 'microsoft',
    type: 'update',
    title: 'Azure Cost Management: AI-specific resource tagging and anomaly alerts now in preview',
    summary: 'New tagging taxonomy for AI workloads enables granular cost attribution. Anomaly detection flags unexpected token-consumption spikes within 15 minutes.',
    playId: 'play_finops_ai',
    tags: { persona: ['CFO', 'CIO'], stage: ['Production'] },
    proprietaryFlag: false,
    sourceType: 'public',
    weekOf: '2026-02-10',
  },

  // ────────────────────────────────────────────
  // REFERENCE CASES (meeting prep "Reference cases")
  // ────────────────────────────────────────────
  {
    id: 'vi-ms-ref-thyssenkrupp-dt',
    vendorId: 'microsoft',
    type: 'reference_case',
    title: 'ThyssenKrupp: Azure Digital Twins for predictive elevator maintenance',
    summary: '30% reduction in unplanned downtime using Azure IoT + Digital Twins across 12K units. Governance model required dedicated OT-security workstream before production rollout.',
    playId: 'play_governance',
    tags: { persona: ['CIO', 'COO'], stage: ['Production'], industry: ['manufacturing'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
    focusId: 'schindler',
  },
  {
    id: 'vi-ms-ref-ioc-fan-engagement',
    vendorId: 'microsoft',
    type: 'reference_case',
    title: 'IOC: Azure-hosted fan engagement platform for Paris 2024',
    summary: 'Scaled to 200M concurrent sessions with <50ms latency using Azure Front Door + Cosmos DB. FinOps model used pre-provisioned reserved capacity + burst budgets with automated scale-back.',
    playId: 'play_finops_ai',
    tags: { persona: ['CIO', 'CFO'], stage: ['Production'], industry: ['sports_entertainment'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
    focusId: 'fifa',
  },
  {
    id: 'vi-ms-ref-zurich-insurance-ai-gov',
    vendorId: 'microsoft',
    type: 'reference_case',
    title: 'Zurich Insurance: AI governance framework for claims automation',
    summary: 'Established a 3-tier approval gate for AI models entering production (sandbox → controlled → production). Reduced model-risk incidents by 40% in first year. Key learning: governance board must include business owners, not just IT.',
    playId: 'play_governance',
    tags: { persona: ['CISO', 'CIO'], stage: ['Production'], industry: ['financial_services'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
  },

  // ────────────────────────────────────────────
  // KPIs (meeting prep "KPIs")
  // ────────────────────────────────────────────
  {
    id: 'vi-ms-kpi-copilot-triage',
    vendorId: 'microsoft',
    type: 'kpi',
    title: 'Copilot for Field Service: avg. 18% faster work-order triage in preview customers',
    summary: 'Based on Microsoft internal preview cohort (n=14 enterprise customers). Measured as median reduction in first-response time for service dispatchers using Copilot-assisted triage.',
    playId: 'play_governance',
    tags: { persona: ['COO', 'CIO'], stage: ['Pilot'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
    focusId: 'schindler',
  },
  {
    id: 'vi-ms-kpi-content-safety',
    vendorId: 'microsoft',
    type: 'kpi',
    title: 'Azure Content Safety: 95%+ accuracy on hate-speech detection across 12 languages',
    summary: 'Benchmark from Microsoft Responsible AI team (public report, 2025). Relevant for governance conversations around content moderation in multi-language environments.',
    playId: 'play_governance',
    tags: { persona: ['CISO', 'CIO'], stage: ['Discovery', 'Pilot'] },
    proprietaryFlag: false,
    sourceType: 'public',
    focusId: 'fifa',
  },
  {
    id: 'vi-ms-kpi-finops-savings',
    vendorId: 'microsoft',
    type: 'kpi',
    title: 'AI workload cost optimization: 25–35% savings achievable with token budget + reserved capacity',
    summary: 'Composite benchmark from 8 enterprise FinOps engagements (sanitized). Savings come from token-budget enforcement (12–18%), reserved instance commitment (8–12%), and anomaly-driven auto-scaling (5–8%).',
    playId: 'play_finops_ai',
    tags: { persona: ['CFO', 'CIO'], stage: ['Production'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
  },

  // ────────────────────────────────────────────
  // PITCH DRILLS (meeting prep "Pitch drills")
  // ────────────────────────────────────────────
  {
    id: 'vi-ms-pitch-governance-ciso',
    vendorId: 'microsoft',
    type: 'pitch_drill',
    title: 'AI Governance readiness — 3 questions for the CISO',
    summary: '1) "What is your current approval gate for AI models entering production?" (reveals maturity). 2) "Who owns the AI risk register today — IT, legal, or business?" (reveals governance gaps). 3) "How do you handle model drift monitoring for production workloads?" (reveals operational readiness).',
    playId: 'play_governance',
    tags: { persona: ['CISO'], stage: ['Discovery'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
    focusId: 'schindler',
  },
  {
    id: 'vi-ms-pitch-finops-cfo',
    vendorId: 'microsoft',
    type: 'pitch_drill',
    title: 'Event-burst FinOps — cost governance for peak-traffic workloads',
    summary: 'Discovery framework for CFO conversations around tournament-scale cloud spend. Lead with: "What percentage of your annual cloud budget is consumed during peak events vs. steady-state?" Then map reserved vs. burst spend ratio to identify optimization corridors.',
    playId: 'play_finops_ai',
    tags: { persona: ['CFO'], stage: ['Discovery'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
    focusId: 'fifa',
  },
  {
    id: 'credo_ai_update_global_2026_02_10_1',
    vendorId: 'credo_ai',
    type: 'update',
    title: 'Credo AI governance workshop packet updated for enterprise onboarding',
    summary: 'Updated enablement packet maps governance ownership and approval checkpoints for cross-functional kickoff conversations.',
    playId: 'play_governance',
    tags: { persona: ['CIO', 'CISO'], stage: ['Discovery', 'Pilot'] },
    proprietaryFlag: true,
    sourceType: 'partner_program_brief',
    weekOf: '2026-02-10',
  },
  {
    id: 'credo_ai_kpi_global_2026_02_10_1',
    vendorId: 'credo_ai',
    type: 'kpi',
    title: 'Governance rollout benchmark: policy-to-control mapping completed in initial sprint',
    summary: 'Enablement benchmark tracks completion of documented policy-to-control mapping during first implementation sprint.',
    playId: 'play_governance',
    tags: { persona: ['CIO', 'CISO'], stage: ['Pilot'] },
    proprietaryFlag: true,
    sourceType: 'partner_program_brief',
    weekOf: '2026-02-10',
  },
  {
    id: 'credo_ai_reference_case_schindler_2026_02_10_1',
    vendorId: 'credo_ai',
    type: 'reference_case',
    title: 'Industrial operations team used phased governance checkpoints before broader AI rollout',
    summary: 'Reference enablement pattern: start with one business workflow, define accountable reviewers, then expand after checkpoint sign-off.',
    playId: 'play_governance',
    tags: { persona: ['CIO', 'COO'], stage: ['Pilot', 'Production'], industry: ['manufacturing'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
    weekOf: '2026-02-10',
    focusId: 'schindler',
  },
  {
    id: 'credo_ai_pitch_drill_schindler_2026_02_10_1',
    vendorId: 'credo_ai',
    type: 'pitch_drill',
    title: 'Governance pitch drill for operations and security alignment',
    summary: 'Lead with three prompts: ownership model, approval path, and escalation path for high-impact model changes.',
    playId: 'play_governance',
    tags: { persona: ['CISO', 'COO'], stage: ['Discovery'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
    weekOf: '2026-02-10',
    focusId: 'schindler',
  },
  {
    id: 'credo_ai_reference_case_fifa_2026_02_10_1',
    vendorId: 'credo_ai',
    type: 'reference_case',
    title: 'Sports event program applied governance controls before fan-facing AI launch',
    summary: 'Reference enablement pattern: align legal, security, and product owners on control gates before peak-event deployment.',
    playId: 'play_governance',
    tags: { persona: ['CIO', 'CISO'], stage: ['Pilot', 'Production'], industry: ['sports_entertainment'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
    weekOf: '2026-02-10',
    focusId: 'fifa',
  },
  {
    id: 'credo_ai_pitch_drill_fifa_2026_02_10_1',
    vendorId: 'credo_ai',
    type: 'pitch_drill',
    title: 'Event governance pitch drill for executive prep',
    summary: 'Use a quick drill around accountability, control evidence, and incident response readiness before go-live decisions.',
    playId: 'play_governance',
    tags: { persona: ['CIO', 'CFO'], stage: ['Discovery'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
    weekOf: '2026-02-10',
    focusId: 'fifa',
  },

  // ────────────────────────────────────────────
  // DEAL CLOSE KITS (SI-grade, longer content)
  // ────────────────────────────────────────────
  {
    id: 'vi-ms-dck-governance',
    vendorId: 'microsoft',
    type: 'deal_close_kit',
    title: 'Deal Close Kit: AI Governance Play',
    summary: `Situation:
- Buying committee conflict between CISO and CIO on AI ownership
- Governance breakthrough when CISO co-owns framework

Key Meeting:
- "Governance Charter" workshop (60 min, CIO + CISO + Head of Data)
- Present draft 3-tier model (sandbox/controlled/production)

Persona Framing:
- CFO: Prevents rework; avoids 60–80% pilot waste
- CISO: Audit shield; evidence of controls
- CIO: Accelerator; 40% faster governed pipelines

Outcomes:
- 40–60% reduction in time-to-production
- 70% fewer security escalations
- 3x improvement in audit readiness

What Not To Do:
- Avoid positioning as compliance checkbox
- Do not lead with tooling before process`,
    playId: 'play_governance',
    tags: { persona: ['CFO', 'CIO', 'CISO'], stage: ['Procurement'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
  },
  {
    id: 'vi-ms-dck-finops',
    vendorId: 'microsoft',
    type: 'deal_close_kit',
    title: 'Deal Close Kit: FinOps for AI Play',
    summary: `Situation:
- CFO wants predictability
- CIO wants flexibility

Unlock:
- Show FinOps governance gives both via budget guardrails + elasticity

Key Meeting:
- "AI Cost Model" workshop (CFO + CIO + Controller)
- Build cost-per-business-outcome model using real Azure data

Persona Framing:
- CFO: 25–35% savings potential, predictable AI spend
- CIO: Stops surprise bills; focuses on scaling
- COO: Tie AI spend to operational KPIs

Outcomes:
- 25–35% AI cloud cost reduction in 6 months
- 90% reduction in cost spikes
- CFO sign-off cycle reduced from 8 to 3 weeks

What Not To Do:
- Avoid generic cost-cutting pitch
- Avoid Azure Advisor tips without business context`,
    playId: 'play_finops_ai',
    tags: { persona: ['CFO', 'CIO', 'COO'], stage: ['Procurement'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
  },

  // ────────────────────────────────────────────
  // APPROVED ARCHITECTURE PATTERNS
  // ────────────────────────────────────────────
  {
    id: 'vi-ms-arch-governance',
    vendorId: 'microsoft',
    type: 'approved_architecture_pattern',
    title: 'Approved Pattern: AI Governance Control Plane',
    summary: `Architecture: Azure Policy + Purview + Defender for Cloud in a hub-spoke model. Guardrails: Token budget per workspace: 500K–2M tokens/day default, escalation at 80% threshold. Model registration gate: all models must pass automated bias/fairness scan (Responsible AI dashboard) before promotion from sandbox to controlled. Data classification: Purview auto-labels sensitive data; AI workloads accessing "Confidential" data require additional approval gate. Retention: Model artifacts retained for 12 months minimum (audit requirement); inference logs retained for 90 days default, extendable to 365. Key design decisions: Hub-spoke preferred over flat-tenant because it isolates AI workloads from general compute (security boundary). Purview chosen over third-party cataloging because it integrates natively with Azure AD conditional access. Tradeoffs: Hub-spoke adds ~15% infrastructure overhead but reduces blast radius of misconfigurations. Auto-labeling has 8–12% false-positive rate on initial deployment; requires 2-week tuning period.`,
    playId: 'play_governance',
    tags: { persona: ['CIO', 'CISO'], stage: ['Pilot', 'Production'] },
    proprietaryFlag: true,
    sourceType: 'partner_program_brief',
  },
  {
    id: 'vi-ms-arch-finops',
    vendorId: 'microsoft',
    type: 'approved_architecture_pattern',
    title: 'Approved Pattern: AI FinOps Instrumentation Layer',
    summary: `Architecture: Azure Cost Management + custom token-metering function + anomaly alerting pipeline. Guardrails: Per-model token budget: configurable per deployment (default 1M tokens/day for GPT-4o, 5M for GPT-4o-mini). Anomaly threshold: alert when hourly consumption exceeds 2x rolling 7-day average. Reserved capacity: recommend 60–70% base reserved, 30–40% on-demand for burst. Auto-scale gating: scale-up approved automatically; scale-down requires 30-min cool-down to prevent thrashing. Key design decisions: Custom metering function (Azure Functions) chosen because native Cost Management token granularity is still in preview. Anomaly pipeline uses Azure Monitor + Logic Apps for alerting (low-code, ops-team-friendly). Tradeoffs: Custom metering adds ~$200/month infrastructure cost but provides real-time visibility vs. 24-hour delay in native reporting. Reserved capacity commitment requires 1-year minimum; recommend starting with 3-month pilot metrics before committing.`,
    playId: 'play_finops_ai',
    tags: { persona: ['CFO', 'CIO'], stage: ['Pilot', 'Production'] },
    proprietaryFlag: true,
    sourceType: 'partner_program_brief',
  },

  // ────────────────────────────────────────────
  // OBJECTION COUNTER PACKS
  // ────────────────────────────────────────────
  {
    id: 'vi-ms-obj-governance',
    vendorId: 'microsoft',
    type: 'objection_counter_pack',
    title: 'Objection Counters: AI Governance Play',
    summary: `CISO: "We already have an AI policy." → Counter: "A policy document is necessary but not sufficient. The question is: do you have enforcement? In our experience, 70% of organizations with policies still have ungoverned shadow-AI usage. A governance control plane makes the policy executable." CIO: "Governance will slow us down." → Counter: "Ungoverned AI is what slows you down — security review blockers, rework, and audit findings. Governed pipelines actually ship 40% faster because they clear security gates automatically." CFO: "We can't justify the investment." → Counter: "Ungoverned AI pilots have a 3x higher failure rate. The governance investment is insurance against wasting your pilot budget — typically 60–80% of pilot spend is at risk without controls."`,
    playId: 'play_governance',
    tags: { persona: ['CISO', 'CIO', 'CFO'], stage: ['Discovery', 'Procurement'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
  },
  {
    id: 'vi-ms-obj-finops',
    vendorId: 'microsoft',
    type: 'objection_counter_pack',
    title: 'Objection Counters: FinOps for AI Play',
    summary: `CFO: "AI costs are too unpredictable to budget." → Counter: "That's exactly the problem FinOps for AI solves. With token budgets and anomaly alerts, you get the same cost predictability as traditional IT — but for AI workloads. Our reference customers achieve 90% reduction in cost surprises." CIO: "We'll handle cost optimization later." → Counter: "AI cost patterns compound fast. Every month without FinOps instrumentation is a month of invisible waste. Our data shows 25–35% savings are achievable, but only if you instrument before scaling — retrofitting is 3x harder." COO: "Our AI spend is still small." → Counter: "Now is the best time to instrument. Setting up FinOps when spend is small takes days; setting it up when spend is large takes months. You're building the muscle before you need it."`,
    playId: 'play_finops_ai',
    tags: { persona: ['CFO', 'CIO', 'COO'], stage: ['Discovery', 'Procurement'] },
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
  },

  // ────────────────────────────────────────────
  // REQUEST ROUTER
  // ────────────────────────────────────────────
  {
    id: 'vi-ms-router-general',
    vendorId: 'microsoft',
    type: 'request_router',
    title: 'Microsoft Partner Desk — request routing guide',
    summary: `For technical architecture reviews: Submit via Partner Center > Technical Presales > "AI Architecture Review" template. Include: customer industry, workload type, expected token volume, data residency requirements. SLA: 3 business days for initial response. For deal registration and incentive queries: Contact your Partner Development Manager (PDM) or submit via Partner Center > Incentives > "Deal Registration." Include: customer name, estimated ACV, timeline, competitive situation. For roadmap briefings (NDA required): Request via your PDM with business justification. Typical turnaround: 2 weeks. For reference customer introductions: Submit via Partner Center > References > "Customer-to-Customer" program. Include: target industry, use case alignment, customer's specific questions.`,
    tags: { persona: ['CIO', 'CFO'], stage: ['Discovery', 'Pilot', 'Procurement'] },
    proprietaryFlag: true,
    sourceType: 'partner_program_brief',
  },

  // ────────────────────────────────────────────
  // CONTACTS (fictional roles, not real people)
  // ────────────────────────────────────────────
  {
    id: 'vi-ms-contact-pdm',
    vendorId: 'microsoft',
    type: 'contact',
    title: 'Partner Development Manager — EMEA Enterprise',
    summary: 'Role: Primary relationship owner for partner program, deal registration, and incentive alignment. Engagement model: Bi-weekly sync + ad-hoc deal support. Contact for: deal registration, incentive questions, executive sponsorship requests.',
    tags: { persona: ['CIO'], stage: ['Discovery', 'Procurement'] },
    proprietaryFlag: true,
    sourceType: 'partner_program_brief',
  },
  {
    id: 'vi-ms-contact-tsa',
    vendorId: 'microsoft',
    type: 'contact',
    title: 'Technical Solutions Architect — AI & Data Platform',
    summary: 'Role: Technical presales support for AI workload architecture, governance design, and FinOps instrumentation. Engagement model: On-request via Partner Center. Contact for: architecture reviews, proof-of-concept design, technical blockers.',
    tags: { persona: ['CIO', 'CISO'], stage: ['Pilot', 'Production'] },
    proprietaryFlag: true,
    sourceType: 'partner_program_brief',
  },
  {
    id: 'vi-ms-contact-csam',
    vendorId: 'microsoft',
    type: 'contact',
    title: 'Customer Success Account Manager — Strategic Accounts',
    summary: 'Role: Post-sale adoption and expansion for strategic accounts. Engagement model: Assigned per account. Contact for: adoption blockers, executive escalation, renewal strategy alignment.',
    tags: { persona: ['CIO', 'COO'], stage: ['Production'] },
    proprietaryFlag: true,
    sourceType: 'partner_program_brief',
  },

  // ────────────────────────────────────────────
  // INCENTIVES
  // ────────────────────────────────────────────
  {
    id: 'vi-ms-incentive-ai-consumed',
    vendorId: 'microsoft',
    type: 'incentive',
    title: 'Azure AI Consumed Revenue Incentive (FY26)',
    summary: 'Not available yet. Structure expected: consumption-based rebate for Azure OpenAI Service workloads exceeding $10K/month ACR. Check Partner Center > Incentives for latest program details.',
    tags: { persona: ['CFO'], stage: ['Procurement'] },
    proprietaryFlag: true,
    sourceType: 'partner_program_brief',
  },
  {
    id: 'vi-ms-incentive-copilot-seats',
    vendorId: 'microsoft',
    type: 'incentive',
    title: 'Microsoft 365 Copilot Seat Expansion Incentive',
    summary: 'Not available yet. Expected to reward partners driving net-new Copilot seat activations above baseline. Typical structure: per-seat bonus for activations in first 90 days. Check Partner Center > Incentives for latest program details.',
    tags: { persona: ['CFO', 'CIO'], stage: ['Procurement'] },
    proprietaryFlag: true,
    sourceType: 'partner_program_brief',
  },

  // ────────────────────────────────────────────
  // ROADMAP POSITIONING NOTE
  // ────────────────────────────────────────────
  {
    id: 'vi-ms-roadmap-ai-gov-tooling',
    vendorId: 'microsoft',
    type: 'roadmap_positioning_note',
    title: 'Roadmap Signal: Native AI governance tooling consolidation (H2 2026)',
    summary: 'Microsoft is expected to consolidate AI governance capabilities across Purview, Defender, and Azure Policy into a unified "AI Governance Center" experience. Positioning note: Current partner implementations using hub-spoke + Purview are directionally aligned. Avoid deep investment in custom governance dashboards that may be superseded. Recommend customers adopt current tooling with modular architecture so they can migrate to native experience when available.',
    playId: 'play_governance',
    tags: { persona: ['CIO', 'CISO'], stage: ['Pilot', 'Production'] },
    proprietaryFlag: true,
    sourceType: 'roadmap_brief',
  },
  {
    id: 'ms-ai-gov-retail-standardization-01',
    vendorId: 'microsoft',
    type: 'deal_close_kit',
    title: 'EU Retail Group – AI Governance Standardization',
    summary: `Situation:
• 14 AI pilots across 6 business units
• Legal raised EU AI Act compliance risk
• CISO blocked further rollout

Unlock:
• Governance-first executive session (CIO + CISO)
• Reframed AI as control problem, not productivity initiative

Microsoft Leverage Used:
• Azure Architecture Review
• Purview data lineage demo
• Regional Microsoft executive sponsor intro

Outcome:
• €2.4M Azure ARR
• 5.1 months to close (forecast was 11 months)
• Enterprise governance charter approved

Replication Rule:
Secure joint CIO/CISO alignment before proposing additional AI expansion.`,
    playId: 'ai-governance',
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
    weekOf: '2026-02-10',
  },
  {
    id: 'ms-ai-gov-manufacturing-recovery-01',
    vendorId: 'microsoft',
    type: 'deal_close_kit',
    title: 'Industrial Manufacturer – AI Risk Recovery',
    summary: `Situation:
• AI assistant deployed without IT oversight
• Data leakage scare triggered board review
• AI program nearly paused

Unlock:
• Security-led reframing: incident = governance gap
• Introduced centralized model registry + audit logging

Microsoft Leverage Used:
• Defender for Cloud AI policies
• Purview compliance controls
• Microsoft compliance SME joined executive call

Outcome:
• €1.3M ARR
• Expanded rollout to 3 production plants
• CISO became co-sponsor

Replication Rule:
When AI fear surfaces, pivot to control architecture, not AI capability.`,
    playId: 'ai-governance',
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
    weekOf: '2026-02-10',
  },
  {
    id: 'ms-finops-ai-banking-stabilization-01',
    vendorId: 'microsoft',
    type: 'deal_close_kit',
    title: 'Tier-2 Bank – AI Cost Stabilization',
    summary: `Situation:
• Token spend volatility >28% month-to-month
• CFO requested cost freeze
• AI roadmap stalled

Unlock:
• FinOps workshop exposed inefficient model allocation
• Introduced reserved capacity alignment

Microsoft Leverage Used:
• Azure cost benchmarking dataset
• FinOps architecture template
• AI consumption rebate alignment

Outcome:
• €1.1M ARR
• 14% margin improvement
• CFO approved continued AI expansion

Replication Rule:
Engage CFO early with volatility modeling, not post-hoc optimization.`,
    playId: 'finops-for-ai',
    proprietaryFlag: true,
    sourceType: 'internal_field_interview_sanitized',
    weekOf: '2026-02-10',
  },
  {
    id: 'ms-ai-gov-enterprise-benchmark-01',
    vendorId: 'microsoft',
    type: 'kpi',
    title: 'Enterprise AI Governance Benchmark',
    summary: `Compliance Impact:
• 42% reduction in audit findings within 12 months
• 31% faster AI approval cycle

Financial Impact:
• 18% reduction in duplicate model spend
• 22% faster pilot-to-enterprise expansion

When to Use:
Quantify governance ROI in CIO/CISO alignment discussions.`,
    playId: 'ai-governance',
    proprietaryFlag: false,
    sourceType: 'public',
    weekOf: '2026-02-10',
  },
  {
    id: 'ms-ai-gov-control-plane-pattern-01',
    vendorId: 'microsoft',
    type: 'approved_architecture_pattern',
    title: 'AI Governance Control Plane Pattern',
    summary: `Core Stack:
• Azure OpenAI (isolated per BU)
• Purview (data lineage + classification)
• Defender for Cloud (policy enforcement)
• Hub-Spoke network isolation

Guardrails:
• Central policy approval before production
• Mandatory model audit logging (12 months)
• Token budgets enforced per BU

When to Use:
Multi-region or regulated AI deployment.

Avoid:
Decentralized OpenAI instances without audit registry.`,
    playId: 'ai-governance',
    proprietaryFlag: false,
    sourceType: 'public',
    weekOf: '2026-02-10',
  },
  {
    id: 'ms-ai-consumption-rebate-01',
    vendorId: 'microsoft',
    type: 'incentive',
    title: 'Azure AI Consumption Rebate',
    summary: `Trigger:
• >$10K monthly Azure AI consumption

Benefit:
• Up to 8% rebate
• Eligible for co-sell acceleration

Action:
Register opportunity via Partner Center before billing cycle.`,
    playId: 'finops-for-ai',
    proprietaryFlag: false,
    sourceType: 'public',
    weekOf: '2026-02-10',
  },
  {
    id: 'ms-ai-architecture-review-request-01',
    vendorId: 'microsoft',
    type: 'request_router',
    title: 'Request Azure AI Architecture Review',
    summary: `Use When:
• Deal >€250K ARR
• Multi-region rollout
• Regulated industry

Required:
• Architecture diagram
• Consumption estimate
• Compliance scope

SLA:
5–7 business days

Unlock:
Faster security approval and executive credibility.`,
    playId: 'ai-governance',
    proprietaryFlag: false,
    sourceType: 'public',
    weekOf: '2026-02-10',
  },
];

// ============= Seed =============

function seedVendorIntel(): void {
  for (const seed of SEEDS) {
    if (!store.find((s) => s.id === seed.id)) {
      store.push(seed);
    }
  }
}

seedVendorIntel();
