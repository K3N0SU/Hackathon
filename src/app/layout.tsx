import type { Metadata, Viewport } from "next";
import {
  Barlow_Condensed,
  Fraunces,
  Noto_Sans_Gurmukhi,
  Public_Sans,
} from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const notoGurmukhi = Noto_Sans_Gurmukhi({
  variable: "--font-gurmukhi",
  subsets: ["gurmukhi"],
});

export const metadata: Metadata = {
  title: "Furrow",
  description:
    "Photograph a pesticide label or field sign and get the safety details in Spanish, Punjabi or English.",
};

export const viewport: Viewport = {
  themeColor: "#f6f2e9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${fraunces.variable} ${barlow.variable} ${notoGurmukhi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
