import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Megaphone, Users, Camera, Calendar, Handshake, UserCircle, Briefcase, Settings } from "lucide-react";
import ProductManagement from "../components/superadmin/ProductManagement";
import GalleryManagement from "../components/superadmin/GalleryManagement";
import EventsManagement from "../components/superadmin/EventsManagement";
import TeamManagement from "../components/superadmin/TeamManagement";
import CareersManagement from "../components/superadmin/CareersManagement";
import PartnersManagement from "../components/superadmin/PartnersManagement";
import PromotionsManagement from "../components/superadmin/PromotionsManagement";
import SiteSettingsManagement from "../components/superadmin/SiteSettingsManagement";
import CustomersManagement from "../components/superadmin/CustomersManagement";

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

      <Tabs defaultValue="products">
        <div className="overflow-x-auto pb-1">
          <TabsList className="rounded-none bg-gray-100 mb-8 flex w-max min-w-full gap-0">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white whitespace-nowrap text-xs px-3 py-2"
              >
                <Icon className="w-3.5 h-3.5 mr-1.5" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="products"><ProductManagement /></TabsContent>
        <TabsContent value="gallery"><GalleryManagement /></TabsContent>
        <TabsContent value="events"><EventsManagement /></TabsContent>
        <TabsContent value="team"><TeamManagement /></TabsContent>
        <TabsContent value="careers"><CareersManagement /></TabsContent>
        <TabsContent value="partners"><PartnersManagement /></TabsContent>
        <TabsContent value="promotions"><PromotionsManagement /></TabsContent>
        <TabsContent value="site"><SiteSettingsManagement /></TabsContent>
        <TabsContent value="customers"><CustomersManagement /></TabsContent>
      </Tabs>
    </div>
  );
}