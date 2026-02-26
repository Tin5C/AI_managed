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

  // ============= Schindler signals -- LAST WEEK (2026-02-03) =============

  {
    id: 'sig-sch-lw-001',
    focusId: 'schindler',
    weekOf: '2026-02-03',
    type: 'vendor',
    title: 'Microsoft announced Copilot for IoT -- potential fit for Schindler elevator telemetry',
    whatChanged: [
      'Microsoft previewed Copilot for IoT capabilities at an industry event, targeting predictive maintenance scenarios.',
      'Schindler elevator fleet generates telemetry data that could map to the preview sensor-anomaly summarization feature.',
    ],
    soWhat: 'Copilot for IoT aligns directly with Schindler predictive-maintenance aspirations -- early exploration before GA gives partners positioning advantage.',
    recommendedAction: 'Share the Copilot for IoT preview brief with Schindler VP Engineering and propose a telemetry-mapping workshop.',
    whoCares: ['VP Engineering', 'CTO', 'Head of Digital Transformation'],
    talkTrack: 'Microsoft just previewed Copilot for IoT with predictive-maintenance as a lead scenario. Given Schindler telemetry footprint, a mapping session could validate fit before the tool goes GA.',
    proofToRequest: ['Copilot for IoT preview documentation', 'Telemetry architecture overview from Schindler'],
    whatsMissing: ['GA timeline for Copilot for IoT', 'Schindler telemetry data format details'],
    confidence: 65,
    confidenceLabel: 'Medium',
    sources: ['https://azure.microsoft.com/en-us/blog/', 'Internal note: preview-stage -- no GA commitment yet'],
    createdAt: '2026-02-03T08:00:00Z',
  },
  {
    id: 'sig-sch-lw-002',
    focusId: 'schindler',
    weekOf: '2026-02-03',
    type: 'regulatory',
    title: 'Swiss FADP enforcement guidance updated -- data processing obligations clarified for AI workloads',
    whatChanged: [
      'The Swiss Federal Data Protection and Information Commissioner published updated guidance on automated decision-making under the revised FADP.',
      'Guidance clarifies obligations for AI systems processing personal data, including transparency and right-of-explanation requirements.',
    ],
    soWhat: 'Schindler planned AI pilots must now account for FADP transparency obligations -- proposals that include compliance mapping gain procurement credibility.',
    recommendedAction: 'Include FADP compliance mapping as a standard module in all Schindler AI proposals.',
    whoCares: ['Chief Compliance Officer', 'CISO', 'Legal', 'CTO'],
    talkTrack: 'The updated FADP guidance clarifies AI transparency obligations. We can add a compliance-mapping module to every proposal so Schindler legal team sees regulatory alignment from day one.',
    proofToRequest: ['FADP automated decision-making guidance summary', 'Compliance mapping template for AI workloads'],
    whatsMissing: ['Schindler legal team interpretation of FADP requirements for AI', 'Existing data processing register for AI workloads'],
    confidence: 72,
    confidenceLabel: 'High',
    sources: ['https://www.edoeb.admin.ch/edoeb/en/home.html', 'Internal note: guidance published Jan 2026'],
    createdAt: '2026-02-03T08:00:00Z',
  },
  {
    id: 'sig-sch-lw-003',
    focusId: 'schindler',
    weekOf: '2026-02-03',
    type: 'localMarket',
    title: 'Schindler hiring: Senior Cloud Architect and Data Engineering Lead roles posted (public careers)',
    whatChanged: [
      'Schindler careers portal lists new Senior Cloud Architect and Data Engineering Lead positions in Ebikon, Switzerland.',
      'Both roles reference Azure and data platform modernization in the job descriptions.',
    ],
    soWhat: 'Active hiring for cloud and data roles confirms Schindler is investing in platform modernization -- partners can position capability augmentation during the ramp-up period.',
    recommendedAction: 'Reference hiring activity as evidence of platform investment when positioning cloud modernization services.',
    whoCares: ['CTO', 'Head of HR', 'VP Engineering'],
    talkTrack: 'Your recent cloud and data engineering hires signal platform investment. We can augment your team during the ramp-up period -- bridging capability gaps while your hires onboard.',
    proofToRequest: ['Technology hiring roadmap', 'Platform modernization priorities'],
    whatsMissing: ['Reporting line for new hires', 'Timeline for team build-out'],
    confidence: 68,
    confidenceLabel: 'Medium',
    sources: ['https://www.schindler.com/com/internet/en/career.html', 'Schindler public careers portal'],
    createdAt: '2026-02-03T08:00:00Z',
  },
  {
    id: 'sig-sch-lw-004',
    focusId: 'schindler',
    weekOf: '2026-02-03',
    type: 'competitive',
    title: 'Stakeholder statement: Schindler CEO referenced AI-first maintenance at Capital Markets Day',
    whatChanged: [
      'At Schindler Capital Markets Day, the CEO stated the company is pursuing an AI-first maintenance strategy across its global elevator fleet.',
      'The statement was made in the context of long-term cost optimization and service differentiation.',
    ],
    soWhat: 'CEO-level commitment to AI-first maintenance provides executive air-cover for AI proposals -- engagement materials should reference this stated priority.',
    recommendedAction: 'Anchor all AI engagement narratives to the CEO AI-first maintenance commitment for executive alignment.',
    whoCares: ['CEO (indirect)', 'CTO', 'VP Engineering', 'Head of Strategy'],
    talkTrack: 'Your CEO AI-first maintenance commitment at Capital Markets Day gives us a clear mandate. Our proposals are designed to deliver on exactly that vision -- starting with the highest-ROI use cases.',
    proofToRequest: ['Capital Markets Day presentation slides', 'Internal AI roadmap aligned to CEO statement'],
    whatsMissing: ['Specific use cases prioritized under AI-first maintenance', 'Budget allocation for AI-first initiatives'],
    confidence: 74,
    confidenceLabel: 'High',
    sources: ['Internal note: statement attributed to Capital Markets Day -- verify transcript availability'],
    createdAt: '2026-02-03T08:00:00Z',
  },
  {
    id: 'sig-sch-lw-005',
    focusId: 'schindler',
    weekOf: '2026-02-03',
    type: 'internalActivity',
    title: 'Schindler IT consolidating from 3 Azure tenants to 1 -- migration window creates engagement opportunity',
    whatChanged: [
      'Schindler IT shared in a partner briefing that they are consolidating from three Azure Active Directory tenants to one.',
      'The consolidation is targeted for completion by Q3 2026.',
    ],
    soWhat: 'Tenant consolidation is a high-complexity, high-trust engagement. Partners involved in the migration gain deep access to identity, security, and application architecture.',
    recommendedAction: 'Propose migration assessment and identity architecture review as part of the tenant consolidation effort.',
    whoCares: ['CTO', 'CISO', 'Head of IT Infrastructure'],
    talkTrack: 'Consolidating three Azure tenants into one is a critical project -- identity, security policies, and application access all need careful planning. We have delivered similar migrations and can help de-risk the transition.',
    proofToRequest: ['Current tenant architecture overview', 'Migration timeline and scope document'],
    whatsMissing: ['Number of users per tenant', 'Application dependency mapping across tenants'],
    confidence: 70,
    confidenceLabel: 'High',
    sources: ['Internal note: disclosed in partner briefing -- not public'],
    createdAt: '2026-02-03T08:00:00Z',
  },

  // ============= FIFA signals -- LAST WEEK (2026-02-03) =============

  {
    id: 'sig-fifa-lw-001',
    focusId: 'fifa',
    weekOf: '2026-02-03',
    type: 'vendor',
    title: 'Microsoft renewed FIFA partnership as official technology partner through 2030 (public)',
    whatChanged: [
      'Microsoft and FIFA extended their technology partnership through 2030, covering cloud, AI, and fan engagement platforms.',
      'The renewal includes expanded scope for AI-powered match analysis and fan experience technologies.',
    ],
    soWhat: 'A confirmed Microsoft partnership through 2030 validates Azure as the primary cloud platform -- partners aligned to the Microsoft ecosystem have a clear path to FIFA engagements.',
    recommendedAction: 'Reference the Microsoft-FIFA partnership extension in positioning materials and propose Azure-native architectures for all FIFA engagements.',
    whoCares: ['CTO', 'Head of Digital', 'Head of Partnerships', 'VP Technology'],
    talkTrack: 'The Microsoft partnership renewal through 2030 confirms Azure as FIFA strategic platform. Our engagements are designed to build on that foundation -- ensuring every workload leverages the partnership benefits.',
    proofToRequest: ['Partnership scope details', 'Technology roadmap aligned to Microsoft partnership'],
    whatsMissing: ['Specific Azure services covered under the partnership', 'Named Microsoft account team contacts'],
    confidence: 78,
    confidenceLabel: 'High',
    sources: ['https://www.fifa.com/about-fifa/commercial/partners/microsoft', 'Internal note: partnership scope details not fully public'],
    createdAt: '2026-02-03T08:00:00Z',
  },
  {
    id: 'sig-fifa-lw-002',
    focusId: 'fifa',
    weekOf: '2026-02-03',
    type: 'localMarket',
    title: 'FIFA hiring: Head of Data & Analytics and Cloud Platform Engineer posted (public careers)',
    whatChanged: [
      'FIFA careers portal shows new postings for Head of Data & Analytics and Cloud Platform Engineer in Zurich.',
      'Both roles emphasize cloud-native data architectures and AI/ML capabilities.',
    ],
    soWhat: 'Senior data and cloud hires signal FIFA is building internal platform capabilities -- partners can position augmentation and knowledge transfer during the team build-out.',
    recommendedAction: 'Offer capability bridging services for data and analytics while FIFA internal team ramps up.',
    whoCares: ['CTO', 'Head of HR', 'Head of Digital'],
    talkTrack: 'Your Head of Data & Analytics and Cloud Platform Engineer hires show you are building serious internal capability. We can bridge the gap during the hiring cycle -- delivering immediate value while transferring knowledge to your incoming team.',
    proofToRequest: ['Data & analytics team structure plan', 'Cloud platform architecture requirements'],
    whatsMissing: ['Reporting structure for new hires', 'Current data platform vendor stack'],
    confidence: 64,
    confidenceLabel: 'Medium',
    sources: ['https://jobs.fifa.com', 'FIFA public careers portal'],
    createdAt: '2026-02-03T08:00:00Z',
  },
  {
    id: 'sig-fifa-lw-003',
    focusId: 'fifa',
    weekOf: '2026-02-03',
    type: 'regulatory',
    title: 'EU Digital Services Act enforcement wave -- platform obligations relevant to FIFA digital channels',
    whatChanged: [
      'The EU Digital Services Act enforcement entered a new compliance phase with increased scrutiny on large-scale digital platforms.',
      'FIFA digital channels (FIFA+, mobile apps, social media protection service) may fall within scope for content moderation and transparency obligations.',
    ],
    soWhat: 'FIFA expanding digital footprint (FIFA+, apps, social media protection) creates DSA compliance surface -- partners who map obligations to FIFA architecture gain credibility.',
    recommendedAction: 'Propose a DSA compliance assessment for FIFA digital channels, mapping content moderation and transparency obligations to current architecture.',
    whoCares: ['Legal & Compliance', 'Head of Digital', 'CISO', 'VP Technology'],
    talkTrack: 'The DSA enforcement wave means your digital channels -- FIFA+, apps, the Social Media Protection Service -- need compliance mapping. We can assess your current architecture against DSA obligations before regulators do.',
    proofToRequest: ['DSA compliance mapping for digital platforms', 'Content moderation architecture review'],
    whatsMissing: ['FIFA internal DSA compliance assessment status', 'Which channels FIFA considers in-scope'],
    confidence: 66,
    confidenceLabel: 'Medium',
    sources: ['https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package', 'Internal note: FIFA channel scope requires confirmation'],
    createdAt: '2026-02-03T08:00:00Z',
  },
  {
    id: 'sig-fifa-lw-004',
    focusId: 'fifa',
    weekOf: '2026-02-03',
    type: 'competitive',
    title: 'Stakeholder statement: FIFA Secretary General emphasized digital transformation in annual address',
    whatChanged: [
      'The FIFA Secretary General annual address highlighted digital transformation as a core enabler for the 2023-2027 strategy execution.',
      'Specific mention of data-driven decision making and technology partnerships as accelerators.',
    ],
    soWhat: 'Secretary General-level emphasis on digital transformation provides executive sponsorship signal -- proposals framed as strategy enablers face less resistance.',
    recommendedAction: 'Reference the Secretary General digital transformation emphasis in all engagement positioning to demonstrate strategic alignment.',
    whoCares: ['Secretary General (indirect)', 'CTO', 'Chief Digital Officer', 'Head of Strategy'],
    talkTrack: 'The Secretary General emphasis on digital transformation as a strategy enabler gives us a clear mandate. We frame every engagement as a step toward the 2027 goals -- measurable, aligned, and sponsor-ready.',
    proofToRequest: ['Annual address transcript or summary', 'Digital transformation roadmap'],
    whatsMissing: ['Named digital transformation program lead', 'Budget allocation for digital transformation initiatives'],
    confidence: 70,
    confidenceLabel: 'High',
    sources: ['Internal note: attributed to annual address -- verify published summary availability'],
    createdAt: '2026-02-03T08:00:00Z',
  },
  {
    id: 'sig-fifa-lw-005',
    focusId: 'fifa',
    weekOf: '2026-02-03',
    type: 'internalActivity',
    title: 'DATA NEEDED: Confirm FIFA cloud cost governance model and procurement thresholds',
    whatChanged: [
      'Discovery gap: FIFA cloud cost governance model and procurement approval thresholds for technology engagements are unconfirmed.',
      'No public information on FinOps practices or cost management tooling.',
    ],
    soWhat: 'Without cost governance context, proposals risk pricing misalignment. This signal flags the gap to prioritise discovery.',
    recommendedAction: 'Include cost governance discovery questions in the next FIFA engagement -- confirm thresholds, approval workflows, and FinOps maturity.',
    whoCares: ['CFO', 'Head of Procurement', 'CTO'],
    talkTrack: 'Before we finalise our proposal, we would like to understand your cost governance model for cloud spend -- approval thresholds, chargeback structures, and any FinOps tooling you use today. This ensures our pricing model fits your procurement process.',
    proofToRequest: ['Cloud spend governance policy', 'Procurement approval thresholds'],
    whatsMissing: ['FinOps maturity level', 'Cloud spend baseline', 'Named procurement contact'],
    confidence: 35,
    confidenceLabel: 'Low',
    sources: ['Internal note: discovery required -- no public information on FIFA cost governance'],
    createdAt: '2026-02-03T08:00:00Z',
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
