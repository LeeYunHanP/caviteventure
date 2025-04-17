// app/layout.tsx  (Next.js App Router)

// ---------- SERVER COMPONENT ----------
import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import LoadingScreen from "@/components/loadingscreens/loadingmainscreen";
import HydrationGate from "@/components/loadingscreens/hydrationgate";
import Header from "@/components/topheader/header";
import Bottom from "@/components/bottomheader/bottom";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cavite Venture",
  description: "Created for a New Experience in Modern Museum",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 1️⃣ Streaming: LoadingScreen until server components finish */}
        <Suspense fallback={<LoadingScreen />}>
          {/* 2️⃣ Hydration: keep LoadingScreen until the page is interactive */}
          <HydrationGate>
            <Header />
            {children}
            <Bottom />   
          </HydrationGate>
        </Suspense>
      </body>
    </html>
  );
}
