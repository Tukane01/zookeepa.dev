import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Calendar, MapPin } from "lucide-react";

export default function EventsManagement() {
  const [items, setItems] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", location: "", image_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => setItems([]);

  const openNew = () => { setEditing(null); setForm({ title: "", description: "", date: "", location: "", image_url: "" }); setDialog(true); };
  const openEdit = (item) => { setEditing(item); setForm({ title: item.title, description: item.description || "", date: item.date || "", location: item.location || "", image_url: item.image_url || "" }); setDialog(true); };

  const save = async () => {
    setSaving(true);
    if (editing) { setItems(items.map(i => i.id === editing.id ? { ...i, ...form } : i)); }
    else { const c = { id: Date.now().toString(), ...form }; setItems([c, ...items]); }
    setSaving(false); setDialog(false);
  };

  const del = async (id) => { if (!confirm("Delete this event?")) return; setItems(items.filter(i => i.id !== id)); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Events ({items.length})</h2>
        <Button onClick={openNew} className="bg-black text-white rounded-none"><Plus className="w-4 h-4 mr-2" /> Add Event</Button>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="border border-gray-200 p-4 flex items-start gap-4">
            {item.image_url && <img src={item.image_url} alt={item.title} className="w-20 h-16 object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{item.title}</h3>
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                {item.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(item.date).toLocaleDateString("en-ZA")}</span>}
                {item.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>}
              </div>
              {item.description && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description}</p>}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(item)}><Pencil className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-red-500" onClick={() => del(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center py-10 text-gray-400">No events yet.</p>}
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Event" : "Add Event"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs uppercase tracking-wider">Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="rounded-none mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs uppercase tracking-wider">Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="rounded-none mt-1" /></div>
              <div><Label className="text-xs uppercase tracking-wider">Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="rounded-none mt-1" placeholder="Venue, City" /></div>
            </div>
            <div><Label className="text-xs uppercase tracking-wider">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-none mt-1" rows={3} /></div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Image URL</Label>
              <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="rounded-none mt-1" placeholder="https://..." />
              {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-24 w-full object-cover" />}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setDialog(false)}>Cancel</Button>
            <Button className="bg-black text-white rounded-none" onClick={save} disabled={saving || !form.title}>{saving ? "Saving…" : editing ? "Update" : "Add Event"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}