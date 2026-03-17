import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function GalleryManagement() {
  const [items, setItems] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ image_url: "", caption: "", category: "", sort_order: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => setItems([]);

  const openNew = () => { setEditing(null); setForm({ image_url: "", caption: "", category: "", sort_order: items.length }); setDialog(true); };
  const openEdit = (item) => { setEditing(item); setForm({ image_url: item.image_url, caption: item.caption || "", category: item.category || "", sort_order: item.sort_order || 0 }); setDialog(true); };

  const save = async () => {
    setSaving(true);
    if (editing) { setItems(items.map(i => i.id === editing.id ? { ...i, ...form } : i)); }
    else { const c = { id: Date.now().toString(), ...form }; setItems([...items, c]); }
    setSaving(false); setDialog(false);
  };

  const del = async (id) => { if (!confirm("Delete this image?")) return; setItems(items.filter(i => i.id !== id)); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Gallery ({items.length} images)</h2>
        <Button onClick={openNew} className="bg-black text-white rounded-none"><Plus className="w-4 h-4 mr-2" /> Add Image</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {items.map(item => (
          <div key={item.id} className="relative group">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img src={item.image_url} alt={item.caption} className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-gray-600 mt-1 truncate">{item.caption || "No caption"}</p>
            <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
              <button onClick={() => openEdit(item)} className="w-6 h-6 bg-white rounded-full shadow flex items-center justify-center"><Pencil className="w-3 h-3" /></button>
              <button onClick={() => del(item.id)} className="w-6 h-6 bg-white rounded-full shadow flex items-center justify-center text-red-500"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-6 text-center py-10 text-gray-400">No gallery images yet.</p>}
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Image" : "Add Gallery Image"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs uppercase tracking-wider">Image URL *</Label>
              <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="rounded-none mt-1" placeholder="https://..." />
              {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-32 w-full object-cover" />}
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Caption</Label>
              <Input value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} className="rounded-none mt-1" placeholder="Photo caption..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs uppercase tracking-wider">Category</Label>
                <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="rounded-none mt-1" placeholder="e.g. Events" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="rounded-none mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setDialog(false)}>Cancel</Button>
            <Button className="bg-black text-white rounded-none" onClick={save} disabled={saving || !form.image_url}>{saving ? "Saving…" : editing ? "Update" : "Add Image"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}