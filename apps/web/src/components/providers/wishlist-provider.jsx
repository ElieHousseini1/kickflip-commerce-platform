"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getErrorMessage } from "@/lib/error-message";
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "@/services/wishlist-service";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    getWishlist()
      .then((products) => {
        if (active) {
          setItems(products);
          setLoadError("");
        }
      })
      .catch((error) => {
        if (active) {
          setLoadError(getErrorMessage(error, "Unable to load wishlist."));
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const toggleItem = useCallback(
    async (productId) => {
      const exists = items.some((product) => product.id === productId);
      setItems(
        await (exists
          ? removeWishlistItem(productId)
          : addWishlistItem(productId)),
      );
    },
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isLoading,
      loadError,
      hasItem: (productId) => items.some((product) => product.id === productId),
      toggleItem,
    }),
    [isLoading, items, loadError, toggleItem],
  );

  return <WishlistContext value={value}>{children}</WishlistContext>;
}

export function useWishlist() {
  const context = use(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
