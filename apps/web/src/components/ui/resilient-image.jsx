"use client";

import Image from "next/image";
import { useState } from "react";
import { getAssetUrl } from "@/lib/assets";

const DEFAULT_FALLBACK = getAssetUrl("images/product-fallback.png");

export function ResilientImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  onError,
  ...props
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const requestedSrc = getAssetUrl(src);
  const resolvedFallbackSrc = getAssetUrl(fallbackSrc);
  const activeSrc =
    failedSrc === requestedSrc ? resolvedFallbackSrc : requestedSrc;

  const handleError = (event) => {
    onError?.(event);

    if (activeSrc !== resolvedFallbackSrc) {
      setFailedSrc(requestedSrc);
    }
  };

  return <Image {...props} src={activeSrc} alt={alt} onError={handleError} />;
}
