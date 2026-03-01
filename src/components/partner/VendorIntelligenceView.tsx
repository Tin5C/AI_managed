import { useMemo, useState } from 'react';
import type { VendorId } from '@/data/partner/vendorIntelStore';
import { resolveVendorLeverage } from "@/services/partner/vendorLeverage/resolver";

type VendorFilter = 'microsoft' | 'credo_ai';

interface VendorIntelligenceViewProps {
  defaultFocusId?: string;
  defaultWeekOf?: string;
}

export function VendorIntelligenceView({
  defaultFocusId,
  defaultWeekOf = '2026-02-10',
}: VendorIntelligenceViewProps) {
  void defaultFocusId;
  void defaultWeekOf;
  const [vendorId, setVendorId] = useState<VendorFilter>('microsoft');
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const vm = useMemo(() => {
    return resolveVendorLeverage(vendorId as VendorId);
  }, [vendorId]);

  const hasItems = vm.sections.some((section) => section.items.length > 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Vendor
          <select
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value as VendorFilter)}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
          >
            <option value="microsoft">Microsoft</option>
            <option value="credo_ai">Credo AI</option>
          </select>
        </label>

      </div>

      {!hasItems ? (
        <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
          Not available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {vm.sections.map((section, index) => (
            <div key={section.id} className="space-y-2">
              <h3 className={index === 0 ? 'text-base font-bold tracking-wide text-foreground' : 'text-sm font-semibold text-foreground'}>{section.title}</h3>
              {section.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">Not available yet.</p>
              ) : (
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.id} className="rounded-md border border-border p-3">
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.bullets.length > 0 && (
                        <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {item.bullets.map((bullet, i) => (
                            <li key={`${item.id}-bullet-${i}`}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedDetails((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                        }
                        className="mt-2 text-xs font-medium text-primary hover:underline"
                      >
                        {expandedDetails[item.id] ? 'Hide details' : 'Show details'}
                      </button>
                      {expandedDetails[item.id] && (
                        <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{item.detail}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
