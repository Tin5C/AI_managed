// Partner Mode Section — Quick Brief ↔ Deal Planning ↔ Account Intelligence toggle
// Renders all three tabs as a unified execution section on the Partner homepage

import { useState, useEffect } from 'react';
import { Briefcase, Brain, Info, Building2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MeetingPrepSection } from './MeetingPrepSection';
import { DealPlanDriversView } from './DealPlanDriversView';
import { AccountIntelligenceView } from './AccountIntelligenceView';
import { VendorIntelligenceView } from './VendorIntelligenceView';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DEAL_PLAN_TRIGGER_EVENT } from '@/data/partner/dealPlanTrigger';

export type PartnerMode = 'meeting-prep' | 'deal-planning' | 'account-intelligence' | 'vendor-intelligence';

const DEFAULT_FOCUS_ID = 'schindler';

export function PartnerModeSection() {
  const [mode, setMode] = useState<PartnerMode>('meeting-prep');
  const [aiFocusId, setAiFocusId] = useState(DEFAULT_FOCUS_ID);

  // Listen for deal-plan trigger from story viewer or quick brief — only switch mode, do NOT consume context
  useEffect(() => {
    const handler = () => {
      setMode('deal-planning');
    };
    window.addEventListener(DEAL_PLAN_TRIGGER_EVENT, handler);
    return () => window.removeEventListener(DEAL_PLAN_TRIGGER_EVENT, handler);
  }, []);

  const handlePromoteToDealBrief = () => {
    setMode('deal-planning');
  };

  return (
    <section className="space-y-5 pt-4">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-xl bg-muted/50 p-1 border border-border">
          <button
            onClick={() => setMode('meeting-prep')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              mode === 'meeting-prep'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Briefcase className="w-4 h-4" />
            Meeting Prep
          </button>
          <button
            onClick={() => setMode('deal-planning')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              mode === 'deal-planning'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Brain className="w-4 h-4" />
            Deal Planning
          </button>
          <button
            onClick={() => setMode('account-intelligence')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              mode === 'account-intelligence'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Building2 className="w-4 h-4" />
            Account Intelligence
          </button>
          <button
            onClick={() => setMode('vendor-intelligence')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              mode === 'vendor-intelligence'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="w-4 h-4" />
            Vendor Leverage
          </button>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1.5 rounded-md text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/30 transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[260px] text-xs leading-relaxed">
              <p>Some fields auto-fill when CRM and calendar are connected.</p>
              <p className="mt-1 text-muted-foreground">Current results are based on your Dialogue activity.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mode Content */}
      {mode === 'meeting-prep' ? (
        <MeetingPrepSection onOpenDealBrief={handlePromoteToDealBrief} />
      ) : mode === 'deal-planning' ? (
        <div className={cn(
          "rounded-2xl border border-primary/20 bg-primary/[0.02]",
          "p-5 space-y-1"
        )}>
          <p className="text-[11px] text-muted-foreground tracking-wide">Active Deal Workspace</p>
          <DealPlanDriversView onGoToQuickBrief={() => setMode('meeting-prep')} onGoToAccountIntelligence={() => setMode('account-intelligence')} />
        </div>
      ) : mode === 'account-intelligence' ? (
        <AccountIntelligenceView focusId={aiFocusId} onFocusIdChange={setAiFocusId} />
      ) : (
        <VendorIntelligenceView defaultFocusId={aiFocusId} defaultWeekOf="2026-02-10" />
      )}
    </section>
  );
}
