import type { Metadata } from "next";
import { Deck } from "@/components/deck";

export const metadata: Metadata = {
  title: "Furrow slides",
  robots: { index: false },
};

export default function DeckPage() {
  return <Deck />;
}
