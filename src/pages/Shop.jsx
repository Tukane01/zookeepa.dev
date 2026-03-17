import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, ChevronRight, Megaphone, Trophy, Tag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_LABELS = {
  tops: "Tops", bottoms: "Bottoms", dresses: "Dresses",
  outerwear: "Outerwear", accessories: "Accessories", shoes: "Shoes"
};

const PROMO_ICONS = {
  announcement: Megaphone, competition: Trophy, sale: Tag, new_arrival: Sparkles
};

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [settings, setSettings] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      Promise.resolve([]), // Mock Products
      Promise.resolve([]), // Mock Promotions
      Promise.resolve([])  // Mock SiteSettings
    ]).then(([prods, promos, siteArr]) => {
      setProducts(prods);
      setPromotions(promos.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
      if (siteArr.length > 0) setSettings(siteArr[0]);
      setLoading(false);
    });
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("zookeepacart") || "[]");
    const existing = cart.find(i => 
      i.product_id === product.id && 
      i.size === (product.sizes?.[0] || "") && 
      i.color === (product.colors?.[0] || "")
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        product_id: product.id,
        product_name: product.name,
        price: product.sale_price || product.price,
        quantity: 1,
        size: product.sizes?.[0] || "",
        color: product.colors?.[0] || "",
        image_url: product.image_url || ""
      });
    }
    localStorage.setItem("zookeepacart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const filtered = activeCategory === "all" ? products : products.filter(p => p.category === activeCategory);
  const featured = products.filter(p => p.is_featured);

  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80";
  const heroTitle = settings?.hero_title || "Wear Your Wild Side";
  const heroSubtitle = settings?.hero_subtitle || "Bold designs. Premium quality. Made for those who dare.";
  const heroCta = settings?.hero_cta_text || "Explore Collection";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      {/* Promotions Banner */}
      {promotions.length > 0 && (
        <div className="space-y-0">
          {promotions.map((promo) => {
            const Icon = PROMO_ICONS[promo.type] || Megaphone;
            return (
              <div
                key={promo.id}
                className="px-4 py-3 flex items-center justify-center gap-3 text-center"
                style={{ backgroundColor: promo.background_color || "#D4AF37", color: promo.text_color || "#1a1a1a" }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="font-semibold text-sm">{promo.title}:</span>
                  <span className="text-sm">{promo.message}</span>
                </div>
                {promo.cta_text && (
                  <span className="hidden sm:inline-block border border-current px-3 py-0.5 text-xs tracking-wider cursor-pointer hover:opacity-80">
                    {promo.cta_text}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Hero */}
      <section
        className="relative h-[70vh] md:h-[85vh] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl">
            <p className="text-yellow-400 text-xs tracking-[0.4em] uppercase mb-4">ZooKeepa · 2026 Collection</p>
            <h1 className="brand-font text-5xl md:text-7xl font-bold text-white leading-tight mb-6">{heroTitle}</h1>
            <p className="text-gray-200 text-lg mb-8 font-light">{heroSubtitle}</p>
            <Link to={createPageUrl("Shop") + "#products"}>
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-3 tracking-wider text-sm rounded-none">
                {heroCta} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="brand-font text-3xl font-semibold">Featured Picks</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h2 className="brand-font text-3xl font-semibold">All Products</h2>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-1.5 text-xs tracking-wider uppercase border transition-all ${activeCategory === "all" ? "bg-black text-white border-black" : "border-gray-300 text-gray-600 hover:border-black"}`}
            >
              All
            </button>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setActiveCategory(k)}
                className={`px-4 py-1.5 text-xs tracking-wider uppercase border transition-all ${activeCategory === k ? "bg-black text-white border-black" : "border-gray-300 text-gray-600 hover:border-black"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No products found</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.sale_price / product.price) * 100) : 0;

  return (
    <div className="group relative">
      <Link to={createPageUrl("ProductDetail") + `?id=${product.id}`}>
        <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-3">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
          )}
          {product.is_featured && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-0.5 font-semibold tracking-wider">FEATURED</div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 font-semibold">-{discountPct}%</div>
          )}
          {/* Quick Add overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-black/80 text-white text-xs tracking-wider uppercase py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer"
            onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
          >
            Quick Add
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {hasDiscount ? (
            <>
              <span className="text-sm font-semibold text-red-600">R{product.sale_price?.toFixed(2)}</span>
              <span className="text-xs text-gray-400 line-through">R{product.price?.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-sm font-semibold">R{product.price?.toFixed(2)}</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1 capitalize">{product.category}</p>
      </Link>
    </div>
  );
}