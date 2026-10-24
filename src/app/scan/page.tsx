import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Milpa",
};

export default function ScanPage() {
  return <AppShell />;
}
