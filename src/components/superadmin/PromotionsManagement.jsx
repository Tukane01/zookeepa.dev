import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Megaphone } from "lucide-react";

const PROMO_TYPES = ["announcement", "competition", "sale", "new_arrival"];

export default function PromotionsManagement() {
  const [items, setItems] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", message: "", type: "announcement", is_active: true, background_color: "#D4AF37", text_color: "#1a1a1a", cta_text: "", sort_order: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => setItems(await base44.entities.Promotion.list("-created_date", 50));

  const openNew = () => { setEditing(null); setForm({ title: "", message: "", type: "announcement", is_active: true, background_color: "#D4AF37", text_color: "#1a1a1a", cta_text: "", sort_order: 0 }); setDialog(true); };
  const openEdit = (p) => { setEditing(p); setForm({ title: p.title, message: p.message, type: p.type || "announcement", is_active: p.is_active !== false, background_color: p.background_color || "#D4AF37", text_color: p.text_color || "#1a1a1a", cta_text: p.cta_text || "", sort_order: p.sort_order || 0 }); setDialog(true); };

  const save = async () => {
    setSaving(true);
    if (editing) { await base44.entities.Promotion.update(editing.id, form); setItems(items.map(i => i.id === editing.id ? { ...i, ...form } : i)); }
    else { const c = await base44.entities.Promotion.create(form); setItems([c, ...items]); }
    setSaving(false); setDialog(false);
  };

  const toggle = async (p) => { await base44.entities.Promotion.update(p.id, { is_active: !p.is_active }); setItems(items.map(i => i.id === p.id ? { ...i, is_active: !i.is_active } : i)); };
  const del = async (id) => { if (!confirm("Delete this promotion?")) return; await base44.entities.Promotion.delete(id); setItems(items.filter(i => i.id !== id)); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Promotions & Announcements ({items.length})</h2>
        <Button onClick={openNew} className="bg-black text-white rounded-none"><Plus className="w-4 h-4 mr-2" /> Add Promotion</Button>
      </div>

      <div className="space-y-3">
        {items.map(p => (
          <div key={p.id} className="border border-gray-200 p-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: p.background_color || "#D4AF37" }}>
                <Megaphone className="w-4 h-4" style={{ color: p.text_color || "#1a1a1a" }} />
              </div>
              <div>
                <p className="font-semibold text-sm">{p.title}</p>
                <p className="text-gray-500 text-sm mt-0.5">{p.message}</p>
                <p className="text-xs text-gray-400 mt-1 capitalize">{p.type?.replace(/_/g, " ")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => toggle(p)}>{p.is_active !== false ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-400" />}</button>
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-red-500" onClick={() => del(p.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center py-10 text-gray-400">No promotions yet.</p>}
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Promotion" : "Add Promotion"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label className="text-xs uppercase tracking-wider">Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="rounded-none mt-1" /></div>
            <div><Label className="text-xs uppercase tracking-wider">Message *</Label><Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="rounded-none mt-1" rows={2} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs uppercase tracking-wider">Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger className="rounded-none mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{PROMO_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs uppercase tracking-wider">CTA Button Text</Label><Input value={form.cta_text} onChange={e => setForm({ ...form, cta_text: e.target.value })} className="rounded-none mt-1" placeholder="Shop Now" /></div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Background Color</Label>
                <div className="flex gap-2 mt-1"><input type="color" value={form.background_color} onChange={e => setForm({ ...form, background_color: e.target.value })} className="w-10 h-9 border border-gray-300 cursor-pointer" /><Input value={form.background_color} onChange={e => setForm({ ...form, background_color: e.target.value })} className="rounded-none flex-1" /></div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Text Color</Label>
                <div className="flex gap-2 mt-1"><input type="color" value={form.text_color} onChange={e => setForm({ ...form, text_color: e.target.value })} className="w-10 h-9 border border-gray-300 cursor-pointer" /><Input value={form.text_color} onChange={e => setForm({ ...form, text_color: e.target.value })} className="rounded-none flex-1" /></div>
              </div>
            </div>
            <div className="rounded-none p-3 text-center text-sm font-medium" style={{ backgroundColor: form.background_color, color: form.text_color }}><strong>{form.title || "Preview Title"}</strong> {form.message || "Preview message..."}</div>
            <div className="flex items-center gap-3"><Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} /><Label className="text-sm">Show on shop page</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setDialog(false)}>Cancel</Button>
            <Button className="bg-black text-white rounded-none" onClick={save} disabled={saving || !form.title || !form.message}>{saving ? "Saving…" : editing ? "Update" : "Add Promotion"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}