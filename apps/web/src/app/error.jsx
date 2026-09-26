"use client";

import { useEffect } from "react";
import { ErrorView } from "@/components/ui/error-view";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("Application error", error);
  }, [error]);

  return <ErrorView onRetry={reset} />;
}
