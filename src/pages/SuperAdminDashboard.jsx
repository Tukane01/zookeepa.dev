import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Megaphone, Users, Camera, Calendar, Handshake, UserCircle, Briefcase, Settings } from "lucide-react";

const TABS = [
  { value: "products", label: "Products", icon: ShoppingBag },
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
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.resolve({ role: 'super_admin' }).then(u => {
      if (u.role !== "admin" && u.role !== "super_admin") {
        navigate(createPageUrl("Home")); return;
      }
      setUser(u);
    }).catch(() => window.location.href = '/login');
  }, []);

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

      {activeTab === "products" && (
          <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 mt-4">Product Management Coming Soon</div>
      )}
      {activeTab === "gallery" && (
          <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 mt-4">Gallery Management Coming Soon</div>
      )}
      {activeTab === "events" && (
          <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 mt-4">Events Management Coming Soon</div>
      )}
      {activeTab === "team" && (
          <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 mt-4">Team Management Coming Soon</div>
      )}
      {activeTab === "careers" && (
          <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 mt-4">Careers Management Coming Soon</div>
      )}
      {activeTab === "partners" && (
          <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 mt-4">Partners Management Coming Soon</div>
      )}
      {activeTab === "promotions" && (
          <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 mt-4">Promotions Management Coming Soon</div>
      )}
      {activeTab === "site" && (
          <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 mt-4">Site Settings Management Coming Soon</div>
      )}
      {activeTab === "customers" && (
          <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 mt-4">Customers Management Coming Soon</div>
      )}
    </div>
  );
}