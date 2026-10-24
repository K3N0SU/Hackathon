import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign in | Furrow",
};

export default function Page() {
  return <AuthForm mode="sign-in" />;
}
