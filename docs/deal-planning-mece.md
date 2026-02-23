# Deal Planning — MECE Schema

## Overview

Deal Planning uses a strict MECE (Mutually Exclusive, Collectively Exhaustive) schema to structure all deal narrative content. This replaces the legacy section-based approach (Deal Strategy, Positioning, Commercial Assets, Delivery Assets, Enablement, Open Questions).

## Schema Definition

```typescript
interface MECEBlock {
  strategic: {
    objective: string;        // What we're trying to achieve
    point_of_view: string;    // Our differentiated perspective
    context?: string;         // Optional market/timing context
  };
  economic: {
    value_hypothesis: string; // Primary value proposition
    kpis: string[];           // Target metrics (flat strings)
    proof: {                  // Evidence/proof points
      statement: string;
      citations?: CitationRef[];
    }[];
  };
  execution: {
    plan: { steps: string[] };  // Execution steps
    delivery: {                  // Delivery scope items
      title: string;
      body?: string;
      citations?: CitationRef[];
    }[];
  };
  advancement: {
    required_info_from_customer: string[];  // Questions to validate
    objections: {                           // Anticipated objections
      objection: string;
      mitigation?: string;
      citations?: CitationRef[];
    }[];
  };
}
```

## Migration Notes (Option B — legacy keys removed)

Legacy keys **removed** from `BusinessBlock`:
- `deal_strategy` (what/how/why)
- `positioning` (executive_pov, talk_tracks)
- `commercial_assets` (roi_prompts, value_hypotheses, kpis, sizing_inputs)
- `delivery_assets` (discovery_agenda, workshop_plan, pilot_scope)
- `enablement` (seller, engineer)
- `open_questions`

All content migrated deterministically:
- `strategic.objective` ← first primary statement from deal_strategy.what
- `strategic.point_of_view` ← positioning.executive_pov
- `economic.value_hypothesis` ← strongest value hypothesis
- `economic.kpis` ← KPI label + target flattened to strings
- `economic.proof` ← value hypothesis descriptions + existing citations
- `execution.plan.steps` ← deal_strategy.how steps
- `execution.delivery` ← delivery assets summarised as titled items
- `advancement.required_info_from_customer` ← open_questions
- `advancement.objections` ← empty (no deterministic source)

## Executive vs Grounded Rendering

- **Executive**: Concise rendering; citations hidden by default
- **Grounded**: Full rendering with citation badges visible on proof, delivery, and objection items

## Demo Package Fixtures

Located in `src/data/partner/demo/businessPlayPackagesSeed.ts`.

Two variants seeded for Schindler / play_finops:
1. Executive — strategic/C-suite focus
2. Grounded — evidence-backed/practitioner focus

To update fixtures: edit the seed file directly and ensure `signal_citation_ids` reference valid IDs from `signalStore` or `accountSignalStore`.

## Section Order (UI)

The primary Deal Planning view renders a single vertical scroll:
1. **Strategic** — Objective, Point of View, Context (if present)
2. **Economic** — Value Hypothesis, KPIs, Proof
3. **Execution** — Plan, Delivery
4. **Advancement** — Required info from customer, Objections
