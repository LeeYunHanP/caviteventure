import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import LoadingScreen from "@/components/loadingscreens/loadingmainscreen";
import HydrationGate from "@/components/loadingscreens/hydrationgate";
import Header from "@/components/topheader/header";
import Bottom from "@/components/bottomheader/bottom";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LogVisitor from "@/components/LogVisitor";
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Security fallback meta headers (not a replacement for HTTP headers) */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="permissions-policy" content="geolocation=(), camera=(), microphone=()" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self'; object-src 'none';"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LogVisitor />
        <Suspense fallback={<LoadingScreen />}>
          <HydrationGate>
            <Header />
            {children}
            <Bottom />
          </HydrationGate>
        </Suspense>
        <SpeedInsights />
      </body>
    </html>
  );
}
