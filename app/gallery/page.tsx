"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { allProducts, categories, FlatProduct } from "@/lib/products";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { QuoteModalProvider } from "@/components/QuoteModalContext";
import ScrollReveal from "@/components/ScrollReveal";
import ImageLightbox from "@/components/ImageLightbox";
import { responsiveImage } from "@/lib/responsiveImage";
import AddToCartControl from "@/components/AddToCartControl";

// ── Fuzzy match ────────────────────────────────────
// Returns a score: higher = better match. 0 = no match.
function fuzzyScore(text: string, query: string): number {
  if (!query) return 1;
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (t.includes(q)) return 10; // exact substring = highest
  // Character-by-character fuzzy
  let ti = 0;
  let qi = 0;
  let score = 0;
  let consecutive = 0;
  while (ti < t.length && qi < q.length) {
    if (t[ti] === q[qi]) {
      score += 1 + consecutive;
      consecutive++;
      qi++;
    } else {
      consecutive = 0;
    }
    ti++;
  }
  return qi === q.length ? score : 0; // must match all chars
}

function TagBadge({ tag }: { tag: string }) {
  const isNew = tag === "New";
  const isCustom = tag === "Custom";
  return (
    <span className={`productTag ${isNew ? "productTagNew" : ""} ${isCustom ? "productTagCustom" : ""}`}>
      {tag}
    </span>
  );
}

function GalleryInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxProduct, setLightboxProduct] = useState<FlatProduct | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Sync category from URL param on mount
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  // Update URL when category changes (for shareability)
  function handleCategoryChange(id: string) {
    setActiveCategory(id);
    const params = new URLSearchParams();
    if (id !== "all") params.set("category", id);
    router.replace(`/gallery${params.toString() ? `?${params}` : ""}`, { scroll: false });
  }

  const filtered = useMemo<FlatProduct[]>(() => {
    let list = allProducts;

    // Category filter
    if (activeCategory !== "all") {
      list = list.filter((p) => p.categoryId === activeCategory);
    }

    // Fuzzy search across name + desc + categoryName
    if (query.trim()) {
      list = list
        .map((p) => ({
          product: p,
          score:
            fuzzyScore(p.name, query) * 3 +
            fuzzyScore(p.desc, query) +
            fuzzyScore(p.categoryName, query),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.product);
    }

    return list;
  }, [query, activeCategory]);

  return (
    <>
      <ScrollReveal />
      <Nav />

      <main className="galleryPage">
        {/* Header */}
        <div className="galleryHero">
          <div className="galleryHeroInner">
            <Link href="/" className="galleryBackLink">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M13 8H3M3 8L7 4M3 8L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Home
            </Link>
            <div className="sectionEyebrow" style={{ marginTop: "1.5rem" }}>Product Gallery</div>
            <h1 className="galleryTitle">
              {activeCategory === "all"
                ? "All Products"
                : categories.find((c) => c.id === activeCategory)?.name ?? "All Products"}
            </h1>
            <p className="gallerySubtitle">
              Browse our full range of commercial and municipal lighting products. Every item is rated for Canadian winters and backed by a 1-year warranty.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="galleryControls">
          {/* Search */}
          <div className="gallerySearchWrap">
            <svg className="gallerySearchIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              ref={searchRef}
              className="gallerySearch"
              type="search"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
            {query && (
              <button className="gallerySearchClear" onClick={() => setQuery("")} aria-label="Clear search">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="galleryCategoryPills" role="group" aria-label="Filter by category">
            <button
              className={`galleryCategoryPill ${activeCategory === "all" ? "galleryCategoryPillActive" : ""}`}
              onClick={() => handleCategoryChange("all")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`galleryCategoryPill ${activeCategory === cat.id ? "galleryCategoryPillActive" : ""}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="galleryMeta">
          <span className="galleryCount">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
            {query ? ` matching "${query}"` : ""}
            {activeCategory !== "all" ? ` in ${categories.find((c) => c.id === activeCategory)?.name}` : ""}
          </span>
          {(query || activeCategory !== "all") && (
            <button
              className="galleryClearFilters"
              onClick={() => { setQuery(""); handleCategoryChange("all"); }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (() => {
          // Cap each breakpoint's column count at the actual number of
          // results, so a small filtered/search result set (e.g. 2 products
          // in a category) fills its row evenly with appropriately-sized
          // tiles instead of leaving empty grid cells dangling on the right.
          // Larger result sets are unaffected — they still use the full
          // column count, with rows of equal tile count throughout.
          const galleryGridVars = {
            "--gallery-cols-desktop": Math.min(filtered.length, 4),
            "--gallery-cols-tablet": Math.min(filtered.length, 3),
            "--gallery-cols-mobile": Math.min(filtered.length, 2),
          } as React.CSSProperties;

          return (
            <div
              className="galleryGrid"
              style={galleryGridVars}
              key={`${activeCategory}-${query}`}
            >
              {filtered.map((product) => (
                <div key={`${product.categoryId}-${product.name}`} className="galleryCard">
                  <div className="productImageWrap">
                    <img
                      {...responsiveImage(product.image)}
                      alt={product.name}
                      className="productImage"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = "0";
                      }}
                    />
                    <div className="productImageOverlay" />
                    <button
                      className="productImageExpandBtn"
                      onClick={() => setLightboxProduct(product)}
                      aria-label={`Expand image of ${product.name}`}
                    >
                      <span className="productImageZoomHint" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M7 5V9M5 7H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>
                    {product.tag && (
                      <div className="productTagFloat">
                        <TagBadge tag={product.tag} />
                      </div>
                    )}
                    <div className="galleryCategoryBadge">{product.categoryName}</div>
                  </div>
                  <div className="productCardBody">
                    <div className="productCardTop">
                      <h2 className="productName">{product.name}</h2>
                      <p className="productDesc">{product.desc}</p>
                    </div>
                    <AddToCartControl
                      name={product.name}
                      image={product.image}
                      category={product.categoryName}
                    />
                  </div>
                </div>
              ))}
            </div>
          );
        })() : (
          <div className="galleryEmpty">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="18" cy="18" r="12" stroke="#4FC3F7" strokeWidth="1.5" opacity="0.4"/>
              <path d="M27 27L35 35" stroke="#4FC3F7" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
              <path d="M14 18H22M18 14V22" stroke="#4FC3F7" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
            </svg>
            <p className="galleryEmptyTitle">No products found</p>
            <p className="galleryEmptyBody">Try a different search term or category.</p>
            <button className="btnPrimary" style={{ marginTop: "1rem" }} onClick={() => { setQuery(""); handleCategoryChange("all"); }}>
              Show all products
            </button>
          </div>
        )}
      </main>

      <Footer />
      <BackToTop />

      {lightboxProduct && (
        <ImageLightbox
          src={lightboxProduct.image}
          alt={lightboxProduct.name}
          onClose={() => setLightboxProduct(null)}
        />
      )}
    </>
  );
}

export default function GalleryPage() {
  return (
    <QuoteModalProvider>
      <Suspense>
        <GalleryInner />
      </Suspense>
    </QuoteModalProvider>
  );
}
