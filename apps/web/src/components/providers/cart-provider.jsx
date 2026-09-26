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
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cart-service";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [lines, setLines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    getCart()
      .then((nextLines) => {
        if (active) {
          setLines(nextLines);
          setLoadError("");
        }
      })
      .catch((error) => {
        if (active) {
          setLoadError(getErrorMessage(error, "Unable to load cart."));
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const addItem = useCallback(async (productId, variantId) => {
    const nextLines = await addCartItem(productId, variantId);
    setLines(nextLines);
  }, []);

  const updateQuantity = useCallback(async (productId, variantId, quantity) => {
    const nextLines = await updateCartItem(productId, variantId, { quantity });
    setLines(nextLines);
  }, []);

  const changeVariant = useCallback(
    async (productId, variantId, nextVariantId) => {
      const nextLines = await updateCartItem(productId, variantId, {
        nextVariantId,
      });
      setLines(nextLines);
    },
    [],
  );

  const removeItem = useCallback(async (productId, variantId) => {
    const nextLines = await removeCartItem(productId, variantId);
    setLines(nextLines);
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((total, line) => total + line.quantity, 0),
      isLoading,
      loadError,
      addItem,
      updateQuantity,
      changeVariant,
      removeItem,
      clearCart,
    }),
    [
      addItem,
      changeVariant,
      isLoading,
      loadError,
      lines,
      removeItem,
      updateQuantity,
      clearCart,
    ],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const context = use(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
