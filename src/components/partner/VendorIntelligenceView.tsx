import { useMemo, useState } from 'react';
import { ChevronDown, ExternalLink, Copy } from 'lucide-react';
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
    <span className="inline-block rounded border border-border/60 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70 bg-muted/30 whitespace-nowrap">
      {label}
    </span>
  );
}

function LeverageCard({ item }: { item: VendorLeverageCardVM }) {
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    const text = [item.title, ...item.bullets, item.detail].filter(Boolean).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="rounded-lg border border-border/40 bg-muted/10 overflow-hidden transition-all">
      {/* Header row */}
      <div className="flex items-start gap-2 px-3 py-2.5">
        <p className="text-xs font-medium text-foreground leading-snug flex-1">{item.title}</p>
        <TypeBadge type={item.type} />
      </div>

      {/* Bullet preview */}
      {item.bullets.length > 0 && (
        <ul className="px-3 pb-1.5 space-y-0.5">
          {item.bullets.slice(0, 3).map((b, i) => (
            <li key={`${item.id}-b-${i}`} className="text-[11px] text-muted-foreground/70 leading-relaxed truncate">
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* Actions row */}
      <div className="flex items-center gap-3 px-3 pb-2.5 pt-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          {open ? 'Hide details' : 'Show details'}
        </button>

        {item.sourceUrl ? (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
          >
            <ExternalLink className="h-3 w-3" /> Open source
          </a>
        ) : (
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
          >
            <Copy className="h-3 w-3" /> Copy key points
          </button>
        )}
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="px-3 pb-3 border-t border-border/30 pt-2">
          <p className="text-[11px] text-muted-foreground/70 whitespace-pre-line leading-relaxed">
            {item.detail}
          </p>
        </div>
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
    <div className="space-y-4">
      {/* Filter strip */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">Vendor</span>
        <select
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value as VendorFilter)}
          className="h-8 rounded-md border border-border/60 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          <option value="microsoft">Microsoft</option>
          <option value="credo_ai">Credo AI</option>
        </select>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {vm.sections.map((section) => (
          <div key={section.id} className="space-y-2">
            <div className="flex items-baseline gap-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80">
                {section.title}
              </h3>
              <span className="text-[10px] text-muted-foreground/50">({section.items.length})</span>
            </div>
            {section.items.length === 0 ? (
              <p className="text-[11px] text-muted-foreground/50 italic">Not available yet.</p>
            ) : (
              <div className="space-y-1.5">
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
