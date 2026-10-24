import type { Metadata } from "next";
import { VerifyEmail } from "@/components/verify-email";

export const metadata: Metadata = {
  title: "Check your email | Furrow",
};

export default function Page() {
  return <VerifyEmail />;
}
