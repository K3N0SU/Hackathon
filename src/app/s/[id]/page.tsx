import type { Metadata } from "next";
import { Suspense } from "react";
import { SharedScanView } from "@/components/shared-scan";

export const metadata: Metadata = {
  title: "Shared label · Rowen",
};

type Params = { params: Promise<{ id: string }> };

async function Shared({ params }: Params) {
  const { id } = await params;
  return <SharedScanView id={id} />;
}

export default function SharedPage({ params }: Params) {
  return (
    <Suspense fallback={<div className="flex-1 bg-background" />}>
      <Shared params={params} />
    </Suspense>
  );
}
