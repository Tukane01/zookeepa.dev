import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Package, Megaphone, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORIES = ["tops", "bottoms", "dresses", "outerwear", "accessories", "shoes"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PROMO_TYPES = ["announcement", "competition", "sale", "new_arrival"];

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productDialog, setProductDialog] = useState(false);
  const [promoDialog, setPromoDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editPromo, setEditPromo] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const [pForm, setPForm] = useState({ name: "", description: "", price: "", sale_price: "", category: "tops", sizes: [], colors: "", image_url: "", stock: "", is_featured: false, is_active: true });
  const [promoForm, setPromoForm] = useState({ title: "", message: "", type: "announcement", is_active: true, background_color: "#D4AF37", text_color: "#1a1a1a", cta_text: "", sort_order: 0 });
  const [siteForm, setSiteForm] = useState({ hero_image_url: "", hero_title: "", hero_subtitle: "", hero_cta_text: "" });

  useEffect(() => {
    Promise.resolve({ role: 'admin' }).then(u => {
      if (u.role !== "admin") { navigate(createPageUrl("Shop")); return; }
      return Promise.all([
        Promise.resolve([]),
        Promise.resolve([]),
        Promise.resolve([])
      ]);
    }).then((res) => {
      if (!res) return;
      const [prods, promos, siteArr] = res;
      setProducts(prods);
      setPromotions(promos);
      if (siteArr?.length > 0) {
        setSettings(siteArr[0]);
        setSiteForm({ hero_image_url: siteArr[0].hero_image_url || "", hero_title: siteArr[0].hero_title || "", hero_subtitle: siteArr[0].hero_subtitle || "", hero_cta_text: siteArr[0].hero_cta_text || "" });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openNewProduct = () => {
    setEditProduct(null);
    setPForm({ name: "", description: "", price: "", sale_price: "", category: "tops", sizes: [], colors: "", image_url: "", stock: "", is_featured: false, is_active: true });
    setProductDialog(true);
  };

  const openEditProduct = (p) => {
    setEditProduct(p);
    setPForm({ name: p.name, description: p.description || "", price: p.price, sale_price: p.sale_price || "", category: p.category, sizes: p.sizes || [], colors: (p.colors || []).join(", "), image_url: p.image_url || "", stock: p.stock || "", is_featured: p.is_featured || false, is_active: p.is_active !== false });
    setProductDialog(true);
  };

  const saveProduct = async () => {
    setSaving(true);
    const data = { ...pForm, price: parseFloat(pForm.price), sale_price: pForm.sale_price ? parseFloat(pForm.sale_price) : null, stock: parseInt(pForm.stock) || 0, colors: pForm.colors.split(",").map(c => c.trim()).filter(Boolean) };
    if (editProduct) {
      setProducts(ps => ps.map(p => p.id === editProduct.id ? { ...p, ...data } : p));
    } else {
      setProducts(ps => [{ id: Date.now().toString(), ...data }, ...ps]);
    }
    setSaving(false);
    setProductDialog(false);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    setProducts(ps => ps.filter(p => p.id !== id));
  };

  const toggleProduct = async (product) => {
    setProducts(ps => ps.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
  };

  const openNewPromo = () => {
    setEditPromo(null);
    setPromoForm({ title: "", message: "", type: "announcement", is_active: true, background_color: "#D4AF37", text_color: "#1a1a1a", cta_text: "", sort_order: 0 });
    setPromoDialog(true);
  };

  const openEditPromo = (promo) => {
    setEditPromo(promo);
    setPromoForm({ title: promo.title, message: promo.message, type: promo.type || "announcement", is_active: promo.is_active !== false, background_color: promo.background_color || "#D4AF37", text_color: promo.text_color || "#1a1a1a", cta_text: promo.cta_text || "", sort_order: promo.sort_order || 0 });
    setPromoDialog(true);
  };

  const savePromo = async () => {
    setSaving(true);
    if (editPromo) {
      setPromotions(ps => ps.map(p => p.id === editPromo.id ? { ...p, ...promoForm } : p));
    } else {
      setPromotions(ps => [{ id: Date.now().toString(), ...promoForm }, ...ps]);
    }
    setSaving(false);
    setPromoDialog(false);
  };

  const deletePromo = async (id) => {
    if (!confirm("Delete this promotion?")) return;
    setPromotions(ps => ps.filter(p => p.id !== id));
  };

  const togglePromo = async (promo) => {
    setPromotions(ps => ps.map(p => p.id === promo.id ? { ...p, is_active: !p.is_active } : p));
  };

  const saveSiteSettings = async () => {
    setSaving(true);
    if (settings) {
      setSettings({ ...settings, ...siteForm });
    } else {
      setSettings({ key: "main", id: '1', ...siteForm });
    }
    setSaving(false);
    alert("Site settings saved!");
  };

  const toggleSize = (size) => {
    setPForm(f => ({ ...f, sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size] }));
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="brand-font text-4xl font-semibold">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">Manage products, promotions, and site settings</p>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="rounded-none bg-gray-100 mb-8">
          <TabsTrigger value="products" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white">
            <Package className="w-4 h-4 mr-2" /> Products ({products.length})
          </TabsTrigger>
          <TabsTrigger value="promotions" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white">
            <Megaphone className="w-4 h-4 mr-2" /> Promotions ({promotions.length})
          </TabsTrigger>
          <TabsTrigger value="site" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white">
            <Image className="w-4 h-4 mr-2" /> Site Settings
          </TabsTrigger>
        </TabsList>

        {/* PRODUCTS TAB */}
        <TabsContent value="products">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">All Products</h2>
            <Button onClick={openNewProduct} className="bg-black text-white rounded-none">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </div>
          <div className="border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{["Image", "Name", "Category", "Price", "Stock", "Active", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs tracking-wider uppercase text-gray-500 font-semibold">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><div className="w-10 h-12 bg-gray-100">{p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}</div></td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 capitalize text-gray-500">{p.category}</td>
                    <td className="px-4 py-3">
                      {p.sale_price ? <><span className="font-bold text-red-600">R{p.sale_price}</span> <span className="text-xs text-gray-400 line-through">R{p.price}</span></> : <span className="font-bold">R{p.price}</span>}
                    </td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleProduct(p)}>
                        {p.is_active !== false ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEditProduct(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-red-500" onClick={() => deleteProduct(p.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-gray-400">No products yet. Add your first product!</td></tr>}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* PROMOTIONS TAB */}
        <TabsContent value="promotions">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Promotions & Announcements</h2>
            <Button onClick={openNewPromo} className="bg-black text-white rounded-none">
              <Plus className="w-4 h-4 mr-2" /> Add Promotion
            </Button>
          </div>
          <div className="space-y-3">
            {promotions.map(promo => (
              <div key={promo.id} className="border border-gray-200 p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: promo.background_color || "#D4AF37" }}>
                    <Megaphone className="w-4 h-4" style={{ color: promo.text_color || "#1a1a1a" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{promo.title}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{promo.message}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{promo.type?.replace(/_/g, " ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => togglePromo(promo)}>
                    {promo.is_active !== false ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-400" />}
                  </button>
                  <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEditPromo(promo)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-red-500" onClick={() => deletePromo(promo.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))}
            {promotions.length === 0 && <p className="text-center py-10 text-gray-400">No promotions yet.</p>}
          </div>
        </TabsContent>

        {/* SITE SETTINGS TAB */}
        <TabsContent value="site">
          <div className="max-w-2xl">
            <h2 className="font-semibold text-lg mb-6">Hero / Homepage Settings</h2>
            <div className="space-y-5">
              <div>
                <Label className="text-xs tracking-wider uppercase">Hero Background Image URL</Label>
                <Input value={siteForm.hero_image_url} onChange={e => setSiteForm({ ...siteForm, hero_image_url: e.target.value })} className="rounded-none mt-1" placeholder="https://images.unsplash.com/…" />
                {siteForm.hero_image_url && <img src={siteForm.hero_image_url} alt="Hero preview" className="mt-2 w-full h-32 object-cover" />}
              </div>
              <div>
                <Label className="text-xs tracking-wider uppercase">Hero Title</Label>
                <Input value={siteForm.hero_title} onChange={e => setSiteForm({ ...siteForm, hero_title: e.target.value })} className="rounded-none mt-1" placeholder="Wear Your Wild Side" />
              </div>
              <div>
                <Label className="text-xs tracking-wider uppercase">Hero Subtitle</Label>
                <Textarea value={siteForm.hero_subtitle} onChange={e => setSiteForm({ ...siteForm, hero_subtitle: e.target.value })} className="rounded-none mt-1" rows={2} placeholder="Bold designs. Premium quality." />
              </div>
              <div>
                <Label className="text-xs tracking-wider uppercase">CTA Button Text</Label>
                <Input value={siteForm.hero_cta_text} onChange={e => setSiteForm({ ...siteForm, hero_cta_text: e.target.value })} className="rounded-none mt-1" placeholder="Explore Collection" />
              </div>
              <Button onClick={saveSiteSettings} disabled={saving} className="bg-black text-white rounded-none px-8">
                {saving ? "Saving…" : "Save Settings"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Product Dialog */}
      <Dialog open={productDialog} onOpenChange={setProductDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="brand-font text-2xl">{editProduct ? "Edit Product" : "Add New Product"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2">
              <Label className="text-xs uppercase tracking-wider">Product Name *</Label>
              <Input value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })} className="rounded-none mt-1" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs uppercase tracking-wider">Description</Label>
              <Textarea value={pForm.description} onChange={e => setPForm({ ...pForm, description: e.target.value })} className="rounded-none mt-1" rows={3} />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Price *</Label>
              <Input type="number" value={pForm.price} onChange={e => setPForm({ ...pForm, price: e.target.value })} className="rounded-none mt-1" placeholder="0.00" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Sale Price</Label>
              <Input type="number" value={pForm.sale_price} onChange={e => setPForm({ ...pForm, sale_price: e.target.value })} className="rounded-none mt-1" placeholder="Optional" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Category *</Label>
              <Select value={pForm.category} onValueChange={v => setPForm({ ...pForm, category: v })}>
                <SelectTrigger className="rounded-none mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Stock</Label>
              <Input type="number" value={pForm.stock} onChange={e => setPForm({ ...pForm, stock: e.target.value })} className="rounded-none mt-1" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs uppercase tracking-wider">Image URL</Label>
              <Input value={pForm.image_url} onChange={e => setPForm({ ...pForm, image_url: e.target.value })} className="rounded-none mt-1" placeholder="https://…" />
              {pForm.image_url && <img src={pForm.image_url} alt="Preview" className="mt-2 w-24 h-28 object-cover" />}
            </div>
            <div className="col-span-2">
              <Label className="text-xs uppercase tracking-wider">Colors (comma-separated)</Label>
              <Input value={pForm.colors} onChange={e => setPForm({ ...pForm, colors: e.target.value })} className="rounded-none mt-1" placeholder="Black, White, Red" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs uppercase tracking-wider mb-2 block">Sizes</Label>
              <div className="flex gap-2 flex-wrap">
                {SIZES.map(s => (
                  <button key={s} type="button" onClick={() => toggleSize(s)}
                    className={`w-12 h-10 text-sm border transition-all ${pForm.sizes.includes(s) ? "bg-black text-white border-black" : "border-gray-300 hover:border-gray-500"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={pForm.is_featured} onCheckedChange={v => setPForm({ ...pForm, is_featured: v })} />
              <Label className="text-sm">Featured Product</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={pForm.is_active} onCheckedChange={v => setPForm({ ...pForm, is_active: v })} />
              <Label className="text-sm">Active (visible in shop)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setProductDialog(false)}>Cancel</Button>
            <Button className="bg-black text-white rounded-none" onClick={saveProduct} disabled={saving || !pForm.name || !pForm.price}>
              {saving ? "Saving…" : editProduct ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promo Dialog */}
      <Dialog open={promoDialog} onOpenChange={setPromoDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="brand-font text-2xl">{editPromo ? "Edit Promotion" : "Add Promotion"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs uppercase tracking-wider">Title *</Label>
              <Input value={promoForm.title} onChange={e => setPromoForm({ ...promoForm, title: e.target.value })} className="rounded-none mt-1" placeholder="Summer Sale!" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Message *</Label>
              <Textarea value={promoForm.message} onChange={e => setPromoForm({ ...promoForm, message: e.target.value })} className="rounded-none mt-1" rows={2} placeholder="Get 20% off all dresses…" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs uppercase tracking-wider">Type</Label>
                <Select value={promoForm.type} onValueChange={v => setPromoForm({ ...promoForm, type: v })}>
                  <SelectTrigger className="rounded-none mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{PROMO_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">CTA Button Text</Label>
                <Input value={promoForm.cta_text} onChange={e => setPromoForm({ ...promoForm, cta_text: e.target.value })} className="rounded-none mt-1" placeholder="Shop Now" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <input type="color" value={promoForm.background_color} onChange={e => setPromoForm({ ...promoForm, background_color: e.target.value })} className="w-10 h-9 border border-gray-300 cursor-pointer" />
                  <Input value={promoForm.background_color} onChange={e => setPromoForm({ ...promoForm, background_color: e.target.value })} className="rounded-none flex-1" />
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <input type="color" value={promoForm.text_color} onChange={e => setPromoForm({ ...promoForm, text_color: e.target.value })} className="w-10 h-9 border border-gray-300 cursor-pointer" />
                  <Input value={promoForm.text_color} onChange={e => setPromoForm({ ...promoForm, text_color: e.target.value })} className="rounded-none flex-1" />
                </div>
              </div>
            </div>
            {/* Preview */}
            <div className="rounded-none p-3 text-center text-sm font-medium" style={{ backgroundColor: promoForm.background_color, color: promoForm.text_color }}>
              <strong>{promoForm.title}</strong> {promoForm.message}
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={promoForm.is_active} onCheckedChange={v => setPromoForm({ ...promoForm, is_active: v })} />
              <Label className="text-sm">Show on shop page</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setPromoDialog(false)}>Cancel</Button>
            <Button className="bg-black text-white rounded-none" onClick={savePromo} disabled={saving || !promoForm.title || !promoForm.message}>
              {saving ? "Saving…" : editPromo ? "Update" : "Add Promotion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}