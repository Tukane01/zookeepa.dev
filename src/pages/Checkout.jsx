import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

export default function Checkout() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ street: "", city: "", state: "", zip_code: "", country: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (user.shipping_address) {
       const addr = typeof user.shipping_address === 'string' ? JSON.parse(user.shipping_address) : user.shipping_address;
       setForm(f => ({ ...f, ...addr, phone: user.phone || "" }));
    }
    setCart(JSON.parse(localStorage.getItem("zookeepacart") || "[]"));
  }, [user]);

  const total = cart.reduce((s, i) => s + parseFloat(i.price || 0) * (i.quantity || 1), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    const orderNum = "ZK-" + Date.now().toString().slice(-6);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          order_number: orderNum,
          customer_email: user.email,
          customer_name: user.full_name,
          items: cart,
          total_amount: total,
          shipping_address: { street: form.street, city: form.city, state: form.state, zip_code: form.zip_code, country: form.country },
          phone: form.phone
        })
      });
      if (res.ok) {
        localStorage.removeItem("zookeepacart");
        window.dispatchEvent(new Event("cartUpdated"));
        setOrderNumber(orderNum);
        setSuccess(true);
      } else throw new Error("Checkout failed");
    } catch (err) { alert('Failed to place order'); } finally { setLoading(false); }
  };

  if (success) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="brand-font text-4xl font-semibold mb-2">Order Placed!</h2> {/* Icon size is fine here */}
      <p className="text-gray-500 mb-1">Order #{orderNumber}</p>
      <p className="text-gray-500 mb-8">Thank you! We'll send updates to {user?.email}</p>
      <div className="flex gap-3">
        <Button variant="outline" className="rounded-none px-6" onClick={() => navigate(createPageUrl("Shop"))}>
          <ShoppingBag className="w-5 h-5 mr-2" /> Continue Shopping
        </Button>
        <Button className="bg-black text-white rounded-none px-6" onClick={() => navigate(createPageUrl("MyOrders"))}>
          <Package className="w-5 h-5 mr-2" /> View Orders
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="brand-font text-4xl font-semibold mb-10">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-lg font-semibold tracking-wider uppercase">Shipping Information</h2>
          <div>
            <Label className="text-xs tracking-wider uppercase">Street Address</Label>
            <Input value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required className="rounded-none mt-1" placeholder="123 Main St" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs tracking-wider uppercase">City</Label>
              <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required className="rounded-none mt-1" />
            </div>
            <div>
              <Label className="text-xs tracking-wider uppercase">State</Label>
              <Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="rounded-none mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs tracking-wider uppercase">ZIP Code</Label>
              <Input value={form.zip_code} onChange={e => setForm({ ...form, zip_code: e.target.value })} required className="rounded-none mt-1" />
            </div>
            <div>
              <Label className="text-xs tracking-wider uppercase">Country</Label>
              <Input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} required className="rounded-none mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs tracking-wider uppercase">Phone</Label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="rounded-none mt-1" placeholder="+1 (555) 000-0000" />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-none tracking-wider text-sm mt-4">
            {loading ? "Placing Order…" : <><Check className="w-4 h-4 mr-2" /> Place Order · R${total.toFixed(2)}</>}
          </Button> {/* Icon size w-4 h-4 is fine here as it's a small button */}
        </form>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 h-fit">
          <h2 className="text-sm tracking-wider uppercase font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {cart.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-12 h-14 bg-gray-200 flex-shrink-0">
                  {item.image_url && <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product_name}</p>
                  <p className="text-xs text-gray-400">{item.size} · x{item.quantity}</p>
                </div>
                <p className="text-sm font-medium">R{(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between font-bold"><span>Total</span><span>R{total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}