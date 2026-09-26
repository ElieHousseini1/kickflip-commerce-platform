"use client";

import { useEffect } from "react";
import { ErrorView } from "@/components/ui/error-view";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Application error", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <ErrorView onRetry={reset} />
      </body>
    </html>
  );
}
