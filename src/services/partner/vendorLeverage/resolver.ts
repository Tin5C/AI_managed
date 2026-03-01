import { listVendorIntel } from "@/data/partner/vendorIntelStore";
import type { VendorId, VendorIntelItemType } from "@/data/partner/vendorIntelStore";

export type VendorLeverageSectionId =
  | "win_cases"
  | "marketing_proof"
  | "architecture"
  | "incentives"
  | "activate"
  | "other";

export interface VendorLeverageCardVM {
  id: string;
  type: VendorIntelItemType;
  title: string;
  bullets: string[];
  detail: string;
  sourceUrl?: string;
  playId?: string;
  proprietaryFlag: boolean;
}

export interface VendorLeverageSectionVM {
  id: VendorLeverageSectionId;
  title: string;
  items: VendorLeverageCardVM[];
}

export interface VendorLeverageVM {
  vendorId: VendorId;
  sections: VendorLeverageSectionVM[];
}

function buildBullets(summary: string): string[] {
  const lines = summary
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  return lines.slice(0, 3);
}

function toCard(item: {
  id: string;
  type: VendorIntelItemType;
  title: string;
  summary: string;
  sourceUrl?: string;
  playId?: string;
  proprietaryFlag: boolean;
}): VendorLeverageCardVM {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    bullets: buildBullets(item.summary),
    detail: item.summary,
    sourceUrl: item.sourceUrl,
    playId: item.playId,
    proprietaryFlag: item.proprietaryFlag,
  };
}

export function resolveVendorLeverage(vendorId: VendorId): VendorLeverageVM {
  const items = listVendorIntel(vendorId);

  const winCases: VendorLeverageCardVM[] = [];
  const marketingProof: VendorLeverageCardVM[] = [];
  const architecture: VendorLeverageCardVM[] = [];
  const incentives: VendorLeverageCardVM[] = [];
  const activate: VendorLeverageCardVM[] = [];
  const other: VendorLeverageCardVM[] = [];

  for (const item of items) {
    const card = toCard(item);
    if (item.type === "deal_close_kit") {
      winCases.push(card);
    } else if (
      item.type === "reference_case" ||
      item.type === "kpi" ||
      item.type === "pitch_drill"
    ) {
      marketingProof.push(card);
    } else if (item.type === "approved_architecture_pattern") {
      architecture.push(card);
    } else if (item.type === "incentive") {
      incentives.push(card);
    } else if (item.type === "request_router" || item.type === "contact") {
      activate.push(card);
    } else {
      other.push(card);
    }
  }

  return {
    vendorId,
    sections: [
      { id: "win_cases", title: "Win Cases", items: winCases },
      { id: "marketing_proof", title: "Marketing & Proof", items: marketingProof },
      { id: "architecture", title: "Approved Architecture", items: architecture },
      { id: "incentives", title: "Incentives & Programs", items: incentives },
      { id: "activate", title: "Activate Microsoft", items: activate },
      { id: "other", title: "Other", items: other },
    ],
  };
}
