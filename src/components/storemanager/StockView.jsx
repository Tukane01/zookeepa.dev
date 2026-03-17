import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingBag, ToggleLeft, ToggleRight } from "lucide-react";

const CATEGORY_LABELS = { tops: "Tops", bottoms: "Bottoms", dresses: "Dresses", outerwear: "Outerwear", accessories: "Accessories", shoes: "Shoes" };

export default function StockView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    base44.entities.Product.list("-created_date", 200).then(setProducts).finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  const totalValue = filtered.reduce((s, p) => s + ((p.sale_price || p.price || 0) * (p.stock || 0)), 0);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="pl-10 rounded-none" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="border border-gray-300 rounded-none px-3 py-2 text-sm">
          <option value="all">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="mb-4 flex gap-4 text-sm">
        <span className="text-gray-500">{filtered.length} products</span>
        <span className="text-gray-500">Total Stock Value: <strong className="text-black">R{totalValue.toFixed(2)}</strong></span>
      </div>

      <div className="border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{["Image", "Product", "Category", "Price", "Sale Price", "Stock", "Status"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs tracking-wider uppercase text-gray-500 font-semibold">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(p => {
              const stockStatus = p.stock === 0 ? "out" : p.stock <= 5 ? "low" : "ok";
              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="w-10 h-12 bg-gray-100 flex-shrink-0">
                      {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-4 h-4 text-gray-300 m-3" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 capitalize text-gray-500">{CATEGORY_LABELS[p.category] || p.category}</td>
                  <td className="px-4 py-3 font-semibold">R{p.price?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {p.sale_price ? <span className="text-red-600 font-semibold">R{p.sale_price.toFixed(2)}</span> : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold text-base ${stockStatus === "out" ? "text-red-600" : stockStatus === "low" ? "text-orange-500" : "text-green-600"}`}>
                      {p.stock ?? 0}
                    </span>
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${stockStatus === "out" ? "bg-red-100 text-red-700" : stockStatus === "low" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                      {stockStatus === "out" ? "Out" : stockStatus === "low" ? "Low" : "OK"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.is_active !== false ? <span className="text-xs text-green-600 font-medium">Active</span> : <span className="text-xs text-gray-400">Inactive</span>}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-gray-400">No products found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}