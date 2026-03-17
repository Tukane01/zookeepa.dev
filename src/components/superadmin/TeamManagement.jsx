import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, User } from "lucide-react";

export default function TeamManagement() {
  const [items, setItems] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", bio: "", image_url: "", sort_order: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => setItems([]);

  const openNew = () => { setEditing(null); setForm({ name: "", role: "", bio: "", image_url: "", sort_order: items.length }); setDialog(true); };
  const openEdit = (item) => { setEditing(item); setForm({ name: item.name, role: item.role, bio: item.bio || "", image_url: item.image_url || "", sort_order: item.sort_order || 0 }); setDialog(true); };

  const save = async () => {
    setSaving(true);
    if (editing) { setItems(items.map(i => i.id === editing.id ? { ...i, ...form } : i)); }
    else { const c = { id: Date.now().toString(), ...form }; setItems([...items, c]); }
    setSaving(false); setDialog(false);
  };

  const del = async (id) => { if (!confirm("Remove this team member?")) return; setItems(items.filter(i => i.id !== id)); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Development Team ({items.length} members)</h2>
        <Button onClick={openNew} className="bg-black text-white rounded-none"><Plus className="w-4 h-4 mr-2" /> Add Member</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="border border-gray-200 p-4 flex gap-3 items-start">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-gray-300 m-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{item.name}</h3>
              <p className="text-xs text-yellow-600 mt-0.5">{item.role}</p>
              {item.bio && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.bio}</p>}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEdit(item)}><Pencil className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" className="w-7 h-7 hover:text-red-500" onClick={() => del(item.id)}><Trash2 className="w-3 h-3" /></Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-3 text-center py-10 text-gray-400">No team members yet.</p>}
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Member" : "Add Team Member"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs uppercase tracking-wider">Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-none mt-1" /></div>
              <div><Label className="text-xs uppercase tracking-wider">Role/Title *</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="rounded-none mt-1" placeholder="e.g. Head of Design" /></div>
            </div>
            <div><Label className="text-xs uppercase tracking-wider">Bio</Label><Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="rounded-none mt-1" rows={2} /></div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Photo URL</Label>
              <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="rounded-none mt-1" placeholder="https://..." />
              {form.image_url && <img src={form.image_url} alt="" className="mt-2 w-16 h-16 rounded-full object-cover" />}
            </div>
            <div><Label className="text-xs uppercase tracking-wider">Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="rounded-none mt-1 w-24" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setDialog(false)}>Cancel</Button>
            <Button className="bg-black text-white rounded-none" onClick={save} disabled={saving || !form.name || !form.role}>{saving ? "Saving…" : editing ? "Update" : "Add Member"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}