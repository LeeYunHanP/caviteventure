// app/components/loadingscreens/hydrationgate.tsx
"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./loadingmainscreen";

export default function HydrationGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    try {
      const timeout = setTimeout(() => {
        setHydrated(true);
      }, 0);

      return () => clearTimeout(timeout);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Hydration error:", err.message);
        setError("There was a problem loading the page.");
      } else {
        console.error("Unknown error during hydration");
        setError("There was a problem loading the page.");
      }
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!hydrated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
