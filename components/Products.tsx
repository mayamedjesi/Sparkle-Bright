"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories, Product } from "@/lib/products";
import ImageLightbox from "./ImageLightbox";
import AddToCartControl from "./AddToCartControl";

// Tag priority — higher = shown first
// Order: Most Popular → Featured → Best Seller / Essential / New / Custom → no tag
const TAG_PRIORITY: Record<string, number> = {
  "Most Popular": 5,
  "Featured":     4,
  "Best Seller":  3,
  "Essential":    2,
  "New":          1,
  "Custom":       0,
};

function tagScore(tag: string | null): number {
  if (!tag) return -1;
  return TAG_PRIORITY[tag] ?? 0;
}

// Sort products so tagged ones come first (Most Popular at top), then pick top N
function prioritised(products: Product[], limit: number): Product[] {
  return [...products]
    .sort((a, b) => tagScore(b.tag) - tagScore(a.tag))
    .slice(0, limit);
}

const PRODUCTS_PER_CATEGORY = 6;

function TagBadge({ tag }: { tag: string }) {
  const isNew = tag === "New";
  const isCustom = tag === "Custom";
  return (
    <span className={`productTag ${isNew ? "productTagNew" : ""} ${isCustom ? "productTagCustom" : ""}`}>
      {tag}
    </span>
  );
}

export default function Products() {
  const router = useRouter();
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);

  return (
    <section className="productsSection" id="products">

      {categories.map((cat, catIdx) => {
        const limit = PRODUCTS_PER_CATEGORY;
        const featured = prioritised(cat.products, limit);
        return (
          <div key={cat.id} className="productCategory" id={cat.id}>
            <div className="productCategoryHeader">
              <div className="productCategoryMeta">
                <span className="productCategoryNumber">0{catIdx + 1}</span>
                <div>
                  <h3 className="productCategoryName">{cat.name}</h3>
                  <p className="productCategoryDesc">{cat.description}</p>
                </div>
              </div>
              <a className="btnSeeAll" href={cat.seeAllUrl}>
                See all {cat.name}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className={`productGrid productGridCompact ${featured.length === 2 ? "productGridPair" : ""}`}>
              {featured.map((product) => (
                <div
                  key={product.name}
                  className="productCard fadeUp"
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(cat.seeAllUrl)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(cat.seeAllUrl);
                    }
                  }}
                >
                  <div className="productImageWrap">
                    <img src={product.image} alt={product.name} className="productImage" loading="lazy" />
                    <div className="productImageOverlay" />
                    <button
                      className="productImageExpandBtn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLightboxProduct(product);
                      }}
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
                  </div>
                  <div className="productCardBody">
                    <div className="productCardTop">
                      <h4 className="productName">{product.name}</h4>
                      <p className="productDesc">{product.desc}</p>
                    </div>
                    <AddToCartControl
                      name={product.name}
                      image={product.image}
                      category={cat.name}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="productsHeader productsFooter">
        <div className="sectionEyebrow">Our Products</div>
        <h2 className="sectionTitle">
          Everything a City
          <br />
          Needs to Sparkle
        </h2>
        <p className="sectionBody">
          Every product in our range is purpose-built for the cities we serve — 
          rated to –40°C, UL-listed, and backed by a full 1-year warranty. 
          Because Making Cities Sparkle! only counts if the lights are still on 
          at the end of the season.
        </p>
      </div>

      {lightboxProduct && (
        <ImageLightbox
          src={lightboxProduct.image}
          alt={lightboxProduct.name}
          onClose={() => setLightboxProduct(null)}
        />
      )}
    </section>
  );
}
