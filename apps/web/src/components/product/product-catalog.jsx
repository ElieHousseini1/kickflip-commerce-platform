"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownUp, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { useCurrency } from "@/components/providers/currency-provider";
import { Dropdown } from "@/components/ui/dropdown";
import { searchProducts } from "@/services/product-service";
import shared from "@/styles/shared.module.css";
import styles from "./product-catalog.module.css";

const categories = [
  { value: "all", label: "All gear" },
  { value: "boards", label: "Boards" },
  { value: "hardware", label: "Hardware" },
  { value: "ramps", label: "Ramps" },
  { value: "wearables", label: "Wearables" },
  { value: "accessories", label: "Extras" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "name", label: "Name: A—Z" },
];

const PAGE_SIZE = 12;

export function ProductCatalog({
  products,
  initialCategory = "all",
  initialQuery = "",
  initialSort = "featured",
  initialPage = 1,
}) {
  const { formatPrice } = useCurrency();
  const resultsRef = useRef(null);
  const safeInitialCategory = categories.some(
    (item) => item.value === initialCategory,
  )
    ? initialCategory
    : "all";
  const safeInitialSort = sortOptions.some(
    (option) => option.value === initialSort,
  )
    ? initialSort
    : "featured";
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [category, setCategory] = useState(safeInitialCategory);
  const [sort, setSort] = useState(safeInitialSort);
  const [page, setPage] = useState(
    Number.isSafeInteger(initialPage) && initialPage > 0 ? initialPage : 1,
  );
  const [visibleProducts, setVisibleProducts] = useState(products);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [saleOnly, setSaleOnly] = useState(false);
  const highestPrice =
    Math.ceil(Math.max(...products.map((product) => product.price)) / 100) *
    100;
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(highestPrice);
  const [gridView, setGridView] = useState("four");
  const [mobileGridView, setMobileGridView] = useState("one");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(
    safeInitialCategory !== "all" ||
      Boolean(initialQuery) ||
      safeInitialSort !== "featured",
  );

  const filteredProducts = useMemo(
    () =>
      visibleProducts.filter((product) => {
        if (stockFilter === "in-stock" && product.stockQuantity === 0)
          return false;
        if (stockFilter === "out-of-stock" && product.stockQuantity !== 0)
          return false;
        if (saleOnly && !product.compareAtPrice) return false;
        if (product.price < minPrice || product.price > maxPrice) return false;
        return true;
      }),
    [maxPrice, minPrice, saleOnly, stockFilter, visibleProducts],
  );
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const updateCatalogUrl = (
    nextCategory,
    nextQuery,
    nextSort,
    nextPage = 1,
  ) => {
    const url = new URL(window.location.href);
    if (nextCategory === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", nextCategory);

    if (nextQuery) url.searchParams.set("q", nextQuery);
    else url.searchParams.delete("q");

    if (nextSort === "featured") url.searchParams.delete("sort");
    else url.searchParams.set("sort", nextSort);

    if (nextPage <= 1) url.searchParams.delete("page");
    else url.searchParams.set("page", String(nextPage));

    window.history.pushState(null, "", `${url.pathname}${url.search}`);
  };

  const resetPageForLocalFilter = () => {
    setPage(1);
    const url = new URL(window.location.href);
    if (url.searchParams.has("page")) {
      url.searchParams.delete("page");
      window.history.replaceState(null, "", `${url.pathname}${url.search}`);
    }
  };

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > pageCount || nextPage === currentPage)
      return;
    setPage(nextPage);
    updateCatalogUrl(category, submittedQuery, sort, nextPage);
    resultsRef.current?.scrollIntoView?.({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (!hasInteracted) return undefined;

    const controller = new AbortController();
    const refreshProducts = async () => {
      setLoading(true);
      setRequestError("");
      try {
        const result = await searchProducts({
          query: submittedQuery,
          category,
          sort,
          signal: controller.signal,
        });
        setVisibleProducts(result.products);
      } catch (error) {
        if (error.name !== "AbortError") {
          setRequestError("The drop could not be refreshed. Try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void refreshProducts();

    return () => {
      controller.abort();
    };
  }, [category, hasInteracted, sort, submittedQuery]);

  useEffect(() => {
    const restoreCatalogState = () => {
      const params = new URLSearchParams(window.location.search);
      const nextCategory = params.get("category") || "all";
      const safeCategory = categories.some(
        (item) => item.value === nextCategory,
      )
        ? nextCategory
        : "all";
      const nextQuery = params.get("q") || "";
      const requestedSort = params.get("sort") || "featured";
      const requestedPage = Number(params.get("page") || 1);
      const safeSort = sortOptions.some(
        (option) => option.value === requestedSort,
      )
        ? requestedSort
        : "featured";

      setCategory(safeCategory);
      setSubmittedQuery(nextQuery);
      setSort(safeSort);
      setPage(
        Number.isSafeInteger(requestedPage) && requestedPage > 0
          ? requestedPage
          : 1,
      );
      setHasInteracted(
        safeCategory !== "all" || Boolean(nextQuery) || safeSort !== "featured",
      );
      if (safeCategory === "all" && !nextQuery && safeSort === "featured") {
        setVisibleProducts(products);
        setRequestError("");
        setLoading(false);
      }
    };

    window.addEventListener("popstate", restoreCatalogState);
    return () => window.removeEventListener("popstate", restoreCatalogState);
  }, [products]);

  const handleResetFilters = () => {
    setSubmittedQuery("");
    setCategory("all");
    setSort("featured");
    setStockFilter("all");
    setSaleOnly(false);
    setMinPrice(0);
    setMaxPrice(highestPrice);
    setPage(1);
    setHasInteracted(true);
    updateCatalogUrl("all", "", "featured");
  };

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setPage(1);
    setHasInteracted(true);
    updateCatalogUrl(category, submittedQuery, nextSort);
  };

  return (
    <>
      <div className={styles.categoryBar}>
        <div
          className={styles.catalogCategories}
          aria-label="Filter by category"
        >
          {categories.map((item) => (
            <button
              type="button"
              className={category === item.value ? styles.isActive : ""}
              aria-pressed={category === item.value}
              onClick={() => {
                setCategory(item.value);
                setPage(1);
                setHasInteracted(true);
                updateCatalogUrl(item.value, submittedQuery, sort);
              }}
              key={item.value}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.catalogLayout}>
        <div className={styles.catalogResults} ref={resultsRef}>
          <div className={styles.catalogResultRow}>
            <div className={styles.catalogStatus} aria-live="polite">
              {submittedQuery && (
                <p>
                  Search: <strong>“{submittedQuery}”</strong>
                </p>
              )}
              {loading && <p className={styles.filterStatus}>Updating…</p>}
            </div>
            <div className={styles.catalogControls}>
              <div className={styles.mobileCatalogActions}>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal size={16} /> Filter
                </button>
                <button type="button" onClick={() => setMobileSortOpen(true)}>
                  <ArrowDownUp size={16} /> Sort
                </button>
              </div>
              <div className={styles.desktopViewControl}>
                <span>View</span>
                <div className={styles.viewOptions}>
                  <button
                    type="button"
                    className={gridView === "three" ? styles.isSelected : ""}
                    aria-label="Show three products per row"
                    aria-pressed={gridView === "three"}
                    onClick={() => setGridView("three")}
                  >
                    3
                  </button>
                  <button
                    type="button"
                    className={gridView === "four" ? styles.isSelected : ""}
                    aria-label="Show four products per row"
                    aria-pressed={gridView === "four"}
                    onClick={() => setGridView("four")}
                  >
                    4
                  </button>
                </div>
              </div>
              <div className={styles.mobileViewControl}>
                <span>View</span>
                <div className={styles.mobileViews}>
                  <button
                    type="button"
                    className={
                      mobileGridView === "one" ? styles.isSelected : ""
                    }
                    aria-label="Show one product per row"
                    aria-pressed={mobileGridView === "one"}
                    onClick={() => setMobileGridView("one")}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className={
                      mobileGridView === "two" ? styles.isSelected : ""
                    }
                    aria-label="Show two products per row"
                    aria-pressed={mobileGridView === "two"}
                    onClick={() => setMobileGridView("two")}
                  >
                    2
                  </button>
                </div>
              </div>
              <div className={styles.sortControl}>
                <span>Sort</span>
                <Dropdown
                  value={sort}
                  options={sortOptions}
                  onChange={handleSortChange}
                  ariaLabel="Sort products"
                />
              </div>
            </div>
          </div>
          {requestError && (
            <p className={styles.requestError} role="alert">
              {requestError}
            </p>
          )}
          {filteredProducts.length > 0 ? (
            <div
              className={`${styles.catalogGrid} ${gridView === "three" ? styles.threeColumnGrid : ""} ${mobileGridView === "two" ? styles.mobileTwoColumnGrid : ""}`}
            >
              {paginatedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 3}
                  mobileCompact={mobileGridView === "two"}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyResults}>
              <h2>Nothing landed.</h2>
              <p>Try another search or clear your filters.</p>
              <button
                type="button"
                className={`${shared.button} ${shared.buttonDark}`}
                onClick={handleResetFilters}
              >
                Show all gear
              </button>
            </div>
          )}
          {filteredProducts.length > PAGE_SIZE && (
            <nav className={styles.pagination} aria-label="Product pages">
              <button
                type="button"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                Previous
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    onClick={() => changePage(pageNumber)}
                    aria-label={`Page ${pageNumber}`}
                    aria-current={
                      currentPage === pageNumber ? "page" : undefined
                    }
                  >
                    {pageNumber}
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === pageCount}
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          )}
        </div>
        <aside
          className={`${styles.filtersPanel} ${mobileFiltersOpen ? styles.drawerOpen : ""}`}
          aria-label="Product filters"
        >
          <div className={styles.filtersHeading}>
            <SlidersHorizontal size={17} aria-hidden="true" />
            <h2>Filters</h2>
            <button
              type="button"
              className={styles.drawerClose}
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>
          <div className={`${styles.filterGroup} ${styles.mobileCategories}`}>
            <span className={styles.filterLabel}>Categories</span>
            <div className={styles.filterOptions}>
              {categories.map((item) => (
                <button
                  type="button"
                  className={category === item.value ? styles.isSelected : ""}
                  aria-pressed={category === item.value}
                  onClick={() => {
                    setCategory(item.value);
                    setPage(1);
                    setHasInteracted(true);
                    updateCatalogUrl(item.value, submittedQuery, sort);
                  }}
                  key={item.value}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Availability</span>
            <div className={styles.filterOptions}>
              <button
                type="button"
                className={stockFilter === "all" ? styles.isSelected : ""}
                aria-pressed={stockFilter === "all"}
                onClick={() => {
                  setStockFilter("all");
                  resetPageForLocalFilter();
                }}
              >
                All products
              </button>
              <button
                type="button"
                className={stockFilter === "in-stock" ? styles.isSelected : ""}
                aria-pressed={stockFilter === "in-stock"}
                onClick={() => {
                  setStockFilter("in-stock");
                  resetPageForLocalFilter();
                }}
              >
                In stock
              </button>
              <button
                type="button"
                className={
                  stockFilter === "out-of-stock" ? styles.isSelected : ""
                }
                aria-pressed={stockFilter === "out-of-stock"}
                onClick={() => {
                  setStockFilter("out-of-stock");
                  resetPageForLocalFilter();
                }}
              >
                Out of stock
              </button>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Price</span>
            <div className={styles.priceRangeLabels}>
              <strong>{formatPrice(minPrice)}</strong>
              <strong>{formatPrice(maxPrice)}</strong>
            </div>
            <div className={styles.dualRange}>
              <span
                className={styles.rangeFill}
                style={{
                  left: `${(minPrice / highestPrice) * 100}%`,
                  right: `${100 - (maxPrice / highestPrice) * 100}%`,
                }}
              />
              <input
                type="range"
                min="0"
                max={highestPrice}
                step="25"
                value={minPrice}
                onChange={(event) => {
                  setMinPrice(
                    Math.min(Number(event.target.value), maxPrice - 25),
                  );
                  resetPageForLocalFilter();
                }}
                aria-label="Minimum price"
              />
              <input
                type="range"
                min="0"
                max={highestPrice}
                step="25"
                value={maxPrice}
                onChange={(event) => {
                  setMaxPrice(
                    Math.max(Number(event.target.value), minPrice + 25),
                  );
                  resetPageForLocalFilter();
                }}
                aria-label="Maximum price"
              />
            </div>
          </div>
          <div className={styles.filterGroup}>
            <button
              type="button"
              className={`${styles.saleToggle} ${saleOnly ? styles.isSelected : ""}`}
              aria-pressed={saleOnly}
              onClick={() => {
                setSaleOnly((active) => !active);
                resetPageForLocalFilter();
              }}
            >
              Sale items only
            </button>
          </div>
          {(submittedQuery ||
            category !== "all" ||
            sort !== "featured" ||
            stockFilter !== "all" ||
            minPrice !== 0 ||
            maxPrice !== highestPrice ||
            saleOnly) && (
            <button
              type="button"
              className={styles.resetFilters}
              onClick={handleResetFilters}
            >
              Reset filters
            </button>
          )}
        </aside>
        {(mobileFiltersOpen || mobileSortOpen) && (
          <button
            type="button"
            className={styles.drawerBackdrop}
            onClick={() => {
              setMobileFiltersOpen(false);
              setMobileSortOpen(false);
            }}
            aria-label="Close catalog controls"
          />
        )}
        <aside
          className={`${styles.mobileSortDrawer} ${mobileSortOpen ? styles.drawerOpen : ""}`}
          aria-label="Sort products"
        >
          <div className={styles.filtersHeading}>
            <ArrowDownUp size={17} />
            <h2>Sort</h2>
            <button
              type="button"
              className={styles.drawerClose}
              onClick={() => setMobileSortOpen(false)}
              aria-label="Close sorting"
            >
              <X size={20} />
            </button>
          </div>
          <div className={styles.filterOptions}>
            {sortOptions.map((option) => (
              <button
                type="button"
                className={sort === option.value ? styles.isSelected : ""}
                aria-pressed={sort === option.value}
                onClick={() => {
                  handleSortChange(option.value);
                  setMobileSortOpen(false);
                }}
                key={option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
