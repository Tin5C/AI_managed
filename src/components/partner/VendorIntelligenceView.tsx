import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, Copy } from 'lucide-react';
import type { VendorId } from '@/data/partner/vendorIntelStore';
import { resolveVendorLeverage } from "@/services/partner/vendorLeverage/resolver";
import type { VendorLeverageCardVM } from "@/services/partner/vendorLeverage/resolver";
import { toast } from 'sonner';

type VendorFilter = 'microsoft' | 'credo_ai';

interface VendorIntelligenceViewProps {
  defaultFocusId?: string;
  defaultWeekOf?: string;
}

function TypeBadge({ type }: { type: string }) {
  const label = type.replace(/_/g, ' ');
  return (
    <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-muted text-muted-foreground whitespace-nowrap">
      {label}
    </span>
  );
}

function LeverageCard({ item }: { item: VendorLeverageCardVM }) {
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    const text = [item.title, ...item.bullets, item.detail].filter(Boolean).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Key points copied');
  };

  return (
    <div className="rounded-md border border-border bg-background p-3 space-y-1.5">
      <div className="flex items-start gap-2">
        <p className="text-sm font-medium leading-snug flex-1">{item.title}</p>
        <TypeBadge type={item.type} />
      </div>

      {item.bullets.length > 0 && (
        <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-0.5 line-clamp-3">
          {item.bullets.slice(0, 3).map((b, i) => (
            <li key={`${item.id}-b-${i}`}>{b}</li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          {open ? 'Hide details' : 'Show details'}
        </button>

        {item.sourceUrl ? (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline ml-auto"
          >
            <ExternalLink className="h-3 w-3" /> Open source
          </a>
        ) : (
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline ml-auto"
          >
            <Copy className="h-3 w-3" /> Copy key points
          </button>
        )}
      </div>

      {open && (
        <p className="text-xs text-muted-foreground whitespace-pre-line pt-1 border-t border-border/50">
          {item.detail}
        </p>
      )}
    </div>
  );
}

export function VendorIntelligenceView({
  defaultFocusId,
  defaultWeekOf = '2026-02-10',
}: VendorIntelligenceViewProps) {
  void defaultFocusId;
  void defaultWeekOf;
  const [vendorId, setVendorId] = useState<VendorFilter>('microsoft');

  const vm = useMemo(() => resolveVendorLeverage(vendorId as VendorId), [vendorId]);

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

      <div className="space-y-4">
        {vm.sections.map((section) => (
          <div key={section.id} className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              {section.title}{' '}
              <span className="text-muted-foreground font-normal">({section.items.length})</span>
            </h3>
            {section.items.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Not available yet.</p>
            ) : (
              <div className="space-y-2">
                {section.items.map((item) => (
                  <LeverageCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
