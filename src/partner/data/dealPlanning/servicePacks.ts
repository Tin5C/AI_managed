// Partner-only Service Pack catalog for Recommended Plays scoring
// Does NOT replace existing servicePackStore — used only by propensity engine

export interface PlayServicePack {
  id: string;
  name: string;
  tags: string[];
  bias: 'new_logo' | 'existing_customer' | null;
  motionFit: string[];
  prerequisites: string[];
  effort: 'S' | 'M' | 'L';
  winProfile?: {
    entryEase: 1 | 2 | 3 | 4 | 5;
    politicalComplexity: 1 | 2 | 3 | 4 | 5;
    budgetType: 'existing' | 'new' | 'either';
    primaryStakeholder: 'CIO' | 'CISO' | 'CFO' | 'BU' | 'IT Dir' | 'Mixed';
    pressureTargets: Array<'regulatory' | 'cost' | 'innovation' | 'competitive' | 'operational'>;
    maturityFit: Array<'pilot' | 'scale' | 'optimize'>;
  };
  playContext?: {
    oneLiner: string;
    primaryStakeholder: 'CIO' | 'CISO' | 'CFO' | 'BU' | 'IT Dir' | 'Mixed';
    secondaryStakeholders?: string[];
    entryMotion: 'workshop' | 'assessment' | 'pilot' | 'exec-briefing' | 'cost-review';
    pressureTargets: Array<'regulatory' | 'cost' | 'innovation' | 'competitive' | 'operational'>;
    maturityFit: Array<'pilot' | 'scale' | 'optimize'>;
    discoveryQuestions: string[];
    commonObjections: Array<{ objection: string; answer: string }>;
    proofAssets: Array<{ label: string; type: 'case' | 'deck' | 'demo' | 'workshop'; note?: string }>;
    nextActions: Array<{ label: string; owner: 'partner' | 'customer' }>;
  };
}

export const PLAY_SERVICE_PACKS: PlayServicePack[] = [
  {
    id: 'play_discovery',
    name: 'AI Discovery & Use-Case Sprint',
    tags: ['ai_readiness', 'adoption_change', 'discovery'],
    bias: 'new_logo',
    motionFit: ['Net-New Acquisition', 'Strategic Pursuit', 'Partner-led Introduction'],
    prerequisites: ['Stakeholder alignment', 'Business unit sponsorship'],
    effort: 'S',
    winProfile: {
      entryEase: 5,
      politicalComplexity: 2,
      budgetType: 'either',
      primaryStakeholder: 'BU',
      pressureTargets: ['innovation'],
      maturityFit: ['pilot'],
    },
    playContext: {
      oneLiner: 'Time-boxed discovery sprint to identify and prioritize AI use cases with a clear next-step plan.',
      primaryStakeholder: 'BU',
      secondaryStakeholders: ['CIO', 'IT Dir', 'Product', 'Data'],
      entryMotion: 'workshop',
      pressureTargets: ['innovation', 'competitive'],
      maturityFit: ['pilot'],
      discoveryQuestions: [
        'Which business process has the highest friction or cost today?',
        'Where do teams already use AI informally?',
        'What data sources are critical and who owns them?',
        'What would success look like in 30–60 days?',
      ],
      commonObjections: [
        { objection: "We don't have time for workshops.", answer: 'We keep it short and end with a ranked shortlist + next steps.' },
        { objection: "We're not sure AI is worth it.", answer: 'We validate feasibility and value before any heavy build.' },
      ],
      proofAssets: [
        { label: 'Use-case shortlist template', type: 'workshop' },
        { label: 'Pilot business case one-pager', type: 'deck' },
      ],
      nextActions: [
        { label: 'Confirm 2–3 target processes and success metrics', owner: 'customer' },
        { label: 'Run alignment + use-case workshop', owner: 'partner' },
        { label: 'Deliver prioritized backlog + pilot recommendation', owner: 'partner' },
      ],
    },
  },
  {
    id: 'play_governance',
    name: 'AI Governance Quickstart',
    tags: ['ai_governance', 'security_identity', 'compliance'],
    bias: null,
    motionFit: ['Compliance Upgrade', 'RFP/Tender', 'Competitive Displacement'],
    prerequisites: ['CISO engagement', 'Existing risk framework'],
    effort: 'M',
    winProfile: {
      entryEase: 4,
      politicalComplexity: 4,
      budgetType: 'either',
      primaryStakeholder: 'CISO',
      pressureTargets: ['regulatory', 'operational'],
      maturityFit: ['pilot', 'scale'],
    },
    playContext: {
      oneLiner: 'Establish practical AI governance guardrails that unblock safe adoption.',
      primaryStakeholder: 'CISO',
      secondaryStakeholders: ['CIO', 'Compliance', 'Risk', 'Legal'],
      entryMotion: 'assessment',
      pressureTargets: ['regulatory', 'operational'],
      maturityFit: ['pilot', 'scale'],
      discoveryQuestions: [
        'What AI systems are in use today (official and shadow)?',
        'Which policies exist for data, access, and model usage?',
        'What is the current approval process for AI use cases?',
        'Which risks are most visible to leadership?',
      ],
      commonObjections: [
        { objection: 'Governance will slow innovation.', answer: 'We define minimum viable guardrails that speed safe delivery.' },
        { objection: 'We already have security policies.', answer: 'We map existing controls to AI-specific gaps and workflows.' },
      ],
      proofAssets: [
        { label: 'AI governance starter policy pack', type: 'deck' },
        { label: 'Risk/control mapping worksheet', type: 'workshop' },
      ],
      nextActions: [
        { label: 'Inventory AI use cases + data flows for top scenarios', owner: 'customer' },
        { label: 'Run governance gap assessment + control mapping', owner: 'partner' },
        { label: 'Publish guardrails + lightweight approval workflow', owner: 'partner' },
      ],
    },
  },
  {
    id: 'play_copilot_adoption',
    name: 'Copilot Adoption Accelerator',
    tags: ['m365_copilot', 'adoption_change'],
    bias: 'existing_customer',
    motionFit: ['Upsell', 'Expansion', 'Renewal'],
    prerequisites: ['M365 E3+ licensing', 'Change management sponsor'],
    effort: 'S',
    winProfile: {
      entryEase: 5,
      politicalComplexity: 3,
      budgetType: 'existing',
      primaryStakeholder: 'BU',
      pressureTargets: ['innovation', 'operational', 'cost'],
      maturityFit: ['pilot', 'scale'],
    },
    playContext: {
      oneLiner: 'Drive measurable Copilot adoption with role-based enablement and change management.',
      primaryStakeholder: 'BU',
      secondaryStakeholders: ['CIO', 'IT Dir', 'HR', 'Security'],
      entryMotion: 'pilot',
      pressureTargets: ['innovation', 'operational', 'cost'],
      maturityFit: ['pilot', 'scale'],
      discoveryQuestions: [
        'Which roles will see the biggest productivity gains first?',
        "What's the current M365 readiness and licensing baseline?",
        'Who owns adoption outcomes and training?',
        'What data boundaries must Copilot respect?',
      ],
      commonObjections: [
        { objection: "People won't change how they work.", answer: 'We anchor on role workflows with measurable outcomes.' },
        { objection: 'Security is concerned.', answer: 'We align on permissions hygiene and governance basics early.' },
      ],
      proofAssets: [
        { label: 'Role-based workflow kit', type: 'deck' },
        { label: 'Adoption measurement outline', type: 'demo' },
      ],
      nextActions: [
        { label: 'Select 2–3 priority roles and define KPIs', owner: 'customer' },
        { label: 'Run enablement + adoption sprints', owner: 'partner' },
        { label: 'Expand rollout based on KPI results', owner: 'customer' },
      ],
    },
  },
  {
    id: 'play_rag_prototype',
    name: 'Secure RAG & Agents Prototype',
    tags: ['rag_agents', 'data_platform', 'security_identity'],
    bias: 'new_logo',
    motionFit: ['Strategic Pursuit', 'Net-New Acquisition', 'Transformation Program'],
    prerequisites: ['Data platform access', 'Architecture sponsor'],
    effort: 'L',
    winProfile: {
      entryEase: 3,
      politicalComplexity: 3,
      budgetType: 'either',
      primaryStakeholder: 'CIO',
      pressureTargets: ['innovation', 'competitive', 'operational'],
      maturityFit: ['pilot'],
    },
    playContext: {
      oneLiner: 'Deliver a secure RAG/agents prototype that proves value while respecting identity and data controls.',
      primaryStakeholder: 'CIO',
      secondaryStakeholders: ['IT Dir', 'Security', 'Data', 'BU'],
      entryMotion: 'pilot',
      pressureTargets: ['innovation', 'competitive', 'operational'],
      maturityFit: ['pilot'],
      discoveryQuestions: [
        'Which knowledge workflow is slow or error-prone today?',
        'What are the authoritative data sources and access constraints?',
        'What is the acceptable risk posture for a prototype?',
        'How will we measure success (time, quality, compliance, revenue)?',
      ],
      commonObjections: [
        { objection: 'Data is too sensitive.', answer: 'We start with least-sensitive sources and enforce access + auditability.' },
        { objection: "Prototypes don't scale.", answer: 'We prototype with a scaling path (logging, evaluation, ops basics).' },
      ],
      proofAssets: [
        { label: 'Secure RAG reference architecture', type: 'deck' },
        { label: 'Prototype evaluation checklist', type: 'workshop' },
      ],
      nextActions: [
        { label: 'Select 1–2 target workflows and success criteria', owner: 'customer' },
        { label: 'Confirm data sources + access model', owner: 'customer' },
        { label: 'Deliver prototype + evaluation results', owner: 'partner' },
      ],
    },
  },
  {
    id: 'play_data_modernization',
    name: 'Data Platform Modernization',
    tags: ['data_platform', 'ai_readiness'],
    bias: null,
    motionFit: ['Transformation Program', 'Expansion', 'Strategic Pursuit'],
    prerequisites: ['Existing data landscape documentation', 'Executive sponsorship'],
    effort: 'L',
    winProfile: {
      entryEase: 2,
      politicalComplexity: 5,
      budgetType: 'new',
      primaryStakeholder: 'CIO',
      pressureTargets: ['innovation', 'operational', 'cost'],
      maturityFit: ['scale', 'optimize'],
    },
    playContext: {
      oneLiner: 'Modernize the data platform foundation to enable scalable AI, analytics, and governance.',
      primaryStakeholder: 'CIO',
      secondaryStakeholders: ['IT Dir', 'Data', 'CISO', 'BU'],
      entryMotion: 'assessment',
      pressureTargets: ['innovation', 'operational', 'cost'],
      maturityFit: ['scale', 'optimize'],
      discoveryQuestions: [
        'Where does the current data setup block speed or quality?',
        "What's the top priority: cost, reliability, governance, or agility?",
        'Which domains are highest value and best owned?',
        'What is the migration tolerance and timeline pressure?',
      ],
      commonObjections: [
        { objection: 'This is too big and risky.', answer: 'We phase by domain with value checkpoints and cutover plans.' },
        { objection: 'We already have a lake/warehouse.', answer: 'We focus on outcomes: reliability, governance, AI-ready access.' },
      ],
      proofAssets: [
        { label: 'Roadmap template (phased)', type: 'deck' },
        { label: 'Target architecture outline', type: 'deck' },
      ],
      nextActions: [
        { label: 'Baseline current data landscape + pain points', owner: 'customer' },
        { label: 'Define target architecture + phased roadmap', owner: 'partner' },
        { label: 'Start with one domain pilot + governance baseline', owner: 'partner' },
      ],
    },
  },
  {
    id: 'play_finops',
    name: 'FinOps for AI Workloads',
    tags: ['finops', 'ai_governance'],
    bias: 'existing_customer',
    motionFit: ['Upsell', 'Renewal', 'Expansion'],
    prerequisites: ['Azure consumption baseline', 'Finance stakeholder access'],
    effort: 'S',
    winProfile: {
      entryEase: 5,
      politicalComplexity: 2,
      budgetType: 'existing',
      primaryStakeholder: 'CFO',
      pressureTargets: ['cost', 'operational'],
      maturityFit: ['optimize'],
    },
    playContext: {
      oneLiner: 'Optimize AI/cloud spend and improve cost transparency without slowing delivery.',
      primaryStakeholder: 'CFO',
      secondaryStakeholders: ['CIO', 'FinOps', 'Platform', 'BU'],
      entryMotion: 'cost-review',
      pressureTargets: ['cost', 'operational'],
      maturityFit: ['optimize'],
      discoveryQuestions: [
        'Where is spend concentrated (workloads, teams, subscriptions)?',
        'Is there showback/chargeback and cost accountability?',
        'What drives AI workload costs most (compute, storage, data movement)?',
        "What's the appetite for guardrails vs guidance?",
      ],
      commonObjections: [
        { objection: 'We already track spend.', answer: 'We focus on unit economics and actionable levers, not just reporting.' },
        { objection: 'Controls will slow teams.', answer: 'We prioritize automation and guardrails that preserve velocity.' },
      ],
      proofAssets: [
        { label: 'FinOps assessment checklist', type: 'workshop' },
        { label: 'Savings opportunities summary template', type: 'deck' },
      ],
      nextActions: [
        { label: 'Provide 60–90 days consumption + tagging baseline', owner: 'customer' },
        { label: 'Run cost review + prioritize levers', owner: 'partner' },
        { label: 'Implement guardrails + track savings KPIs', owner: 'partner' },
      ],
    },
  },
  {
    id: 'play_managed_ops',
    name: 'Managed Cloud Operations',
    tags: ['cloud_ops', 'finops'],
    bias: 'existing_customer',
    motionFit: ['Renewal', 'Expansion', 'Cross-sell'],
    prerequisites: ['Azure landing zone', 'Monitoring baseline'],
    effort: 'M',
    winProfile: {
      entryEase: 4,
      politicalComplexity: 3,
      budgetType: 'existing',
      primaryStakeholder: 'IT Dir',
      pressureTargets: ['operational', 'cost'],
      maturityFit: ['scale', 'optimize'],
    },
    playContext: {
      oneLiner: 'Improve reliability and cost efficiency with managed operations, observability, and clear service cadence.',
      primaryStakeholder: 'IT Dir',
      secondaryStakeholders: ['CIO', 'CISO', 'Platform', 'Ops'],
      entryMotion: 'assessment',
      pressureTargets: ['operational', 'cost'],
      maturityFit: ['scale', 'optimize'],
      discoveryQuestions: [
        'Where are the biggest operational pain points (incidents, drift, outages)?',
        'What monitoring/alerting baseline exists today?',
        'Which environments/services are in scope first?',
        'What access and change governance is required?',
      ],
      commonObjections: [
        { objection: 'We can run ops ourselves.', answer: 'We reduce incident load with automation and coverage while keeping control.' },
        { objection: 'We worry about loss of control.', answer: 'We define clear responsibilities, reporting, and escalation paths.' },
      ],
      proofAssets: [
        { label: 'Ops maturity assessment worksheet', type: 'workshop' },
        { label: 'Operating model + SLA template', type: 'deck' },
      ],
      nextActions: [
        { label: 'Confirm in-scope services + current baseline', owner: 'customer' },
        { label: 'Run ops assessment + transition plan', owner: 'partner' },
        { label: 'Launch service review cadence and metrics', owner: 'partner' },
      ],
    },
  },
  {
    id: 'play_competitive_takeout',
    name: 'Competitive Displacement Sprint',
    tags: ['ai_governance', 'security_identity', 'data_platform'],
    bias: 'new_logo',
    motionFit: ['Competitive Displacement', 'RFP/Tender'],
    prerequisites: ['Competitive landscape intel', 'Technical champion'],
    effort: 'M',
    winProfile: {
      entryEase: 3,
      politicalComplexity: 4,
      budgetType: 'either',
      primaryStakeholder: 'CIO',
      pressureTargets: ['competitive', 'regulatory'],
      maturityFit: ['pilot', 'scale'],
    },
    playContext: {
      oneLiner: 'Target an incumbent with a high-value wedge and proof that makes switching feel safe.',
      primaryStakeholder: 'CIO',
      secondaryStakeholders: ['CISO', 'BU', 'Procurement', 'IT Dir'],
      entryMotion: 'assessment',
      pressureTargets: ['competitive', 'regulatory'],
      maturityFit: ['pilot', 'scale'],
      discoveryQuestions: [
        'Where is dissatisfaction with the incumbent (cost, speed, risk, outcomes)?',
        'Which stakeholder is most motivated to change and why now?',
        'What proof would make switching feel safe?',
        'What is the decision process (renewal window, RFP, mandate)?',
      ],
      commonObjections: [
        { objection: 'Switching risk is too high.', answer: 'We start with a wedge and define a low-risk transition plan.' },
        { objection: 'The incumbent is entrenched.', answer: 'We align to a sponsor pain and bring proof against their KPIs.' },
      ],
      proofAssets: [
        { label: 'Competitive positioning template', type: 'deck' },
        { label: 'Wedge demo outline', type: 'demo' },
      ],
      nextActions: [
        { label: 'Collect competitive intel + identify wedge', owner: 'partner' },
        { label: 'Align sponsor + define win criteria', owner: 'customer' },
        { label: 'Deliver wedge proof + transition path', owner: 'partner' },
      ],
    },
  },
  {
    id: 'play_governance_scale',
    name: 'AI Governance for Scalable Deployment',
    tags: ['ai_governance', 'security_identity', 'compliance', 'ai_readiness'],
    bias: null,
    motionFit: ['Strategic Pursuit', 'Compliance Upgrade', 'RFP/Tender', 'Expansion'],
    prerequisites: ['CISO or compliance sponsor', 'Existing AI or cloud workloads'],
    effort: 'M',
    winProfile: {
      entryEase: 3,
      politicalComplexity: 5,
      budgetType: 'new',
      primaryStakeholder: 'CISO',
      pressureTargets: ['regulatory', 'operational'],
      maturityFit: ['scale'],
    },
    playContext: {
      oneLiner: 'Scale AI governance into an operating model that supports multiple teams and audit-ready controls.',
      primaryStakeholder: 'CISO',
      secondaryStakeholders: ['CIO', 'Compliance', 'Risk', 'Legal', 'BU'],
      entryMotion: 'assessment',
      pressureTargets: ['regulatory', 'operational'],
      maturityFit: ['scale'],
      discoveryQuestions: [
        'How many AI initiatives exist and who owns them?',
        'Where do approvals and controls get stuck today?',
        'What audit/reporting obligations must be met?',
        'What tooling/workflows are needed for scalable monitoring?',
      ],
      commonObjections: [
        { objection: 'This will become a long program.', answer: 'We deliver in phases with clear milestones and adoption per domain.' },
        { objection: 'Too many stakeholders.', answer: 'We define RACI and a decision cadence to reduce friction.' },
      ],
      proofAssets: [
        { label: 'Governance operating model template', type: 'deck' },
        { label: 'Control library + workflow blueprint', type: 'deck' },
      ],
      nextActions: [
        { label: 'Define governance org model + decision cadence', owner: 'partner' },
        { label: 'Implement workflows + monitoring approach', owner: 'partner' },
        { label: 'Roll out by domain with reporting cadence', owner: 'customer' },
      ],
    },
  },
];
