import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Syne, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VidShort AI — Turn Long Videos Into Viral Short Clips",
  description:
    "VidShort uses AI to automatically detect the most engaging moments in your long-form videos and repurpose them as short-form content for TikTok, Instagram Reels, and YouTube Shorts — in seconds.",
  keywords: [
    "AI video editor",
    "long to short video",
    "viral clips",
    "TikTok clips",
    "YouTube Shorts",
    "Instagram Reels",
    "video repurposing",
    "content creator tools",
  ],
  openGraph: {
    title: "VidShort AI — Turn Long Videos Into Viral Short Clips",
    description:
      "AI-powered platform that transforms long-form videos into viral short clips for TikTok, Reels & Shorts in seconds.",
    type: "website",
    url: "https://vidshort.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "VidShort AI — Turn Long Videos Into Viral Short Clips",
    description:
      "AI-powered platform that transforms long-form videos into viral short clips for TikTok, Reels & Shorts in seconds.",
  },
};

import { ClerkProvider } from "@clerk/nextjs";

import UserSync from "@/components/auth/UserSync";

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined, // We'll handle dark mode via CSS
        variables: {
          colorPrimary: "#7C3AED", // Violet-600 to match brand
          colorBackground: "#111118",
          colorText: "#F8FAFC",
          colorTextSecondary: "#94A3B8",
          colorInputBackground: "#1A1A25",
          colorInputText: "#F8FAFC",
        },
      }}
    >
      <html
        lang="en"
        className={cn(
          "dark h-full antialiased",
          inter.variable,
          syne.variable,
          geistMono.variable
        )}
      >
        <body className="min-h-full flex flex-col bg-[#0A0A0F] text-slate-100 font-sans">
          <UserSync />
          {children}
          <Toaster position="bottom-right" theme="dark" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}

