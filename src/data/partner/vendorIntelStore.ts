// VendorIntelStore — Partner-only in-memory vendor enablement items
// Expanded v2: richer type system, Microsoft proprietary pack (AI Governance + FinOps for AI)
// Backward-compatible: legacy exports preserved for existing Meeting Prep UI.

// ============= Types =============

export type VendorId = 'microsoft' | 'anthropic';

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
    if (i.focusId && i.focusId !== focusId) return false;
    if (!i.focusId) return true; // global vendor items match any focus
    if (vendorId && i.vendorId !== vendorId) return false;
    return true;
  });
}

export function listVendorIntelByFocusAndWeek(
  focusId: string,
  weekOf: string,
  vendorId?: string,
): VendorIntelItem[] {
  return store.filter((i) => {
    if (i.focusId && i.focusId !== focusId) return false;
    if (vendorId && i.vendorId !== vendorId) return false;
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

  // ────────────────────────────────────────────
  // DEAL CLOSE KITS (SI-grade, longer content)
  // ────────────────────────────────────────────
  {
    id: 'vi-ms-dck-governance',
    vendorId: 'microsoft',
    type: 'deal_close_kit',
    title: 'Deal Close Kit: AI Governance Play',
    summary: `Buying committee reality: Deals stall when CISO and CIO disagree on AI model ownership. In 6 of 8 closed deals, the breakthrough was getting the CISO to co-own the governance framework (not just review it). Key meetings: The "Governance Charter" workshop (60 min, CIO + CISO + Head of Data) was the single most effective meeting format. Present a draft charter with 3 tiers (sandbox/controlled/production) and let them redline it — this creates ownership. Persona-specific value framing: For the CFO — "Governance prevents rework: ungoverned AI pilots have a 3x higher failure-to-production rate, wasting 60–80% of pilot investment." For the CISO — "A governance framework is your audit shield: regulators ask for evidence of controls, not perfection." For the CIO — "Governance is the accelerator, not the brake: governed pipelines ship 40% faster because they don't get blocked at security review." Value outcomes: 40–60% reduction in time-to-production for AI workloads. 70% fewer security-review escalations. 3x improvement in audit readiness scores. What did NOT work: Positioning governance as a "compliance checkbox" — buyers disengage. Leading with tooling before process — "We tried selling Purview first and it backfired; process-first, tooling-second."`,
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
    summary: `Buying committee reality: CFO wants predictability; CIO wants flexibility. The unlock is showing that FinOps governance gives both — budget guardrails with automated elasticity. In closed deals, the CFO champion emerged when we showed a "cost per business outcome" model (not cost per resource). Key meetings: The "AI Cost Model" workshop (90 min, CFO + CIO + Finance Controller) where you build a live cost model together. Use their actual Azure consumption data (even partial) to make it real. Persona-specific value framing: For the CFO — "FinOps for AI turns unpredictable AI spend into a managed cost line with 25–35% savings potential and zero performance sacrifice." For the CIO — "Token budgets and anomaly alerts mean your team stops firefighting surprise bills and focuses on scaling what works." For the COO — "Cost-per-transaction visibility lets you tie AI investment directly to operational KPIs like resolution time or throughput." Value outcomes: 25–35% reduction in AI-specific cloud spend within 6 months. 90% reduction in unexpected cost spikes (anomaly detection). CFO sign-off cycle reduced from 8 weeks to 3 weeks when cost model is co-created. What did NOT work: Selling FinOps as "cost cutting" — buyers with growth mandates disengage. Starting with Azure Advisor recommendations without business context — "generic savings tips feel irrelevant to AI-specific spend patterns."`,
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
