// app/components/loadingscreens/HydrationGate.tsx
"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./loadingmainscreen";

export default function HydrationGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);

  // When the component mounts on the client, we know hydration is done
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Still hydrating → keep the loading screen up
    return <LoadingScreen />;
  }

  // Hydration finished → show the actual UI
  return <>{children}</>;
}
