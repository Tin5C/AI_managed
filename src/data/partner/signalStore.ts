// Canonical Signal store for Partner space
// Each signal represents a weekly intelligence item for a focus account.

export type SignalType = 'vendor' | 'regulatory' | 'localMarket' | 'competitive' | 'internalActivity';

export interface Signal {
  id: string;
  focusId: string;
  weekOf: string; // ISO date
  type: SignalType;
  title: string;
  whatChanged: string[];
  soWhat: string;
  recommendedAction: string;
  whoCares: string[];
  talkTrack: string;
  proofToRequest: string[];
  whatsMissing: string[];
  confidence: number; // 0-100
  confidenceLabel: string;
  sources: string[];
  createdAt: string;
}

// ============= In-memory store =============

const store: Signal[] = [];

// ============= CRUD =============

export function listSignals(focusId: string, weekOf?: string): Signal[] {
  return store.filter((s) => {
    if (s.focusId !== focusId) return false;
    if (weekOf && s.weekOf !== weekOf) return false;
    return true;
  });
}

export function getSignal(id: string): Signal | null {
  return store.find((s) => s.id === id) ?? null;
}

// ============= Seed: 5 Schindler signals (week 2026-02-10) =============

const SEEDS: Signal[] = [
  {
    id: 'sig-sch-azure-swiss',
    focusId: 'schindler',
    weekOf: '2026-02-10',
    type: 'vendor',
    title: 'Azure OpenAI now available in Switzerland North — removes Schindler\'s data residency objection',
    whatChanged: [
      'Azure OpenAI Service launched in Switzerland North region.',
      'Schindler\'s CISO previously blocked cloud AI pilots citing data-residency.',
    ],
    soWhat: 'The #1 blocker for Schindler AI adoption is now resolved. Partners who lead with Swiss-hosted AI gain first-mover advantage.',
    recommendedAction: 'Request an architecture workshop to map Schindler predictive-maintenance workloads to Azure Switzerland North.',
    whoCares: ['CTO', 'CISO', 'VP Engineering'],
    talkTrack: "Schindler's data-residency concern is now addressed: Azure OpenAI runs in Switzerland North. We can design a predictive-maintenance architecture that keeps all data in-country while leveraging GPT-4o for diagnostics. I'd suggest a 2-hour workshop to map your top 3 use cases to this new capability.",
    proofToRequest: ['Azure Swiss region data-residency confirmation', 'Architecture diagram for Swiss-hosted AI', 'ROI model for predictive maintenance'],
    whatsMissing: ['No existing IoT practice reference', 'Limited predictive-maintenance case studies in DACH'],
    confidence: 82,
    confidenceLabel: 'High',
    sources: ['Microsoft product announcement', 'Schindler IR filing', 'Internal engagement notes'],
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'sig-sch-eu-machinery',
    focusId: 'schindler',
    weekOf: '2026-02-10',
    type: 'regulatory',
    title: 'EU Machinery Regulation mandates digital twins by 2027 — compliance urgency for elevator OEMs',
    whatChanged: [
      'EU Machinery Regulation 2023/1230 enforcement timeline confirmed: digital-twin requirement active from Jan 2027.',
      'Schindler\'s compliance team flagged internal gap analysis.',
    ],
    soWhat: 'Schindler faces a hard regulatory deadline. Partners who can deliver Azure Digital Twins for elevator fleet management gain a compliance-driven entry point.',
    recommendedAction: 'Share a compliance-readiness brief and propose a digital-twin proof-of-concept scoped to one elevator model.',
    whoCares: ['Chief Compliance Officer', 'VP Engineering', 'Head of Product'],
    talkTrack: "The EU Machinery Regulation now requires digital twins for safety-critical equipment by January 2027. Schindler's gap analysis is underway. We can accelerate this with Azure Digital Twins - starting with a single elevator model PoC that maps to the regulation's traceability requirements.",
    proofToRequest: ['EU Machinery Regulation summary brief', 'Digital-twin reference architecture', 'Compliance mapping template'],
    whatsMissing: ['Schindler internal gap-analysis results', 'Clarity on which elevator models are in-scope first'],
    confidence: 75,
    confidenceLabel: 'High',
    sources: ['EU Official Journal', 'Schindler compliance team (indirect)', 'Industry analyst report'],
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'sig-sch-copilot-field',
    focusId: 'schindler',
    weekOf: '2026-02-10',
    type: 'vendor',
    title: 'Copilot for Field Service entered public preview — relevant to Schindler\'s 20K+ technicians',
    whatChanged: [
      'Microsoft Copilot for Field Service entered public preview with work-order summarization and parts prediction.',
      'Schindler operates 20,000+ field technicians globally.',
    ],
    soWhat: 'Field-service AI directly addresses Schindler\'s largest operational cost centre. Early adoption creates stickiness and upsell path into broader Copilot suite.',
    recommendedAction: 'Propose a 50-technician pilot with Copilot for Field Service, focused on work-order triage and parts prediction.',
    whoCares: ['VP Field Operations', 'CTO', 'Head of Digital Transformation'],
    talkTrack: "Copilot for Field Service is now in public preview - it automates work-order summarization and predicts parts needs. With 20K+ technicians, even a 10% efficiency gain saves Schindler millions. A 50-person pilot gives us measurable ROI within one quarter.",
    proofToRequest: ['Copilot for Field Service preview access', 'Pilot scoping template', 'TCO model for field-service AI'],
    whatsMissing: ['Schindler\'s current field-service platform details', 'Integration requirements with existing ERP'],
    confidence: 70,
    confidenceLabel: 'High',
    sources: ['Microsoft Build announcement', 'Schindler annual report', 'Partner channel brief'],
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'sig-sch-finops-ai',
    focusId: 'schindler',
    weekOf: '2026-02-10',
    type: 'internalActivity',
    title: 'FinOps for AI: cost controls + usage monitoring — procurement is scrutinizing unit economics',
    whatChanged: [
      'Schindler procurement introduced mandatory FinOps review for all AI workloads above CHF 50K/year.',
      'Azure Cost Management + AI usage dashboards now available for partner-managed tenants.',
    ],
    soWhat: 'Every AI proposal to Schindler must now include a FinOps component. Partners who proactively include cost governance win procurement\'s trust and reduce deal friction.',
    recommendedAction: 'Include a FinOps-for-AI module in every Schindler proposal — show cost controls, usage caps, and chargeback models upfront.',
    whoCares: ['CFO', 'Head of Procurement', 'CTO'],
    talkTrack: "Schindler's procurement now requires FinOps review for AI spend above CHF 50K. We build cost controls into every engagement: usage caps, chargeback dashboards, and quarterly optimization reviews. This means no surprise invoices and full transparency for your CFO.",
    proofToRequest: ['FinOps-for-AI template', 'Azure Cost Management demo environment', 'Sample chargeback model'],
    whatsMissing: ['Schindler\'s current AI spend baseline', 'Procurement approval workflow details'],
    confidence: 78,
    confidenceLabel: 'High',
    sources: ['Schindler procurement policy update', 'Azure FinOps documentation', 'Partner advisory call'],
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'sig-sch-ai-governance',
    focusId: 'schindler',
    weekOf: '2026-02-10',
    type: 'internalActivity',
    title: 'AI Governance operating model (RACI + approvals) — security is actively gating scope',
    whatChanged: [
      'Schindler\'s security team published an internal AI governance RACI matrix.',
      'All new AI use cases require CISO sign-off + data-classification review before pilot.',
    ],
    soWhat: 'Security is now the gatekeeper for AI expansion at Schindler. Partners who align proposals to the RACI matrix and data-classification framework will move faster through approvals.',
    recommendedAction: 'Request Schindler\'s AI governance RACI and pre-align every proposal to their approval gates.',
    whoCares: ['CISO', 'Chief Compliance Officer', 'CTO', 'VP Engineering'],
    talkTrack: "Schindler now gates every AI use case through a RACI matrix and data-classification review. We've mapped our delivery framework to common governance models - I can show how our approach aligns to each approval gate, so your security team sees us as an accelerator, not a bottleneck.",
    proofToRequest: ['AI governance RACI alignment document', 'Data classification mapping template', 'Security review checklist'],
    whatsMissing: ['Schindler\'s published RACI matrix (request needed)', 'Data classification tier definitions'],
    confidence: 80,
    confidenceLabel: 'High',
    sources: ['Schindler security team (indirect)', 'Industry governance framework', 'Internal engagement notes'],
    createdAt: '2026-02-10T08:00:00Z',
  },

  // ============= FIFA signals (week 2026-02-10) =============

  {
    id: 'sig-fifa-001',
    focusId: 'fifa',
    weekOf: '2026-02-10',
    type: 'internalActivity',
    title: 'FIFA announced a new strategic partnership with the Board of Peace (public)',
    whatChanged: [
      'FIFA signed a strategic partnership with the Board of Peace focused on recovery and peace initiatives.',
      'The partnership creates new governance and communications workflows between FIFA and external stakeholders.',
      'Public announcement signals FIFA leadership\'s willingness to formalise cross-sector collaboration frameworks.',
    ],
    soWhat: 'New external partnerships introduce governance complexity — comms approval workflows, risk escalation paths, and brand alignment controls become execution surfaces for technology partners.',
    recommendedAction: 'Propose a discovery session mapping FIFA\'s partnership governance workflows and identifying where collaboration tooling (approvals, policy enforcement, comms tracking) can reduce manual overhead.',
    whoCares: ['Head of Communications', 'Legal & Compliance', 'Executive Office', 'Procurement', 'Security'],
    talkTrack: 'FIFA\'s new partnerships expand the governance surface — approvals, comms escalation, brand controls all need to scale. We can help map these workflows and identify where automation reduces risk and manual effort.',
    proofToRequest: ['Partnership approval workflow documentation', 'Risk register and comms escalation framework'],
    whatsMissing: ['Internal governance model for external partnerships', 'Technology stack used for partnership management', 'Named workflow owners'],
    confidence: 72,
    confidenceLabel: 'High',
    sources: ['https://inside.fifa.com/media-releases/board-of-peace-strategic-partnership-recovery-peace-gaza'],
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'sig-fifa-002',
    focusId: 'fifa',
    weekOf: '2026-02-10',
    type: 'regulatory',
    title: 'FIFA highlighted its Social Media Protection Service in an EU forum (public)',
    whatChanged: [
      'FIFA presented its Social Media Protection Service at a European Union policy forum.',
      'The service uses AI-based monitoring to detect and flag online abuse targeting players and officials.',
    ],
    soWhat: 'FIFA is operationalising AI-driven content moderation at scale — this creates demand for secure AI infrastructure, data pipeline governance, and compliance alignment with EU digital regulations.',
    recommendedAction: 'Position a technical assessment of FIFA\'s AI content moderation infrastructure — focusing on data pipeline security, model governance, and EU Digital Services Act alignment.',
    whoCares: ['Head of Digital', 'Legal & Compliance', 'CISO', 'VP Technology'],
    talkTrack: 'Your Social Media Protection Service puts AI in a high-visibility, high-regulation context. We can help ensure the underlying infrastructure meets EU compliance requirements while scaling for World Cup volumes.',
    proofToRequest: ['Current AI moderation architecture overview', 'EU Digital Services Act compliance mapping'],
    whatsMissing: ['AI model governance framework details', 'Data residency requirements for moderation data', 'Vendor stack for content moderation'],
    confidence: 70,
    confidenceLabel: 'High',
    sources: ['https://inside.fifa.com/organisation/news/fifa-social-media-protection-service-european-union'],
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'sig-fifa-003',
    focusId: 'fifa',
    weekOf: '2026-02-10',
    type: 'localMarket',
    title: 'FIFA hiring indicates scaling operations for World Cup 2026 (public careers signals)',
    whatChanged: [
      'FIFA careers portal shows increased hiring across technology, operations, and event management roles.',
      'Multiple postings target cloud infrastructure, data engineering, and digital platform capabilities.',
    ],
    soWhat: 'Hiring velocity in technology roles signals active scaling for World Cup 2026 — partners who engage now can shape architecture decisions before vendor lock-in.',
    recommendedAction: 'Use hiring patterns as a conversation opener with FIFA IT leadership — offer capability augmentation for scaling challenges ahead of World Cup 2026.',
    whoCares: ['CTO', 'Head of HR', 'VP Operations', 'Head of Digital'],
    talkTrack: 'Your hiring patterns suggest you\'re scaling technology operations for 2026. We help organisations bridge capability gaps during rapid scaling — especially in cloud infrastructure and data platforms — without long-term headcount commitments.',
    proofToRequest: ['Technology hiring roadmap', 'Capability gap assessment for World Cup 2026 readiness'],
    whatsMissing: ['Specific technology stack decisions for 2026', 'Budget allocation for external partners vs. internal hires'],
    confidence: 65,
    confidenceLabel: 'Medium',
    sources: ['https://jobs.fifa.com', 'https://jobs.fifa.com/en/search-jobs', 'FIFA public careers portal'],
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'sig-fifa-004',
    focusId: 'fifa',
    weekOf: '2026-02-10',
    type: 'competitive',
    title: 'FIFA strategy 2023–2027 emphasizes technology/AI and governance modernization (official strategy doc)',
    whatChanged: [
      'FIFA\'s published 2023–2027 strategy explicitly names technology, AI, and governance modernization as strategic pillars.',
      'The strategy document commits to digital transformation across football development, event delivery, and organisational operations.',
    ],
    soWhat: 'A board-approved strategy anchoring AI and governance creates executive air-cover for technology engagements — proposals aligned to these pillars face less internal resistance.',
    recommendedAction: 'Reference the 2023–2027 strategy pillars in all engagement materials to demonstrate alignment with FIFA\'s stated priorities and reduce stakeholder friction.',
    whoCares: ['Secretary General', 'CTO', 'Chief Digital Officer', 'Head of Strategy'],
    talkTrack: 'Your 2023–2027 strategy names technology and governance modernization as priorities. We can help translate those strategic commitments into executable roadmaps — starting with the areas that deliver measurable impact before 2026.',
    proofToRequest: ['Internal technology roadmap aligned to 2023–2027 strategy', 'Priority use-case list from digital transformation office'],
    whatsMissing: ['Named executive sponsor for technology pillar', 'Budget allocation per strategy pillar', 'Current vendor landscape for AI/data initiatives'],
    confidence: 75,
    confidenceLabel: 'High',
    sources: ['https://digitalhub.fifa.com/m/38577b5ce4c3cc23/original/FIFA-Strategic-Objectives-for-the-Global-Game_2023_2027_EN.pdf'],
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'sig-fifa-005',
    focusId: 'fifa',
    weekOf: '2026-02-10',
    type: 'internalActivity',
    title: 'DATA NEEDED: Confirm Microsoft footprint + cost governance pain points at FIFA',
    whatChanged: [
      'Discovery gap: no confirmed information on FIFA\'s current Microsoft or cloud vendor footprint.',
      'Cost governance posture and procurement workflows for technology engagements are unknown.',
    ],
    soWhat: 'Without confirmed vendor footprint and cost governance context, any proposal risks misalignment. This signal flags the discovery gap explicitly to prioritise information gathering.',
    recommendedAction: 'Schedule a discovery call focused on FIFA\'s current cloud and productivity vendor landscape, cost governance thresholds, and procurement workflow for technology engagements.',
    whoCares: ['CTO', 'Head of Procurement', 'CFO', 'VP Technology'],
    talkTrack: 'Before we can scope a meaningful engagement, we need to understand your current technology vendor landscape and cost governance model. A 30-minute discovery call would let us tailor our approach to your actual environment.',
    proofToRequest: ['Current cloud/productivity vendor contracts summary', 'Cost governance thresholds and approval workflow'],
    whatsMissing: ['Microsoft licensing footprint (M365, Azure, Dynamics)', 'Cloud spend baseline', 'Named procurement contact for technology vendors'],
    confidence: 40,
    confidenceLabel: 'Low',
    sources: ['Internal note: discovery required — no public confirmation of vendor footprint'],
    createdAt: '2026-02-10T08:00:00Z',
  },
];

export function seedSignals(): void {
  for (const seed of SEEDS) {
    if (!store.find((s) => s.id === seed.id)) {
      store.push({ ...seed });
    }
  }
}

seedSignals();
