// Capability & Brand Snapshot Card
// Entry point card for Partner homepage

import { useState } from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CapabilitySnapshotModal } from './CapabilitySnapshotModal';

interface CapabilitySnapshotCardProps {
  className?: string;
}

export function CapabilitySnapshotCard({ className }: CapabilitySnapshotCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-left w-full",
          "bg-card border border-border/60",
          "hover:bg-muted/30",
          "transition-colors duration-150",
          className
        )}
      >
        <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 bg-muted/40">
          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-medium text-foreground">
            View Capability & Brand Snapshot
          </h3>
        </div>

        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      </button>

      <CapabilitySnapshotModal
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
