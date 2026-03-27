import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Megaphone, Users, Camera, Calendar, Handshake, UserCircle, Briefcase, Settings, Package, Eye } from "lucide-react";

// Import all management components
import ProductManagement from "@/components/superadmin/ProductManagement";
import GalleryManagement from "@/components/superadmin/GalleryManagement";
import EventsManagement from "@/components/superadmin/EventsManagement";
import TeamManagement from "@/components/superadmin/TeamManagement";
import CareersManagement from "@/components/superadmin/CareersManagement";
import PartnersManagement from "@/components/superadmin/PartnersManagement";
import PromotionsManagement from "@/components/superadmin/PromotionsManagement";
import SiteSettingsManagement from "@/components/superadmin/SiteSettingsManagement";
import UserManagement from "@/components/superadmin/UserManagement";
import { useAuth } from "@/lib/AuthContext";

const TABS = [
  { value: "products", label: "Products", icon: ShoppingBag },
  { value: "orders", label: "Orders", icon: Package },
  { value: "gallery", label: "Gallery", icon: Camera },
  { value: "events", label: "Events", icon: Calendar },
  { value: "team", label: "Team", icon: UserCircle },
  { value: "careers", label: "Careers", icon: Briefcase },
  { value: "partners", label: "Partners", icon: Handshake },
  { value: "promotions", label: "Promotions", icon: Megaphone },
  { value: "site", label: "Site Settings", icon: Settings },
  { value: "customers", label: "Customers", icon: Users },
];

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin" && user.role !== "super_admin") {
      navigate(createPageUrl("Home"));
    }
  }, [user, navigate]);

  if (!user) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="brand-font text-4xl font-semibold">Super Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Full control over all ZooKeepa content, media, and users</p>
      </div>

      <div className="overflow-x-auto pb-1 mb-8">
        <div className="bg-gray-100 flex w-max min-w-full gap-1 p-1 rounded-md">
          {TABS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`flex items-center whitespace-nowrap text-xs px-3 py-2 rounded-md transition-colors ${activeTab === value ? 'bg-white shadow text-black font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Icon className="w-3.5 h-3.5 mr-1.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "products" && <ProductManagement />}
      {activeTab === "orders" && <OrderManagement />}
      {activeTab === "gallery" && <GalleryManagement />}
      {activeTab === "events" && <EventsManagement />}
      {activeTab === "team" && <TeamManagement />}
      {activeTab === "careers" && <CareersManagement />}
      {activeTab === "partners" && <PartnersManagement />}
      {activeTab === "promotions" && <PromotionsManagement />}
      {activeTab === "site" && <SiteSettingsManagement />}
      {activeTab === "customers" && <UserManagement />}
    </div>
  );
}

// Simple Order Management Component
function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        loadOrders(); // Reload orders
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Order Management</h2>
        <div className="text-sm text-gray-500">
          {orders.length} total orders
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">#{order.id}</td>
                  <td className="px-4 py-3 text-sm">{order.customer_email}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">R{order.total_amount}</td>
                  <td className="px-4 py-3 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => {/* Open order details modal */}}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1 inline" /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}