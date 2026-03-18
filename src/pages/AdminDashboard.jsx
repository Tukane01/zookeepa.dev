import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/lib/AuthContext";

export default function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['all-orders'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return Array.isArray(data) ? data.map(o => ({
         ...o,
         items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
         shipping_address: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address
      })) : [];
    },
    initialData: [],
    enabled: !!user && (user.role === 'admin' || user.role === 'super_admin'),
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      setSelectedOrder(null);
    },
  });

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      revenue: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
    };
  };

  const stats = getStats();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Order Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold">R{stats.revenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2 bg-gray-100 p-1 rounded-md w-max">
        {[
          { id: "all", label: "All Orders" },
          { id: "pending", label: "Pending" },
          { id: "processing", label: "Processing" },
          { id: "shipped", label: "Shipped" },
          { id: "delivered", label: "Delivered" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${statusFilter === tab.id ? 'bg-white shadow text-black font-medium' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedOrder(order)}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{order.order_number}</h3>
                  <p className="text-sm text-gray-500">
                    {order.created_date ? format(new Date(order.created_date), 'MMMM d, yyyy • h:mm a') : 'N/A'}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                </Badge>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-gray-600">{order.customer_email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Items</p>
                  <p className="font-medium">{order.items?.length || 0} items</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="text-xl font-bold">R{order.total_amount?.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="py-20 text-center">
              <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">No orders found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Order #{selectedOrder.order_number}</h2>
            <p className="mb-6 text-gray-600">Order details management coming soon.</p>
            <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}