"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { useCurrency } from "@/components/providers/currency-provider";
import { getErrorMessage } from "@/lib/error-message";
import { calculateCartTotals } from "@/lib/cart-totals";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ResilientImage } from "@/components/ui/resilient-image";
import { searchProducts } from "@/services/product-service";
import shared from "@/styles/shared.module.css";
import styles from "./site-header.module.css";

export function SiteHeader() {
  const [query, setQuery] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const [logoutPending, setLogoutPending] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { lines } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { formatPrice } = useCurrency();
  const { logout, user } = useAuth();
  const cartTotal = calculateCartTotals(lines).subtotal;

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2) return undefined;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      searchProducts({ query: normalizedQuery, signal: controller.signal })
        .then((result) => {
          setSuggestions(result.products.slice(0, 5));
          setSuggestionsOpen(true);
        })
        .catch((error) => {
          if (error.name !== "AbortError") setSuggestions([]);
        });
    }, 180);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSearch = (event) => {
    event.preventDefault();
    const nextQuery = query.trim();
    setSuggestionsOpen(false);
    setSearchActive(false);
    router.push(
      nextQuery ? `/products?q=${encodeURIComponent(nextQuery)}` : "/products",
    );
  };

  const handleCancelSearch = (event) => {
    setQuery("");
    setSuggestions([]);
    setSuggestionsOpen(false);
    setSearchActive(false);
    if (pathname === "/products") router.push("/products");
    event.currentTarget.blur();
  };

  const handleLogout = async () => {
    setLogoutError("");
    setLogoutPending(true);
    try {
      await logout();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setLogoutError(getErrorMessage(error, "Unable to sign out."));
      setLogoutPending(false);
    }
  };

  return (
    <header className={styles.siteHeader}>
      <div className={`${shared.container} ${styles.headerInner}`}>
        <BrandLogo
          className={styles.wordmark}
          ariaLabel="Kickflip Supply products"
        />
        <form
          className={`${styles.headerSearch} ${searchActive && query ? styles.headerSearchActive : ""}`}
          onSubmit={handleSearch}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setSuggestionsOpen(false);
            }
          }}
        >
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => {
              setSearchActive(true);
              if (query.trim().length > 1) setSuggestionsOpen(true);
            }}
            placeholder="Search products"
            aria-label="Search products"
            maxLength={100}
          />
          {query && (
            <button
              type="button"
              className={styles.searchCancel}
              onClick={handleCancelSearch}
              aria-label="Cancel search"
            >
              <X size={17} />
              <span>Cancel</span>
            </button>
          )}
          <button className={styles.searchSubmit} type="submit">
            Search
          </button>
          {suggestionsOpen && suggestions.length > 0 && (
            <div className={styles.searchSuggestions} role="listbox">
              {suggestions.map((product) => (
                <button
                  type="button"
                  role="option"
                  aria-selected="false"
                  onClick={() => {
                    setSuggestionsOpen(false);
                    setQuery(product.name);
                    router.push(`/products/${product.slug}`);
                  }}
                  key={product.id}
                >
                  <span className={styles.suggestionImage} aria-hidden="true">
                    <ResilientImage
                      src={product.image}
                      alt=""
                      fill
                      sizes="(max-width: 720px) 86px, 64px"
                    />
                    {product.badge && <i>{product.badge}</i>}
                  </span>
                  <span className={styles.suggestionInfo}>
                    <small>{product.category}</small>
                    <strong>{product.name}</strong>
                  </span>
                  <span className={styles.suggestionPrice}>
                    {product.compareAtPrice && (
                      <del>{formatPrice(product.compareAtPrice)}</del>
                    )}
                    <b>{formatPrice(product.price)}</b>
                  </span>
                </button>
              ))}
            </div>
          )}
        </form>
        {searchActive && query && (
          <button
            type="button"
            className={styles.mobileSearchBackdrop}
            onClick={handleCancelSearch}
            aria-label="Close search"
          />
        )}
        <div className={styles.headerActions}>
          <div className={styles.accountName} title={user?.name}>
            <UserRound size={17} aria-hidden="true" />
            <span>
              <small>Account</small>
              <strong>{user?.name}</strong>
            </span>
          </div>
          <button
            className={`${styles.iconButton} ${styles.logoutButton}`}
            type="button"
            onClick={handleLogout}
            disabled={logoutPending}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          {logoutError && (
            <span className={styles.headerError} role="alert">
              {logoutError}
            </span>
          )}
          <Link
            href="/wishlist"
            className={styles.headerCountLink}
            aria-label={`Wishlist with ${wishlistCount} items`}
          >
            <Heart size={19} />
            <span className={styles.cartCount}>{wishlistCount}</span>
          </Link>
          <Link
            href="/cart"
            className={`${styles.headerCountLink} ${styles.cartTotalLink}`}
            aria-label={`Cart total ${formatPrice(cartTotal)}`}
          >
            <ShoppingBag size={20} />
            <strong>{formatPrice(cartTotal)}</strong>
          </Link>
        </div>
      </div>
    </header>
  );
}
