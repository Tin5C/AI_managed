// Seed: BusinessPlayPackages for Schindler / play_finops — Executive + Grounded variants
// Auto-runs on import. Partner-only.
// Partner display name derived from canonical partnerProfileStore.

import { seedBusinessPlayPackages, type BusinessPlayPackage } from '../businessPlayPackageStore';
import { listPartnerProfiles } from '../partnerProfileStore';
import { getSignal } from '../signalStore';
import { getAccountSignal } from '../accountSignalStore';

// ---------- Canonical partner name resolution ----------

function resolvePartnerName(): string {
  // Try canonical profile (org_id 'alpnova' is the legacy alias for helioworks)
  const profiles = listPartnerProfiles('alpnova');
  if (profiles.length > 0) return profiles[0].partner_name;
  const hw = listPartnerProfiles('helioworks');
  if (hw.length > 0) return hw[0].partner_name;
  return 'Our Practice'; // stable fallback — never hardcode a brand
}

// ---------- Citation validation ----------

function validateCitations(ids: string[]): string[] {
  return ids.filter((id) => {
    if (getSignal(id)) return true;
    if (getAccountSignal(id)) return true;
    return false;
  });
}

// ---------- Seed data ----------

function buildPackages(): BusinessPlayPackage[] {
  const pn = resolvePartnerName();

  const EXECUTIVE: BusinessPlayPackage = {
    variant: 'executive',
    focus_id: 'schindler',
    play_id: 'play_finops',
    type: 'New Logo',
    motion: 'Strategic Pursuit',
    title: 'FinOps AI Readiness — Executive',
    created_at: '2026-02-19T10:00:00+01:00',
    business: {
      signal_citation_ids: validateCitations([
        'sig-sch-finops-ai',
        'sig-sch-azure-swiss',
        'sig-sch-copilot-field',
        'sig-sch-eu-machinery',
      ]),
      deal_strategy: {
        what: `Position ${pn} as the FinOps and AI-readiness partner for Schindler's Azure estate, leveraging Swiss data-residency compliance and Copilot field-service automation as the dual entry wedge.`,
        how: [
          'Lead with a FinOps maturity assessment to quantify cloud cost optimisation potential.',
          'Anchor AI readiness on Azure Swiss North availability — remove data-sovereignty objection.',
          'Propose a 50-technician Copilot pilot for field-service work-order triage.',
          'Use pilot KPIs to build an expansion business case for enterprise rollout.',
        ],
        why: `Azure OpenAI in Swiss North removes the last compliance blocker. EU Machinery Regulation (2027 deadline) creates board-level urgency for AI-augmented field operations. Schindler's current vendor stack lacks a delivery partner with joint FinOps + AI credentials.`,
      },
      positioning: {
        executive_pov: `Schindler needs a partner who can deliver measurable cloud ROI today while building the AI-ready foundation required by 2027. Generic cloud resellers optimise VMs — ${pn} optimises business outcomes across FinOps, data platforms, and applied AI, all within Swiss compliance boundaries.`,
        talk_tracks: [
          { persona: 'CIO / VP Engineering', message: 'We deliver a unified FinOps + AI roadmap anchored in Azure Swiss North — so you get cost visibility and AI readiness in a single engagement, not two separate vendor relationships.' },
          { persona: 'CFO / Finance', message: 'Our FinOps assessment typically identifies 15-25% cloud cost reduction in the first 90 days. That recovered budget funds the AI pilot at near-zero incremental cost.' },
          { persona: 'CISO', message: 'All data stays in Azure Swiss North. Our governance framework is pre-aligned to ISO 27001 and the EU Machinery Regulation — your compliance review is de-risked from day one.' },
          { persona: 'Procurement', message: 'We scope a fixed-fee FinOps assessment with committed savings targets. The AI pilot is milestone-gated — you only expand what proves ROI.' },
        ],
      },
      commercial_assets: {
        roi_prompts: [
          { label: 'Cloud waste reduction', question: 'What is your current monthly Azure spend, and what percentage do you estimate is idle or over-provisioned?' },
          { label: 'Field productivity', question: 'How many work orders per day does a technician currently handle, and what is the average triage time?' },
          { label: 'Compliance cost', question: 'What is the annual cost of your current data-residency compliance programme for cloud workloads?' },
        ],
        value_hypotheses: [
          { label: 'FinOps savings', description: '15-25% Azure cost reduction within 90 days through right-sizing, reserved instances, and anomaly detection.' },
          { label: 'Technician productivity', description: '20-30% faster work-order triage via Copilot-assisted dispatch, freeing 2+ hours per technician per day.' },
          { label: 'Compliance acceleration', description: 'Reduce data-residency audit preparation from weeks to days with pre-certified Azure Swiss North architecture.' },
        ],
        kpis: [
          { label: 'Azure cost reduction', target: '15-25% within 90 days' },
          { label: 'Copilot adoption rate', target: '>80% active usage in pilot cohort by week 6' },
          { label: 'Work-order triage time', target: '20-30% reduction vs. baseline' },
          { label: 'Compliance certification', target: 'Architecture review complete within 30 days' },
        ],
        sizing_inputs: [
          { label: 'Monthly Azure spend', value: 'Required to baseline FinOps opportunity' },
          { label: 'Number of field technicians', value: 'Required to size Copilot pilot licensing' },
          { label: 'Work-order volume', value: 'Daily/weekly volume to calculate triage improvement' },
          { label: 'Existing M365 licensing', value: 'Determines Copilot add-on cost' },
        ],
      },
      delivery_assets: {
        discovery_agenda: [
          { theme: 'Cloud estate', question: 'Walk us through your current Azure subscription structure and governance model.' },
          { theme: 'Cost visibility', question: 'What FinOps tooling or processes do you have in place today?' },
          { theme: 'AI readiness', question: 'Where are you on the AI adoption curve — experimentation, piloting, or scaling?' },
          { theme: 'Field operations', question: 'Describe the current work-order lifecycle from dispatch to completion.' },
          { theme: 'Data residency', question: 'What are your hard requirements for data residency and sovereignty?' },
        ],
        workshop_plan: [
          { step: 'Current-state mapping', description: 'Map Azure estate, identify cost hotspots and governance gaps.' },
          { step: 'FinOps opportunity sizing', description: 'Quantify savings potential across right-sizing, reservations, and anomaly detection.' },
          { step: 'AI use-case prioritisation', description: 'Score candidate use cases (field service, predictive maintenance, quality) on impact vs. feasibility.' },
          { step: 'Architecture blueprint', description: 'Design target-state architecture on Azure Swiss North with AI integration points.' },
          { step: 'Roadmap and governance', description: 'Define phased delivery plan with milestone gates and success criteria.' },
        ],
        pilot_scope: {
          in_scope: [
            '50 field technicians in a single geographic region',
            'Copilot for work-order triage and parts prediction',
            'FinOps dashboard with weekly cost anomaly alerts',
            'Azure Swiss North data-residency architecture',
          ],
          out_of_scope: [
            'Enterprise-wide Copilot rollout',
            'SAP / ERP integration',
            'Custom ML model development',
            'Multi-cloud strategy',
          ],
          deliverables: [
            'FinOps maturity assessment report with savings roadmap',
            'Copilot pilot deployment (50 users, 8 weeks)',
            'Azure Swiss architecture design document',
            'Pilot ROI report with expansion business case',
          ],
          stakeholders: [
            'VP Engineering (sponsor)',
            'Head of Digital Transformation (champion)',
            'CISO (governance gate)',
            'Head of Procurement (commercial gate)',
          ],
        },
      },
      enablement: {
        seller: [
          'Lead with FinOps savings to fund the AI conversation — never lead with AI alone.',
          'Reference Azure Swiss North GA as the compliance unlock — this removes the #1 objection.',
          'Position the pilot as risk-free: milestone-gated, fixed scope, committed KPIs.',
          'Use the 2027 EU Machinery Regulation deadline to create board-level urgency.',
        ],
        engineer: [
          'Prepare a live FinOps demo using Azure Cost Management + custom Power BI dashboard.',
          'Have an Azure Swiss North architecture reference ready (landing zone + AI services).',
          'Know Copilot for Field Service licensing model and prerequisites.',
        ],
      },
      objection_handling: {
        objections: [
          {
            title: 'We already optimise cloud costs internally',
            preview: 'Internal teams lack cross-workload visibility that a dedicated FinOps framework provides.',
            laer: {
              listen: 'Understood — many enterprises have existing cost-management practices in place.',
              acknowledge: 'Internal optimisation is a strong starting point and shows financial discipline.',
              explore: [
                'How much visibility do you have into idle or over-provisioned resources across all subscriptions?',
                'Are savings targets tracked at the workload level or only at the subscription level?',
              ],
              respond: [
                'A structured FinOps assessment typically uncovers 15-25% additional savings beyond internal efforts by analysing cross-workload patterns.',
                'We complement your team — not replace them — by providing tooling and benchmarks they can own going forward.',
                'The assessment pays for itself within 90 days through identified savings.',
              ],
            },
            proof_anchors: ['Azure Cost Management benchmarking', 'FinOps Foundation maturity model'],
          },
          {
            title: 'AI is not a priority right now',
            preview: 'EU Machinery Regulation 2027 creates a compliance deadline that requires early preparation.',
            laer: {
              listen: 'That makes sense — AI adoption has to align with business priorities.',
              acknowledge: 'Timing is important, and rushing AI without readiness creates risk.',
              explore: [
                'Are you tracking the EU Machinery Regulation 2027 deadline and its implications for AI in field operations?',
              ],
              respond: [
                'We lead with FinOps — immediate, measurable savings — and use that foundation to build AI readiness incrementally.',
                'The 2027 regulatory deadline means preparation needs to start 12-18 months ahead.',
                'A FinOps-first approach delivers value today while positioning you for AI when timing is right.',
              ],
            },
            proof_anchors: ['EU Machinery Regulation timeline', 'Phased FinOps-to-AI roadmap'],
          },
          {
            title: 'Data residency concerns block cloud AI',
            preview: 'Azure Swiss North removes the data-sovereignty blocker for AI workloads.',
            laer: {
              listen: 'Data residency is a critical requirement — especially for regulated industries.',
              acknowledge: 'Swiss data sovereignty is non-negotiable for many enterprise workloads.',
              explore: [
                'Are you aware that Azure OpenAI services are now available in the Swiss North region?',
              ],
              respond: [
                'Azure Swiss North GA means AI workloads run entirely within Swiss borders — no cross-border data transfer.',
                'Our architecture is pre-certified for Swiss data-residency compliance.',
              ],
            },
            proof_anchors: ['Azure Swiss North GA announcement', 'ISO 27001 compliance mapping'],
          },
          {
            title: 'We need to see ROI before committing to a pilot',
            preview: 'The FinOps assessment is designed to deliver measurable savings before any pilot commitment.',
            laer: {
              listen: 'Absolutely — ROI visibility before commitment is a reasonable expectation.',
              acknowledge: 'Pilot investments should be justified by clear business outcomes.',
              explore: [
                'Would a FinOps assessment that identifies concrete savings within 4 weeks satisfy the ROI threshold for pilot approval?',
              ],
              respond: [
                'The FinOps assessment is fixed-fee with committed savings identification — you see the numbers before approving any pilot.',
                'Recovered cloud spend directly funds the Copilot pilot at near-zero incremental cost.',
                'Every deliverable has a milestone gate — you control pace and exposure.',
              ],
            },
            proof_anchors: ['Fixed-fee assessment model', 'Milestone-gated pilot structure'],
          },
          {
            title: 'Our procurement process takes 6+ months',
            preview: 'A scoped assessment engagement can start under existing thresholds.',
            laer: {
              listen: 'Long procurement cycles are common in large enterprises.',
              acknowledge: 'We respect the process — it exists to protect the organisation.',
              explore: [
                'Is there a spending threshold below which engagements can be approved faster — for example, under CHF 50K?',
              ],
              respond: [
                'The FinOps assessment is scoped to fit under typical fast-track thresholds.',
                'Results from the assessment provide the business case to justify the larger pilot through full procurement.',
              ],
            },
          },
        ],
      },
      open_questions: [
        'Has Schindler engaged any other partner for FinOps or AI readiness?',
        'What is the internal timeline for AI governance framework approval?',
        'Is there an existing FinOps team or centre of excellence?',
        'What is the budget approval process for pilot engagements above CHF 50K?',
        'Are there competing priorities that could delay the pilot start?',
      ],
    },
  };

  const GROUNDED: BusinessPlayPackage = {
    variant: 'grounded',
    focus_id: 'schindler',
    play_id: 'play_finops',
    type: 'New Logo',
    motion: 'Strategic Pursuit',
    title: 'FinOps AI Readiness — Grounded',
    created_at: '2026-02-19T10:00:00+01:00',
    business: {
      signal_citation_ids: validateCitations([
        'sig-sch-finops-ai',
        'sig-sch-ai-governance',
        'sig-sch-azure-swiss',
        'sig-sch-copilot-field',
        'as-seed-schindler-01',
      ]),
      deal_strategy: {
        what: `Engage Schindler through a FinOps assessment that directly addresses their Azure cost visibility gap, using the results to open a Copilot field-service pilot anchored in their existing work-order triage pain point.`,
        how: [
          'Reference their published ActionBoard initiative as evidence of digital service investment appetite.',
          'Use their 24/7 SOC programme to validate security-first positioning — align to their governance model.',
          'Map FinOps savings to the specific Azure subscription structure observed in their Developer Portal documentation.',
          'Propose Copilot pilot scoped to the Service division, which already operates connected IoT units at scale.',
        ],
        why: `Schindler's public investments in connected units (ActionBoard, Ahead) signal readiness for AI-augmented field operations. Their 24/7 SOC and RACI-based AI governance mean they will gate any vendor on compliance — ${pn}'s Swiss-hosted, ISO-aligned approach turns this gate into an advantage. No competing partner has delivered a combined FinOps + field-service AI engagement in the Swiss industrial sector.`,
      },
      positioning: {
        executive_pov: `Schindler has already invested in connected unit infrastructure and a security-first digital culture. The missing piece is a partner who can translate that foundation into measurable AI outcomes — starting with field-service efficiency and cloud cost optimisation — without requiring a new governance framework. ${pn} delivers that bridge.`,
        talk_tracks: [
          { persona: 'CIO / VP Engineering', message: 'Your ActionBoard and connected-unit investments have created the data foundation. We help you extract AI value from that foundation — starting with work-order triage — within your existing governance framework.' },
          { persona: 'CFO / Finance', message: 'Based on the scale of your Azure estate supporting connected units, we typically identify CHF 200-400K in annual savings through FinOps optimisation. That funds the Copilot pilot with zero incremental budget.' },
          { persona: 'CISO', message: 'We\'ve reviewed your published security posture — 24/7 SOC, RACI-based access control. Our architecture deploys entirely within Azure Swiss North and aligns to your existing ISO 27001 controls. No new governance overhead.' },
          { persona: 'Procurement', message: 'The FinOps assessment is a 4-week fixed-fee engagement with guaranteed savings identification. The Copilot pilot is scoped to 50 technicians with a go/no-go gate at week 4 — your exposure is capped.' },
        ],
      },
      commercial_assets: {
        roi_prompts: [
          { label: 'Connected-unit scale', question: 'How many connected units does the ActionBoard currently monitor, and what is the monthly data ingestion cost?' },
          { label: 'Field dispatch efficiency', question: 'What is the current first-time-fix rate, and how much does each return visit cost on average?' },
          { label: 'SOC integration cost', question: 'What is the annual cost of your 24/7 SOC, and would consolidating AI workload monitoring reduce that overhead?' },
        ],
        value_hypotheses: [
          { label: 'FinOps savings (grounded)', description: 'CHF 200-400K annual Azure cost reduction based on estimated connected-unit data ingestion and IoT workload patterns.' },
          { label: 'First-time-fix improvement', description: '10-15% improvement in first-time-fix rate through Copilot-assisted parts prediction, reducing return visits.' },
          { label: 'Governance efficiency', description: 'Eliminate 2-3 weeks of compliance review per AI project by pre-certifying on Azure Swiss North within their existing RACI model.' },
        ],
        kpis: [
          { label: 'Azure cost reduction (connected units)', target: 'CHF 200-400K annually' },
          { label: 'First-time-fix rate', target: '10-15% improvement vs. current baseline' },
          { label: 'Copilot adoption (Service division)', target: '>80% daily active usage by week 6' },
          { label: 'Governance approval time', target: '<2 weeks for AI workload certification' },
        ],
        sizing_inputs: [
          { label: 'Connected units monitored', value: 'Number of units on ActionBoard (data volume proxy)' },
          { label: 'Service division headcount', value: 'Field technicians in target region for pilot sizing' },
          { label: 'Current first-time-fix rate', value: 'Baseline metric for Copilot impact measurement' },
          { label: 'Azure subscription count', value: 'Scope for FinOps assessment coverage' },
        ],
      },
      delivery_assets: {
        discovery_agenda: [
          { theme: 'ActionBoard architecture', question: 'What is the data pipeline from connected units to the ActionBoard? Where does data land in Azure?' },
          { theme: 'Service dispatch', question: 'Walk us through a work-order lifecycle in the Service division — from alert to resolution.' },
          { theme: 'SOC integration', question: 'How does your 24/7 SOC currently monitor cloud workloads, and what alerting thresholds are in place?' },
          { theme: 'Developer Portal', question: 'Which APIs from the Developer Portal are most consumed, and by which internal teams?' },
          { theme: 'AI governance', question: 'Describe the RACI approval process for deploying a new AI workload in production.' },
        ],
        workshop_plan: [
          { step: 'Connected-unit data mapping', description: 'Trace data flows from IoT endpoints through ActionBoard to Azure storage and analytics layers.' },
          { step: 'FinOps deep-dive (Service division)', description: 'Analyse Azure spend specifically attributed to connected-unit workloads and field operations.' },
          { step: 'Copilot use-case validation', description: 'Map work-order triage process to Copilot capabilities; identify data prerequisites and gaps.' },
          { step: 'Compliance architecture review', description: 'Validate Azure Swiss North deployment against Schindler\'s SOC monitoring and RACI requirements.' },
          { step: 'Pilot design and stakeholder sign-off', description: 'Define pilot scope, success criteria, and governance gates for Service division deployment.' },
        ],
        pilot_scope: {
          in_scope: [
            '50 field technicians in Swiss Service division',
            'Copilot for work-order triage using ActionBoard alert data',
            'FinOps dashboard scoped to connected-unit Azure subscriptions',
            'Architecture aligned to existing SOC monitoring and RACI model',
          ],
          out_of_scope: [
            'ActionBoard platform re-architecture',
            'Developer Portal API changes',
            'Non-Swiss regions or non-Service divisions',
            'Custom ML models beyond Copilot capabilities',
          ],
          deliverables: [
            'FinOps assessment scoped to connected-unit workloads (CHF savings identified)',
            'Copilot pilot deployment for 50 Service technicians (8 weeks)',
            'Architecture document certified against SOC and RACI requirements',
            'Expansion business case with division-by-division rollout plan',
          ],
          stakeholders: [
            'VP Engineering (executive sponsor, ActionBoard owner)',
            'Head of Digital Transformation (Copilot champion)',
            'CISO (SOC integration and RACI gate)',
            'Head of Service Operations (pilot operational owner)',
          ],
        },
      },
      enablement: {
        seller: [
          'Reference ActionBoard by name — shows you\'ve done account research, not generic pitch.',
          'Quote the 24/7 SOC and RACI model to pre-empt security objections before they\'re raised.',
          'Use "CHF 200-400K" savings range — grounded in connected-unit workload assumptions.',
          'Position the pilot in the Service division specifically — it\'s where IoT data and field operations intersect.',
        ],
        engineer: [
          'Review Schindler Developer Portal APIs before the discovery call — understand their data model.',
          'Prepare a reference architecture showing ActionBoard data flow into Azure AI services.',
          'Be ready to explain Copilot integration with existing ITSM / work-order systems.',
        ],
      },
      objection_handling: {
        objections: [
          {
            title: 'We already have ActionBoard — why do we need more analytics?',
            preview: 'ActionBoard monitors units; FinOps optimises the cloud cost of running that monitoring at scale.',
            laer: {
              listen: 'ActionBoard is clearly a strategic investment — it shows strong digital maturity.',
              acknowledge: 'You\'ve built a solid connected-unit foundation that most competitors lack.',
              explore: [
                'How much of your Azure spend is attributable to ActionBoard data ingestion and processing?',
                'Are there cost anomalies in the IoT data pipeline that are hard to trace today?',
              ],
              respond: [
                'FinOps doesn\'t replace ActionBoard — it ensures you\'re not overpaying for the infrastructure that powers it.',
                'We typically find 15-25% savings in IoT data pipelines through right-sizing and reserved capacity.',
                'Savings recovered from ActionBoard infrastructure directly fund the Copilot pilot.',
              ],
            },
            proof_anchors: ['ActionBoard infrastructure cost analysis', 'IoT workload FinOps patterns'],
            aligned_driver_ids: ['sig-sch-finops-ai'],
          },
          {
            title: 'Our SOC team will block any new AI tooling',
            preview: 'The architecture deploys within existing SOC monitoring — no new security tooling required.',
            laer: {
              listen: 'Security gating is exactly what we\'d expect from an organisation with a 24/7 SOC.',
              acknowledge: 'Your SOC team\'s diligence protects the organisation — that\'s an asset.',
              explore: [
                'Does your SOC currently monitor Azure AI services, or only infrastructure and identity layers?',
              ],
              respond: [
                'Our architecture integrates with your existing Azure Defender and SOC alerting — no new console, no new tooling.',
                'The RACI model you already use extends naturally to AI workload governance.',
                'We provide SOC-ready documentation so your security team can approve with confidence.',
              ],
            },
            proof_anchors: ['SOC integration architecture', 'RACI extension for AI workloads'],
            aligned_driver_ids: ['sig-sch-ai-governance'],
          },
          {
            title: 'Copilot is unproven for field-service use cases',
            preview: 'The pilot is scoped to 50 technicians with a go/no-go gate — exposure is capped.',
            laer: {
              listen: 'Healthy scepticism about new technology in field operations is appropriate.',
              acknowledge: 'Field service is mission-critical — any new tool needs to prove value before scaling.',
              explore: [
                'What would a successful pilot look like for your Service division — what metrics would convince you?',
                'Have your technicians used any AI-assisted tools before, even in adjacent workflows?',
              ],
              respond: [
                'The pilot is milestone-gated: 50 technicians, 8 weeks, with a week-4 go/no-go checkpoint.',
                'We measure first-time-fix rate improvement — a metric your Service division already tracks.',
                'If the pilot doesn\'t meet agreed KPIs, the go/no-go gate prevents further investment.',
              ],
            },
            proof_anchors: ['Milestone-gated pilot design', 'First-time-fix rate benchmarking'],
            aligned_driver_ids: ['sig-sch-copilot-field'],
          },
          {
            title: 'We prefer to work with our existing cloud partner',
            preview: 'This engagement complements existing relationships — FinOps + AI is a specialised capability gap.',
            laer: {
              listen: 'Existing partner relationships represent significant institutional knowledge.',
              acknowledge: 'Continuity with trusted partners is valuable and we respect that.',
              explore: [
                'Does your current partner have a dedicated FinOps practice with Azure AI delivery credentials?',
              ],
              respond: [
                'We don\'t displace existing partners — we fill the FinOps + AI capability gap that generalist partners rarely cover.',
                'The assessment is a standalone engagement that produces value regardless of who delivers the next phase.',
              ],
            },
          },
        ],
      },
      open_questions: [
        'Is the ActionBoard data pipeline fully on Azure, or are there on-premises components?',
        'Has the Service division previously piloted any AI or automation tools for dispatch?',
        'What is the CISO\'s current stance on Azure OpenAI specifically — has it been evaluated?',
        'Are there existing FinOps practices or tools within the Service division\'s Azure subscriptions?',
        'Who owns the P&L for field technician productivity — Service Operations or Digital Transformation?',
      ],
    },
  };

  // ---------- play_governance — Executive ----------

  const GOV_EXECUTIVE: BusinessPlayPackage = {
    variant: 'executive',
    focus_id: 'schindler',
    play_id: 'play_governance',
    type: 'New Logo',
    motion: 'Strategic Pursuit',
    title: 'AI Governance for Scalable Deployment — Executive',
    created_at: '2026-02-19T10:00:00+01:00',
    business: {
      signal_citation_ids: validateCitations([
        'sig-sch-ai-governance',
        'sig-sch-azure-swiss',
        'sig-sch-eu-machinery',
      ]),
      deal_strategy: {
        what: `Position ${pn} as the AI governance partner that enables Schindler to scale AI workloads with confidence — embedding policy, risk controls, and compliance gating into every deployment.`,
        how: [
          'Lead with a governance maturity assessment benchmarked against ISO 42001 and the EU AI Act.',
          'Map Schindler\'s existing RACI model to an AI-specific policy framework with automated guardrails.',
          'Propose a governance-as-code layer on Azure Swiss North to enforce data-residency and model-access controls.',
          'Use pilot governance gates to demonstrate audit-readiness before enterprise AI rollout.',
        ],
        why: `The EU AI Act compliance deadline and 2027 Machinery Regulation create board-level urgency for structured AI governance. Schindler\u2019s 24/7 SOC and RACI culture signal readiness \u2014 they need a framework, not a cultural shift. ${pn} delivers governance-as-code that accelerates AI deployment rather than blocking it.`,
      },
      positioning: {
        executive_pov: `Schindler doesn't have a governance problem \u2014 they have a scaling problem. Without a repeatable AI governance framework, every new use case requires a bespoke compliance review. ${pn} delivers a reusable governance layer that turns weeks of approval into days, unlocking AI velocity across the enterprise.`,
        talk_tracks: [
          { persona: 'CIO / VP Engineering', message: 'We embed governance into your Azure platform so every AI workload deploys with policy controls pre-applied — no separate review cycle, no deployment delays.' },
          { persona: 'CFO / Finance', message: 'Each bespoke AI compliance review costs CHF 50-80K and takes 4-6 weeks. Our governance framework reduces that to under a week per workload — the ROI compounds with every use case you scale.' },
          { persona: 'CISO', message: 'Our framework aligns to ISO 42001 and the EU AI Act out of the box. Policy enforcement is automated through Azure Policy and Defender — your SOC team monitors AI workloads the same way they monitor infrastructure.' },
          { persona: 'Procurement', message: 'The governance assessment is a fixed-fee 3-week engagement. The framework deployment is milestone-gated with clear deliverables — you approve each phase before the next begins.' },
        ],
      },
      commercial_assets: {
        roi_prompts: [
          { label: 'Compliance review cost', question: 'What is the average cost and duration of a compliance review for a new AI workload today?' },
          { label: 'AI pipeline backlog', question: 'How many AI use cases are currently waiting for governance approval before deployment?' },
          { label: 'Regulatory exposure', question: 'What is your current readiness level for EU AI Act and Machinery Regulation compliance?' },
        ],
        value_hypotheses: [
          { label: 'Governance cycle reduction', description: 'Reduce AI workload approval time from 4-6 weeks to under 1 week through automated policy enforcement.' },
          { label: 'Compliance cost savings', description: 'Eliminate CHF 50-80K per bespoke review by deploying a reusable governance framework across all AI workloads.' },
          { label: 'Regulatory readiness', description: 'Achieve EU AI Act and ISO 42001 audit-readiness within 90 days, ahead of enforcement deadlines.' },
        ],
        kpis: [
          { label: 'Governance approval cycle', target: '<5 business days per AI workload' },
          { label: 'Policy coverage', target: '100% of production AI workloads under automated governance' },
          { label: 'Compliance audit readiness', target: 'ISO 42001 self-assessment complete within 90 days' },
          { label: 'Cost per review', target: '>60% reduction vs. current bespoke process' },
        ],
        sizing_inputs: [
          { label: 'AI workloads in production', value: 'Count of deployed models/agents requiring governance' },
          { label: 'Planned AI use cases (12-month pipeline)', value: 'Volume to size framework scalability' },
          { label: 'Current compliance team headcount', value: 'Baseline for efficiency gain calculation' },
          { label: 'Azure subscriptions hosting AI', value: 'Scope for policy-as-code deployment' },
        ],
      },
      delivery_assets: {
        discovery_agenda: [
          { theme: 'Governance maturity', question: 'Describe your current AI governance model — is it centralised, federated, or ad hoc?' },
          { theme: 'Policy enforcement', question: 'How are AI-specific policies enforced today — manual review, Azure Policy, or other tooling?' },
          { theme: 'Regulatory landscape', question: 'What is your current assessment of EU AI Act impact on your product and operations portfolio?' },
          { theme: 'Risk classification', question: 'Do you classify AI workloads by risk tier? If so, what criteria are used?' },
          { theme: 'Audit trail', question: 'How do you currently document model decisions, data lineage, and access controls for audit purposes?' },
          { theme: 'Scaling blockers', question: 'What are the top 3 reasons AI use cases stall between pilot and production today?' },
        ],
        workshop_plan: [
          { step: 'Governance maturity assessment', description: 'Benchmark current AI governance against ISO 42001 and EU AI Act requirements.' },
          { step: 'Risk classification framework', description: 'Define workload risk tiers and map existing AI use cases to appropriate governance levels.' },
          { step: 'Policy-as-code design', description: 'Design Azure Policy rules for automated enforcement of data residency, model access, and audit logging.' },
          { step: 'Approval workflow blueprint', description: 'Redesign approval process with automated gates, reducing manual review to exception-only.' },
          { step: 'Pilot governance deployment', description: 'Apply framework to 2-3 existing AI workloads as proof of concept.' },
        ],
        pilot_scope: {
          in_scope: [
            'Governance maturity assessment (ISO 42001 + EU AI Act)',
            'Risk classification framework for AI workloads',
            'Azure Policy-as-code deployment for 2-3 pilot workloads',
            'Automated approval workflow for standard-risk AI use cases',
          ],
          out_of_scope: [
            'AI model development or retraining',
            'Enterprise-wide policy rollout beyond pilot workloads',
            'Non-Azure cloud governance',
            'Legal interpretation of regulatory requirements',
          ],
          deliverables: [
            'AI governance maturity assessment report with gap analysis',
            'Risk classification framework document',
            'Azure Policy-as-code package deployed to pilot subscriptions',
            'Approval workflow design with SLA targets',
            'Roadmap for enterprise-wide governance rollout',
          ],
          stakeholders: [
            'CISO (executive sponsor)',
            'VP Engineering (AI workload owner)',
            'Head of Compliance (regulatory gate)',
            'Head of Procurement (commercial gate)',
          ],
        },
      },
      enablement: {
        seller: [
          'Lead with the scaling bottleneck — governance is an accelerator, not a blocker.',
          'Quote EU AI Act and Machinery Regulation deadlines to create urgency.',
          'Position the framework as reusable across every future AI use case — compound ROI.',
          'Reference Schindler\'s existing RACI culture as a strength — the framework extends it, not replaces it.',
        ],
        engineer: [
          'Prepare an Azure Policy demo showing automated enforcement of data-residency and model-access rules.',
          'Know the ISO 42001 control structure — map it to Azure Defender and Purview capabilities.',
          'Have a reference architecture for governance-as-code on Azure Swiss North ready.',
        ],
      },
      objection_handling: {
        objections: [
          {
            title: 'We already have a compliance team — why do we need a framework?',
            preview: 'Compliance teams handle reviews; the framework automates repeatable policy enforcement.',
            laer: {
              listen: 'Having a dedicated compliance team is a sign of organisational maturity.',
              acknowledge: 'Your compliance team is essential — a framework amplifies their capacity, not replaces it.',
              explore: [
                'How many hours does your compliance team spend per AI workload review today?',
                'Is the current process repeatable, or does each review start from scratch?',
              ],
              respond: [
                'The framework automates standard-risk approvals so your compliance team focuses on high-risk exceptions.',
                'Each review today costs CHF 50-80K — the framework reduces marginal review cost to near zero.',
                'Your team retains full oversight; they approve the framework rules, not individual workloads.',
              ],
            },
            proof_anchors: ['Governance-as-code automation model', 'Compliance team capacity analysis'],
          },
          {
            title: 'EU AI Act deadlines are uncertain — why invest now?',
            preview: 'Framework readiness takes 6-12 months; waiting creates a compliance scramble.',
            laer: {
              listen: 'Regulatory timelines do shift — that uncertainty is real.',
              acknowledge: 'Investing ahead of confirmed deadlines requires a clear business case.',
              explore: [
                'If the EU AI Act enforcement date is confirmed for 2025/2026, would your current governance model be audit-ready?',
              ],
              respond: [
                'Building a governance framework takes 6-12 months to mature — starting now avoids a compliance scramble.',
                'The framework delivers value today through faster AI deployment, independent of regulatory timing.',
                'Early movers gain competitive advantage — governance readiness becomes a customer trust signal.',
              ],
            },
            proof_anchors: ['EU AI Act implementation timeline', 'Governance maturity curve'],
          },
          {
            title: 'Governance will slow down our AI innovation',
            preview: 'Automated governance accelerates deployment — from 6 weeks to under 5 days per workload.',
            laer: {
              listen: 'Speed of innovation is critical — governance should not become a bottleneck.',
              acknowledge: 'Poorly designed governance does slow teams down — that concern is valid.',
              explore: [
                'How long does it currently take to get an AI workload from pilot approval to production deployment?',
              ],
              respond: [
                'Our framework reduces approval from 4-6 weeks to under 5 business days for standard-risk workloads.',
                'Governance-as-code runs automatically — no manual review queue, no waiting for committee meetings.',
                'Teams that deploy governance early actually ship more AI use cases, not fewer.',
              ],
            },
            proof_anchors: ['Approval cycle benchmarking', 'Governance-as-code deployment model'],
          },
          {
            title: 'We want to wait until we have more AI workloads before standardising',
            preview: 'Retrofitting governance across many workloads is 3-5x more expensive than building it early.',
            laer: {
              listen: 'Standardising too early can feel premature if the workload portfolio is small.',
              acknowledge: 'It makes sense to question whether the investment is justified at current scale.',
              explore: [
                'How many AI use cases are in your 12-month pipeline? Would each one require its own governance review?',
              ],
              respond: [
                'Retrofitting governance across 10+ workloads is 3-5x more expensive than embedding it from the start.',
                'The framework scales automatically — the cost of adding workload #10 is near zero once the framework exists.',
                'Starting with 2-3 pilot workloads proves the model before you scale.',
              ],
            },
          },
        ],
      },
      open_questions: [
        'Does Schindler have a formal AI ethics board or governance committee?',
        'How many AI workloads are currently in production vs. pilot vs. backlog?',
        'Has the CISO evaluated ISO 42001 certification as a strategic objective?',
        'What is the internal timeline for EU AI Act compliance readiness?',
        'Are there existing Azure Policy deployments we can extend rather than replace?',
      ],
    },
  };

  // ---------- play_governance — Grounded ----------

  const GOV_GROUNDED: BusinessPlayPackage = {
    variant: 'grounded',
    focus_id: 'schindler',
    play_id: 'play_governance',
    type: 'New Logo',
    motion: 'Strategic Pursuit',
    title: 'AI Governance for Scalable Deployment — Grounded',
    created_at: '2026-02-19T10:00:00+01:00',
    business: {
      signal_citation_ids: validateCitations([
        'sig-sch-ai-governance',
        'sig-sch-azure-swiss',
        'sig-sch-eu-machinery',
      ]),
      deal_strategy: {
        what: `Engage Schindler through a governance maturity assessment that maps their existing RACI model and 24/7 SOC capabilities to an AI-specific policy framework, removing the approval bottleneck that prevents scaling beyond pilot.`,
        how: [
          'Reference their published RACI-based access-control model as the foundation — extend it, don\'t replace it.',
          'Use the 24/7 SOC programme as evidence they already invest in operational controls — governance-as-code is the natural next layer.',
          'Map the EU Machinery Regulation 2027 deadline to specific AI workloads in their field-service and elevator operations.',
          'Propose a 3-week governance assessment with a concrete deliverable: risk-classified workload inventory with automated approval paths.',
        ],
        why: `Schindler\u2019s 24/7 SOC and RACI model demonstrate governance maturity in infrastructure \u2014 but AI workloads are still approved ad hoc. Each new use case takes 4-6 weeks of bespoke review, creating a backlog that delays AI value realisation. ${pn} bridges this gap with a governance framework grounded in Schindler\u2019s existing controls and deployed on Azure Swiss North.`,
      },
      positioning: {
        executive_pov: `Schindler\u2019s security-first culture is an asset, not a constraint. The challenge is extending that culture to AI workloads without creating a bottleneck. ${pn} delivers a governance framework that embeds AI policy enforcement into the same Azure infrastructure your SOC already monitors \u2014 scaling AI becomes an operational process, not a project.`,
        talk_tracks: [
          { persona: 'CIO / VP Engineering', message: 'Your RACI model works for infrastructure. We extend it to AI workloads — same governance culture, new policy layer, automated enforcement. No new committee, no new process.' },
          { persona: 'CFO / Finance', message: 'Every AI use case stuck in governance review is deferred value. Our framework processes standard-risk workloads in under a week — at a fraction of the CHF 50-80K you spend on each bespoke review today.' },
          { persona: 'CISO', message: 'We build on your 24/7 SOC and existing Azure Defender deployment. AI governance policies are enforced through Azure Policy — your team monitors them through the same console, same alerting, same RACI.' },
          { persona: 'Procurement', message: 'The governance assessment is a 3-week fixed-fee engagement with a documented deliverable: your AI workload risk classification and automated approval workflow design. Go/no-go for framework deployment is yours.' },
        ],
      },
      commercial_assets: {
        roi_prompts: [
          { label: 'Approval backlog', question: 'How many AI use cases are currently pending governance approval, and what is the estimated business value deferred?' },
          { label: 'Review cost per workload', question: 'What does a typical bespoke AI compliance review cost in internal hours and external advisory fees?' },
          { label: 'SOC monitoring scope', question: 'Does your 24/7 SOC currently monitor AI-specific workloads, or only infrastructure and identity?' },
        ],
        value_hypotheses: [
          { label: 'Approval velocity (grounded)', description: 'Reduce AI workload approval from 4-6 weeks to under 5 business days by automating standard-risk classification and policy enforcement.' },
          { label: 'Review cost elimination', description: 'Replace CHF 50-80K bespoke reviews with a reusable framework — marginal cost per additional workload approaches zero.' },
          { label: 'SOC integration efficiency', description: 'Add AI workload governance to existing SOC monitoring at minimal incremental cost — no new tooling, no new team.' },
        ],
        kpis: [
          { label: 'Governance approval cycle', target: '<5 business days for standard-risk AI workloads' },
          { label: 'Policy automation coverage', target: '100% of pilot AI workloads under Azure Policy enforcement' },
          { label: 'Regulatory gap closure', target: 'EU AI Act gap assessment complete within 3 weeks' },
          { label: 'Cost per governance review', target: '>60% reduction vs. current bespoke process' },
          { label: 'SOC AI monitoring', target: 'AI workloads visible in existing SOC dashboard within pilot' },
        ],
        sizing_inputs: [
          { label: 'AI workloads pending approval', value: 'Backlog count to quantify deferred value' },
          { label: 'Current review cost per workload', value: 'Internal + external hours for baseline ROI' },
          { label: 'SOC alert volume', value: 'Current infrastructure alert baseline to size AI monitoring overhead' },
          { label: 'Azure Policy deployment scope', value: 'Subscriptions and resource groups for pilot targeting' },
        ],
      },
      delivery_assets: {
        discovery_agenda: [
          { theme: 'RACI model', question: 'Walk us through how your RACI model applies to a new cloud workload deployment today — who approves, who reviews, who is informed?' },
          { theme: 'SOC coverage', question: 'What does your 24/7 SOC monitor today — infrastructure only, or does it include application-layer and data-access events?' },
          { theme: 'AI workload inventory', question: 'How many AI models or agents are in production? How many are in pilot or backlog waiting for approval?' },
          { theme: 'Policy tooling', question: 'Are you using Azure Policy, Defender for Cloud, or Purview today? If so, what policy sets are deployed?' },
          { theme: 'Regulatory mapping', question: 'Has your compliance team mapped EU AI Act risk categories to your current AI workload portfolio?' },
          { theme: 'Governance bottleneck', question: 'What is the single biggest reason an AI use case stalls between pilot and production approval?' },
          { theme: 'Audit requirements', question: 'What evidence does your internal or external auditor require for AI workload compliance sign-off?' },
        ],
        workshop_plan: [
          { step: 'RACI-to-AI mapping', description: 'Extend the existing RACI model to cover AI-specific roles: model owner, data steward, risk assessor, deployment approver.' },
          { step: 'Workload risk classification', description: 'Classify current and planned AI workloads into risk tiers using EU AI Act criteria and Schindler-specific operational risk factors.' },
          { step: 'Policy-as-code design (SOC-aligned)', description: 'Design Azure Policy rules that integrate with existing SOC alerting — AI governance events flow to the same console.' },
          { step: 'Approval workflow optimisation', description: 'Redesign the approval process: automated fast-track for standard-risk, manual deep-review only for high-risk workloads.' },
          { step: 'Pilot deployment and SOC integration', description: 'Deploy governance framework on 2-3 AI workloads; validate SOC monitoring integration and approval cycle time.' },
          { step: 'Scaling roadmap', description: 'Document framework extension plan for remaining AI workloads with effort estimates and dependency mapping.' },
        ],
        pilot_scope: {
          in_scope: [
            'Governance maturity assessment mapped to Schindler RACI model',
            'EU AI Act risk classification for current AI workload portfolio',
            'Azure Policy-as-code deployment for 2-3 pilot AI workloads',
            'SOC monitoring integration for AI governance events',
            'Automated approval workflow for standard-risk workloads',
          ],
          out_of_scope: [
            'AI model development, retraining, or performance tuning',
            'SOC re-architecture or tooling replacement',
            'Non-Azure cloud governance',
            'Legal advisory on regulatory interpretation',
            'Enterprise-wide rollout beyond pilot scope',
          ],
          deliverables: [
            'Governance maturity assessment with RACI-mapped gap analysis',
            'AI workload risk classification inventory (EU AI Act aligned)',
            'Azure Policy-as-code package deployed and SOC-integrated',
            'Optimised approval workflow with measured cycle-time improvement',
            'Enterprise scaling roadmap with effort estimates',
          ],
          stakeholders: [
            'CISO (executive sponsor, SOC owner)',
            'VP Engineering (AI workload portfolio owner)',
            'Head of Compliance (EU AI Act regulatory gate)',
            'Head of Procurement (commercial and contract gate)',
          ],
        },
      },
      enablement: {
        seller: [
          'Reference the RACI model and 24/7 SOC by name — it signals account-level research and builds credibility.',
          'Frame governance as an accelerator: "Your security culture is an asset — we help you extend it to AI without slowing down."',
          'Use the EU AI Act 2025/2027 deadlines and Machinery Regulation as urgency drivers.',
          'Position the 3-week assessment as low-risk, high-signal: fixed fee, concrete deliverable, go/no-go gate.',
        ],
        engineer: [
          'Review Schindler\'s published SOC and compliance documentation before discovery.',
          'Prepare a demo showing Azure Policy enforcement for AI workloads with SOC alert integration.',
          'Know the ISO 42001 control mapping to Azure Defender and Purview — be ready to walk through it.',
        ],
      },
      objection_handling: {
        objections: [
          {
            title: 'Our RACI model already covers AI governance',
            preview: 'RACI defines roles; it does not automate policy enforcement or risk classification.',
            laer: {
              listen: 'Your RACI model is well-established — it clearly defines accountability.',
              acknowledge: 'RACI is a strong foundation and we build on it rather than replace it.',
              explore: [
                'Does your current RACI model include AI-specific roles like model owner or data steward?',
                'How are AI workloads classified by risk tier within the existing framework?',
              ],
              respond: [
                'RACI defines who is responsible — governance-as-code defines what is automatically enforced.',
                'We extend your RACI with AI-specific roles and automated policy gates — same culture, new capability.',
                'Without automated enforcement, each AI workload still requires manual review against the RACI matrix.',
              ],
            },
            proof_anchors: ['RACI-to-AI governance mapping', 'Azure Policy automation model'],
            aligned_driver_ids: ['sig-sch-ai-governance'],
          },
          {
            title: 'Our SOC cannot absorb more monitoring scope',
            preview: 'AI governance events flow through existing Azure Defender — no new tooling or console.',
            laer: {
              listen: 'SOC capacity is finite — adding scope without resources is a real concern.',
              acknowledge: 'Your 24/7 SOC team is already managing a significant monitoring surface.',
              explore: [
                'What percentage of SOC alerts today are actionable vs. noise?',
              ],
              respond: [
                'AI governance events integrate into your existing Azure Defender console — no new tool, no new dashboard.',
                'Policy-as-code reduces alert noise by preventing non-compliant deployments before they trigger alerts.',
                'We size the monitoring overlay to add <5% to current SOC alert volume.',
              ],
            },
            proof_anchors: ['SOC integration architecture', 'Alert volume impact analysis'],
            aligned_driver_ids: ['sig-sch-ai-governance'],
          },
          {
            title: 'ISO 42001 certification is not on our roadmap',
            preview: 'The framework aligns to ISO 42001 controls regardless of certification intent — it is a best-practice baseline.',
            laer: {
              listen: 'Not every organisation needs formal certification — business context matters.',
              acknowledge: 'Certification is a strategic decision that depends on customer and regulatory requirements.',
              explore: [
                'Do your enterprise customers or regulators ask about AI governance maturity in procurement or audit processes?',
              ],
              respond: [
                'The framework uses ISO 42001 controls as a best-practice baseline — you get the benefit without committing to certification.',
                'If certification becomes relevant later, you are already 80% of the way there.',
                'Governance maturity is increasingly a competitive differentiator in enterprise sales.',
              ],
            },
            proof_anchors: ['ISO 42001 control framework', 'Enterprise customer governance expectations'],
          },
          {
            title: 'We tried governance automation before and it was too rigid',
            preview: 'Policy-as-code supports exception paths — standard-risk is automated, high-risk gets human review.',
            laer: {
              listen: 'Past experience with rigid automation creates justified caution.',
              acknowledge: 'Governance automation that blocks legitimate work is worse than no automation.',
              explore: [
                'What specifically caused rigidity in the previous approach — was it the rules, the tooling, or the exception process?',
              ],
              respond: [
                'Our framework separates standard-risk (automated fast-track) from high-risk (human review) — it is not all-or-nothing.',
                'Exception paths are built in — teams can request expedited review for edge cases without bypassing controls.',
                'Policy rules are version-controlled and auditable — your team can adjust thresholds as they learn.',
              ],
            },
            aligned_driver_ids: ['sig-sch-ai-governance'],
          },
          {
            title: 'Legal should lead AI governance, not a technology partner',
            preview: 'Legal defines policy intent; the technology partner implements enforcement and monitoring.',
            laer: {
              listen: 'Legal ownership of governance policy is appropriate and expected.',
              acknowledge: 'Policy intent must come from legal and compliance — technology partners should not define policy.',
              explore: [
                'Does your legal team have the Azure-specific technical depth to implement policy enforcement in the cloud platform?',
              ],
              respond: [
                'Legal defines the rules; we implement automated enforcement in Azure — each team plays to its strength.',
                'Our deliverable includes policy documentation in legal-readable format alongside technical implementation.',
                'The framework gives legal real-time compliance visibility without requiring them to learn Azure tooling.',
              ],
            },
            proof_anchors: ['Legal-technical collaboration model', 'Policy documentation templates'],
          },
        ],
      },
      open_questions: [
        'Has the CISO or compliance team formally evaluated ISO 42001 as a certification target?',
        'Are AI workload approvals currently managed through the same RACI process as infrastructure, or a separate path?',
        'Does the 24/7 SOC have capacity to absorb AI-specific governance alerting without additional headcount?',
        'Has Schindler engaged external advisory on EU AI Act classification for their elevator/escalator products?',
        'What is the internal appetite for governance-as-code vs. manual policy enforcement?',
      ],
    },
  };

  return [EXECUTIVE, GROUNDED, GOV_EXECUTIVE, GOV_GROUNDED];
}

seedBusinessPlayPackages(buildPackages());
