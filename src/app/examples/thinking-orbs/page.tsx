import type { Metadata } from "next";
import { OrbsShowcase } from "@/components/orbs-showcase";

export const metadata: Metadata = { title: "Thinking Orbs — примеры для FaetonMES" };

export default function Page() {
  return <main className="page-shell orbs-page"><OrbsShowcase /></main>;
}
