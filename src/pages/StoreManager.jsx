import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Package, Search, Eye, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/lib/AuthContext";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200"
};

export default function StoreManager() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role !== "store_manager" && user.role !== "admin" && user.role !== "super_admin") {
      navigate(createPageUrl("Home")); 
      return;
    }
    
    const token = localStorage.getItem('token');
    fetch('/api/orders', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
           setOrders(data.map(o => ({
             ...o,
             items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
             shipping_address: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address
           })));
        }
      })
      .catch(err => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/orders/${orderId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ status }) });
      setOrders(o => o.map(x => x.id === orderId ? { ...x, status } : x));
      if (selectedOrder?.id === orderId) setSelectedOrder(o => ({ ...o, status }));
    } catch (err) { console.error("Failed to update status", err); }
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.order_number?.includes(search) || o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.customer_email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    delivered: orders.filter(o => o.status === "delivered").length
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="brand-font text-4xl font-semibold">Store Manager</h1>
        <p className="text-gray-500 text-sm mt-1">Manage orders and monitor inventory</p>
      </div>

      <div className="flex bg-gray-100 mb-8 p-1 rounded-md w-max">
        <button onClick={() => setActiveTab("orders")} className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${activeTab === "orders" ? 'bg-white shadow text-black font-medium' : 'text-gray-600 hover:text-gray-900'}`}>
          <Package className="w-5 h-5 mr-2" /> Orders
        </button>
        <button onClick={() => setActiveTab("stock")} className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${activeTab === "stock" ? 'bg-white shadow text-black font-medium' : 'text-gray-600 hover:text-gray-900'}`}>
          <BarChart3 className="w-5 h-5 mr-2" /> Stock & Pricing
        </button>
      </div>

      {activeTab === "orders" && (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Orders", value: stats.total, color: "bg-black text-white" },
              { label: "Pending", value: stats.pending, color: "bg-yellow-50 text-yellow-800 border border-yellow-200" },
              { label: "Processing", value: stats.processing, color: "bg-blue-50 text-blue-800 border border-blue-200" },
              { label: "Delivered", value: stats.delivered, color: "bg-green-50 text-green-800 border border-green-200" }
            ].map(s => (
              <div key={s.label} className={`p-4 ${s.color}`}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs tracking-wider uppercase mt-1 opacity-80">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order #, name or email…" className="pl-10 rounded-none" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 rounded-none"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {["pending", "processing", "shipped", "delivered", "cancelled"].map(s => (
                  <SelectItem key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{["Order #", "Customer", "Date", "Items", "Total", "Status", "View"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs tracking-wider uppercase text-gray-500 font-semibold">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{order.order_number}</td>
                    <td className="px-4 py-3"><p className="font-medium">{order.customer_name}</p><p className="text-xs text-gray-400">{order.customer_email}</p></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{order.created_date ? new Date(order.created_date).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-3 text-center">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold">R{order.total_amount?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <Select value={order.status} onValueChange={val => updateStatus(order.id, val)}>
                        <SelectTrigger className={`w-32 h-7 text-xs rounded-full border px-3 ${STATUS_COLORS[order.status]}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["pending", "processing", "shipped", "delivered", "cancelled"].map(s => (
                            <SelectItem key={s} value={s} className="text-xs capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-600" onClick={() => setSelectedOrder(order)}><Eye className="w-4 h-4" /></button>
                    </td> {/* Icon size w-4 h-4 is fine here as it's a small button */}
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-gray-400">No orders found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "stock" && (
        <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 mt-4">Stock Management Coming Soon</div>
      )}

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <DialogTitle className="brand-font text-2xl">Order #{selectedOrder.order_number}</DialogTitle>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${STATUS_COLORS[selectedOrder.status]}`}>
                  {selectedOrder.status ? selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) : 'Unknown'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Placed on {selectedOrder.created_date ? new Date(selectedOrder.created_date).toLocaleString("en-ZA", { dateStyle: "long", timeStyle: "short" }) : 'N/A'}</p>
            </DialogHeader>
            <div className="space-y-5 mt-2">
              <div className="bg-gray-50 p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Customer Details</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-gray-400">Full Name</p><p className="font-medium mt-0.5">{selectedOrder.customer_name || "—"}</p></div>
                  <div><p className="text-xs text-gray-400">Email</p><p className="font-medium mt-0.5 break-all">{selectedOrder.customer_email}</p></div>
                  <div><p className="text-xs text-gray-400">Phone</p><p className="font-medium mt-0.5">{selectedOrder.phone || "—"}</p></div>
                </div>
              </div>
              <div className="bg-gray-50 p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Shipping Address</p>
                {selectedOrder.shipping_address ? (
                  <div className="text-sm space-y-0.5">
                    <p className="font-medium">{selectedOrder.shipping_address.street || "—"}</p>
                    <p className="text-gray-600">{[selectedOrder.shipping_address.city, selectedOrder.shipping_address.state, selectedOrder.shipping_address.zip_code].filter(Boolean).join(", ")}</p>
                    <p className="text-gray-600">{selectedOrder.shipping_address.country || ""}</p>
                  </div>
                ) : <p className="text-sm text-gray-400">No address provided</p>}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Items Ordered ({selectedOrder.items?.length || 0})</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center border border-gray-100 p-3">
                      <div className="w-14 h-16 bg-gray-100 flex-shrink-0">{item.image_url ? <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" /> : null}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.product_name}</p>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                          {item.size && <span>Size: <strong>{item.size}</strong></span>}
                          {item.color && <span>Color: <strong>{item.color}</strong></span>}
                          <span>Qty: <strong>{item.quantity}</strong></span>
                          <span>Unit: <strong>R{item.price?.toFixed(2)}</strong></span>
                        </div>
                      </div>
                      <p className="font-bold text-sm">R{(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t-2 border-black pt-4 flex justify-between items-center">
                <span className="font-bold text-lg">Order Total</span>
                <span className="font-bold text-2xl">R{selectedOrder.total_amount?.toFixed(2)}</span>
              </div>
              {selectedOrder.notes && (
                <div className="bg-yellow-50 border border-yellow-200 p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Customer Notes</p>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Update Order Status</p>
                <Select value={selectedOrder.status} onValueChange={val => updateStatus(selectedOrder.id, val)}>
                  <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                  <SelectContent>{["pending", "processing", "shipped", "delivered", "cancelled"].map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}