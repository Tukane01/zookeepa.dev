import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Handshake } from "lucide-react";

export default function PartnersManagement() {
  const [items, setItems] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", logo_url: "", website_url: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => setItems([]);

  const openNew = () => { setEditing(null); setForm({ name: "", logo_url: "", website_url: "", description: "" }); setDialog(true); };
  const openEdit = (item) => { setEditing(item); setForm({ name: item.name, logo_url: item.logo_url || "", website_url: item.website_url || "", description: item.description || "" }); setDialog(true); };

  const save = async () => {
    setSaving(true);
    if (editing) { setItems(items.map(i => i.id === editing.id ? { ...i, ...form } : i)); }
    else { const c = { id: Date.now().toString(), ...form }; setItems([...items, c]); }
    setSaving(false); setDialog(false);
  };

  const del = async (id) => { if (!confirm("Remove this partner?")) return; setItems(items.filter(i => i.id !== id)); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Partners ({items.length})</h2>
        <Button onClick={openNew} className="bg-black text-white rounded-none"><Plus className="w-4 h-4 mr-2" /> Add Partner</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="border border-gray-200 p-4 flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0 rounded">
              {item.logo_url ? <img src={item.logo_url} alt={item.name} className="w-full h-full object-contain" /> : <Handshake className="w-6 h-6 text-gray-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{item.name}</h3>
              {item.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>}
              {item.website_url && <a href={item.website_url} target="_blank" rel="noreferrer" className="text-xs text-yellow-600 hover:underline">{item.website_url}</a>}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEdit(item)}><Pencil className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" className="w-7 h-7 hover:text-red-500" onClick={() => del(item.id)}><Trash2 className="w-3 h-3" /></Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-3 text-center py-10 text-gray-400">No partners yet.</p>}
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Partner" : "Add Partner"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update partner information and logo." : "Add a new partner with their logo and website."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs uppercase tracking-wider">Partner Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-none mt-1" /></div>
            <div><Label className="text-xs uppercase tracking-wider">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-none mt-1" rows={2} /></div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Logo URL</Label>
              <Input value={form.logo_url} onChange={e => setForm({ ...form, logo_url: e.target.value })} className="rounded-none mt-1" placeholder="https://..." />
              {form.logo_url && <img src={form.logo_url} alt="" className="mt-2 h-12 object-contain" />}
            </div>
            <div><Label className="text-xs uppercase tracking-wider">Website URL</Label><Input value={form.website_url} onChange={e => setForm({ ...form, website_url: e.target.value })} className="rounded-none mt-1" placeholder="https://..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setDialog(false)}>Cancel</Button>
            <Button className="bg-black text-white rounded-none" onClick={save} disabled={saving || !form.name}>{saving ? "Saving…" : editing ? "Update" : "Add Partner"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}