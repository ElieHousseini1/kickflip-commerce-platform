"use client";

import Image from "next/image";
import { useState } from "react";

const DEFAULT_FALLBACK = "/images/product-fallback.png";

export function ResilientImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  onError,
  ...props
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const activeSrc = failedSrc === src ? fallbackSrc : src;

  const handleError = (event) => {
    onError?.(event);

    if (activeSrc !== fallbackSrc) {
      setFailedSrc(src);
    }
  };

  return <Image {...props} src={activeSrc} alt={alt} onError={handleError} />;
}
