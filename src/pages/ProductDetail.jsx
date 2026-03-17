import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { ShoppingBag, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const id = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    if (id) {
      Promise.resolve([{
        id,
        name: "Sample Product",
        description: "Bold designs. Premium quality. Made for those who dare.",
        price: 299.99,
        category: "tops",
        sizes: ["S", "M", "L"],
        colors: ["Black", "White"],
        image_url: "https://images.unsplash.com/photo-1515347619362-710e4a77cb20?w=800&q=80",
        stock: 10
      }]).then(r => { 
        if (r[0]) { setProduct(r[0]); setSelectedSize(r[0].sizes?.[0] || ""); setSelectedColor(r[0].colors?.[0] || ""); } 
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const addToCart = () => {
    if (!selectedSize) return;
    const cart = JSON.parse(localStorage.getItem("zookeepacart") || "[]");
    const key = product.id + selectedSize + selectedColor;
    const existing = cart.find(i => i.product_id + i.size + i.color === key);
    if (existing) { existing.quantity += quantity; }
    else {
      cart.push({ product_id: product.id, product_name: product.name, price: product.sale_price || product.price, quantity, size: selectedSize, color: selectedColor, image_url: product.image_url || "" });
    }
    localStorage.setItem("zookeepacart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <p className="text-gray-500 mb-4">Product not found.</p>
      <Link to={createPageUrl("Shop")}>
        <Button className="bg-black text-white rounded-none">Return to Shop</Button>
      </Link>
    </div>
  );

  const images = [product.image_url, ...(product.additional_images || [])].filter(Boolean);
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to={createPageUrl("Shop")} className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6 gap-1">
        <ChevronLeft className="w-4 h-4" /> Back to Shop
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div>
          <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
            <img src={images[activeImage] || ""} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`aspect-square bg-gray-100 overflow-hidden border-2 transition-colors ${activeImage === i ? "border-black" : "border-transparent"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="py-4">
          <p className="text-xs tracking-widest text-yellow-600 uppercase mb-2">{product.category}</p>
          <h1 className="brand-font text-4xl font-semibold mb-4">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold text-red-600">R{product.sale_price?.toFixed(2)}</span>
                <span className="text-lg text-gray-400 line-through">R{product.price?.toFixed(2)}</span>
                <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">Sale</span>
              </>
            ) : (
              <span className="text-2xl font-bold">R{product.price?.toFixed(2)}</span>
            )}
          </div>

          {product.description && <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase mb-3">Color: <span className="font-semibold">{selectedColor}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 text-sm border transition-all ${selectedColor === c ? "border-black bg-black text-white" : "border-gray-300 hover:border-gray-500"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase mb-3">Size: <span className="font-semibold">{selectedSize}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 text-sm font-medium border transition-all ${selectedSize === s ? "border-black bg-black text-white" : "border-gray-300 hover:border-gray-500"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-8">
            <p className="text-xs tracking-widest uppercase">Qty:</p>
            <div className="flex items-center border border-gray-300">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-lg">−</button>
              <span className="w-12 text-center text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-lg">+</button>
            </div>
          </div>

          <Button onClick={addToCart} className="w-full h-12 bg-black hover:bg-gray-900 text-white tracking-widest text-sm rounded-none">
            {added ? <><Check className="w-4 h-4 mr-2" /> Added!</> : <><ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart</>}
          </Button>

          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-red-500 mt-3 text-center">Only {product.stock} left in stock!</p>
          )}
        </div>
      </div>
    </div>
  );
}