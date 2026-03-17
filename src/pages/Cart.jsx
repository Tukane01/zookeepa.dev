import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("zookeepacart") || "[]"));
    Promise.resolve({ role: 'user' }).then(setUser).catch(() => {});
  }, []);

  const save = (updated) => {
    setCart(updated);
    localStorage.setItem("zookeepacart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQty = (idx, qty) => {
    if (qty < 1) return remove(idx);
    const c = [...cart]; c[idx].quantity = qty; save(c);
  };

  const remove = (idx) => save(cart.filter((_, i) => i !== idx));

  const total = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);

  if (cart.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
      <h2 className="brand-font text-3xl font-semibold mb-2">Your Cart is Empty</h2>
      <p className="text-gray-500 mb-6">Discover our latest collection</p>
      <Link to={createPageUrl("Shop")}>
        <Button className="bg-black hover:bg-gray-900 text-white rounded-none px-8 tracking-wider">Shop Now</Button>
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="brand-font text-4xl font-semibold mb-8">Shopping Cart</h1>
      <div className="space-y-4 mb-8">
        {cart.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 py-4 border-b border-gray-100">
            <div className="w-20 h-24 bg-gray-100 flex-shrink-0">
              {item.image_url ? <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-6 h-6 text-gray-300 m-auto mt-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">{item.product_name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{item.size && `Size: ${item.size}`} {item.color && `· ${item.color}`}</p>
              <p className="text-sm font-semibold mt-1">R{item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center border border-gray-300">
              <button onClick={() => updateQty(idx, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50">−</button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button onClick={() => updateQty(idx, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50">+</button>
            </div>
            <p className="w-20 text-right font-semibold text-sm">R{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
            <button onClick={() => remove(idx)} className="text-gray-400 hover:text-red-500 transition-colors ml-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-none border border-gray-200">
        <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Subtotal</span><span>R{total.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm mb-4"><span className="text-gray-600">Shipping</span><span className="text-green-600">Free</span></div>
        <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-4"><span>Total</span><span>R{total.toFixed(2)}</span></div>
        <div className="mt-6">
          {user ? (
            <Link to={createPageUrl("Checkout")}>
              <Button className="w-full bg-black hover:bg-gray-900 text-white rounded-none h-12 tracking-wider text-sm">
                Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">You must sign in to checkout</p>
              <Button className="w-full bg-black hover:bg-gray-900 text-white rounded-none h-12 tracking-wider text-sm" onClick={() => window.location.href = '/login'}>
                Sign In to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}