import type { Metadata } from "next";
import { Scanner } from "@/components/scanner";

export const metadata: Metadata = {
  title: "Scan a label",
};

export default function ScanPage() {
  return <Scanner />;
}
