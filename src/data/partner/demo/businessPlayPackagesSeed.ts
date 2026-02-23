// Seed: BusinessPlayPackages for Schindler / play_finops — Executive + Grounded variants (MECE schema)
// Auto-runs on import. Partner-only.

import { seedBusinessPlayPackages, type BusinessPlayPackage } from '../businessPlayPackageStore';
import { listPartnerProfiles } from '../partnerProfileStore';
import { getSignal } from '../signalStore';
import { getAccountSignal } from '../accountSignalStore';

// ---------- Canonical partner name resolution ----------

function resolvePartnerName(): string {
  const profiles = listPartnerProfiles('alpnova');
  if (profiles.length > 0) return profiles[0].partner_name;
  const hw = listPartnerProfiles('helioworks');
  if (hw.length > 0) return hw[0].partner_name;
  return 'Our Practice';
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
    signal_citation_ids: validateCitations([
      'sig-sch-finops-ai',
      'sig-sch-azure-swiss',
      'sig-sch-copilot-field',
      'sig-sch-eu-machinery',
    ]),
    mece: {
      strategic: {
        objective: `Position ${pn} as the FinOps and AI-readiness partner for Schindler's Azure estate, leveraging Swiss data-residency compliance and Copilot field-service automation as the dual entry wedge.`,
        point_of_view: `Schindler needs a partner who can deliver measurable cloud ROI today while building the AI-ready foundation required by 2027. Generic cloud resellers optimise VMs — ${pn} optimises business outcomes across FinOps, data platforms, and applied AI, all within Swiss compliance boundaries.`,
        context: `Azure OpenAI in Swiss North removes the last compliance blocker. EU Machinery Regulation (2027 deadline) creates board-level urgency for AI-augmented field operations.`,
      },
      economic: {
        value_hypothesis: '15-25% Azure cost reduction within 90 days through right-sizing, reserved instances, and anomaly detection.',
        kpis: [
          'Azure cost reduction: 15-25% within 90 days',
          'Copilot adoption rate: >80% active usage in pilot cohort by week 6',
          'Work-order triage time: 20-30% reduction vs. baseline',
          'Compliance certification: Architecture review complete within 30 days',
        ],
        proof: [
          { statement: '15-25% Azure cost reduction within 90 days through right-sizing, reserved instances, and anomaly detection.' },
          { statement: '20-30% faster work-order triage via Copilot-assisted dispatch, freeing 2+ hours per technician per day.' },
          { statement: 'Reduce data-residency audit preparation from weeks to days with pre-certified Azure Swiss North architecture.' },
        ],
      },
      execution: {
        plan: {
          steps: [
            'Lead with a FinOps maturity assessment to quantify cloud cost optimisation potential.',
            'Anchor AI readiness on Azure Swiss North availability — remove data-sovereignty objection.',
            'Propose a 50-technician Copilot pilot for field-service work-order triage.',
            'Use pilot KPIs to build an expansion business case for enterprise rollout.',
          ],
        },
        delivery: [
          { title: 'Discovery Agenda', body: 'Cloud estate walk-through, FinOps tooling audit, AI readiness scoring, field-operations lifecycle, data residency requirements.' },
          { title: 'Workshop Plan', body: 'Current-state mapping → FinOps opportunity sizing → AI use-case prioritisation → Architecture blueprint → Roadmap and governance.' },
          { title: 'Pilot Scope', body: '50 field technicians, Copilot for work-order triage, FinOps dashboard with weekly alerts, Azure Swiss North architecture. 8-week timeline.' },
        ],
      },
      advancement: {
        required_info_from_customer: [
          'Has Schindler engaged any other partner for FinOps or AI readiness?',
          'What is the internal timeline for AI governance framework approval?',
          'Is there an existing FinOps team or centre of excellence?',
          'What is the budget approval process for pilot engagements above CHF 50K?',
          'Are there competing priorities that could delay the pilot start?',
        ],
        objections: [],
      },
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
    signal_citation_ids: validateCitations([
      'sig-sch-finops-ai',
      'sig-sch-ai-governance',
      'sig-sch-azure-swiss',
      'sig-sch-copilot-field',
      'as-seed-schindler-01',
    ]),
    mece: {
      strategic: {
        objective: `Engage Schindler through a FinOps assessment that directly addresses their Azure cost visibility gap, using the results to open a Copilot field-service pilot anchored in their existing work-order triage pain point.`,
        point_of_view: `Schindler has already invested in connected unit infrastructure and a security-first digital culture. The missing piece is a partner who can translate that foundation into measurable AI outcomes — starting with field-service efficiency and cloud cost optimisation — without requiring a new governance framework. ${pn} delivers that bridge.`,
        context: `Schindler's public investments in connected units (ActionBoard, Ahead) signal readiness for AI-augmented field operations. Their 24/7 SOC and RACI-based AI governance mean they will gate any vendor on compliance.`,
      },
      economic: {
        value_hypothesis: 'CHF 200-400K annual Azure cost reduction based on estimated connected-unit data ingestion and IoT workload patterns.',
        kpis: [
          'Azure cost reduction (connected units): CHF 200-400K annually',
          'First-time-fix rate: 10-15% improvement vs. current baseline',
          'Copilot adoption (Service division): >80% daily active usage by week 6',
          'Governance approval time: <2 weeks for AI workload certification',
        ],
        proof: [
          {
            statement: 'CHF 200-400K annual Azure cost reduction based on estimated connected-unit data ingestion and IoT workload patterns.',
            citations: [{ id: 'sig-sch-finops-ai' }],
          },
          {
            statement: '10-15% improvement in first-time-fix rate through Copilot-assisted parts prediction, reducing return visits.',
            citations: [{ id: 'sig-sch-copilot-field' }],
          },
          {
            statement: 'Eliminate 2-3 weeks of compliance review per AI project by pre-certifying on Azure Swiss North within their existing RACI model.',
            citations: [{ id: 'sig-sch-azure-swiss' }, { id: 'sig-sch-ai-governance' }],
          },
        ],
      },
      execution: {
        plan: {
          steps: [
            'Reference their published ActionBoard initiative as evidence of digital service investment appetite.',
            'Use their 24/7 SOC programme to validate security-first positioning — align to their governance model.',
            'Map FinOps savings to the specific Azure subscription structure observed in their Developer Portal documentation.',
            'Propose Copilot pilot scoped to the Service division, which already operates connected IoT units at scale.',
          ],
        },
        delivery: [
          {
            title: 'Discovery Agenda',
            body: 'ActionBoard data pipeline architecture, Service dispatch lifecycle, SOC cloud monitoring, Developer Portal API consumption, AI governance RACI process.',
            citations: [{ id: 'as-seed-schindler-01' }],
          },
          {
            title: 'Workshop Plan',
            body: 'Connected-unit data mapping → FinOps deep-dive (Service division) → Copilot use-case validation → Compliance architecture review → Pilot design and stakeholder sign-off.',
          },
          {
            title: 'Pilot Scope',
            body: '50 field technicians in Swiss Service division, Copilot for work-order triage using ActionBoard alert data, FinOps dashboard scoped to connected-unit subscriptions. Architecture aligned to SOC + RACI model.',
            citations: [{ id: 'sig-sch-copilot-field' }],
          },
        ],
      },
      advancement: {
        required_info_from_customer: [
          'Is the ActionBoard data pipeline fully on Azure, or are there on-premises components?',
          'Has the Service division previously piloted any AI or automation tools for dispatch?',
          'What is the CISO\'s current stance on Azure OpenAI specifically — has it been evaluated?',
          'Are there existing FinOps practices or tools within the Service division\'s Azure subscriptions?',
          'Who owns the P&L for field technician productivity — Service Operations or Digital Transformation?',
        ],
        objections: [],
      },
    },
  };

  return [EXECUTIVE, GROUNDED];
}

seedBusinessPlayPackages(buildPackages());
