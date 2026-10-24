import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Make an account | Milpa",
};

export default function Page() {
  return <AuthForm mode="sign-up" />;
}
