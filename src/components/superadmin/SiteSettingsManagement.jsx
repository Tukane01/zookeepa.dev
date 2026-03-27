import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Image, MapPin, Phone, Save } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function SiteSettingsManagement() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({
    hero_title: "", hero_subtitle: "", hero_cta_text: "",
    hero_image_id: null, hero_images: [],
    contact_address: "", contact_city: "", contact_province: "", contact_zip: "",
    contact_country: "South Africa", contact_phone: "", contact_email: "", contact_hours: "",
    map_lat: -26.2041, map_lng: 28.0473
  });
  const [newImageUrl, setNewImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const response = await fetch('/api/site-settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data && data.length > 0) {
        const s = data[0];
        setSettings(s);
        let parsedHeroImages = [];
        try {
          parsedHeroImages = typeof s.hero_images === 'string' ? JSON.parse(s.hero_images) : (s.hero_images || []);
        } catch(e) {}
        setForm({
          hero_title: s.hero_title || "",
          hero_subtitle: s.hero_subtitle || "",
          hero_cta_text: s.hero_cta_text || "",
          hero_image_id: s.hero_image_id || null,
          hero_images: parsedHeroImages,
          contact_address: s.contact_address || "",
          contact_city: s.contact_city || "",
          contact_province: s.contact_province || "",
          contact_zip: s.contact_zip || "",
          contact_country: s.contact_country || "South Africa",
          contact_phone: s.contact_phone || "",
          contact_email: s.contact_email || "",
          contact_hours: s.contact_hours || "",
          map_lat: s.map_lat || -26.2041,
          map_lng: s.map_lng || 28.0473
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const method = settings && settings.id ? 'PUT' : 'POST';
      const url = settings && settings.id ? `/api/site-settings/${settings.id}` : '/api/site-settings';

      const payload = { ...form };
      if (Array.isArray(payload.hero_images)) {
        payload.hero_images = JSON.stringify(payload.hero_images);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || errData?.message || 'Save failed');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await load(); // Reload to get updated data
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const addSlide = () => {
    if (!newImageUrl.trim()) return;
    setForm(f => ({ ...f, hero_images: [...f.hero_images, newImageUrl.trim()] }));
    setNewImageUrl("");
  };

  const removeSlide = (idx) => setForm(f => ({ ...f, hero_images: f.hero_images.filter((_, i) => i !== idx) }));

  return (
    <div className="max-w-3xl">
      <Tabs defaultValue="hero">
        <TabsList className="rounded-none bg-gray-100 mb-6">
          <TabsTrigger value="hero" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white"><Image className="w-4 h-4 mr-2" /> Hero / Slideshow</TabsTrigger>
          <TabsTrigger value="contact" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white"><MapPin className="w-4 h-4 mr-2" /> Contact Details</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Hero Text</h3>
            <div className="space-y-3">
              <div><Label className="text-xs uppercase tracking-wider">Main Title</Label><Input value={form.hero_title} onChange={e => setForm({ ...form, hero_title: e.target.value })} className="rounded-none mt-1" placeholder="ZOOKEEPA" /></div>
              <div><Label className="text-xs uppercase tracking-wider">Subtitle</Label><Textarea value={form.hero_subtitle} onChange={e => setForm({ ...form, hero_subtitle: e.target.value })} className="rounded-none mt-1" rows={2} placeholder="More than clothing — a movement." /></div>
              <div><Label className="text-xs uppercase tracking-wider">CTA Button Text</Label><Input value={form.hero_cta_text} onChange={e => setForm({ ...form, hero_cta_text: e.target.value })} className="rounded-none mt-1" placeholder="Shop Now" /></div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Hero Background Image</h3>
            <ImageUpload
              onImageUploaded={(imageData) => {
                if (imageData) {
                  setForm({ ...form, hero_image_id: imageData.id });
                } else {
                  setForm({ ...form, hero_image_id: null });
                }
              }}
              currentImageId={form.hero_image_id}
              altText="Hero background"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-3">Slideshow Images</h3>
            <p className="text-xs text-gray-500 mb-3">Add multiple images to create a hero slideshow. They will auto-advance every 5 seconds.</p>
            <div className="flex gap-2 mb-4">
              <Input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} className="rounded-none flex-1" placeholder="https://image-url.com/photo.jpg" onKeyDown={e => e.key === "Enter" && addSlide()} />
              <Button onClick={addSlide} className="bg-black text-white rounded-none"><Plus className="w-4 h-4 mr-1" /> Add</Button>
            </div>
            <div className="space-y-2">
              {form.hero_images.map((url, i) => (
                <div key={i} className="flex items-center gap-3 border border-gray-200 p-2">
                  <img src={url} alt="" className="w-20 h-12 object-cover" />
                  <span className="flex-1 text-xs text-gray-600 truncate">{url}</span>
                  <button onClick={() => removeSlide(i)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <h3 className="font-semibold mb-1 flex items-center gap-2"><MapPin className="w-4 h-4" /> Physical Address</h3>
          <div><Label className="text-xs uppercase tracking-wider">Street Address</Label><Input value={form.contact_address} onChange={e => setForm({ ...form, contact_address: e.target.value })} className="rounded-none mt-1" placeholder="14 Fox Street, Maboneng Precinct" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs uppercase tracking-wider">City</Label><Input value={form.contact_city} onChange={e => setForm({ ...form, contact_city: e.target.value })} className="rounded-none mt-1" placeholder="Johannesburg" /></div>
            <div><Label className="text-xs uppercase tracking-wider">Province</Label><Input value={form.contact_province} onChange={e => setForm({ ...form, contact_province: e.target.value })} className="rounded-none mt-1" placeholder="Gauteng" /></div>
            <div><Label className="text-xs uppercase tracking-wider">Zip Code</Label><Input value={form.contact_zip} onChange={e => setForm({ ...form, contact_zip: e.target.value })} className="rounded-none mt-1" placeholder="2094" /></div>
            <div><Label className="text-xs uppercase tracking-wider">Country</Label><Input value={form.contact_country} onChange={e => setForm({ ...form, contact_country: e.target.value })} className="rounded-none mt-1" /></div>
          </div>

          <h3 className="font-semibold pt-2 flex items-center gap-2"><Phone className="w-4 h-4" /> Contact Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs uppercase tracking-wider">Phone</Label><Input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} className="rounded-none mt-1" placeholder="+27 11 555 0100" /></div>
            <div><Label className="text-xs uppercase tracking-wider">Email</Label><Input value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} className="rounded-none mt-1" placeholder="hello@zookeepa.com" /></div>
          </div>
          <div><Label className="text-xs uppercase tracking-wider">Store Hours</Label><Textarea value={form.contact_hours} onChange={e => setForm({ ...form, contact_hours: e.target.value })} className="rounded-none mt-1" rows={3} placeholder="Mon – Fri: 9:00 – 18:00&#10;Saturday: 9:00 – 16:00&#10;Sunday: 10:00 – 14:00" /></div>

          <h3 className="font-semibold pt-2">Map Pin Coordinates</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs uppercase tracking-wider">Latitude</Label><Input type="number" step="any" value={form.map_lat} onChange={e => setForm({ ...form, map_lat: parseFloat(e.target.value) || -26.2041 })} className="rounded-none mt-1" /></div>
            <div><Label className="text-xs uppercase tracking-wider">Longitude</Label><Input type="number" step="any" value={form.map_lng} onChange={e => setForm({ ...form, map_lng: parseFloat(e.target.value) || 28.0473 })} className="rounded-none mt-1" /></div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex items-center gap-4">
        <Button onClick={save} disabled={saving} className="bg-black text-white rounded-none px-8">
          {saving ? "Saving…" : <><Save className="w-4 h-4 mr-2" /> Save All Settings</>}
        </Button>
        {saved && <span className="text-green-600 text-sm font-medium">✓ Saved!</span>}
      </div>
    </div>
  );
}