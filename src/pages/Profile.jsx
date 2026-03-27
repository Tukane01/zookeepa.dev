import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Save, CheckCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { usersAPI } from "@/api/apiService";

export default function Profile() {
  const { user, logout } = useAuth();
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: ""
  });

  useEffect(() => {
    if (user) {
      const addr = typeof user.shipping_address === 'string' ? JSON.parse(user.shipping_address) : (user.shipping_address || {});
      setFormData(prev => ({
        ...prev,
        phone: user.phone || prev.phone,
        ...addr
      }));
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      phone: formData.phone,
      shipping_address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country
      }
    });
  };

  if (!user) return null;

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is not reversible.')) return;
    try {
      await usersAPI.deleteMyAccount();
      logout();
    } catch (error) {
      console.error('Delete account failed', error);
      alert('Unable to delete account. Please try again or contact support.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
      <div className="mb-6"> ructive" className="rounded-none" onClick={handleDeleteAccount}>
          <Trash2 className="w-4 h-4 mr-2" /> Delete My Account
        </Button>
      </div>
      <div className="space-y-6">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input value={user.full_name} disabled />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
            <div>
              <Label>Role</Label>
              <Input
                value={user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Customer'}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact & Shipping */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={updateProfileMutation.isPending || saved}
                className="bg-black hover:bg-gray-800 text-white"
              >
                {saved ? (
                  <> {/* I<CheckCircle className="w-4 h-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <> {/* Increased icon size */}
                    <Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}