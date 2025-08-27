// components/PageVisitTracker.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "../lib/amplitude";

export const PageVisitTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Combine pathname and search params for full URL
    const url = `${pathname}${
      searchParams.toString() ? `?${searchParams}` : ""
    }`;
    analytics.trackEvent("Page Viewed", { pathname: url });
  }, [pathname, searchParams]); // Re-run on route changes

  return null;
};
