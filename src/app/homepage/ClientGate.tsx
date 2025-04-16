"use client";

import { Suspense } from "react";
import LoadingAnimation from "@/components/loadingscreens/loadingmainscreen";
import HydrationGate from "@/components/loadingscreens/hydrationgate";
import ClientHome from "./ClientHome";

export default function ClientGate() {
  return (
    // 1) Show LoadingAnimation until the client bundle hydrates
    <Suspense fallback={<LoadingAnimation />}>
      {/* 2) Once hydrated, HydrationGate can enforce any extra delay/conditions */}
      <HydrationGate>
        {/* 3) Finally render the real UI */}
        <ClientHome />
      </HydrationGate>
    </Suspense>
  );
}
