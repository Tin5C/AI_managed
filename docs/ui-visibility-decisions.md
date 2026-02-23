# UI Visibility Decisions

## Hidden Components

### Account Intelligence Feed
- **What was hidden:** "Contextual Signals Impacting This Account" section (header, title, horizontal signal cards strip, browse sheet trigger).
- **Why:** Visual noise — executive summary should aggregate signals; the feed competed with primary Deal Planning workspace.
- **How to re-enable:** Set `featureFlags.showAccountIntelligenceFeed = true` in `src/config/featureFlags.ts`.
- **Data impact:** None — underlying signal data, scoring, and executive summary flows remain untouched.
