import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { Package, ChevronDown, ChevronUp, ShoppingBag, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('token');
    fetch('/api/orders/my', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
           setOrders(data.map(o => ({
             ...o,
             items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
             shipping_address: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address
           })));
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  if (!user) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-gray-500 mb-4">Sign in to view your orders</p>
      <Button className="bg-black text-white rounded-none px-6" onClick={() => window.location.href = '/login'}>
        <LogIn className="w-4 h-4 mr-2" /> Sign In
      </Button> {/* Icon size w-4 h-4 is fine here as it's not a primary action button */}
    </div>
  );

  if (orders.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <Package className="w-16 h-16 text-gray-200 mb-4" />
      <h2 className="brand-font text-3xl font-semibold mb-2">No Orders Yet</h2>
      <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
      <Link to={createPageUrl("Shop")}>
        <Button className="bg-black text-white rounded-none px-8">
          <ShoppingBag className="w-5 h-5 mr-2" /> Shop Now
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="brand-font text-4xl font-semibold mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border border-gray-200">
            <button
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-4 text-left">
                <ShoppingBag className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Order #{order.order_number}</p>
                  <p className="text-xs text-gray-400">{order.created_date ? new Date(order.created_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || "bg-gray-100"}`}>
                  {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                </span>
                <span className="font-semibold text-sm">R{order.total_amount?.toFixed(2)}</span>
                {expanded === order.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>
            {expanded === order.id && (
              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                <div className="space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-12 h-14 bg-gray-200 flex-shrink-0">
                        {item.image_url && <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product_name}</p>
                        <p className="text-xs text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">R{(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                {order.shipping_address && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Shipping To</p>
                    <p className="text-sm text-gray-600">{order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.country}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}